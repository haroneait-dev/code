import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { NewPostForm } from "@/components/community/NewPostForm";

export const metadata = {
  title: "Nouvelle discussion",
  description: "Lance une nouvelle discussion dans la communauté.",
};

export default function NewPostPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader active="communaute" />
      <main className="flex-grow w-full max-w-2xl mx-auto px-margin-mobile py-10 md:py-14">
        <Link
          href="/communaute"
          className="inline-flex items-center gap-2 text-body-sm text-on-surface-variant hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.75} />
          Retour au flux
        </Link>
        <h1 className="font-display-xl text-[32px] md:text-[40px] font-bold tracking-tight mb-2">
          Nouvelle discussion
        </h1>
        <p className="text-body-rt text-on-surface-variant mb-8">
          Pose une question, partage un workflow, raconte un bug.
        </p>
        <NewPostForm />
      </main>
      <SiteFooter />
    </div>
  );
}
