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
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto h-16 gap-6">
        <div className="flex items-center gap-6 xl:gap-8 min-w-0">
          <Link
            href="/"
            className="flex items-center gap-2 font-headline-lg text-[21px] font-bold text-on-surface tracking-tight whitespace-nowrap"
          >
            <span
              aria-hidden
              className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-primary text-on-primary font-mono text-[12px] -rotate-3"
            >
              &gt;_
            </span>
            Claude Mastery
          </Link>
          <nav className="hidden xl:flex items-center gap-5 whitespace-nowrap" aria-label="Navigation principale">
            {NAV_LINKS.map((l) => (
              <Link key={l.key} href={l.href} className={linkClass(l.key)}>
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <SearchButton />
          <ThemeToggle />
          <Link
            href="/test"
            className="hidden xl:inline-flex btn-primary h-9 px-4 rounded-md items-center text-body-sm font-semibold whitespace-nowrap"
          >
            Test de niveau
          </Link>
          <MobileNav active={active} />
        </div>
      </div>
    </header>
  );
}
