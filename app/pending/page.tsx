import { Clock, Mail } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export const metadata = {
  title: "En attente d'approbation — Claude Mastery",
  robots: { index: false },
};

export default function PendingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-grow flex items-center justify-center px-margin-mobile md:px-margin-desktop py-16">
        <div className="max-w-md w-full bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 sm:p-10 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-6 bg-primary-fixed/40">
            <Clock className="w-7 h-7 text-primary" strokeWidth={1.75} />
          </div>

          <h1 className="font-display-xl text-[28px] font-bold text-on-surface tracking-tight mb-3">
            Compte en attente
          </h1>

          <p className="font-body-rt text-body-rt text-on-surface-variant mb-6 leading-relaxed">
            Ton inscription a bien été enregistrée. Un administrateur doit
            maintenant valider ton accès. Tu recevras une notification dès que
            ton compte sera activé.
          </p>

          <div className="bg-surface-container-low border border-outline-variant rounded-lg p-4 flex items-start gap-3 text-left">
            <Mail
              className="w-5 h-5 text-on-surface-variant mt-0.5 shrink-0"
              strokeWidth={1.75}
            />
            <p className="text-body-sm text-on-surface-variant leading-relaxed">
              En attendant, n'hésite pas à explorer la{" "}
              <a href="/" className="underline hover:text-on-surface">
                page d'accueil
              </a>{" "}
              pour découvrir ce qui t'attend.
            </p>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
