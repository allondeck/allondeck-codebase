import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

// Define the expected structure of our database record
interface ContactRequest {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
  notes?: string | null;
  created_at: string;
}

// Define the Webhook Payload coming from Supabase Database Webhooks
interface WebhookPayload {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  record: ContactRequest;
  schema: string;
}

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const OWNER_EMAIL = Deno.env.get("OWNER_EMAIL_ADDRESS") ?? "leandroalfonso14@gmail.com";

serve(async (req) => {
  try {
    // Basic verification that this is a POST request
    if (req.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    if (!RESEND_API_KEY) {
      console.error("Missing RESEND_API_KEY environment variable.");
      return new Response("Server configuration error", { status: 500 });
    }

    const payload: WebhookPayload = await req.json();

    // We only want to send an email on INSERT
    if (payload.type !== "INSERT" || !payload.record) {
      return new Response(JSON.stringify({ message: "Ignored, not an INSERT event" }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    }

    const record = payload.record;

    // Create the HTML email content
    const htmlContent = `
      <h2>New Contact Request</h2>
      <p>You have received a new message from your website.</p>
      <hr />
      <p><strong>Name:</strong> ${record.name}</p>
      <p><strong>Email:</strong> ${record.email}</p>
      <p><strong>Phone:</strong> ${record.phone || "Not provided"}</p>
      <p><strong>Subject:</strong> ${record.subject || "Contact form submission"}</p>
      <br />
      <p><strong>Message:</strong></p>
      <p style="white-space: pre-wrap;">${record.message}</p>
      
      ${
        record.notes
          ? `<br /><p><strong>Additional Details:</strong></p>
             <p style="white-space: pre-wrap; background-color: #f4f4f4; padding: 12px; border-radius: 4px;">${record.notes}</p>`
          : ""
      }
    `;

    // Resend requires a 'from' address. When testing, you can use onboarding@resend.dev
    // If you verify a custom domain in Resend later (e.g., updates@allondeck.com), you should change this.
    const fromAddress = "Acme <onboarding@resend.dev>"; 

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: fromAddress,
        to: OWNER_EMAIL,
        subject: `New Lead: ${record.name} - ${record.subject || "Contact form"}`,
        html: htmlContent,
      }),
    });

    if (!resendRes.ok) {
      const errorText = await resendRes.text();
      console.error("Resend API error:", errorText);
      return new Response(JSON.stringify({ error: "Failed to send email", details: errorText }), {
        headers: { "Content-Type": "application/json" },
        status: 500,
      });
    }

    const data = await resendRes.json();
    console.log("Email sent successfully:", data);

    return new Response(JSON.stringify({ message: "Email sent successfully", data }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Unexpected error handling webhook:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});
