# GuildPass Frontend (guildpass-app)

GuildPass is a web3 membership and token-gated community platform. This repository contains the main frontend MVP built with Next.js App Router, TypeScript, Tailwind, shadcn‑style UI components, wagmi/viem, and React Query.

## Features (MVP)

- Member dashboard: wallet connect, membership state, community & tier, expiration, badges placeholder, gated resources, profile summary
- Admin dashboard: overview, member list, role assignment, simple resource access policies, minimal community settings
- Access-gated experiences: gated page, gated content section, event access page, clear denied states, upgrade/renew placeholders
- Wallet-aware UX: connect flow, authenticated member experience, role-aware UI states, admin-only sections
- Local development: mock/demo mode, seeded fake data, typed API layer that swaps between mock and live

## Quick Start

1. Install dependencies
   - Node 18+ recommended
   - `npm install`
2. Run in mock/demo mode
   - `NEXT_PUBLIC_MOCK_MODE=true npm run dev`
3. Open http://localhost:3000

## Environment

- `NEXT_PUBLIC_MOCK_MODE=true` enables the in-memory mock API
- `NEXT_PUBLIC_DEMO_MODE=true` is equivalent to mock mode
- `NEXT_PUBLIC_CORE_API_URL` sets the `guildpass-core` access-api base URL for live mode

## Integration Points

- Access API: `lib/api/live.ts` integrates with `guildpass-core` `/access-api/*`
- Contract clients/ABIs: add viem/wagmi hooks where needed in feature modules
- Shared types: mirrored in `lib/api/types.ts` (to be aligned with `guildpass-core` shared types)

## Architecture

- App Router pages live under `app/*`
- Global providers: `lib/wallet/providers.tsx` wrap wagmi and React Query
- API layer: `lib/api/*` with `getApi(address?)` switching between mock and live
- UI components: minimal shadcn‑style primitives in `components/ui/*`
- Guards: `components/gated.tsx` and `components/admin-guard.tsx`
- Navigation: `components/nav.tsx`

## What’s Implemented vs Deferred

Implemented:
- Core member and admin surfaces listed above
- Basic role assignment and policy editing
- Gated pages and states

Deferred (intentionally):
- Advanced analytics and governance
- Rich profile customization and contribution history
- Social graph and advanced moderation
- Complex admin workflows, rewards visualization, full event management
- Complete billing/subscription management UX

## Development Notes

- Keep feature logic separate from presentational components
- Add loading/empty/error states in feature modules when extending
- Prefer typed APIs and React Query for data fetching

## Scripts

- `npm run dev` – start Next dev server
- `npm run build` – production build
- `npm run start` – start production server
- `npm run lint` – lint via Next
- `npm run typecheck` – TypeScript type checking

