import Color from "colorjs.io";

const styles = window.getComputedStyle(document.body);

export function cssVarToHex(cssVar:string) {
    // Get css computed style
    const v = styles.getPropertyValue(cssVar);
    if (v === '') {
        console.warn(`CSS variable not found: ${cssVar}`);
        return "#000000";
    }

    // Create new color object
    const color = new Color(v);

    // Convert to hex
    const hex = color.to('srgb').toString({ format: 'hex' });
    return hex;
}