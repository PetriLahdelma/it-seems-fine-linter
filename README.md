# it-seems-fine-linter
Detect vibes-based engineering and score the risk.

- Scans files under `--paths` for vibes-based engineering phrases.
- Supports custom phrase packs via `--config`.
- CI-friendly with strict mode for gating.

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

## Quickstart

```bash
npx it-seems-fine-linter --paths src
```

## Demo

```bash
it-seems-fine-linter --paths src --strict
```

## Why This Exists

Turn vague phrases into measurable signal before merging.

## FAQ

- **Custom phrases?** Yes via `--config`.
- **CI friendly?** Yes with strict mode.

## Contributing

See `CONTRIBUTING.md` for how to add phrase packs.

## License

MIT
