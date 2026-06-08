import Link from "next/link";
import { BookOpen, FileText, ArrowRight, SearchX } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SearchPageInput } from "@/components/site/SearchPageInput";
import { searchSite } from "@/lib/search";

export const metadata = {
  title: "Recherche — Claude Mastery",
  description:
    "Recherchez dans toute la formation Claude Code et le wiki francophone.",
};

type Props = {
  searchParams?: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: Props) {
  const sp = (await searchParams) ?? {};
  const query = (sp.q ?? "").trim();
  const results = query ? searchSite(query) : [];

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader showSearch />

      <main className="flex-grow w-full max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-12">
        <h1 className="font-display-xl text-display-xl font-extrabold tracking-tight mb-6 text-on-surface">
          Recherche
        </h1>

        <SearchPageInput initialQuery={query} />

        {query && (
          <p className="text-body-sm text-on-surface-variant mt-4 mb-8">
            {results.length} résultat{results.length > 1 ? "s" : ""} pour{" "}
            <span className="text-on-surface font-medium">« {query} »</span>
          </p>
        )}

        {/* Aucun terme saisi */}
        {!query && (
          <p className="text-body-rt text-on-surface-variant mt-8">
            Tape un mot-clé pour chercher parmi les leçons de la formation et les
            articles du wiki.
          </p>
        )}

        {/* Aucun résultat */}
        {query && results.length === 0 && (
          <div className="flex flex-col items-center text-center gap-4 py-16">
            <SearchX
              className="w-10 h-10 text-on-surface-variant"
              strokeWidth={1.5}
            />
            <p className="text-body-rt text-on-surface">
              Aucun résultat pour « {query} ».
            </p>
            <p className="text-body-sm text-on-surface-variant max-w-sm">
              Essaie un terme plus court ou différent — par exemple « hooks »,
              « mcp », « prompt » ou « streaming ».
            </p>
          </div>
        )}

        {/* Résultats */}
        {results.length > 0 && (
          <ul className="flex flex-col gap-3 mt-2">
            {results.map((r) => {
              const Icon = r.type === "lesson" ? BookOpen : FileText;
              const badge = r.type === "lesson" ? "Formation" : "Wiki";
              return (
                <li key={r.href}>
                  <Link
                    href={r.href}
                    className="group flex items-start gap-4 bg-surface-container-lowest border border-outline-variant rounded-xl p-4 soft-lift"
                  >
                    <div className="mt-0.5 shrink-0 text-on-surface-variant">
                      <Icon className="w-5 h-5" strokeWidth={1.75} />
                    </div>
                    <div className="min-w-0 flex-grow">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                          {badge}
                        </span>
                        <span className="text-on-surface-variant" aria-hidden>
                          ·
                        </span>
                        <span className="text-[12px] text-on-surface-variant truncate">
                          {r.context}
                        </span>
                      </div>
                      <h2 className="font-body-rt text-body-rt font-semibold text-on-surface group-hover:text-primary transition-colors">
                        {r.title}
                      </h2>
                      <p className="text-body-sm text-on-surface-variant line-clamp-2 mt-0.5">
                        {r.description}
                      </p>
                    </div>
                    <ArrowRight
                      className="w-4 h-4 text-on-surface-variant group-hover:text-primary group-hover:translate-x-1 transition-all mt-1 shrink-0"
                      strokeWidth={1.75}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
