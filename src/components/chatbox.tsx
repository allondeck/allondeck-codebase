import { useState, useRef, useEffect } from "react";
import { useChat, type UIMessage } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";

// ─── localStorage helpers (12-hour TTL) ──────────────────────────────────────
const STORAGE_KEY = "chatbox_messages";
const TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

interface StoredChat {
  messages: UIMessage[];
  savedAt: number;
}

function loadMessages(): UIMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: StoredChat = JSON.parse(raw) as StoredChat;
    if (Date.now() - parsed.savedAt > TTL_MS) {
      localStorage.removeItem(STORAGE_KEY);
      return [];
    }
    return parsed.messages;
  } catch {
    return [];
  }
}

function saveMessages(messages: UIMessage[]) {
  try {
    const data: StoredChat = { messages, savedAt: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // quota exceeded or SSR — ignore
  }
}

// ─── Suggested prompts ───────────────────────────────────────────────────────
const SUGGESTED_PROMPTS = [
  "What products do you sell?",
  "How do I track my order?",
  "Do you offer any discounts?",
  "What's your return policy?",
];

// ─── Simple Markdown Link Parser ─────────────────────────────────────────────
function FormattedMessage({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    const label = match[1];
    const url = match[2];

    if (url.startsWith("http")) {
      parts.push(
        <a
          key={match.index}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-[#e38622] font-semibold text-brand-cream"
        >
          {label}
        </a>,
      );
    } else {
      parts.push(
        <Link
          key={match.index}
          to={url}
          className="underline underline-offset-2 hover:text-[#e38622] font-semibold text-brand-cream"
        >
          {label}
        </Link>,
      );
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return <>{parts.length > 0 ? parts : text}</>;
}

// ─── Component ───────────────────────────────────────────────────────────────
export function Chatbox() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, setMessages, sendMessage, status, error, stop } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    messages: loadMessages(),
  });

  const isLoading = status === "submitted" || status === "streaming";

  // Persist messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      saveMessages(messages);
    }
  }, [messages]);

  // Auto-scroll to the bottom on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, isOpen]);

  const [isConfirmingReset, setIsConfirmingReset] = useState(false);

  const confirmResetChat = () => {
    stop();
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
    setIsConfirmingReset(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    sendMessage({ text: trimmed });
    setInput("");
  };

  const handleChip = (prompt: string) => {
    if (isLoading) return;
    sendMessage({ text: prompt });
  };

  const getMessageText = (m: UIMessage): string =>
    m.parts
      .filter((p) => p.type === "text")
      .map((p) => (p as { type: "text"; text: string }).text)
      .join("");

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {/* Floating toggle button */}
        <button
          onClick={() => setIsOpen((o) => !o)}
          aria-label={isOpen ? "Close chat" : "Open chat assistant"}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e38622] text-white shadow-xl transition-all duration-200 hover:scale-105 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-[#e38622] focus:ring-offset-2"
        >
          <AnimatePresence mode="wait" initial={false}>
            {isOpen ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0, scale: 0.7 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.18 }}
              >
                {/* X icon */}
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </motion.span>
            ) : (
              <motion.span
                key="chat"
                initial={{ rotate: 90, opacity: 0, scale: 0.7 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: -90, opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.18 }}
              >
                {/* Chat bubble icon */}
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed bottom-24 right-6 z-50 flex w-[350px] flex-col overflow-hidden rounded-2xl border border-[#066175]/35 bg-[#044155] text-white shadow-2xl"
            style={{ height: "500px" }}
            role="dialog"
            aria-label="AI Chat Assistant"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-[#066175]/35 bg-[#044155] px-4 py-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#066175]/40 text-brand-cream">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#f6ebd4]">
                  Deck Assistant
                </p>
                <p className="text-xs text-brand-light/80">Powered by Gemini</p>
              </div>
              <div className="ml-auto flex items-center gap-3">
                <div
                  className="h-2 w-2 rounded-full bg-green-400"
                  aria-label="Online"
                />
                <button
                  onClick={() => setIsConfirmingReset(true)}
                  title="Clear conversation"
                  aria-label="Clear conversation"
                  className="flex h-6 w-6 items-center justify-center rounded-md text-brand-light/60 transition-colors hover:bg-red-500/10 hover:text-red-400"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close chat window"
                  aria-label="Close chat window"
                  className="flex h-6 w-6 items-center justify-center rounded-md text-brand-light/60 transition-colors hover:bg-[#066175]/30 hover:text-white"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Custom Reset Confirmation */}
            <AnimatePresence>
              {isConfirmingReset && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden bg-red-950/20 border-b border-red-900/30"
                >
                  <div className="flex flex-col gap-3 p-4 text-sm text-red-200">
                    <p className="font-medium text-center">
                      Are you sure you want to clear this conversation and start
                      over?
                    </p>
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => setIsConfirmingReset(false)}
                        className="rounded-lg bg-red-900/40 px-4 py-2 font-medium text-red-100 hover:bg-red-800/60"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={confirmResetChat}
                        className="rounded-lg bg-red-700 px-4 py-2 font-medium text-white shadow-sm transition-colors hover:bg-red-800"
                      >
                        Yes, clear it
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <div className="flex flex-col gap-4">
                  {/* Welcome message */}
                  <div className="flex gap-2">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#066175] text-white">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2"
                        />
                      </svg>
                    </div>
                    <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-[#053242] px-3 py-2 text-sm text-brand-cream font-sans">
                      Hi! 👋 I'm your store assistant. How can I help you today?
                    </div>
                  </div>

                  {/* Suggested chips */}
                  <div className="flex flex-wrap gap-2 pl-9">
                    {SUGGESTED_PROMPTS.map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => handleChip(prompt)}
                        disabled={isLoading}
                        className="rounded-full border border-[#76abbf]/40 px-3 py-1 text-xs text-brand-light transition-colors hover:border-[#e38622] hover:bg-[#e38622] hover:text-white disabled:opacity-50 font-sans"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((m) => {
                  const text = getMessageText(m);
                  const isUser = m.role === "user";
                  return (
                    <div
                      key={m.id}
                      className={`flex gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                    >
                      {!isUser && (
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#066175] text-white">
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2"
                            />
                          </svg>
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm font-sans ${
                          isUser
                            ? "rounded-tr-sm bg-[#e38622] text-white"
                            : "rounded-tl-sm bg-[#053242] text-brand-cream"
                        }`}
                      >
                        {text ? (
                          <FormattedMessage text={text} />
                        ) : (
                          <span className="opacity-50 italic">...</span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex gap-2">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#066175] text-white">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2"
                      />
                    </svg>
                  </div>
                  <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm bg-[#053242] px-3 py-2 text-sm text-brand-light/75 font-sans">
                    <svg
                      className="h-4 w-4 animate-spin text-brand-light/60"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    Thinking…
                  </div>
                </div>
              )}

              {/* Error indicator */}
              {error && (
                <div className="flex gap-2">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-950 text-red-400">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="flex flex-col gap-1 rounded-2xl rounded-tl-sm bg-red-950/20 px-3 py-2 text-sm text-red-200">
                    <p className="font-medium">Sorry, an error occurred.</p>
                    <p className="text-xs opacity-75">
                      {error.message || "Could not connect to the API."}
                    </p>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input form */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 border-t border-[#066175]/35 bg-[#032e3b] px-3 py-3"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything…"
                disabled={isLoading}
                className="flex-1 rounded-full border border-[#066175]/50 bg-[#044155] text-white px-4 py-2 text-sm placeholder-brand-light/50 focus:border-[#e38622] focus:outline-none focus:ring-1 focus:ring-[#e38622] disabled:opacity-60 font-sans"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                aria-label="Send message"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e38622] text-white transition-all hover:bg-orange-600 disabled:opacity-40"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
