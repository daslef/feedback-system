import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { analyzer } from "vite-bundle-analyzer";

export default defineConfig({
  plugins: [react(), analyzer()],
  server: {
    cors: false,
    port: 5174,
    strictPort: true,
  },
  esbuild: {
    minifyIdentifiers: false,
    minifySyntax: false,
  },
  build: {
    rollupOptions: {},
  },
});
