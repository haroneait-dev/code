# Vérifier la formation et le design

## Contrôles sans navigateur

```bash
npm ci
npm run test:curriculum
npm run build
node scripts/check-contrast.cjs
```

`prebuild` lance automatiquement `scripts/check-curriculum.ts` avec le compilateur TypeScript déjà installé. Aucune dépendance de production ou de développement n’a été ajoutée.

Le contrôle exige des liens internes existants, des sources externes officielles, des prérequis sans cycle, trois questions par quiz avec un indice de réponse valide et unique, des objectifs et des points à retenir, des projets complets et des durées cohérentes. Les tests négatifs injectent volontairement des erreurs pour vérifier leur rejet.

## Contrôles dans Chrome avec Playwright

Démarrez le build de production avec `npm run start`. Playwright doit être disponible dans l’environnement de QA ; `PLAYWRIGHT_MODULE` peut désigner son chemin absolu et `CHROME_PATH` un navigateur déjà installé. `QA_BASE_URL` permet de choisir une autre origine locale.

```bash
node scripts/capture-design.cjs apres
node scripts/verify-learning.cjs
```

Les captures comparent 390 × 900 et 1440 × 900, en clair et sombre, avec la réduction des animations. Le format PNG est utilisé pour les documents dépassant la hauteur maximale du JPEG. Toute capture vide fait échouer le script.

Le test fonctionnel contrôle tous les modules et toutes les leçons dans les deux thèmes à 390 px, le filtre de niveau, les quiz corrigés, les métadonnées, le JSON-LD, la progression après rechargement et le stockage refusé ou corrompu. Il vérifie également le focus du menu mobile, sa boucle de tabulation et sa fermeture par Échap.

Les rapports sont conservés dans `docs/captures/`. Les captures initiales proviennent du commit de départ, les captures finales du build livré. La route historique `/experience` est redirigée vers `/` par le proxy existant : son comportement est conservé.

Le contrôle de contraste couvre les paires principales de jetons de texte, sans prétendre remplacer une revue complète d’accessibilité. Les Core Web Vitals réels, Safari mobile et le déploiement Vercel ne sont pas validés par ces contrôles locaux.
