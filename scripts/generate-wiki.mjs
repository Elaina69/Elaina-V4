#!/usr/bin/env node

/**
 * Wiki Generator for Elaina Theme
 *
 * Generates GitHub Wiki markdown pages from source code documentation.
 *
 * Usage:
 *   node scripts/generate-wiki.mjs           # Generate wiki pages
 *   node scripts/generate-wiki.mjs --check   # Validate docs only (no file writes)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PLUGINS_DIR = path.join(ROOT, 'src', 'src', 'plugins');
const CONFIG_DIR = path.join(ROOT, 'src', 'src', 'config');
const LOCALES_DIR = path.join(ROOT, 'src', 'src', 'locales');
const WIKI_DIR = path.join(ROOT, 'wiki');
const META_FILE = path.join(ROOT, 'docs', 'settings-meta.json');
const SETTINGS_GROUPS_DIR = path.join(PLUGINS_DIR, 'settingsGroups');

const CHECK_MODE = process.argv.includes('--check');
const warnings = [];
const errors = [];

// ─── Parsing Helpers ──────────────────────────────────────────────────────────

/**
 * Parse a JSDoc block string into a structured object.
 */
function parseJSDocBlock(raw) {
    const result = { description: '', tags: {} };
    const lines = raw.split('\n').map(l => l.replace(/^\s*\*\s?/, ''));
    const descLines = [];
    let currentTag = null;
    let currentTagValue = [];

    function flushTag() {
        if (currentTag) {
            const value = currentTagValue.join('\n').trim();
            if (result.tags[currentTag]) {
                if (!Array.isArray(result.tags[currentTag])) {
                    result.tags[currentTag] = [result.tags[currentTag]];
                }
                result.tags[currentTag].push(value);
            } else {
                result.tags[currentTag] = value;
            }
        }
    }

    for (const line of lines) {
        const tagMatch = line.match(/^@(\w[\w-]*)\s*(.*)/);
        if (tagMatch) {
            flushTag();
            currentTag = tagMatch[1];
            currentTagValue = [tagMatch[2]];
        } else if (currentTag) {
            currentTagValue.push(line);
        } else {
            descLines.push(line);
        }
    }
    flushTag();

    result.description = descLines.join('\n').trim();
    return result;
}

/**
 * Extract the first file-level JSDoc from file content.
 */
function extractFileJSDoc(content) {
    const match = content.match(/^\s*\/\*\*([\s\S]*?)\*\//);
    if (!match) return null;
    return parseJSDocBlock(match[1]);
}

/**
 * Extract exported class/function names with their preceding JSDoc.
 */
function extractExports(content) {
    const results = [];
    // Use negative lookahead (?!\*\/) to ensure we capture only ONE JSDoc block
    // (prevents matching from an earlier /** across code to a later */ before export)
    const regex = /\/\*\*((?:(?!\*\/)[\s\S])*)\*\/\s+export\s+(?:class|function)\s+(\w+)/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
        results.push({
            name: match[2],
            doc: parseJSDocBlock(match[1]),
        });
    }

    // Also find exports without JSDoc
    const bareRegex = /(?:^|\n)\s*export\s+(?:class|function)\s+(\w+)/g;
    while ((match = bareRegex.exec(content)) !== null) {
        if (!results.find(r => r.name === match[1])) {
            results.push({ name: match[1], doc: null });
        }
    }

    return results;
}

/**
 * Extract all ElainaData.get/set keys from file content.
 */
function extractDataStoreKeys(content) {
    const keys = new Set();
    const regex = /ElainaData\.(?:get|set)\(\s*["']([^"']+)["']/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
        keys.add(match[1]);
    }
    return [...keys].sort();
}

/**
 * Convert PascalCase or camelCase to Title Case with spaces.
 */
function toTitleCase(name) {
    return name
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
        .replace(/^./, s => s.toUpperCase());
}

// ─── Data Loading ─────────────────────────────────────────────────────────────

async function loadDefaults() {
    try {
        const filePath = path.join(CONFIG_DIR, 'datastoreDefault.js');
        const module = await import(pathToFileURL(filePath).href);
        return module.default || {};
    } catch (e) {
        warnings.push(`Could not load datastoreDefault.js: ${e.message}`);
        return {};
    }
}

