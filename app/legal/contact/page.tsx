export const metadata = {
  title: "Contact",
  description: "Contacter l'équipe Claude Mastery.",
};

export default function ContactPage() {
  return (
    <>
      <h1 className="text-h1 font-display-xl -xl font-bold tracking-tight mb-6 text-on-surface">
        Contact
      </h1>
      <p className="text-body-rt text-on-surface-variant leading-relaxed mb-8">
        Une question, un bug, une suggestion ? Écris-nous.
      </p>
      <a
        href="mailto:haroneait@gmail.com"
        className="btn-primary inline-flex items-center justify-center font-medium -sm"
      >
        haroneait@gmail.com
      </a>
    </>
  );
}
