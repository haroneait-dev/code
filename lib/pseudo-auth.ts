// ── Auth par pseudo ──────────────────────────────────────────────────────
// On n'utilise plus GitHub / lien magique. L'utilisateur choisit un pseudo +
// un mot de passe. Comme Supabase Auth a besoin d'un email, on dérive un email
// SYNTHÉTIQUE déterministe à partir du pseudo : `<pseudo>@<domaine>`.
//
// Ce domaine ne reçoit jamais d'email — il faut donc DÉSACTIVER la confirmation
// d'email dans Supabase (Authentication → Sign In / Providers → Email →
// "Confirm email" OFF), sinon signUp ne crée pas de session.
//
// Le mapping est déterministe : même pseudo → même email, ce qui permet de se
// reconnecter depuis n'importe quel appareil avec pseudo + mot de passe, et
// garantit l'unicité du pseudo au niveau de auth.users.

export const PSEUDO_EMAIL_DOMAIN = "pseudo.claudemastery.app";

export function pseudoToEmail(pseudo: string): string {
  return `${pseudo}@${PSEUDO_EMAIL_DOMAIN}`;
}

export function isPseudoEmail(email: string | null | undefined): boolean {
  return !!email && email.endsWith(`@${PSEUDO_EMAIL_DOMAIN}`);
}

// Extrait le pseudo d'un email synthétique (sinon renvoie l'email tel quel).
export function pseudoFromEmail(email: string | null | undefined): string {
  if (!email) return "";
  return isPseudoEmail(email) ? email.split("@")[0] : email;
}