async function loadLocale() {
    try {
        const filePath = path.join(LOCALES_DIR, 'default.js');
        const module = await import(pathToFileURL(filePath).href);
        return module.default || {};
    } catch (e) {
        warnings.push(`Could not load default locale: ${e.message}`);
        return {};
    }
}

function loadSettingsMeta() {
    try {
        const raw = fs.readFileSync(META_FILE, 'utf-8');
        return JSON.parse(raw);
    } catch (e) {
        warnings.push(`Could not load settings-meta.json: ${e.message}`);
        return { categories: {}, settings: {} };
    }
}

function loadPluginFiles() {
    const files = [];
    const entries = fs.readdirSync(PLUGINS_DIR, { withFileTypes: true });
    for (const entry of entries) {
        if (entry.isFile() && /\.(ts|js)$/.test(entry.name)) {
            const filePath = path.join(PLUGINS_DIR, entry.name);
            const content = fs.readFileSync(filePath, 'utf-8');
            files.push({
                fileName: entry.name,
                filePath,
                content,
                fileDoc: extractFileJSDoc(content),
                exports: extractExports(content),
                dataStoreKeys: extractDataStoreKeys(content),
            });
        }
    }
    return files;
}

// ─── Wiki Page Generators ─────────────────────────────────────────────────────

function generateHomePage(plugins, defaults) {
    const settingsCount = Object.keys(defaults).length;
    const pluginCount = plugins.filter(p => p.exports.length > 0).length;

    return `# Elaina Theme Wiki

Welcome to the **Elaina Theme** wiki — your guide to customizing and using the theme for [Pengu Loader](https://pengu.lol).

## Quick Links

- [**Plugins**](Plugins) — All available plugins and how to use them (${pluginCount} plugins)
- [**Settings Reference**](Settings-Reference) — Complete list of all settings (${settingsCount}+ options)
- [**Theme Customization**](Theme-Customization) — Wallpapers, fonts, banners, icons
- [**FAQ & Troubleshooting**](FAQ) — Common questions and solutions

## How Settings Work

Elaina Theme stores all its configuration in the Pengu Loader DataStore. You can change settings through the in-client settings panel:

1. Open the League Client
2. Go to **Settings** (gear icon)
3. Scroll down to the **Elaina Theme** section
4. You'll find tabs for: **Theme Settings**, **Plugins Settings**, **Backup & Restore**, and **About Us**

## Available Plugins

| Plugin | Description |
|--------|-------------|
${plugins
    .filter(p => p.exports.length > 0)
    .map(p => {
        const exp = p.exports[0];
        const desc = exp.doc?.tags?.wiki
            || exp.doc?.tags?.description
            || exp.doc?.description
            || p.fileDoc?.tags?.description
            || '_No description yet_';
        return `| [${toTitleCase(exp.name)}](Plugin-${exp.name}) | ${desc.split('\n')[0]} |`;
    })
    .join('\n')}

---

> This wiki is auto-generated from source code documentation. To improve it, add JSDoc comments to the source files and push to the main branch.
`;
}

