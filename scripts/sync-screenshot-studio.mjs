import { cpSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(root, "marketing", "app-store-screenshot-builder");

for (const base of ["docs", "public"]) {
  const target = join(root, base, "screenshot-studio");
  mkdirSync(target, { recursive: true });
  cpSync(join(source, "index.html"), join(target, "index.html"));
  cpSync(join(source, "assets"), join(target, "assets"), {
    recursive: true,
    force: true
  });
}

console.log("Synced screenshot studio to docs/ and public/.");
