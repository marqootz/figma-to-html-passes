/**
 * Typography CSS generator for converting typography styles to CSS rules
 */

const { roundCSS } = require('../utils/color-utils');

/**
 * Generate typography CSS rules from typography styles
 * @param {Object} typography - Typography styles
 * @returns {Array} Array of CSS rule strings
 */
function generateTypographyCSS(typography) {
    const rules = [];
    
    // Font properties
    if (typography.fontFamily) {
        rules.push(`font-family: "${typography.fontFamily}", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;`);
    }
    if (typography.fontSize) {
        rules.push(`font-size: ${roundCSS(typography.fontSize)}px;`);
    }
    if (typography.fontWeight) {
        rules.push(`font-weight: ${typography.fontWeight};`);
    }
    if (typography.fontStyle) {
        rules.push(`font-style: ${typography.fontStyle};`);
    }
    if (typography.fontVariant && typography.fontVariant !== 'normal') {
        rules.push(`font-variant: ${typography.fontVariant};`);
    }
    if (typography.fontStretch && typography.fontStretch !== 'normal') {
        rules.push(`font-stretch: ${typography.fontStretch};`);
    }
    
    // Text decoration
    if (typography.textDecoration && typography.textDecoration !== 'none') {
        let decoration = typography.textDecoration;
        if (typography.textDecorationStyle && typography.textDecorationStyle !== 'solid') {
            decoration += ` ${typography.textDecorationStyle}`;
        }
        if (typography.textDecorationColor && typography.textDecorationColor !== 'currentColor') {
            decoration += ` ${typography.textDecorationColor}`;
        }
        rules.push(`text-decoration: ${decoration};`);
    }
    
    // Text alignment
    if (typography.textAlign && typeof typography.textAlign === 'string') {
        rules.push(`text-align: ${typography.textAlign.toLowerCase()};`);
    }
    if (typography.textAlignVertical && typography.textAlignVertical !== 'top') {
        // Map vertical alignment to CSS
        const verticalAlign = mapVerticalAlignment(typography.textAlignVertical);
        if (verticalAlign) {
            rules.push(`vertical-align: ${verticalAlign};`);
        }
    }
    
    // Spacing and layout
    if (typography.lineHeight !== undefined && typography.lineHeight !== 'normal') {
        // Check if it's already a percentage value (contains '%')
        if (typeof typography.lineHeight === 'string' && typography.lineHeight.includes('%')) {
            rules.push(`line-height: ${typography.lineHeight};`);
        } else {
            rules.push(`line-height: ${roundCSS(typography.lineHeight)}px;`);
        }
    }
    if (typography.letterSpacing && typography.letterSpacing !== 0) {
        rules.push(`letter-spacing: ${roundCSS(typography.letterSpacing)}px;`);
    }
    
    // Leading trim - CSS text-box-trim and text-box-edge properties
    if (typography.leadingTrim && typography.leadingTrim !== 'NONE') {
        const trimValue = mapLeadingTrimToCSS(typography.leadingTrim);
        if (trimValue) {
            rules.push(`text-box-trim: ${trimValue.trim};`);
            rules.push(`text-box-edge: ${trimValue.edge};`);
        }
    }
    
    // Text auto resize - CSS width/height behavior
    if (typography.textAutoResize && typography.textAutoResize !== 'FIXED') {
        const resizeValue = mapTextAutoResizeToCSS(typography.textAutoResize);
        if (resizeValue) {
            if (resizeValue.width) {
                rules.push(`width: ${resizeValue.width};`);
            }
            if (resizeValue.height) {
                rules.push(`height: ${resizeValue.height};`);
            }
            // whiteSpace is now handled by the extractor, so we don't override it here
        }
    }
    if (typography.wordSpacing && typography.wordSpacing !== 'normal') {
        rules.push(`word-spacing: ${roundCSS(typography.wordSpacing)}px;`);
    }
    if (typography.paragraphSpacing && typography.paragraphSpacing !== 0) {
        rules.push(`margin-bottom: ${roundCSS(typography.paragraphSpacing)}px;`);
    }
    if (typography.textIndent && typography.textIndent !== 0) {
        rules.push(`text-indent: ${roundCSS(typography.textIndent)}px;`);
    }
    
    // Text transformation
    if (typography.textTransform && typography.textTransform !== 'none') {
        rules.push(`text-transform: ${typography.textTransform};`);
    }
    
    // Text effects
    if (typography.textShadow) {
        rules.push(`text-shadow: ${typography.textShadow};`);
    }
    if (typography.textStroke) {
        rules.push(`-webkit-text-stroke: ${typography.textStroke};`);
    }
    
    // Advanced properties
    if (typography.whiteSpace && typography.whiteSpace !== 'normal') {
        rules.push(`white-space: ${typography.whiteSpace};`);
    }
    if (typography.textOverflow && typography.textOverflow !== 'clip') {
        rules.push(`text-overflow: ${typography.textOverflow};`);
    }
    
    
    // Opacity and blending
    if (typography.textOpacity !== undefined && typography.textOpacity !== 1) {
        rules.push(`opacity: ${typography.textOpacity};`);
    }
    if (typography.mixBlendMode) {
        const { mapBlendModeToCSS } = require('../mappers/property-mappers');
        const cssBlendMode = mapBlendModeToCSS(typography.mixBlendMode);
        if (cssBlendMode && cssBlendMode !== 'normal') {
            rules.push(`mix-blend-mode: ${cssBlendMode};`);
        }
    }
    
    return rules;
}

/**
 * Map Figma vertical alignment to CSS vertical-align
 * @param {string} verticalAlign - Figma vertical alignment value
 * @returns {string|null} CSS vertical-align value
 */
function mapVerticalAlignment(verticalAlign) {
    switch (verticalAlign) {
        case 'TOP':
            return 'top';
        case 'CENTER':
            return 'middle';
        case 'BOTTOM':
            return 'bottom';
        default:
            return null;
    }
}

/**
 * Map Figma LeadingTrim to CSS text-box-trim and text-box-edge
 * @param {string} leadingTrim - Figma LeadingTrim value
 * @returns {Object|null} Object with trim and edge CSS values
 */
function mapLeadingTrimToCSS(leadingTrim) {
    switch (leadingTrim) {
        case 'CAP_HEIGHT':
            return {
                trim: 'trim-both',
                edge: 'cap alphabetic'
            };
        case 'NONE':
        default:
            return null;
    }
}

/**
 * Map Figma textAutoResize to CSS width/height behavior
 * @param {string} textAutoResize - Figma textAutoResize value
 * @returns {Object|null} Object with width and height CSS values
 */
function mapTextAutoResizeToCSS(textAutoResize) {
    switch (textAutoResize) {
        case 'WIDTH_AND_HEIGHT':
            return {
                width: 'fit-content',
                height: 'fit-content'
            };
        case 'AUTO_HEIGHT':
            return {
                width: 'auto', // Keep existing width
                height: 'fit-content'
            };
        case 'FIXED':
        default:
            return null; // No special CSS needed for fixed size
    }
}

module.exports = {
    generateTypographyCSS,
    mapVerticalAlignment,
    mapLeadingTrimToCSS,
    mapTextAutoResizeToCSS
};
