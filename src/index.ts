#!/usr/bin/env node
import fs from "node:fs";
import fg from "fast-glob";
import { defaultPhrases } from "./phrases.js";
import { loadConfig } from "./config.js";

type Options = {
  paths: string[];
  config?: string;
  strict: boolean;
  threshold: number;
  json: boolean;
};

function parseArgs(argv: string[]): Options {
  const opts: Options = { paths: ["."], strict: false, threshold: 25, json: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--paths") opts.paths = (argv[++i] || ".").split(",");
    else if (a === "--config") opts.config = argv[++i];
    else if (a === "--strict") opts.strict = true;
    else if (a === "--threshold") opts.threshold = Number(argv[++i] || opts.threshold);
    else if (a === "--json") opts.json = true;
  }
  return opts;
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
  const opts = parseArgs(process.argv.slice(2));
  const user = loadConfig(opts.config);
  const phrases = user.phrases || defaultPhrases;
  const threshold = user.threshold ?? opts.threshold;

  const files = await fg(opts.paths, {
    onlyFiles: true,
    ignore: ["**/node_modules/**", "**/dist/**"]
  });

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
    console.log(JSON.stringify({ score, matches }, null, 2));
  } else {
    console.log(`Vibe Risk Score: ${score}`);
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
