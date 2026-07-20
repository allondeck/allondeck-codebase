import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { GoogleIcon } from "../../components/ui/GoogleIcon";
import { useAuth } from "../../context/AuthContext";
import {
  validatePassword,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REQUIREMENTS,
  type PasswordRequirement,
} from "../../lib/passwordValidation";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  async function handleGoogleSignUp() {
    setError(null);
    setLoading(true);
    const { error: err } = await signInWithGoogle("/account");
    setLoading(false);
    if (err) setError(err.message);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const validation = validatePassword(password);
    if (!validation.valid) {
      setError(validation.message ?? "Password does not meet requirements.");
      return;
    }
    setLoading(true);
    const { error: err } = await signUp(email, password, fullName || undefined);
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    navigate("/account");
  }

  const passwordValidation = validatePassword(password);
  const requirementMet = (key: PasswordRequirement) =>
    !passwordValidation.errors.includes(key);

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6 text-left">
      <h1 className="text-2xl font-bold text-white">Create account</h1>
      <p className="mt-1 text-brand-cream">
        Create an account to track orders and manage your profile.
      </p>
      <div className="mt-6 space-y-4">
        {error && (
          <div className="rounded-lg bg-red-900/50 p-3 text-sm text-red-200 border border-red-500/30">
            {error}
          </div>
        )}
        <Button
          type="button"
          variant="secondary"
          disabled={loading}
          onClick={handleGoogleSignUp}
          className="w-full py-3 flex items-center justify-center gap-2 border border-brand-medium/50 bg-brand-dark-alt text-brand-cream hover:bg-brand-medium/30 hover:scale-105 active:scale-95 transition-all duration-200"
        >
          <GoogleIcon className="h-5 w-5" />
          Continue with Google
        </Button>
        <div className="relative">
          <div
            className="absolute inset-0 flex items-center"
            aria-hidden="true"
          >
            <div className="w-full border-t border-brand-medium/35" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-brand-dark px-2 text-brand-light">or</span>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-brand-cream"
          >
            Full name
          </label>
          <input
            id="fullName"
            type="text"
            autoComplete="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-brand-medium/50 bg-brand-dark-alt px-3 py-2 text-white placeholder-brand-light/50 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-brand-cream"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-brand-medium/50 bg-brand-dark-alt px-3 py-2 text-white placeholder-brand-light/50 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-brand-cream"
          >
            Password
          </label>
          <div className="relative mt-1">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              minLength={PASSWORD_MIN_LENGTH}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-brand-medium/50 bg-brand-dark-alt py-2 pl-3 pr-10 text-white placeholder-brand-light/50 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-brand-light hover:bg-brand-medium/30 hover:text-white focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-0"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 9c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
          <ul
            className="mt-2 space-y-1 text-xs text-brand-light"
            aria-live="polite"
          >
            {PASSWORD_REQUIREMENTS.map(({ key, label }) => (
              <li
                key={key}
                className={requirementMet(key) ? "text-emerald-400 font-medium" : "text-brand-light/60"}
              >
                {requirementMet(key) ? "✓ " : "○ "}
                {label}
              </li>
            ))}
          </ul>
        </div>
        <Button type="submit" disabled={loading} className="w-full py-3">
          {loading ? "Creating account..." : "Create account with email"}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-brand-light">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-brand-orange hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
