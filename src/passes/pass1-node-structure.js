/**
 * Pass 1: Node Structure Recreation
 * 
 * This pass focuses solely on recreating the Figma node structure in HTML.
 * It maintains the exact hierarchy and relationships from Figma with full
 * nested instance topology support.
 */

class NodeStructurePass {
    constructor() {
        this.processedNodes = new Set();
    }

    /**
     * Check if a frame is a video frame based on its name
     * @param {Object} node - Figma node
     * @returns {boolean} True if the node is a video frame
     */
    isVideoFrame(node) {
        return typeof node.name === 'string' && node.name.startsWith('[VIDEO]');
    }

    /**
     * Check if a frame is a Lottie frame based on its name
     * @param {Object} node - Figma node
     * @returns {boolean} True if the node is a Lottie frame
     */
    isLottieFrame(node) {
        return typeof node.name === 'string' && node.name.startsWith('[LOTTIE]');
    }

    /**
     * Check if a frame is an image frame based on its name
     * @param {Object} node - Figma node
     * @returns {boolean} True if the node is an image frame
     */
    isImageFrame(node) {
        return typeof node.name === 'string' && node.name.startsWith('[IMG]');
    }

    /**
     * Extract video filename and source path from frame name
     * @param {Object} node - Figma node
     * @returns {Object|null} Object with filename and sourcePath, or null if not a video frame
     */
    extractVideoInfo(node) {
        if (!this.isVideoFrame(node)) return null;
        
        // Extract the path after [VIDEO] prefix
        const match = node.name.match(/^\[VIDEO\]\s*(.+)$/);
        const fullPath = match && match[1] ? match[1].trim() : null;
        
        if (!fullPath || fullPath.length === 0) return null;
        
        // Extract filename from the full path (handle both Unix and Windows paths)
        const filename = fullPath.split(/[\/\\]/).pop();
        
        return {
            filename: filename,
            sourcePath: fullPath,
            originalPath: fullPath
        };
    }

    /**
     * Extract Lottie filename and source path from frame name
     * @param {Object} node - Figma node
     * @returns {Object|null} Object with filename and sourcePath, or null if not a Lottie frame
     */
    extractLottieInfo(node) {
        if (!this.isLottieFrame(node)) return null;
        
        // Extract the path after [LOTTIE] prefix
        const match = node.name.match(/^\[LOTTIE\]\s*(.+)$/);
        const fullPath = match && match[1] ? match[1].trim() : null;
        
        if (!fullPath || fullPath.length === 0) return null;
        
        // Extract filename from the full path (handle both Unix and Windows paths)
        const filename = fullPath.split(/[\/\\]/).pop();
        
        return {
            filename: filename,
            sourcePath: fullPath,
            originalPath: fullPath
        };
    }

    /**
     * Extract video filename from frame name (backward compatibility)
     * @param {Object} node - Figma node
     * @returns {string|null} Video filename or null if not a video frame
     */
    extractVideoFilename(node) {
        const videoInfo = this.extractVideoInfo(node);
        return videoInfo ? videoInfo.filename : null;
    }

    /**
     * Extract image filename and source path from frame name
     * @param {Object} node - Figma node
     * @returns {Object|null} Object with filename and sourcePath, or null if not an image frame
     */
    extractImageInfo(node) {
        if (!this.isImageFrame(node)) return null;
        
        // Extract the full path from the frame name: [IMG] /path/to/image.jpg
        const match = node.name.match(/^\[IMG\]\s*(.+)$/);
        const fullPath = match && match[1] ? match[1].trim() : null;
        
        if (!fullPath || fullPath.length === 0) return null;
        
        // Extract filename from the full path (handle both Unix and Windows paths)
        const filename = fullPath.split(/[\/\\]/).pop();
        
        return {
            filename: filename,
            sourcePath: fullPath,
            originalPath: fullPath
        };
    }

    /**
     * Extract image filename from frame name (backward compatibility)
     * @param {Object} node - Figma node
     * @returns {string|null} Image filename or null if not an image frame
     */
    extractImageFilename(node) {
        const imageInfo = this.extractImageInfo(node);
        return imageInfo ? imageInfo.filename : null;
    }

    /**
     * Process nodes and recreate their structure in HTML
     * @param {Array} nodes - Array of Figma nodes
     * @returns {Object} Result with HTML structure
     */
    async process(nodes) {
        
        this.processedNodes.clear();
        
        const result = {
            html: '',
            metadata: {
                totalNodes: 0,
                nodeTypes: {},
                hierarchy: []
            }
        };

        // Process each root node
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            const nodeHTML = this.processNode(node, 0, null);
            if (nodeHTML) {
                result.html += nodeHTML;
                this.updateMetadata(result.metadata, node);
            }
        }

