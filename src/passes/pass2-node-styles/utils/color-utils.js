/**
 * Color utility functions for converting Figma colors to CSS
 */

/**
 * Convert RGBA color to hex
 * @param {Object} rgba - RGBA color object
 * @returns {string} Hex color
 */
function rgbaToHex(rgba) {
    if (!rgba) return '#000000';
    
    // Ensure we have valid numeric values and handle NaN
    const r = (typeof rgba.r === 'number' && !isNaN(rgba.r)) ? Math.round(rgba.r * 255) : 0;
    const g = (typeof rgba.g === 'number' && !isNaN(rgba.g)) ? Math.round(rgba.g * 255) : 0;
    const b = (typeof rgba.b === 'number' && !isNaN(rgba.b)) ? Math.round(rgba.b * 255) : 0;
    const a = (typeof rgba.a === 'number' && !isNaN(rgba.a)) ? rgba.a : 1;
    
    const toHex = (n) => {
        if (typeof n !== 'number' || isNaN(n)) return '00';
        const hex = Math.round(n).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    
    if (a === 1) {
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    } else {
        return `rgba(${r}, ${g}, ${b}, ${a})`;
    }
}

/**
 * Round a number to a reasonable precision for CSS
 * @param {number} value - Number to round
 * @param {number} precision - Number of decimal places (default: 2)
 * @returns {number} Rounded number
 */
function roundCSS(value, precision = 2) {
    if (typeof value !== 'number' || isNaN(value)) return 0;
    return Math.round(value * Math.pow(10, precision)) / Math.pow(10, precision);
}

module.exports = {
    rgbaToHex,
    roundCSS
};
