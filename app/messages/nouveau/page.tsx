import Link from "next/link";
import { redirect } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { getServerSupabase } from "@/lib/supabase-server";
import { normalizeUsername, isValidUsername } from "@/lib/community/types";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Nouveau message",
};

type Props = {
  searchParams: Promise<{ to?: string }>;
};

export default async function NewDmPage({ searchParams }: Props) {
  const { to } = await searchParams;
  const supabase = await getServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/?login=1&from=/messages");

  const rawUsername = (to ?? "").trim();
  if (!rawUsername) {
    return (
      <ErrorShell
        title="Destinataire manquant"
        message="Aucun pseudo fourni. Utilise le bouton « Message privé » depuis un profil."
      />
    );
  }

  const username = normalizeUsername(rawUsername);
  if (!isValidUsername(username)) {
    return (
      <ErrorShell
        title="Pseudo invalide"
        message={`Le pseudo « ${rawUsername} » n'est pas un format valide.`}
      />
    );
  }

  const { data: target } = await supabase
    .from("community_profiles")
    .select("user_id, username")
    .eq("username", username)
    .maybeSingle();

  const t = target as { user_id: string; username: string } | null;
  if (!t) {
    return (
      <ErrorShell
        title="Utilisateur introuvable"
        message={`Aucun membre approuvé avec le pseudo « ${username} ».`}
      />
    );
  }

  if (t.user_id === user.id) {
    return (
      <ErrorShell
        title="Impossible"
        message="Tu ne peux pas t'envoyer un message à toi-même."
      />
    );
  }

  const { data, error } = await supabase.rpc("get_or_create_dm", {
    target_user_id: t.user_id,
  });

  if (error || !data) {
    return (
      <ErrorShell
        title="Échec de la création"
        message={error?.message ?? "Impossible de démarrer cette conversation."}
      />
    );
  }

  redirect(`/messages/${data as string}`);
}

function ErrorShell({ title, message }: { title: string; message: string }) {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-grow w-full max-w-2xl mx-auto px-margin-mobile md:px-margin-desktop py-14 md:py-20">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 text-center">
          <AlertTriangle
            className="w-10 h-10 text-on-surface-variant mx-auto mb-4"
            strokeWidth={1.5}
          />
          <h1 className="text-[24px] md:text-[28px] font-bold text-on-surface mb-2 tracking-tight">
            {title}
          </h1>
          <p className="text-body-rt text-on-surface-variant mb-6">{message}</p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/messages"
              className="btn-secondary h-10 px-5 rounded-full inline-flex items-center justify-center text-body-sm font-medium"
            >
              Mes messages
            </Link>
            <Link
              href="/communaute"
              className="btn-primary h-10 px-5 rounded-full inline-flex items-center justify-center text-body-sm font-medium"
            >
              Aller à la communauté
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
