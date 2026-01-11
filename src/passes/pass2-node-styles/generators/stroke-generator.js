/**
 * Stroke CSS generator for converting stroke styles to CSS border properties
 */

const { roundCSS } = require('../utils/color-utils');

/**
 * Generate stroke CSS rules from stroke styles
 * @param {Object} stroke - Stroke styles
 * @returns {Array} Array of CSS rule strings
 */
function generateStrokeCSS(stroke) {
    if (!stroke || stroke.type !== 'SOLID') {
        return [];
    }

    const rules = [];

    if (stroke.individualStrokes) {
        // Generate individual border properties for each side
        generateIndividualStrokeCSS(stroke, rules);
    } else {
        // Generate standard border property
        generateStandardStrokeCSS(stroke, rules);
    }

    return rules;
}

/**
 * Generate individual stroke CSS (border-top, border-right, etc.)
 * @param {Object} stroke - Stroke styles with individual properties
 * @param {Array} rules - Array to add CSS rules to
 */
function generateIndividualStrokeCSS(stroke, rules) {
    // Top border
    if (typeof stroke.strokeTopWeight === 'number' && stroke.strokeTopWeight > 0) {
        const color = stroke.strokeTopColor || stroke.color;
        if (color) {
            rules.push(`border-top: ${roundCSS(stroke.strokeTopWeight)}px solid ${color};`);
        }
    }

    // Right border
    if (typeof stroke.strokeRightWeight === 'number' && stroke.strokeRightWeight > 0) {
        const color = stroke.strokeRightColor || stroke.color;
        if (color) {
            rules.push(`border-right: ${roundCSS(stroke.strokeRightWeight)}px solid ${color};`);
        }
    }

    // Bottom border
    if (typeof stroke.strokeBottomWeight === 'number' && stroke.strokeBottomWeight > 0) {
        const color = stroke.strokeBottomColor || stroke.color;
        if (color) {
            rules.push(`border-bottom: ${roundCSS(stroke.strokeBottomWeight)}px solid ${color};`);
        }
    }

    // Left border
    if (typeof stroke.strokeLeftWeight === 'number' && stroke.strokeLeftWeight > 0) {
        const color = stroke.strokeLeftColor || stroke.color;
        if (color) {
            rules.push(`border-left: ${roundCSS(stroke.strokeLeftWeight)}px solid ${color};`);
        }
    }

    // If all sides have the same weight and color, use shorthand
    if (typeof stroke.strokeTopWeight === 'number' && stroke.strokeTopWeight > 0 &&
        stroke.strokeTopWeight === stroke.strokeRightWeight &&
        stroke.strokeRightWeight === stroke.strokeBottomWeight &&
        stroke.strokeBottomWeight === stroke.strokeLeftWeight &&
        stroke.strokeTopColor === stroke.strokeRightColor &&
        stroke.strokeRightColor === stroke.strokeBottomColor &&
        stroke.strokeBottomColor === stroke.strokeLeftColor) {
        
        // Clear individual properties and use shorthand instead
        rules.length = 0;
        const color = stroke.strokeTopColor || stroke.color;
        if (color) {
            rules.push(`border: ${roundCSS(stroke.strokeTopWeight)}px solid ${color};`);
        }
    }
}

/**
 * Generate standard stroke CSS (single border property)
 * @param {Object} stroke - Stroke styles
 * @param {Array} rules - Array to add CSS rules to
 */
function generateStandardStrokeCSS(stroke, rules) {
    if (typeof stroke.weight === 'number' && stroke.weight > 0 && stroke.color) {
        rules.push(`border: ${roundCSS(stroke.weight)}px solid ${stroke.color};`);
    }
}

/**
 * Generate border shorthand CSS from individual stroke properties
 * @param {Object} stroke - Stroke styles
 * @returns {string|null} CSS border shorthand or null
 */
function generateBorderShorthand(stroke) {
    if (!stroke || stroke.type !== 'SOLID' || !stroke.color) {
        return null;
    }

    if (stroke.individualStrokes) {
        // Check if all sides are the same
        if (typeof stroke.strokeTopWeight === 'number' && stroke.strokeTopWeight > 0 &&
            stroke.strokeTopWeight === stroke.strokeRightWeight &&
            stroke.strokeRightWeight === stroke.strokeBottomWeight &&
            stroke.strokeBottomWeight === stroke.strokeLeftWeight &&
            stroke.strokeTopColor === stroke.strokeRightColor &&
            stroke.strokeRightColor === stroke.strokeBottomColor &&
            stroke.strokeBottomColor === stroke.strokeLeftColor) {
            
            return `${roundCSS(stroke.strokeTopWeight)}px solid ${stroke.strokeTopColor}`;
        }
        
        // If sides are different, return null (use individual properties)
        return null;
    }

    // Standard stroke
    if (typeof stroke.weight === 'number' && stroke.weight > 0) {
        return `${roundCSS(stroke.weight)}px solid ${stroke.color}`;
    }

    return null;
}

module.exports = {
    generateStrokeCSS,
    generateIndividualStrokeCSS,
    generateStandardStrokeCSS,
    generateBorderShorthand
};