        return result;
    }

    /**
     * Process a single node and its children with nested instance support
     * @param {Object} node - Figma node
     * @param {number} depth - Current depth level
     * @returns {string} HTML for this node
     */
    processNode(node, depth = 0, parent = null) {
        if (!node || this.processedNodes.has(node.id)) {
            return '';
        }

        this.processedNodes.add(node.id);
        
        const indent = '  '.repeat(depth);
        const tag = this.getHTMLTag(node.type);
        const className = this.sanitizeClassName(node.name, node.type);
        
        let html = `${indent}<${tag} class="${className}" data-figma-id="${node.id}" data-figma-type="${node.type}"`;
        
        // Add variant switching attributes
        if (node.type === 'COMPONENT_SET') {
            html += ` data-component-set="${node.id}"`;
        } else if (node.type === 'COMPONENT') {
            html += ` data-variant="${node.id}"`;
            // Add parent component set reference
            if (parent && parent.type === 'COMPONENT_SET') {
                html += ` data-parent-component-set="${parent.id}"`;
            }
        }
        
        // Add variant trigger attributes for interactive elements
        const variantTrigger = this.getVariantTrigger(node, parent);
        if (variantTrigger) {
            html += ' data-variant-trigger="true" data-variant-target="' + variantTrigger.targetVariantId + '"';
            html += ' data-trigger-type="' + variantTrigger.triggerType + '"';
            if (variantTrigger.timeoutDelay) {
                html += ' data-timeout-delay="' + variantTrigger.timeoutDelay + '"';
            }
            if (variantTrigger.keyCode !== null) {
                html += ' data-key-code="' + variantTrigger.keyCode + '"';
            }
            if (variantTrigger.gamepadButton !== null) {
                html += ' data-gamepad-button="' + variantTrigger.gamepadButton + '"';
            }
            if (variantTrigger.transition) {
                html += ' data-transition="' + JSON.stringify(variantTrigger.transition).replace(/"/g, '&quot;') + '"';
            }
            
            // Add additional reactions as data attributes
            if (variantTrigger.allReactions && variantTrigger.allReactions.length > 1) {
                html += ' data-all-reactions="' + JSON.stringify(variantTrigger.allReactions.map(r => ({
                    targetId: r.action.destinationId,
                    keyCode: r.trigger.keyCodes ? r.trigger.keyCodes[0] : null,
                    triggerType: r.trigger.type
                }))).replace(/"/g, '&quot;') + '"';
            }
        } else {
        }
        
        // Add video-specific attributes for video frames
        if (this.isVideoFrame(node)) {
            html += ' data-video-frame="true"';
            const videoInfo = this.extractVideoInfo(node);
            if (videoInfo) {
                html += ' data-video-filename="' + videoInfo.filename + '"';
                html += ' data-video-source="' + videoInfo.sourcePath + '"';
            }
        }
        
        // Add Lottie-specific attributes for Lottie frames
        if (this.isLottieFrame(node)) {
            html += ' data-lottie-frame="true"';
            const lottieInfo = this.extractLottieInfo(node);
            if (lottieInfo) {
                html += ' data-lottie-filename="' + lottieInfo.filename + '"';
                html += ' data-lottie-source="' + lottieInfo.sourcePath + '"';
            }
        }
        
        // Add image-specific attributes for image frames
        if (this.isImageFrame(node)) {
            html += ' data-image-frame="true"';
            const imageInfo = this.extractImageInfo(node);
            if (imageInfo) {
                html += ' data-image-filename="' + imageInfo.filename + '"';
                html += ' data-image-source="' + imageInfo.sourcePath + '"';
            }
        }
        
        // Add SVG-specific attributes for vector nodes
        if (this.isVectorNode(node.type)) {
            html += ' width="' + String(node.width || 0) + '" height="' + String(node.height || 0) + '" viewBox="0 0 ' + String(node.width || 0) + ' ' + String(node.height || 0) + '" fill="none" xmlns="http://www.w3.org/2000/svg"';
        }
        
        html += '>';
        
        // Add text content for text nodes
        if (node.type === 'TEXT' && node.characters) {
            html += this.escapeHTML(node.characters);
        }
        
        // Add SVG path content for vector nodes
        if (this.isVectorNode(node.type)) {
            
            const svgPath = this.generateSVGPath(node);
            if (svgPath) {
                html += svgPath;
            } else {
            }
        }
        
        // Add video content for video frames
        if (this.isVideoFrame(node)) {
            const videoContent = this.generateVideoContent(node);
            if (videoContent) {
                html += videoContent;
            }
        }
        
        // Add Lottie content for Lottie frames
        if (this.isLottieFrame(node)) {
            const lottieContent = this.generateLottieContent(node);
            if (lottieContent) {
                html += lottieContent;
            }
        }
        
        // Add image content for image frames
        if (this.isImageFrame(node)) {
            const imageContent = this.generateImageContent(node);
            if (imageContent) {
                html += imageContent;
            }
        }
        
        // Process children for all nodes (including instances)
        if (node.children && Array.isArray(node.children)) {
            html += '\n';
            for (let i = 0; i < node.children.length; i++) {
                const childHTML = this.processNode(node.children[i], depth + 1, node);
                if (childHTML) {
                    html += childHTML;
                    if (i < node.children.length - 1) {
                        html += '\n';
                    }
                }
            }
            html += `\n${indent}`;
        }
        
        // Close tag
        if (!this.isSelfClosingTag(tag)) {
            html += `</${tag}>`;
        }
        
        return html;
    }


    /**
     * Get appropriate HTML tag for Figma node type
     * @param {string} nodeType - Figma node type
     * @returns {string} HTML tag name
     */
    getHTMLTag(nodeType) {
        switch (nodeType) {
            case 'TEXT':
                return 'p';
            case 'FRAME':
            case 'GROUP':
            case 'COMPONENT':
            case 'COMPONENT_SET':
            case 'INSTANCE':
                return 'div';
            case 'VECTOR':
            case 'ELLIPSE':
                return 'svg'; // Only complex vectors and ellipses become SVG elements
            case 'RECTANGLE':
            case 'STAR':
            case 'POLYGON':
                return 'div'; // Simple shapes become div elements with CSS styling
            case 'LINE':
                return 'div'; // Use div instead of hr for better control over rotation and styling
            case 'IMAGE':
                return 'img';
            default:
                return 'div';
        }
    }

    /**
     * Sanitize class name for HTML
     * @param {string} name - Node name
     * @param {string} type - Node type
     * @returns {string} Sanitized class name
     */
    sanitizeClassName(name, type) {
        if (!name || typeof name !== 'string') return `figma-${type ? type.toLowerCase() : 'node'}`;
        
        return name
            .toLowerCase()
            .replace(/[^a-z0-9\s-=]/g, '') // Keep = and numbers
            .replace(/\s+/g, '-')
            .replace(/=+/g, '-') // Convert = to -
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '') || `figma-${type ? type.toLowerCase() : 'node'}`;
    }

    /**
     * Check if tag is self-closing
     * @param {string} tag - HTML tag name
     * @returns {boolean} True if self-closing
     */
    isSelfClosingTag(tag) {
        return ['img', 'hr', 'br', 'input'].includes(tag);
    }

    /**
     * Escape HTML special characters
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeHTML(text) {
        if (!text) return '';
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    /**
     * Check if node type is a vector type
     * @param {string} nodeType - Node type
     * @returns {boolean} True if vector type
     */
    isVectorNode(nodeType) {
        return ['VECTOR', 'ELLIPSE'].includes(nodeType);
    }

    /**
     * Generate SVG path elements for vector node (correct approach)
     * @param {Object} node - Vector node
     * @returns {string} SVG path elements
     */
    generateSVGPath(node) {
        try {
            // Process fills to generate SVG gradient definitions and fill references
            const { fillValue, gradientDefs } = this.processSVGFills(node);
            
            let pathElements = '';
            
            // Add gradient definitions if any
            if (gradientDefs) {
                pathElements += `<defs>${gradientDefs}</defs>`;
            }
            
            if (node.type === 'VECTOR') {
                // Extract actual vector path data
                const pathDataArray = this.extractVectorPath(node);
                
                if (pathDataArray && pathDataArray.length > 0) {
                    // Generate a path element for each path data with correct fill
                    for (const pathData of pathDataArray) {
                        pathElements += `<path d="${pathData}" fill="${fillValue}" />`;
                    }
                } else {
                    // Fallback to placeholder if no path data available
                    pathElements += `<path d="M0,0 L100,0 L100,100 L0,100 Z" fill="${fillValue}" />`;
                }
            } else if (node.type === 'ELLIPSE') {
                // Special handling for ellipses with correct fill
                const ellipseElement = this.convertEllipseToSVG(node, fillValue);
                pathElements += ellipseElement;
            } else {
                // Only VECTOR and ELLIPSE should reach here now
                return '';
            }
            
            return pathElements;
        } catch (error) {
            console.error(`[PASS1] Error generating SVG path for ${node.name}:`, error);
            return '';
        }
    }

    /**
     * Process SVG fills to generate appropriate fill values and gradient definitions
     * @param {Object} node - Figma node
     * @returns {Object} Object with fillValue and gradientDefs
     */
    processSVGFills(node) {
        if (!node.fills || node.fills.length === 0) {
            return { fillValue: 'currentColor', gradientDefs: '' };
        }

        const fill = node.fills[0];
        
        if (fill.type === 'SOLID' && fill.color) {
            // Handle solid fills
            const { r, g, b } = fill.color;
            const alpha = fill.opacity !== undefined ? fill.opacity : 1;
            if (alpha > 0) {
                const fillValue = `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${alpha})`;
                return { fillValue, gradientDefs: '' };
            }
        } else if (fill.type === 'GRADIENT_RADIAL' || fill.type === 'GRADIENT_LINEAR') {
            // Handle gradient fills
            const gradientId = `gradient-${node.id.replace(/[:.]/g, '-')}`;
            const gradientDefs = this.generateSVGGradient(fill, gradientId);
            const fillValue = `url(#${gradientId})`;
            return { fillValue, gradientDefs };
        }

        return { fillValue: 'currentColor', gradientDefs: '' };
    }

    /**
     * Generate SVG gradient definition
     * @param {Object} fill - Figma gradient fill
     * @param {string} gradientId - Unique ID for the gradient
     * @returns {string} SVG gradient definition
     */
    generateSVGGradient(fill, gradientId) {
        if (!fill.gradientStops || fill.gradientStops.length < 2) {
            return '';
        }

        const gradientType = fill.type === 'GRADIENT_RADIAL' ? 'radialGradient' : 'linearGradient';
        
        // Generate gradient stops
        const stops = fill.gradientStops.map(stop => {
            const { r, g, b } = stop.color;
            const a = stop.color.a !== undefined ? stop.color.a : 1;
            const opacity = fill.opacity !== undefined ? fill.opacity : 1;
            const finalAlpha = a * opacity;
            
            const color = finalAlpha < 1 ? 
                `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${finalAlpha})` :
                `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
            
            const offset = typeof stop.position === 'number' ? Math.round(stop.position * 100) : 0;
            return `<stop offset="${offset}%" stop-color="${color}" />`;
        }).join('');

        if (fill.type === 'GRADIENT_RADIAL') {
            return `<radialGradient id="${gradientId}" cx="50%" cy="50%" r="50%">${stops}</radialGradient>`;
        } else {
            // For linear gradients, we could use gradientTransform if available
            // For now, using a simple left-to-right gradient
            return `<linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="0%">${stops}</linearGradient>`;
        }
    }

    /**
     * Generate video HTML content for video frames
     * @param {Object} node - Figma node
     * @returns {string} Video HTML content
     */
    generateVideoContent(node) {
        const videoInfo = this.extractVideoInfo(node);
        if (!videoInfo) return '';
        
        // Generate video element with the specified structure
        // Use relative path for video files and add CSS for scaling
        // Multiple source paths to handle different serving scenarios
        return `<video id="video-${node.id.replace(/[:.]/g, '-')}" controls preload="none" style="width: 100%; height: 100%; object-fit: contain;" 
    onloadstart="this.style.opacity='0.5'" 
    oncanplay="this.style.opacity='1'" 
    onerror="this.innerHTML='<p style=\\'color:red;padding:20px;\\'>Video failed to load. Please check file path and format.</p>'">
    <source src="video/${videoInfo.filename}" type="video/mp4">
    <source src="./video/${videoInfo.filename}" type="video/mp4">
    <source src="../video/${videoInfo.filename}" type="video/mp4">
    <source src="/examples/video/${videoInfo.filename}" type="video/mp4">
    <source src="examples/video/${videoInfo.filename}" type="video/mp4">
    Your browser does not support the video tag.
  </video>`;
    }

    /**
     * Generate Lottie HTML content for Lottie frames
     * @param {Object} node - Figma node
     * @returns {string} Lottie HTML content
     */
    generateLottieContent(node) {
        const lottieInfo = this.extractLottieInfo(node);
        if (!lottieInfo) return '';
        
        // Generate Lottie container with multiple source paths to handle different serving scenarios
        return `<div class="lottie-container" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
    <div id="lottie-${node.id.replace(/[:.]/g, '-')}" 
         style="width: 100%; height: 100%;"
         data-lottie-src="lottie/${lottieInfo.filename}">
        <div style="padding: 20px; text-align: center; color: #666;">
            Loading Lottie animation...
        </div>
    </div>
</div>`;
    }

    /**
     * Generate image HTML content for image frames
     * @param {Object} node - Figma node
     * @returns {string} Image HTML content
     */
    generateImageContent(node) {
        const imageInfo = this.extractImageInfo(node);
        if (!imageInfo) return '';
        
        // Generate img element with multiple src paths to handle different serving scenarios
        return `<img src="img/${imageInfo.filename}" 
                     style="width: 100%; height: 100%; object-fit: contain;" 
                     alt="${imageInfo.filename}"
                     onerror="this.style.display='none'; console.warn('Image not found: ${imageInfo.filename}');">`;
    }

    /**
     * Generate rectangle path
     * @param {Object} node - Rectangle node
     * @returns {string} SVG path data
     */
    generateRectanglePath(node) {
        const { width, height, cornerRadius = 0 } = node;
        
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
     * @returns {string} SVG path data
     */
    generateEllipsePath(node) {
        const { width, height } = node;
        const rx = width / 2;
        const ry = height / 2;
        const cx = rx;
        const cy = ry;
        
        return `M ${cx - rx} ${cy} A ${rx} ${ry} 0 0 1 ${cx + rx} ${cy} A ${rx} ${ry} 0 0 1 ${cx - rx} ${cy} Z`;
    }

    /**
     * Generate star path
     * @param {Object} node - Star node
     * @returns {string} SVG path data
     */
    generateStarPath(node) {
        const { width, height } = node;
        const centerX = width / 2;
        const centerY = height / 2;
        const outerRadius = Math.min(width, height) / 2;
        const innerRadius = outerRadius * 0.4;
        
        let path = '';
        for (let i = 0; i < 10; i++) {
            const angle = (i * Math.PI) / 5;
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const x = centerX + radius * Math.cos(angle - Math.PI / 2);
            const y = centerY + radius * Math.sin(angle - Math.PI / 2);
            
            if (i === 0) {
                path += `M ${x} ${y}`;
            } else {
                path += ` L ${x} ${y}`;
            }
        }
        path += ' Z';
        
        return path;
    }

    /**
     * Generate polygon path
     * @param {Object} node - Polygon node
     * @returns {string} SVG path data
     */
    generatePolygonPath(node) {
        // For now, create a simple triangle - in real implementation, 
        // you'd extract the actual polygon points from the node
        const { width, height } = node;
        const centerX = width / 2;
        const centerY = height / 2;
        
        return `M ${centerX} 0 L ${width} ${height} L 0 ${height} Z`;
    }

    /**
     * Extract vector path data from node (following figma-to-html-standalone approach)
     * @param {Object} node - Vector node
     * @returns {Array} Array of SVG path data strings
     */
    extractVectorPath(node) {
        try {
            const paths = [];
            
            // Try to use fillGeometry first (most common) - get ALL paths, not just the first
            if (node.fillGeometry && node.fillGeometry.length > 0) {
                for (const geometry of node.fillGeometry) {
                    if (geometry.data) {
                        paths.push(geometry.data);
                    }
                }
            }
            
            // Fallback to strokeGeometry - get ALL paths
            if (paths.length === 0 && node.strokeGeometry && node.strokeGeometry.length > 0) {
                for (const geometry of node.strokeGeometry) {
                    if (geometry.data) {
                        paths.push(geometry.data);
                    }
                }
            }
            
            // Fallback to vectorPaths - get ALL paths
            if (paths.length === 0 && node.vectorPaths && node.vectorPaths.length > 0) {
                for (const path of node.vectorPaths) {
                    if (path.data) {
                        paths.push(path.data);
                    }
                }
            }
            
            // Fallback to vectorNetwork (our previous approach)
            if (paths.length === 0 && node.vectorNetwork) {
                const networkPath = this.convertVectorNetworkToPath(node.vectorNetwork);
                if (networkPath) {
                    paths.push(networkPath);
                }
            }
            
            // Final fallback to basic shape generation
            if (paths.length === 0) {
                const fallbackPath = this.generateFallbackPath(node);
                if (fallbackPath) {
                    paths.push(fallbackPath);
                }
            }
            
            return paths;
        } catch (error) {
            console.error(`[PASS1] Error extracting vector path for ${node.name}:`, error);
            return [];
        }
    }

    /**
     * Convert Figma vectorNetwork to SVG path
     * @param {Object} vectorNetwork - Figma vector network data
     * @returns {string} SVG path data
     */
    convertVectorNetworkToPath(vectorNetwork) {
        try {
            if (!vectorNetwork || !vectorNetwork.segments) {
                return null;
            }

            let pathData = '';
            const { segments, vertices } = vectorNetwork;
            
            // Process each segment
            for (let i = 0; i < segments.length; i++) {
                const segment = segments[i];
                const startVertex = vertices[segment.start];
                const endVertex = vertices[segment.end];
                
                if (!startVertex || !endVertex) continue;
                
                const startPoint = `${startVertex.x} ${startVertex.y}`;
                const endPoint = `${endVertex.x} ${endVertex.y}`;
                
                if (i === 0) {
                    // First segment - move to start point
                    pathData += `M ${startPoint}`;
                }
                
                // Handle different segment types
                if (segment.tangentStart && segment.tangentEnd) {
                    // Curved segment with control points
                    const cp1 = `${segment.tangentStart.x} ${segment.tangentStart.y}`;
                    const cp2 = `${segment.tangentEnd.x} ${segment.tangentEnd.y}`;
                    pathData += ` C ${cp1} ${cp2} ${endPoint}`;
                } else if (segment.tangentStart) {
                    // Quadratic curve
                    const cp = `${segment.tangentStart.x} ${segment.tangentStart.y}`;
                    pathData += ` Q ${cp} ${endPoint}`;
                } else {
                    // Straight line
                    pathData += ` L ${endPoint}`;
                }
            }
            
            // Close the path if it's a closed shape
            if (vectorNetwork.isClosed) {
                pathData += ' Z';
            }
            
            return pathData;
        } catch (error) {
            console.error('[PASS1] Error converting vector network:', error);
            return null;
        }
    }

    /**
     * Convert Figma vectorPaths to SVG path
     * @param {Array} vectorPaths - Array of vector path data
     * @returns {string} SVG path data
     */
    convertVectorPathsToPath(vectorPaths) {
        try {
            let pathData = '';
            
            for (let i = 0; i < vectorPaths.length; i++) {
                const path = vectorPaths[i];
                
                if (path.data) {
                    // Direct path data
                    pathData += path.data;
                } else if (path.points) {
                    // Convert points to path
                    pathData += this.convertPointsToPath(path.points, path.closed);
                }
                
                // Add space between multiple paths
                if (i < vectorPaths.length - 1) {
                    pathData += ' ';
                }
            }
            
            return pathData;
        } catch (error) {
            console.error('[PASS1] Error converting vector paths:', error);
            return null;
        }
    }

    /**
     * Convert points array to SVG path
     * @param {Array} points - Array of point objects
     * @param {boolean} closed - Whether the path is closed
     * @returns {string} SVG path data
     */
    convertPointsToPath(points, closed = false) {
        if (!points || points.length === 0) return '';
        
        let pathData = '';
        
        for (let i = 0; i < points.length; i++) {
            const point = points[i];
            const coords = `${point.x} ${point.y}`;
            
            if (i === 0) {
                pathData += `M ${coords}`;
            } else {
                // Check if this point has curve data
                if (point.handleIn && point.handleOut) {
                    const cp1 = `${point.handleIn.x} ${point.handleIn.y}`;
                    const cp2 = `${point.handleOut.x} ${point.handleOut.y}`;
                    pathData += ` C ${cp1} ${cp2} ${coords}`;
                } else if (point.handleOut) {
                    const cp = `${point.handleOut.x} ${point.handleOut.y}`;
                    pathData += ` Q ${cp} ${coords}`;
                } else {
                    pathData += ` L ${coords}`;
                }
            }
        }
        
        if (closed) {
            pathData += ' Z';
        }
        
        return pathData;
    }

    /**
     * Convert ellipse data to SVG ellipse or path element (correct approach)
     * @param {Object} nodeData - The node data containing ellipse information
     * @param {string} fillColor - The fill color for the ellipse (from Figma fills)
     * @returns {string} SVG ellipse or path element string
     */
    convertEllipseToSVG(nodeData, fillColor = 'currentColor') {
        if (!nodeData.width || !nodeData.height) {
            return '';
        }
        
        const { width, height } = nodeData;
        const centerX = width / 2;
        const centerY = height / 2;
        const radiusX = width / 2;
        const radiusY = height / 2;
        
        // Handle arc data if present (for partial ellipses and rings)
        if (nodeData.arcData) {
            const arcData = nodeData.arcData;
            const startAngle = arcData.startingAngle || 0;
            const endAngle = arcData.endingAngle || 2 * Math.PI;
            const innerRadius = arcData.innerRadius || 0;
            
            // Check if it's a complete ellipse (full 360 degrees)
            if (endAngle - startAngle >= 2 * Math.PI - 0.01) {
                if (innerRadius > 0) {
                    // Complete ring/donut - use SVG mask for proper hole
                    const innerRadiusX = radiusX * innerRadius;
                    const innerRadiusY = radiusY * innerRadius;
                    const maskId = `mask-${Math.random().toString(36).substr(2, 9)}`;
                    
                    return `<defs>
                        <mask id="${maskId}">
                            <rect width="100%" height="100%" fill="white"/>
                            <ellipse cx="${centerX}" cy="${centerY}" rx="${innerRadiusX}" ry="${innerRadiusY}" fill="black"/>
                        </mask>
                    </defs>
                    <ellipse cx="${centerX}" cy="${centerY}" rx="${radiusX}" ry="${radiusY}" fill="${fillColor}" mask="url(#${maskId})" />`;
                } else {
                    // Complete solid ellipse - use <ellipse> element
                    return `<ellipse cx="${centerX}" cy="${centerY}" rx="${radiusX}" ry="${radiusY}" fill="${fillColor}" />`;
                }
            } else {
                // Partial ellipse/ring - use <path> element with proper arc rendering
                const largeArcFlag = Math.abs(endAngle - startAngle) > Math.PI ? 1 : 0;
                
                if (innerRadius > 0) {
                    // Ring segment - create path with inner and outer arcs
                    const innerRadiusX = radiusX * innerRadius;
                    const innerRadiusY = radiusY * innerRadius;
                    
                    // Calculate outer arc points
                    const outerStartX = centerX + radiusX * Math.cos(startAngle);
                    const outerStartY = centerY + radiusY * Math.sin(startAngle);
                    const outerEndX = centerX + radiusX * Math.cos(endAngle);
                    const outerEndY = centerY + radiusY * Math.sin(endAngle);
                    
                    // Calculate inner arc points
                    const innerStartX = centerX + innerRadiusX * Math.cos(startAngle);
                    const innerStartY = centerY + innerRadiusY * Math.sin(startAngle);
                    const innerEndX = centerX + innerRadiusX * Math.cos(endAngle);
                    const innerEndY = centerY + innerRadiusY * Math.sin(endAngle);
                    
                    // Create ring segment path:
                    // 1. Move to outer start point
                    // 2. Arc to outer end point
                    // 3. Line to inner end point
                    // 4. Arc to inner start point (reverse direction)
                    // 5. Close path
                    const pathData = `M ${outerStartX} ${outerStartY} A ${radiusX} ${radiusY} 0 ${largeArcFlag} 1 ${outerEndX} ${outerEndY} L ${innerEndX} ${innerEndY} A ${innerRadiusX} ${innerRadiusY} 0 ${largeArcFlag} 0 ${innerStartX} ${innerStartY} Z`;
                    return `<path d="${pathData}" fill="${fillColor}" />`;
                } else {
                    // Solid pie segment - create path from center
                    const startX = centerX + radiusX * Math.cos(startAngle);
                    const startY = centerY + radiusY * Math.sin(startAngle);
                    const endX = centerX + radiusX * Math.cos(endAngle);
                    const endY = centerY + radiusY * Math.sin(endAngle);
                    
                    // Create pie segment path:
                    // 1. Move to center
                    // 2. Line to start point
                    // 3. Arc to end point
                    // 4. Close path (line back to center)
                    const pathData = `M ${centerX} ${centerY} L ${startX} ${startY} A ${radiusX} ${radiusY} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;
                    return `<path d="${pathData}" fill="${fillColor}" />`;
                }
            }
        } else {
            // No arc data - assume complete ellipse
            return `<ellipse cx="${centerX}" cy="${centerY}" rx="${radiusX}" ry="${radiusY}" fill="${fillColor}" />`;
        }
    }

    /**
     * Generate fallback path when vector data is not available
     * @param {Object} node - Vector node
     * @returns {string} SVG path data
     */
    generateFallbackPath(node) {
        // Fallback to basic shape generation based on node type
        switch (node.type) {
            case 'RECTANGLE':
                return this.generateRectanglePath(node);
            case 'ELLIPSE':
                return this.generateEllipsePath(node);
            case 'STAR':
                return this.generateStarPath(node);
            case 'POLYGON':
                return this.generatePolygonPath(node);
            default:
                // Generic rectangle fallback
                return `M 0 0 L ${node.width} 0 L ${node.width} ${node.height} L 0 ${node.height} Z`;
        }
    }

    /**
     * Update metadata with node information
     * @param {Object} metadata - Metadata object
     * @param {Object} node - Node object
     */
    updateMetadata(metadata, node) {
        metadata.totalNodes++;
        metadata.nodeTypes[node.type] = (metadata.nodeTypes[node.type] || 0) + 1;
        metadata.hierarchy.push({
            id: node.id,
            name: node.name,
            type: node.type,
            depth: 0 // This would need to be calculated properly
        });
    }

    /**
     * Get variant trigger information for a node
     * @param {Object} node - The current node
     * @param {Object} parent - The parent node
     * @returns {Object|null} Variant trigger info or null
     */
    getVariantTrigger(node, parent) {
        // Use Figma's reactions data to determine if this node has click events
        if (node.reactions && node.reactions.length > 0) {
            // For INSTANCE nodes, filter out reactions that are inherited from components
            // (reactions that switch to variants within the same component set)
            let filteredReactions = node.reactions;
            
            if (node.type === 'INSTANCE') {
                // Check if the reaction destination is within the same component set
                // If so, it's likely an inherited reaction from the component, not a real INSTANCE reaction
                filteredReactions = node.reactions.filter(reaction => {
                    if (reaction.action && reaction.action.destinationId) {
                        // Only exclude INSTANCE reactions that are ON_CLICK or ON_PRESS
                        // Keep keyboard, gamepad, and timeout triggers as they are likely intentional
                        if (reaction.action.type === 'NODE' && 
                            reaction.action.navigation === 'CHANGE_TO' &&
                            (reaction.trigger.type === 'ON_CLICK' || reaction.trigger.type === 'ON_PRESS')) {
                            return false;
                        }
                    }
                    return true;
                });
                
            }
            
            // Check if any reaction is a click/press/timeout/keyboard/gamepad event that changes to a variant
            const hasVariantSwitchReaction = filteredReactions.some(reaction => {
                const isVariantSwitch = reaction.trigger &&
                       (reaction.trigger.type === 'ON_CLICK' || 
                        reaction.trigger.type === 'ON_PRESS' || 
                        reaction.trigger.type === 'AFTER_TIMEOUT' ||
                        reaction.trigger.type === 'ON_KEYBOARD' ||
                        reaction.trigger.type === 'ON_KEY_DOWN' ||
                        reaction.trigger.type === 'ON_GAMEPAD') &&
                       reaction.action &&
                       reaction.action.type === 'NODE' &&
                       reaction.action.navigation === 'CHANGE_TO';
                
                
                return isVariantSwitch;
            });
            
            if (hasVariantSwitchReaction) {
                // Find ALL reactions with CHANGE_TO action
                const changeToReactions = filteredReactions.filter(reaction => {
                    return reaction.trigger && 
                           (reaction.trigger.type === 'ON_CLICK' || 
                            reaction.trigger.type === 'ON_PRESS' || 
                            reaction.trigger.type === 'AFTER_TIMEOUT' ||
                            reaction.trigger.type === 'ON_KEYBOARD' ||
                            reaction.trigger.type === 'ON_KEY_DOWN' ||
                            reaction.trigger.type === 'ON_GAMEPAD') &&
                           reaction.action && 
                           reaction.action.type === 'NODE' &&
                           reaction.action.navigation === 'CHANGE_TO';
                });
                
                // For now, return the first reaction to maintain compatibility
                // TODO: Modify HTML generation to handle multiple reactions per element
                const changeToReaction = changeToReactions[0];
                
                const targetVariantId = changeToReaction ? changeToReaction.action.destinationId : 'auto';
                
                // Extract keyboard/gamepad specific data
                let keyCode = null;
                let gamepadButton = null;
                
                if (changeToReaction && (changeToReaction.trigger.type === 'ON_KEYBOARD' || changeToReaction.trigger.type === 'ON_KEY_DOWN') && changeToReaction.trigger.keyCodes && changeToReaction.trigger.keyCodes.length > 0) {
                    keyCode = changeToReaction.trigger.keyCodes[0]; // Use first key code
                }
                
                if (changeToReaction && changeToReaction.trigger.type === 'ON_GAMEPAD' && changeToReaction.trigger.gamepadButton !== undefined) {
                    gamepadButton = changeToReaction.trigger.gamepadButton;
                }
                
                return {
                    targetVariantId: targetVariantId,
                    componentSetId: 'auto',   // Will be determined by JavaScript
                    triggerType: changeToReaction.trigger.type,
                    timeoutDelay: changeToReaction.trigger.type === 'AFTER_TIMEOUT' ? 
                                 (changeToReaction.trigger.timeout ? changeToReaction.trigger.timeout * 1000 : 1000) : null,
                    keyCode: keyCode,
                    gamepadButton: gamepadButton,
                    transition: changeToReaction.action.transition || null,
                    allReactions: changeToReactions // Store all reactions for JavaScript processing
                };
            }
        }
        
        return null;
    }

}

module.exports = NodeStructurePass;
