# IA Restaurant

Mémoire persistante du restaurant et copilote de gestion : relevés de caisse, CA et couverts, factures et prix d’ingrédients, recettes, plan de salle, réservations, équipe et consignes.

## Parcours

- `/` : présentation et démonstration intégrée.
- `/demo` : restaurant fictif, réponses préparées, données conservées dans la session du navigateur. Aucun appel à l’IA.
- `/dashboard` : mémoire privée du restaurateur. La création d’un espace et les appels IA nécessitent un abonnement actif.
- La mémoire existante et les opérations manuelles restent accessibles après épuisement des crédits ou expiration de l’abonnement.

La version actuelle accepte la saisie manuelle et le dépôt de PDF/JPG/PNG/WebP (4 Mo). Elle ne connecte pas automatiquement un logiciel de caisse. Les documents reconnus restent des brouillons jusqu’à validation ; les corrections conservent les valeurs précédentes et l’original.

## Crédits

Une lecture de document coûte 12 crédits ; une réponse du copilote coûte 5 crédits. Les calculs et les opérations manuelles coûtent 0 crédit. La réservation des crédits est atomique, les demandes sont identifiées pour éviter une double facturation, et les échecs restituent les crédits. Les crédits inclus sont consommés avant les crédits achetés, qui restent conservés lors des renouvellements.

Les réponses utilisent les données confirmées, les relevés des services comparables, les données de salle/cuisine/équipe et les échanges récents. Les sources sont ouvrables et les données manquantes sont explicites. Le bénéfice ne se déduit pas seulement du CA et des achats.

## Configuration et lancement

Node 20.19+ ou 22.13+, PostgreSQL. `npm ci`, puis `npm run dev`.

Variables serveur : `DATABASE_URL`, `JWT_SECRET`, `ANTHROPIC_API_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PUBLIC_KEY`, prix d’abonnement et de packs Stripe. `RESTAURANT_AI_MODEL` permet de choisir le modèle Anthropic déjà utilisé. Aucun secret ne doit être exposé au client.

Le Dockerfile compile le serveur standalone. Au démarrage, `scripts/migrate-memory.cjs` applique des changements additifs et idempotents ; une erreur arrête le démarrage. Sauvegarder la base avant toute publication. Une compilation réussie ne remplace pas une vérification du site en ligne.

## Vérification

`npm run test:memory` vérifie les règles de calcul, la validation, les conversions d’unités et les affectations de salle.

Les tests de base/API nécessitent `MEMORY_INTEGRATION=1`, le serveur local sur `localhost:3107`, et une base expressément isolée : `postgresql://…@127.0.0.1:56432/ia_restaurant_test`. Les autres bases sont refusées. Ils vérifient la propriété des données, l’accès payant, la persistance, les doublons, les corrections, les conflits de modification, les crédits concurrents, les restitutions et les replays de paiement. L’IA doit rester désactivée pour ces tests. Les comptes de test sont supprimés à la fin.

`npm run build` compile et vérifie les types pour la production.