function generatePluginsPage(plugins) {
    let md = `# Plugins

Elaina Theme comes with several plugins that extend the League Client functionality.

## How to Enable Plugins

1. Open the League Client settings
2. Navigate to **Elaina Theme** → **Plugin Settings**
3. Toggle the plugins you want to enable

## Plugin List

`;

    for (const plugin of plugins) {
        if (plugin.exports.length === 0) continue;
        const exp = plugin.exports[0];
        const name = toTitleCase(exp.name);
        const desc = exp.doc?.tags?.wiki
            || exp.doc?.tags?.description
            || exp.doc?.description
            || plugin.fileDoc?.tags?.description
            || '_No description yet_';

        const author = exp.doc?.tags?.author
            || plugin.fileDoc?.tags?.author
            || 'Unknown';

        md += `### [${name}](Plugin-${exp.name})\n\n`;
        md += `${desc.split('\n')[0]}\n\n`;
        md += `- **Author**: ${author}\n`;
        if (plugin.dataStoreKeys.length > 0) {
            md += `- **Settings**: ${plugin.dataStoreKeys.map(k => `\`${k}\``).join(', ')}\n`;
        }
        md += '\n---\n\n';
    }

    return md;
}

function generatePluginPage(plugin, defaults, settingsMeta, locale) {
    if (plugin.exports.length === 0) return null;
    const exp = plugin.exports[0];
    const name = toTitleCase(exp.name);

    const desc = exp.doc?.tags?.wiki
        || exp.doc?.tags?.description
        || exp.doc?.description
        || plugin.fileDoc?.tags?.description
        || '_No description available. Add a `@wiki` or `@description` tag to the class JSDoc._';

    const author = exp.doc?.tags?.author || plugin.fileDoc?.tags?.author || null;
    const modifier = exp.doc?.tags?.modifier || plugin.fileDoc?.tags?.modifier || null;
    const usage = exp.doc?.tags?.usage || null;

    let md = `# ${name}\n\n`;
    md += `${desc}\n\n`;

    // Usage section
    if (usage) {
        md += `## How to Use\n\n${usage}\n\n`;
    } else {
        md += `## How to Use\n\n`;
        md += `1. Open the League Client settings\n`;
        md += `2. Navigate to **Elaina Theme** → **Plugin Settings**\n`;
        md += `3. Enable or configure **${name}**\n\n`;
    }

    // Settings table
    if (plugin.dataStoreKeys.length > 0) {
        md += `## Settings\n\n`;
        md += `| Setting | Default | Description |\n`;
        md += `|---------|---------|-------------|\n`;

        for (const key of plugin.dataStoreKeys) {
            const defaultVal = defaults[key];
            const meta = settingsMeta.settings?.[key];
            const localeName = locale[key.replace(/-/g, '_')] || locale[key] || null;
            const description = meta?.description || localeName || '_Add description in `docs/settings-meta.json`_';
            const displayDefault = defaultVal === undefined ? '_N/A_'
                : typeof defaultVal === 'string' ? `\`"${defaultVal}"\``
                : Array.isArray(defaultVal) ? `_[list]_`
                : `\`${defaultVal}\``;

            md += `| \`${key}\` | ${displayDefault} | ${description} |\n`;
        }
        md += '\n';
    }

    // Credits
    if (author || modifier) {
        md += `## Credits\n\n`;
        if (author) md += `- **Author**: ${author}\n`;
        if (modifier) md += `- **Modified by**: ${modifier}\n`;
        md += '\n';
    }

    md += `---\n\n`;
    md += `> Source: [\`${plugin.fileName}\`](../blob/main/src/src/plugins/${plugin.fileName})\n`;

    return md;
}

function generateSettingsReference(defaults, settingsMeta, locale) {
    let md = `# Settings Reference

Complete list of all Elaina Theme settings. Change these in the League Client under **Settings** → **Elaina Theme**.

`;

    // Group settings by category from meta, or infer from defaults file comments
    const categories = settingsMeta.categories || {};
    const settingsInfo = settingsMeta.settings || {};

    // Build category groups
    const grouped = {};
    const uncategorized = [];

    for (const [key, defaultVal] of Object.entries(defaults)) {
        const meta = settingsInfo[key];
        const category = meta?.category || 'uncategorized';
        if (category === 'uncategorized') {
            uncategorized.push({ key, defaultVal, meta });
        } else {
            if (!grouped[category]) grouped[category] = [];
            grouped[category].push({ key, defaultVal, meta });
        }
    }

    // Render categorized settings
    for (const [catKey, items] of Object.entries(grouped)) {
        const catInfo = categories[catKey] || { name: toTitleCase(catKey) };
        md += `## ${catInfo.name}\n\n`;
        if (catInfo.description) md += `${catInfo.description}\n\n`;
        md += `| Setting | Default | Type | Description |\n`;
        md += `|---------|---------|------|-------------|\n`;

        for (const { key, defaultVal, meta } of items) {
            const type = meta?.type || inferType(defaultVal);
            const localeName = locale[key.replace(/-/g, '_')] || locale[key] || null;
            const description = meta?.description || localeName || '_TODO_';
            const displayDefault = formatDefault(defaultVal);
            md += `| \`${key}\` | ${displayDefault} | ${type} | ${description} |\n`;
        }
        md += '\n';
    }

    // Render uncategorized
    if (uncategorized.length > 0) {
        md += `## Other Settings\n\n`;
        md += `| Setting | Default | Type | Description |\n`;
        md += `|---------|---------|------|-------------|\n`;
        for (const { key, defaultVal, meta } of uncategorized) {
            const type = meta?.type || inferType(defaultVal);
            const localeName = locale[key.replace(/-/g, '_')] || locale[key] || null;
            const description = meta?.description || localeName || '_TODO_';
            const displayDefault = formatDefault(defaultVal);
            md += `| \`${key}\` | ${displayDefault} | ${type} | ${description} |\n`;
        }
        md += '\n';
    }

    md += `---\n\n`;
    md += `> This page is auto-generated. Descriptions are sourced from \`docs/settings-meta.json\`.\n`;
    md += `> To improve descriptions, edit that file and push to the main branch.\n`;

    return md;
}

