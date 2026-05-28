import { createClient } from "@supabase/supabase-js";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { AdminUsersClient } from "./AdminUsersClient";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Admin · Utilisateurs — Claude Mastery",
  robots: { index: false },
};

type Profile = {
  user_id: string;
  email: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  approved_at: string | null;
};

export default async function AdminUsersPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from("profiles")
    .select("user_id, email, status, created_at, approved_at")
    .order("created_at", { ascending: false });

  const profiles: Profile[] = (data as Profile[] | null) ?? [];

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12">
        <header className="mb-10">
          <div className="inline-flex items-center border border-outline-variant rounded-full px-4 py-1 mb-4">
            <span className="text-[11px] font-bold tracking-wider uppercase text-on-surface-variant">
              Administration
            </span>
          </div>
          <h1 className="font-display-xl text-[40px] md:text-[48px] font-extrabold tracking-tight text-on-surface mb-3">
            Utilisateurs
          </h1>
          <p className="font-body-rt text-body-rt text-on-surface-variant">
            Approuve les demandes d'accès à la formation et la communauté.
          </p>
        </header>

        {error && (
          <p className="text-sm text-error mb-4">
            Erreur de chargement : {error.message}
          </p>
        )}

        <AdminUsersClient initial={profiles} />
      </main>

      <SiteFooter />
    </div>
  );
}
