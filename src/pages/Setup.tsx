import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { useAuth } from "../context/AuthContext";
import { useOwnerExists } from "../hooks/useOwnerExists";
import { supabase } from "../lib/supabase";
import {
  validatePassword,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REQUIREMENTS,
} from "../lib/passwordValidation";

export default function Setup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const ownerExists = useOwnerExists();
  const { user, signUp } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!user) {
      const validation = validatePassword(password);
      if (!validation.valid) {
        setError(validation.message ?? "Password does not meet requirements.");
        return;
      }
    }
    setLoading(true);
    if (!user) {
      const { error: signUpError } = await signUp(
        email,
        password,
        fullName || undefined
      );
      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }
    }
    const { error: claimError } = await supabase.rpc("claim_owner");
    setLoading(false);
    if (claimError) {
      setError(claimError.message);
      return;
    }
    navigate("/account");
  }

  if (ownerExists === null) {
    return (
      <div className="mx-auto max-w-md text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900 mx-auto" />
        <p className="mt-4 text-gray-600">Checking setup status...</p>
      </div>
    );
  }

  if (ownerExists) {
    return (
      <div className="mx-auto max-w-md rounded-lg border border-amber-200 bg-amber-50 p-6 text-center">
        <h1 className="text-xl font-semibold text-amber-900">Setup complete</h1>
        <p className="mt-2 text-amber-800">
          An owner account already exists. Sign in to access the store
          dashboard.
        </p>
        <a
          href="/login"
          className="mt-4 inline-block rounded-lg bg-amber-600 px-6 py-2 font-medium text-white hover:bg-amber-700"
        >
          Go to sign in
        </a>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-bold text-gray-900">Create owner account</h1>
      <p className="mt-1 text-gray-600">
        {user
          ? "Complete setup to become the store owner."
          : "This is a one-time setup. You will be the store owner with full access to the CMS, products, orders, and store settings."}
      </p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {user ? (
          <Button type="submit" disabled={loading} className="w-full py-3">
            {loading ? "Completing setup..." : "Complete setup as owner"}
          </Button>
        ) : (
          <>
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700"
              >
                Full name
              </label>
              <input
                id="fullName"
                type="text"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
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
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={PASSWORD_MIN_LENGTH}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
              />
              <ul
                className="mt-2 space-y-1 text-xs text-gray-500"
                aria-live="polite"
              >
                {PASSWORD_REQUIREMENTS.map(({ key, label }) => {
                  const met = !validatePassword(password).errors.includes(key);
                  return (
                    <li key={key} className={met ? "text-green-600" : ""}>
                      {met ? "✓ " : "○ "}
                      {label}
                    </li>
                  );
                })}
              </ul>
            </div>
            <Button type="submit" disabled={loading} className="w-full py-3">
              {loading ? "Creating owner account..." : "Create owner account"}
            </Button>
          </>
        )}
      </form>
    </div>
  );
}
