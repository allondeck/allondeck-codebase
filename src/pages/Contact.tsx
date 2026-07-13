import { useState } from "react";
import { supabase } from "../lib/supabase";
import type { ContactRequestInsert } from "../types/database";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const payload: ContactRequestInsert = {
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    };
    const { error: err } = await supabase
      .from("contact_requests")
      .insert(payload);
    setSubmitting(false);
    if (err) {
      setError(err.message);
      return;
    }
    setSent(true);
    setName("");
    setEmail("");
    setMessage("");
  }

  return (
    <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-8 sm:px-6 lg:px-8 w-full space-y-8 text-left">
      <div>
        <h1 className="text-2xl font-bold text-white">Contact us</h1>
        <p className="mt-1 text-[#f6ebd4]">
          Send us a message and we&apos;ll get back to you as soon as we can.
        </p>
      </div>

      {sent ? (
        <div className="rounded-xl border border-emerald-500/20 bg-[#052631] p-6 text-center">
          <p className="font-medium text-emerald-400">Message sent</p>
          <p className="mt-1 text-sm text-[#f6ebd4]">
            Thanks for reaching out. We&apos;ll be in touch.
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-xl border border-[#066175]/35 bg-[#052631] p-6"
        >
          {error && (
            <div className="rounded-lg bg-red-900/50 p-3 text-sm text-red-200 border border-red-500/30">
              {error}
            </div>
          )}
          <div>
            <label
              htmlFor="contact-name"
              className="block text-sm font-medium text-[#f6ebd4]"
            >
              Name
            </label>
            <input
              id="contact-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#066175]/50 bg-[#044155] px-3 py-2 text-white focus:border-[#e38622] focus:outline-none focus:ring-1 focus:ring-[#e38622]"
            />
          </div>
          <div>
            <label
              htmlFor="contact-email"
              className="block text-sm font-medium text-[#f6ebd4]"
            >
              Email
            </label>
            <input
              id="contact-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#066175]/50 bg-[#044155] px-3 py-2 text-white focus:border-[#e38622] focus:outline-none focus:ring-1 focus:ring-[#e38622]"
            />
          </div>
          <div>
            <label
              htmlFor="contact-message"
              className="block text-sm font-medium text-[#f6ebd4]"
            >
              Message
            </label>
            <textarea
              id="contact-message"
              rows={5}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#066175]/50 bg-[#044155] px-3 py-2 text-white focus:border-[#e38622] focus:outline-none focus:ring-1 focus:ring-[#e38622]"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-[#e38622] px-4 py-3 font-medium text-white hover:bg-orange-600 transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-70 sm:w-auto"
          >
            {submitting ? "Sending…" : "Send message"}
          </button>
        </form>
      )}
    </div>
  );
}
