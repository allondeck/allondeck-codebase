interface GuestEmailSectionProps {
  guestEmail: string;
  onChange: (email: string) => void;
}

export function GuestEmailSection({ guestEmail, onChange }: GuestEmailSectionProps) {
  return (
    <div className="mb-6 rounded-lg border border-brand-medium/35 bg-brand-dark-alt p-6">
      <label
        htmlFor="guestEmail"
        className="block text-sm font-medium text-brand-cream"
      >
        Email <span className="text-red-500">*</span>
      </label>
      <input
        id="guestEmail"
        type="email"
        required
        value={guestEmail}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-brand-medium/50 bg-brand-dark px-3 py-2 text-white placeholder-brand-light/50 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
        placeholder="you@example.com"
      />
    </div>
  );
}
