import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Served from https://<user>.github.io/BES/ on GitHub Pages.
export default defineConfig({
  base: "/BES/",
  plugins: [react()],
});
