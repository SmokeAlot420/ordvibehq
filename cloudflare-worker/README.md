# Flashnet API Proxy - Cloudflare Worker

Bypasses Cloudflare bot detection by running on CF's edge network. Proxies requests to `https://api.amm.flashnet.xyz` with proper CORS headers.

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Login to Cloudflare
```bash
wrangler login
```

This opens your browser for OAuth authentication.

### 3. Get Your Account ID
```bash
wrangler whoami
```

Copy the Account ID shown in the output.

### 4. Configure wrangler.toml
Edit `wrangler.toml` and add your account ID:
```toml
account_id = "your-account-id-here"
```

### 5. Test Locally
```bash
npm run dev
```

In another terminal, test it:
```bash
curl "http://localhost:8787?path=/v1/pools"
```

### 6. Deploy to Cloudflare
```bash
npm run deploy
```

Copy the deployed URL (e.g., `https://flashnet-proxy.YOUR-NAME.workers.dev`)

### 7. Update Client Code
Edit `src/lib/flashnet.ts` and replace `YOUR-ACTUAL-SUBDOMAIN` with your worker subdomain.

## Usage

The worker accepts requests with a `path` query parameter:

```
https://flashnet-proxy.YOUR-NAME.workers.dev?path=/v1/pools
```

This proxies to:
```
https://api.amm.flashnet.xyz/v1/pools
```

## Monitoring

View live logs:
```bash
npm run tail
```

Or check the Cloudflare Dashboard:
1. Go to https://dash.cloudflare.com
2. Click "Workers & Pages"
3. Click "flashnet-proxy"
4. View metrics and logs

## Free Tier Limits

- 100,000 requests/day
- Unlimited bandwidth
- Global edge deployment

## Troubleshooting

If you get "Account ID not found":
- Run `wrangler whoami`
- Copy the Account ID
- Paste into `wrangler.toml`

If environment variable not working:
- Restart Vite dev server
- Check value in browser console

## Files

- `worker.js` - Main proxy logic
- `wrangler.toml` - Worker configuration
- `package.json` - npm scripts
- `.gitignore` - Ignored files
