# Usage

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
