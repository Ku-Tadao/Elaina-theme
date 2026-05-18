/**
 * Adds a CSS style to the document body with a specific ID
 * @param Id The ID for the style element
 * @param style The CSS style to add
 */
export function addStyleNodeWithID(Id: string, style: string) {
    const styleElement = document.createElement('style');
    styleElement.id = Id
    styleElement.appendChild(document.createTextNode(style));
    document.body.appendChild(styleElement);
}
