# MacCinny

MacCinny is a macOS-only Matrix desktop client built with React, Vite, Tauri 2, and Rust.

## What Changed

- Removed Windows installer and updater flow.
- Removed PWA, service worker, and static web deployment files.
- Kept the Tauri desktop UI and native desktop helpers.
- Added GitHub Actions builds for macOS Intel and Apple Silicon.

## Local Development

```bash
npm install
npm run desktop:dev
```

## Build macOS Bundles

```bash
npm install
npm run desktop:build
```

This produces `.app` and `.dmg` bundles for macOS.

## GitHub Actions Packaging

Push the repository to `iszkq/maccinny`, then create and push a tag:

```bash
git tag v1.4.7
git push origin main --tags
```

GitHub Actions will build macOS bundles for:

- `x86_64-apple-darwin`
- `aarch64-apple-darwin`

Tag builds are uploaded to the GitHub Release. Branch and pull request builds are uploaded as workflow artifacts.

## Notes

- `config.json` is still required because the desktop app reads runtime server configuration from it.
- Automatic in-app updater signing was removed so GitHub can build packages without extra secrets.
