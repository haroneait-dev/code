export const metadata = {
  title: "Contact",
  description: "Contacter l'équipe Claude Mastery.",
};

export default function ContactPage() {
  return (
    <>
      <h1 className="font-display-xl text-display-xl font-bold tracking-tight mb-6 text-on-surface">
        Contact
      </h1>
      <p className="text-body-rt text-on-surface-variant leading-relaxed mb-8">
        Une question, un bug, une suggestion ? Écris-nous.
      </p>
      <a
        href="mailto:haroneait@gmail.com"
        className="btn-primary h-11 px-8 rounded-full inline-flex items-center justify-center font-medium text-body-sm"
      >
        haroneait@gmail.com
      </a>
    </>
  );
}
