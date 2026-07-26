import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function filesBelow(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === ".git") return [];
    const candidate = path.join(directory, entry.name);
    return entry.isDirectory() ? filesBelow(candidate) : [candidate];
  });
}

const files = filesBelow(siteRoot);
const relativeFiles = files.map((file) => path.relative(siteRoot, file));
const forbiddenExtensions = /\.(?:swift|m|mm|h|xcconfig|pbxproj|plist|mobileprovision|p12|cer|key|pem|ipa|xcarchive|dSYM|zip)$/i;
const forbiddenNames = /(?:release_hardening|symbol_manifest|obfuscation|source-map)/i;

assert.deepEqual(
  relativeFiles.filter((file) => forbiddenExtensions.test(file) || forbiddenNames.test(file)),
  [],
  "public repository contains an internal source, signing, archive, or symbol-mapping file"
);

const textualFiles = files.filter((file) => {
  const relative = path.relative(siteRoot, file);
  return !/\.(?:png)$/i.test(file) && relative !== "tests/public-surface-audit.mjs";
});
const forbiddenContent = [
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
  /\b(?:DEVELOPMENT_TEAM|PROVISIONING_PROFILE|PRODUCT_BUNDLE_IDENTIFIER)\b/,
  /\/Users\/[^/\s]+\/(?:ai[_-]projects|Library)\//,
  /\b(?:github_pat_|gh[pousr]_)[A-Za-z0-9_]{20,}/,
  /\bAKIA[0-9A-Z]{16}\b/
];

for (const file of textualFiles) {
  const content = fs.readFileSync(file, "utf8");
  for (const pattern of forbiddenContent) {
    assert.doesNotMatch(content, pattern, `${path.relative(siteRoot, file)} contains private implementation or credential material`);
  }
}

const pagePairs = [
  ["index.html", "en/index.html"],
  ["privacy/index.html", "en/privacy/index.html"],
  ["support/index.html", "en/support/index.html"],
  ["terms/index.html", "en/terms/index.html"],
  ["recovery/index.html", "en/recovery/index.html"]
];

for (const [japanesePath, englishPath] of pagePairs) {
  const japanese = fs.readFileSync(path.join(siteRoot, japanesePath), "utf8");
  const english = fs.readFileSync(path.join(siteRoot, englishPath), "utf8");
  assert.match(japanese, /<html lang="ja">/);
  assert.match(english, /<html lang="en">/);
  assert.match(japanese, /rel="alternate" hreflang="en"/);
  assert.match(english, /rel="alternate" hreflang="ja"/);
}

const readme = fs.readFileSync(path.join(siteRoot, "README.md"), "utf8");
assert.match(readme, /## 日本語/);
assert.match(readme, /## English/);

console.log(`public surface audit: OK (${files.length} files, ${pagePairs.length} language pairs)`);
