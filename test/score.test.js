import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defaultPhrases } from "../dist/phrases.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const distCli = path.join(root, "dist", "index.js");
const fixture = path.join(root, "test", "fixtures", "sample.ts");
const configPath = path.join(root, "test", "fixtures", "config.json");

assert.ok(defaultPhrases.length > 0);
assert.ok(fs.existsSync(distCli), "dist CLI missing - run build first");

const run = args =>
  spawnSync(process.execPath, [distCli, ...args], {
    encoding: "utf8"
  });

const jsonRun = run(["--paths", fixture, "--json"]);
assert.equal(jsonRun.status, 0, jsonRun.stderr);
const json = JSON.parse(jsonRun.stdout);
assert.equal(json.matchCount, 2);
assert.ok(json.score > 0);

const strictRun = run(["--paths", fixture, "--strict", "--threshold", "0"]);
assert.equal(strictRun.status, 2);

const configRun = run(["--paths", fixture, "--config", configPath, "--json"]);
assert.equal(configRun.status, 0, configRun.stderr);
const configJson = JSON.parse(configRun.stdout);
assert.equal(configJson.matchCount, 1);

const missingConfig = run(["--paths", fixture, "--config", path.join(root, "test", "fixtures", "missing.json")]);
assert.equal(missingConfig.status, 1);
assert.match(missingConfig.stderr, /Config not found/);

console.log("score.test.js ok");
