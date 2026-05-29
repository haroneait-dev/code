import { redirect } from "next/navigation";
import { getServerSupabase } from "@/lib/supabase-server";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { OnboardingForm } from "@/components/onboarding/OnboardingForm";

export const metadata = {
  title: "Choisis ton pseudo",
  description:
    "Configure ton pseudo pour rejoindre la communauté Claude Mastery.",
};

export default async function OnboardingPage() {
  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/?login=1&from=/onboarding");

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, display_name, status")
    .eq("user_id", user.id)
    .maybeSingle();

  const p = profile as
    | { username: string | null; display_name: string | null; status: string }
    | null;

  // Already onboarded → send to home
  if (p?.username) redirect("/");

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-grow w-full max-w-md mx-auto px-margin-mobile py-16">
        <h1 className="font-display-xl text-[32px] md:text-[40px] font-bold tracking-tight mb-4">
          Bienvenue 👋
        </h1>
        <p className="text-body-rt text-on-surface-variant leading-relaxed mb-8">
          Avant de rejoindre la communauté, choisis ton pseudo. Il sera visible
          sur tes posts et commentaires — tu ne pourras le changer que rarement.
        </p>
        <OnboardingForm initialDisplayName={p?.display_name ?? user.email ?? ""} />
      </main>
      <SiteFooter />
    </div>
  );
}
