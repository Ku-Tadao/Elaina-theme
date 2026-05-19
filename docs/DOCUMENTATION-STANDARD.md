# Documentation Standard

The GitHub Wiki is generated from centralized documentation files. Do not edit generated wiki pages by hand.

## Wiki Sources

| File | Purpose |
|------|---------|
| `docs/wiki-content.json` | Page order, installation text, asset instructions, grouped wiki sections, FAQ content. |
| `docs/settings-meta.json` | Setting categories, descriptions, and value types. |
| `src/src/config/datastoreDefault.js` | Default values shown in generated setting tables. |
| `src/src/locales/default.js` | UI labels shown beside setting keys when available. |

The generator no longer depends on editing JSDoc in every plugin file for user-facing wiki content. JSDoc can still be useful for code maintainers, but wiki content should be maintained in `docs/wiki-content.json` and `docs/settings-meta.json`.

## Required Wiki Structure

The generated wiki contains these pages in this order:

1. Home
2. Installation instructions
3. Theme customization
   - 3.1. Add wallpaper/audio
   - 3.2. Theme settings
   - 3.3. Plugins settings
4. Backup/Restore
5. FAQ & Troubleshooting

The order is controlled by the `navigation` array in `docs/wiki-content.json`.

## Updating Wiki Content

Use `docs/wiki-content.json` for page text and section grouping.

Common edits:

- Add or rewrite installation instructions in `installation`.
- Add asset rules or supported formats in `themeCustomization.assets`.
- Move a setting to another wiki group by editing `themeSettingGroups` or `pluginSettingGroups`.
- Add FAQ entries in `faq.items`.
- Add runtime-only settings to `runtimeSettingKeys` when the key is created outside `datastoreDefault.js`.

## Settings Documentation

Every setting displayed in the wiki should have an entry in `docs/settings-meta.json`.

Example:

```json
{
    "auto_accept": {
        "category": "plugins",
        "description": "Automatically accept matchmaking queue when a game is found.",
        "type": "boolean"
    }
}
```

When adding a new key to `datastoreDefault.js`:

1. Add its category, description, and type to `docs/settings-meta.json`.
2. If it should appear in the wiki, add it to a group in `docs/wiki-content.json`.
3. Run `pnpm run wiki:check`.
4. Run `pnpm run wiki:generate` and review the generated files in `wiki/`.

## Categories

| Key | Name | Used for |
|-----|------|----------|
| `theme-core` | Core Theme | Basic theme behavior, version, language, update notices. |
| `wallpaper-audio` | Wallpaper & Audio | Backgrounds, audio playback, slideshow, window effects. |
| `theme-visual` | Visual Customization | Fonts, UI tweaks, colors, layout visibility. |
| `custom-assets` | Custom Assets | Icons, banners, avatars, and visual replacements. |
| `plugins` | Plugin Settings | Optional plugin behavior and plugin configuration. |
| `tft` | TFT Settings | TFT-specific toggles. |
| `backup` | Backup & Restore | Manual and cloud backup settings. |
| `deprecated` | Deprecated | Settings no longer in active use. |
| `internal` | Internal | Values not meant to be shown to normal users. |

## Validation

```bash
pnpm run wiki:check
pnpm run wiki:generate
```

`wiki:check` validates that referenced settings are documented and that required pages are present. Warnings are informational; errors fail the check.

## Publishing

The GitHub Action at `.github/workflows/generate-wiki.yml` runs the generator and pushes generated Markdown files to the repository wiki. It replaces old generated Markdown pages so removed or renamed pages do not remain in the wiki.
