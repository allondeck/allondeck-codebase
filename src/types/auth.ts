export type ProfileRole = "customer" | "owner" | "staff" | "readonly";

export type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: ProfileRole;
};
