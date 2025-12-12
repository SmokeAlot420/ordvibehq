import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

const FLASHNET_API_BASE = "https://api.amm.flashnet.xyz";

/**
 * Netlify serverless function to proxy Flashnet API requests
 * Bypasses CORS by making server-side requests
 *
 * Usage: /.netlify/functions/flashnet-proxy?path=/v1/pools
 */
const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // CORS headers for the response
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: "",
    };
  }

  try {
    // Get the path from query params
    const path = event.queryStringParameters?.path;

    if (!path) {
      return {
        statusCode: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Missing 'path' query parameter" }),
      };
    }

    // Build the full Flashnet API URL
    const url = `${FLASHNET_API_BASE}${path}`;

    console.log(`[flashnet-proxy] Proxying request to: ${url}`);

    // Forward the request to Flashnet API with browser-like headers to bypass Cloudflare
    const response = await fetch(url, {
      method: event.httpMethod,
      headers: {
        // Browser identification (bypasses Cloudflare bot detection)
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Content-Type": "application/json",

        // Make request appear to originate from flashnet.xyz
        "Origin": "https://flashnet.xyz",
        "Referer": "https://flashnet.xyz/",

        // CORS security headers
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",

        // Forward authorization if present
        ...(event.headers.authorization && {
          "Authorization": event.headers.authorization
        }),
      },
      // Forward body for POST requests
      ...(event.body && { body: event.body }),
    });

    // Get response data
    const data = await response.text();

    // Log response status
    console.log(`[flashnet-proxy] Response status: ${response.status}`);

    return {
      statusCode: response.status,
      headers: {
        ...corsHeaders,
        "Content-Type": response.headers.get("Content-Type") || "application/json",
      },
      body: data,
    };
  } catch (error) {
    console.error("[flashnet-proxy] Error:", error);

    return {
      statusCode: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({
        error: "Proxy request failed",
        message: error instanceof Error ? error.message : "Unknown error"
      }),
    };
  }
};

export { handler };
