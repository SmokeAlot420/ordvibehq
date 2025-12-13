/**
 * Cloudflare Worker - Flashnet API Proxy
 *
 * Bypasses Cloudflare bot detection by running on CF's edge network.
 * Proxies requests to https://api.amm.flashnet.xyz with proper CORS.
 *
 * Usage: https://flashnet-proxy.YOUR-NAME.workers.dev?path=/v1/pools
 */

const FLASHNET_API_BASE = 'https://api.amm.flashnet.xyz';

// CORS headers for all responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400'
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }

    // Extract path parameter
    const path = url.searchParams.get('path');

    if (!path) {
      return new Response(JSON.stringify({
        error: "Missing 'path' query parameter",
        usage: "?path=/v1/pools"
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    // Validate path starts with /v1/
    if (!path.startsWith('/v1/')) {
      return new Response(JSON.stringify({
        error: "Invalid path - must start with /v1/",
        received: path
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    // Build target URL
    const targetUrl = `${FLASHNET_API_BASE}${path}`;

    console.log(`[Flashnet Proxy] ${request.method} ${targetUrl}`);

    try {
      // Forward request to Flashnet API with browser headers to bypass Cloudflare bot detection
      const proxyRequest = new Request(targetUrl, {
        method: request.method,
        headers: {
          // Browser identification (bypasses Cloudflare bot detection)
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Content-Type': 'application/json',

          // Make request appear to originate from flashnet.xyz
          'Origin': 'https://flashnet.xyz',
          'Referer': 'https://flashnet.xyz/',

          // CORS security headers (browser context)
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-origin',

          // Forward Authorization header if present (for JWT token)
          ...(request.headers.get('Authorization') && {
            'Authorization': request.headers.get('Authorization')
          })
        },
        body: request.method !== 'GET' && request.method !== 'HEAD'
          ? await request.text()
          : undefined
      });

      const apiResponse = await fetch(proxyRequest);

      // Get response body
      const responseBody = await apiResponse.text();

      console.log(`[Flashnet Proxy] Response: ${apiResponse.status}`);

      // Return response with CORS headers
      return new Response(responseBody, {
        status: apiResponse.status,
        headers: {
          ...corsHeaders,
          'Content-Type': apiResponse.headers.get('Content-Type') || 'application/json'
        }
      });

    } catch (error) {
      console.error('[Flashnet Proxy] Error:', error);

      return new Response(JSON.stringify({
        error: 'Proxy request failed',
        message: error.message,
        timestamp: new Date().toISOString()
      }), {
        status: 502,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
  }
};
