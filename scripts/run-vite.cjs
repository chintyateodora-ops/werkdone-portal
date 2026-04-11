/**
 * Runs the installed Vite CLI without relying on PATH / node_modules/.bin.
 * Walks up from cwd until it finds node_modules/vite/bin/vite.js (works with npm workspaces hoisting).
 */
const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

function findViteCli() {
  let dir = process.cwd();
  for (let i = 0; i < 8; i++) {
    const candidate = path.join(dir, "node_modules", "vite", "bin", "vite.js");
    if (fs.existsSync(candidate)) {
      return candidate;
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  console.error(
    "Could not find node_modules/vite/bin/vite.js. Run npm install from the repository root."
  );
  process.exit(1);
}

const viteCli = findViteCli();
const args = process.argv.slice(2);
const result = spawnSync(process.execPath, [viteCli, ...args], {
  stdio: "inherit",
  shell: false,
});
process.exit(result.status === null ? 1 : result.status);
