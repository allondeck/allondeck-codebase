// Supabase Edge Function: send an email to the store owner when someone logs in
// with the test owner account (owner@example.com). Call with POST and the
// user's JWT in Authorization header (sent automatically by supabase.functions.invoke).
// Env: RESEND_API_KEY, NOTIFY_OWNER_EMAIL (your email). Optional: NOTIFY_FROM_EMAIL.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const TEST_OWNER_EMAIL = "owner@example.com";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return new Response(JSON.stringify({ error: "Invalid or expired session" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (user.email?.toLowerCase() !== TEST_OWNER_EMAIL.toLowerCase()) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  const notifyTo = Deno.env.get("NOTIFY_OWNER_EMAIL");

  if (!resendApiKey || !notifyTo) {
    return new Response(
      JSON.stringify({
        error:
          "Server not configured for notifications (RESEND_API_KEY, NOTIFY_OWNER_EMAIL)",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  const fromEmail =
    Deno.env.get("NOTIFY_FROM_EMAIL") || "onboarding@resend.dev";
  const ts = new Date().toISOString();

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${resendApiKey}`,
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [notifyTo],
      subject: `Test owner login – ${ts}`,
      html: `
        <p>Someone just signed in with the <strong>test owner</strong> account.</p>
        <ul>
          <li>Email: ${TEST_OWNER_EMAIL}</li>
          <li>Time: ${ts}</li>
        </ul>
        <p>This was triggered by the “Login with test owner” button on your store’s login page.</p>
      `.trim(),
    }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    return new Response(
      JSON.stringify({ error: (data as { message?: string }).message || "Failed to send email" }),
      {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
