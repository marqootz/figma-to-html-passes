/**
 * Transition utilities for converting Figma transitions to CSS
 */

/**
 * Map Figma easing to CSS easing
 * @param {Object|string} figmaEasing - Figma easing object or string
 * @returns {string} CSS easing function
 */
function mapEasingToCSS(figmaEasing) {
    // Handle both object format {type: "EASE_OUT"} and string format
    const easingType = typeof figmaEasing === 'object' && figmaEasing.type ? 
                      figmaEasing.type : figmaEasing;
    
    switch (easingType) {
        case 'EASE_IN':
            return 'ease-in';
        case 'EASE_OUT':
            return 'ease-out';
        case 'EASE_IN_OUT':
        case 'EASE_IN_AND_OUT':
            return 'ease-in-out';
        case 'LINEAR':
            return 'linear';
        case 'EASE_IN_AND_OUT_BACK':
            return 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'; // Back easing approximation
        case 'EASE_IN_BACK':
            return 'cubic-bezier(0.6, -0.28, 0.735, 0.045)'; // Back easing approximation
        case 'EASE_OUT_BACK':
            return 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'; // Back easing approximation
        default:
            return 'ease-in-out'; // Default fallback
    }
}

/**
 * Generate CSS transition property for position and size changes
 * @param {Object} transition - Figma transition object
 * @returns {string} CSS transition property
 */
function generatePositionSizeTransition(transition) {
    if (!transition) return null;
    
    // Convert duration from seconds to milliseconds (Figma uses seconds)
    const durationSeconds = transition.duration || 0.3; // Default 0.3 seconds
    const durationMs = Math.round(durationSeconds * 1000); // Convert to milliseconds
    const easing = mapEasingToCSS(transition.easing);
    
    // Focus on position and size properties for now
    const properties = [
        'transform',
        'width',
        'height',
        'left',
        'top',
        'right',
        'bottom'
    ].join(', ');
    
    return `transition: ${properties} ${durationMs}ms ${easing};`;
}

/**
 * Generate CSS transform for position changes
 * @param {Object} node - Current node properties
 * @param {Object} targetNode - Target node properties
 * @returns {string} CSS transform property
 */
function generatePositionTransform(node, targetNode) {
    if (!node || !targetNode) return null;
    
    const deltaX = (targetNode.x || 0) - (node.x || 0);
    const deltaY = (targetNode.y || 0) - (node.y || 0);
    
    if (deltaX === 0 && deltaY === 0) return null;
    
    return `transform: translate(${deltaX}px, ${deltaY}px);`;
}

/**
 * Generate CSS for size changes
 * @param {Object} node - Current node properties
 * @param {Object} targetNode - Target node properties
 * @returns {Array} Array of CSS rules for size changes
 */
function generateSizeChanges(node, targetNode) {
    if (!node || !targetNode) return [];
    
    const rules = [];
    
    // Width change
    if (targetNode.width !== node.width) {
        rules.push(`width: ${targetNode.width}px;`);
    }
    
    // Height change
    if (targetNode.height !== node.height) {
        rules.push(`height: ${targetNode.height}px;`);
    }
    
    return rules;
}

/**
 * Check if a transition is a smart animate transition
 * @param {Object} transition - Figma transition object
 * @returns {boolean} True if it's a smart animate transition
 */
function isSmartAnimate(transition) {
    return transition && transition.type === 'SMART_ANIMATE';
}

module.exports = {
    mapEasingToCSS,
    generatePositionSizeTransition,
    generatePositionTransform,
    generateSizeChanges,
    isSmartAnimate
};
