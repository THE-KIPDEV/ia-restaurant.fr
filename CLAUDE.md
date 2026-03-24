# IA Restaurant — ia-restaurant.fr

## Overview
AI-powered SaaS for restaurant owners. Futuristic dark theme. Bilingual FR/EN.
Uses Claude API (Anthropic SDK) for all AI features. Token-based usage system.

## Tech Stack
- **Framework:** Next.js 15 (App Router, Server Components)
- **Auth:** Clerk (@clerk/nextjs)
- **Payments:** Stripe (subscriptions + one-time token packs)
- **Database:** Prisma + PostgreSQL
- **AI:** Anthropic Claude SDK (@anthropic-ai/sdk)
- **Styling:** Tailwind CSS 4, dark-first theme, CSS variables
- **Deploy:** Railway (Docker, standalone output)

## Architecture
- `src/lib/ai.ts` — Claude API wrapper, all AI tool functions
- `src/lib/tokens.ts` — Token consumption/balance logic
- `src/lib/stripe.ts` — Plans + token pack definitions
- `src/lib/auth.ts` — Clerk helpers (getCurrentUser, requireUser, requireAdmin)
- `src/lib/i18n.ts` — FR/EN translations
- `src/middleware.ts` — Clerk route protection

## AI Features & Token Costs
| Feature | Tokens | Route |
|---------|--------|-------|
| Menu Engineering Analysis | 30 | POST /api/ai/menu-analysis |
| Dish Description Generator | 5 | POST /api/ai/dish-description |
| Review Response Generator | 5 | POST /api/ai/review-response |
| Social Media Post | 5 | POST /api/ai/social-post |
| Menu Translation | 10 | POST /api/ai/translate |
| Margin Analysis | 20 | POST /api/ai/margin-analysis |

## Pricing
- **Free:** 50 tokens/month, 1 restaurant
- **Pro (€29/mo | €290/yr):** 2,000 tokens/month, 5 restaurants
- **Business (€79/mo | €790/yr):** 10,000 tokens/month, unlimited restaurants
- **Token Packs (one-time):** 500 (€9), 2,000 (€29), 5,000 (€59)

## Commands
```bash
npm run dev          # Dev server
npm run build        # Build (includes prisma generate)
npm run db:push      # Sync schema
npm run db:migrate   # Create migration
npm run db:studio    # Prisma Studio
npm run stripe:listen # Local Stripe webhooks
```

## Key Patterns
- All AI routes check token balance before calling Claude
- Token deduction happens AFTER successful AI response
- Streaming responses for long AI outputs
- Rate limiting on all API routes
- i18n via cookie `locale` (fr default, en)
