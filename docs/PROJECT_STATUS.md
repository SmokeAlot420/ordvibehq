# BitPlex Dashboard - Project Status

> Last Updated: December 11, 2025

## Executive Summary

BitPlex Dashboard is a full-featured Spark L2 DEX interface with real-time trading data, holder analytics, and swap functionality. The project is **85% complete** with 5 of 6 phases finished.

---

## Phase Completion Status

| Phase | Status | Completion |
|-------|--------|------------|
| Phase 1: Real API Integration | ✅ Complete | 100% |
| Phase 2: Dashboard Shell | ✅ Complete | 100% |
| Phase 3: Holder Analytics | ✅ Complete | 100% |
| Phase 4: Trading Charts | ✅ Complete | 100% |
| Phase 5: Wallet + SparkSwap | ✅ Complete | 100% |
| Phase 6: LLM Chat Widget | 🔲 Pending | 0% |

**Overall Progress: 5/6 phases complete (83%)**

---

## What's Been Done

### Phase 1: Real API Integration ✅

**Goal:** Replace mock data with real Flashnet + Sparkscan APIs

**Deliverables:**
- `src/lib/flashnet.ts` - Complete Flashnet AMM API client
  - Pool fetching with pagination and sorting
  - Swap simulation and execution
  - OHLCV data for charts
  - Top movers calculation
  - Token metadata resolution

- `src/lib/sparkscan.ts` - Sparkscan API client
  - Holder data fetching
  - Transaction history
  - Token statistics

- `src/hooks/useFlashnet.ts` - React Query hooks
  - `usePools()` - Fetch all pools with caching
  - `usePool(id)` - Fetch single pool
  - `useSwapQuote(params)` - Real-time swap quotes
  - `useExecuteSwap()` - Mutation for swap execution
  - `usePoolOHLCV(poolId, interval)` - Chart data
  - `useTopMovers(limit)` - Top gainers/losers

- `src/hooks/useSparkscan.ts` - React Query hooks
  - `useHolders(tokenId)` - Token holder list
  - `useTokenStats(tokenId)` - Holder statistics

- `netlify/functions/flashnet-proxy.ts` - CORS proxy
  - Bypasses browser CORS restrictions
  - Works in both dev (Vite proxy) and prod (Netlify function)

**Technical Notes:**
- API Base: `https://api.amm.flashnet.xyz`
- CORS Issue: Flashnet API doesn't send CORS headers, solved with serverless proxy
- Fallback: Mock data available if API fails (controlled by `VITE_USE_MOCK_DATA`)

---

### Phase 2: Dashboard Shell ✅

**Goal:** Set up routing and dashboard layout

**Deliverables:**
- `src/pages/Index.tsx` - Splash page with "ENTER TERMINAL" button
- `src/pages/Dashboard.tsx` - Dashboard wrapper with nested routes
- `src/components/dashboard/DashboardLayout.tsx` - Main layout component
- `src/components/dashboard/DashboardSidebar.tsx` - Navigation sidebar
- `src/components/dashboard/DashboardHeader.tsx` - Top header bar

**Route Structure:**
```
/                    → Splash page (ENTER TERMINAL)
/dashboard           → Overview (default view)
/dashboard/holders   → Holder analytics
/dashboard/trading   → Trading charts + top movers
/dashboard/swap      → SparkSwap interface
```

