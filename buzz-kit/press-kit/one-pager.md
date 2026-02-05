**Overview**
it-seems-fine-linter detects vibes-based engineering phrases and scores risk.

**Problem**
Hand-wavy language in reviews is easy to miss and hard to enforce.

**What It Does**
- Scans files under `--paths` for risky phrases.
- Supports custom phrase packs via `--config`.
- Provides strict mode for CI gating.

**Quickstart**
```bash
npx it-seems-fine-linter --paths src
```

**Who It Is For**
Engineering teams that want clearer review signals.

**Trust & Safety**
Reads files and reports matches. No file modifications are documented.

**Repo**
PetriLahdelma/it-seems-fine-linter
