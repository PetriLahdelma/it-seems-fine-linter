export default {
  name: "it-seems-fine-linter",
  tagline: "Detect vibes-based engineering and score the risk.",
  value: "Turns vague language into a measurable risk score for CI.",
  accent: "#F97316",
  pills: ["Risk score","Phrase packs","CI strict mode"],
  demo: ["$ it-seems-fine-linter --paths src --strict","Scanning 42 files...","Matches: 2  Score: 18  Threshold: 25","Strict mode: PASS (exit 0)"],
  output: ["Vibe Risk Score: 44","Threshold: 25 (strict)","2 match(es)","- examples/input/sample.ts: it seems fine (sev 3)"],
  callout: "Run this on trusted branches only. Strict mode can fail CI when the score crosses your threshold.",
  quickstart: "npx it-seems-fine-linter --paths src",
  hero: { width: 1600, height: 900 },
  heroAccent: "none",
  icon: {
    inner: `
<path d="M256 112 L128 400 H384 Z" stroke="{{accent}}" stroke-width="{{stroke}}" stroke-linejoin="round"/>
<path d="M196 276 L238 318 L330 226" stroke="{{accent}}" stroke-width="{{stroke}}" stroke-linecap="round" stroke-linejoin="round"/>
<circle cx="388" cy="156" r="18" fill="{{accent}}" fill-opacity="0.9"/>
`
  }
};
