import { copyFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const indexPath = join("dist", "index.html");

if (!existsSync(indexPath)) {
  console.warn("copy-spa-fallback: dist/index.html not found, skipping");
  process.exit(0);
}

copyFileSync(indexPath, join("dist", "404.html"));
console.log("copy-spa-fallback: dist/404.html created for SPA reloads");
