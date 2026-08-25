import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { GoogleIcon } from "../../components/ui/GoogleIcon";
import { SEO } from "../../components/ui/SEO";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "/account";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: err } = await signIn(email, password);
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    navigate(redirectTo);
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6 text-left">
      <SEO
        title="Sign In | All On Deck"
        description="Sign in to your All On Deck account to manage your profile and view orders."
      />
      <h1 className="text-2xl font-bold text-white">Sign in</h1>
      <p className="mt-1 text-brand-cream">
        Sign in to your account to view orders and manage your profile.
      </p>
      <div className="mt-6 space-y-4">
        {error && (
          <div className="rounded-lg bg-red-900/50 p-3 text-sm text-red-200 border border-red-500/30">
            {error}
          </div>
        )}
        {/* Disabled Google Login Wrapper with Hover Tooltip */}
        <div className="relative group w-full cursor-not-allowed">
          {/* Tooltip Popup */}
          <div className="absolute -top-11 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-200 pointer-events-none z-30 whitespace-nowrap">
            <div className="relative bg-brand-orange text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-xl shadow-brand-orange/20 border border-orange-400/40 flex items-center gap-1.5">
              <span>🚀</span> Coming soon
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-brand-orange rotate-45" />
            </div>
          </div>

          <Button
            type="button"
            variant="secondary"
            disabled
            className="w-full py-3 flex items-center justify-center gap-2 border border-brand-medium/50 bg-brand-dark-alt/50 text-brand-cream/50 pointer-events-none opacity-60 min-h-[44px]"
          >
            <GoogleIcon className="h-5 w-5 grayscale opacity-70" />
            Continue with Google
          </Button>
        </div>

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
            htmlFor="email"
            className="block text-sm font-medium text-brand-cream"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-brand-medium/50 bg-brand-dark-alt px-3 py-2.5 text-base sm:text-sm text-white placeholder-brand-light/50 focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange min-h-[44px]"
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
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-brand-medium/50 bg-brand-dark-alt py-2.5 pl-3 pr-12 text-base sm:text-sm text-white placeholder-brand-light/50 focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange min-h-[44px]"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-1 top-1/2 -translate-y-1/2 rounded-md p-2 text-brand-light hover:bg-brand-medium/30 hover:text-white focus:outline-none focus:ring-2 focus:ring-brand-orange min-h-[40px] min-w-[40px] flex items-center justify-center"
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
        </div>
        <Button type="submit" disabled={loading} className="w-full py-3 min-h-[44px]">
          {loading ? "Signing in..." : "Sign in with email"}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-brand-light">
        Don&apos;t have an account?{" "}
        <Link
          to="/signup"
          className="font-medium text-brand-orange hover:underline"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
