/**
 * Fills extractor for extracting background/fill styles from Figma nodes
 */

const { rgbaToHex } = require('../utils/color-utils');

/**
 * Extract fill styles from a node
 * @param {Object} node - Figma node
 * @returns {Array} Array of fill styles
 */
function extractFills(node) {
    if (!node.fills || !Array.isArray(node.fills)) {
        return [];
    }

    return node.fills.map(fill => {
        const fillStyle = {
            type: fill.type,
            visible: fill.visible !== false,
            opacity: fill.opacity !== undefined ? fill.opacity : 1
        };

        switch (fill.type) {
            case 'SOLID':
                // Apply fill opacity to the color's alpha value
                const colorA = typeof fill.color.a === 'number' ? fill.color.a : 1;
                const opacity = typeof fillStyle.opacity === 'number' ? fillStyle.opacity : 1;
                const colorWithOpacity = {
                    r: fill.color.r,
                    g: fill.color.g,
                    b: fill.color.b,
                    a: colorA * opacity
                };
                fillStyle.color = rgbaToHex(colorWithOpacity);
                break;
            case 'GRADIENT_LINEAR':
            case 'GRADIENT_RADIAL':
            case 'GRADIENT_ANGULAR':
            case 'GRADIENT_DIAMOND':
                // Apply fill opacity to gradient stops
                const fillOpacity = typeof fillStyle.opacity === 'number' ? fillStyle.opacity : 1;
                fillStyle.gradientStops = fill.gradientStops.map(stop => {
                    const stopColorA = typeof stop.color.a === 'number' ? stop.color.a : 1;
                    return {
                        position: stop.position,
                        color: {
                            r: stop.color.r,
                            g: stop.color.g,
                            b: stop.color.b,
                            a: stopColorA * fillOpacity
                        }
                    };
                });
                fillStyle.gradientTransform = fill.gradientTransform;
                break;
            case 'IMAGE':
                fillStyle.imageRef = fill.imageRef;
                fillStyle.scaleMode = fill.scaleMode;
                break;
        }

        return fillStyle;
    });
}

module.exports = {
    extractFills
};
