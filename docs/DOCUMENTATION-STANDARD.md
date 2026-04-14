# Documentation Standard

This project auto-generates wiki pages from source code JSDoc comments. Follow these standards to ensure proper wiki generation.

## Plugin Classes

Add a JSDoc block **directly above** every exported class in `src/src/plugins/`:

```typescript
/**
 * @wiki Automatically accepts the matchmaking queue when a game is found.
 * @author Lyfhael
 * @modifier Elaina Da Catto
 * @usage
 * 1. Open League Client settings
 * 2. Navigate to **Elaina Theme** → **Plugin Settings**
 * 3. Toggle **Auto Accept** to enabled
 * @settings auto_accept, auto_accept_button
 */
export class AutoAccept {
```

### Required Tags (enforced by ESLint)

| Tag | Purpose | Example |
|-----|---------|---------|
| `@wiki` | User-facing feature description (displayed in wiki) | `@wiki Adds a dodge button in champion select` |

### Recommended Tags

| Tag | Purpose | Example |
|-----|---------|---------|
| `@author` | Original author | `@author Elaina Da Catto` |
| `@modifier` | Who modified the original code | `@modifier Elaina Da Catto` |
| `@usage` | Step-by-step instructions for end users | See example above |
| `@settings` | Comma-separated DataStore keys this plugin uses | `@settings dodge-button, auto_accept` |

### Notes

- Use `@wiki` instead of `@description` for user-facing text. `@description` is also supported but `@wiki` takes priority.
- The `@usage` tag supports Markdown formatting.
- The wiki generator also detects `ElainaData.get("key")` / `ElainaData.set("key")` calls to automatically find which settings a plugin uses.

## Settings Documentation

Settings descriptions live in `docs/settings-meta.json`. When you add a new setting to `datastoreDefault.js`:

1. Add the key to `docs/settings-meta.json` with a `category`, `description`, and `type`.
2. The wiki generator will warn about any missing settings.

Example entry:
```json
{
    "auto_accept": {
        "category": "plugins",
        "description": "Automatically accept matchmaking queue when a game is found.",
        "type": "boolean"
    }
}
```

### Categories

| Key | Name | Used for |
|-----|------|----------|
| `theme-core` | Core Theme | Basic theme behavior, version |
| `wallpaper-audio` | Wallpaper & Audio | Backgrounds, audio playback |
| `theme-visual` | Visual Customization | Fonts, UI tweaks, colors |
| `custom-assets` | Custom Assets | Icons, banners, avatars |
| `plugins` | Plugin Settings | Per-plugin configuration |
| `tft` | TFT Settings | TFT-specific toggles |
| `backup` | Backup & Restore | Cloud backup settings |
| `deprecated` | Deprecated | Unused settings |

New categories can be added to the `categories` object in `settings-meta.json`.

## ESLint Enforcement

The ESLint config (`eslint.config.js`) enforces documentation rules:

- **Current level**: `warn` — shows warnings but doesn't block commits
- **To enforce strictly**: Change `warn` → `error` in `eslint.config.js` for `jsdoc/require-jsdoc` and `jsdoc/require-description`

## Git Hooks

- **Pre-commit**: Runs ESLint on staged files via `lint-staged`
- **Pre-push**: Runs full lint + wiki validation (`--check` mode)

## Wiki Generation

```bash
# Generate wiki locally
pnpm run wiki:generate

# Check documentation coverage (no file writes)
pnpm run wiki:check
```

The GitHub Action (`.github/workflows/generate-wiki.yml`) runs on push to `main` and auto-publishes to the repo wiki.
