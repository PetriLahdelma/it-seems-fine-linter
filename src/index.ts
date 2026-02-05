#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import fg from "fast-glob";
import { defaultPhrases } from "./phrases.js";
import { loadConfig } from "./config.js";

type Options = {
  paths: string[];
  config?: string;
  strict: boolean;
  threshold: number;
  json: boolean;
  help: boolean;
  thresholdProvided: boolean;
};

const HELP_TEXT = `
it-seems-fine-linter
Detect vibes-based engineering phrases and score the risk.

Usage:
  it-seems-fine-linter --paths src
  it-seems-fine-linter --paths src,docs --strict --threshold 30
  it-seems-fine-linter --config phrases.json --json

Options:
  --paths <globs>    Comma-separated paths or glob patterns (default: .)
  --config <file>    JSON config with phrases/threshold
  --strict           Exit 2 when score >= threshold
  --threshold <n>    Score threshold (default: 25)
  --json             Emit machine-readable JSON
  -h, --help         Show help

Exit codes:
  0 success
  1 runtime/config error or no files matched
  2 strict mode threshold exceeded
`.trim();

function printHelp() {
  console.log(HELP_TEXT);
}

function parseArgs(argv: string[]): Options {
  const opts: Options = {
    paths: [],
    strict: false,
    threshold: 25,
    json: false,
    help: false,
    thresholdProvided: false
  };
  let pathsProvided = false;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--help" || a === "-h") {
      opts.help = true;
      continue;
    }
    if (a === "--paths") {
      const value = argv[++i];
      if (!value) {
        throw new Error("Missing value for --paths");
      }
      const parts = value
        .split(",")
        .map(part => part.trim())
        .filter(Boolean);
      if (parts.length === 0) {
        throw new Error("No paths provided for --paths");
      }
      if (!pathsProvided) {
        opts.paths = [];
        pathsProvided = true;
      }
      opts.paths.push(...parts);
      continue;
    }
    if (a === "--config") {
      const value = argv[++i];
      if (!value) {
        throw new Error("Missing value for --config");
      }
      opts.config = value;
      continue;
    }
    if (a === "--strict") {
      opts.strict = true;
      continue;
    }
    if (a === "--threshold") {
      const value = argv[++i];
      if (!value) {
        throw new Error("Missing value for --threshold");
      }
      const num = Number(value);
      if (!Number.isFinite(num) || num < 0) {
        throw new Error("Threshold must be a non-negative number");
      }
      opts.threshold = num;
      opts.thresholdProvided = true;
      continue;
    }
    if (a === "--json") {
      opts.json = true;
      continue;
    }
    if (a.startsWith("-")) {
      throw new Error(`Unknown option: ${a}`);
    }
    // Treat positional args as additional paths for convenience
    opts.paths.push(a);
    pathsProvided = true;
  }
  if (!pathsProvided) {
    opts.paths = ["."];
  }
  return opts;
}

function hasGlob(value: string): boolean {
  return /[*?[\]{}]/.test(value);
}

function normalizePatterns(pathsList: string[]): string[] {
  const patterns: string[] = [];
  for (const entry of pathsList) {
    const value = entry.trim();
    if (!value) continue;
    if (hasGlob(value)) {
      patterns.push(value);
      continue;
    }
    const absolute = path.resolve(value);
    if (fs.existsSync(absolute) && fs.statSync(absolute).isDirectory()) {
      const normalized = value.replace(/\\/g, "/").replace(/\/$/, "");
      patterns.push(`${normalized}/**/*`);
      continue;
    }
    patterns.push(value);
  }
  return patterns;
}

function extractComments(source: string): string[] {
  const comments: string[] = [];
  const lineComments = source.match(/\/\/.*$/gm) || [];
  const blockComments = source.match(/\/\*[\s\S]*?\*\//g) || [];
  return comments.concat(lineComments, blockComments);
}

function scoreMatches(matches: number, severitySum: number): number {
  return Math.min(100, severitySum * 5 + matches * 2);
}

async function main() {
  let opts: Options;
  try {
    opts = parseArgs(process.argv.slice(2));
  } catch (err) {
    console.error(err instanceof Error ? err.message : err);
    printHelp();
    process.exit(1);
    return;
  }

  if (opts.help) {
    printHelp();
    return;
  }

  const user = loadConfig(opts.config);
  const phrases = user.phrases && user.phrases.length > 0 ? user.phrases : defaultPhrases;
  const threshold = opts.thresholdProvided ? opts.threshold : (user.threshold ?? opts.threshold);

  const patterns = normalizePatterns(opts.paths);
  const files = await fg(patterns, {
    onlyFiles: true,
    ignore: ["**/node_modules/**", "**/dist/**", "**/.git/**"]
  });

  if (files.length === 0) {
    console.error(`No files matched. Check --paths: ${opts.paths.join(", ")}`);
    process.exit(1);
    return;
  }

  const targets: { location: string; text: string }[] = [];

  for (const file of files) {
    const src = fs.readFileSync(file, "utf8");
    const comments = extractComments(src).join("\n");
    targets.push({ location: file, text: comments });
  }

  const eventPath = process.env.GITHUB_EVENT_PATH;
  if (eventPath && fs.existsSync(eventPath)) {
    const event = JSON.parse(fs.readFileSync(eventPath, "utf8"));
    if (event.pull_request) {
      targets.push({ location: "PR title", text: event.pull_request.title || "" });
      targets.push({ location: "PR body", text: event.pull_request.body || "" });
    }
  }

  const matches: { location: string; phrase: string; severity: number }[] = [];
  let severitySum = 0;

  for (const target of targets) {
    for (const p of phrases) {
      const re = new RegExp(p.phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      if (re.test(target.text)) {
        matches.push({ location: target.location, phrase: p.phrase, severity: p.severity });
        severitySum += p.severity;
      }
    }
  }

  const score = scoreMatches(matches.length, severitySum);

  if (opts.json) {
    console.log(
      JSON.stringify(
        {
          score,
          threshold,
          strict: opts.strict,
          matchCount: matches.length,
          matches
        },
        null,
        2
      )
    );
  } else {
    console.log(`Vibe Risk Score: ${score}`);
    console.log(`Threshold: ${threshold}${opts.strict ? " (strict)" : ""}`);
    console.log(`${matches.length} match(es)`);
    for (const m of matches) {
      console.log(`- ${m.location}: ${m.phrase} (sev ${m.severity})`);
    }
  }

  if (opts.strict && score >= threshold) process.exit(2);
}

main().catch(err => {
  console.error(err?.message || err);
  process.exit(1);
});
