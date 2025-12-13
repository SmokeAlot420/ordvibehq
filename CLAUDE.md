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
- `src/lib/flashnet.ts` - Flashnet AMM API client (pools, swaps, OHLCV)
- `src/lib/auth.ts` - Flashnet authentication (challenge-response, JWT management)
- `src/lib/sparkscan.ts` - Sparkscan API client (holders, transactions)
- `src/hooks/useFlashnet.ts` - React Query hooks for Flashnet
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

**Authentication Flow:**
1. User connects wallet via `wallet_connect` → Xverse popup appears
2. User approves → get address and publicKey
3. Auto-authenticate with Flashnet via challenge-response
4. Sign challenge with wallet → get JWT token
5. Include token in all API requests
6. Auto-refresh token before 1-hour expiry

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
