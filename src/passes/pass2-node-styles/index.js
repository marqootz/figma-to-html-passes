/**
 * Pass 2: Node CSS Styles (Modular)
 * 
 * This pass extracts visual styles from Figma nodes and generates CSS.
 * It handles fills, strokes, effects, typography, layout properties, and more.
 */

// Import extractors
const { extractFills } = require('./extractors/fills-extractor');
const { extractStrokes } = require('./extractors/strokes-extractor');
const { extractEffects } = require('./extractors/effects-extractor');
const { extractTypography } = require('./extractors/typography-extractor');

// Import generators
const { generateTypographyCSS } = require('./generators/typography-generator');
const { generateLayoutCSS } = require('./generators/layout-generator');
const { generateStrokeCSS } = require('./generators/stroke-generator');
const { processVectorNode } = require('./generators/svg-generator');

// Import utilities
const { rgbaToHex } = require('./utils/color-utils');

class NodeStylesPass {
    constructor() {
        this.styles = new Map(); // Store styles by node ID
        this.cssRules = [];
        this.processedNodes = new Set();
    }

    /**
     * Safely convert any value to string, handling Symbols and other edge cases
     * @param {any} value - Value to convert
     * @returns {string} String representation
     */
    safeStringConversion(value) {
        try {
            if (value === null) return 'null';
            if (value === undefined) return 'undefined';
            if (typeof value === 'string') return value;
            if (typeof value === 'number') return String(value);
            if (typeof value === 'boolean') return String(value);
            if (typeof value === 'symbol') return String(value);
            if (typeof value === 'object') {
                try {
                    return JSON.stringify(value);
                } catch (e) {
                    return '[object Object]';
                }
            }
            return String(value);
        } catch (error) {
            console.warn('Error converting value to string:', value, error);
            return '[conversion error]';
        }
    }

    /**
     * Check if a frame is an image frame based on its name
     * @param {Object} node - Figma node
     * @returns {boolean} True if the node is an image frame
     */
    isImageFrame(node) {
        const isImage = typeof node.name === 'string' && node.name.startsWith('[IMG]');
        if (isImage) {
            console.log(`🖼️ Image frame check: "${node.name}" -> ${isImage}`);
        }
        return isImage;
    }

