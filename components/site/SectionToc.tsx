import Link from "next/link";
import {
  CATEGORIES,
  stubsByCategory,
  type CategoryId,
} from "@/lib/wiki-manifest";

// Sommaire d'une partie du site : chaque rubrique avec la liste de ses articles,
// visible d'un coup d'œil comme la table des matières d'un livre.
export function SectionToc({ categories }: { categories: CategoryId[] }) {
  const cats = categories
    .map((id) => CATEGORIES.find((c) => c.id === id))
    .filter((c): c is (typeof CATEGORIES)[number] => Boolean(c));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
      {cats.map((cat) => {
        const articles = stubsByCategory(cat.id);
        return (
          <section key={cat.id} className="min-w-0">
            <div className="flex items-baseline justify-between gap-4 border-b-[1.5px] border-on-surface pb-2 mb-3">
              <h3 className="font-headline-lg text-[22px] font-bold text-on-surface">
                <Link href={`/wiki/${cat.id}`} className="hover:text-primary transition-colors">
                  {cat.name}
                </Link>
              </h3>
              <span className="font-mono text-[13px] text-on-surface-variant tabular-nums shrink-0">
                {articles.length}
              </span>
            </div>
            <p className="text-[15px] text-on-surface-variant leading-relaxed mb-4">
              {cat.description}
            </p>
            <ul className="flex flex-col">
              {articles.map((a) => (
                <li key={a.slug} className="border-b border-dotted border-outline-variant">
                  <Link
                    href={`/wiki/${cat.id}/${a.slug}`}
                    className="block py-2.5 text-[15.5px] text-on-surface hover:text-primary transition-colors"
                  >
                    {a.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

// Parcours conseillé : une suite d'étapes dans l'ordre (la numérotation compte).
export function LearningPath({
  steps,
}: {
  steps: { title: string; text: string; href: string }[];
}) {
  return (
    <ol className="grid grid-cols-1 md:grid-cols-2 gap-x-10">
      {steps.map((s, i) => (
        <li key={s.href} className="border-t border-outline-variant">
          <Link href={s.href} className="grid grid-cols-[44px_1fr] gap-3 py-5 group">
            <span className="font-display-xl text-[28px] leading-none font-extrabold text-primary-fixed-dim tabular-nums">
              {i + 1}
            </span>
            <span className="min-w-0">
              <span className="block font-semibold text-[17px] text-on-surface group-hover:text-primary transition-colors mb-1">
                {s.title}
              </span>
              <span className="block text-[15px] text-on-surface-variant leading-relaxed">
                {s.text}
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
