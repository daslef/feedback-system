import { defineConfig } from "vite";
import htmlPurge from "vite-plugin-purgecss";

export default defineConfig({
  root: ".",
  publicDir: "public",
  server: {
    port: 5173,
    host: true,
  },
  build: {
    outDir: "dist",
  },
  plugins: [htmlPurge({ 
    content: ["index.html"],
    css: ["public/css/*"]
   })],
});
