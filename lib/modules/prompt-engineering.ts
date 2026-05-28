import type { Module } from "../curriculum";

export const promptEngineeringModule: Module = {
  id: "prompt-engineering",
  title: "Prompt Engineering",
  emoji: "✨",
  color: "#9a8060",
  lessons: [
    {
      id: "anatomie-prompt",
      title: "Anatomie d'un prompt efficace",
      duration: "9 min",
      tag: "Fondamentaux",
      intro:
        "Un bon prompt n'est pas une phrase magique : c'est une structure reproductible. Voici les 5 composants qui font passer Claude d'une réponse moyenne à une réponse chirurgicale.",
      sections: [
        {
          heading: "Les 5 composants d'un prompt solide",
          body: "Un prompt professionnel se décompose presque toujours en cinq blocs distincts. Les omettre, c'est laisser le modèle deviner — et donc halluciner.",
          bullets: [
            "<strong>Contexte</strong> — qui parle, à qui, dans quel domaine",
            "<strong>Instructions</strong> — la règle du jeu, ce qu'il faut faire et ne pas faire",
            "<strong>Format</strong> — la forme attendue (JSON, markdown, liste, ton)",
            "<strong>Exemples</strong> — 1 à 5 démonstrations few-shot",
            "<strong>Tâche</strong> — l'input concret à traiter, placé en dernier",
          ],
        },
        {
          heading: "Pourquoi l'ordre compte",
          body: "Claude lit le prompt de haut en bas et donne plus de poids aux instructions placées <strong>juste avant la tâche</strong>. Mettre les exemples en haut et la consigne en bas est un anti-pattern : le modèle aura oublié la règle au moment de répondre.",
        },
        {
          code: {
            lang: "text",
            label: "Template universel",
            code: `<role>
Tu es un analyste juridique senior, spécialisé en droit commercial français.
</role>

<instructions>
- Identifie les clauses à risque dans le contrat fourni
- Cite le numéro de l'article pour chaque alerte
- N'invente jamais de jurisprudence
</instructions>

<format>
Réponds en markdown, une section par clause à risque.
</format>

<example>
Input: "Article 3 — Le client renonce à tout recours..."
Output: ### Article 3 — Renonciation à recours
**Risque:** élevé. Clause potentiellement abusive (art. L.212-1 C.conso).
</example>

<task>
Voici le contrat à analyser :
{{CONTRAT}}
</task>`,
          },
        },
        {
          callout: {
            type: "tip",
            icon: "💡",
            text: "Règle d'or : la tâche (l'input variable) va TOUJOURS à la fin du prompt. Les instructions stables vont en haut — c'est aussi ce qui permet le prompt caching.",
          },
        },
        {
          heading: "Anti-pattern classique",
          body: "Écrire <em>« Résume ce texte »</em> et coller 10 000 mots derrière. Sans rôle, sans format, sans contrainte de longueur, vous obtiendrez un résumé générique de longueur aléatoire. Trois lignes de structure transforment le résultat.",
        },
        {
          keypoints: [
            "5 composants : contexte, instructions, format, exemples, tâche",
            "Tâche toujours en dernier — Claude pondère la fin du prompt",
            "Instructions stables en haut = compatible prompt caching",
            "Sans format explicite, le modèle improvise",
          ],
        },
      ],
    },
    {
      id: "xml-tags",
      title: "Structurer avec des balises XML",
      duration: "8 min",
      tag: "Technique",
      intro:
        "Claude a été entraîné avec massivement de XML dans ses données de fine-tuning. Utiliser des balises n'est pas une coquetterie : c'est la façon native dont le modèle parse l'information.",
      sections: [
        {
          heading: "Pourquoi XML et pas Markdown ?",
          body: "Le markdown est ambigu : un <code>#</code> peut être un titre ou un commentaire de code. Une balise <code>&lt;document&gt;</code> n'a aucune ambiguïté — Claude sait exactement où commence et finit le bloc, même s'il contient lui-même du markdown, du code ou d'autres documents.",
        },
        {
          heading: "Les balises canoniques",
          table: {
            headers: ["Balise", "Usage typique"],
            rows: [
              ["<code>&lt;task&gt;</code>", "La consigne principale à exécuter"],
              ["<code>&lt;document&gt;</code>", "Un texte long à analyser"],
              ["<code>&lt;example&gt;</code>", "Une démonstration input/output"],
              ["<code>&lt;thinking&gt;</code>", "Zone de raisonnement avant réponse"],
              ["<code>&lt;answer&gt;</code>", "Sortie finale propre"],
              ["<code>&lt;context&gt;</code>", "Informations de background"],
            ],
          },
        },
        {
          code: {
            lang: "xml",
            label: "Imbrication multi-documents",
            code: `<documents>
  <document index="1">
    <source>rapport-q1-2026.pdf</source>
    <content>
      Chiffre d'affaires Q1 : 2.4M€, en hausse de 18%...
    </content>
  </document>
  <document index="2">
    <source>rapport-q1-2025.pdf</source>
    <content>
      Chiffre d'affaires Q1 : 2.03M€...
    </content>
  </document>
</documents>

<task>
Compare les deux rapports et identifie les 3 KPIs qui ont
le plus progressé. Cite la source pour chaque chiffre.
</task>`,
          },
        },
        {
          callout: {
            type: "success",
            icon: "✅",
            text: "Astuce pro : ajoute un attribut index sur chaque <document> pour pouvoir demander à Claude de citer ses sources par numéro. Anthropic recommande explicitement ce pattern.",
          },
        },
        {
          heading: "Imbrication et cohérence",
          body: "Vous pouvez imbriquer librement (<code>&lt;examples&gt;</code> contenant plusieurs <code>&lt;example&gt;</code>). La seule règle : <strong>fermer ce que vous ouvrez</strong> et garder un nommage cohérent dans tout le prompt. Si vous utilisez <code>&lt;task&gt;</code>, ne switchez pas vers <code>&lt;query&gt;</code> à la ligne suivante.",
        },
        {
          keypoints: [
            "XML > Markdown pour la structure : zéro ambiguïté de parsing",
            "Balises courantes : <task>, <document>, <example>, <thinking>",
            "Indexer les documents permet la citation par numéro",
            "Cohérence du nommage > élégance — ne renommez pas en route",
          ],
        },
      ],
    },
    {
      id: "few-shot-cot",
      title: "Few-shot et Chain of Thought",
      duration: "11 min",
      tag: "Technique",
      intro:
        "Deux techniques qui doublent la qualité des réponses sans changer de modèle : montrer des exemples (few-shot) et forcer le raisonnement explicite (CoT).",
      sections: [
        {
          heading: "Few-shot : 2 à 5 exemples suffisent",
          body: "Décrire une tâche en mots est moins efficace que la <strong>montrer</strong>. 2 exemples couvrent le cas nominal, 5 exemples couvrent les edge cases. Au-delà, on observe des rendements décroissants et on alourdit la latence.",
        },
        {
          code: {
            lang: "xml",
            label: "Classification few-shot",
            code: `<examples>
  <example>
    <input>"Le colis est arrivé cassé, je veux un remboursement"</input>
    <output>{"intent": "refund", "sentiment": "negative", "priority": "high"}</output>
  </example>
  <example>
    <input>"Quels sont vos horaires d'ouverture ?"</input>
    <output>{"intent": "info", "sentiment": "neutral", "priority": "low"}</output>
  </example>
  <example>
    <input>"Merci pour votre service rapide !"</input>
    <output>{"intent": "compliment", "sentiment": "positive", "priority": "low"}</output>
  </example>
</examples>

<task>
Classifie ce message client :
"{{MESSAGE}}"
</task>`,
          },
        },
        {
          heading: "Chain of Thought : penser avant de répondre",
          body: "Pour toute tâche qui demande un raisonnement (math, logique, analyse), demandez à Claude de réfléchir <em>à voix haute</em> dans une zone dédiée avant de produire la réponse finale. Les benchmarks montrent +20 à +40 points de précision sur les tâches complexes.",
        },
        {
          code: {
            lang: "text",
            label: "Pattern <thinking> + <answer>",
            code: `Tu vas analyser une réclamation client.

1. Dans une balise <thinking>, examine étape par étape :
   - quelle est la demande réelle du client ?
   - quels articles du contrat sont pertinents ?
   - quel est le risque juridique ?

2. Puis dans une balise <answer>, donne UNIQUEMENT
   la réponse finale au client, sans montrer ton raisonnement.

<reclamation>
{{TEXTE_CLIENT}}
</reclamation>`,
          },
        },
        {
          callout: {
            type: "info",
            icon: "🧠",
            text: "Avec Claude Sonnet 4.6+, le mode extended thinking active ce comportement nativement via le paramètre thinking de l'API — plus besoin de balises manuelles pour les tâches lourdes.",
          },
        },
        {
          heading: "Combiner les deux",
          body: "Les exemples few-shot peuvent eux-mêmes contenir un bloc <code>&lt;thinking&gt;</code>. Vous enseignez ainsi à Claude <strong>comment raisonner</strong>, pas seulement <strong>quoi répondre</strong>. C'est la technique la plus puissante pour les tâches d'expertise.",
        },
        {
          keypoints: [
            "2 à 5 exemples few-shot : sweet spot qualité/coût",
            "Couvrir les edge cases via les exemples, pas via du texte explicatif",
            "Chain of Thought : +20 à +40 pts de précision sur les tâches complexes",
            "Séparer <thinking> et <answer> permet de cacher le raisonnement à l'utilisateur final",
            "Extended thinking en API : alternative native aux balises manuelles",
          ],
        },
      ],
    },
    {
      id: "output-format",
      title: "Forcer un format de sortie strict",
      duration: "9 min",
      tag: "Pratique",
      intro:
        "En production, vous parsez la sortie de Claude avec du code. Un seul caractère parasite et c'est l'exception. Voici trois techniques pour garantir un format à 100%.",
      sections: [
        {
          heading: "1 — Spécifier ET montrer le format",
          body: "Décrire le format en texte ne suffit pas. Montrez un exemple exact dans le prompt, avec exactement les clés, les types et l'ordre attendus. Claude calque sa sortie sur cet exemple.",
        },
        {
          code: {
            lang: "text",
            label: "Schéma + exemple",
            code: `Réponds UNIQUEMENT avec un objet JSON valide
correspondant exactement à ce schéma :

{
  "title": string,
  "tags": string[],     // 3 à 5 tags en kebab-case
  "summary": string,    // max 280 caractères
  "confidence": number  // entre 0 et 1
}

Exemple de sortie attendue :
{
  "title": "Migration vers Next.js 16",
  "tags": ["nextjs", "turbopack", "migration"],
  "summary": "Guide pas à pas pour migrer une app App Router de la v15 à la v16.",
  "confidence": 0.92
}

Pas de markdown, pas de texte avant ou après le JSON.`,
          },
        },
        {
          heading: "2 — Prefilling : forcer le premier token",
          body: "Dans l'API Messages, vous pouvez fournir le début de la réponse de l'assistant. Claude est <strong>obligé</strong> de continuer à partir de là. Préfiller avec <code>{</code> élimine 100% des préambules type « Voici votre JSON : ».",
        },
        {
          code: {
            lang: "ts",
            label: "Prefilling via SDK",
            code: `const response = await anthropic.messages.create({
  model: "claude-sonnet-4-6",
  max_tokens: 1024,
  messages: [
    { role: "user", content: prompt },
    { role: "assistant", content: "{" }  // 👈 prefill
  ],
});

// La réponse commencera forcément par { — il suffit
// de la reconcaténer avec "{" pour parser du JSON pur.
const json = JSON.parse("{" + response.content[0].text);`,
          },
        },
        {
          callout: {
            type: "warn",
            icon: "⚠️",
            text: "Le prefilling est incompatible avec le mode extended thinking. Si vous combinez les deux, préférez tool use ou un post-processing avec regex.",
          },
        },
        {
          heading: "3 — Tool use : la voie royale",
          body: "Pour une structure garantie, définissez un <em>tool</em> avec un JSON Schema. Claude renvoie alors un appel d'outil strictement conforme — c'est validé côté API. Idéal pour les pipelines de production et les agents.",
        },
        {
          code: {
            lang: "ts",
            label: "Tool use pour structure stricte",
            code: `const tools = [{
  name: "save_article",
  description: "Enregistre un article structuré",
  input_schema: {
    type: "object",
    properties: {
      title: { type: "string" },
      tags: { type: "array", items: { type: "string" } },
      summary: { type: "string", maxLength: 280 },
    },
    required: ["title", "tags", "summary"],
  },
}];

const res = await anthropic.messages.create({
  model: "claude-sonnet-4-6",
  max_tokens: 1024,
  tools,
  tool_choice: { type: "tool", name: "save_article" },
  messages: [{ role: "user", content: prompt }],
});`,
          },
        },
        {
          keypoints: [
            "Toujours montrer un exemple exact du format attendu",
            "Prefilling avec { ou [ supprime les préambules parasites",
            "Tool use + tool_choice forcé = structure 100% garantie",
            "Ne jamais parser à l'aveugle : valider avec Zod ou JSON Schema côté code",
          ],
        },
      ],
    },
    {
      id: "iterate-debug-prompts",
      title: "Itérer et debugger un prompt",
      duration: "10 min",
      tag: "Méthode",
      intro:
        "Un prompt n'est jamais « fini » du premier coup. Voici la méthodologie pour le faire évoluer scientifiquement et éviter les pièges classiques qui dégradent silencieusement la qualité.",
      sections: [
        {
          heading: "La boucle d'amélioration en 4 étapes",
          bullets: [
            "<strong>1. Eval set</strong> — constituer 20 à 50 inputs représentatifs avec sortie attendue",
            "<strong>2. Baseline</strong> — mesurer le prompt actuel (précision, format valide, latence, coût)",
            "<strong>3. Une variable à la fois</strong> — modifier UNE chose et re-mesurer",
            "<strong>4. Garder ou jeter</strong> — accepter le changement seulement si la métrique progresse",
          ],
        },
        {
          callout: {
            type: "info",
            icon: "📊",
            text: "Sans eval set, vous ne faites pas du prompt engineering — vous faites de la divination. 20 cas bien choisis valent mieux que 200 cas aléatoires.",
          },
        },
        {
          heading: "Les anti-patterns qui tuent la qualité",
          table: {
            headers: ["Anti-pattern", "Pourquoi ça casse", "Correction"],
            rows: [
              [
                "Consignes vagues",
                "« Sois concis » est subjectif",
                "« Maximum 3 phrases de 20 mots »",
              ],
              [
                "Négations sans alternative",
                "« Ne fais pas X » → le modèle pense à X",
                "Dire ce qu'il faut faire à la place",
              ],
              [
                "Mur de texte",
                "Instructions noyées, oubliées",
                "Listes, balises XML, sections claires",
              ],
              [
                "Trop de règles contradictoires",
                "Claude choisit au hasard",
                "Hiérarchiser, supprimer les doublons",
              ],
              [
                "Exemples du mauvais format",
                "Few-shot teach le mauvais pattern",
                "Auditer chaque exemple",
              ],
            ],
          },
        },
        {
          code: {
            lang: "ts",
            label: "Mini-runner d'eval",
            code: `const evalSet = [
  { input: "...", expected: "refund" },
  { input: "...", expected: "info" },
  // 20+ cas
];

async function runEval(prompt: string) {
  let pass = 0;
  for (const c of evalSet) {
    const out = await callClaude(prompt, c.input);
    if (out.intent === c.expected) pass++;
  }
  return { accuracy: pass / evalSet.length, n: evalSet.length };
}

const v1 = await runEval(promptV1); // 0.78
const v2 = await runEval(promptV2); // 0.86 ✅ on garde
const v3 = await runEval(promptV3); // 0.81 ❌ on jette`,
          },
        },
        {
          heading: "Debugger un cas qui échoue",
          body: "Quand un input précis donne une mauvaise réponse, ajoutez <strong>temporairement</strong> un bloc <code>&lt;thinking&gt;</code> pour voir le raisonnement du modèle. Vous découvrirez presque toujours que le prompt manque d'une instruction implicite que vous teniez pour acquise.",
        },
        {
          callout: {
            type: "tip",
            icon: "🎯",
            text: "Versionnez vos prompts comme du code : git, numéro de version dans le prompt lui-même, changelog. Un prompt en prod sans historique est une dette technique invisible.",
          },
        },
        {
          keypoints: [
            "Eval set de 20-50 cas = condition non-négociable",
            "Une variable à la fois — sinon on ne sait pas ce qui a marché",
            "Éviter : vague, négations, mur de texte, règles contradictoires",
            "<thinking> temporaire pour debugger les cas qui échouent",
            "Versionner les prompts comme du code source",
          ],
        },
      ],
    },
  ],
};
