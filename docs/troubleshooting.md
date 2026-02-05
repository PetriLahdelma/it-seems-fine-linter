# Troubleshooting

- **No files matched**: Ensure `--paths` points to existing directories or valid glob patterns.
- **Config not found**: Pass an absolute or repo-relative path to `--config`.
- **Config JSON error**: Validate JSON format and ensure `threshold`/`severity` are numbers.
- **No matches**: Remember it scans comments and PR metadata; text in code strings won't match unless in comments.
- **CI mismatch**: Ensure `GITHUB_EVENT_PATH` exists if relying on PR title/body scanning.
