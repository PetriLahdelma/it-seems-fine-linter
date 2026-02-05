Title: Show: it-seems-fine-linter — detect vibes-based engineering in CI

Body:
I built it-seems-fine-linter to catch vibes-based engineering language before merge. It scans files under `--paths`, produces a risk score, and supports strict mode for CI gating.

Quickstart:
```bash
npx it-seems-fine-linter --paths src
```

Feedback welcome, especially on phrase packs.
