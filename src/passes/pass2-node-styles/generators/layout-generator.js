/**
 * Layout CSS generator for converting layout properties to CSS rules
 */

const { generatePositioningCSS } = require('./positioning-generator');
const { roundCSS } = require('../utils/color-utils');

/**
 * Generate layout CSS rules directly from node properties
 * @param {Object} node - Figma node data
 * @param {Object} parent - Parent node (for context)
 * @param {boolean} isTopLevel - Whether this is a top-level node
 * @param {boolean} isImageFrame - Whether this is an image frame (skip padding/borders)
 * @returns {Array} Array of CSS rule strings
 */
function generateLayoutCSS(node, parent = null, isTopLevel = false, isImageFrame = false) {
    const rules = [];
    
    // Enhanced positioning support (includes layout sizing logic)
    generatePositioningCSS(node, parent, isTopLevel, rules);
    
    // Basic dimensions - apply if node has width/height and layout sizing is not 'FILL'
    if (node.width && typeof node.width === 'number' && node.layoutSizingHorizontal !== 'FILL') {
        rules.push(`width: ${roundCSS(node.width)}px;`);
    }
    if (node.height && typeof node.height === 'number' && node.layoutSizingVertical !== 'FILL') {
        rules.push(`height: ${roundCSS(node.height)}px;`);
    }
    
    // Transform properties (including rotation)
    generateTransformCSS(node, rules);
    
    // Border radius
    if (node.cornerRadius || node.topLeftRadius || node.topRightRadius || node.bottomLeftRadius || node.bottomRightRadius) {
        const borderRadius = generateBorderRadiusCSS(node);
        if (borderRadius) {
            rules.push(`border-radius: ${borderRadius};`);
        }
    }
    
    // Overflow - handle clipContent first (takes precedence)
    if (node.clipsContent) {
        // clipsContent overrides any other overflow setting
        rules.push(`overflow: hidden;`);
    } else if (node.overflow && node.overflow !== 'VISIBLE') {
        // Only apply overflow if clipsContent is not set
        const overflow = mapOverflowToCSS(node.overflow);
        if (overflow) {
            rules.push(`overflow: ${overflow};`);
        }
    }
    
    // Flexbox layout
    if (node.layoutMode === 'HORIZONTAL' || node.layoutMode === 'VERTICAL') {
        rules.push(`display: flex;`);
        rules.push(`flex-direction: ${node.layoutMode === 'HORIZONTAL' ? 'row' : 'column'};`);
        
        if (node.primaryAxisAlignItems) {
            const alignMap = {
                'MIN': 'flex-start',
                'CENTER': 'center',
                'MAX': 'flex-end',
                'SPACE_BETWEEN': 'space-between'
            };
            rules.push(`justify-content: ${alignMap[node.primaryAxisAlignItems] || 'flex-start'};`);
        }
        
        if (node.counterAxisAlignItems) {
            const alignMap = {
                'MIN': 'flex-start',
                'CENTER': 'center',
                'MAX': 'flex-end'
            };
            rules.push(`align-items: ${alignMap[node.counterAxisAlignItems] || 'flex-start'};`);
        }
        
        // Only apply gap if not using space-between (which distributes space automatically)
        if (node.itemSpacing && typeof node.itemSpacing === 'number' && node.primaryAxisAlignItems !== 'SPACE_BETWEEN') {
            rules.push(`gap: ${roundCSS(node.itemSpacing)}px;`);
        }
    }
    
    // Padding - skip for image frames to avoid interfering with image display
    if (!isImageFrame && (node.paddingLeft || node.paddingRight || node.paddingTop || node.paddingBottom)) {
        const paddingTop = typeof node.paddingTop === 'number' ? roundCSS(node.paddingTop) : 0;
        const paddingRight = typeof node.paddingRight === 'number' ? roundCSS(node.paddingRight) : 0;
        const paddingBottom = typeof node.paddingBottom === 'number' ? roundCSS(node.paddingBottom) : 0;
        const paddingLeft = typeof node.paddingLeft === 'number' ? roundCSS(node.paddingLeft) : 0;
        const padding = `${paddingTop}px ${paddingRight}px ${paddingBottom}px ${paddingLeft}px`;
        rules.push(`padding: ${padding};`);
        console.log(`📏 Adding padding to node: ${node.name || node.id} - ${padding}`);
    } else if (isImageFrame) {
        console.log(`🖼️ Skipping padding for image frame: ${node.name || node.id}`);
    }
    
    return rules;
}

/**
 * Generate transform CSS (rotation, scale, translate, etc.)
 * @param {Object} node - Node properties
 * @param {Array} rules - Array to add CSS rules to
 */
function generateTransformCSS(node, rules) {
    const transforms = [];

    // Only apply simple rotation if it exists and is reasonable
    if (node.rotation && typeof node.rotation === 'number' && Math.abs(node.rotation) > 0.1 && Math.abs(node.rotation) < 360) {
        transforms.push(`rotate(${roundCSS(node.rotation)}deg)`);
    }

    // Skip relativeTransform matrix processing as it often contains document-level coordinates
    // and transformations that are not suitable for CSS transforms.
    // Positioning is already handled by the positioning system.

    if (transforms.length > 0) {
        rules.push(`transform: ${transforms.join(' ')};`);
    }
}

/**
 * Generate border radius CSS from node properties
 * @param {Object} node - Node properties
 * @returns {string} CSS border-radius value
 */
function generateBorderRadiusCSS(node) {
    const cornerRadius = typeof node.cornerRadius === 'number' ? roundCSS(node.cornerRadius) : 0;
    const topLeftRadius = typeof node.topLeftRadius === 'number' ? roundCSS(node.topLeftRadius) : 0;
    const topRightRadius = typeof node.topRightRadius === 'number' ? roundCSS(node.topRightRadius) : 0;
    const bottomLeftRadius = typeof node.bottomLeftRadius === 'number' ? roundCSS(node.bottomLeftRadius) : 0;
    const bottomRightRadius = typeof node.bottomRightRadius === 'number' ? roundCSS(node.bottomRightRadius) : 0;
    
    // If we have individual corner radii, use them
    if (topLeftRadius || topRightRadius || bottomLeftRadius || bottomRightRadius) {
        const tl = topLeftRadius;
        const tr = topRightRadius;
        const br = bottomRightRadius;
        const bl = bottomLeftRadius;
        
        // If all corners are the same, use shorthand
        if (tl === tr && tr === br && br === bl) {
            return tl > 0 ? `${tl}px` : null;
        }
        
        // Use full syntax: top-left top-right bottom-right bottom-left
        return `${tl}px ${tr}px ${br}px ${bl}px`;
    }
    
    // Use general corner radius
    if (cornerRadius && cornerRadius > 0) {
        return `${cornerRadius}px`;
    }
    
    return null;
}

/**
 * Map Figma overflow to CSS overflow
 * @param {string} overflow - Figma overflow value
 * @returns {string|null} CSS overflow value
 */
function mapOverflowToCSS(overflow) {
    switch (overflow) {
        case 'HIDDEN':
            return 'hidden';
        case 'SCROLL':
            return 'auto';
        case 'VISIBLE':
        default:
            return 'visible';
    }
}

module.exports = {
    generateLayoutCSS,
    generateTransformCSS,
    generateBorderRadiusCSS,
    mapOverflowToCSS
};
