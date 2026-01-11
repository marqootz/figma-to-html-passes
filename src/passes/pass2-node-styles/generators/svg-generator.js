/**
 * SVG generator for converting vector nodes to SVG data
 */

const { roundCSS } = require('../utils/color-utils');

/**
 * Process vector node and generate SVG data
 * @param {Object} node - Vector node
 * @returns {Object|null} SVG data
 */
function processVectorNode(node) {
    const svgData = generateSVGFromNode(node);
    if (svgData) {
        // Return SVG data for later use
        return svgData;
    }
    return null;
}

/**
 * Generate SVG from vector node
 * @param {Object} node - Vector node
 * @returns {Object|null} SVG data
 */
function generateSVGFromNode(node) {
    try {
        const svgData = {
            id: node.id,
            name: node.name,
            type: node.type,
            width: node.width,
            height: node.height,
            x: node.x || 0,
            y: node.y || 0,
            rotation: node.rotation || 0,
            fills: node.fills || [],
            strokes: node.strokes || [],
            effects: node.effects || [],
            path: null,
            viewBox: `0 0 ${roundCSS(node.width)} ${roundCSS(node.height)}`
        };

        // Generate path data based on node type
        switch (node.type) {
            case 'RECTANGLE':
                svgData.path = generateRectanglePath(node);
                break;
            case 'ELLIPSE':
                svgData.path = generateEllipsePath(node);
                break;
            case 'POLYGON':
                svgData.path = generatePolygonPath(node);
                break;
            case 'STAR':
                svgData.path = generateStarPath(node);
                break;
            case 'VECTOR':
                svgData.path = extractVectorPath(node);
                break;
            default:
                return null;
        }

        return svgData;
    } catch (error) {
        console.error(`[SVG] Error generating SVG for ${node.name}:`, error);
        return null;
    }
}

/**
 * Generate rectangle path
 * @param {Object} node - Rectangle node
 * @returns {string} SVG path
 */
function generateRectanglePath(node) {
    const width = typeof node.width === 'number' ? roundCSS(node.width) : 0;
    const height = typeof node.height === 'number' ? roundCSS(node.height) : 0;
    const cornerRadius = typeof node.cornerRadius === 'number' ? roundCSS(node.cornerRadius) : 0;
    
    if (cornerRadius > 0) {
        // Rounded rectangle
        const r = Math.min(cornerRadius, width / 2, height / 2);
        return `M ${r} 0 L ${width - r} 0 Q ${width} 0 ${width} ${r} L ${width} ${height - r} Q ${width} ${height} ${width - r} ${height} L ${r} ${height} Q 0 ${height} 0 ${height - r} L 0 ${r} Q 0 0 ${r} 0 Z`;
    } else {
        // Regular rectangle
        return `M 0 0 L ${width} 0 L ${width} ${height} L 0 ${height} Z`;
    }
}

/**
 * Generate ellipse path
 * @param {Object} node - Ellipse node
 * @returns {string} SVG path
 */
function generateEllipsePath(node) {
    const width = typeof node.width === 'number' ? roundCSS(node.width) : 0;
    const height = typeof node.height === 'number' ? roundCSS(node.height) : 0;
    const rx = width / 2;
    const ry = height / 2;
    const cx = rx;
    const cy = ry;
    
    return `M ${cx - rx} ${cy} A ${rx} ${ry} 0 0 1 ${cx + rx} ${cy} A ${rx} ${ry} 0 0 1 ${cx - rx} ${cy} Z`;
}

/**
 * Generate polygon path (simplified)
 * @param {Object} node - Polygon node
 * @returns {string} SVG path
 */
function generatePolygonPath(node) {
    const width = typeof node.width === 'number' ? roundCSS(node.width) : 0;
    const height = typeof node.height === 'number' ? roundCSS(node.height) : 0;
    // Simple triangle for now (can be enhanced later)
    const centerX = width / 2;
    const centerY = height / 2;
    return `M ${centerX} 0 L ${width} ${height} L 0 ${height} Z`;
}

/**
 * Generate star path (simplified)
 * @param {Object} node - Star node
 * @returns {string} SVG path
 */
function generateStarPath(node) {
    const width = typeof node.width === 'number' ? roundCSS(node.width) : 0;
    const height = typeof node.height === 'number' ? roundCSS(node.height) : 0;
    const centerX = width / 2;
    const centerY = height / 2;
    const outerRadius = Math.min(width, height) / 2;
    const innerRadius = outerRadius * 0.4;
    
    // Simple 5-point star
    const points = [];
    for (let i = 0; i < 10; i++) {
        const angle = (i * Math.PI) / 5;
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const x = centerX + radius * Math.cos(angle - Math.PI / 2);
        const y = centerY + radius * Math.sin(angle - Math.PI / 2);
        points.push(`${i === 0 ? 'M' : 'L'} ${x} ${y}`);
    }
    points.push('Z');
    
    return points.join(' ');
}

/**
 * Extract vector path from complex vector node
 * @param {Object} node - Vector node
 * @returns {string} SVG path
 */
function extractVectorPath(node) {
    // Try to extract from various Figma vector properties
    if (node.fillGeometry && node.fillGeometry.length > 0) {
        return node.fillGeometry[0].data || '';
    }
    
    if (node.strokeGeometry && node.strokeGeometry.length > 0) {
        return node.strokeGeometry[0].data || '';
    }
    
    if (node.vectorPaths && node.vectorPaths.length > 0) {
        return node.vectorPaths[0].data || '';
    }
    
    if (node.vectorNetwork && node.vectorNetwork.segments) {
        // Convert vector network to path (simplified)
        return convertVectorNetworkToPath(node.vectorNetwork);
    }
    
    // Fallback to simple rectangle
    return generateRectanglePath(node);
}

/**
 * Convert vector network to SVG path (simplified)
 * @param {Object} vectorNetwork - Figma vector network
 * @returns {string} SVG path
 */
function convertVectorNetworkToPath(vectorNetwork) {
    if (!vectorNetwork.segments || vectorNetwork.segments.length === 0) {
        return '';
    }
    
    // This is a simplified implementation
    // A full implementation would need to handle curves, bezier points, etc.
    const pathCommands = [];
    
    vectorNetwork.segments.forEach((segment, index) => {
        if (index === 0) {
            pathCommands.push(`M ${segment.start.x} ${segment.start.y}`);
        }
        pathCommands.push(`L ${segment.end.x} ${segment.end.y}`);
    });
    
    return pathCommands.join(' ');
}

module.exports = {
    processVectorNode,
    generateSVGFromNode,
    generateRectanglePath,
    generateEllipsePath,
    generatePolygonPath,
    generateStarPath,
    extractVectorPath,
    convertVectorNetworkToPath
};
