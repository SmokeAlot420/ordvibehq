# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**OrdVibeHQ / VibeCoders** - A BitPlex experiment on Spark (Bitcoin L2). Genesis NFT collection launching on BitPlex with permanent Arweave storage.

**Current Status**: Whitelist closed (~900 wallets collected). Site now displays "whitelist sealed" state.

**Tech Context**:
- **BitPlex**: NFT protocol on Spark with Arweave permanence
- **Spark**: Bitcoin L2 for instant, self-custodial transactions
- **Arweave**: Permanent decentralized storage for NFT metadata/media

**Note**: Alkanes (Bitcoin L1 metaprotocol) experiments are still cooking in the background - different lane, same mission.

## Commands

```bash
npm run dev       # Start dev server at localhost:7777 (auto-fallback to 7778+)
npm run build     # Production build to dist/
npm run build:dev # Development build with sourcemaps
npm run lint      # ESLint check
npm run preview   # Preview production build
```

## Tech Stack

- **React 18 + TypeScript + Vite** (SWC compiler)
- **Tailwind CSS** + shadcn/ui components
- **Framer Motion** for animations
- **Supabase** for waitlist storage (legacy - form now closed)
- **React Query** for server state
- **React Router v6** for routing

## Architecture

### Key Files
- `src/pages/Index.tsx` - Main landing page (whitelist closed state)
- `src/components/AnimatedTestTube.tsx` - Hero animation with rotating messages
- `src/components/BioTerminal.tsx` - Terminal-style status display `[BITPLEX://SPARK]`
- `src/components/AppleBackground.tsx` - Particle system background
- `src/components/AmbientMusic.tsx` - Background audio player

### Visual Components
- Test tube animation with chemistry/genesis themed messages
- Terminal aesthetic with emerald green accents
- Glass morphism UI elements

### Legacy (Form Closed)
- `src/lib/supabase.ts` - Typed Supabase client
- `src/lib/database.types.ts` - Database schema types
- `src/constants/index.ts` - Validation patterns (no longer used)
- `src/constants/chemistryMessages.ts` - Chemistry-themed messages

## Path Aliases

`@/*` maps to `./src/*` (configured in tsconfig.json and vite.config.ts)

## Deployment

Hosted on Netlify. SPA routing handled via `[[redirects]]` in `netlify.toml`.
Build output: `dist/`

## Brand Guidelines

- Dark/cyber/lab/terminal vibes
- No corporate tone, keep it underground
- Protocol references: `[BITPLEX://SPARK]`, `BitPlex://genesis`
- Tagline: "BitPlex://genesis: activation sequence initiated"
