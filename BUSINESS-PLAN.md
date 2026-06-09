# Business Plan — ia-restaurant.fr

> SaaS IA pour restaurateurs · freemium + abonnement + packs de jetons
> Stack : Next.js 15, auth maison (jose/bcrypt), Postgres, Stripe, **API Claude (Haiku 4.5)**
> Statut : **LIVE** (juin 2026)

## 1. Proposition de valeur

6 outils IA qui font gagner du temps aux restaurateurs, regroupés dans un seul tableau de bord :
- **Menu Engineering** (matrice BCG : stars/énigmes/chevaux de trait/poids morts)
- **Analyse de marges** par plat
- **Générateur de descriptions** de plats (3 tons)
- **Réponses aux avis** Google/TripAdvisor (3 tons)
- **Posts réseaux sociaux** (Insta/Facebook/TikTok)
- **Traduction de menu** (9 langues)

**Différenciateur** : un assistant IA *spécialisé restauration* en français, à prix TPE,
vs ChatGPT générique (que le restaurateur ne sait pas prompter) ou agences marketing (10x le prix).

## 2. Cible

Indépendants et petites chaînes : restaurants, bistrots, food-trucks, cafés, traiteurs.
Décideur = le gérant lui-même. **PAS** de grands groupes (cf. ligne éditoriale particuliers/TPE).

## 3. Modèle économique

**Freemium → abonnement, avec système de jetons** (1 action IA = N jetons) :

| Offre | Prix | Jetons/mois | Restaurants |
|---|---|---|---|
| Free | 0€ | 50 | 1 |
| Pro | **29€/mois** ou 290€/an | 2 000 | 5 |
| Business | **79€/mois** ou 790€/an | 10 000 | illimité |
| Packs jetons (one-time) | 9€ / 29€ / 59€ | 500 / 2 000 / 5 000 | — |

### Structure de coûts — le point CRITIQUE d'un SaaS IA

Contrairement à un SaaS classique, **chaque action a un coût variable réel (API Claude)**.
Protections en place (durcies lors du déploiement) :
- **Modèle Haiku 4.5** (≈3× moins cher que Sonnet) — choisi pour la sécurité de marge.
- **Gating par jetons AVANT chaque appel** (un Free ne peut pas dépasser 50 jetons).
- **Rate-limiting** par utilisateur et par fonction.
- **Cap de longueur d'input** (4 000 caractères) → empêche l'abus par gros prompts.
- **Reset mensuel des jetons** corrigé (était cassé : déclenché en lazy à chaque connexion).

Estimation coût API par action (Haiku 4.5, ~500-2000 tokens out) : **~0,001 à 0,004€**.
→ Un abonné Pro qui consomme ses 2 000 jetons/mois coûte au pire **quelques centimes à <1€** d'API
pour 29€ encaissés. **Marge brute > 95 %** même en usage intensif. L'architecture est saine.

## 4. Unit economics (par client Pro)

| Poste | Mensuel |
|---|---|
| Revenu | 29,00€ |
| Commission Stripe (~1,4 % + 0,25€) | -0,66€ |
| Coût API Claude (usage moyen) | -0,20 à -0,80€ |
| Hébergement marginal | ~0€ (VPS mutualisé) |
| **Marge brute** | **~27,5€ (~95 %)** |

LTV/CAC : avec un churn SaaS typique de 5-8 %/mois, LTV Pro ≈ 350-550€. CAC cible < 100€ pour
un ratio sain (>3:1).

## 5. Acquisition

Domaine neuf, 0 autorité. Canaux par priorité :

1. **SEO local/métier** (déjà câblé : 12 pages SEO, Article+Breadcrumb JSON-LD, og-image, sitemap).
   Requêtes : « répondre aux avis google restaurant », « optimiser carte restaurant »,
   « traduire menu restaurant », « logiciel marge restaurant ».
2. **Prospection directe** (le canal le plus fort en B2B TPE local) : démarchage des restaurants
   d'une ville, démo de l'outil « réponses aux avis » comme produit d'appel (douleur réelle + immédiate).
3. **Partenariats** : grossistes alimentaires, logiciels de caisse, groupements de restaurateurs.
4. **Social** : avant/après de descriptions de plats, posts générés → preuve visuelle.
5. **Free → Pro** : les 50 jetons gratuits laissent goûter ; relance quand le quota est atteint.

## 6. Projections (prudentes, 12 mois)

| Scénario | Free signups cumul | → Pro/Business actifs | MRR (M12) |
|---|---|---|---|
| Bas | 300 | 15 | ~450€ |
| Médian | 1 200 | 70 | ~2 300€ |
| Haut | 3 000 | 200 | ~7 500€ |

Le B2B SaaS monte plus lentement que le B2C mais avec un revenu récurrent et un churn plus bas.
Le scénario médian suppose un effort de prospection directe soutenu (le SEO seul = scénario bas).

## 7. Risques & parades

| Risque | Parade |
|---|---|
| Coût API qui dérape | Déjà bordé (Haiku + gating + caps + rate-limit). Activer une **alerte de budget Anthropic**. |
| Webhook reset jetons cassé | Corrigé (reset lazy à la connexion, plus de dépendance cron). |
| Adoption lente (B2B local) | Prospection directe + produit d'appel « réponses aux avis ». |
| Qualité IA jugée insuffisante | Haiku suffit pour descriptions/avis ; surveiller la satisfaction sur menu/marge, basculer
  ces 2 fonctions sur Sonnet si besoin (coût marginal absorbable vu la marge). |
| Bilingue mais marché FR d'abord | Concentrer l'acquisition FR ; l'EN est un bonus opportuniste. |

## 8. Leviers d'amélioration (backlog)

- Alerte budget Anthropic + dashboard de coût API interne.
- Email transactionnels (bienvenue, quota atteint, reçu) via Mailjet.
- Onboarding guidé (créer son 1ᵉʳ restaurant + 1ʳᵉ action en 2 min).
- Essai Pro 7 jours sans CB pour lever la friction.
- Vérif email + reset mot de passe.

## 9. Verdict

Architecture **saine et désormais autonome** (Clerk retiré → auth maison, plus de dépendance
payante externe ; coût API bordé ; bugs jetons corrigés). Marge brute ~95 % malgré le coût IA.
Le produit est complet et différencié. **Le facteur limitant est l'acquisition B2B** : ce marché
se gagne par la prospection directe et le SEO métier, pas par la viralité. Modèle récurrent =
valeur composée si le churn est maîtrisé.
