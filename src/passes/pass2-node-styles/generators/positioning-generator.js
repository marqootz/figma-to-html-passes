/**
 * Positioning CSS generator for converting layout positioning to CSS
 */

const { roundCSS } = require('../utils/color-utils');
const { generatePositionSizeTransition } = require('../utils/transition-utils');

/**
 * Generate positioning CSS rules directly from node properties
 * @param {Object} node - Node properties
 * @param {Object} parent - Parent node (for context)
 * @param {boolean} isTopLevel - Whether this is a top-level node
 * @param {Array} rules - Array to add CSS rules to
 */
function generatePositioningCSS(node, parent = null, isTopLevel = false, rules) {
    // Special case: Component variants should be positioned absolutely on top of each other
    // for variant switching functionality
    if (node.type === 'COMPONENT' && parent && parent.type === 'COMPONENT_SET') {
        rules.push('position: absolute;');
        rules.push('top: 0;');
        rules.push('left: 0;');
        
        // Handle transitions for smart animate (before early return)
        if (node.transition) {
            const transitionCSS = generatePositionSizeTransition(node.transition);
            if (transitionCSS) {
                rules.push(transitionCSS);
            }
        }
        
        return; // Skip the rest of the positioning logic for component variants
    }
    
    // Calculate parent-related properties
    const parentLayoutMode = parent ? parent.layoutMode : null;
    const parentX = parent ? parent.x : 0;
    const parentY = parent ? parent.y : 0;
    
    // Determine positioning strategy based on node properties and parent context
    const hasAbsolutePositioning = node.x !== undefined && node.y !== undefined;
    const hasLayoutPositioning = node.layoutPositioning;
    
    // Priority 1: Check if node has explicit layout positioning (ignore auto layout)
    if (hasLayoutPositioning && node.layoutPositioning !== 'AUTO') {
        const positioning = mapLayoutPositioningToCSS(node.layoutPositioning);
        if (positioning) {
            rules.push(`position: ${positioning};`);
            
            // If absolute positioning, add x/y coordinates (relative to parent or figma-container)
            if (positioning === 'absolute' && hasAbsolutePositioning) {
                if (node.x !== undefined && typeof node.x === 'number') {
                    // Use node.x directly - it's already relative to parent in Figma
                    const relativeX = isTopLevel ? 0 : node.x;
                    rules.push(`left: ${roundCSS(relativeX)}px;`);
                }
                if (node.y !== undefined && typeof node.y === 'number') {
                    // Use node.y directly - it's already relative to parent in Figma
                    const relativeY = isTopLevel ? 0 : node.y;
                    rules.push(`top: ${roundCSS(relativeY)}px;`);
                }
            }
        }
    }
    // Priority 2: Check parent context for positioning decisions
    else if (parentLayoutMode) {
        // Parent has auto-layout - child should be positioned relative to parent's flow
        if (parentLayoutMode !== 'NONE') {
            // Parent is auto-layout: child participates in flexbox flow
            rules.push('position: relative;');
            // x/y coordinates are ignored in auto-layout (handled by flexbox)
        } else {
            // Parent is manual layout: child can be absolutely positioned
            if (hasAbsolutePositioning) {
                rules.push('position: absolute;');
                if (node.x !== undefined && typeof node.x === 'number') {
                    const relativeX = isTopLevel ? 0 : node.x;
                    rules.push(`left: ${roundCSS(relativeX)}px;`);
                }
                if (node.y !== undefined && typeof node.y === 'number') {
                    const relativeY = isTopLevel ? 0 : node.y;
                    rules.push(`top: ${roundCSS(relativeY)}px;`);
                }
            }
        }
    }
    // Priority 3: Check node's own layout mode (regardless of parent)
    else if (node.layoutMode === 'NONE') {
        // Node has no auto-layout: use absolute positioning
        rules.push('position: absolute;');
        if (node.x !== undefined && typeof node.x === 'number') {
            const relativeX = isTopLevel ? 0 : (node.x - parentX);
            rules.push(`left: ${roundCSS(relativeX)}px;`);
        }
        if (node.y !== undefined && typeof node.y === 'number') {
            const relativeY = isTopLevel ? 0 : (node.y - parentY);
            rules.push(`top: ${roundCSS(relativeY)}px;`);
        }
    }
    // Priority 4: Handle parent with no layout styles (parentLayoutMode is null/undefined)
    else if (parentLayoutMode === null || parentLayoutMode === undefined) {
        // Parent has no layout styles - child needs absolute positioning
        rules.push('position: absolute;');
        if (node.x !== undefined && typeof node.x === 'number') {
            const relativeX = isTopLevel ? 0 : (node.x - parentX);
            rules.push(`left: ${roundCSS(relativeX)}px;`);
        }
        if (node.y !== undefined && typeof node.y === 'number') {
            const relativeY = isTopLevel ? 0 : (node.y - parentY);
            rules.push(`top: ${roundCSS(relativeY)}px;`);
        }
    }
    // Priority 5: Default to relative positioning for auto-layout nodes
    else if (node.layoutMode !== 'NONE') {
        // Node is in auto-layout, use relative positioning
        rules.push('position: relative;');
    }
    
    // Constraints are ignored - using x/y coordinates directly
    
    // Handle layout sizing
    generateLayoutSizingCSS(node, rules);
    
    // Handle z-index
    if (node.zIndex !== undefined && node.zIndex !== null) {
        rules.push(`z-index: ${node.zIndex};`);
    }
    
    // Handle transitions for smart animate
    if (node.transition) {
        const transitionCSS = generatePositionSizeTransition(node.transition);
        if (transitionCSS) {
            rules.push(transitionCSS);
        }
    }
}

