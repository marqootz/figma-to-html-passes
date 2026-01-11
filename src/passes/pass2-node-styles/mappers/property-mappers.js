/**
 * Property mappers for converting Figma property values to CSS values
 */

/**
 * Map Figma layout sizing to CSS
 * @param {string} sizing - Figma layout sizing
 * @param {string} direction - 'horizontal' or 'vertical'
 * @returns {string} CSS rule
 */
function mapLayoutSizingToCSS(sizing, direction) {
    if (direction === 'horizontal') {
        switch (sizing) {
            case 'FILL':
                return 'width: 100%;';
            case 'HUG':
                return 'width: fit-content;';
            default:
                return null;
        }
    } else if (direction === 'vertical') {
        switch (sizing) {
            case 'FILL':
                return 'height: 100%;';
            case 'HUG':
                return 'height: fit-content;';
            default:
                return null;
        }
    }
    return null;
}

/**
 * Map Figma blend mode to CSS mix-blend-mode
 * @param {string} blendMode - Figma blend mode
 * @returns {string|null} CSS mix-blend-mode value
 */
function mapBlendModeToCSS(blendMode) {
    const mapping = {
        'NORMAL': 'normal',
        'PASS_THROUGH': 'normal', // PASS_THROUGH maps to normal in CSS
        'MULTIPLY': 'multiply',
        'SCREEN': 'screen',
        'OVERLAY': 'overlay',
        'DARKEN': 'darken',
        'LIGHTEN': 'lighten',
        'COLOR_DODGE': 'color-dodge',
        'COLOR_BURN': 'color-burn',
        'HARD_LIGHT': 'hard-light',
        'SOFT_LIGHT': 'soft-light',
        'DIFFERENCE': 'difference',
        'EXCLUSION': 'exclusion',
        'HUE': 'hue',
        'SATURATION': 'saturation',
        'COLOR': 'color',
        'LUMINOSITY': 'luminosity'
    };
    return mapping[blendMode] || null;
}

/**
 * Map Figma text align to CSS text-align
 * @param {string} textAlign - Figma text align
 * @returns {string} CSS text-align value
 */
function mapTextAlignToCSS(textAlign) {
    switch (textAlign) {
        case 'LEFT':
            return 'left';
        case 'CENTER':
            return 'center';
        case 'RIGHT':
            return 'right';
        case 'JUSTIFIED':
            return 'justify';
        default:
            return 'left';
    }
}

/**
 * Map Figma stroke align to CSS equivalent
 * @param {string} strokeAlign - Figma stroke align
 * @returns {string|null} CSS equivalent or null if not directly supported
 */
function mapStrokeAlignToCSS(strokeAlign) {
    // CSS doesn't directly support stroke alignment like Figma
    // This is mainly for reference and potential future use
    switch (strokeAlign) {
        case 'INSIDE':
            return 'inside'; // Not standard CSS, but can be used for reference
        case 'OUTSIDE':
            return 'outside'; // Not standard CSS, but can be used for reference
        case 'CENTER':
        default:
            return 'center'; // Default stroke behavior in CSS
    }
}

/**
 * Map Figma effect type to CSS filter/shadow type
 * @param {string} effectType - Figma effect type
 * @returns {string|null} CSS effect type
 */
function mapEffectTypeToCSS(effectType) {
    switch (effectType) {
        case 'DROP_SHADOW':
            return 'drop-shadow';
        case 'INNER_SHADOW':
            return 'inner-shadow'; // Not standard CSS, needs special handling
        case 'LAYER_BLUR':
            return 'blur';
        case 'BACKGROUND_BLUR':
            return 'backdrop-blur';
        default:
            return null;
    }
}

// Constraints mapping removed - using x/y coordinates directly

module.exports = {
    mapLayoutSizingToCSS,
    mapBlendModeToCSS,
    mapTextAlignToCSS,
    mapStrokeAlignToCSS,
    mapEffectTypeToCSS
};
