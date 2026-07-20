import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import type { ContactRequestInsert } from "../../types/database";
import { Icon } from "../../components/ui/Icon";

/** Formats a raw digit string into (123) 123-1234 as the user types */
function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits.length ? `(${digits}` : "";
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export default function Estimate() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    zipCode: "",
    boatModel: "",
    feet: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    // Build a human-readable notes string from the optional boat fields
    const noteParts: string[] = [];
    if (formData.phone) noteParts.push(`Phone: ${formData.phone}`);
    if (formData.zipCode) noteParts.push(`Zip: ${formData.zipCode}`);
    if (formData.boatModel) noteParts.push(`Boat model: ${formData.boatModel}`);
    if (formData.feet) noteParts.push(`Length: ${formData.feet} ft`);

    const payload: ContactRequestInsert = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim() || null,
      subject: "Free estimate request",
      message: formData.message.trim() || (noteParts.length > 0
        ? noteParts.join(" | ")
        : "Estimate requested — no boat details provided."),
      notes: noteParts.length > 0 ? noteParts.join("\n") : null,
    };

    const { error: err } = await supabase.from("contact_requests").insert(payload);
    setSubmitting(false);
    if (err) {
      setError(err.message);
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="bg-white dark:bg-brand-dark text-gray-900 dark:text-brand-cream font-sans py-12">
      {/* HEADER SECTION */}
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12 text-center">
        <span className="text-sm font-semibold uppercase tracking-widest text-brand-orange">
          Renewing your boat's deck has never been EASIER!
        </span>
        <h1 className="mt-4 font-heading text-4xl font-black tracking-wider text-brand-dark dark:text-brand-cream sm:text-5xl lg:text-6xl">
          FREE ESTIMATE
        </h1>
        <div className="mx-auto mt-4 h-1.5 w-16 bg-brand-orange" />
        <p className="mx-auto mt-6 max-w-2xl text-base md:text-lg leading-relaxed text-gray-600 dark:text-gray-300">
          Fill out the form below to get started. Our specialized design team
          will contact you shortly to review your project specs.
        </p>
      </div>

      {/* WAVE DIVIDER */}
      <div className="my-12 mx-auto max-w-[1400px] px-6 lg:px-12 opacity-30">
        <Icon name="wave" width={380} height={29} className="w-full" />
      </div>

      {/* FORM CONTAINER */}
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="rounded-3xl bg-brand-dark p-6 md:p-10 shadow-xl text-white">
          {submitted ? (
            <div className="text-center py-8">
              <span className="text-4xl text-brand-orange">✓</span>
              <h2 className="mt-4 font-heading text-2xl font-black tracking-wider text-brand-cream">
                REQUEST RECEIVED
              </h2>
              <p className="mt-2 text-sm text-brand-cream/80 leading-relaxed">
                Thanks,{" "}
                <span className="font-bold text-white">{formData.name}</span>!
                Our crew will reach out to{" "}
                <span className="font-bold text-white">{formData.email}</span>{" "}
                shortly.
              </p>
              <div className="mt-8">
                <Link
                  to="/"
                  className="inline-block rounded-full bg-brand-orange px-8 py-3 text-xs font-bold uppercase tracking-wider text-white transition-transform hover:scale-105 shadow-md shadow-brand-orange/30"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-center font-heading text-lg font-bold tracking-widest text-brand-cream uppercase">
                GET A FREE QUOTE
              </h2>

              {error && (
                <div className="rounded-lg bg-red-900/50 p-3 text-sm text-red-200 border border-red-500/30">
                  {error}
                </div>
              )}

              {/* Name */}
              <div>
                <label
                  htmlFor="est-name"
                  className="block text-xs font-bold uppercase tracking-wider text-brand-cream/80 font-sans"
                >
                  Name
                </label>
                <input
                  id="est-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-brand-medium bg-[#033343] text-white px-4 py-3 text-sm focus:border-brand-orange focus:outline-none font-sans"
                  placeholder="Your full name"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="est-email"
                  className="block text-xs font-bold uppercase tracking-wider text-brand-cream/80 font-sans"
                >
                  Email
                </label>
                <input
                  id="est-email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-brand-medium bg-[#033343] text-white px-4 py-3 text-sm focus:border-brand-orange focus:outline-none font-sans"
                  placeholder="you@example.com"
                />
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="est-phone"
                  className="block text-xs font-bold uppercase tracking-wider text-brand-cream/80 font-sans"
                >
                  Phone{" "}
                  <span className="normal-case font-normal text-brand-cream/50">(optional)</span>
                </label>
                <input
                  id="est-phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: formatPhone(e.target.value) })}
                  className="mt-2 w-full rounded-xl border border-brand-medium bg-[#033343] text-white px-4 py-3 text-sm focus:border-brand-orange focus:outline-none font-sans"
                  placeholder="(555) 555-0100"
                />
              </div>

              {/* Zip + Boat Length */}
              <div className="grid gap-6 grid-cols-2">
                <div>
                  <label
                    htmlFor="est-zip"
                    className="block text-xs font-bold uppercase tracking-wider text-brand-cream/80 font-sans"
                  >
                    Zip Code{" "}
                    <span className="normal-case font-normal text-brand-cream/50">(optional)</span>
                  </label>
                  <input
                    id="est-zip"
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-brand-medium bg-[#033343] text-white px-4 py-3 text-sm focus:border-brand-orange focus:outline-none font-sans"
                    placeholder="e.g. 90210"
                  />
                </div>
                <div>
                  <label
                    htmlFor="est-feet"
                    className="block text-xs font-bold uppercase tracking-wider text-brand-cream/80 font-sans"
                  >
                    Boat Length (ft){" "}
                    <span className="normal-case font-normal text-brand-cream/50">(optional)</span>
                  </label>
                  <input
                    id="est-feet"
                    type="number"
                    value={formData.feet}
                    onChange={(e) => setFormData({ ...formData, feet: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-brand-medium bg-[#033343] text-white px-4 py-3 text-sm focus:border-brand-orange focus:outline-none font-sans"
                    placeholder="24"
                  />
                </div>
              </div>

              {/* Boat Model */}
              <div>
                <label
                  htmlFor="est-model"
                  className="block text-xs font-bold uppercase tracking-wider text-brand-cream/80 font-sans"
                >
                  Boat Model{" "}
                  <span className="normal-case font-normal text-brand-cream/50">(optional)</span>
                </label>
                <input
                  id="est-model"
                  type="text"
                  value={formData.boatModel}
                  onChange={(e) => setFormData({ ...formData, boatModel: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-brand-medium bg-[#033343] text-white px-4 py-3 text-sm focus:border-brand-orange focus:outline-none font-sans"
                  placeholder="e.g. Sea Ray 240 Sundeck"
                />
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="est-message"
                  className="block text-xs font-bold uppercase tracking-wider text-brand-cream/80 font-sans"
                >
                  Message
                </label>
                <textarea
                  id="est-message"
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-brand-medium bg-[#033343] text-white px-4 py-3 text-sm focus:border-brand-orange focus:outline-none font-sans resize-none"
                  placeholder="Any additional details, questions, or special requests…"
                />
              </div>

              <div className="text-center pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-full bg-brand-orange py-4 text-sm font-bold uppercase tracking-wider text-white transition-transform hover:scale-[1.02] shadow-lg shadow-brand-orange/30 font-sans disabled:opacity-70"
                >
                  {submitting ? "Sending…" : "Get estimate"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
