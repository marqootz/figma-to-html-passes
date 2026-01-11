/**
 * Typography extractor for extracting text styles from Figma nodes
 */

/**
 * Extract typography styles from a text node
 * @param {Object} node - Figma node
 * @returns {Object} Typography styles
 */
function extractTypography(node) {
    if (node.type !== 'TEXT') {
        return null;
    }
    
    // Extract typography properties directly from the node (Figma API structure)
    const typography = {
        // Font properties - directly on node
        fontFamily: node.fontName ? node.fontName.family : null,
        fontSize: node.fontSize,
        fontWeight: node.fontWeight,
        fontStyle: node.fontName && node.fontName.style ? (node.fontName.style.toLowerCase().includes('italic') ? 'italic' : 'normal') : 'normal',
        
        // Text decoration - directly on node
        textDecoration: mapTextDecoration(node.textDecoration),
        textDecorationStyle: mapTextDecorationStyle(node.textDecorationStyle),
        textDecorationColor: node.textDecorationColor || 'currentColor',
        
        // Text alignment - directly on node
        textAlign: node.textAlignHorizontal || 'left',
        textAlignVertical: node.textAlignVertical || 'top',
        
        // Spacing and layout - directly on node
        lineHeight: mapLineHeightToCSS(node.lineHeight),
        letterSpacing: node.letterSpacing || 0,
        paragraphSpacing: node.paragraphSpacing || 0,
        paragraphIndent: node.paragraphIndent || 0,
        
        // Leading trim - directly on node
        leadingTrim: node.leadingTrim || 'NONE',
        
        // Text auto resize - directly on node
        textAutoResize: node.textAutoResize || 'FIXED',
        
        // Text transformation - directly on node
        textCase: node.textCase || 'none',
        textTransform: mapTextCaseToCSS(node.textCase),
        
        // Font features - directly on node
        fontVariant: 'normal', // Not directly available in Figma API
        fontStretch: 'normal', // Not directly available in Figma API
        
        // Text effects
        textShadow: extractTextShadow(node),
        textStroke: extractTextStroke(node),
        
        // Advanced properties
        wordSpacing: 'normal', // Not directly available in Figma API
        textIndent: node.paragraphIndent || 0,
        whiteSpace: mapWhiteSpaceToCSS(node),
        textOverflow: mapTextOverflowToCSS(node),
        
        // Opacity and blending
        textOpacity: node.opacity !== undefined ? node.opacity : 1,
        mixBlendMode: node.blendMode || 'PASS_THROUGH'
    };
    
    // Check if we have any meaningful typography data
    const hasTypography = typography.fontSize || typography.fontFamily || typography.fontWeight || 
                         typography.textDecoration !== 'none' || typography.textCase !== 'none';
    
    if (!hasTypography) {
        return null;
    }
    
    return typography;
}

/**
 * Map Figma text decoration to CSS text-decoration
 * @param {string} textDecoration - Figma text decoration value
 * @returns {string} CSS text-decoration value
 */
function mapTextDecoration(textDecoration) {
    switch (textDecoration) {
        case 'UNDERLINE':
            return 'underline';
        case 'STRIKETHROUGH':
            return 'line-through';
        case 'NONE':
        default:
            return 'none';
    }
}

/**
 * Map Figma text decoration style to CSS text-decoration-style
 * @param {string} textDecorationStyle - Figma text decoration style value
 * @returns {string} CSS text-decoration-style value
 */
function mapTextDecorationStyle(textDecorationStyle) {
    switch (textDecorationStyle) {
        case 'SOLID':
            return 'solid';
        case 'DASHED':
            return 'dashed';
        case 'DOTTED':
            return 'dotted';
        case 'WAVY':
            return 'wavy';
        default:
            return 'solid';
    }
}

/**
 * Map Figma text case to CSS text-transform
 * @param {string} textCase - Figma text case value
 * @returns {string} CSS text-transform value
 */
