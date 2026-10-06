import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Quiz } from "@/components/quiz/Quiz";

export const metadata = {
  title: "Test de niveau : par où commencer avec Claude ?",
  description:
    "10 questions pour connaître votre niveau sur Claude et Claude Code, et recevoir un parcours sur mesure : quoi lire, quoi pratiquer, quel projet réaliser.",
};

export default function TestPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <SiteHeader active="test" />
      <main className="flex-grow w-full px-margin-mobile md:px-margin-desktop py-12 md:py-20">
        <Quiz />
      </main>
      <SiteFooter />
    </div>
  );
}
