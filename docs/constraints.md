# Constraints & Limitations

- Only comment text is scanned; strings and code identifiers are ignored.
- Score is heuristic and depends on phrase packs and thresholds.
- Large repos scale linearly with file count and size.

Performance notes: linear in file count and total comment size; IO and globbing dominate.
