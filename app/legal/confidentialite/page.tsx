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
        Claude Mastery est consultable sans compte. Voici ce que cela implique
        pour vos données :
      </p>
      <ul className="list-disc pl-6 space-y-3 text-body-rt text-on-surface-variant">
        <li>
          <strong className="text-on-surface">Aucun compte</strong> : nous ne
          collectons ni adresse e-mail, ni mot de passe, ni profil.
        </li>
        <li>
          <strong className="text-on-surface">Cookies</strong> : aucun cookie
          de session ni de suivi publicitaire.
        </li>
        <li>
          <strong className="text-on-surface">Hébergement</strong> : le site
          est servi par Vercel, qui conserve des journaux techniques (adresse
          IP, date, page demandée) pour la sécurité et le bon fonctionnement du
          service.
        </li>
        <li>
          <strong className="text-on-surface">Droits RGPD</strong> : pour toute
          question, écrivez-nous via la page contact.
        </li>
      </ul>
    </>
  );
}
