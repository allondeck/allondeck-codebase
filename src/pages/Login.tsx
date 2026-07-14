import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../components/Button";
import { GoogleIcon } from "../components/GoogleIcon";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "/account";

  async function handleGoogleSignIn() {
    setError(null);
    setLoading(true);
    const { error: err } = await signInWithGoogle(redirectTo);
    setLoading(false);
    if (err) setError(err.message);
    // else: browser redirects to Google, then back to app
  }


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
      <h1 className="text-2xl font-bold text-white">Sign in</h1>
      <p className="mt-1 text-[#f6ebd4]">
        Sign in to your account to view orders and manage your profile.
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
          onClick={handleGoogleSignIn}
          className="w-full py-3 flex items-center justify-center gap-2 border border-[#066175]/50 bg-[#052631] text-[#f6ebd4] hover:bg-[#066175]/30 hover:scale-105 active:scale-95 transition-all duration-200"
        >
          <GoogleIcon className="h-5 w-5" />
          Continue with Google
        </Button>

        <div className="relative">
          <div
            className="absolute inset-0 flex items-center"
            aria-hidden="true"
          >
            <div className="w-full border-t border-[#066175]/35" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-[#044155] px-2 text-[#76abbf]">or</span>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-[#f6ebd4]"
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
            className="mt-1 w-full rounded-lg border border-[#066175]/50 bg-[#052631] px-3 py-2 text-white placeholder-[#76abbf]/50 focus:border-[#e38622] focus:outline-none focus:ring-1 focus:ring-[#e38622]"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-[#f6ebd4]"
          >
            Password
          </label>
          <div className="relative mt-1">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-[#066175]/50 bg-[#052631] py-2 pl-3 pr-10 text-white placeholder-[#76abbf]/50 focus:border-[#e38622] focus:outline-none focus:ring-1 focus:ring-[#e38622]"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-[#76abbf] hover:bg-[#066175]/30 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#e38622] focus:ring-offset-0"
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
        <Button type="submit" disabled={loading} className="w-full py-3">
          {loading ? "Signing in..." : "Sign in with email"}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-[#76abbf]">
        Don&apos;t have an account?{" "}
        <Link
          to="/signup"
          className="font-medium text-[#e38622] hover:underline"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
