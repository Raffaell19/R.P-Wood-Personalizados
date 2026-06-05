---
description: Start the auto-commit watcher that monitors src/ and commits+pushes to GitHub automatically on every save
---

# Auto-Commit Watcher

Starts a background watcher that monitors `src/` for file changes and automatically commits and pushes to GitHub after 10 seconds of inactivity.

## Start the watcher (in a separate terminal)

```powershell
powershell -ExecutionPolicy Bypass -File .agent/scripts/auto-commit.ps1
```

## Custom debounce delay (optional)

```powershell
# Wait 30s after last change before committing (default is 10s)
powershell -ExecutionPolicy Bypass -File .agent/scripts/auto-commit.ps1 -DebounceSeconds 30
```

## What it does

1. Watches `src/` recursively for any file changes (save, create, delete, rename)
2. Debounces — waits for 10s of inactivity to avoid committing on every keystroke
3. Builds a smart commit message based on which files changed
4. Runs `git add -A && git commit && git push` automatically

## Stop the watcher

Press `Ctrl+C` in the terminal running the watcher.

## Notes

- Run this in a **separate terminal** alongside `npm run dev`
- Requires Git to be configured with credentials (already done)
- Does nothing if there are no actual changes to commit
