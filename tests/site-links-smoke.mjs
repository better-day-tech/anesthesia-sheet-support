import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publishedPrefix = "/anesthesia-sheet-support/";

function filesBelow(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const candidate = path.join(directory, entry.name);
    return entry.isDirectory() ? filesBelow(candidate) : [candidate];
  });
}

function localTarget(sourceFile, rawHref) {
  const href = rawHref.split(/[?#]/, 1)[0];
  if (!href || /^(?:https?:|mailto:|tel:|data:)/i.test(href)) return null;

  let target;
  if (href.startsWith(publishedPrefix)) {
    target = path.join(siteRoot, href.slice(publishedPrefix.length));
  } else if (href.startsWith("/")) {
    target = path.join(siteRoot, href.slice(1));
  } else {
    target = path.resolve(path.dirname(sourceFile), href);
  }
  return href.endsWith("/") ? path.join(target, "index.html") : target;
}

const htmlFiles = filesBelow(siteRoot).filter((file) => file.endsWith(".html"));
const missing = [];
for (const sourceFile of htmlFiles) {
  const html = fs.readFileSync(sourceFile, "utf8");
  for (const match of html.matchAll(/href\s*=\s*["']([^"']+)["']/gi)) {
    const target = localTarget(sourceFile, match[1]);
    if (target && !fs.existsSync(target)) {
      missing.push(`${path.relative(siteRoot, sourceFile)} -> ${match[1]}`);
    }
  }
}

if (missing.length > 0) {
  console.error(missing.join("\n"));
  process.exit(1);
}

console.log(`local links: OK (${htmlFiles.length} HTML files)`);
