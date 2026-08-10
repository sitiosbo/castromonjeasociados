// @ts-check
import { defineConfig } from "astro/config";

const isCloudflare = process.env.WORKERS_CI === "1";

export default defineConfig({
  output: "static",
  site: isCloudflare
    ? "https://castromonjeasociados.calderonwilsonpol.workers.dev"
    : "https://sitiosbo.github.io",
  base: isCloudflare ? "/" : "/castromonjeasociados/",
});
