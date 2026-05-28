export const metadata = {
  title: "Mentions légales",
  description: "Mentions légales de Claude Mastery.",
};

export default function MentionsPage() {
  return (
    <>
      <h1 className="font-display-xl text-display-xl font-bold tracking-tight mb-6 text-on-surface">
        Mentions légales
      </h1>
      <p className="text-body-rt text-on-surface-variant leading-relaxed mb-6">
        Cette page sera complétée prochainement. Pour toute question, contacte
        l'équipe via la{" "}
        <a className="underline" href="/legal/contact">
          page contact
        </a>
        .
      </p>
      <div className="space-y-4 text-body-sm text-on-surface-variant">
        <div>
          <div className="font-semibold text-on-surface">Éditeur</div>
          <div>Claude Mastery — France</div>
        </div>
        <div>
          <div className="font-semibold text-on-surface">Hébergeur</div>
          <div>Vercel Inc.</div>
        </div>
        <div>
          <div className="font-semibold text-on-surface">Marques tierces</div>
          <div>
            Claude™ et Anthropic™ sont des marques d'Anthropic, PBC. Ce site
            n'est pas affilié à Anthropic.
          </div>
        </div>
      </div>
    </>
  );
}