/**
 * Map Figma layout positioning to CSS position
 * @param {string} layoutPositioning - Figma layout positioning value
 * @returns {string|null} CSS position value
 */
function mapLayoutPositioningToCSS(layoutPositioning) {
    switch (layoutPositioning) {
        case 'ABSOLUTE':
            return 'absolute';
        case 'RELATIVE':
            return 'relative';
        case 'FIXED':
            return 'fixed';
        case 'STICKY':
            return 'sticky';
        default:
            return null;
    }
}

// Constraints handling removed - using x/y coordinates directly

/**
 * Generate layout sizing CSS from node properties
 * @param {Object} node - Node properties
 * @param {Array} rules - Array to add CSS rules to
 */
function generateLayoutSizingCSS(node, rules) {
    // Min/Max dimensions
    if (node.minWidth) {
        rules.push(`min-width: ${node.minWidth}px;`);
    }
    if (node.maxWidth) {
        rules.push(`max-width: ${node.maxWidth}px;`);
    }
    if (node.minHeight) {
        rules.push(`min-height: ${node.minHeight}px;`);
    }
    if (node.maxHeight) {
        rules.push(`max-height: ${node.maxHeight}px;`);
    }

    // Layout sizing horizontal
    if (node.layoutSizingHorizontal) {
        switch (node.layoutSizingHorizontal) {
            case 'FILL':
                rules.push('width: 100%;');
                break;
            case 'HUG':
                rules.push('width: fit-content;');
                break;
            // FIXED is handled by basic dimensions in generateLayoutCSS
        }
    }

    // Layout sizing vertical
    if (node.layoutSizingVertical) {
        switch (node.layoutSizingVertical) {
            case 'FILL':
                rules.push('height: 100%;');
                break;
            case 'HUG':
                rules.push('height: fit-content;');
                break;
            // FIXED is handled by basic dimensions in generateLayoutCSS
        }
    }
}

module.exports = {
    generatePositioningCSS,
    mapLayoutPositioningToCSS,
    generateLayoutSizingCSS
};
