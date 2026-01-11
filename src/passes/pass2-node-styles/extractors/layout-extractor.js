/**
 * Layout extractor for extracting layout and positioning properties from Figma nodes
 */

/**
 * Extract layout properties from a node
 * @param {Object} node - Figma node
 * @param {Object} parent - Parent node (for context)
 * @param {boolean} isTopLevel - Whether this is a top-level node
 * @returns {Object} Layout styles
 */
function extractLayout(node, parent = null, isTopLevel = false) {
    return {
        nodeId: node.id,
        width: node.width,
        height: node.height,
        x: node.x,
        y: node.y,
        rotation: node.rotation || 0,
        layoutMode: node.layoutMode || 'NONE',
        primaryAxisAlignItems: node.primaryAxisAlignItems || 'MIN',
        counterAxisAlignItems: node.counterAxisAlignItems || 'MIN',
        paddingLeft: node.paddingLeft || 0,
        paddingRight: node.paddingRight || 0,
        paddingTop: node.paddingTop || 0,
        paddingBottom: node.paddingBottom || 0,
        itemSpacing: node.itemSpacing || 0,
        layoutGrow: node.layoutGrow || 0,
        layoutAlign: node.layoutAlign || 'INHERIT',
        
        // Enhanced positioning properties
        relativeTransform: node.relativeTransform,
        absoluteTransform: node.absoluteTransform,
        absoluteBoundingBox: node.absoluteBoundingBox,
        absoluteRenderBounds: node.absoluteRenderBounds,
        constraints: node.constraints,
        layoutPositioning: node.layoutPositioning,
        zIndex: node.zIndex,
        
        // Border radius
        cornerRadius: node.cornerRadius || 0,
        topLeftRadius: node.topLeftRadius || node.cornerRadius || 0,
        topRightRadius: node.topRightRadius || node.cornerRadius || 0,
        bottomLeftRadius: node.bottomLeftRadius || node.cornerRadius || 0,
        bottomRightRadius: node.bottomRightRadius || node.cornerRadius || 0,
        
        // Overflow
        overflow: node.overflow || 'VISIBLE',
        clipsContent: node.clipsContent || false, // Fixed: use clipsContent (with 's')
        
        // Additional layout properties
        layoutSizingHorizontal: node.layoutSizingHorizontal || 'FIXED',
        layoutSizingVertical: node.layoutSizingVertical || 'FIXED',
        minWidth: node.minWidth || null,
        maxWidth: node.maxWidth || null,
        minHeight: node.minHeight || null,
        maxHeight: node.maxHeight || null,
        
        // Parent context for positioning decisions
        parentLayoutMode: parent ? parent.layoutMode : null,
        parentLayoutPositioning: parent ? parent.layoutPositioning : null,
        parentX: parent ? parent.x : (isTopLevel ? 0 : 0), // Top-level nodes use figma-container (0,0) as reference
        parentY: parent ? parent.y : (isTopLevel ? 0 : 0), // Top-level nodes use figma-container (0,0) as reference
        isTopLevel: isTopLevel
    };
}

module.exports = {
    extractLayout
};
