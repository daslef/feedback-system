import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 6000,
    proxy: {
      // "/udata": {
      //     target: 'https://www.xn--47-dlcma4bxbi.xn--p1ai/',
      //     changeOrigin: true,
      //     secure: false,
      //     rewrite: (path) => path.replace(/^\/udata/, '')
      // }
    },
  },
});