function mapTextCaseToCSS(textCase) {
    switch (textCase) {
        case 'UPPER':
            return 'uppercase';
        case 'LOWER':
            return 'lowercase';
        case 'TITLE':
            return 'capitalize';
        case 'SMALL_CAPS':
            return 'uppercase';
        case 'SMALL_CAPS_FORCED':
            return 'uppercase';
        case 'ORIGINAL':
        case 'NONE':
        default:
            return 'none';
    }
}

/**
 * Extract text shadow from node effects
 * @param {Object} node - Figma node
 * @returns {string|null} CSS text-shadow value
 */
function extractTextShadow(node) {
    if (!node.effects || !Array.isArray(node.effects)) {
        return null;
    }

    const textShadow = node.effects.find(effect => 
        effect.type === 'DROP_SHADOW' && effect.visible
    );

    if (!textShadow) return null;

    return `${textShadow.offset.x}px ${textShadow.offset.y}px ${textShadow.radius}px ${textShadow.color}`;
}

/**
 * Extract text stroke from node strokes
 * @param {Object} node - Figma node
 * @returns {string|null} CSS -webkit-text-stroke value
 */
function extractTextStroke(node) {
    if (!node.strokes || !Array.isArray(node.strokes) || node.strokes.length === 0) {
        return null;
    }

    const stroke = node.strokes.find(s => s.visible);
    if (!stroke || stroke.type !== 'SOLID') return null;

    return `${stroke.weight}px ${stroke.color}`;
}

/**
 * Map Figma lineHeight to CSS line-height value
 * @param {Object|string|number} lineHeight - Figma lineHeight value (object with unit/value or primitive)
 * @returns {string|number} CSS line-height value
 */
function mapLineHeightToCSS(lineHeight) {
    // Handle object format: {unit: 'AUTO'} or {unit: 'PIXELS', value: 24} or {unit: 'PERCENT', value: 120}
    if (typeof lineHeight === 'object' && lineHeight !== null) {
        if (lineHeight.unit === 'AUTO') {
            return 'normal';
        }
        // For PIXELS unit, return the value as pixels
        if (lineHeight.unit === 'PIXELS' && lineHeight.value !== undefined) {
            return lineHeight.value;
        }
        // For PERCENT unit, return the value as percentage
        if (lineHeight.unit === 'PERCENT' && lineHeight.value !== undefined) {
            return lineHeight.value + '%';
        }
        // For other units, return the value if available
        if (lineHeight.value !== undefined) {
            return lineHeight.value;
        }
        return 'normal';
    }
    
    // Handle primitive format (legacy)
    if (lineHeight === 'AUTO') {
        return 'normal';
    }
    return lineHeight || 'normal';
}

/**
 * Map Figma text properties to CSS white-space value
 * @param {Object} node - Figma node
 * @returns {string} CSS white-space value
 */
function mapWhiteSpaceToCSS(node) {
    // If textAutoResize is WIDTH_AND_HEIGHT, use nowrap to prevent wrapping
    if (node.textAutoResize === 'WIDTH_AND_HEIGHT') {
        return 'nowrap';
    }
    
    // If textAutoResize is AUTO_HEIGHT, allow wrapping
    if (node.textAutoResize === 'AUTO_HEIGHT') {
        return 'normal';
    }
    
    // Default behavior - allow wrapping
    return 'normal';
}

/**
 * Map Figma text properties to CSS text-overflow value
 * @param {Object} node - Figma node
 * @returns {string} CSS text-overflow value
 */
function mapTextOverflowToCSS(node) {
    // If textAutoResize is WIDTH_AND_HEIGHT, use ellipsis for overflow
    if (node.textAutoResize === 'WIDTH_AND_HEIGHT') {
        return 'ellipsis';
    }
    
    // Check for text truncation setting
    if (node.textTruncation === 'ENDING') {
        return 'ellipsis';
    }
    
    // Default to clip
    return 'clip';
}

module.exports = {
    extractTypography,
    mapTextDecoration,
    mapTextDecorationStyle,
    mapTextCaseToCSS,
    extractTextShadow,
    extractTextStroke,
    mapLineHeightToCSS,
    mapWhiteSpaceToCSS,
    mapTextOverflowToCSS
};
