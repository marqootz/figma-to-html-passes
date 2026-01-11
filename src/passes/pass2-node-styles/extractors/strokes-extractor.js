/**
 * Strokes extractor for extracting border/stroke styles from Figma nodes
 */

const { rgbaToHex } = require('../utils/color-utils');

/**
 * Extract stroke styles from a node
 * @param {Object} node - Figma node
 * @returns {Object} Stroke styles
 */
function extractStrokes(node) {
    if (!node.strokes || !Array.isArray(node.strokes) || node.strokes.length === 0) {
        return null;
    }

    const stroke = node.strokes[0]; // Use first stroke
    
    // Check if individual strokes are enabled or if strokeWeight is mixed
    const hasIndividualStrokes = node.individualStrokes || 
                                 (node.strokeWeight && typeof node.strokeWeight === 'string' && node.strokeWeight.includes('mixed')) ||
                                 (typeof node.strokeTopWeight === 'number' && node.strokeTopWeight !== undefined) ||
                                 (typeof node.strokeRightWeight === 'number' && node.strokeRightWeight !== undefined) ||
                                 (typeof node.strokeBottomWeight === 'number' && node.strokeBottomWeight !== undefined) ||
                                 (typeof node.strokeLeftWeight === 'number' && node.strokeLeftWeight !== undefined);
    
    if (hasIndividualStrokes) {
        // Combine stroke color with opacity for proper color conversion
        const strokeColorWithOpacity = stroke.type === 'SOLID' && stroke.color ? {
            r: stroke.color.r,
            g: stroke.color.g,
            b: stroke.color.b,
            a: stroke.opacity !== undefined ? stroke.opacity : (stroke.color.a !== undefined ? stroke.color.a : 1)
        } : null;

        return {
            type: stroke.type,
            color: strokeColorWithOpacity ? rgbaToHex(strokeColorWithOpacity) : null,
            opacity: stroke.opacity !== undefined ? stroke.opacity : 1,
            align: node.strokeAlign || 'INSIDE',
            individualStrokes: true,
            // Individual stroke weights
            strokeTopWeight: typeof node.strokeTopWeight === 'number' ? node.strokeTopWeight : (typeof node.strokeWeight === 'number' ? node.strokeWeight : 1),
            strokeRightWeight: typeof node.strokeRightWeight === 'number' ? node.strokeRightWeight : (typeof node.strokeWeight === 'number' ? node.strokeWeight : 1),
            strokeBottomWeight: typeof node.strokeBottomWeight === 'number' ? node.strokeBottomWeight : (typeof node.strokeWeight === 'number' ? node.strokeWeight : 1),
            strokeLeftWeight: typeof node.strokeLeftWeight === 'number' ? node.strokeLeftWeight : (typeof node.strokeWeight === 'number' ? node.strokeWeight : 1),
            // Individual stroke colors (if available)
            strokeTopColor: node.strokeTopColor ? rgbaToHex(node.strokeTopColor) : (strokeColorWithOpacity ? rgbaToHex(strokeColorWithOpacity) : null),
            strokeRightColor: node.strokeRightColor ? rgbaToHex(node.strokeRightColor) : (strokeColorWithOpacity ? rgbaToHex(strokeColorWithOpacity) : null),
            strokeBottomColor: node.strokeBottomColor ? rgbaToHex(node.strokeBottomColor) : (strokeColorWithOpacity ? rgbaToHex(strokeColorWithOpacity) : null),
            strokeLeftColor: node.strokeLeftColor ? rgbaToHex(node.strokeLeftColor) : (strokeColorWithOpacity ? rgbaToHex(strokeColorWithOpacity) : null)
        };
    }
    
    // Standard stroke (all sides same)
    // Combine stroke color with opacity for proper color conversion
    const strokeColorWithOpacity = stroke.type === 'SOLID' && stroke.color ? {
        r: stroke.color.r,
        g: stroke.color.g,
        b: stroke.color.b,
        a: stroke.opacity !== undefined ? stroke.opacity : (stroke.color.a !== undefined ? stroke.color.a : 1)
    } : null;

    return {
        type: stroke.type,
        color: strokeColorWithOpacity ? rgbaToHex(strokeColorWithOpacity) : null,
        weight: typeof node.strokeWeight === 'number' ? node.strokeWeight : 1,
        align: node.strokeAlign || 'INSIDE',
        opacity: stroke.opacity !== undefined ? stroke.opacity : 1,
        individualStrokes: false
    };
}

module.exports = {
    extractStrokes
};
