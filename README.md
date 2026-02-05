# it-seems-fine-linter
Detect vibes-based engineering and score the risk.

- Scans code comments (and PR title/body in CI) for vibes-based engineering phrases.
- Supports custom phrase packs via `--config`.
- CI-friendly with strict mode and stable exit codes.

**Try in 10 seconds**
```bash
npx it-seems-fine-linter --paths src
```

**Demo**
Record a run showing the risk score output and a strict-mode failure.

Star if this saves you time.  
→ Buzz Kit: /buzz-kit

![CI](https://github.com/PetriLahdelma/it-seems-fine-linter/actions/workflows/ci.yml/badge.svg) ![Release](https://img.shields.io/github/v/release/PetriLahdelma/it-seems-fine-linter) ![License](https://img.shields.io/github/license/PetriLahdelma/it-seems-fine-linter) ![Stars](https://img.shields.io/github/stars/PetriLahdelma/it-seems-fine-linter)

![Hero](assets/hero.png?20260205)

## Requirements

- Node.js 20+

## Quickstart

```bash
npx it-seems-fine-linter --paths src
```

## Install

```bash
npm install -D it-seems-fine-linter
```

## Usage

```bash
it-seems-fine-linter --paths src
it-seems-fine-linter --paths src,docs --strict --threshold 30
it-seems-fine-linter --config phrases.json --json
```

**Options**

- `--paths <globs>` Comma-separated paths or glob patterns. Directories expand to `**/*`. Default: `.`.
- `--config <file>` JSON config with `phrases` and optional `threshold`.
- `--strict` Exit `2` when score >= threshold.
- `--threshold <n>` Score threshold (default `25`). CLI flag overrides config.
- `--json` Emit machine-readable JSON.

## Demo

```bash
it-seems-fine-linter --paths src --strict
```

## Why This Exists

Turn vague phrases into measurable signal before merging.

## Configuration

```json
{
  "threshold": 30,
  "phrases": [
    { "phrase": "should be fine", "severity": 2 },
    { "phrase": "ship it", "severity": 3 }
  ]
}
```

## JSON Output

```json
{
  "score": 18,
  "threshold": 25,
  "strict": false,
  "matchCount": 2,
  "matches": [
    { "location": "src/app.ts", "phrase": "ship it", "severity": 3 }
  ]
}
```

## Exit Codes

- `0` Success
- `1` Runtime/config error or no files matched
- `2` Strict mode threshold exceeded

## Troubleshooting

- **No files matched**: Ensure `--paths` points to existing directories or valid glob patterns.
- **Config not found**: Pass an absolute or repo-relative path to `--config`.
- **Config JSON error**: Validate JSON format and ensure `threshold`/`severity` are numbers.
- **No matches**: Remember it scans comments and PR metadata; text in code strings won't match unless in comments.
- **CI mismatch**: Ensure `GITHUB_EVENT_PATH` exists if relying on PR title/body scanning.

## FAQ

- **Custom phrases?** Yes via `--config`.
- **CI friendly?** Yes with strict mode.

## Contributing

See `CONTRIBUTING.md` for how to add phrase packs.

## License

MIT
