# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.


## Task Management

**CRITICAL: Use Archon MCP server for all task management instead of TodoWrite.**

Follow the rules in `.claude/archon_rules.md` for the mandatory task-driven development workflow:
1. Check current tasks with `find_tasks()`
2. Mark task as doing before starting work
3. Research using RAG tools if needed
4. Implement changes
5. Mark task for review when complete

## Project Overview

**BitPlex Dashboard** - Full-featured Spark L2 DEX dashboard with real-time trading data.

**Current Status**: Dashboard fully functional with real Flashnet API integration and working wallet connection.

**Features:**
- **Dashboard Shell**: Sidebar navigation, cyberpunk terminal aesthetic
- **Holder Analytics**: Top holders, distribution charts, Sparkscan API
- **Trading Terminal**: TradingView charts (lightweight-charts), top movers, pools table
- **SparkSwap**: Production-ready swap interface with Flashnet AMM
- **Wallet Integration**: ✅ FIXED - Xverse wallet connects via `wallet_connect` method
- **Authentication**: Challenge-response flow with JWT tokens for Flashnet API

**Tech Context**:
- **Spark**: Bitcoin L2 for instant, self-custodial transactions
- **Flashnet**: AMM DEX on Spark (api.amm.flashnet.xyz)
- **Sparkscan**: Block explorer API for holder data

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
- **React Query** (@tanstack/react-query) for server state
- **React Router v6** for routing
- **lightweight-charts** for TradingView-style charts
- **Sats Connect** for Xverse wallet integration
- **@flashnet/sdk** (v0.4.0) - Official Flashnet SDK for AMM operations
- **Netlify Functions** for serverless API proxy

## Architecture

### Route Structure
```
/                    → Splash page with ENTER TERMINAL button
/dashboard           → Dashboard overview (default)
/dashboard/holders   → Holder analytics
/dashboard/trading   → TradingView charts + top movers
/dashboard/swap      → SparkSwap interface
```

### Key Files
- `src/pages/Index.tsx` - Splash page with ENTER TERMINAL button
- `src/pages/Dashboard.tsx` - Dashboard layout with nested routes
- `src/components/dashboard/` - All dashboard view components
- `src/components/SparkSwap.tsx` - Main swap orchestration (197 lines)
- `src/components/spark-swap/` - Modular swap sub-components

### API Integration

**Flashnet SDK Integration (Official SDK):**
- `src/lib/flashnet-sdk.ts` - ✅ **Official Flashnet SDK wrapper** using modular components
  - Uses `@flashnet/sdk` v0.4.0 (official package from npm)
  - Modular approach: `ApiClient` + `AuthManager` + `TypedAmmApi`
  - Custom signer for Xverse wallet (converts hex ↔ Uint8Array)
  - Bypasses Cloudflare blocking via SDK's built-in API client
  - **Token Metadata**: ✅ Cached from Sparksat + Luminex (22 tokens total)
    - **Sparksat**: 14 tokens (SNOW, USDB, FSPKS, AURORA, UTXO, AKITA, TOTO, BIT, TSPK, BIRD, SCPUM, HOP, XSPK)
    - **Luminex**: 8 tokens (SOON, SATS, BITTY, DRAGON, H0DL, BUTT, BETA, XBT)
    - Sources: https://sparksat.app/sparksat.json + https://luminex.io/spark/discover/tokens
    - Falls back to address prefix for unknown tokens
    - Includes name, ticker, decimals, logoUrl for each token
  - **Status**: ✅ Pool fetching working (100 pools, 3,742 total)
  - **Status**: ✅ Token names displaying correctly (SNOW/BTC instead of address prefixes)
  - **Known issue**: Authentication signer needs debugging for swap execution
  - **Docs**: https://www.npmjs.com/package/@flashnet/sdk

**Legacy/Fallback Files:**
- `src/lib/flashnet.ts` - Legacy Flashnet API client (kept for reference)
- `src/lib/auth.ts` - Legacy authentication (kept for reference)
- `src/lib/sparkscan.ts` - Sparkscan API client (holders, transactions)
- `src/hooks/useFlashnet.ts` - React Query hooks using SDK
- `src/hooks/useSparkscan.ts` - React Query hooks for Sparkscan
- `src/hooks/useSparkWallet.ts` - Xverse wallet integration ✅ FIXED

### Wallet Connection (FIXED)
**Critical Fix Applied:**
- Changed from `spark_getAddresses` → `wallet_connect` for initial connection
- This shows the Xverse popup correctly (previous method required prior permission)
- Added proper `RpcErrorCode` imports for error handling
- Fixed balance fetching: `undefined` parameter instead of `{}`
- Fixed message signing: removed incorrect `address` parameter
- Removed all `as any` type casts for proper TypeScript safety

**Authentication Flow (using @flashnet/sdk):**
1. User connects wallet via `wallet_connect` → Xverse popup appears
2. User approves → get address and publicKey
3. SDK's `AuthManager` handles authentication:
   - Requests challenge from `/v1/auth/challenge`
   - Custom signer converts Uint8Array ↔ hex for Xverse wallet
   - Signs challenge and sends to `/v1/auth/verify`
   - SDK manages JWT token internally
4. All SDK API calls automatically include auth token
5. **Current status**: Pool fetching works (public data), authentication for swaps needs debugging

### Proxy Infrastructure
- `netlify/functions/flashnet-proxy.ts` - CORS proxy for Flashnet API (development)
- `cloudflare-worker/` - Cloudflare Worker proxy (production: flashnet-proxy.degensmoke.workers.dev)

### Visual Components
- Terminal aesthetic with emerald green (#34d399) accents
- Cyberpunk styling throughout
- lightweight-charts for TradingView-style charts

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
