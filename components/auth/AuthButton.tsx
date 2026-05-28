"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowRight, LogOut, ShieldCheck } from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import { getSupabase } from "@/lib/supabase";
import { isAdminEmail } from "@/lib/admin";
import { Avatar } from "@/components/site/Avatar";
import { AuthModal } from "./AuthModal";

export function AuthButton() {
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const supabase = getSupabase();
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) =>
      setSession(s)
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  // Auto-open modal when redirected from a protected route (?login=1)
  useEffect(() => {
    if (searchParams.get("login") === "1" && !session) {
      setOpen(true);
    }
  }, [searchParams, session]);

  // After login, send user back to the original protected page
  useEffect(() => {
    if (!session) return;
    const from = searchParams.get("from");
    if (from && from.startsWith("/")) {
      router.replace(from);
    }
  }, [session, searchParams, router]);

  const handleClose = () => {
    setOpen(false);
    // Strip login/from params from the URL once user closes the modal
    if (searchParams.get("login")) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("login");
      params.delete("from");
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname);
    }
  };

  const signOut = async () => {
    await getSupabase().auth.signOut();
    setMenuOpen(false);
  };

  if (session?.user) {
    const email = session.user.email ?? "";
    const name = (session.user.user_metadata?.user_name as string) ?? email;
    const initial = (name[0] ?? "?").toUpperCase();

    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="flex items-center gap-2 pr-2 pl-1 py-1 rounded-full hover:bg-surface-container transition-colors"
          aria-label="Menu utilisateur"
        >
          <Avatar name={name} initial={initial} size={32} />
          <span className="hidden sm:inline text-body-sm text-on-surface max-w-[140px] truncate">
            {name}
          </span>
        </button>

        {menuOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setMenuOpen(false)}
            />
            <div className="absolute right-0 top-12 z-50 w-56 bg-surface-container-lowest rounded-xl border border-outline-variant shadow-lg p-2">
              <div className="px-3 py-2 border-b border-outline-variant mb-1">
                <div className="text-body-sm font-medium text-on-surface truncate">
                  {name}
                </div>
                {email !== name && (
                  <div className="text-xs text-on-surface-variant truncate">
                    {email}
                  </div>
                )}
              </div>
              {isAdminEmail(email) && (
                <Link
                  href="/admin/users"
                  onClick={() => setMenuOpen(false)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-body-sm text-on-surface hover:bg-surface-container transition-colors"
                >
                  <ShieldCheck className="w-4 h-4" strokeWidth={1.75} />
                  Administration
                </Link>
              )}
              <button
                type="button"
                onClick={signOut}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-body-sm text-on-surface hover:bg-surface-container transition-colors"
              >
                <LogOut className="w-4 h-4" strokeWidth={1.75} />
                Se déconnecter
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn-primary px-5 h-9 inline-flex items-center justify-center gap-1 rounded-full text-body-sm font-medium"
      >
        Connexion
        <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
      </button>
      <AuthModal open={open} onClose={handleClose} />
    </>
  );
}
