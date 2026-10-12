import Link from "next/link";
import { MobileNav } from "@/components/site/MobileNav";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import { SearchButton } from "@/components/site/CommandPalette";
import { NAV_LINKS, type NavKey } from "@/lib/nav";


export function SiteHeader({
  active = null,
  showSearch = false,
}: {
  active?: NavKey;
  showSearch?: boolean;
}) {
  const linkClass = (key: NavKey) =>
    active === key
      ? "text-on-surface font-semibold text-body-sm text-mark"
      : "text-on-surface-variant hover:text-on-surface text-body-sm transition-colors";

  return (
    <header className="bg-surface sticky top-0 border-b border-outline-variant z-50">
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto h-20 gap-2">
        <div className="flex items-center gap-6 xl:gap-8 min-w-0">
          <Link
            href="/"
            className="flex items-center gap-2 font-headline-lg text-h3 font-bold text-on-surface tracking-tight whitespace-nowrap"
          >
            <span
              aria-hidden
              className="inline-flex items-center justify-center w-7 h-7 rounded bg-primary text-on-primary font-mono text-small"
            >
              &gt;_
            </span>
            Claude Mastery
          </Link>
          <nav className="hidden xl:flex items-center gap-5 whitespace-nowrap" aria-label="Navigation principale">
            {NAV_LINKS.filter((l) => ["claude", "code", "learn", "wiki", "apps"].includes(l.key)).map((l) => (
              <Link key={l.key} href={l.href} className={linkClass(l.key)}>
                {l.label}
              </Link>
            ))}
            <details className="relative">
              <summary className="text-small text-on-surface-variant cursor-pointer flex items-center">Ressources</summary>
              <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-outline-variant bg-surface p-3 flex flex-col">
                {NAV_LINKS.filter((l) => !["claude", "code", "learn", "wiki", "apps"].includes(l.key)).map((l) => <Link key={l.key} href={l.href} className="px-2 text-small hover:text-primary">{l.label}</Link>)}
              </div>
            </details>
          </nav>
        </div>

        <div className="flex items-center gap-1">
          <SearchButton />
          <ThemeToggle />

          <MobileNav active={active} />
        </div>
      </div>
    </header>
  );
}
