import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "next/navigation": fileURLToPath(new URL("./src/shims/next-navigation.ts", import.meta.url)),
      "next/link": fileURLToPath(new URL("./src/shims/next-link.tsx", import.meta.url)),
    },
  },
  build: {
    outDir: "dist-vercel",
    emptyOutDir: true,
  },
});