**Design System:**
- Cyberpunk terminal aesthetic
- Primary color: Emerald green (#34d399)
- Background: Dark with subtle gradients
- Monospace fonts: JetBrains Mono, Fira Code
- Glass morphism effects on panels

---

### Phase 3: Holder Analytics ✅

**Goal:** Show who holds what, collection breakdown

**Deliverables:**
- `src/components/dashboard/HoldersView.tsx` - Main holder analytics view
  - Top holders table with address, balance, percentage
  - Holder distribution chart
  - Token/collection breakdown
  - Real-time data from Sparkscan API

**Features:**
- Paginated holder list
- Percentage of total supply calculation
- Whale detection indicators
- Refresh functionality

---

### Phase 4: Trading Charts ✅

**Goal:** TradingView-style charts with top movers

**Deliverables:**
- `src/components/dashboard/TradingView.tsx` - Main trading view
  - Top Gainers panel (24h)
  - Top Losers panel (24h)
  - All Pools table with sortable columns
  - Integrated price chart

- `src/components/dashboard/TradingChart.tsx` - Candlestick chart component
  - Uses `lightweight-charts` library
  - Pool selector dropdown
  - Timeframe buttons: 1m, 5m, 15m, 1H, 4H, 1D
  - Volume bars below candlesticks
  - Auto-refresh based on interval
  - Cyberpunk styling (green up, red down)

**Dependencies Added:**
- `lightweight-charts` - TradingView's open-source charting library

**Chart Features:**
- Candlestick + Volume histogram
- Crosshair with price/time labels
- Auto-resize on window changes
- Loading/error states
- Pool switching without page reload

---

### Phase 5: Wallet Fix + SparkSwap Refactor ✅

**Goal:** Fix wallet connection issues and modularize SparkSwap component

**5a: Wallet Connection Fix**

`src/hooks/useSparkWallet.ts` enhancements:
- `detectXverseWallet()` function - Checks if extension installed
- `isExtensionInstalled` flag - Boolean for UI conditionals
- `installUrl` export - Link to xverse.app download
- Specific error messages:
  - User rejected connection
  - Wallet locked
  - Connection timeout
  - Extension not found
- Auto-fetch balance after connection
- Proper cleanup on disconnect

**5b: SparkSwap Refactor**

Original: 835 lines in single file
Refactored: 197 lines + 10 sub-components

```
src/components/
├── SparkSwap.tsx                    (197 lines - orchestration only)
└── spark-swap/
    ├── index.ts                     (barrel export)
    ├── spark-terminal.css           (280 lines - extracted styles)
    ├── SwapHeader.tsx               (20 lines)
    ├── SwapConnectGate.tsx          (56 lines)
    ├── WalletBar.tsx                (22 lines)
    ├── PoolSelector.tsx             (52 lines)
    ├── SwapDirection.tsx            (42 lines)
    ├── SwapInput.tsx                (31 lines)
    ├── QuoteDisplay.tsx             (64 lines)
    ├── SlippageSettings.tsx         (43 lines)
    └── SwapResult.tsx               (31 lines)
```

**Benefits:**
- Single responsibility per component
- Easier testing and maintenance
- Reusable components (QuoteDisplay, SlippageSettings)
- CSS isolated in dedicated file
- Clear data flow through props

---

## What Needs To Be Done

### Phase 6: LLM Chat Widget 🔲

**Goal:** AI assistant to guide users, explain DEX terms, answer questions

**Decision Required:** Deployment approach

| Option | Pros | Cons |
|--------|------|------|
| **WebLLM (Browser)** | No server costs, works offline, privacy | ~2GB download, slower on weak devices |
| **llama.cpp (Server)** | Fast responses, consistent UX | $5-10/mo server cost, latency |

**Recommended:** WebLLM for cost-free deployment

**Implementation Plan:**

1. **Create ChatWidget component** (~150 lines)
   - Minimizable floating widget
   - Bottom-right positioning
   - Terminal-style UI matching site aesthetic
   - Message history with user/assistant distinction
   - Typing indicator during generation

2. **Create useWebLLM hook** (~100 lines)
   - Model loading with progress indicator
   - Streaming response generation
   - Conversation history management
   - Error handling for unsupported browsers

3. **System Prompt** for DEX guidance:
   ```
   You are BitPlex Assistant, an AI helper for the BitPlex DEX on Spark L2.
   Help users understand:
   - How to swap tokens
   - What slippage means
   - How to read charts
   - Pool mechanics and fees
   - Wallet connection issues
   Keep responses concise and friendly.
   ```

4. **Model Selection:**
   - Recommended: Phi-3-mini (3.8B) or Gemma-2B
   - Good balance of quality vs size
   - ~1-2GB download

**Files to Create:**
- `src/components/dashboard/ChatWidget.tsx`
- `src/hooks/useWebLLM.ts`
- `src/lib/webllm.ts` (optional utilities)

**Estimated Effort:** 4-6 hours

---

## Technical Architecture

### Directory Structure
```
src/
├── pages/
│   ├── Index.tsx              # Splash page
│   ├── Dashboard.tsx          # Dashboard with nested routes
│   └── NotFound.tsx           # 404 page
├── components/
│   ├── dashboard/
│   │   ├── DashboardLayout.tsx
│   │   ├── DashboardSidebar.tsx
│   │   ├── DashboardHeader.tsx
│   │   ├── OverviewView.tsx
│   │   ├── HoldersView.tsx
│   │   ├── TradingView.tsx
│   │   ├── TradingChart.tsx
│   │   ├── SwapView.tsx
│   │   └── ChatWidget.tsx     # TODO
│   ├── SparkSwap.tsx
│   └── spark-swap/            # Modular swap components
├── hooks/
│   ├── useFlashnet.ts         # Flashnet React Query hooks
│   ├── useSparkscan.ts        # Sparkscan React Query hooks
│   ├── useSparkWallet.ts      # Wallet connection
│   └── useWebLLM.ts           # TODO
├── lib/
│   ├── flashnet.ts            # Flashnet API client
│   ├── sparkscan.ts           # Sparkscan API client
│   └── webllm.ts              # TODO
└── netlify/
    └── functions/
        └── flashnet-proxy.ts  # CORS proxy
```

### Data Flow
```
User Action → React Component → React Query Hook → API Client → Proxy → External API
                    ↓                   ↓
               Local State         Query Cache
```

### Key Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| react | 18.3.1 | UI framework |
| @tanstack/react-query | 5.56.2 | Server state management |
| react-router-dom | 6.26.2 | Routing |
| lightweight-charts | latest | TradingView charts |
| sats-connect | 4.2.1 | Xverse wallet |
| framer-motion | 12.18.1 | Animations |

---

## Known Issues & Considerations

### CORS Proxy
- Flashnet API doesn't include CORS headers
- Solution: Netlify serverless function proxies all requests
- Dev: Vite proxy handles same path locally
- Prod: Netlify function handles it

### Mock Data Fallback
- If API fails, falls back to mock data
- Controlled by `VITE_USE_MOCK_DATA=true` env var
- Mock data in `src/lib/flashnet.ts` lines 260-330

### OHLCV Data
- Currently returns mock data (TODO in flashnet.ts:579)
- Waiting for Flashnet to provide OHLCV endpoint
- Charts will work with real data once available

### Wallet Detection
- Only Xverse wallet currently supported
- Extension detection checks `window.XverseProviders`
- Falls back to install prompt if not detected

---

## Deployment

### Netlify Configuration
```toml
[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"

[functions]
  node_bundler = "esbuild"
```

### Environment Variables
| Variable | Required | Description |
|----------|----------|-------------|
| VITE_SUPABASE_URL | Yes | Supabase project URL |
| VITE_SUPABASE_ANON_KEY | Yes | Supabase anon key |
| VITE_USE_MOCK_DATA | No | Force mock data (dev only) |

---

## Next Steps (Priority Order)

1. **Test real API data** - Refresh dashboard, verify real Flashnet data displays
2. **Phase 6: LLM Chat** - Implement WebLLM-based assistant
3. **Polish UI** - Fine-tune responsive design, loading states
4. **Performance audit** - Lighthouse scores, bundle size optimization
5. **User testing** - Get feedback on UX flow

---

## Git History

| Commit | Description |
|--------|-------------|
| `148ba53` | feat: complete BitPlex dashboard with real Flashnet API integration |
| `1b03c0b` | style: enhance UI with cyberpunk terminal aesthetics |
| `2c41360` | feat: rebrand from Alkanes to BitPlex on Spark |

---

## Contact

**Project:** BitPlex Dashboard
**Repo:** https://github.com/SmokeAlot420/alkanes-coming-soon
**Maintainer:** SmokeDev
