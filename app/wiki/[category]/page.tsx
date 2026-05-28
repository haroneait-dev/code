import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ChevronRight, ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { CATEGORIES, stubsByCategory, getCategory, type CategoryId } from "@/lib/wiki-manifest";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.id }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = getCategory(category as CategoryId);
  if (!cat) notFound();

  const articles = stubsByCategory(cat.id);

  // If the category has articles, redirect to the first one (article view has the sidebar)
  if (articles.length > 0) {
    redirect(`/wiki/${cat.id}/${articles[0].slug}`);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader active="wiki" showSearch />

      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12">
        <nav className="flex items-center gap-2 text-on-surface-variant font-body-sm mb-8">
          <Link href="/wiki" className="hover:text-primary transition-colors">
            Wiki
          </Link>
          <ChevronRight className="w-4 h-4" strokeWidth={1.75} />
          <span className="text-on-surface">{cat.name}</span>
        </nav>

        <h1 className="font-display-xl text-[40px] md:text-[56px] font-extrabold tracking-tight mb-4 text-on-surface">
          {cat.name}
        </h1>
        <p className="font-body-rt text-body-rt md:text-[19px] text-on-surface-variant mb-12 max-w-2xl">
          {cat.description}
        </p>

        <p className="text-on-surface-variant italic">
          Aucun article pour le moment.
        </p>
      </main>

      <SiteFooter />
    </div>
  );
}