    /**
     * Process nodes and extract their styles
     * @param {Array} nodes - Array of original Figma nodes (with style properties)
     * @param {Object} pass1Result - Result from Pass 1 (structure)
     * @returns {Object} Result with CSS styles
     */
    async process(nodes, pass1Result) {
        try {
            console.log('🎨 Pass 2: Starting CSS generation...');
            this.styles.clear();
            this.cssRules = [];
            this.processedNodes.clear();
            
            const result = {
                css: '',
                styles: {},
                metadata: {
                    totalNodes: 0,
                    styleTypes: {},
                    cssRulesCount: 0
                }
            };

        // Process each root node (original Figma nodes with style properties)
        // Top-level nodes use figma-container as their coordinate system
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            this.extractNodeStyles(node, 0, null, true); // isTopLevel = true
        }

        // Generate CSS from extracted styles
            result.css = this.generateCSS();
            result.styles = Object.fromEntries(this.styles);
            result.metadata.totalNodes = this.styles.size;
            result.metadata.cssRulesCount = this.cssRules.length;

            console.log('✅ Pass 2: CSS generation complete');
            return result;
        } catch (error) {
            console.error('🚨 Error in Pass 2 CSS generation:', error);
            console.error('Error stack:', error.stack);
            
            // Return minimal result to prevent complete failure
            return {
                css: '/* CSS generation failed */',
                styles: {},
                metadata: {
                    totalNodes: 0,
                    styleTypes: {},
                    cssRulesCount: 0,
                    error: error.message
                }
            };
        }
    }

    /**
     * Extract styles from a single node and its children
     * @param {Object} node - Figma node
     * @param {number} depth - Current depth level
     * @param {Object} parent - Parent node (for context)
     * @param {boolean} isTopLevel - Whether this is a top-level node
     */
    extractNodeStyles(node, depth = 0, parent = null, isTopLevel = false) {
        try {
            if (!node || this.processedNodes.has(node.id)) {
                return;
            }

            console.log(`🎨 Processing node styles: ${this.safeStringConversion(node.id)} (${this.safeStringConversion(node.type)})`);
            this.processedNodes.add(node.id);
        
        const nodeStyles = {
            fills: extractFills(node),
            strokes: extractStrokes(node),
            effects: extractEffects(node),
            typography: extractTypography(node),
            opacity: node.opacity !== undefined ? node.opacity : 1,
            visible: node.visible !== false
        };

        // Store styles for this node
        this.styles.set(node.id, nodeStyles);

        // Generate CSS rule for this node
        this.generateNodeCSSRule(node, nodeStyles, parent, isTopLevel);
        
        // Handle vector nodes for SVG conversion
        if (node.type === 'VECTOR' || node.type === 'STAR' || node.type === 'POLYGON' || node.type === 'ELLIPSE' || node.type === 'RECTANGLE') {
            this.processVectorNode(node);
        }

        // Process children
        if (node.children && Array.isArray(node.children)) {
            for (let i = 0; i < node.children.length; i++) {
                this.extractNodeStyles(node.children[i], depth + 1, node, false); // Children are not top-level
            }
        }

        // Handle INSTANCE nodes - process instance itself and its children
        if (node.type === 'INSTANCE') {
            // Process the instance itself (it will get its own properties)
            // The instance's children (component set and variants) will be processed recursively
            // No special handling needed here - just process children normally
        }
        } catch (error) {
            console.error(`🚨 Error extracting styles for node:`, {
                nodeId: this.safeStringConversion(node && node.id),
                nodeName: this.safeStringConversion(node && node.name),
                nodeType: this.safeStringConversion(node && node.type),
                error: error.message,
                stack: error.stack
            });
            
            // Continue processing other nodes even if this one fails
            return;
        }
    }

    /**
     * Generate CSS rule for a specific node
     * @param {Object} node - Figma node
     * @param {Object} styles - Extracted styles
     * @param {Object} parent - Parent node (for context)
     * @param {boolean} isTopLevel - Whether this is a top-level node
     */
    generateNodeCSSRule(node, styles, parent = null, isTopLevel = false) {
        try {
            console.log(`🎨 Generating CSS rule for: ${this.safeStringConversion(node.id)} (${this.safeStringConversion(node.type)})`);
            
            // Use higher specificity selector to ensure styles override any debug styles
            const selector = `[data-figma-id="${this.safeStringConversion(node.id)}"][data-figma-type="${this.safeStringConversion(node.type)}"]`;
            const rules = [];

        // Check if this is an image frame - skip padding, border, and background
        const isImageFrame = this.isImageFrame(node);
        if (isImageFrame) {
            console.log(`🖼️ Image frame detected: ${this.safeStringConversion(node.name)} - skipping padding/borders`);
        }
        
        // Background (fills) - handle differently for different node types
        if (styles.fills && styles.fills.length > 0) {
            if (node.type === 'TEXT') {
                // For TEXT nodes, use color instead of background
                const textColor = this.generateTextColorCSS(styles.fills);
                if (textColor) {
                    rules.push(`color: ${textColor};`);
                }
            } else if (node.type === 'VECTOR' || node.type === 'ELLIPSE') {
                // For VECTOR and ELLIPSE nodes, don't apply background CSS
                // These are SVG elements that get their colors from path elements
                // No background CSS needed
            } else if (!isImageFrame) {
                // For other nodes (RECTANGLE, FRAME, etc.), use background
                // Skip background for image frames to avoid interfering with image display
                const background = this.generateBackgroundCSS(styles.fills);
                if (background) {
                    rules.push(`background: ${background};`);
                }
            }
        }

        // Border (strokes) - skip for COMPONENT_SET nodes, image frames, and SVG elements
        const isSVGElement = node.type === 'VECTOR' || node.type === 'ELLIPSE' || node.type === 'RECTANGLE' || node.type === 'POLYGON' || node.type === 'STAR';
        if (styles.strokes && node.type !== 'COMPONENT_SET' && !isImageFrame && !isSVGElement) {
            const strokeRules = generateStrokeCSS(styles.strokes);
            rules.push(...strokeRules);
        }

        // Special handling for LINE nodes - use stroke properties to create line appearance
        if (node.type === 'LINE' && styles.strokes) {
            const lineResult = this.generateLineCSS(node, styles.strokes);
            if (lineResult) {
                // Add main rules to the current rule set
                rules.push(...lineResult.mainRules);
                
                // Generate separate CSS rule for the pseudo-element
                if (lineResult.pseudoRules && lineResult.pseudoRules.length > 0) {
                    const pseudoSelector = `.${this.sanitizeClassName(node.name, node.type)}-${node.id.replace(/[:.]/g, '-')}::before`;
                    const pseudoRule = `${pseudoSelector} { ${lineResult.pseudoRules.join(' ')} }`;
                    this.pseudoElementRules = this.pseudoElementRules || [];
                    this.pseudoElementRules.push(pseudoRule);
                }
            }
        }

        // Effects (shadows, blurs)
        if (styles.effects && styles.effects.length > 0) {
            const effects = this.generateEffectsCSS(styles.effects);
            if (effects) {
                rules.push(...effects);
            }
        }

        // Typography
        if (styles.typography) {
            const typography = this.generateTypographyCSS(styles.typography);
            if (typography) {
                rules.push(...typography);
            }
        }

        // Layout - pass isImageFrame flag to skip padding for image containers
        const layout = this.generateLayoutCSS(node, parent, isTopLevel, isImageFrame);
        if (layout) {
            rules.push(...layout);
        }

        // Opacity
        if (styles.opacity !== undefined && styles.opacity !== 1) {
            rules.push(`opacity: ${styles.opacity};`);
        }

        // Visibility
        if (!styles.visible) {
            rules.push(`display: none;`);
        }

            if (rules.length > 0) {
                this.cssRules.push({
                    selector,
                    rules,
                    nodeId: this.safeStringConversion(node.id),
                    nodeName: this.safeStringConversion(node.name)
                });
            }
        } catch (error) {
            console.error(`🚨 Error generating CSS rule for node:`, {
                nodeId: this.safeStringConversion(node && node.id),
                nodeName: this.safeStringConversion(node && node.name),
                nodeType: this.safeStringConversion(node && node.type),
                error: error.message,
                stack: error.stack
            });
            
            // Continue processing other nodes even if this one fails
            return;
        }
    }

    /**
     * Generate text color CSS from fills (for TEXT nodes)
     * @param {Array} fills - Array of fill styles
     * @returns {string} CSS color property
     */
    generateTextColorCSS(fills) {
        const visibleFills = fills.filter(fill => fill.visible);
        if (visibleFills.length === 0) return null;

        const fill = visibleFills[0]; // Use first visible fill
        
        // For text, we only support solid colors (gradients don't work well with text)
        if (fill.type === 'SOLID') {
            return fill.color;
        }
        
        // Fallback to black if not a solid color
        return '#000000';
    }

    /**
     * Generate background CSS from fills
     * @param {Array} fills - Array of fill styles
     * @returns {string} CSS background property
     */
    generateBackgroundCSS(fills) {
        const visibleFills = fills.filter(fill => fill.visible);
        if (visibleFills.length === 0) return null;

        const fill = visibleFills[0]; // Use first visible fill
        
        switch (fill.type) {
            case 'SOLID':
                return fill.color;
            case 'GRADIENT_LINEAR':
                return this.generateLinearGradientCSS(fill);
            case 'GRADIENT_RADIAL':
                return this.generateRadialGradientCSS(fill);
            default:
                return null;
        }
    }

    /**
     * Generate linear gradient CSS
     * @param {Object} fill - Gradient fill
     * @returns {string} CSS linear gradient
     */
    generateLinearGradientCSS(fill) {
        if (!fill.gradientStops || fill.gradientStops.length < 2) {
            return null;
        }

        const stops = fill.gradientStops.map(stop => {
            const color = rgbaToHex(stop.color);
            const position = typeof stop.position === 'number' ? Math.round(stop.position * 100) : 0;
            return `${color} ${position}%`;
        }).join(', ');

        return `linear-gradient(90deg, ${stops})`;
    }

    /**
     * Generate radial gradient CSS
     * @param {Object} fill - Gradient fill
     * @returns {string} CSS radial gradient
     */
    generateRadialGradientCSS(fill) {
        if (!fill.gradientStops || fill.gradientStops.length < 2) {
            return null;
        }

        const stops = fill.gradientStops.map(stop => {
            const color = rgbaToHex(stop.color);
            const position = typeof stop.position === 'number' ? Math.round(stop.position * 100) : 0;
            return `${color} ${position}%`;
        }).join(', ');

        return `radial-gradient(circle, ${stops})`;
    }


    /**
     * Generate CSS for LINE nodes using stroke properties
     * @param {Object} node - LINE node
     * @param {Object} strokes - Stroke styles
     * @param {Array} rules - Array to add CSS rules to
     */
    generateLineCSS(node, strokes, rules) {
        if (!strokes || strokes.type !== 'SOLID' || !strokes.color) {
            return;
        }

        const strokeWeight = strokes.weight || 1;
        
        // For LINE nodes, override the dimensions to create a proper line
        // The layout generator will have already set dimensions, but we need to override them
        const hasWidth = node.width && typeof node.width === 'number' && node.width > 0;
        const hasHeight = node.height && typeof node.height === 'number' && node.height > 0;
        
        if (hasWidth && hasHeight) {
            // Determine which dimension is the line direction based on which is larger
            if (node.width > node.height) {
                // Horizontal line - use width for length, stroke weight for height
                rules.push(`width: ${this.roundCSS(node.width)}px !important;`);
                rules.push(`height: ${this.roundCSS(strokeWeight)}px !important;`);
            } else {
                // Vertical line - use height for length, stroke weight for width
                rules.push(`width: ${this.roundCSS(strokeWeight)}px !important;`);
                rules.push(`height: ${this.roundCSS(node.height)}px !important;`);
            }
        } else if (hasWidth) {
            // Only width specified - horizontal line
            rules.push(`width: ${this.roundCSS(node.width)}px !important;`);
            rules.push(`height: ${this.roundCSS(strokeWeight)}px !important;`);
        } else if (hasHeight) {
            // Only height specified - vertical line
            rules.push(`width: ${this.roundCSS(strokeWeight)}px !important;`);
            rules.push(`height: ${this.roundCSS(node.height)}px !important;`);
        } else {
            // No dimensions - default to horizontal line
            rules.push(`width: 100px !important;`);
            rules.push(`height: ${this.roundCSS(strokeWeight)}px !important;`);
        }

        // Apply stroke color as background color
        rules.push(`background-color: ${strokes.color} !important;`);
        
        // Remove any border that might interfere
        rules.push(`border: none !important;`);
        
        // Ensure the line displays properly
        rules.push(`display: block !important;`);
        
        // Return the rules (no pseudo-element needed)
        return {
            mainRules: rules,
            pseudoRules: []
        };
    }

    /**
     * Round CSS values to avoid sub-pixel rendering issues
     * @param {number} value - Value to round
     * @returns {number} Rounded value
     */
    roundCSS(value) {
        if (typeof value !== 'number' || isNaN(value)) {
            return 0;
        }
        return Math.round(value * 100) / 100; // Round to 2 decimal places
    }

    /**
     * Generate effects CSS (shadows, blurs)
     * @param {Array} effects - Array of effects
     * @returns {Array} Array of CSS rules
     */
    generateEffectsCSS(effects) {
        const rules = [];
        
        effects.forEach(effect => {
            if (!effect.visible) return;
            
            switch (effect.type) {
                case 'DROP_SHADOW':
                    const shadow = `${effect.offset.x}px ${effect.offset.y}px ${effect.radius}px ${effect.spread}px ${effect.color}`;
                    rules.push(`box-shadow: ${shadow};`);
                    break;
                case 'LAYER_BLUR':
                    rules.push(`filter: blur(${effect.radius}px);`);
                    break;
            }
        });
        
        return rules;
    }

    /**
     * Generate complete CSS from all rules
     * @returns {string} Complete CSS
     */
    generateCSS() {
        if (this.cssRules.length === 0) {
            return '';
        }

        let css = '/* Generated CSS from Figma styles */\n';
        
        this.cssRules.forEach(rule => {
            css += `${rule.selector} {\n`;
            rule.rules.forEach(ruleText => {
                css += `  ${ruleText}\n`;
            });
            css += '}\n\n';
        });
        
        // Add pseudo-element rules for LINE nodes
        if (this.pseudoElementRules && this.pseudoElementRules.length > 0) {
            css += '/* LINE node pseudo-element rules */\n';
            this.pseudoElementRules.forEach(rule => {
                css += `${rule}\n\n`;
            });
        }
        
        return css;
    }

    // CSS Generation methods (now implemented via generators)
    generateTypographyCSS(typography) {
        if (!typography) return [];
        return generateTypographyCSS(typography);
    }

    generateLayoutCSS(node, parent, isTopLevel) {
        if (!node) return [];
        return generateLayoutCSS(node, parent, isTopLevel);
    }

    processVectorNode(node) {
        if (!node) return;
        return processVectorNode(node);
    }
}

module.exports = NodeStylesPass;
