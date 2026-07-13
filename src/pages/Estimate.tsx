import { useState } from "react";
import { Link } from "react-router-dom";

export default function Estimate() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    zipCode: "",
    boatModel: "",
    feet: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
          Fill out the form below to get started. Our specialized design team will contact you shortly to review your project specs.
        </p>
      </div>

      {/* WAVE DIVIDER */}
      <div className="my-12 mx-auto max-w-[1400px] px-6 lg:px-12 opacity-30">
        <img src="/assets/svg/recurso olas, 1 ola.svg" alt="" className="w-full object-contain filter invert dark:invert-0" />
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
                Thanks, <span className="font-bold text-white">{formData.name}</span>! Our crew is calculating your estimate for the <span className="font-bold text-white">{formData.boatModel}</span>. We'll reach out to <span className="font-bold text-white">{formData.email}</span> shortly.
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
              
              <div>
                <label htmlFor="est-name" className="block text-xs font-bold uppercase tracking-wider text-brand-cream/80 font-sans">Name</label>
                <input
                  id="est-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-brand-medium bg-[#033343] text-white px-4 py-3 text-sm focus:border-brand-orange focus:outline-none font-sans"
                  placeholder="Ernesto Alvarez"
                />
              </div>

              <div>
                <label htmlFor="est-email" className="block text-xs font-bold uppercase tracking-wider text-brand-cream/80 font-sans">Email</label>
                <input
                  id="est-email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-brand-medium bg-[#033343] text-white px-4 py-3 text-sm focus:border-brand-orange focus:outline-none font-sans"
                  placeholder="ernesto@example.com"
                />
              </div>

              <div>
                <label htmlFor="est-phone" className="block text-xs font-bold uppercase tracking-wider text-brand-cream/80 font-sans">Phone</label>
                <input
                  id="est-phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-brand-medium bg-[#033343] text-white px-4 py-3 text-sm focus:border-brand-orange focus:outline-none font-sans"
                  placeholder="305-555-0199"
                />
              </div>

              <div className="grid gap-6 grid-cols-2">
                <div>
                  <label htmlFor="est-zip" className="block text-xs font-bold uppercase tracking-wider text-brand-cream/80 font-sans">Código Postal</label>
                  <input
                    id="est-zip"
                    type="text"
                    required
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-brand-medium bg-[#033343] text-white px-4 py-3 text-sm focus:border-brand-orange focus:outline-none font-sans"
                    placeholder="33101"
                  />
                </div>
                <div>
                  <label htmlFor="est-feet" className="block text-xs font-bold uppercase tracking-wider text-brand-cream/80 font-sans">Feet (Length)</label>
                  <input
                    id="est-feet"
                    type="number"
                    required
                    value={formData.feet}
                    onChange={(e) => setFormData({ ...formData, feet: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-brand-medium bg-[#033343] text-white px-4 py-3 text-sm focus:border-brand-orange focus:outline-none font-sans"
                    placeholder="24"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="est-model" className="block text-xs font-bold uppercase tracking-wider text-brand-cream/80 font-sans">Boat Model</label>
                <input
                  id="est-model"
                  type="text"
                  required
                  value={formData.boatModel}
                  onChange={(e) => setFormData({ ...formData, boatModel: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-brand-medium bg-[#033343] text-white px-4 py-3 text-sm focus:border-brand-orange focus:outline-none font-sans"
                  placeholder="Boston Whaler Outrage 230"
                />
              </div>

              <div className="text-center pt-4">
                <button
                  type="submit"
                  className="w-full rounded-full bg-brand-orange py-4 text-sm font-bold uppercase tracking-wider text-white transition-transform hover:scale-[1.02] shadow-lg shadow-brand-orange/30 font-sans"
                >
                  Get estimate
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