function generateThemeCustomizationPage(defaults) {
    return `# Theme Customization

## Wallpapers

Elaina Theme supports custom wallpapers on the League Client home screen. Supported formats:
- **Video**: \`.mp4\`, \`.webm\`, \`.mkv\`, \`.mov\`, \`.avi\`, \`.wmv\`, \`.3gp\`, \`.m4v\`
- **Image**: \`.png\`, \`.jpg\`, \`.jpeg\`, \`.gif\`, \`.bmp\`, \`.webp\`, \`.ico\`

### Adding Wallpapers
1. Go to **Settings** → **Elaina Theme** → **Theme Settings**
2. Use the wallpaper management section to add wallpaper filenames
3. Place the actual wallpaper files in the theme's \`assets/backgrounds/wallpapers/\` folder

### Wallpaper Slideshow
- **Setting**: \`wallpaper-slideshow\` (default: \`false\`)
- **Slide interval**: \`wallpaper-change-slide-time\` (default: \`10000\` ms)

## Audio

Custom background audio for the client.
- **Supported formats**: \`.mp3\`, \`.flac\`, \`.ogg\`, \`.wav\`, \`.aac\`
- **Volume**: \`audio-volume\` (default: \`0.15\`)
- **Loop**: \`audio-loop\` (default: \`false\`)
- **Mute in-game**: \`turnoff-audio-ingame\` (default: \`true\`)
- **Disable entirely**: \`Disable-Theme-Audio\` (default: \`false\`)

## Fonts

Custom fonts for the League Client interface.
- **Supported formats**: \`.ttf\`, \`.otf\`, \`.woff\`, \`.woff2\`
- **Enable**: \`Custom-Font\` (default: \`true\`)
- **Current font**: \`CurrentFont\` (default: \`"elaina-herculanum_roman.ttf"\`)

### Default Font List
${(defaults['Font-list'] || []).map(f => `- \`${f}\``).join('\n')}

## Banners

Custom regalia banners for your profile.
- **Enable**: \`Custom-Regalia-Banner\` (default: \`true\`)
- **Current banner**: \`CurrentBanner\` (default: \`"faker_2.png"\`)

### Default Banner List
${(defaults['Banner-list'] || []).map(b => `- \`${b}\``).join('\n')}

## Custom Icons & UI Elements

