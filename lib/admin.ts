// ── Admin allowlist ──────────────────────────────────────────────────────
// Comma-separated emails in env (ADMIN_EMAILS), falls back to a single
// NEXT_PUBLIC_ADMIN_EMAIL for backwards compat.

export function adminEmails(): string[] {
  const list = process.env.ADMIN_EMAILS ?? process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "";
  return list
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return adminEmails().includes(email.toLowerCase());
}
