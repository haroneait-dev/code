// Articles retirés lors de la revue d'octobre 2026 : on redirige vers
// la page qui les remplace pour ne casser ni les liens partagés ni le SEO.
const retiredArticles = [
  ["/wiki/modeles/opus-4-7", "/wiki/modeles/evolution-claude"],
  ["/wiki/modeles/opus-4-8", "/wiki/modeles/evolution-claude"],
  ["/wiki/modeles/sonnet-4-6", "/wiki/modeles/evolution-claude"],
  ["/wiki/hooks/on-model-error", "/wiki/hooks/erreurs-stopfailure"],
  ["/wiki/demarrer/migration-openai", "/wiki/demarrer/migration-cursor-copilot"],
  ["/wiki/mcp/serveur-puppeteer", "/wiki/mcp/serveurs-populaires"],
  ["/wiki/claude-ai/claude-pages", "/wiki/claude-ai/artifacts-architecture"],
  ["/wiki/claude-ai/extensions-tierces", "/wiki/claude-ai"],
  ["/wiki/claude-ai/pro-team-enterprise", "/wiki/claude-bases/offres-et-limites"],
  ["/wiki/claude-ai/model-selector-web", "/wiki/claude-bases/choisir-modele"],
  ["/wiki/claude-ai/historique-export", "/wiki/claude-bases/confidentialite"],
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return retiredArticles.map(([source, destination]) => ({
      source,
      destination,
      permanent: true,
    }));
  },
};

export default nextConfig;
