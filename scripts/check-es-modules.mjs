import { readFileSync, readdirSync, statSync, existsSync } from "fs";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";
import { dirname, resolve, join, relative } from "path";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const ENTRY = resolve(ROOT, "app-init.js");

const IGNORE_DIRS = new Set(["node_modules", ".git", "test-results"]);

function walkJs(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (IGNORE_DIRS.has(name)) continue;
    const p = join(dir, name);
    try {
      const st = statSync(p);
      if (st.isDirectory()) walkJs(p, out);
      else if (name.endsWith(".js")) out.push(p);
    } catch {
      /* ignore */
    }
  }
  return out;
}

function nodeCheck(file) {
  const r = spawnSync(process.execPath, ["--check", file], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (r.status !== 0) {
    console.error(r.stderr || r.stdout || `Échec node --check : ${file}`);
    process.exit(1);
  }
}

const relFromRe = /\bfrom\s+['"](\.\.?(?:\/[^'"]+)+)['"]/g;
const dynImportRe = /\bimport\s*\(\s*['"](\.\.?(?:\/[^'"]+)+(?:\.js)?)['"]\s*\)/g;

function extractRelativeSpecifiers(source) {
  const specs = new Set();
  relFromRe.lastIndex = 0;
  dynImportRe.lastIndex = 0;
  let m;
  while ((m = relFromRe.exec(source)) !== null) specs.add(m[1]);
  while ((m = dynImportRe.exec(source)) !== null) specs.add(m[1]);
  return [...specs];
}

function resolveImport(fromFile, specifier) {
  const base = resolve(dirname(fromFile), specifier);
  if (existsSync(base) && statSync(base).isFile()) return base;
  if (!specifier.endsWith(".js")) {
    const withJs = `${base}.js`;
    if (existsSync(withJs)) return withJs;
  }
  return null;
}

function collectGraph(entryAbs, visited, missing) {
  if (visited.has(entryAbs)) return;
  visited.add(entryAbs);
  let source;
  try {
    source = readFileSync(entryAbs, "utf8");
  } catch (e) {
    missing.push({ from: entryAbs, spec: "(lecture)", err: String(e) });
    return;
  }
  for (const spec of extractRelativeSpecifiers(source)) {
    const target = resolveImport(entryAbs, spec);
    if (!target) {
      missing.push({ from: entryAbs, spec });
      continue;
    }
    collectGraph(target, visited, missing);
  }
}

const allJs = walkJs(ROOT);
for (const f of allJs) nodeCheck(f);

const visited = new Set();
const missing = [];
collectGraph(ENTRY, visited, missing);

if (missing.length > 0) {
  console.error("Imports relatifs introuvables depuis la graphe app-init.js :\n");
  for (const { from, spec } of missing) {
    console.error(`  ${relative(ROOT, from)} → "${spec}"`);
  }
  process.exit(1);
}

console.log(
  `Graphe app-init.js : ${visited.size} module(s) — syntaxe vérifiée sur ${allJs.length} fichier(s) .js.`
);