| Feature | Setting | Default |
|---------|---------|---------|
| Custom Avatar | \`Custom-Avatar\` | \`true\` |
| Custom Icon | \`Custom-Icon\` | \`true\` |
| Custom Loading Icon | \`Custom-Loading-Icon\` | \`true\` |
| Custom Border | \`Custom-Border\` | \`true\` |
| Custom RP Icon | \`Custom-RP-Icon\` | \`true\` |
| Custom BE Icon | \`Custom-BE-Icon\` | \`true\` |
| Custom Rank Icon | \`Custom-Rank-Icon\` | \`true\` |
| Custom Emblem | \`Custom-Emblem\` | \`true\` |
| Custom Clash Banner | \`Custom-Clash-banner\` | \`true\` |
| Custom Gamemode Icon | \`Custom-Gamemode-Icon\` | \`true\` |
| Custom Trophy | \`Custom-Trophy\` | \`true\` |
| Custom Ticker | \`Custom-Ticker\` | \`true\` |
| Custom Cursor | \`Custom-Cursor\` | \`false\` |
| Rune Backgrounds | \`Runes-BG\` | \`true\` |

## UI Tweaks

| Feature | Setting | Default |
|---------|---------|---------|
| Sidebar Transparent | \`sidebar-transparent\` | \`false\` |
| Lobby Transparent Filter | \`lobby-transparent-filter\` | \`true\` |
| Settings Dialogs Transparent | \`settings-dialogs-transparent\` | \`false\` |
| Hide Profile Background | \`hide-profile-background\` | \`true\` |
| Hide Champion Splash Art | \`hide-champions-splash-art\` | \`false\` |
| Hide Vertical Lines | \`hide-vertical-lines\` | \`true\` |
| Custom Nickname Color | \`change-nickname-color\` | \`true\` |
| Nickname Color | \`nickname-color\` | \`"#f2c1d0"\` |

---

> Place custom assets in the \`assets/\` folder within the theme's plugin directory.
`;
}

function generateFAQPage() {
    return `# FAQ & Troubleshooting

## Frequently Asked Questions

### How do I install Elaina Theme?
1. Install [Pengu Loader](https://pengu.lol)
2. Download Elaina Theme from the [releases page](https://github.com/Elaina69/Elaina-theme/releases)
3. Place the theme files in your Pengu Loader plugins directory
4. Restart the League Client

### Where do I put custom wallpapers/audio/fonts?
Place them in the corresponding subdirectory of the theme's \`assets/\` folder:
- Wallpapers: \`assets/backgrounds/wallpapers/\`
- Audio: \`assets/backgrounds/audio/\`
- Fonts: \`assets/fonts/\`
- Banners: \`assets/icon/regalia-banners/\`

### How do I access theme settings?
Open the League Client → **Settings** (gear icon) → scroll down to **Elaina Theme**

### My settings aren't saving / theme isn't loading
1. Make sure Pengu Loader is properly installed
2. Check that the theme folder structure is correct
3. Try restarting the League Client
4. If using backup/restore, check your internet connection

### How do I back up my settings?
1. Go to **Settings** → **Elaina Theme** → **Backup & Restore**
2. Enable \`backup-datastore\`
3. Your settings will be automatically backed up when you close the client

### How do I enable developer mode?
Click the plugin logo in Plugins Settings 20 times to reveal the developer mode toggle.

---

> Don't see your question? [Open an issue](https://github.com/Elaina69/Elaina-theme/issues) or ask on [Discord](https://discord.gg/elainatheme).
`;
}

function generateSidebar(plugins) {
    let md = `**[Home](Home)**\n\n`;
    md += `**Getting Started**\n`;
    md += `- [Theme Customization](Theme-Customization)\n`;
    md += `- [Settings Reference](Settings-Reference)\n`;
    md += `- [FAQ & Troubleshooting](FAQ)\n\n`;
    md += `**[Plugins](Plugins)**\n`;

    for (const plugin of plugins) {
        if (plugin.exports.length === 0) continue;
        const exp = plugin.exports[0];
        md += `- [${toTitleCase(exp.name)}](Plugin-${exp.name})\n`;
    }

    return md;
}

// ─── Utility ──────────────────────────────────────────────────────────────────

function inferType(value) {
    if (value === null || value === undefined) return 'unknown';
    if (Array.isArray(value)) return 'array';
    return typeof value;
}

function formatDefault(value) {
    if (value === undefined) return '_N/A_';
    if (typeof value === 'string') return value === '' ? '_empty_' : `\`"${value}"\``;
    if (Array.isArray(value)) return `_[${value.length} items]_`;
    return `\`${value}\``;
}

// ─── Validation (--check mode) ────────────────────────────────────────────────

