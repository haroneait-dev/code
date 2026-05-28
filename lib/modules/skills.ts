import type { Module } from "../curriculum";

export const skillsModule: Module = {
  id: "skills",
  title: "Skills (Agent SDK)",
  emoji: "🧩",
  color: "#9a8060",
  lessons: [
    {
      id: "what-are-skills",
      title: "Skills, agents et MCP — quelle différence ?",
      duration: "8 min",
      tag: "Fondamentaux",
      intro:
        "Trois concepts qui se ressemblent, mais qui ne résolvent pas du tout le même problème. Avant de coder un skill, encore faut-il savoir si c'est bien ce dont vous avez besoin.",
      sections: [
        {
          heading: "Le trio Skills / Agents / MCP",
          body: "Claude Code propose <strong>trois mécanismes d'extension</strong> qu'on confond souvent. Chacun a son rôle précis :",
          bullets: [
            "<strong>Skill</strong> — une <em>capability réutilisable</em> packagée dans un dossier (un <code>SKILL.md</code> + des fichiers). Claude la charge à la demande.",
            "<strong>Agent</strong> — un <em>task delegate</em>, une sous-instance de Claude lancée pour une tâche spécifique (recherche, refacto, test...).",
            "<strong>MCP</strong> — un <em>serveur externe</em> (Model Context Protocol) qui expose des outils et des ressources à Claude (Postgres, Slack, GitHub...).",
          ],
        },
        {
          heading: "Comparaison rapide",
          table: {
            headers: ["Critère", "Skill", "Agent", "MCP"],
            rows: [
              ["Forme", "Dossier + markdown", "Prompt + tools", "Serveur (stdio/http)"],
              ["Vit où ?", "Dans le repo / global", "Spawn à la volée", "Process externe"],
              ["Quand l'utiliser ?", "Procédure répétable", "Sous-tâche isolée", "Accès à un système"],
              ["Exemples", "pdf-fill, scrape-web", "code-reviewer, tester", "supabase, github, slack"],
            ],
          },
        },
        {
          heading: "Quand choisir un skill ?",
          body: "Un skill est le bon choix dès que vous vous retrouvez à <strong>répéter les mêmes instructions</strong> à Claude (\"d'abord lis le fichier X, puis applique le format Y, puis génère Z\"). Le skill encode ce workflow une bonne fois.",
          callout: {
            type: "tip",
            icon: "💡",
            text: "Règle simple : si tu pourrais l'écrire dans un Notion comme procédure, c'est un skill. Si ça nécessite du code qui tourne en continu, c'est un MCP.",
          },
        },
        {
          heading: "Exemple de skill minimal",
          code: {
            lang: "markdown",
            label: "skills/commit-helper/SKILL.md",
            code: `---
name: commit-helper
description: Génère un message de commit conventionnel à partir du diff staged
allowed-tools: Bash(git diff:*), Bash(git status:*)
---

# Commit Helper

1. Lis le diff staged via \`git diff --cached\`
2. Identifie le type (feat, fix, refactor, docs, chore)
3. Propose un message au format Conventional Commits
4. Demande validation avant de committer`,
          },
        },
        {
          keypoints: [
            "Skill = procédure réutilisable, sous forme de dossier + SKILL.md",
            "Agent = sous-tâche déléguée (one-shot)",
            "MCP = serveur externe qui expose des outils en continu",
            "Si tu te répètes plus de 3 fois → c'est un skill",
          ],
        },
      ],
    },
    {
      id: "anatomy-skill",
      title: "Anatomie d'un SKILL.md",
      duration: "10 min",
      tag: "Technique",
      intro:
        "Un skill, c'est juste un dossier avec un fichier markdown très structuré. Décortiquons chaque partie : frontmatter, allowed-tools, corps de la procédure.",
      sections: [
        {
          heading: "Structure d'un dossier skill",
          body: "Un skill vit dans <code>.claude/skills/&lt;nom&gt;/</code> (local au projet) ou dans <code>~/.claude/skills/</code> (global). Voici la structure typique :",
          code: {
            lang: "bash",
            label: "Arborescence type",
            code: `.claude/skills/pdf-fill/
├── SKILL.md           # obligatoire : description + procédure
├── templates/
│   └── invoice.pdf    # ressources annexes
├── scripts/
│   └── fill.py        # scripts exécutables
└── examples/
    └── sample.json    # exemples d'input`,
          },
        },
        {
          heading: "Le frontmatter YAML",
          body: "C'est l'<strong>en-tête</strong> du SKILL.md. Claude le lit pour décider quand activer le skill. Trois champs importants :",
          bullets: [
            "<code>name</code> — slug unique (kebab-case), sert d'identifiant",
            "<code>description</code> — <strong>critique</strong> : c'est ce que Claude lit pour décider d'activer le skill. Sois précis sur le <em>quand</em>",
            "<code>allowed-tools</code> — whitelist d'outils que le skill peut utiliser (avec patterns)",
          ],
        },
        {
          heading: "Exemple complet",
          code: {
            lang: "markdown",
            label: "SKILL.md complet",
            code: `---
name: pdf-fill
description: Remplit un PDF formulaire à partir d'un JSON. À utiliser quand l'utilisateur fournit un template PDF et des données structurées.
allowed-tools:
  - Read
  - Write
  - Bash(python3:*)
  - Bash(ls:*)
---

# PDF Fill

Tu remplis un PDF formulaire à partir de données JSON.

## Procédure

1. **Identifie le template** : cherche un .pdf dans \`templates/\` ou demande à l'utilisateur
2. **Valide le JSON** : champs requis = name, date, amount
3. **Exécute le script** :
   \`\`\`bash
   python3 scripts/fill.py --template templates/invoice.pdf --data input.json --out result.pdf
   \`\`\`
4. **Vérifie** : ouvre le PDF résultant et confirme à l'utilisateur

## Notes
- Si un champ manque, demande avant d'exécuter
- Ne JAMAIS modifier le template d'origine`,
          },
        },
        {
          heading: "Le piège du <code>description</code>",
          callout: {
            type: "warn",
            icon: "⚠️",
            text: "La description doit indiquer QUAND utiliser le skill, pas juste CE QU'IL FAIT. \"Génère un PDF\" est mauvais. \"À utiliser quand l'utilisateur fournit un template PDF et des données JSON à remplir\" est bon.",
          },
        },
        {
          heading: "Patterns pour allowed-tools",
          table: {
            headers: ["Pattern", "Effet"],
            rows: [
              ["Read", "Autorise l'outil Read sans restriction"],
              ["Bash(git diff:*)", "Bash uniquement pour git diff (tous les flags)"],
              ["Bash(npm test)", "Bash uniquement pour la commande exacte"],
              ["Write(./out/*)", "Write uniquement dans le dossier out/"],
            ],
          },
        },
        {
          keypoints: [
            "Un skill = dossier avec SKILL.md à la racine",
            "Le frontmatter YAML déclare name, description, allowed-tools",
            "La description doit dire QUAND activer le skill",
            "allowed-tools supporte des patterns (Bash(cmd:*)) pour sandboxer",
            "Le corps markdown est une procédure étape par étape",
          ],
        },
      ],
    },
    {
      id: "install-and-use-skills",
      title: "Installer et utiliser des skills",
      duration: "9 min",
      tag: "Pratique",
      intro:
        "Trois façons d'ajouter des skills à ton Claude Code : via le registry, manuellement, ou en clonant un repo Git. Et deux façons de les déclencher.",
      sections: [
        {
          heading: "Méthode 1 — Le registry officiel",
          body: "Le plus simple : utiliser <code>claude-mem</code> (le gestionnaire de skills communautaires) pour installer un skill publié.",
          code: {
            lang: "bash",
            label: "Installation via npx",
            code: `# Lister les skills disponibles
npx claude-mem list

# Installer un skill (global)
npx claude-mem add pdf-fill

# Installer dans le projet courant
npx claude-mem add pdf-fill --local

# Mettre à jour
npx claude-mem update pdf-fill`,
          },
        },
        {
          heading: "Méthode 2 — Installation manuelle",
          body: "Tu peux simplement <strong>copier un dossier</strong> dans le bon emplacement :",
          bullets: [
            "<code>.claude/skills/&lt;nom&gt;/</code> → skill spécifique au projet (commit dans Git)",
            "<code>~/.claude/skills/&lt;nom&gt;/</code> → skill global, dispo sur tous tes projets",
            "Pas besoin de redémarrer Claude Code, c'est détecté au prochain message",
          ],
        },
        {
          heading: "Méthode 3 — Depuis un repo Git",
          code: {
            lang: "bash",
            label: "Clone direct",
            code: `# Cloner dans le dossier global
cd ~/.claude/skills
git clone https://github.com/acme/awesome-skill.git

# Ou en sous-module dans ton projet
cd .claude/skills
git submodule add https://github.com/acme/awesome-skill.git`,
          },
        },
        {
          heading: "Activation : auto vs manuelle",
          body: "Une fois installé, un skill peut s'activer de deux manières :",
          table: {
            headers: ["Mode", "Comment ça marche", "Quand l'utiliser"],
            rows: [
              ["Auto", "Claude lit la description et active si pertinent", "Skills à usage fréquent et bien décrits"],
              ["Slash command", "/skill nom-du-skill", "Skills sensibles ou que tu veux contrôler"],
            ],
          },
        },
        {
          heading: "Vérifier que ça marche",
          callout: {
            type: "success",
            icon: "✅",
            text: "Tape /skills dans Claude Code pour voir la liste des skills chargés, leur source (local/global) et leur statut (actif/désactivé).",
          },
        },
        {
          heading: "Désactiver temporairement",
          code: {
            lang: "bash",
            label: "Gestion fine",
            code: `# Désactiver un skill sans le supprimer
npx claude-mem disable pdf-fill

# Réactiver
npx claude-mem enable pdf-fill

# Supprimer définitivement
npx claude-mem remove pdf-fill`,
          },
        },
        {
          keypoints: [
            "3 méthodes d'install : registry (npx claude-mem add), manuelle (copie dossier), Git",
            "Local = .claude/skills/, global = ~/.claude/skills/",
            "Activation auto via description, ou manuelle via /skill",
            "/skills liste tout ce qui est chargé",
          ],
        },
      ],
    },
    {
      id: "create-custom-skill",
      title: "Créer son premier skill custom",
      duration: "15 min",
      tag: "Avancé",
      intro:
        "On passe à la pratique : on crée un skill <code>release-notes</code> qui génère un changelog à partir des commits Git, on le teste localement, puis on le publie sur npm.",
      sections: [
        {
          heading: "Étape 1 — Scaffolding",
          code: {
            lang: "bash",
            label: "Création du dossier",
            code: `mkdir -p .claude/skills/release-notes/{scripts,examples}
cd .claude/skills/release-notes
touch SKILL.md
touch scripts/extract-commits.sh
chmod +x scripts/extract-commits.sh`,
          },
        },
        {
          heading: "Étape 2 — Écrire le SKILL.md",
          code: {
            lang: "markdown",
            label: ".claude/skills/release-notes/SKILL.md",
            code: `---
name: release-notes
description: Génère des release notes au format Markdown à partir des commits depuis le dernier tag Git. À utiliser quand l'utilisateur demande un changelog ou des notes de version.
allowed-tools:
  - Read
  - Write
  - Bash(git log:*)
  - Bash(git tag:*)
  - Bash(./scripts/extract-commits.sh:*)
---

# Release Notes Generator

## Procédure

1. **Trouve le dernier tag** : \`git describe --tags --abbrev=0\`
2. **Extrais les commits** depuis ce tag avec le script fourni
3. **Catégorise** par type (feat, fix, docs, chore) en parsant les messages Conventional Commits
4. **Génère** le markdown au format ci-dessous
5. **Écris** le résultat dans \`CHANGELOG.md\` (en append au début)

## Format de sortie

\\\`\\\`\\\`markdown
## [vX.Y.Z] — YYYY-MM-DD

### Features
- ...

### Fixes
- ...
\\\`\\\`\\\`

## Notes
- Ignorer les commits "Merge branch..."
- Si aucun tag, partir du premier commit`,
          },
        },
        {
          heading: "Étape 3 — Le script helper",
          code: {
            lang: "bash",
            label: "scripts/extract-commits.sh",
            code: `#!/usr/bin/env bash
set -euo pipefail

LAST_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "")

if [ -z "$LAST_TAG" ]; then
  git log --pretty=format:"%h %s"
else
  git log "$LAST_TAG"..HEAD --pretty=format:"%h %s"
fi`,
          },
        },
        {
          heading: "Étape 4 — Tester en local",
          body: "Ouvre Claude Code dans le projet, et lance simplement :",
          bullets: [
            "<code>Génère-moi les release notes pour la v1.2.0</code> → le skill devrait s'activer auto",
            "Sinon, force-le : <code>/skill release-notes</code>",
            "Vérifie que les commits sont bien parsés et que le CHANGELOG.md est créé",
          ],
          callout: {
            type: "tip",
            icon: "🧪",
            text: "Itère sur la description du frontmatter jusqu'à ce que l'activation auto fonctionne. C'est 80% du travail.",
          },
        },
        {
          heading: "Étape 5 — Publier sur npm",
          code: {
            lang: "bash",
            label: "package.json + publish",
            code: `# Crée un package.json à la racine du skill
cat > package.json <<EOF
{
  "name": "@acme/skill-release-notes",
  "version": "1.0.0",
  "description": "Génère des release notes depuis Git",
  "claudeSkill": true,
  "files": ["SKILL.md", "scripts/", "examples/"],
  "keywords": ["claude-code", "skill", "changelog"]
}
EOF

# Publish
npm publish --access public

# Les utilisateurs pourront installer via :
# npx claude-mem add @acme/skill-release-notes`,
          },
        },
        {
          heading: "Quelques idées de skills à créer",
          bullets: [
            "<strong>db-migrate</strong> — génère une migration Supabase depuis un changement de schéma",
            "<strong>component-gen</strong> — scaffolde un composant React + tests + Storybook",
            "<strong>i18n-extract</strong> — extrait les strings hardcodés et génère un fichier de traduction",
            "<strong>perf-audit</strong> — lance Lighthouse et résume les actions prioritaires",
          ],
          callout: {
            type: "info",
            icon: "📦",
            text: "Avant de publier sur npm, vérifie qu'aucun skill équivalent n'existe déjà dans le registry. Contribuer à un skill existant > en créer un doublon.",
          },
        },
        {
          keypoints: [
            "Scaffolding : mkdir + SKILL.md + scripts/",
            "La description du frontmatter conditionne l'activation auto — soigne-la",
            "Tester avant de publier : Claude Code recharge automatiquement",
            "Publier via npm avec le flag claudeSkill: true",
            "Toujours chercher un skill existant avant d'en créer un nouveau",
          ],
        },
      ],
    },
  ],
};
