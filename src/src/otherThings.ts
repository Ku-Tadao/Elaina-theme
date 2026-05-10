import { cdnImport } from "./theme/Cdn.ts"

var cachedThemeName: string | null = null;

/**
 * Extract the theme folder name from the call stack.
 */
function getThemeNameFromStack(): string | null {
    const error = new Error();
    const stackTrace = error.stack;
    const scriptPath = stackTrace
        ?.match(/(?:http|https):\/\/plugins\/[^\s)]+\.js/g)
        ?.find((url) => !url.includes('/@/'));

    if (!scriptPath) return null;

    // Try scoped path first: //plugins/@Scope/folder-name/
    const scopedMatch = scriptPath.match(/\/\/plugins\/(@[^/]+\/[^/?#]+)\//);
    if (scopedMatch) return scopedMatch[1];

    // Fallback to unscoped path: //plugins/folder-name/
    const unscopedMatch = scriptPath.match(/\/\/plugins\/([^/?#]+)\//);
    return unscopedMatch ? unscopedMatch[1] : null;
}

/**
 * Initialize the theme name using Pengu context APIs.
 */
export function initThemeName(context: any): void {
    // Already resolved
    if (cachedThemeName) return;

    const folderName: string | undefined = context?.meta?.name;

    // New Pengu: resolve scope from Pengu.plugins list
    if (folderName && typeof Pengu !== 'undefined' && Array.isArray(Pengu.plugins)) {
        // Pengu.plugins entries look like "@Scope\\folder\\index.js" or "folder\\index.js"
        // Normalize backslashes to forward slashes for matching
        const normalized = Pengu.plugins.map((p: string) => p.replace(/\\/g, '/'));

        const match = normalized.find((entry: string) => {
            // Match entries where the second-to-last segment is the folder name
            // e.g. "@Elaina-Plugins/elaina-theme/index.js" → "elaina-theme"
            const segments = entry.split('/');
            // For scoped:  ["@Scope", "folder", "index.js"] → segments[-2] = "folder"
            // For unscoped: ["folder", "index.js"]          → segments[-2] = "folder"
            const pluginFolder = segments.length >= 2 ? segments[segments.length - 2] : null;
            return pluginFolder === folderName;
        });

        if (match) {
            // Remove the trailing "/index.js" (or similar entry file) to get the plugin path
            const lastSlash = match.lastIndexOf('/');
            cachedThemeName = lastSlash > 0 ? match.substring(0, lastSlash) : folderName;
            return;
        }
    }

    // Fallback: stack-trace regex (works for old Pengu without @scope)
    cachedThemeName = getThemeNameFromStack();
}

/** Get this theme folder's name (may include @scope, e.g. "@Elaina-Plugins/elaina-theme") */
export function getThemeName(): string | null {
    if (cachedThemeName) return cachedThemeName;

    // If initThemeName was never called (old Pengu path), try stack trace
    cachedThemeName = getThemeNameFromStack();
    return cachedThemeName;
}

export { cdnImport }

window.getThemeName = getThemeName
window.cdnImport = cdnImport
