import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { webcrypto } from "node:crypto";

const directory = path.dirname(fileURLToPath(import.meta.url));
const toolPath = path.join(directory, "..", "downloads", "AnesthesiaSheet-Recovery-v1.html");
const html = fs.readFileSync(toolPath, "utf8");
const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];

assert.ok(script, "inline recovery script is missing");
assert.match(html, /connect-src 'none'/);
assert.doesNotMatch(html, /<script\s+src=/i);
assert.doesNotMatch(script, /fetch\s*\(|XMLHttpRequest|WebSocket|sendBeacon/);

const elements = new Map();
const handlers = new Map();

function element(id) {
  if (!elements.has(id)) {
    const classes = new Set();
    elements.set(id, {
      id,
      value: "",
      files: [],
      textContent: "",
      className: "",
      disabled: false,
      classList: {
        add: (...names) => names.forEach((name) => classes.add(name)),
        remove: (...names) => names.forEach((name) => classes.delete(name)),
        contains: (name) => classes.has(name)
      },
      addEventListener: (event, callback) => handlers.set(`${id}:${event}`, callback)
    });
  }
  return elements.get(id);
}

globalThis.window = { location: { protocol: "file:" }, crypto: webcrypto };
globalThis.document = {
  getElementById: element,
  createElement: () => ({ click() {} })
};

// Evaluate the exact JavaScript shipped inside the downloadable HTML.
(0, eval)(script);

const envelope = {
  format: "AnesthesiaSheetEncryptedArchive",
  version: 1,
  createdAt: "2026-07-18T00:00:00Z",
  cipher: "AES-256-GCM",
  kdf: "PBKDF2-HMAC-SHA256",
  iterations: 600000,
  salt: "AAECAwQFBgcICQoLDA0ODw==",
  nonce: "EBESExQVFhcYGRob",
  ciphertext: "zs38+ESgyq6yTsKzpp8fKxdz237hpFSLoVRu2Uaeo92ZLsrtCS7Nt/OjnNuB8ZUmuipJuR/EMuqjGQH0Qh3E4bpH+oE5icDBdpt1WqHje9cGgQotTko1aY7r5u4x+YJD4J3UoIasA8BqBFfrMg9nGhbxXPd4pyv7Bgc0afD1P0DuMXk3Vk5DSck1h63VtvfnT6sSLbBTivRiCcE7ol92mRCTKmgU",
  tag: "b4pisEmTMO3Hqr3yaQl1FA=="
};

element("archive").files = [{ text: async () => JSON.stringify(envelope) }];
element("secret").value = "recovery-interoperability-key";
await handlers.get("decrypt:click")();

assert.equal(element("location-status").className, "status good");
assert.equal(element("readable").textContent, "interop ok");
assert.equal(element("output").classList.contains("visible"), true);
assert.equal(element("operation-status").className, "status good");
assert.match(element("operation-status").textContent, /0件/);
assert.equal(element("secret").value, "");

console.log("offline recovery smoke: OK");
