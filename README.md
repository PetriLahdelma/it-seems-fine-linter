# it-seems-fine-linter

Scan PRs and code comments for vibes-based engineering phrases.

Tagline: Turn gut feelings into a measurable risk score.

## Quickstart
```bash
npx it-seems-fine-linter --paths src
```

## Demo
```bash
it-seems-fine-linter --paths src --strict
```
Expected output:
```
Vibe Risk Score: 30
2 match(es)
```

## Screenshots
Placeholder: add screenshots in `docs/` and link them here.

## What it does
- Scans PR title/body from GitHub event payload in CI
- Scans code comments and markdown files
- Outputs a Vibe Risk Score and fails in strict mode
- Supports custom phrase config

## CLI
```bash
it-seems-fine-linter --paths src --strict
```
Options:
- `--paths <paths>` (default: `.`)
- `--config <path>`
- `--strict`
- `--threshold <n>` (default: 25)
- `--json`

## Config
Example config file:
```json
{
  "threshold": 20,
  "phrases": [
    { "phrase": "it seems fine", "severity": 3 },
    { "phrase": "probably ok", "severity": 2 }
  ]
}
```

## GitHub Actions
Use the included CI workflow. It reads PR title/body from `GITHUB_EVENT_PATH`.

## Manual publish steps (optional)
```bash
npm login
npm publish --access public
```
If the name is taken, consider scoped naming like `@petri-lahdelma/it-seems-fine-linter`.

## License
MIT
