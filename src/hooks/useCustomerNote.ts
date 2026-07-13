import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function useCustomerNote(customerKey: string | undefined) {
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(!!customerKey);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!customerKey) {
      setNote("");
      setLoading(false);
      return;
    }
    const key = customerKey;
    let mounted = true;

    async function fetchNote() {
      const { data, error: err } = await supabase
        .from("customer_notes")
        .select("note")
        .eq("customer_key", key)
        .maybeSingle();

      if (!mounted) return;
      if (err) {
        setError(new Error(err.message));
        setLoading(false);
        return;
      }
      const row = data as { note: string } | null;
      setNote(row?.note ?? "");
      setError(null);
      setLoading(false);
    }

    setLoading(true);
    void fetchNote();
    return () => {
      mounted = false;
    };
  }, [customerKey]);

  const saveNote = async (newNote: string) => {
    if (!customerKey) return;
    setSaving(true);
    const { error: err } = await supabase.from("customer_notes").upsert(
      {
        customer_key: customerKey!,
        note: newNote ?? "",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "customer_key" },
    );

    if (err) {
      setError(new Error(err.message));
      setSaving(false);
      return;
    }
    setNote(newNote ?? "");
    setError(null);
    setSaving(false);
  };

  return { note, setNote, loading, saving, error, saveNote };
}