function validateDocs(plugins, defaults, settingsMeta) {
    let issueCount = 0;

    // Check plugin documentation
    for (const plugin of plugins) {
        if (plugin.exports.length === 0) continue;
        for (const exp of plugin.exports) {
            if (!exp.doc) {
                warnings.push(`[MISSING DOC] ${plugin.fileName}: exported ${exp.name} has no JSDoc`);
                issueCount++;
            } else if (!exp.doc.tags.wiki && !exp.doc.tags.description && !exp.doc.description) {
                warnings.push(`[NO DESCRIPTION] ${plugin.fileName}: ${exp.name} has JSDoc but no @wiki or @description`);
                issueCount++;
            }
        }
    }

    // Check settings-meta.json coverage
    const documentedSettings = new Set(Object.keys(settingsMeta.settings || {}));
    const allSettings = Object.keys(defaults);
    const undocumented = allSettings.filter(k => !documentedSettings.has(k));

    if (undocumented.length > 0) {
        warnings.push(`[SETTINGS] ${undocumented.length}/${allSettings.length} settings missing from docs/settings-meta.json:`);
        for (const key of undocumented.slice(0, 10)) {
            warnings.push(`  - "${key}"`);
        }
        if (undocumented.length > 10) {
            warnings.push(`  ... and ${undocumented.length - 10} more`);
        }
        issueCount += undocumented.length;
    }

    return issueCount;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
    console.log('📖 Elaina Theme Wiki Generator\n');

    // Load data
    console.log('Loading data sources...');
    const defaults = await loadDefaults();
    const locale = await loadLocale();
    const settingsMeta = loadSettingsMeta();
    const plugins = loadPluginFiles();

    console.log(`  Found ${plugins.length} plugin files`);
    console.log(`  Found ${Object.keys(defaults).length} settings`);
    console.log(`  Found ${Object.keys(locale).length} locale strings`);
    console.log(`  Found ${Object.keys(settingsMeta.settings || {}).length} documented settings\n`);

    // Validate
    const issueCount = validateDocs(plugins, defaults, settingsMeta);

    if (CHECK_MODE) {
        console.log('─── Validation Results ───\n');
        if (warnings.length > 0) {
            for (const w of warnings) console.log(`  ⚠ ${w}`);
        }
        if (errors.length > 0) {
            for (const e of errors) console.log(`  ✖ ${e}`);
        }
        console.log(`\n${issueCount} documentation issue(s) found.`);

        if (errors.length > 0) {
            process.exit(1);
        }
        // Warnings don't fail the check — they're informational for gradual adoption
        process.exit(0);
    }

    // Generate wiki pages
    console.log('Generating wiki pages...');
    fs.mkdirSync(WIKI_DIR, { recursive: true });

    const pages = {
        'Home.md': generateHomePage(plugins, defaults),
        'Plugins.md': generatePluginsPage(plugins),
        'Settings-Reference.md': generateSettingsReference(defaults, settingsMeta, locale),
        'Theme-Customization.md': generateThemeCustomizationPage(defaults),
        'FAQ.md': generateFAQPage(),
        '_Sidebar.md': generateSidebar(plugins),
    };

    // Generate individual plugin pages
    for (const plugin of plugins) {
        const page = generatePluginPage(plugin, defaults, settingsMeta, locale);
        if (page) {
            const exp = plugin.exports[0];
            pages[`Plugin-${exp.name}.md`] = page;
        }
    }

    // Write pages
    let written = 0;
    for (const [filename, content] of Object.entries(pages)) {
        const filePath = path.join(WIKI_DIR, filename);
        fs.writeFileSync(filePath, content, 'utf-8');
        written++;
    }

    console.log(`  ✔ Written ${written} wiki pages to wiki/\n`);

    // Show warnings
    if (warnings.length > 0) {
        console.log('── Documentation Improvement Suggestions ──\n');
        for (const w of warnings) console.log(`  ⚠ ${w}`);
        console.log(`\nAdd JSDoc @wiki tags to plugin classes and fill docs/settings-meta.json to improve the wiki.\n`);
    }

    console.log('Done! Wiki pages are in the wiki/ directory.');
}

main().catch(e => {
    console.error('Fatal error:', e);
    process.exit(1);
});
