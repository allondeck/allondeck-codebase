import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useContactRequests } from "../../hooks/useContactRequests";

export default function OwnerContact() {
  const { requests, loading, error, refetch } = useContactRequests();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Delete this contact message?")) return;
    await supabase.from("contact_requests").delete().eq("id", id);
    void refetch();
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#066175]/35 border-t-[#e38622]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-950/40 border border-red-900/55 p-4 text-red-400">
        Failed to load contact requests: {error.message}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-[#f6ebd4]">Contact messages</h2>
      <p className="mt-1 text-sm text-[#76abbf]">
        Messages submitted via the Contact form (footer).
      </p>

      {requests.length === 0 ? (
        <div className="mt-8 rounded-xl border-2 border-dashed border-[#066175]/35 bg-[#052631] p-12 text-center">
          <p className="text-[#76abbf]">No contact messages yet.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {requests.map((r) => (
            <div
              key={r.id}
              className="rounded-xl border border-[#066175]/35 bg-[#052631] shadow-sm overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}
                className="flex w-full flex-wrap items-center justify-between gap-3 p-4 text-left hover:bg-[#066175]/20"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-white">{r.name}</p>
                  <p className="text-sm text-[#76abbf]">{r.email}</p>
                  {expandedId !== r.id && (
                    <p className="mt-1 line-clamp-1 text-sm text-[#76abbf]">
                      {r.message}
                    </p>
                  )}
                </div>
                <span className="text-xs text-[#76abbf]">
                  {new Date(r.created_at).toLocaleString()}
                </span>
                <svg
                  className={`h-5 w-5 shrink-0 text-[#76abbf] transition-transform ${
                    expandedId === r.id ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {expandedId === r.id && (
                <div className="border-t border-[#066175]/35 bg-[#066175]/10 p-4">
                  <p className="whitespace-pre-wrap text-sm text-white">
                    {r.message}
                  </p>
                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleDelete(r.id)}
                      className="text-sm text-red-400 hover:text-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

