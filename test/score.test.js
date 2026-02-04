import assert from "node:assert/strict";
import { defaultPhrases } from "../dist/phrases.js";

assert.ok(defaultPhrases.length > 0);
console.log("score.test.js ok");
