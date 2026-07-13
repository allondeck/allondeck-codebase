import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { ContactRequestRow } from "../types/database";

export function useContactRequests() {
  const [requests, setRequests] = useState<ContactRequestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    const { data, error: err } = await supabase
      .from("contact_requests")
      .select("*")
      .order("created_at", { ascending: false });
    setError(err ? new Error(err.message) : null);
    setRequests((data ?? []) as ContactRequestRow[]);
  }, []);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    refetch().then(() => {
      if (mounted) setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, [refetch]);

  return { requests, loading, error, refetch };
}
