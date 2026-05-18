/**
 * Adds a CSS style to the document body
 * @param {string} style - The CSS style to add
 */
export function addStyleNode(style: string) {
    const styleElement = document.createElement('style');
    styleElement.appendChild(document.createTextNode(style));
    document.body.appendChild(styleElement);
}
