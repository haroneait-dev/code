export const metadata = {
  title: "Politique de confidentialité",
  description: "Politique de confidentialité de Claude Mastery.",
};

export default function ConfidentialitePage() {
  return (
    <>
      <h1 className="font-display-xl text-display-xl font-bold tracking-tight mb-6 text-on-surface">
        Politique de confidentialité
      </h1>
      <p className="text-body-rt text-on-surface-variant leading-relaxed mb-6">
        Cette page sera complétée prochainement. Voici les grandes lignes :
      </p>
      <ul className="list-disc pl-6 space-y-3 text-body-rt text-on-surface-variant">
        <li>
          <strong className="text-on-surface">Authentification</strong> : email
          et identifiants OAuth gérés par Supabase. Aucun mot de passe en clair.
        </li>
        <li>
          <strong className="text-on-surface">Cookies</strong> : strictement
          nécessaires (session). Pas de tracking publicitaire.
        </li>
        <li>
          <strong className="text-on-surface">Données IA</strong> : les messages
          envoyés à l'assistant sont transmis à l'API Anthropic.
        </li>
        <li>
          <strong className="text-on-surface">Droits RGPD</strong> : accès,
          rectification et suppression sur simple demande via la page contact.
        </li>
      </ul>
    </>
  );
}
