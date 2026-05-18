import { addStyleNode } from './_addStyleNode';

/**
 * Adds a custom cursor to the document
 * @param {string} folder - The cursor image path
 * @param {string} css - Additional CSS for the cursor
 */
export function CustomCursor(folder: string, css: string) {
    const cursor = document.createElement("div");
    cursor.classList.add("cursor");
    cursor.style.background = folder;

    document.addEventListener('mousemove', (e) => {
        cursor.style.transform = `translate3d(calc(${e.clientX}px - 40%), calc(${e.clientY}px - 40%), 0)`;
    });

    let htmlElement: any = document.querySelector("html")
    htmlElement.appendChild(cursor);
    addStyleNode(css);
}
