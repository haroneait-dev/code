import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { getServerSupabase } from "@/lib/supabase-server";
import { ProfileSettingsForm } from "@/components/profile/ProfileSettingsForm";

export const metadata = {
  title: "Paramètres du profil",
  description: "Modifier ton profil Claude Mastery.",
};

export default async function ProfileSettingsPage() {
  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/?login=1&from=/profil/parametres");

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, display_name, bio, avatar_url")
    .eq("user_id", user.id)
    .maybeSingle();

  const p = profile as {
    username: string | null;
    display_name: string | null;
    bio: string | null;
    avatar_url: string | null;
  } | null;

  if (!p?.username) redirect("/onboarding");

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-grow w-full max-w-2xl mx-auto px-margin-mobile py-12">
        <Link
          href={`/u/${p.username}`}
          className="inline-flex items-center gap-2 text-body-sm text-on-surface-variant hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.75} />
          Retour au profil
        </Link>
        <h1 className="font-display-xl text-[32px] md:text-[40px] font-bold tracking-tight mb-2">
          Paramètres
        </h1>
        <p className="text-body-rt text-on-surface-variant mb-8">
          Tu es connecté en tant que{" "}
          <span className="font-mono text-on-surface">@{p.username}</span>.
        </p>
        <ProfileSettingsForm
          username={p.username}
          displayName={p.display_name ?? ""}
          bio={p.bio ?? ""}
          avatarUrl={p.avatar_url ?? ""}
        />
      </main>
      <SiteFooter />
    </div>
  );
}
