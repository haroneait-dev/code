import Link from "next/link";

const SOCIAL_LINKS = [
  {
    label: "TikTok",
    href: process.env.NEXT_PUBLIC_TIKTOK_URL ?? "",
    icon: (
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="currentColor"
        aria-hidden
      >
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.91a8.16 8.16 0 0 0 4.77 1.52V7a4.85 4.85 0 0 1-1.84-.31z" />
      </svg>
    ),
  },
  {
    label: "X",
    href: process.env.NEXT_PUBLIC_X_URL ?? "",
    icon: (
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="currentColor"
        aria-hidden
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "GitHub",
    href: process.env.NEXT_PUBLIC_GITHUB_URL ?? "",
    icon: (
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="currentColor"
        aria-hidden
      >
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.31.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant mt-auto">
      <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2">
            <div className="font-headline-lg text-headline-lg font-bold text-primary mb-3">
              Claude Mastery
            </div>
            <p className="text-body-sm text-on-surface-variant max-w-sm leading-relaxed">
              La formation francophone de référence pour maîtriser Claude Code.
            </p>
            {SOCIAL_LINKS.some((s) => s.href) && (
              <div className="flex items-center gap-2 mt-5">
                {SOCIAL_LINKS.filter((s) => s.href).map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="w-9 h-9 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary transition-colors"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="text-body-sm font-semibold text-on-surface mb-3">
              Plateforme
            </div>
            <ul className="space-y-2 text-body-sm text-on-surface-variant">
              <li>
                <Link href="/learn" className="hover:text-primary transition-colors">
                  Formation
                </Link>
              </li>
              <li>
                <Link href="/wiki" className="hover:text-primary transition-colors">
                  Wiki
                </Link>
              </li>
              <li>
                <Link
                  href="/communaute"
                  className="hover:text-primary transition-colors"
                >
                  Communauté
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-body-sm font-semibold text-on-surface mb-3">
              Légal
            </div>
            <ul className="space-y-2 text-body-sm text-on-surface-variant">
              <li>
                <Link
                  href="/legal/mentions"
                  className="hover:text-primary transition-colors"
                >
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/confidentialite"
                  className="hover:text-primary transition-colors"
                >
                  Confidentialité
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/contact"
                  className="hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-outline-variant flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-body-sm text-on-surface-variant">
          <div>© {year} Claude Mastery. Fait en France.</div>
          <div className="text-xs">
            Non affilié à Anthropic. Claude™ est une marque d'Anthropic, PBC.
          </div>
        </div>
      </div>
    </footer>
  );
}
