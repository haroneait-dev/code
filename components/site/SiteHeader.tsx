import Link from "next/link";
import { Suspense } from "react";
import { Search } from "lucide-react";
import { AuthButton } from "@/components/auth/AuthButton";
import { MobileNav } from "@/components/site/MobileNav";
import { NotificationBell } from "@/components/notifications/NotificationBell";

type NavKey = "formation" | "wiki" | "communaute" | "messages" | null;

export function SiteHeader({
  active = null,
  showSearch = false,
}: {
  active?: NavKey;
  showSearch?: boolean;
}) {
  const linkClass = (key: NavKey) =>
    active === key
      ? "text-primary font-medium border-b-2 border-primary pb-1 text-body-sm"
      : "text-on-surface-variant hover:text-on-surface text-body-sm transition-colors";

  return (
    <header className="bg-surface/85 backdrop-blur-xl sticky top-0 border-b border-outline-variant z-50">
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto h-16 gap-6">
        <div className="flex items-center gap-8 min-w-0">
          <Link
            href="/"
            className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight whitespace-nowrap"
          >
            Claude{" "}
            <span className="font-normal text-on-surface-variant">Mastery</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/learn" className={linkClass("formation")}>
              Formation
            </Link>
            <Link href="/wiki" className={linkClass("wiki")}>
              Wiki
            </Link>
            <Link href="/communaute" className={linkClass("communaute")}>
              Communauté
            </Link>
            <Link href="/messages" className={linkClass("messages")}>
              Messages
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {showSearch && (
            <div className="hidden md:flex items-center bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-1.5 focus-within:border-primary transition-colors">
              <Search
                className="w-4 h-4 text-on-surface-variant mr-2"
                strokeWidth={1.75}
              />
              <input
                className="bg-transparent border-none text-body-sm text-on-surface focus:ring-0 placeholder:text-on-surface-variant w-48 outline-none"
                placeholder="Rechercher…"
                type="text"
              />
              <span className="text-xs text-on-surface-variant border border-outline-variant rounded px-1 ml-2 font-code-md">
                ⌘K
              </span>
            </div>
          )}
          <Suspense fallback={<div className="w-9 h-9" aria-hidden />}>
            <NotificationBell />
          </Suspense>
          <Suspense
            fallback={<div className="w-[120px] h-9" aria-hidden />}
          >
            <AuthButton />
          </Suspense>
          <MobileNav active={active} />
        </div>
      </div>
    </header>
  );
}
