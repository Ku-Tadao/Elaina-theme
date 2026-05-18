/** Updates the source of images matching a specific old source to a new source
 * @param {string} oldSrc - The old image source to match
 * @param {string} newSrc - The new image source to set
 */
export function updateImageSrc(oldSrc: string, newSrc: string) {
    const originalSrc: any = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, "src");

    Object.defineProperty(HTMLImageElement.prototype, "src", {
        get: originalSrc.get,
        set: function(value) {
            if (typeof value === "string" && value.includes(oldSrc)) {
                const newLink = newSrc;
                return originalSrc.set.call(this, newLink);
            }

            return originalSrc.set.call(this, value);
        }
    });
}
