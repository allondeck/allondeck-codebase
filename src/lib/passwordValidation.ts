/**
 * Password must include at least one of each: lowercase, uppercase, digit, symbol.
 * Minimum length 8 when complexity is required.
 */
export const PASSWORD_MIN_LENGTH = 8;

const HAS_LOWERCASE = /[a-z]/;
const HAS_UPPERCASE = /[A-Z]/;
const HAS_DIGIT = /\d/;
const HAS_SYMBOL = /[^a-zA-Z0-9]/;

export type PasswordRequirement =
  | "length"
  | "lowercase"
  | "uppercase"
  | "digit"
  | "symbol";

export interface PasswordValidationResult {
  valid: boolean;
  errors: PasswordRequirement[];
  message: string | null;
}

export function validatePassword(password: string): PasswordValidationResult {
  const errors: PasswordRequirement[] = [];
  if (password.length < PASSWORD_MIN_LENGTH) errors.push("length");
  if (!HAS_LOWERCASE.test(password)) errors.push("lowercase");
  if (!HAS_UPPERCASE.test(password)) errors.push("uppercase");
  if (!HAS_DIGIT.test(password)) errors.push("digit");
  if (!HAS_SYMBOL.test(password)) errors.push("symbol");

  const message =
    errors.length === 0
      ? null
      : `Password must be at least ${PASSWORD_MIN_LENGTH} characters and include lowercase, uppercase, a digit, and a symbol.`;

  return {
    valid: errors.length === 0,
    errors,
    message,
  };
}

export const PASSWORD_REQUIREMENTS: {
  key: PasswordRequirement;
  label: string;
}[] = [
  { key: "length", label: `At least ${PASSWORD_MIN_LENGTH} characters` },
  { key: "lowercase", label: "One lowercase letter" },
  { key: "uppercase", label: "One uppercase letter" },
  { key: "digit", label: "One number" },
  { key: "symbol", label: "One symbol (e.g. !@#$%)" },
];
