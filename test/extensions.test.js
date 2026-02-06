import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const distCli = path.join(root, "dist", "index.js");

const run = args =>
  spawnSync(process.execPath, [distCli, ...args], {
    encoding: "utf8"
  });

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "vibes-linter-"));
fs.writeFileSync(path.join(tmpDir, "sample.ts"), "// it seems fine\n");
fs.writeFileSync(path.join(tmpDir, "binary.dat"), Buffer.from([0x00, 0x01, 0x02, 0x03]));

const jsonRun = run(["--paths", tmpDir, "--json"]);
assert.equal(jsonRun.status, 0, jsonRun.stderr);
const json = JSON.parse(jsonRun.stdout);
assert.equal(json.matchCount, 1);

const extRun = run(["--paths", tmpDir, "--extensions", "txt"]);
assert.equal(extRun.status, 1);
assert.match(extRun.stderr, /No files matched/);

console.log("extensions.test.js ok");
