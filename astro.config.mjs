// @ts-check
import { defineConfig } from "astro/config";

// Detecta si el build corre en Cloudflare Pages (variable automática)
const isCloudflare = process.env.CF_PAGES === "1";

export default defineConfig({
  output: "static",
  site: isCloudflare
    ? "https://castromonjeasociados.pages.dev"
    : "https://sitiosbo.github.io",
  base: isCloudflare ? "/" : "/castromonjeasociados/",
});
