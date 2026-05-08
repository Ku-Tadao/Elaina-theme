import { cdnImport } from "./theme/Cdn.ts"

/** Get this theme folder's name */
export function getThemeName(): string | null {
    const error = new Error();
    const stackTrace = error.stack;
    const scriptPath = stackTrace
        ?.match(/(?:http|https):\/\/plugins\/[^\s)]+\.js/g)
        ?.find((url) => !url.includes('/@/'));
    const match = scriptPath?.match(/\/\/plugins\/([^/?#]+)\//);
    return match ? match[1] : null;
}

export { cdnImport }

window.getThemeName = getThemeName
window.cdnImport = cdnImport
