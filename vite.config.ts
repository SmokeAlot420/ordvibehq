import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 7777,
    proxy: {
      // Proxy Netlify function path to Flashnet API in development
      "/.netlify/functions/flashnet-proxy": {
        target: "https://api.amm.flashnet.xyz",
        changeOrigin: true,
        rewrite: (path) => {
          // Extract the 'path' query param and use it as the actual path
          const url = new URL(path, "http://localhost");
          const apiPath = url.searchParams.get("path") || "/v1/pools";
          return apiPath;
        },
      },
    },
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router': ['react-router-dom'],
          'ui': ['framer-motion', 'lucide-react'],
          'utils': ['clsx', 'tailwind-merge', 'class-variance-authority'],
        },
      },
    },
    chunkSizeWarningLimit: 200,
  },
});
