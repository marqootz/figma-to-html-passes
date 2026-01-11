/**
 * Main Plugin Class
 * 
 * Orchestrates the multi-pass system for Figma to HTML conversion
 */
class FigmaToHTMLPluginCode {
    constructor() {
        this.isGenerating = false;
        this.nodeStructurePass = new NodeStructurePass();
        this.nodeStylesPass = new NodeStylesPass();
        this.ruleGenerationPass = new RuleGenerationPass();
        this.setupMessageHandlers();
        this.showUI();
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
     * Map Figma key code to JavaScript key code
     * @param {number} figmaKeyCode - Figma key code
     * @returns {number} JavaScript key code
     */
    mapFigmaKeyCodeToJS(figmaKeyCode) {
        // Common key code mappings from Figma to JavaScript
        const keyCodeMap = {
            // Function keys
            112: 112, // F1
            113: 113, // F2
            114: 114, // F3
            115: 115, // F4
            116: 116, // F5
            117: 117, // F6
            118: 118, // F7
            119: 119, // F8
            120: 120, // F9
            121: 121, // F10
            122: 122, // F11
            123: 123, // F12
            
            // Special keys
            8: 8,     // Backspace
            9: 9,     // Tab
            13: 13,   // Enter
            16: 16,   // Shift
            17: 17,   // Ctrl
            18: 18,   // Alt
            20: 20,   // Caps Lock
            27: 27,   // Escape
            32: 32,   // Space
            37: 37,   // Left Arrow
            38: 38,   // Up Arrow
            39: 39,   // Right Arrow
            40: 40,   // Down Arrow
            
            // Number keys (0-9)
            48: 48,   // 0
            49: 49,   // 1
            50: 50,   // 2
            51: 51,   // 3
            52: 52,   // 4
            53: 53,   // 5
            54: 54,   // 6
            55: 55,   // 7
            56: 56,   // 8
            57: 57,   // 9
            
            // Letter keys (A-Z)
            65: 65,   // A
            66: 66,   // B
            67: 67,   // C
            68: 68,   // D
            69: 69,   // E
            70: 70,   // F
            71: 71,   // G
            72: 72,   // H
            73: 73,   // I
            74: 74,   // J
            75: 75,   // K
            76: 76,   // L
            77: 77,   // M
            78: 78,   // N
            79: 79,   // O
            80: 80,   // P
            81: 81,   // Q
            82: 82,   // R
            83: 83,   // S
            84: 84,   // T
            85: 85,   // U
            86: 86,   // V
            87: 87,   // W
            88: 88,   // X
            89: 89,   // Y
            90: 90,   // Z
        };
        
        return keyCodeMap[figmaKeyCode] || figmaKeyCode;
    }

    /**
     * Map Figma gamepad button to JavaScript gamepad button
     * @param {number} figmaGamepadButton - Figma gamepad button index
     * @returns {number} JavaScript gamepad button index
     */
    mapFigmaGamepadButtonToJS(figmaGamepadButton) {
        // Standard gamepad button mapping (Xbox controller layout)
        const gamepadButtonMap = {
            0: 0,  // A button (South)
            1: 1,  // B button (East)
            2: 2,  // X button (West)
            3: 3,  // Y button (North)
            4: 4,  // Left bumper
            5: 5,  // Right bumper
            6: 6,  // Left trigger
            7: 7,  // Right trigger
            8: 8,  // Select/Back
            9: 9,  // Start
            10: 10, // Left stick click
            11: 11, // Right stick click
            12: 12, // D-pad up
            13: 13, // D-pad down
            14: 14, // D-pad left
            15: 15, // D-pad right
        };
        
        return gamepadButtonMap[figmaGamepadButton] !== undefined ? gamepadButtonMap[figmaGamepadButton] : figmaGamepadButton;
    }

    /**
     * Show the plugin UI
     */
    showUI() {
        figma.showUI(__html__, { 
            width: 350, 
            height: 600,
            themeColors: true
        });
        
        // Send initial message to UI
        this.sendMessage({
            type: 'plugin-ready',
            message: 'Plugin initialized successfully'
        });
    }

    /**
     * Setup message handlers
     */
    setupMessageHandlers() {
        figma.ui.onmessage = (msg) => {
            if (msg && typeof msg === 'object' && msg.type) {
                this.handleMessage(msg);
            }
        };
    }

    /**
     * Handle incoming messages
     * @param {Object} msg - Message object
     */
    async handleMessage(msg) {
        try {
            console.log('📨 Plugin received message:', msg.type);
            switch (msg.type) {
                case 'generate-html':
                    await this.handleGenerateHTML(msg);
                    break;
                case 'generate-rules':
                    await this.handleGenerateRules(msg);
                    break;
                case 'export-rules-to-showroom':
                    await this.handleExportRulesToShowroom(msg);
                    break;
                case 'get-selection':
                    await this.handleGetSelection();
                    break;
                case 'check-drive-connection':
                    await this.handleCheckDriveConnection();
                    break;
                case 'connect-google-drive':
                    await this.handleConnectGoogleDrive();
                    break;
                case 'fetch-presentations':
                    await this.handleFetchPresentations();
                    break;
                case 'export-to-showroom':
                    await this.handleExportToShowroom(msg);
                    break;
                case 'resolve-presentation-conflict':
                    await this.handleResolvePresentationConflict(msg);
                    break;
                case 'store-access-token':
                    await this.handleStoreAccessToken(msg);
                    break;
                case 'store-client-id':
                    await this.handleStoreClientId(msg);
                    break;
                case 'store-folder-id':
                    await this.handleStoreFolderId(msg);
                    break;
                case 'store-service-account-key':
                    await this.handleStoreServiceAccountKey(msg);
                    break;
                case 'store-backend-url':
                    await this.handleStoreBackendUrl(msg);
                    break;
                case 'resize-ui':
                    if (msg.height) {
                        figma.ui.resize(400, msg.height);
                    }
                    break;
                case 'get-settings':
                    await this.handleGetSettings();
                    break;
                case 'prompt-client-id':
                case 'prompt-access-token':
                    // These are handled by UI showing the settings panel
                    break;
                case 'close-plugin':
                    figma.closePlugin();
                    break;
                default:
                    console.warn('Unknown message type:', msg.type);
            }
        } catch (error) {
            console.error('🚨 Error in handleMessage:', error);
            console.error('Error stack:', error.stack);
            console.error('Message that caused error:', JSON.stringify(msg, null, 2));
            this.sendMessage({
                type: 'error',
                message: `Plugin error: ${error.message}`,
                error: error.stack
            });
        }
    }

    /**
     * Handle HTML generation request
     * @param {Object} msg - Message object
     */
    async handleGenerateHTML(msg) {
        if (this.isGenerating) {
            this.sendMessage({
                type: 'error',
                message: 'Generation already in progress'
            });
            return;
        }

        this.isGenerating = true;
        this.sendMessage({
            type: 'generation-started',
            message: 'Starting HTML generation...'
        });

        try {
            console.log('🔍 Step 1: Getting selected nodes...');
            // Get selected nodes
            const nodes = this.getSelectedNodes();
            console.log('✅ Selected nodes:', nodes.length);
            
            if (nodes.length === 0) {
                throw new Error('No nodes selected. Please select nodes to export.');
            }

            console.log('🔍 NODE SELECTION: Raw selected nodes:');
            nodes.forEach((node, index) => {
                console.log(`🔍 NODE SELECTION: Node ${index + 1}:`, {
                    id: node.id,
                    name: node.name,
                    type: node.type
                });
            });

            console.log('🔍 Step 2: Extracting node data...');
            // Extract node data
            const extractedNodes = this.extractNodeData(nodes);
            console.log('✅ Extracted nodes:', extractedNodes.length);
            
            console.log('🔍 EXTRACTED NODES: Processed node data:');
            extractedNodes.forEach((node, index) => {
                console.log(`🔍 EXTRACTED NODES: Node ${index + 1}:`, {
                    id: node.id,
                    name: node.name,
                    type: node.type
                });
            });
            
            console.log('🔍 Step 3: Processing HTML structure (Pass 1)...');
            // Pass 1: Generate HTML structure
            const pass1Result = await this.nodeStructurePass.process(extractedNodes);
            console.log('✅ Pass 1 complete, HTML length:', pass1Result.html.length);
            
            console.log('🔍 Step 4: Processing CSS styles (Pass 2)...');
            // Pass 2: Extract and generate CSS styles (use extracted node data for style data)
            const pass2Result = await this.nodeStylesPass.process(extractedNodes, pass1Result);
            console.log('✅ Pass 2 complete, CSS length:', pass2Result.css.length);
            
            console.log('🔍 Step 5: Wrapping in HTML document...');
            console.log('🔍 EXPORT FLOW: About to generate filename from extractedNodes...');
            // Generate filename based on selected node name
            const filename = this.generateIntelligentFilename(extractedNodes);
            console.log('🔍 EXPORT FLOW: Generated filename:', filename);
            // Use filename as title - they will always match
            const title = filename;
            console.log('🔍 EXPORT FLOW: Using filename as title:', title);
            // Combine structure and styles into complete HTML document
            const html = this.wrapInHTMLDocument(pass1Result.html, pass2Result.css, extractedNodes, false, title, msg.autoGenerateNavigation);
            console.log('✅ HTML document complete, total length:', html.length);
            
            console.log('🔍 Step 6: Detecting media files...');
            // Detect video files
            const videoFiles = this.detectVideoFiles(extractedNodes);
            console.log('✅ Video files detected:', videoFiles.length);
            
            // Detect image files
            const imageFiles = this.detectImageFiles(extractedNodes);
            console.log('✅ Image files detected:', imageFiles.length);
            
            if (videoFiles.length > 0) {
                this.sendMessage({
                    type: 'video-files-detected',
                    message: `Found ${videoFiles.length} video file(s)`,
                    videoFiles: videoFiles
                });
                console.log(`🎥 Video files detected: ${videoFiles.map(f => f.filename).join(', ')}`);
            } else {
                console.log('ℹ️ No video files detected in design');
            }
            
            if (imageFiles.length > 0) {
                this.sendMessage({
                    type: 'image-files-detected',
                    message: `Found ${imageFiles.length} image file(s)`,
                    imageFiles: imageFiles
                });
                console.log(`🖼️ Image files detected: ${imageFiles.map(f => f.filename).join(', ')}`);
            } else {
                console.log('ℹ️ No image files detected in design');
            }
            
            // Debug HTML content
            console.log('📄 HTML Content Debug:', {
                htmlLength: html.length,
                htmlPreview: html.substring(0, 200) + '...',
                videoFilesCount: videoFiles.length,
                imageFilesCount: imageFiles.length
            });
            
            // Export to file using the generated filename
            await this.exportToFile(html, filename, videoFiles, imageFiles);
            
            this.sendMessage({
                type: 'generation-complete',
                message: 'HTML generation complete!',
                metadata: {
                    nodeCount: extractedNodes.length,
                    filename: filename,
                    pass1Metadata: pass1Result.metadata,
                    pass2Metadata: pass2Result.metadata
                }
            });

        } catch (error) {
            this.sendMessage({
                type: 'generation-error',
                message: error.message
            });
        } finally {
            this.isGenerating = false;
        }
    }

    /**
     * Handle rules generation request
     * @param {Object} msg - Message object
     */
    async handleGenerateRules(msg) {
        if (this.isGenerating) {
            this.sendMessage({
                type: 'rules-error',
                message: 'Generation already in progress'
            });
            return;
        }

        this.isGenerating = true;

        try {
            console.log('🎯 Starting rules generation...');
            
            // Get selected nodes
            const nodes = this.getSelectedNodes();
            
            if (nodes.length === 0) {
                throw new Error('No nodes selected. Please select nodes to export.');
            }

            // Extract node data
            const extractedNodes = this.extractNodeData(nodes);
            
            // Generate filename
            const htmlFilename = this.generateIntelligentFilename(extractedNodes);
            
            // Pass 1: Generate HTML structure (needed for metadata)
            const pass1Result = await this.nodeStructurePass.process(extractedNodes);
            
            // Pass 4: Generate rules
            console.log('🎯 Generating event rules (Pass 4)...');
            const pass4Result = await this.ruleGenerationPass.process(extractedNodes, pass1Result, htmlFilename);
            console.log('✅ Pass 4 complete, rules generated:', pass4Result.metadata.ruleCount);
            
            // Create filename for rules JSON - always use "rules.json"
            const rulesFilename = 'rules.json';
            
            // Send rules back to UI
            this.sendMessage({
                type: 'rules-generated',
                message: `Generated ${pass4Result.metadata.ruleCount} rules`,
                rulesJson: JSON.stringify(pass4Result.ruleSet, null, 2),
                filename: rulesFilename,
                metadata: {
                    nodeCount: extractedNodes.length,
                    ruleCount: pass4Result.metadata.ruleCount,
                    componentSetCount: pass4Result.metadata.componentSetCount
                }
            });

        } catch (error) {
            console.error('🚨 Error generating rules:', error);
            this.sendMessage({
                type: 'rules-error',
                message: error.message
            });
        } finally {
            this.isGenerating = false;
        }
    }

    /**
     * Get selected nodes from Figma
     * @returns {Array} Selected nodes
     */
    getSelectedNodes() {
        const selection = figma.currentPage.selection;
        return selection;
    }

    /**
     * Extract node data from Figma nodes
     * @param {Array} nodes - Figma nodes
     * @returns {Array} Extracted node data
     */
    extractNodeData(nodes) {
        const extractedNodes = [];
        const processedNodes = new Set();
        
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            const nodeData = this.extractSingleNode(node, null, processedNodes);
            if (nodeData) {
                extractedNodes.push(nodeData);
            }
        }
        
        return extractedNodes;
    }

    /**
     * Extract transition data from reactions
     * @param {Array} reactions - Array of Figma reactions
     * @returns {Object|null} Transition data or null
     */
    extractTransitionFromReactions(reactions) {
        if (!reactions || !Array.isArray(reactions)) {
            return null;
        }
        
        // Find the first reaction with a transition
        for (let i = 0; i < reactions.length; i++) {
            const reaction = reactions[i];
            if (reaction.action && reaction.action.transition) {
                return reaction.action.transition;
            }
        }
        return null;
    }

    /**
     * Extract data from a single node
     * @param {Object} node - Figma node
     * @param {Object} parent - Parent node (if any)
     * @param {Set} processedNodes - Set of processed node IDs
     * @param {number} depth - Current traversal depth
     * @returns {Object} Extracted node data
     */
    extractSingleNode(node, parent = null, processedNodes = new Set(), depth = 0) {
        try {
            if (!node || processedNodes.has(node.id)) {
                return null;
            }

            processedNodes.add(node.id);

            // Safely extract basic properties with Symbol handling
            const nodeData = {
                id: this.safeStringConversion(node.id),
                name: this.safeStringConversion(node.name) || 'Unnamed',
                type: this.safeStringConversion(node.type) || 'UNKNOWN',
            visible: node.visible !== false,
            children: [],
            parent: parent,
            
            // Essential properties for all nodes
            width: node.width,
            height: node.height,
            x: node.x,
            y: node.y,
            rotation: node.rotation,
            opacity: node.opacity,
            blendMode: node.blendMode,
            
            // Additional positioning properties
            relativeTransform: node.relativeTransform,
            absoluteTransform: node.absoluteTransform,
            absoluteBoundingBox: node.absoluteBoundingBox,
            absoluteRenderBounds: node.absoluteRenderBounds,
            constraints: node.constraints,
            layoutPositioning: node.layoutPositioning,
            layoutGrow: node.layoutGrow,
            layoutAlign: node.layoutAlign,
            
            // Layer ordering
            zIndex: node.zIndex,
            
            // Vector-specific properties
            fills: node.fills,
            strokes: node.strokes,
            effects: node.effects,
            cornerRadius: node.cornerRadius,
            
            // Stroke properties
            strokeWeight: node.strokeWeight,
            strokeAlign: node.strokeAlign,
            individualStrokes: node.individualStrokes,
            strokeTopWeight: node.strokeTopWeight,
            strokeRightWeight: node.strokeRightWeight,
            strokeBottomWeight: node.strokeBottomWeight,
            strokeLeftWeight: node.strokeLeftWeight,
            strokeTopColor: node.strokeTopColor,
            strokeRightColor: node.strokeRightColor,
            strokeBottomColor: node.strokeBottomColor,
            strokeLeftColor: node.strokeLeftColor,
            topLeftRadius: node.topLeftRadius,
            topRightRadius: node.topRightRadius,
            bottomLeftRadius: node.bottomLeftRadius,
            bottomRightRadius: node.bottomRightRadius,
            
            // Vector data properties
            vectorNetwork: node.vectorNetwork,
            vectorPaths: node.vectorPaths,
            fillGeometry: node.fillGeometry,
            strokeGeometry: node.strokeGeometry,
            arcData: node.arcData,
            
            // Layout properties
            layoutMode: node.layoutMode,
            primaryAxisAlignItems: node.primaryAxisAlignItems,
            counterAxisAlignItems: node.counterAxisAlignItems,
            paddingLeft: node.paddingLeft,
            paddingRight: node.paddingRight,
            paddingTop: node.paddingTop,
            paddingBottom: node.paddingBottom,
            itemSpacing: node.itemSpacing,
            overflow: node.overflow,
            clipsContent: node.clipsContent, // Fixed: use clipsContent (with 's')
            
            // Typography properties (for TEXT nodes)
            characters: node.characters,
            fontSize: node.fontSize,
            fontName: node.fontName,
            fontWeight: node.fontWeight,
            textDecoration: node.textDecoration,
            textDecorationStyle: node.textDecorationStyle,
            leadingTrim: node.leadingTrim,
            textAutoResize: node.textAutoResize,
            textDecorationColor: node.textDecorationColor,
            textAlignHorizontal: node.textAlignHorizontal,
            textAlignVertical: node.textAlignVertical,
            lineHeight: node.lineHeight,
            letterSpacing: node.letterSpacing,
            paragraphSpacing: node.paragraphSpacing,
            paragraphIndent: node.paragraphIndent,
            textCase: node.textCase,
            
            // Variant properties for component sets and components (using new API)
            variantProperties: node.componentProperties || {},
            
            // Reactions for interactive elements (preserve keyCodes array)
            reactions: node.reactions ? node.reactions.map(reaction => {
                // Create a new trigger object to avoid read-only property issues
                let newTrigger = null;
                if (reaction.trigger) {
                    newTrigger = {
                        type: reaction.trigger.type,
                        device: reaction.trigger.device,
                        keyCodes: reaction.trigger.keyCodes || [],
                        gamepadButton: reaction.trigger.gamepadButton
                    };
                }
                
                return {
                    id: reaction.id,
                    name: reaction.name,
                    trigger: newTrigger,
                    action: reaction.action,
                    transition: reaction.transition
                };
            }) : [],
            
            // Extract transition data from reactions
            transition: (() => {
                const transition = this.extractTransitionFromReactions(node.reactions);
                return transition;
            })()
        };



        // Handle INSTANCE nodes - keep as INSTANCE and add component set as child
        if (node.type === 'INSTANCE') {
            const indent = '  '.repeat(depth);
            
            // Get the main component from the instance
            const mainComponent = node.mainComponent;
            if (mainComponent) {
                
                // If the main component is a COMPONENT, get its parent COMPONENT_SET
                if (mainComponent.type === 'COMPONENT') {
                    const componentSet = mainComponent.parent;
                    if (componentSet && componentSet.type === 'COMPONENT_SET') {
                        
                        // Keep the instance as-is (don't change type, id, name)
                        // The instance will get its own properties (width, height, positioning, etc.)
                        
                        
                        
                        
                        // Create component set data as a child of the instance
                        const componentSetData = {
                            id: componentSet.id,
                            name: componentSet.name,
                            type: 'COMPONENT_SET',
                            visible: componentSet.visible !== false,
                            children: [],
                            parent: nodeData,
                            
                            // Component set inherits layout properties from parent instance
                            // Component sets are just organizational containers in Figma
                            width: nodeData.width,
                            height: nodeData.height,
                            // COMPONENT_SET should be positioned at origin relative to INSTANCE
                            x: 0,
                            y: 0,
                            rotation: nodeData.rotation,
                            opacity: nodeData.opacity,
                            blendMode: nodeData.blendMode,
                            
                            // Additional positioning properties
                            relativeTransform: componentSet.relativeTransform,
                            absoluteTransform: componentSet.absoluteTransform,
                            absoluteBoundingBox: componentSet.absoluteBoundingBox,
                            absoluteRenderBounds: componentSet.absoluteRenderBounds,
                            constraints: componentSet.constraints,
                            layoutPositioning: componentSet.layoutPositioning,
                            layoutGrow: componentSet.layoutGrow,
                            layoutAlign: componentSet.layoutAlign,
                            
                            // Layer ordering
                            zIndex: componentSet.zIndex,
                            
                            // Vector-specific properties
                            fills: componentSet.fills,
                            strokes: componentSet.strokes,
                            effects: componentSet.effects,
                            cornerRadius: componentSet.cornerRadius,
                            
                            // Stroke properties
                            strokeWeight: componentSet.strokeWeight,
                            strokeAlign: componentSet.strokeAlign,
                            individualStrokes: componentSet.individualStrokes,
                            strokeTopWeight: componentSet.strokeTopWeight,
                            strokeRightWeight: componentSet.strokeRightWeight,
                            strokeBottomWeight: componentSet.strokeBottomWeight,
                            strokeLeftWeight: componentSet.strokeLeftWeight,
                            strokeTopColor: componentSet.strokeTopColor,
                            strokeRightColor: componentSet.strokeRightColor,
                            strokeBottomColor: componentSet.strokeBottomColor,
                            strokeLeftColor: componentSet.strokeLeftColor,
                            topLeftRadius: componentSet.topLeftRadius,
                            topRightRadius: componentSet.topRightRadius,
                            bottomLeftRadius: componentSet.bottomLeftRadius,
                            bottomRightRadius: componentSet.bottomRightRadius,
                            
                            // Vector data properties
                            vectorNetwork: componentSet.vectorNetwork,
                            vectorPaths: componentSet.vectorPaths,
                            fillGeometry: componentSet.fillGeometry,
                            strokeGeometry: componentSet.strokeGeometry,
                            
                            // Layout properties - inherit from parent instance
                            layoutMode: nodeData.layoutMode,
                            primaryAxisAlignItems: nodeData.primaryAxisAlignItems,
                            counterAxisAlignItems: nodeData.counterAxisAlignItems,
                            primaryAxisSizingMode: nodeData.primaryAxisSizingMode,
                            counterAxisSizingMode: nodeData.counterAxisSizingMode,
                            layoutSizingHorizontal: nodeData.layoutSizingHorizontal,
                            layoutSizingVertical: nodeData.layoutSizingVertical,
                            itemSpacing: nodeData.itemSpacing,
                            paddingLeft: nodeData.paddingLeft,
                            paddingRight: nodeData.paddingRight,
                            paddingTop: nodeData.paddingTop,
                            paddingBottom: nodeData.paddingBottom,
                            
                            // Overflow and clipping
                            overflow: componentSet.overflow,
                            clipsContent: componentSet.clipsContent,
                            
                            // Typography (for TEXT nodes)
                            fontSize: componentSet.fontSize,
                            fontName: componentSet.fontName,
                            fontWeight: componentSet.fontWeight,
                            fontStyle: componentSet.fontStyle,
                            textDecoration: componentSet.textDecoration,
                            leadingTrim: componentSet.leadingTrim,
                            textCase: componentSet.textCase,
                            letterSpacing: componentSet.letterSpacing,
                            lineHeight: componentSet.lineHeight,
                            paragraphSpacing: componentSet.paragraphSpacing,
                            wordSpacing: componentSet.wordSpacing,
                            textIndent: componentSet.textIndent,
                            whiteSpace: componentSet.whiteSpace,
                            textOverflow: componentSet.textOverflow,
                            textShadow: componentSet.textShadow,
                            textStroke: componentSet.textStroke,
                            textAlignHorizontal: componentSet.textAlignHorizontal,
                            textAlignVertical: componentSet.textAlignVertical,
                            textAutoResize: componentSet.textAutoResize,
                            textStyleId: componentSet.textStyleId,
                            characters: componentSet.characters
                        };
                        
                        // Process the component set's children (the actual component variants)
                        if (componentSet.children && Array.isArray(componentSet.children)) {
                            for (let i = 0; i < componentSet.children.length; i++) {
                                const variant = componentSet.children[i];
                                
                                
                                
                                
                                // Create a proper COMPONENT element for this variant
                                const variantData = {
                                    id: variant.id,
                                    name: variant.name || 'Unnamed Variant',
                                    type: 'COMPONENT',
                                    visible: variant.visible !== false,
                                    children: [],
                                    parent: componentSetData,
                                    // Extract reactions from the variant
                                    reactions: variant.reactions || [],
                                    
                                    // Extract transition data from reactions
                                    transition: (() => {
                                        const transition = this.extractTransitionFromReactions(variant.reactions);
                                        return transition;
                                    })(),
                                    
                                    // Copy layout properties from the original variant
                                    width: variant.width,
                                    height: variant.height,
                                    // Variants should be positioned at origin relative to COMPONENT_SET
                                    x: 0,
                                    y: 0,
                                    rotation: variant.rotation,
                                    opacity: variant.opacity,
                                    blendMode: variant.blendMode,
                                    
                                    // Additional positioning properties
                                    relativeTransform: variant.relativeTransform,
                                    absoluteTransform: variant.absoluteTransform,
                                    absoluteBoundingBox: variant.absoluteBoundingBox,
                                    absoluteRenderBounds: variant.absoluteRenderBounds,
                                    constraints: variant.constraints,
                                    layoutPositioning: variant.layoutPositioning,
                                    layoutGrow: variant.layoutGrow,
                                    layoutAlign: variant.layoutAlign,
                                    
                                    // Layer ordering
                                    zIndex: variant.zIndex,
                                    
                                    // Vector-specific properties
                                    fills: variant.fills,
                                    strokes: variant.strokes,
                                    effects: variant.effects,
                                    cornerRadius: variant.cornerRadius,
                                    
                                    // Stroke properties
                                    strokeWeight: variant.strokeWeight,
                                    strokeAlign: variant.strokeAlign,
                                    individualStrokes: variant.individualStrokes,
                                    strokeTopWeight: variant.strokeTopWeight,
                                    strokeRightWeight: variant.strokeRightWeight,
                                    strokeBottomWeight: variant.strokeBottomWeight,
                                    strokeLeftWeight: variant.strokeLeftWeight,
                                    strokeTopColor: variant.strokeTopColor,
                                    strokeRightColor: variant.strokeRightColor,
                                    strokeBottomColor: variant.strokeBottomColor,
                                    strokeLeftColor: variant.strokeLeftColor,
                                    topLeftRadius: variant.topLeftRadius,
                                    topRightRadius: variant.topRightRadius,
                                    bottomLeftRadius: variant.bottomLeftRadius,
                                    bottomRightRadius: variant.bottomRightRadius,
                                    
                                    // Vector data properties
                                    vectorNetwork: variant.vectorNetwork,
                                    vectorPaths: variant.vectorPaths,
                                    fillGeometry: variant.fillGeometry,
                                    strokeGeometry: variant.strokeGeometry,
                                    
                                    // Layout properties
                                    layoutMode: variant.layoutMode,
                                    primaryAxisAlignItems: variant.primaryAxisAlignItems,
                                    counterAxisAlignItems: variant.counterAxisAlignItems,
                                    primaryAxisSizingMode: variant.primaryAxisSizingMode,
                                    counterAxisSizingMode: variant.counterAxisSizingMode,
                                    layoutSizingHorizontal: variant.layoutSizingHorizontal,
                                    layoutSizingVertical: variant.layoutSizingVertical,
                                    itemSpacing: variant.itemSpacing,
                                    paddingLeft: variant.paddingLeft,
                                    paddingRight: variant.paddingRight,
                                    paddingTop: variant.paddingTop,
                                    paddingBottom: variant.paddingBottom,
                                    
                                    // Overflow and clipping
                                    overflow: variant.overflow,
                                    clipsContent: variant.clipsContent,
                                    
                                    // Typography (for TEXT nodes)
                                    fontSize: variant.fontSize,
                                    fontName: variant.fontName,
                                    fontWeight: variant.fontWeight,
                                    fontStyle: variant.fontStyle,
                                    textDecoration: variant.textDecoration,
                                    leadingTrim: variant.leadingTrim,
                                    textCase: variant.textCase,
                                    letterSpacing: variant.letterSpacing,
                                    lineHeight: variant.lineHeight,
                                    paragraphSpacing: variant.paragraphSpacing,
                                    wordSpacing: variant.wordSpacing,
                                    textIndent: variant.textIndent,
                                    whiteSpace: variant.whiteSpace,
                                    textOverflow: variant.textOverflow,
                                    textShadow: variant.textShadow,
                                    textStroke: variant.textStroke,
                                    textAlignHorizontal: variant.textAlignHorizontal,
                                    textAlignVertical: variant.textAlignVertical,
                                    textAutoResize: variant.textAutoResize,
                                    textStyleId: variant.textStyleId,
                                    characters: variant.characters
                                };
                                
                                // Process the variant's children with nested instance support
                                this.processNodeChildren(variant, variantData, processedNodes, depth + 1);
                                
                                // Add the variant as a child of the component set
                                componentSetData.children.push(variantData);
                            }
                        }
                        
                        // Add the component set as a child of the instance
                        nodeData.children.push(componentSetData);
                    } else {
                        // If no component set, process the main component directly
                        nodeData.type = 'COMPONENT';
                        nodeData.id = mainComponent.id;
                        nodeData.name = mainComponent.name;
                        this.processNodeChildren(mainComponent, nodeData, processedNodes, depth + 1);
                    }
                }
            } else {
            }
        } else {
            // Process children for non-instance nodes
            this.processNodeChildren(node, nodeData, processedNodes, depth);
        }

        return nodeData;
        } catch (error) {
            console.error(`🚨 Error extracting node data for node:`, {
                nodeId: this.safeStringConversion(node && node.id),
                nodeName: this.safeStringConversion(node && node.name),
                nodeType: this.safeStringConversion(node && node.type),
                error: error.message,
                stack: error.stack
            });
            
            // Return a minimal node data object to prevent complete failure
            return {
                id: this.safeStringConversion(node && node.id) || 'error-node',
                name: this.safeStringConversion(node && node.name) || 'Error Node',
                type: this.safeStringConversion(node && node.type) || 'UNKNOWN',
                visible: false,
                children: [],
                parent: parent,
                error: error.message
            };
        }
    }

    /**
     * Process node children with support for nested instances
     * @param {Object} node - Figma node
     * @param {Object} parentData - Parent node data
     * @param {Set} processedNodes - Set of processed node IDs
     * @param {number} depth - Current traversal depth
     */
    processNodeChildren(node, parentData, processedNodes, depth = 0) {
        if (node.children && Array.isArray(node.children)) {
            for (let i = 0; i < node.children.length; i++) {
                const child = node.children[i];
                
                // Check if this child is an instance that needs special handling
                if (child.type === 'INSTANCE') {
                    const indent = '  '.repeat(depth);
                    
                    // Process the nested instance recursively - this should expand it to component set
                    const childData = this.extractSingleNode(child, parentData, processedNodes, depth + 1);
                    if (childData) {
                        parentData.children.push(childData);
                    } else {
                    }
                } else {
                    // Process regular children
                    const childData = this.extractSingleNode(child, parentData, processedNodes, depth);
                    if (childData) {
                        parentData.children.push(childData);
                    }
                }
            }
        }
    }

    /**
     * Generate an intelligent filename based on the extracted nodes
     * @param {Array} extractedNodes - Extracted node data
     * @returns {string} Generated filename
     */
    generateIntelligentFilename(extractedNodes) {
        console.log('🔍 FILENAME GENERATION: Starting filename generation...');
        console.log('🔍 FILENAME GENERATION: extractedNodes:', extractedNodes);
        console.log('🔍 FILENAME GENERATION: Number of nodes:', extractedNodes ? extractedNodes.length : 0);
        
        if (!extractedNodes || extractedNodes.length === 0) {
            console.log('🔍 FILENAME GENERATION: No nodes found, using default filename');
            return 'figma-export.html';
        }

        // Use the first node name directly as the filename
        const firstNode = extractedNodes[0];
        console.log('🔍 FILENAME GENERATION: First node:', firstNode);
        console.log('🔍 FILENAME GENERATION: First node name:', firstNode.name);
        
        let nodeName = firstNode.name || 'figma-export';
        console.log('🔍 FILENAME GENERATION: Initial node name:', nodeName);
        
        // Clean up the name for use as filename (remove special characters, replace spaces)
        const originalName = nodeName;
        nodeName = nodeName
            .replace(/[^\w\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-')      // Replace spaces with hyphens
            .substring(0, 50);         // Limit length
        
        console.log('🔍 FILENAME GENERATION: Name after cleanup:', nodeName);
        console.log('🔍 FILENAME GENERATION: Original name:', originalName);
        
        // Add node count if multiple nodes
        if (extractedNodes.length > 1) {
            const nodeCountSuffix = `-${extractedNodes.length}-nodes`;
            console.log('🔍 FILENAME GENERATION: Multiple nodes detected, adding suffix:', nodeCountSuffix);
            nodeName += nodeCountSuffix;
        }
        
        const finalFilename = `${nodeName}.html`;
        console.log('🔍 FILENAME GENERATION: Final filename:', finalFilename);
        
        return finalFilename;
    }

    /**
     * Generate a dynamic title based on filename and extracted nodes
     * @param {string} filename - The export filename
     * @param {Array} extractedNodes - Extracted node data
     * @returns {string} Generated title
     */
    generateTitleFromFilename(filename, extractedNodes) {
        // Always use filename as title - no fallback to node data
        // This ensures title matches the actual filename
        let title = filename;
        
        // Only fallback to default if filename is completely empty
        if (!title || title.length === 0) {
            return 'Figma Export';
        }
        
        return title;
    }

    /**
     * Generate a dynamic title based on extracted nodes
     * @param {Array} extractedNodes - Extracted node data
     * @returns {string} Generated title
     */
    generateTitle(extractedNodes) {
        if (!extractedNodes || extractedNodes.length === 0) {
            return 'Figma Structure with Styles';
        }

        // Get the first node name as the base title
        const firstNode = extractedNodes[0];
        let baseTitle = firstNode.name || 'Figma Export';
        
        // Clean up the title (remove special characters, limit length)
        baseTitle = baseTitle.replace(/[^\w\s-]/g, ' ').trim();
        if (baseTitle.length > 50) {
            baseTitle = baseTitle.substring(0, 47) + '...';
        }
        
        // Add node count if multiple nodes
        if (extractedNodes.length > 1) {
            baseTitle += ` (${extractedNodes.length} elements)`;
        }
        
        return baseTitle;
    }

    /**
     * Wrap the pass-generated HTML in a complete HTML document
     * @param {string} structureHTML - HTML structure from pass1
     * @param {string} generatedCSS - CSS styles from pass2
     * @param {Array} extractedNodes - Extracted node data
     * @param {boolean} debugMode - Whether to include debug styles
     * @param {string} title - Custom title for the HTML document
     * @returns {string} Complete HTML document
     */
    wrapInHTMLDocument(structureHTML, generatedCSS = '', extractedNodes = null, debugMode = false, title = null, autoGenerateNavigation = false) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        /* Base styles */
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #000000; }
        .figma-container { position: absolute; top: 0; left: 0; }
        
        /* Ensure image frames have no padding or borders */
        [data-image-frame="true"] { padding: 0 !important; border: none !important; background: none !important; }
        
        /* Ensure SVG elements have no borders */
        svg { border: none !important; }
        
        /* Variant trigger styles */
        [data-variant-trigger] {
            cursor: pointer;
        }
        
        ${debugMode ? `/* Debug styles for structure visualization */
        [data-figma-type] { margin: 2px; min-height: 20px; }
        [data-figma-type="TEXT"] { border: 1px solid #007bff; background: #e7f3ff; padding: 4px 8px; }
        [data-figma-type="FRAME"] { border: 1px solid #28a745; background: #e8f5e8; }
        [data-figma-type="COMPONENT"] { border: 1px solid #ffc107; background: #fff8e1; position: relative; }
        [data-figma-type="COMPONENT"]::before { content: "COMPONENT"; position: absolute; top: -12px; left: 0; font-size: 10px; background: #ffc107; color: #000; padding: 2px 4px; }
        [data-figma-type="INSTANCE"] { border: 2px solid #dc3545; background: #ffeaea; position: relative; }
        [data-figma-type="INSTANCE"]::before { content: "INSTANCE"; position: absolute; top: -12px; left: 0; font-size: 10px; background: #dc3545; color: white; padding: 2px 4px; }
        [data-figma-type="COMPONENT_SET"] { border: 2px solid #6f42c1; background: #f3e5f5; position: relative; }
        [data-figma-type="COMPONENT_SET"]::before { content: "COMPONENT_SET"; position: absolute; top: -12px; left: 0; font-size: 10px; background: #6f42c1; color: white; padding: 2px 4px; }
        [data-figma-type="VECTOR"] { border: 1px solid #17a2b8; background: none; }
        [data-figma-type="ELLIPSE"] { border: 1px solid #17a2b8; background: none; }
        
        ` : ''}
        /* Generated styles from Figma */
        ${generatedCSS}
    </style>
</head>
<body>
    <div class="figma-container">
${structureHTML}
    </div>
    
    <!-- Lottie Animation Library -->
    <script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"></script>
    <script src="https://unpkg.com/lottie-web@latest/build/player/lottie.min.js"></script>
    
    <script>
        ${this.generateVariantSwitcherScript(autoGenerateNavigation)}
        
        // Lottie Animation System
        class LottieManager {
            constructor() {
                this.loadedAnimations = new Map();
                this.initializeLottieAnimations();
            }
            
            initializeLottieAnimations() {
                // Find all Lottie containers
                const lottieContainers = document.querySelectorAll('[data-lottie-frame="true"]');
                lottieContainers.forEach(container => {
                    this.loadLottieAnimation(container);
                });
            }
            
            loadLottieAnimation(container) {
                const filename = container.getAttribute('data-lottie-filename');
                if (!filename) return;
                
                // Use standard lottie folder structure
                const sourcePaths = [
                    \`lottie/\${filename}\`
                ];
                
                this.tryLoadLottieFromPaths(container, sourcePaths);
            }
            
            async tryLoadLottieFromPaths(container, sourcePaths) {
                for (const sourcePath of sourcePaths) {
                    try {
                        const response = await fetch(sourcePath);
                        if (response.ok) {
                            const animationData = await response.json();
                            this.renderLottieAnimation(container, animationData);
                            return;
                        }
                    } catch (error) {
                        console.warn(\`Failed to load Lottie from \${sourcePath}:\`, error);
                    }
                }
                
                // If all paths fail, show error message
                this.showLottieError(container);
            }
            
            renderLottieAnimation(container, animationData) {
                const lottieElement = container.querySelector('[id^="lottie-"]');
                if (!lottieElement) return;
                
                try {
                    // Clear loading message
                    lottieElement.innerHTML = '';
                    
                    // Create Lottie animation
                    const animation = lottie.loadAnimation({
                        container: lottieElement,
                        renderer: 'svg',
                        loop: true,
                        autoplay: true,
                        animationData: animationData
                    });
                    
                    // Store animation reference
                    this.loadedAnimations.set(lottieElement.id, animation);
                    
                    // Handle animation events
                    animation.addEventListener('complete', () => {
                        console.log(\`Lottie animation \${lottieElement.id} completed\`);
                    });
                    
                    animation.addEventListener('loopComplete', () => {
                        console.log(\`Lottie animation \${lottieElement.id} loop completed\`);
                    });
                    
                } catch (error) {
                    console.error(\`Error rendering Lottie animation:\`, error);
                    this.showLottieError(container);
                }
            }
            
            showLottieError(container) {
                const lottieElement = container.querySelector('[id^="lottie-"]');
                if (lottieElement) {
                    lottieElement.innerHTML = \`
                        <div style="padding: 20px; text-align: center; color: #ff6b6b; background: #ffe0e0; border-radius: 8px;">
                            <p>❌ Lottie animation failed to load</p>
                            <p style="font-size: 12px; margin-top: 8px;">Please check the file path and format</p>
                        </div>
                    \`;
                }
            }
            
            // Public methods for controlling animations
            playAnimation(elementId) {
                const animation = this.loadedAnimations.get(elementId);
                if (animation) {
                    animation.play();
                }
            }
            
            pauseAnimation(elementId) {
                const animation = this.loadedAnimations.get(elementId);
                if (animation) {
                    animation.pause();
                }
            }
            
            stopAnimation(elementId) {
                const animation = this.loadedAnimations.get(elementId);
                if (animation) {
                    animation.stop();
                }
            }
        }
        
        // Initialize Lottie Manager
        let lottieManager = null;
        if (typeof lottie !== 'undefined') {
            lottieManager = new LottieManager();
            window.lottieManager = lottieManager;
        } else {
            console.warn('Lottie library not loaded. Lottie animations will not work.');
        }
        
        // Initialize variant switcher with extracted nodes data
        const extractedNodesData = ${this.serializeNodesForJS(extractedNodes || {})};
        if (window.variantSwitcher && extractedNodesData) {
            window.variantSwitcher.initialize(extractedNodesData);
        }
    </script>
</body>
</html>`;
    }

    /**
     * Generate the variant switcher script
     * @param {boolean} autoGenerateNavigation - Whether to add automatic keyboard navigation
     * @returns {string} JavaScript code for variant switching
     */
    generateVariantSwitcherScript(autoGenerateNavigation = false) {
        return `
// Variant Switching System
class VariantSwitcher {
    constructor() {
        this.currentVariants = new Map();
        this.activeEventHandlers = new Map();
        this.componentSets = new Map();
        this.activeTimeouts = new Map(); // Track active timeout timers
        this.initialized = false;
        this.autoNavigation = ${autoGenerateNavigation};
    }

    initialize(extractedNodes) {
        this.extractedNodesData = extractedNodes; // Store for later use
        this.findComponentSets(extractedNodes);
        this.setDefaultVariants();
        this.bindInitialEvents();
        
        // Add sequential keyboard navigation if enabled (HTML generation only)
        if (this.autoNavigation) {
            this.setupSequentialNavigation();
        }
        
        this.initialized = true;
    }

    findInstanceData(instanceId) {
        // This would need access to the original extracted nodes data
        // For now, we'll need to store this data in the VariantSwitcher
        if (this.extractedNodesData) {
            return this.findNodeById(this.extractedNodesData, instanceId);
        }
        return null;
    }

    findNodeById(nodes, targetId) {
        if (Array.isArray(nodes)) {
            for (const node of nodes) {
                const found = this.findNodeById(node, targetId);
                if (found) return found;
            }
        } else if (nodes && typeof nodes === 'object') {
            if (nodes.id === targetId) {
                return nodes;
            }
            if (nodes.children) {
                return this.findNodeById(nodes.children, targetId);
            }
        }
        return null;
    }

    findComponentSets(node, parentComponentSetId = null) {
        // Handle array of nodes (root level)
        if (Array.isArray(node)) {
            node.forEach(rootNode => {
                this.findComponentSets(rootNode, parentComponentSetId);
            });
            return;
        }

        // Handle single node
        if (!node || typeof node !== 'object') {
            return;
        }
        
        if (node.type === 'COMPONENT_SET') {
            const componentSetId = node.id;
            const variants = node.children || [];
            
            this.componentSets.set(componentSetId, {
                id: componentSetId,
                variants: variants,
                parentComponentSetId: parentComponentSetId,
                node: node
            });
            
        }

        if (node.children && Array.isArray(node.children)) {
            // For component sets, use the component set ID as the parent for its children
            // For other nodes, use the current parentComponentSetId
            const currentComponentSetId = node.type === 'COMPONENT_SET' ? node.id : parentComponentSetId;
            node.children.forEach(child => {
                this.findComponentSets(child, currentComponentSetId);
            });
        }
    }

    getDefaultVariant(componentSet) {
        // Look for the instance that contains this component set to get the current property values
        const instanceElement = document.querySelector('[data-figma-type="INSTANCE"] [data-figma-id="' + componentSet.id + '"]');
        if (instanceElement) {
            const instanceParent = instanceElement.closest('[data-figma-type="INSTANCE"]');
            const instanceId = instanceParent ? instanceParent.getAttribute('data-figma-id') : null;
            
            // Get the instance's component properties from the extracted data
            const instanceData = this.findInstanceData(instanceId);
            if (instanceData && instanceData.variantProperties) {
                const property1Value = instanceData.variantProperties['Property 1'];
                
                if (property1Value && property1Value.value) {
                    const targetValue = property1Value.value;
                    
                    // Find variant that matches the instance's current property value
                    const defaultVariant = componentSet.variants.find(variant => {
                        // Check if variant has the matching Property 1 value
                        if (variant.variantProperties && variant.variantProperties['Property 1']) {
                            const variantValue = variant.variantProperties['Property 1'].value;
                            return variantValue === targetValue;
                        }
                        
                        // Fallback: check variant name for the value
                        if (variant.name && variant.name.includes('Property 1=' + targetValue)) {
                            return true;
                        }
                        
                        return false;
                    });
                    
                    if (defaultVariant) {
                        return defaultVariant.id;
                    }
                }
            }
        }
        
        // Smart fallback: Look for countdown sequences (3→2→1) or other logical patterns
        const variants = componentSet.variants || [];
        if (variants.length > 0) {
            // Try to find a variant with the highest number in its name (for countdown sequences)
            const numericVariants = variants.filter(variant => {
                const match = variant.name && variant.name.match(/Property 1=(\d+)/);
                return match && !isNaN(parseInt(match[1]));
            });
            
            if (numericVariants.length > 0) {
                // Sort by numeric value in descending order (3, 2, 1) and take the first (highest)
                numericVariants.sort((a, b) => {
                    const aNum = parseInt(a.name.match(/Property 1=(\d+)/)[1]);
                    const bNum = parseInt(b.name.match(/Property 1=(\d+)/)[1]);
                    return bNum - aNum; // Descending order
                });
                
                const defaultVariant = numericVariants[0];
                return defaultVariant.id;
            }
        }
        
        return componentSet.variants[0] ? componentSet.variants[0].id : null;
    }

    setDefaultVariants() {
        this.componentSets.forEach((componentSet, componentSetId) => {
            const defaultVariantId = this.getDefaultVariant(componentSet);
            
            if (defaultVariantId) {
                this.currentVariants.set(componentSetId, defaultVariantId);
                this.showVariant(defaultVariantId);
                componentSet.variants.forEach(variant => {
                    if (variant.id !== defaultVariantId) {
                        this.hideVariant(variant.id);
                    }
                });
            }
        });
    }

    showVariant(variantId) {
        const element = document.querySelector('[data-figma-id="' + variantId + '"]');
        if (element) {
            element.style.display = 'block';
            element.setAttribute('data-variant-active', 'true');
        }
    }

    hideVariant(variantId) {
        const element = document.querySelector('[data-figma-id="' + variantId + '"]');
        if (element) {
            element.style.display = 'none';
            element.removeAttribute('data-variant-active');
        }
    }

    /**
     * Enhanced Smart Animate variant switching
     * @param {string} componentSetId - Component set ID
     * @param {string} targetVariantId - Target variant ID
     * @param {Object} transitionData - Transition data for the target variant
     */
    smartAnimateToVariant(componentSetId, targetVariantId, transitionData = null) {
        // Smart Animate variant switch

        const componentSet = this.componentSets.get(componentSetId);
        if (!componentSet) {
            console.warn('Component set not found: ' + componentSetId);
            return;
        }

        const currentVariantId = this.currentVariants.get(componentSetId);
        if (!currentVariantId) {
            // No current variant, just show the target
            this.showVariant(targetVariantId);
            this.currentVariants.set(componentSetId, targetVariantId);
            this.bindEventsForVariant(componentSetId, targetVariantId);
            return;
        }

        const currentVariant = componentSet.variants.find(v => v.id === currentVariantId);
        const targetVariant = componentSet.variants.find(v => v.id === targetVariantId);
        
        if (!currentVariant || !targetVariant) {
            console.warn('Current or target variant not found', { currentVariant, targetVariant });
            return;
        }

        // Found both variants for Smart Animate

        // Get the current and target variant elements
        const currentElement = document.querySelector('[data-figma-id="' + currentVariantId + '"]');
        const targetElement = document.querySelector('[data-figma-id="' + targetVariantId + '"]');
        
        if (!currentElement || !targetElement) {
            console.warn('Current or target variant element not found', { currentElement, targetElement });
            return;
        }

        // Map nodes between variants and calculate differences
        const nodeMappings = this.mapNodesBetweenVariants(currentVariant, targetVariant);
        
        console.log('🎬 Smart Animate: Node mappings found', {
            totalMappings: nodeMappings.length,
            mappings: nodeMappings.map(m => ({
                currentId: m.currentId,
                targetId: m.targetId,
                currentNodeType: m.currentNode.type,
                targetNodeType: m.targetNode.type,
                hasPosition: !!m.differences.position,
                hasSVGColor: !!m.differences.svgColor,
                hasFills: !!m.differences.fills,
                hasOpacity: !!m.differences.opacity,
                hasScale: !!m.differences.scale,
                hasRotation: !!m.differences.rotation
            }))
        });
        
        // Calculate max duration and apply Smart Animate transitions
        const maxDuration = this.getMaxTransitionDuration(nodeMappings, transitionData);
        console.log('🎬 Smart Animate: Animation duration', { maxDuration, transitionData });
        
        this.applySmartAnimateTransitions(nodeMappings, currentElement, targetElement, transitionData, maxDuration, componentSetId, targetVariantId, currentVariantId);
        
        // Animation completion handled in applySmartAnimateTransitions method
    }

    /**
     * Finalize Smart Animate by cleaning up and updating state
     * @param {string} componentSetId - Component set ID
     * @param {string} targetVariantId - Target variant ID
     * @param {string} currentVariantId - Current variant ID
     * @param {Array} nodeMappings - Array of node mappings
     * @param {Element} currentElement - Current variant element
     * @param {Element} targetElement - Target variant element
     */
    finalizeSmartAnimate(componentSetId, targetVariantId, currentVariantId, nodeMappings, currentElement, targetElement) {
        console.log('🎬 Smart Animate: Finalizing animation', {
            componentSetId,
            targetVariantId,
            currentVariantId,
            nodeMappingsCount: nodeMappings.length
        });
        
        // Reset transforms and transitions on all animated elements
        nodeMappings.forEach(mapping => {
            const currentMappedElement = document.querySelector('[data-figma-id="' + mapping.currentId + '"]');
            if (currentMappedElement) {
                console.log('🎬 Smart Animate: Resetting styles for element', { currentId: mapping.currentId, element: currentMappedElement });
                currentMappedElement.style.transform = ''; // Reset transform
                currentMappedElement.style.transition = ''; // Remove dynamic transition
                currentMappedElement.style.opacity = ''; // Reset opacity
                
                // Reset fill colors that were applied during animation
                currentMappedElement.style.backgroundColor = ''; // Reset background color
                currentMappedElement.style.color = ''; // Reset text color
                currentMappedElement.style.background = ''; // Reset background (for gradients)
                
                // Reset SVG color changes
                const svgElement = currentMappedElement.tagName === 'svg' ? currentMappedElement : currentMappedElement.querySelector('svg');
                if (svgElement) {
                    // Remove any background-color from SVG (should never have background-color)
                    svgElement.style.backgroundColor = '';
                    
                    // Reset fill color on ALL path elements
                    const pathElements = svgElement.querySelectorAll('path');
                    pathElements.forEach(pathElement => {
                        pathElement.style.fill = '';
                    });
                }
            }
        });
        
        // Reset opacity and transition on variant containers
        currentElement.style.opacity = '';
        currentElement.style.transition = '';
        targetElement.style.opacity = '';
        targetElement.style.transition = '';
        
        // Now hide the old variant and show the new one
        console.log('🎬 Smart Animate: Switching variants', { currentVariantId, targetVariantId });
        this.hideVariant(currentVariantId);
        this.showVariant(targetVariantId);
        
        this.currentVariants.set(componentSetId, targetVariantId);
        this.bindEventsForVariant(componentSetId, targetVariantId);
        console.log('🎬 Smart Animate: Animation complete', { componentSetId, targetVariantId });
    }

    /**
     * Map corresponding nodes between two variants
     * @param {Object} currentVariant - Current variant data
     * @param {Object} targetVariant - Target variant data
     * @returns {Array} Array of node mappings with differences
     */
    mapNodesBetweenVariants(currentVariant, targetVariant) {
        const mappings = [];
        
        // Create maps of nodes by ID and name for efficient lookup
        const currentNodes = this.flattenVariantNodes(currentVariant);
        const targetNodes = this.flattenVariantNodes(targetVariant);
        
        
        // Flatten nodes for comparison
        
        // Map nodes by ID and name for efficient lookup
        const targetNodesById = new Map();
        targetNodes.forEach(node => {
            if (node.id) {
                targetNodesById.set(node.id, node);
            }
        });
        
        const targetNodesByName = new Map();
        targetNodes.forEach(node => {
            if (node.name && node.type) {
                const key = String(node.name) + ':' + String(node.type);
                if (!targetNodesByName.has(key)) {
                    targetNodesByName.set(key, []);
                }
                targetNodesByName.get(key).push(node);
            }
        });
        
        // Find corresponding nodes and calculate differences
        currentNodes.forEach(currentNode => {
            let targetNode = null;
            
            // PRIORITY 1: Try to find by name and type first (most reliable for variants)
            if (currentNode.name && currentNode.type) {
                const key = currentNode.name + ':' + currentNode.type;
                const candidates = targetNodesByName.get(key);
                if (candidates && candidates.length > 0) {
                    targetNode = candidates[0];
                }
            }
            
            // FALLBACK: Try to find by ID (unlikely to work in variants but kept as backup)
            if (!targetNode && currentNode.id) {
                targetNode = targetNodesById.get(currentNode.id);
            }
            
            
            if (targetNode) {
                const differences = this.calculateNodeDifferences(currentNode, targetNode);
                
                
                if (differences.hasChanges) {
                    mappings.push({
                        currentId: currentNode.id,
                        targetId: targetNode.id,
                        currentNode: currentNode,
                        targetNode: targetNode,
                        differences: differences
                    });
                }
            }
        });
        
        // Return mappings with differences
        
        return mappings;
    }

    /**
     * Flatten variant nodes into a single array for easier processing
     * @param {Object} variant - Variant data
     * @returns {Array} Flattened array of nodes
     */
    flattenVariantNodes(variant) {
        const nodes = [];
        
        function traverse(node) {
            if (node && typeof node === 'object') {
                nodes.push(node);
                if (node.children && Array.isArray(node.children)) {
                    node.children.forEach(traverse);
                }
            }
        }
        
        traverse(variant);
        
        
        return nodes;
    }

    /**
     * Check if two fill arrays have differences
     * @param {Array} currentFills - Current fills array
     * @param {Array} targetFills - Target fills array
     * @returns {boolean} True if fills are different
     */
    hasFillDifferences(currentFills, targetFills) {
        // Handle null/undefined cases
        if (!currentFills && !targetFills) return false;
        if (!currentFills || !targetFills) return true;
        if (currentFills.length !== targetFills.length) return true;
        
        // Compare each fill
        for (let i = 0; i < currentFills.length; i++) {
            const currentFill = currentFills[i];
            const targetFill = targetFills[i];
            
            // Compare fill type
            if (currentFill.type !== targetFill.type) return true;
            
            // Compare solid fills
            if (currentFill.type === 'SOLID' && targetFill.type === 'SOLID') {
                if (JSON.stringify(currentFill.color) !== JSON.stringify(targetFill.color)) return true;
                if (currentFill.opacity !== targetFill.opacity) return true;
            }
            
            // Compare gradient fills (basic comparison)
            if ((currentFill.type === 'GRADIENT_LINEAR' || currentFill.type === 'GRADIENT_RADIAL') &&
                (targetFill.type === 'GRADIENT_LINEAR' || targetFill.type === 'GRADIENT_RADIAL')) {
                if (JSON.stringify(currentFill.gradientStops) !== JSON.stringify(targetFill.gradientStops)) return true;
                if (currentFill.opacity !== targetFill.opacity) return true;
            }
        }
        
        return false;
    }

    /**
     * Check if SVG color differences exist between two fill arrays
     * @param {Array} currentFills - Current fills array
     * @param {Array} targetFills - Target fills array
     * @returns {boolean} True if SVG color differences exist
     */
    hasSVGColorDifferences(currentFills, targetFills) {
        // For SVG color animation, we only care about solid color changes
        // Handle null/undefined cases
        if (!currentFills && !targetFills) return false;
        if (!currentFills || !targetFills) return true;
        if (currentFills.length !== targetFills.length) return true;
        
        // Compare each fill for solid color changes only
        for (let i = 0; i < currentFills.length; i++) {
            const currentFill = currentFills[i];
            const targetFill = targetFills[i];
            
            // Only compare solid fills for SVG color animation
            if (currentFill.type === 'SOLID' && targetFill.type === 'SOLID') {
                if (JSON.stringify(currentFill.color) !== JSON.stringify(targetFill.color)) return true;
                if (currentFill.opacity !== targetFill.opacity) return true;
            }
        }
        
        return false;
    }

    /**
     * Calculate differences between two nodes
     * @param {Object} currentNode - Current node data
     * @param {Object} targetNode - Target node data
     * @returns {Object} Differences object
     */
    calculateNodeDifferences(currentNode, targetNode) {
        const differences = {
            hasChanges: false,
            position: null,
            size: null,
            rotation: null,
            opacity: null,
            scale: null,
            fills: null,
            svgColor: null
        };
        
        // Position differences
        if (currentNode.x !== targetNode.x || currentNode.y !== targetNode.y) {
            differences.position = {
                x: (targetNode.x || 0) - (currentNode.x || 0),
                y: (targetNode.y || 0) - (currentNode.y || 0)
            };
            differences.hasChanges = true;
        }
        
        // Size differences - Scale detection enabled for SVG elements only
        const currentWidth = currentNode.width || 0;
        const currentHeight = currentNode.height || 0;
        const targetWidth = targetNode.width || 0;
        const targetHeight = targetNode.height || 0;
        
        // Only apply scale detection for elements that contain SVG graphics (VECTOR, ELLIPSE, etc.)
        const isSVGGraphicElement = currentNode.type === 'VECTOR' || currentNode.type === 'ELLIPSE' || currentNode.type === 'SVG';
        
        // For SVG graphic elements, check individual path/ellipse dimension differences
        let hasSVGGraphicSizeDifference = false;
        let svgGraphicScaleInfo = null;
        let individualGraphicScales = [];
        
        if (isSVGGraphicElement) {
            // Check if the current element exists in the DOM and has SVG graphics
            const currentElement = document.querySelector('[data-figma-id="' + currentNode.id + '"]');
            if (currentElement && (currentElement.tagName === 'svg' || currentElement.querySelector('svg'))) {
                const svgElement = currentElement.tagName === 'svg' ? currentElement : currentElement.querySelector('svg');
                
                // Check both paths and ellipses (and other SVG graphics)
                const paths = svgElement.querySelectorAll('path');
                const ellipses = svgElement.querySelectorAll('ellipse, circle');
                const allGraphics = [...paths, ...ellipses];
                
                // Check if the SVG container itself has dimension changes
                const svgWidth = parseFloat(svgElement.getAttribute('width')) || 0;
                const svgHeight = parseFloat(svgElement.getAttribute('height')) || 0;
                const targetSvgWidth = parseFloat(targetNode.width) || 0;
                const targetSvgHeight = parseFloat(targetNode.height) || 0;
                
                
                // Check if SVG container dimensions have changed
                if (svgWidth > 0 && svgHeight > 0 && targetSvgWidth > 0 && targetSvgHeight > 0) {
                    const scaleX = svgWidth > 0 ? targetSvgWidth / svgWidth : 1;
                    const scaleY = svgHeight > 0 ? targetSvgHeight / svgHeight : 1;
                    
                    // If the SVG container dimensions have changed significantly, apply scaling
                    if (Math.abs(scaleX - 1) > 0.01 || Math.abs(scaleY - 1) > 0.01) {
                        hasSVGGraphicSizeDifference = true;
                        individualGraphicScales.push({
                            graphicIndex: 0, // SVG container is the main graphic
                            graphicElement: svgElement,
                            graphicType: 'svg',
                            currentWidth: svgWidth,
                            currentHeight: svgHeight,
                            targetWidth: targetSvgWidth,
                            targetHeight: targetSvgHeight,
                            scaleX: scaleX,
                            scaleY: scaleY,
                            needsScaling: true
                        });
                        
                    }
                }
                
                if (allGraphics.length > 0) {
                    // Also check individual graphics for additional scaling needs
                    allGraphics.forEach((graphic, index) => {
                        try {
                            const graphicBBox = graphic.getBBox();
                            if (graphicBBox && graphicBBox.width > 0 && graphicBBox.height > 0) {
                                // For individual graphics, we might want to check for shape-specific changes
                                // (like arc changes in ellipses, path modifications, etc.)
                                // For now, we'll focus on the container-level scaling
                                console.log('🔍 Individual graphic info', {
                                    graphicIndex: index,
                                    graphicType: graphic.tagName,
                                    graphicWidth: graphicBBox.width,
                                    graphicHeight: graphicBBox.height,
                                    note: 'Container scaling will handle most cases'
                                });
                            }
                        } catch (e) {
                            // Skip this graphic if BBox calculation fails
                        }
                    });
                    
                    if (hasSVGGraphicSizeDifference) {
                        svgGraphicScaleInfo = {
                            totalGraphics: allGraphics.length,
                            scaledGraphics: individualGraphicScales.length,
                            individualScales: individualGraphicScales
                        };
                    }
                }
            }
        }
        
        
        // Skip container-level checks for SVG graphics - they never change
        // Only check individual graphic elements (paths, ellipses, etc.)
        if (isSVGGraphicElement && hasSVGGraphicSizeDifference) {
            // Handle individual SVG graphic scaling (paths, ellipses, etc.)
            if (individualGraphicScales.length > 0) {
                differences.graphicScales = individualGraphicScales;
                differences.hasChanges = true;
            }
        } else {
        }
        
        // Rotation differences
        if (currentNode.rotation !== targetNode.rotation) {
            differences.rotation = (targetNode.rotation || 0) - (currentNode.rotation || 0);
            differences.hasChanges = true;
        }
        
        // Opacity differences
        if (currentNode.opacity !== targetNode.opacity) {
            const currentOpacityValue = currentNode.opacity !== undefined ? currentNode.opacity : 1;
            const targetOpacityValue = targetNode.opacity !== undefined ? targetNode.opacity : 1;
            differences.opacity = targetOpacityValue - currentOpacityValue;
            differences.hasChanges = true;
        }
        
        // Fill differences
        if (this.hasFillDifferences(currentNode.fills, targetNode.fills)) {
            differences.fills = {
                current: currentNode.fills,
                target: targetNode.fills
            };
            differences.hasChanges = true;
        }
        
        // SVG color differences (for VECTOR nodes)
        if (currentNode.type === 'VECTOR' && targetNode.type === 'VECTOR') {
            if (this.hasSVGColorDifferences(currentNode.fills, targetNode.fills)) {
                differences.svgColor = {
                    current: currentNode.fills,
                    target: targetNode.fills
                };
                differences.hasChanges = true;
            }
        }
        
        return differences;
    }

    /**
     * Apply Smart Animate transitions to mapped nodes
     * @param {Array} nodeMappings - Array of node mappings with differences
     * @param {Element} currentElement - Current variant element
     * @param {Element} targetElement - Target variant element
     * @param {Object} transitionData - Transition data for the animation
     */
    applySmartAnimateTransitions(nodeMappings, currentElement, targetElement, transitionData, maxDuration, componentSetId, targetVariantId, currentVariantId) {
        console.log('🎬 Smart Animate: Applying transitions', {
            nodeMappingsCount: nodeMappings.length,
            maxDuration,
            transitionData
        });
        
        // Show target variant but make it invisible initially
        targetElement.style.display = 'block';
        targetElement.style.opacity = '0';
        console.log('🎬 Smart Animate: Target variant made invisible', { targetElement });
        
        // Apply transitions first, then transforms in the next frame
        nodeMappings.forEach((mapping, index) => {
            const currentMappedElement = document.querySelector('[data-figma-id="' + mapping.currentId + '"]');
            if (currentMappedElement) {
                // Check if this element will have SVG scaling applied (skip main animation if so)
                const hasSVGScaling = mapping.differences.graphicScales && mapping.differences.graphicScales.length > 0;
                
                console.log('🎬 Smart Animate: Processing mapping', {
                    index,
                    currentId: mapping.currentId,
                    targetId: mapping.targetId,
                    currentNodeType: mapping.currentNode.type,
                    differences: mapping.differences,
                    element: currentMappedElement
                });
                
                // Create animation variables for this mapping
                const animationName = 'smartAnimate_' + mapping.currentId.replace(/:/g, '_');
                const duration = transitionData && transitionData.duration ? transitionData.duration * 1000 : 1000;
                const easing = this.mapEasingToCSS(transitionData && transitionData.easing ? transitionData.easing : 'ease-in-out');
                
                // Try CSS animation approach instead of transitions
                const transform = this.generateTransformFromDifferences(mapping.differences);
                if (transform) {
                    console.log('🎬 Smart Animate: Transform generated', { transform, differences: mapping.differences });
                    
                    // Create keyframes animation
                    let keyframes = 
                        '@keyframes ' + animationName + ' {' +
                        '0% { transform: none; }' +
                        '100% { transform: ' + transform + '; }' +
                        '}';
                    
                    // Add SVG color animation if needed
                    if (mapping.differences.svgColor) {
                        const targetFills = mapping.differences.svgColor.target;
                        const primaryFill = targetFills.find(fill => fill.type === 'SOLID');
                        if (primaryFill) {
                            const color = primaryFill.color;
                            const opacity = primaryFill.opacity !== undefined ? primaryFill.opacity : 1;
                            
                            if (color && color.r !== undefined && color.g !== undefined && color.b !== undefined) {
                                const r = Math.round(color.r * 255);
                                const g = Math.round(color.g * 255);
                                const b = Math.round(color.b * 255);
                                const a = color.a !== undefined ? color.a * opacity : opacity;
                                const colorValue = 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
                                
                                keyframes = 
                                    '@keyframes ' + animationName + ' {' +
                                    '0% { transform: none; }' +
                                    '100% { transform: ' + transform + '; }' +
                                    '}' +
                                    '@keyframes ' + animationName + '_svg {' +
                                    '0% { fill: currentColor; }' +
                                    '100% { fill: ' + colorValue + '; }' +
                                    '}';
                            }
                        }
                    }
                    
                    // Add keyframes to document
                    const style = document.createElement('style');
                    style.textContent = keyframes;
                    document.head.appendChild(style);
                    
                    if (!hasSVGScaling) {
                        // Apply animation
                        const animationCSS = animationName + ' ' + duration + 'ms ' + easing + ' forwards';
                        currentMappedElement.style.setProperty('animation', animationCSS, 'important');
                        console.log('🎬 Smart Animate: Animation applied', {
                            element: currentMappedElement,
                            animationName,
                            animationCSS,
                            duration,
                            easing
                        });
                    } else {
                        console.log('🎬 Smart Animate: Skipping main animation (SVG scaling will handle it)', {
                            element: currentMappedElement,
                            animationName,
                            reason: 'SVG scaling animation will combine translate and scale'
                        });
                    }
                    
                    // Apply SVG color animation if needed
                    if (mapping.differences.svgColor) {
                        console.log('🎬 Smart Animate: Applying SVG color animation', { currentId: mapping.currentId });
                        const svgElement = currentMappedElement.tagName === 'svg' ? currentMappedElement : currentMappedElement.querySelector('svg');
                        if (svgElement) {
                            // Remove any background-color from SVG (should never have background-color)
                            svgElement.style.backgroundColor = '';
                            
                            // Apply animation to ALL path elements
                            const pathElements = svgElement.querySelectorAll('path');
                            console.log('🎬 Smart Animate: Found path elements', { pathCount: pathElements.length, svgElement });
                            pathElements.forEach((pathElement, pathIndex) => {
                                const svgAnimationCSS = animationName + '_svg ' + duration + 'ms ' + easing + ' forwards';
                                pathElement.style.setProperty('animation', svgAnimationCSS, 'important');
                                console.log('🎬 Smart Animate: SVG animation applied to path', { pathIndex, svgAnimationCSS, pathElement });
                            });
                        } else {
                            console.log('🎬 Smart Animate: No SVG element found for SVG color animation');
                        }
                    }
                    
                    
                    // Clean up keyframes after animation
                    setTimeout(() => {
                        document.head.removeChild(style);
                    }, duration + 100);
                }
                
                // Handle opacity changes (skip for SVG elements that will have scaling animations)
                if (mapping.differences.opacity !== null && !hasSVGScaling) {
                    const currentOpacity = parseFloat(currentMappedElement.style.opacity) || 1;
                    const newOpacity = Math.max(0, Math.min(1, currentOpacity + mapping.differences.opacity));
                    currentMappedElement.style.opacity = newOpacity;
                }
                
                // Handle fill changes
                if (mapping.differences.fills) {
                    console.log('🎬 Smart Animate: Applying fill animation', { currentId: mapping.currentId });
                    this.applyFillAnimation(currentMappedElement, mapping.differences.fills);
                }
                
                // Handle SVG color changes
                if (mapping.differences.svgColor) {
                    console.log('🎬 Smart Animate: Applying SVG color animation', { currentId: mapping.currentId });
                    this.applySVGColorAnimation(currentMappedElement, mapping.differences.svgColor);
                }
                
                // Handle individual SVG graphic scaling (paths, ellipses, etc.)
                if (mapping.differences.graphicScales && mapping.differences.graphicScales.length > 0) {
                    console.log('🎬 Smart Animate: Applying individual SVG graphic scaling', { 
                        currentId: mapping.currentId, 
                        graphicCount: mapping.differences.graphicScales.length 
                    });
                    this.applyIndividualGraphicScaling(currentMappedElement, mapping.differences.graphicScales, animationName, duration, easing, mapping);
                }
            }
        });
        
        // Use animationend events to detect when animations complete
        let completedAnimations = 0;
        let isFinalized = false;
        const totalAnimations = nodeMappings.length;
        const animationStartTime = Date.now();
        
        console.log('🎬 Smart Animate: Animation tracking setup', {
            totalAnimations,
            maxDuration,
            animationStartTime
        });
        
        const handleAnimationComplete = (event) => {
            if (isFinalized) return; // Prevent double finalization
            
            completedAnimations++;
            const elapsedTime = Date.now() - animationStartTime;
            console.log('🎬 Smart Animate: Animation completed', {
                completedAnimations,
                totalAnimations,
                elapsedTime,
                animationName: event.animationName,
                target: event.target,
                targetId: event.target.getAttribute('data-figma-id')
            });
            
            if (completedAnimations >= totalAnimations) {
                console.log('🎬 Smart Animate: All animations completed, finalizing', {
                    totalElapsedTime: elapsedTime,
                    maxDuration
                });
                isFinalized = true;
                this.finalizeSmartAnimate(componentSetId, targetVariantId, currentVariantId, nodeMappings, currentElement, targetElement);
            }
        };
        
        // Add animationend listeners only to elements that actually have CSS animations
        const expectedAnimations = new Set();
        nodeMappings.forEach(mapping => {
            const currentMappedElement = document.querySelector('[data-figma-id="' + mapping.currentId + '"]');
            if (currentMappedElement) {
                const animationName = 'smartAnimate_' + mapping.currentId.replace(/:/g, '_');
                
                // Only add animationend listener if the element actually has a CSS animation applied
                const hasAnimation = currentMappedElement.style.animation && currentMappedElement.style.animation.includes(animationName);
                
                if (hasAnimation) {
                    expectedAnimations.add(animationName);
                    currentMappedElement.addEventListener('animationend', handleAnimationComplete, { once: true });
                    console.log('🎬 Smart Animate: Added animationend listener', { 
                        currentId: mapping.currentId, 
                        animationName,
                        element: currentMappedElement 
                    });
                } else {
                    console.log('🎬 Smart Animate: Skipping animationend listener (no CSS animation)', { 
                        currentId: mapping.currentId, 
                        animationName,
                        element: currentMappedElement,
                        appliedAnimation: currentMappedElement.style.animation
                    });
                }
            }
        });
        
        console.log('🎬 Smart Animate: Expected animations', { 
            expectedAnimations: Array.from(expectedAnimations),
            count: expectedAnimations.size 
        });
        
        // For elements that only have opacity/fill changes (no CSS animations), 
        // we need to manually trigger completion since they won't fire animationend
        const elementsWithoutAnimations = nodeMappings.filter(mapping => {
            const currentMappedElement = document.querySelector('[data-figma-id="' + mapping.currentId + '"]');
            if (!currentMappedElement) return false;
            
            const animationName = 'smartAnimate_' + mapping.currentId.replace(/:/g, '_');
            const hasAnimation = currentMappedElement.style.animation && currentMappedElement.style.animation.includes(animationName);
            
            return !hasAnimation;
        });
        
        console.log('🎬 Smart Animate: Elements without CSS animations', {
            count: elementsWithoutAnimations.length,
            elements: elementsWithoutAnimations.map(m => m.currentId)
        });
        
        // If all elements are without animations, complete immediately
        if (expectedAnimations.size === 0 && elementsWithoutAnimations.length > 0) {
            console.log('🎬 Smart Animate: All elements are non-animated, completing immediately');
            setTimeout(() => {
                if (!isFinalized) {
                    isFinalized = true;
                    this.finalizeSmartAnimate(componentSetId, targetVariantId, currentVariantId, nodeMappings, currentElement, targetElement);
                }
            }, 50); // Small delay to ensure opacity/fill changes are applied
        }
        
        // Fallback timeout in case animationend doesn't fire
        setTimeout(() => {
            if (!isFinalized) {
                console.log('🎬 Smart Animate: Fallback timeout reached, finalizing', {
                    completedAnimations,
                    totalAnimations,
                    missingAnimations: totalAnimations - completedAnimations,
                    expectedAnimations: Array.from(expectedAnimations)
                });
                isFinalized = true;
                this.finalizeSmartAnimate(componentSetId, targetVariantId, currentVariantId, nodeMappings, currentElement, targetElement);
            }
        }, maxDuration + 100);
    }

    /**
     * Apply fill animation to an element
     * @param {Element} element - DOM element to animate
     * @param {Object} fillDifferences - Fill differences object
     */
    applyFillAnimation(element, fillDifferences) {
        const targetFills = fillDifferences.target;
        if (!targetFills || targetFills.length === 0) {
            return;
        }
        
        // Get the primary fill (first solid fill or first gradient)
        const primaryFill = targetFills.find(fill => fill.type === 'SOLID' || fill.type === 'GRADIENT_LINEAR' || fill.type === 'GRADIENT_RADIAL');
        if (!primaryFill) {
            return;
        }
        
        if (primaryFill.type === 'SOLID') {
            // Apply solid fill color
            const color = primaryFill.color;
            const opacity = primaryFill.opacity !== undefined ? primaryFill.opacity : 1;
            
            if (color && color.r !== undefined && color.g !== undefined && color.b !== undefined) {
                const r = Math.round(color.r * 255);
                const g = Math.round(color.g * 255);
                const b = Math.round(color.b * 255);
                const a = color.a !== undefined ? color.a * opacity : opacity;
                
                const colorValue = 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
                
                // Check if this is a text element
                const isTextElement = element.tagName === 'P' || element.tagName === 'SPAN' || element.tagName === 'H1' || element.tagName === 'H2' || element.tagName === 'H3' || element.tagName === 'H4' || element.tagName === 'H5' || element.tagName === 'H6' || element.getAttribute('data-figma-type') === 'TEXT';
                
                // Check if this is an SVG element (should never get background color)
                const isSVGElement = element.tagName === 'SVG' || element.getAttribute('data-figma-type') === 'VECTOR' || element.getAttribute('data-figma-type') === 'ELLIPSE';
                
                if (isTextElement) {
                    element.style.color = colorValue;
                } else if (isSVGElement) {
                    // SVG elements should never get background color - skip
                    return;
                } else {
                    element.style.backgroundColor = colorValue;
                }
            }
        } else if (primaryFill.type === 'GRADIENT_LINEAR' || primaryFill.type === 'GRADIENT_RADIAL') {
            // Check if this is an SVG element (should never get background gradient)
            const isSVGElement = element.tagName === 'SVG' || element.getAttribute('data-figma-type') === 'VECTOR' || element.getAttribute('data-figma-type') === 'ELLIPSE';
            
            if (!isSVGElement) {
                // Apply gradient fill only to non-SVG elements
                const gradientCSS = this.generateGradientCSS(primaryFill);
                if (gradientCSS) {
                    element.style.background = gradientCSS;
                }
            }
        }
    }

    /**
     * Apply individual SVG graphic scaling (paths, ellipses, etc.)
     * @param {HTMLElement} element - The SVG element
     * @param {Array} graphicScales - Array of graphic scale information
     * @param {string} animationName - Base animation name
     * @param {number} duration - Animation duration
     * @param {string} easing - Animation easing
     */
    applyIndividualGraphicScaling(element, graphicScales, animationName, duration, easing, mapping) {
        const svgElement = element.tagName === 'svg' ? element : element.querySelector('svg');
        if (!svgElement) {
            console.log('🎬 Smart Animate: No SVG element found for individual graphic scaling');
            return;
        }
        
        console.log('🎬 Smart Animate: Applying SVG container scaling', { 
            scaledGraphics: graphicScales.length 
        });
        
        graphicScales.forEach(graphicScale => {
            if (graphicScale.graphicType === 'svg') {
                // Apply scaling to the SVG container itself
                const svgAnimationName = animationName + '_svg_container';
                
                // Get the translate value from the differences object (from the main animation)
                const translateValue = mapping.differences.position ? 
                    'translate(' + mapping.differences.position.x + 'px, ' + mapping.differences.position.y + 'px)' : '';
                
                // Get current opacity and calculate target opacity
                const currentOpacity = parseFloat(svgElement.style.opacity) || 1;
                const opacityDiff = mapping.differences.opacity || 0;
                const targetOpacity = Math.max(0, Math.min(1, currentOpacity + opacityDiff));
                
                // Create keyframes for SVG scaling animation (including opacity if needed)
                let keyframes = 
                    '@keyframes ' + svgAnimationName + ' {' +
                    '0% { transform: scale(1, 1);';
                if (opacityDiff !== 0) {
                    keyframes += ' opacity: ' + currentOpacity + ';';
                }
                keyframes += ' }' +
                    '100% { transform: scale(' + graphicScale.scaleX + ', ' + graphicScale.scaleY + ');';
                if (opacityDiff !== 0) {
                    keyframes += ' opacity: ' + targetOpacity + ';';
                }
                keyframes += ' }' +
                    '}';
                
                
                // Add keyframes to document
                const styleSheet = document.createElement('style');
                styleSheet.textContent = keyframes;
                document.head.appendChild(styleSheet);
                
                // Clear any existing transform and animation to prevent conflicts
                svgElement.style.setProperty('transform', '', 'important');
                svgElement.style.setProperty('animation', '', 'important');
                
                // Apply animation to the SVG container
                const svgAnimationCSS = svgAnimationName + ' ' + duration + 'ms ' + easing + ' forwards';
                svgElement.style.setProperty('animation', svgAnimationCSS, 'important');
                
                // Set transform properties with higher specificity to prevent animation override
                svgElement.style.setProperty('transform-origin', '50% 50%', 'important');
                svgElement.style.setProperty('transform-box', 'fill-box', 'important');
                
                // Force the properties to stick by setting them again after a brief delay
                setTimeout(() => {
                    svgElement.style.setProperty('transform-origin', '50% 50%', 'important');
                    svgElement.style.setProperty('transform-box', 'fill-box', 'important');
                }, 10);
                
                
            }
        });
    }

    /**
     * Apply SVG color animation to an element
     * @param {Element} element - DOM element to animate
     * @param {Object} svgColorDifferences - SVG color differences object
     */
    applySVGColorAnimation(element, svgColorDifferences) {
        console.log('🎨 SVG Color Animation: Starting', { element, svgColorDifferences });
        
        const targetFills = svgColorDifferences.target;
        if (!targetFills || targetFills.length === 0) {
            console.log('🎨 SVG Color Animation: No target fills found');
            return;
        }
        
        // Get the primary solid fill for SVG color animation
        const primaryFill = targetFills.find(fill => fill.type === 'SOLID');
        if (!primaryFill) {
            console.log('🎨 SVG Color Animation: No solid fill found');
            return;
        }
        
        console.log('🎨 SVG Color Animation: Primary fill found', { primaryFill });
        
        // Apply solid fill color to SVG path elements
        const color = primaryFill.color;
        const opacity = primaryFill.opacity !== undefined ? primaryFill.opacity : 1;
        
        if (color && color.r !== undefined && color.g !== undefined && color.b !== undefined) {
            const r = Math.round(color.r * 255);
            const g = Math.round(color.g * 255);
            const b = Math.round(color.b * 255);
            const a = color.a !== undefined ? color.a * opacity : opacity;
            
            const colorValue = 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
            console.log('🎨 SVG Color Animation: Color value calculated', { colorValue, r, g, b, a });
            
            // Find the SVG element and apply color to ALL path elements
            const svgElement = element.tagName === 'svg' ? element : element.querySelector('svg');
            if (svgElement) {
                console.log('🎨 SVG Color Animation: SVG element found', { svgElement });
                // Remove any background-color from SVG (should never have background-color)
                svgElement.style.backgroundColor = '';
                
                // Apply fill color to ALL path elements
                const pathElements = svgElement.querySelectorAll('path');
                console.log('🎨 SVG Color Animation: Path elements found', { pathCount: pathElements.length });
                pathElements.forEach((pathElement, index) => {
                    pathElement.style.fill = colorValue;
                    console.log('🎨 SVG Color Animation: Applied color to path', { index, colorValue, pathElement });
                });
            } else {
                console.log('🎨 SVG Color Animation: No SVG element found');
            }
        }
    }

    /**
     * Generate CSS gradient from Figma gradient fill
     * @param {Object} gradientFill - Figma gradient fill object
     * @returns {string} CSS gradient string
     */
    generateGradientCSS(gradientFill) {
        if (!gradientFill.gradientStops || gradientFill.gradientStops.length === 0) return null;
        
        const stops = gradientFill.gradientStops.map(stop => {
            const color = stop.color;
            if (!color || color.r === undefined || color.g === undefined || color.b === undefined) return null;
            
            const r = Math.round(color.r * 255);
            const g = Math.round(color.g * 255);
            const b = Math.round(color.b * 255);
            const a = color.a !== undefined ? color.a : 1;
            const position = Math.round((stop.position || 0) * 100);
            
            return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ') ' + position + '%';
        }).filter(Boolean);
        
        if (stops.length === 0) return null;
        
        const gradientType = gradientFill.type === 'GRADIENT_RADIAL' ? 'radial-gradient' : 'linear-gradient';
        const angle = gradientFill.gradientTransform ? this.calculateGradientAngle(gradientFill.gradientTransform) : '180deg';
        
        return gradientType + '(' + angle + ', ' + stops.join(', ') + ')';
    }

    /**
     * Calculate gradient angle from transform matrix
     * @param {Array} transform - Transform matrix
     * @returns {string} CSS angle
     */
    calculateGradientAngle(transform) {
        if (!transform || transform.length < 2) return '180deg';
        
        // Simple angle calculation from transform matrix
        const angle = Math.atan2(transform[1][0], transform[0][0]) * (180 / Math.PI);
        return Math.round(angle) + 'deg';
    }

    /**
     * Get combined bounding box of all path elements
     * @param {NodeList} paths - Collection of path elements
     * @returns {Object|null} Bounding box object with x, y, width, height
     */
    getCombinedPathBBox(paths) {
        if (!paths || paths.length === 0) return null;
        
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        let hasValidBBox = false;
        
        paths.forEach(path => {
            try {
                const bbox = path.getBBox();
                if (bbox && bbox.width > 0 && bbox.height > 0) {
                    minX = Math.min(minX, bbox.x);
                    minY = Math.min(minY, bbox.y);
                    maxX = Math.max(maxX, bbox.x + bbox.width);
                    maxY = Math.max(maxY, bbox.y + bbox.height);
                    hasValidBBox = true;
                }
            } catch (e) {
                // Some paths might not have valid bounding boxes
                console.log('🔍 Path BBox error', { path, error: e.message });
            }
        });
        
        if (!hasValidBBox) return null;
        
        return {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY
        };
    }

    /**
     * Generate CSS transform from node differences
     * @param {Object} differences - Node differences
     * @returns {string} CSS transform string
     */
    generateTransformFromDifferences(differences) {
        const transforms = [];
        
        if (differences.position) {
            transforms.push('translate(' + differences.position.x + 'px, ' + differences.position.y + 'px)');
        }
        
        if (differences.rotation) {
            transforms.push('rotate(' + differences.rotation + 'deg)');
        }
        
        if (differences.scale) {
            transforms.push('scale(' + differences.scale.x + ', ' + differences.scale.y + ')');
        }
        
        // Note: Individual path scales (differences.pathScales) are handled separately
        // in the animation application logic, not in the main transform
        
        return transforms.length > 0 ? transforms.join(' ') : null;
    }

    /**
     * Generate CSS transition string from transition data
     * @param {Object} transitionData - Transition data
     * @returns {string} CSS transition string
     */
    generateTransitionCSS(transitionData) {
        if (!transitionData) {
            return 'transform, opacity, background-color, background, color, fill 300ms ease-in-out'; // Default fallback
        }
        
        const duration = transitionData.duration ? transitionData.duration * 1000 : 300; // Convert to ms
        const easing = this.mapEasingToCSS(transitionData.easing);
        
        return 'transform, opacity, background-color, background, color, fill ' + duration + 'ms ' + easing;
    }

    /**
     * Map Figma easing to CSS easing
     * @param {Object|string} figmaEasing - Figma easing data
     * @returns {string} CSS easing value
     */
    mapEasingToCSS(figmaEasing) {
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
            case 'GENTLE':
                return 'cubic-bezier(0.25, 0.1, 0.25, 1)'; // Gentle easing curve
            case 'EASE_IN_AND_OUT_BACK':
                return 'cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            case 'EASE_IN_BACK':
                return 'cubic-bezier(0.6, -0.28, 0.735, 0.045)';
            case 'EASE_OUT_BACK':
                return 'cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            default:
                return 'ease-in-out';
        }
    }

    /**
     * Get the maximum transition duration from node mappings
     * @param {Array} nodeMappings - Array of node mappings
     * @param {Object} transitionData - Transition data for the target variant
     * @returns {number} Maximum duration in milliseconds
     */
    getMaxTransitionDuration(nodeMappings, transitionData = null) {
        let maxDuration = 300; // Default 300ms
        
        // Use the passed transition data first
        if (transitionData && transitionData.duration) {
            maxDuration = transitionData.duration * 1000; // Convert to ms
        }
        
        // Check node mappings for additional duration info
        nodeMappings.forEach(mapping => {
            if (mapping.targetNode.transition && mapping.targetNode.transition.duration) {
                const duration = mapping.targetNode.transition.duration * 1000; // Convert to ms
                maxDuration = Math.max(maxDuration, duration);
            }
        });
        
        return maxDuration;
    }

    bindInitialEvents() {
        for (const [componentSetId, componentSet] of this.componentSets) {
            const currentVariantId = this.currentVariants.get(componentSetId);
            if (currentVariantId) {
                this.bindEventsForVariant(componentSetId, currentVariantId);
            }
        }
    }

    setupSequentialNavigation() {
        console.log('⌨️ Sequential navigation system prepared (server will handle keyboard events)');
        
        // Check if keys 1 or 2 are already used by Figma reactions
        const elementsWithKey1 = document.querySelectorAll('[data-key-code="49"]'); // keyCode 49 = "1"
        const elementsWithKey2 = document.querySelectorAll('[data-key-code="50"]'); // keyCode 50 = "2"
        
        const key1InUse = elementsWithKey1.length > 0;
        const key2InUse = elementsWithKey2.length > 0;
        
        if (key1InUse || key2InUse) {
            console.warn('⚠️ Warning: Keys 1 or 2 are already used by Figma reactions');
            console.warn(\`  Key "1" used by \${elementsWithKey1.length} element(s)\`);
            console.warn(\`  Key "2" used by \${elementsWithKey2.length} element(s)\`);
            console.warn('  Server keyboard navigation may override these reactions');
        }
        
        // Navigation methods are available but no event listeners are added
        // The server will call navigateToPreviousSlide() and navigateToNextSlide() directly
        console.log('✅ Sequential navigation system ready (server-controlled)');
    }

    isInputElement(element) {
        // Don't intercept keys if user is typing in an input field
        return element.tagName === 'INPUT' || 
               element.tagName === 'TEXTAREA' || 
               element.isContentEditable;
    }

    navigateToPreviousSlide() {
        // Navigate backwards in the first component set found
        for (const [componentSetId, componentSet] of this.componentSets) {
            const currentVariantId = this.currentVariants.get(componentSetId);
            const variants = componentSet.variants || [];
            const currentIndex = variants.findIndex(v => v.id === currentVariantId);
            
            if (currentIndex > 0) {
                const previousVariant = variants[currentIndex - 1];
                console.log(\`⬅️ Navigating to previous slide: \${previousVariant.name}\`);
                this.switchToVariant(componentSetId, previousVariant.id);
                return;
            } else {
                console.log('ℹ️ Already at first slide');
            }
        }
    }

    navigateToNextSlide() {
        // Navigate forwards in the first component set found
        for (const [componentSetId, componentSet] of this.componentSets) {
            const currentVariantId = this.currentVariants.get(componentSetId);
            const variants = componentSet.variants || [];
            const currentIndex = variants.findIndex(v => v.id === currentVariantId);
            
            if (currentIndex < variants.length - 1) {
                const nextVariant = variants[currentIndex + 1];
                console.log(\`➡️ Navigating to next slide: \${nextVariant.name}\`);
                this.switchToVariant(componentSetId, nextVariant.id);
                return;
            } else {
                console.log('ℹ️ Already at last slide');
            }
        }
    }

    bindEventsForVariant(componentSetId, variantId) {
        this.cleanupEventsForComponentSet(componentSetId);
        
        const variantElement = document.querySelector('[data-variant="' + variantId + '"]');
        if (!variantElement) {
            console.warn('Variant element not found for ID:', variantId);
            return;
        }

        // Look for triggers within the variant AND on the variant element itself
        const clickableElements = Array.from(variantElement.querySelectorAll('[data-variant-trigger]'));
        
        // Check if the variant element itself has a trigger
        if (variantElement.hasAttribute('data-variant-trigger')) {
            clickableElements.push(variantElement);
        }
        
        // Filter out elements that belong to nested component sets, but allow them to be processed
        // if they are direct children of the current variant (not deeply nested)
        const filteredClickableElements = clickableElements.filter(element => {
            const parentComponentSetId = element.getAttribute('data-parent-component-set');
            if (parentComponentSetId && parentComponentSetId !== componentSetId) {
                // Check if this element is a direct child of the current variant
                const isDirectChild = element.closest('[data-variant="' + variantId + '"]') === variantElement;
                if (isDirectChild) {
                    return true;
                } else {
                    return false;
                }
            }
            return true;
        });
        
        // Also check if the INSTANCE node itself has a trigger
        const instanceElement = variantElement.closest('[data-figma-type="INSTANCE"]');
        if (instanceElement && instanceElement.hasAttribute('data-variant-trigger')) {
            clickableElements.push(instanceElement);
        }
        
        const handlers = new Set();
        filteredClickableElements.forEach((element) => {
            // Clean up any existing handlers for this element first
            this.cleanupEventsForElement(element);
            
            const triggerType = element.getAttribute('data-trigger-type');
            const timeoutDelay = element.getAttribute('data-timeout-delay');
            
            if (triggerType === 'AFTER_TIMEOUT' && timeoutDelay) {
                // Handle timeout events - use the element's own component set ID
                const elementComponentSetId = element.getAttribute('data-parent-component-set') || componentSetId;
                this.setupTimeoutHandler(element, elementComponentSetId, parseInt(timeoutDelay));
            } else if (triggerType === 'ON_KEYBOARD' || triggerType === 'ON_KEY_DOWN') {
                // Handle keyboard events - check for matching key codes
                const keyCode = element.getAttribute('data-key-code');
                const allReactionsData = element.getAttribute('data-all-reactions');
                
                const handler = (e) => {
                    let targetVariantId = null;
                    
                    // Check if element has multiple reactions
                    if (allReactionsData) {
                        try {
                            const allReactions = JSON.parse(allReactionsData);
                            // Find the reaction that matches the pressed key
                            const matchingReaction = allReactions.find(reaction => 
                                reaction.keyCode && e.keyCode === parseInt(reaction.keyCode)
                            );
                            if (matchingReaction) {
                                targetVariantId = matchingReaction.targetId;
                            }
                        } catch (error) {
                            console.warn('Failed to parse all-reactions data:', error);
                        }
                    }
                    
                    // Fallback to single key code check
                    if (!targetVariantId && keyCode && e.keyCode === parseInt(keyCode)) {
                        targetVariantId = element.getAttribute('data-variant-target');
                    }
                    
                    if (targetVariantId) {
                        // Auto-detect component set if needed
                        let targetComponentSetId = componentSetId;
                        if (targetComponentSetId === 'auto') {
                            targetComponentSetId = this.findComponentSetForElement(element);
                        }
                        
                        // For keyboard events, create a synthetic event with the correct target
                        const syntheticEvent = {
                            target: element,
                            preventDefault: e.preventDefault.bind(e),
                            stopPropagation: e.stopPropagation.bind(e)
                        };
                        
                        // Override the target variant if we found a specific one
                        if (targetVariantId) {
                            const originalGetAttribute = syntheticEvent.target.getAttribute;
                            syntheticEvent.target.getAttribute = function(attr) {
                                if (attr === 'data-variant-target') {
                                    return targetVariantId;
                                }
                                return originalGetAttribute.call(this, attr);
                            };
                        }
                        
                        this.handleVariantSwitch(syntheticEvent, targetComponentSetId);
                    }
                };
                document.addEventListener('keydown', handler);
                handlers.add({ element, handler, eventType: 'keydown' });
            } else if (triggerType === 'ON_GAMEPAD') {
                // Handle gamepad events
                const gamepadButton = element.getAttribute('data-gamepad-button');
                const handler = (e) => {
                    // Check if any connected gamepad has the trigger button pressed
                    const gamepads = navigator.getGamepads();
                    for (let i = 0; i < gamepads.length; i++) {
                        const gamepad = gamepads[i];
                        if (gamepad && gamepadButton && gamepad.buttons[parseInt(gamepadButton)] && gamepad.buttons[parseInt(gamepadButton)].pressed) {
                            // Auto-detect component set if needed
                            let targetComponentSetId = componentSetId;
                            if (targetComponentSetId === 'auto') {
                                targetComponentSetId = this.findComponentSetForElement(element);
                            }
                            
                            this.handleVariantSwitch(e, targetComponentSetId);
                            break;
                        }
                    }
                };
                // Listen for gamepad button presses
                const gamepadHandler = () => {
                    requestAnimationFrame(handler);
                    requestAnimationFrame(gamepadHandler);
                };
                requestAnimationFrame(gamepadHandler);
                handlers.add({ element, handler, eventType: 'gamepad', gamepadHandler });
            } else {
                // Handle click/press events
                const handler = (e) => {
                    // Auto-detect component set if needed
                    let targetComponentSetId = componentSetId;
                    if (targetComponentSetId === 'auto') {
                        targetComponentSetId = this.findComponentSetForElement(element);
                    }
                    
                    this.handleVariantSwitch(e, targetComponentSetId);
                };
                element.addEventListener('click', handler);
                handlers.add({ element, handler, eventType: 'click' });
            }
        });

        this.activeEventHandlers.set(componentSetId, handlers);
    }

    /**
     * Setup timeout handler for AFTER_TIMEOUT trigger type
     * @param {Element} element - The element with timeout trigger
     * @param {string} componentSetId - The component set ID
     * @param {number} timeoutDelay - Timeout delay in milliseconds
     */
    setupTimeoutHandler(element, componentSetId, timeoutDelay) {
        // Clear any existing timeout for this element
        this.clearTimeoutForElement(element);
        
        // Use requestAnimationFrame to ensure variant is fully rendered before starting timer
        requestAnimationFrame(() => {
            // Set up new timeout after rendering is complete
            const timeoutId = setTimeout(() => {
                // Auto-detect component set if needed
                let targetComponentSetId = componentSetId;
                if (targetComponentSetId === 'auto') {
                    targetComponentSetId = this.findComponentSetForElement(element);
                }
                
                // Get target variant from element
                const targetVariantId = element.getAttribute('data-variant-target');
                if (targetVariantId && targetComponentSetId) {
                    this.switchToVariant(targetComponentSetId, targetVariantId);
                }
                
                // Remove timeout from tracking
                this.activeTimeouts.delete(element);
            }, timeoutDelay);
            
            // Track the timeout
            this.activeTimeouts.set(element, timeoutId);
        });
    }

    /**
     * Clear timeout for a specific element
     * @param {Element} element - The element to clear timeout for
     */
    clearTimeoutForElement(element) {
        const timeoutId = this.activeTimeouts.get(element);
        if (timeoutId) {
            clearTimeout(timeoutId);
            this.activeTimeouts.delete(element);
        }
    }

    /**
     * Find the component set ID for an element
     * @param {Element} element - The element to find component set for
     * @returns {string|null} Component set ID
     */
    findComponentSetForElement(element) {
        // PRIORITY 1: Use the data-parent-component-set attribute (most reliable)
        const parentComponentSetId = element.getAttribute('data-parent-component-set');
        if (parentComponentSetId) {
            return parentComponentSetId;
        }
        
        // PRIORITY 2: Find the immediate component set by looking for a COMPONENT_SET parent
        let current = element.parentElement; // Start from parent, not the element itself
        let depth = 0;
        while (current && depth < 10) { // Prevent infinite loops
            if (current.getAttribute('data-figma-type') === 'COMPONENT_SET') {
                const componentSetId = current.getAttribute('data-figma-id');
                return componentSetId;
            }
            current = current.parentElement;
            depth++;
        }
        
        return null;
    }

    cleanupEventsForComponentSet(componentSetId) {
        const handlers = this.activeEventHandlers.get(componentSetId);
        if (handlers) {
            handlers.forEach(({ element, handler, eventType, gamepadHandler }) => {
                if (eventType === 'keydown') {
                    document.removeEventListener('keydown', handler);
                } else if (eventType === 'gamepad' && gamepadHandler) {
                    // Stop the gamepad handler loop
                    // Note: gamepadHandler is a recursive requestAnimationFrame loop
                    // We can't easily stop it, but it will stop when the element is removed
                } else {
                    element.removeEventListener('click', handler);
                }
                // Also clear any timeouts for these elements
                this.clearTimeoutForElement(element);
            });
            handlers.clear();
        }
        this.activeEventHandlers.delete(componentSetId);
    }

    /**
     * Clear all timeouts for a specific component set
     * @param {string} componentSetId - Component set ID
     */
    clearTimeoutsForComponentSet(componentSetId) {
        // Find all elements that belong to this component set and clear their timeouts
        const componentSetElement = document.querySelector('[data-figma-id="' + componentSetId + '"]');
        if (componentSetElement) {
            const allElements = componentSetElement.querySelectorAll('[data-timeout-delay]');
            allElements.forEach(element => {
                this.clearTimeoutForElement(element);
            });
        }
        
        // Also clear any timeouts that might be tracked by element reference
        this.activeTimeouts.forEach((timeoutId, element) => {
            if (element.closest('[data-figma-id="' + componentSetId + '"]')) {
                clearTimeout(timeoutId);
                this.activeTimeouts.delete(element);
            }
        });
    }
    
    /**
     * Clean up all event handlers for a specific element
     * @param {Element} element - The element to clean up
     */
    cleanupEventsForElement(element) {
        // Remove all event handlers from all component sets for this element
        this.activeEventHandlers.forEach((handlers, componentSetId) => {
            const elementHandlers = Array.from(handlers).filter(({ element: handlerElement }) => 
                handlerElement === element
            );
            elementHandlers.forEach(({ handler, eventType, gamepadHandler }) => {
                if (eventType === 'keydown') {
                    document.removeEventListener('keydown', handler);
                } else if (eventType === 'gamepad' && gamepadHandler) {
                    // Stop the gamepad handler loop
                    // Note: gamepadHandler is a recursive requestAnimationFrame loop
                    // We can't easily stop it, but it will stop when the element is removed
                } else {
                    element.removeEventListener('click', handler);
                }
                handlers.delete({ element, handler });
            });
        });
        
        // Clear any timeout for this element
        this.clearTimeoutForElement(element);
    }

    handleVariantSwitch(event, componentSetId) {

        event.preventDefault();
        event.stopPropagation();

        // Find the element with data-variant-trigger attribute (could be event.target or a parent)
        let targetElement = event.target;
        while (targetElement && !targetElement.hasAttribute('data-variant-trigger')) {
            targetElement = targetElement.parentElement;
        }
        
        if (!targetElement) {
            console.warn('No element with data-variant-trigger found');
            return;
        }
        
        
        let targetVariantId = targetElement.getAttribute('data-variant-target');
        
        // Handle auto target detection
        if (targetVariantId === 'auto') {
            targetVariantId = this.findNextVariant(componentSetId);
        }
        
        if (!targetVariantId) {
            console.warn('No target variant specified for click event');
            return;
        }


        this.switchToVariant(componentSetId, targetVariantId);
    }

    /**
     * Find the next variant to switch to
     * @param {string} componentSetId - Component set ID
     * @returns {string|null} Next variant ID
     */
    findNextVariant(componentSetId) {
        const componentSet = this.componentSets.get(componentSetId);
        if (!componentSet) return null;

        const currentVariantId = this.currentVariants.get(componentSetId);
        const variants = componentSet.variants;
        
        if (variants.length <= 1) return null;
        
        // Find current variant index
        const currentIndex = variants.findIndex(v => v.id === currentVariantId);
        
        if (currentIndex === -1) {
            // If current variant not found, return the first variant
            return variants[0].id;
        }
        
        // Cycle to next variant
        const nextIndex = (currentIndex + 1) % variants.length;
        return variants[nextIndex].id;
    }

    switchToVariant(componentSetId, targetVariantId) {
        console.log('🎬 Smart Animate: Starting variant switch', {
            componentSetId,
            targetVariantId,
            currentVariantId: this.currentVariants.get(componentSetId)
        });

        const componentSet = this.componentSets.get(componentSetId);
        if (!componentSet) {
            console.warn('Component set not found: ' + componentSetId);
            return;
        }

        const targetVariant = componentSet.variants.find(v => v.id === targetVariantId);
        if (!targetVariant) {
            console.warn('Target variant not found in component set: ' + targetVariantId);
            return;
        }

        const currentVariantId = this.currentVariants.get(componentSetId);
        const currentVariant = currentVariantId ? componentSet.variants.find(v => v.id === currentVariantId) : null;
        
        // Clear all existing timeouts for this component set before switching
        this.clearTimeoutsForComponentSet(componentSetId);
        
        // Check if current variant has Smart Animate transition (where the trigger is)
        let transitionData = currentVariant ? currentVariant.transition : null;
        
        // Fallback: Try to read transition data from HTML element
        if (!transitionData) {
            // First try the current variant (where the trigger is)
            if (currentVariantId) {
                const currentElement = document.querySelector('[data-figma-id="' + currentVariantId + '"]');
                if (currentElement) {
                    const transitionAttr = currentElement.getAttribute('data-transition');
                    if (transitionAttr) {
                        try {
                            transitionData = JSON.parse(transitionAttr);
                        } catch (e) {
                            console.warn('🔄 Variant Switch: Failed to parse transition attribute from current variant', transitionAttr);
                        }
                    }
                }
            }
            
            // If still no transition data, try the target variant as fallback
            if (!transitionData) {
                const targetElement = document.querySelector('[data-figma-id="' + targetVariantId + '"]');
                if (targetElement) {
                    const transitionAttr = targetElement.getAttribute('data-transition');
                    if (transitionAttr) {
                        try {
                            transitionData = JSON.parse(transitionAttr);
                        } catch (e) {
                            console.warn('🔄 Variant Switch: Failed to parse transition attribute from target variant', transitionAttr);
                        }
                    }
                }
            }
        }
        
        const hasSmartAnimate = transitionData && transitionData.type === 'SMART_ANIMATE';
        
        // Check if Smart Animate should be used
        
        if (hasSmartAnimate && currentVariantId) {
            // Use Smart Animate for smooth transitions
            this.smartAnimateToVariant(componentSetId, targetVariantId, transitionData);
        } else {
            // Use simple show/hide for non-Smart Animate variants
            if (currentVariantId) {
                this.hideVariant(currentVariantId);
            }
            this.showVariant(targetVariantId);
            this.currentVariants.set(componentSetId, targetVariantId);
            this.bindEventsForVariant(componentSetId, targetVariantId);
        }
    }
}

// Global instance
window.variantSwitcher = new VariantSwitcher();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Will be initialized with extracted nodes data
    });
} else {
    // DOM already ready
}
`;
    }

    /**
     * Serialize nodes for JavaScript without circular references
     * @param {Object} nodes - The nodes to serialize
     * @returns {string} JSON string without circular references
     */
    serializeNodesForJS(nodes) {
        const seen = new WeakSet();
        
        const sanitize = (obj) => {
            if (obj === null || typeof obj !== 'object') {
                return obj;
            }
            
            if (seen.has(obj)) {
                return '[Circular Reference]';
            }
            
            seen.add(obj);
            
            if (Array.isArray(obj)) {
                return obj.map(sanitize);
            }
            
            const result = {};
            for (const [key, value] of Object.entries(obj)) {
                // Skip parent references to avoid circular references
                if (key === 'parent') {
                    continue;
                }
                
                
                result[key] = sanitize(value);
            }
            
            seen.delete(obj);
            return result;
        };
        
        try {
            return JSON.stringify(sanitize(nodes));
        } catch (error) {
            console.warn('Failed to serialize nodes for JavaScript:', error);
            return '{}';
        }
    }

    /**
     * Handle get selection request
     */
    async handleGetSelection() {
        const selectedNodes = this.getSelectedNodes();
        const nodeData = selectedNodes.map(node => ({
            id: node.id,
            name: node.name || 'Unnamed',
            type: node.type || 'UNKNOWN',
            visible: node.visible !== false
        }));
        
        this.sendMessage({
            type: 'selection-data',
            nodes: nodeData,
            count: nodeData.length
        });
    }

    /**
     * Detect Lottie files from extracted nodes
     * @param {Array} extractedNodes - Array of extracted node data
     * @returns {Array} Array of Lottie file information
     */
    detectLottieFiles(extractedNodes) {
        const lottieFiles = [];
        
        // Recursively search through all nodes for Lottie frames
        const searchNodes = (nodes) => {
            for (const node of nodes) {
                // Check if this node is a Lottie frame
                if (this.isLottieFrame(node)) {
                    const lottieInfo = this.extractLottieInfo(node);
                    if (lottieInfo) {
                        lottieFiles.push({
                            nodeId: node.id,
                            nodeName: node.name,
                            filename: lottieInfo.filename,
                            sourcePath: lottieInfo.sourcePath,
                            originalFilename: node.name,
                            width: node.width,
                            height: node.height
                        });
                    }
                }
                
                // Recursively search children
                if (node.children && Array.isArray(node.children)) {
                    searchNodes(node.children);
                }
            }
        };
        
        searchNodes(extractedNodes);
        return lottieFiles;
    }

    /**
     * Detect video files from extracted nodes
     * @param {Array} extractedNodes - Array of extracted node data
     * @returns {Array} Array of video file information
     */
    detectVideoFiles(extractedNodes) {
        const videoFiles = [];
        
        // Recursively search through all nodes for video frames
        const searchNodes = (nodes) => {
            for (const node of nodes) {
                // Check if this node is a video frame
                if (this.isVideoFrame(node)) {
                    const videoInfo = this.extractVideoInfo(node);
                    if (videoInfo) {
                        videoFiles.push({
                            nodeId: node.id,
                            nodeName: node.name,
                            filename: videoInfo.filename,
                            sourcePath: videoInfo.sourcePath,
                            originalFilename: node.name,
                            width: node.width,
                            height: node.height
                        });
                    }
                }
                
                // Recursively search children
                if (node.children && Array.isArray(node.children)) {
                    searchNodes(node.children);
                }
            }
        };
        
        searchNodes(extractedNodes);
        return videoFiles;
    }

    /**
     * Detect image files in the extracted nodes
     * @param {Array} extractedNodes - Array of extracted node data
     * @returns {Array} Array of image file information
     */
    detectImageFiles(extractedNodes) {
        const imageFiles = [];
        
        // Recursively search through all nodes for image frames
        const searchNodes = (nodes) => {
            for (const node of nodes) {
                // Check if this node is an image frame
                if (this.isImageFrame(node)) {
                    const imageInfo = this.extractImageInfo(node);
                    if (imageInfo) {
                        imageFiles.push({
                            nodeId: node.id,
                            nodeName: node.name,
                            filename: imageInfo.filename,
                            sourcePath: imageInfo.sourcePath,
                            originalFilename: node.name,
                            width: node.width,
                            height: node.height
                        });
                    }
                }
                
                // Recursively search children
                if (node.children && Array.isArray(node.children)) {
                    searchNodes(node.children);
                }
            }
        };
        
        searchNodes(extractedNodes);
        return imageFiles;
    }

    /**
     * Check if a node is a video frame
     * @param {Object} node - Node data
     * @returns {boolean} True if the node is a video frame
     */
    isVideoFrame(node) {
        return typeof node.name === 'string' && node.name.startsWith('[VIDEO]');
    }

    /**
     * Check if a frame is a Lottie frame based on its name
     * @param {Object} node - Node data
     * @returns {boolean} True if the node is a Lottie frame
     */
    isLottieFrame(node) {
        return typeof node.name === 'string' && node.name.startsWith('[LOTTIE]');
    }

    /**
     * Check if a node is an image frame
     * @param {Object} node - Node data
     * @returns {boolean} True if the node is an image frame
     */
    isImageFrame(node) {
        return typeof node.name === 'string' && node.name.startsWith('[IMG]');
    }

    /**
     * Extract video filename and source path from frame name
     * @param {Object} node - Node data
     * @returns {Object|null} Object with filename and sourcePath, or null if not a video frame
     */
    /**
     * Extract Lottie filename and source path from frame name
     * @param {Object} node - Node data
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
     * Extract video filename from frame name (backward compatibility)
     * @param {Object} node - Node data
     * @returns {string|null} Video filename or null if not a video frame
     */
    extractVideoFilename(node) {
        const videoInfo = this.extractVideoInfo(node);
        return videoInfo ? videoInfo.filename : null;
    }

    /**
     * Extract image filename and source path from frame name
     * @param {Object} node - Node data
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
     * @param {Object} node - Node data
     * @returns {string|null} Image filename or null if not an image frame
     */
    extractImageFilename(node) {
        const imageInfo = this.extractImageInfo(node);
        return imageInfo ? imageInfo.filename : null;
    }


    /**
     * Export HTML to file
     * @param {string} html - HTML content
     * @param {string} filename - Filename
     * @param {Array} videoFiles - Array of video file information
     * @param {Array} imageFiles - Array of image file information
     */
    async exportToFile(html, filename, videoFiles = [], imageFiles = []) {
        // For large HTML files, we might need to chunk the content
        const maxChunkSize = 1000000; // 1MB chunks
        
        if (html.length > maxChunkSize) {
            // Split into chunks
            const chunks = [];
            for (let i = 0; i < html.length; i += maxChunkSize) {
                chunks.push(html.substring(i, i + maxChunkSize));
            }
            
            // Send chunks
            for (let i = 0; i < chunks.length; i++) {
                this.sendMessage({
                    type: 'download-file-chunk',
                    content: chunks[i],
                    filename: filename,
                    chunkIndex: i,
                    totalChunks: chunks.length,
                    mimeType: 'text/html',
                    videoFiles: i === 0 ? videoFiles : [], // Only send video files with first chunk
                    imageFiles: i === 0 ? imageFiles : [] // Only send image files with first chunk
                });
            }
        } else {
            // Send complete file
            this.sendMessage({
                type: 'download-file',
                content: html,
                filename: filename,
                mimeType: 'text/html',
                videoFiles: videoFiles,
                imageFiles: imageFiles
            });
        }
    }

    /**
     * Google Drive Configuration
     * 
     * Service Account Key can be provided via:
     * 1. Environment variable at build time: GOOGLE_SERVICE_ACCOUNT_JSON (JSON string)
     * 2. Config file: config/service-account.json (gitignored)
     * 3. Manual configuration: Admin pastes JSON content in Settings (stored in clientStorage)
     * 
     * Folder ID should be set via clientStorage or environment variable
     */
    async getGoogleDriveFolderId() {
        // Priority 1: clientStorage (user settings override build-time config)
        const storedId = await figma.clientStorage.getAsync('googleDriveFolderId');
        if (storedId) {
            console.log('✅ Using Google Drive folder ID from clientStorage:', storedId);
            return storedId;
        }
        
        // Priority 2: Build-time injection (fallback for initial setup)
        if (typeof GOOGLE_DRIVE_FOLDER_ID !== 'undefined' && GOOGLE_DRIVE_FOLDER_ID) {
            console.log('✅ Using Google Drive folder ID from build-time injection');
            return GOOGLE_DRIVE_FOLDER_ID;
        }
        
        return null;
    }

    /**
     * Check Google Drive connection status
     * Uses OAuth authentication (primary method)
     * Service account is optional fallback for managed deployments
     */
    async handleCheckDriveConnection() {
        try {
            const folderId = await this.getGoogleDriveFolderId();
            
            if (!folderId) {
                this.sendMessage({
                    type: 'drive-connection-status',
                    connected: false,
                    message: 'Folder ID not configured'
                });
                return;
            }
            
            // Primary: Check OAuth token (simplest, recommended)
            const accessToken = await figma.clientStorage.getAsync('googleDriveAccessToken');
            if (accessToken) {
                const isValid = await this.verifyGoogleDriveToken(accessToken);
                if (isValid) {
                    this.sendMessage({
                        type: 'drive-connection-status',
                        connected: true,
                        folderId: folderId,
                        authMethod: 'oauth'
                    });
                    return;
                } else {
                    // Token expired, clear it
                    await figma.clientStorage.deleteAsync('googleDriveAccessToken');
                }
            }
            
            // Fallback: Try service account (optional, for managed deployments)
            const serviceAccountKey = await this.getServiceAccountKey();
            if (serviceAccountKey) {
                try {
                    const serviceAccountToken = await this.getServiceAccountAccessToken(serviceAccountKey);
                    if (serviceAccountToken) {
                        this.sendMessage({
                            type: 'drive-connection-status',
                            connected: true,
                            folderId: folderId,
                            authMethod: 'service-account'
                        });
                        return;
                    }
                } catch (error) {
                    console.error('Error verifying service account:', error);
                }
            }
            
            // Not connected
            this.sendMessage({
                type: 'drive-connection-status',
                connected: false
            });
        } catch (error) {
            console.error('Error checking drive connection:', error);
            this.sendMessage({
                type: 'drive-connection-status',
                connected: false
            });
        }
    }

    /**
     * Get service account key from build-time injection or clientStorage
     * Service account key is injected at build time via environment variable
     * Or can be manually configured by admin in Settings
     */
    async getServiceAccountKey() {
        // First check if injected at build time (from environment variable)
        // This constant is injected by the build script if GOOGLE_SERVICE_ACCOUNT_JSON is set
        if (typeof SERVICE_ACCOUNT_KEY !== 'undefined' && SERVICE_ACCOUNT_KEY) {
            console.log('✅ Using service account key from build-time injection');
            return SERVICE_ACCOUNT_KEY;
        }
        
        // Fallback to clientStorage (for admin manual configuration)
        const storedKey = await figma.clientStorage.getAsync('googleServiceAccountKey');
        if (storedKey) {
            try {
                const parsedKey = typeof storedKey === 'string' ? JSON.parse(storedKey) : storedKey;
                console.log('✅ Using service account key from clientStorage');
                return parsedKey;
            } catch (error) {
                console.error('Error parsing stored service account key:', error);
            }
        }
        
        return null;
    }

    /**
     * Get access token from service account using JWT
     * Service accounts require JWT signing which needs crypto libraries
     * Since Figma plugins don't have crypto, we'll need to use a backend service
     * OR use domain-wide delegation with a pre-generated access token
     */
    async getServiceAccountAccessToken(serviceAccountKey) {
        try {
            // Option 1: Use backend service for JWT signing (recommended)
            // Check for backend URL (from build-time injection or clientStorage)
            let backendUrl = typeof GOOGLE_AUTH_BACKEND_URL !== 'undefined' ? GOOGLE_AUTH_BACKEND_URL : null;
            
            if (!backendUrl) {
                // Try clientStorage as fallback
                backendUrl = await figma.clientStorage.getAsync('googleAuthBackendUrl');
            }
            
            if (backendUrl) {
                try {
                    console.log('🔐 Attempting to get token from backend service...');
                    const response = await fetch(`${backendUrl}/api/google-drive/token`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            serviceAccount: serviceAccountKey,
                            scope: 'https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive.file'
                        })
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        if (data.accessToken) {
                            console.log('✅ Successfully obtained access token from backend');
                            // Cache the token
                            await figma.clientStorage.setAsync('googleDriveAccessToken', data.accessToken);
                            return data.accessToken;
                        }
                    } else {
                        const errorText = await response.text();
                        console.error('Backend returned error:', response.status, errorText);
                    }
                } catch (error) {
                    console.error('Error getting token from backend:', error);
                }
            }
            
            // Option 2: Check if a pre-generated access token is stored
            // This allows admins to generate a token manually and store it
            const preGeneratedToken = await figma.clientStorage.getAsync('googleDriveServiceAccountToken');
            if (preGeneratedToken) {
                // Verify token is still valid
                const isValid = await this.verifyGoogleDriveToken(preGeneratedToken);
                if (isValid) {
                    console.log('✅ Using pre-generated service account token');
                    return preGeneratedToken;
                } else {
                    console.warn('⚠️  Pre-generated token expired, removing...');
                    await figma.clientStorage.deleteAsync('googleDriveServiceAccountToken');
                }
            }
            
            // Option 3: Domain-wide delegation (enterprise only)
            // This would require additional setup - not implemented yet
            
            console.warn('Service account authentication requires:');
            console.warn('1. Backend service for JWT signing (configure GOOGLE_AUTH_BACKEND_URL)');
            console.warn('   OR use OAuth instead (recommended - configure in Settings)');
            console.warn('2. Pre-generated access token (paste in Settings → Access Token field)');
            
            return null;
            
        } catch (error) {
            console.error('Error getting service account access token:', error);
            return null;
        }
    }

    /**
     * Connect to Google Drive (OAuth flow)
     * 
     * Uses OAuth 2.0 popup flow for user authentication
     * Users will be prompted to authorize the plugin to access Google Drive
     */
    async handleConnectGoogleDrive() {
        try {
            // Check if we already have an access token
            const existingToken = await figma.clientStorage.getAsync('googleDriveAccessToken');
            if (existingToken) {
                const isValid = await this.verifyGoogleDriveToken(existingToken);
                if (isValid) {
                    const folderId = await this.getGoogleDriveFolderId();
                    this.sendMessage({
                        type: 'drive-connection-status',
                        connected: true,
                        folderId: folderId
                    });
                    this.sendMessage({
                        type: 'success',
                        message: 'Already connected to Google Drive!'
                    });
                    return;
                } else {
                    // Token exists but is expired
                    this.sendMessage({
                        type: 'prompt-access-token',
                        message: 'Your access token has expired. Get a new one using oauth2l:\n\n1. Run: oauth2l fetch --credentials=oauth-credentials.json --scope=https://www.googleapis.com/auth/drive --output_format=bare\n2. Copy the token from the terminal\n3. Paste it into Settings → Access Token field\n4. Click "Save" then "Connect" again\n\nNote: Full drive scope is required for listing children of shared folders.'
                    });
                    return;
                }
            }
            
            // No token exists - try backend service first, then prompt user
            // Option 1: Try backend service for OAuth token generation
            // Priority: Build-time config > clientStorage
            let backendUrl = typeof GOOGLE_AUTH_BACKEND_URL !== 'undefined' ? GOOGLE_AUTH_BACKEND_URL : null;
            if (!backendUrl) {
                backendUrl = await figma.clientStorage.getAsync('googleAuthBackendUrl');
            }

            console.log('🔍 Checking for backend service...', {
                hasBackendUrl: !!backendUrl,
                backendUrl: backendUrl || 'not configured'
            });

            if (backendUrl) {
                try {
                    console.log('🔐 Attempting to get OAuth token from backend service...');
                    // Priority: Build-time config > clientStorage
                    let clientId = typeof GOOGLE_CLIENT_ID !== 'undefined' ? GOOGLE_CLIENT_ID : null;
                    if (!clientId) {
                        clientId = await figma.clientStorage.getAsync('googleDriveClientId');
                    }
                    const clientSecret = await figma.clientStorage.getAsync('googleDriveClientSecret');
                    
                    console.log('🔍 Checking for Client ID...', {
                        hasClientId: !!clientId,
                        clientId: clientId ? clientId.substring(0, 20) + '...' : 'not configured'
                    });

                    if (clientId) {
                        console.log('🌐 Calling backend OAuth endpoint:', `${backendUrl}/api/google-drive/oauth-token`);
                        const response = await fetch(`${backendUrl}/api/google-drive/oauth-token`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                clientId: clientId,
                                clientSecret: clientSecret || null,
                                scope: 'https://www.googleapis.com/auth/drive'
                            })
                        });

                        if (response.ok) {
                            const data = await response.json();
                            
                            // If backend returns token directly, use it
                            if (data.accessToken) {
                                console.log('✅ Successfully obtained OAuth token from backend');
                                await figma.clientStorage.setAsync('googleDriveAccessToken', data.accessToken);
                                if (data.refreshToken) {
                                    await figma.clientStorage.setAsync('googleDriveRefreshToken', data.refreshToken);
                                }
                                
                                const folderId = await this.getGoogleDriveFolderId();
                                this.sendMessage({
                                    type: 'drive-connection-status',
                                    connected: true,
                                    folderId: folderId
                                });
                                this.sendMessage({
                                    type: 'success',
                                    message: 'Connected to Google Drive via backend service!'
                                });
                                return;
                            }
                            
                            // If backend returns authUrl, open it and poll for token
                            if (data.authUrl && data.sessionId) {
                                console.log('🔐 Opening OAuth authorization URL from backend...');
                                await figma.openExternal(data.authUrl);
                                
                                this.sendMessage({
                                    type: 'oauth-authorization-started',
                                    message: 'Please authorize in the browser window that just opened. The plugin will automatically detect when you\'re done.'
                                });
                                
                                // Start polling for token
                                this.pollForBackendToken(backendUrl, data.sessionId);
                                return;
                            }
                            
                            // Legacy: authUrl without sessionId (fallback)
                            if (data.authUrl) {
                                console.log('🔐 Opening OAuth authorization URL from backend (legacy mode)...');
                                await figma.openExternal(data.authUrl);
                                this.sendMessage({
                                    type: 'prompt-access-token',
                                    message: 'After authorizing in the browser, return to the plugin. If using a backend with polling support, the token will be detected automatically. Otherwise, paste the token in Settings → Access Token field.',
                                    state: data.state || null
                                });
                                return;
                            }
                        } else {
                            const errorText = await response.text();
                            console.warn('⚠️  Backend OAuth endpoint returned error:', response.status, errorText);
                            // Fall through to manual method
                        }
                    } else {
                        console.warn('⚠️  Backend URL configured but Client ID is missing');
                        console.warn('   Configure Client ID at build time (GOOGLE_CLIENT_ID) or in Settings');
                    }
                } catch (error) {
                    console.warn('⚠️  Error getting OAuth token from backend:', error);
                    // Fall through to manual method
                }
            } else {
                console.log('ℹ️  No backend URL configured - will use manual OAuth method (oauth2l)');
            }

            // Option 2: Direct user to get token using oauth2l (recommended) or manual entry
            // Note: Figma plugins can't receive HTTP redirects, so we can't do a full OAuth flow
            // Instead, users should get a token using oauth2l CLI and paste it in Settings
            this.sendMessage({
                type: 'prompt-access-token',
                message: 'No access token found. Get one using oauth2l:\n\n1. Run: oauth2l fetch --credentials=oauth-credentials.json --scope=https://www.googleapis.com/auth/drive --output_format=bare\n2. Authorize in the browser when prompted\n3. Copy the token from the terminal output\n4. Paste it into Settings → Access Token field below\n5. Click "Save" then "Connect" again\n\nNote: Full drive scope is required for listing children of shared folders.\nSee docs/OAUTH_ALTERNATIVES.md for other methods.'
            });

        } catch (error) {
            console.error('Error connecting to Google Drive:', error);
            this.sendMessage({
                type: 'error',
                message: `Failed to connect: ${error.message}. Please check Settings or see docs/OAUTH_ALTERNATIVES.md for alternative methods.`
            });
        }
    }

    /**
     * Poll backend for OAuth token after user authorization
     * @param {string} backendUrl - Backend service URL
     * @param {string} sessionId - Session ID from backend
     */
    async pollForBackendToken(backendUrl, sessionId) {
        let attempts = 0;
        const maxAttempts = 60; // 2 minutes (60 * 2 seconds)
        const pollInterval = 2000; // Poll every 2 seconds
        
        console.log('🔄 Starting to poll backend for token, sessionId:', sessionId);
        
        const poll = async () => {
            attempts++;
            
            try {
                const response = await fetch(`${backendUrl}/api/google-drive/oauth-token/${sessionId}`);
                
                if (!response.ok) {
                    if (response.status === 404) {
                        console.warn('⚠️  Session not found, may have expired');
                        this.sendMessage({
                            type: 'error',
                            message: 'Authorization session expired. Please try connecting again.'
                        });
                        return;
                    }
                    throw new Error(`Backend returned status ${response.status}`);
                }
                
                const status = await response.json();
                console.log(`🔄 Poll attempt ${attempts}/${maxAttempts}, status:`, status.status);
                
                if (status.status === 'ready') {
                    console.log('✅ Token received from backend!');
                    
                    // Store token
                    await figma.clientStorage.setAsync('googleDriveAccessToken', status.accessToken);
                    if (status.refreshToken) {
                        await figma.clientStorage.setAsync('googleDriveRefreshToken', status.refreshToken);
                    }
                    
                    // Update connection status
                    const folderId = await this.getGoogleDriveFolderId();
                    this.sendMessage({
                        type: 'drive-connection-status',
                        connected: true,
                        folderId: folderId
                    });
                    this.sendMessage({
                        type: 'success',
                        message: '✅ Connected to Google Drive!'
                    });
                    
                    return; // Stop polling
                } else if (status.status === 'error') {
                    console.error('❌ Backend reported error:', status.message);
                    this.sendMessage({
                        type: 'error',
                        message: status.message || 'Authorization failed. Please try again.'
                    });
                    return; // Stop polling
                } else if (status.status === 'pending') {
                    // Continue polling
                    if (attempts < maxAttempts) {
                        setTimeout(poll, pollInterval);
                    } else {
                        console.error('❌ Polling timeout after', maxAttempts, 'attempts');
                        this.sendMessage({
                            type: 'error',
                            message: 'Authorization timeout. Please try connecting again.'
                        });
                    }
                } else {
                    console.warn('⚠️  Unknown status from backend:', status.status);
                    // Continue polling for unknown statuses
                    if (attempts < maxAttempts) {
                        setTimeout(poll, pollInterval);
                    }
                }
            } catch (error) {
                console.error('❌ Error polling backend:', error);
                
                // On network errors, continue polling (might be temporary)
                if (attempts < maxAttempts) {
                    setTimeout(poll, pollInterval);
                } else {
                    this.sendMessage({
                        type: 'error',
                        message: `Failed to connect to backend: ${error.message}. Please check your connection and try again.`
                    });
                }
            }
        };
        
        // Start polling after initial delay
        setTimeout(poll, pollInterval);
    }

    /**
     * Store access token from user input
     */
    async handleStoreAccessToken(msg) {
        try {
            const accessToken = msg.accessToken && typeof msg.accessToken === 'string' ? msg.accessToken.trim() : null;
            
            if (!accessToken) {
                throw new Error('Access token is required');
            }

            console.log('💾 Storing access token...');
            console.log('💾 Token length:', accessToken.length);
            console.log('💾 Token preview:', accessToken.substring(0, 20) + '...');

            // Verify token is valid (but don't fail if verification fails - token might still work)
            const isValid = await this.verifyGoogleDriveToken(accessToken);
            console.log('🔍 Token verification result:', isValid);
            
            if (!isValid) {
                console.warn('⚠️  Token verification failed, but storing anyway (token might still work)');
                // Don't throw - some tokens might not pass verification but still work
            }

            // Store token
            await figma.clientStorage.setAsync('googleDriveAccessToken', accessToken);
            console.log('✅ Access token stored in clientStorage');
            
            // Verify it was saved
            const savedToken = await figma.clientStorage.getAsync('googleDriveAccessToken');
            if (savedToken) {
                console.log('✅ Verified token was saved (length:', savedToken.length + ')');
            } else {
                console.error('❌ Token was not saved!');
                throw new Error('Failed to save token to storage');
            }
            
            // Also store refresh token if provided
            if (msg.refreshToken) {
                await figma.clientStorage.setAsync('googleDriveRefreshToken', msg.refreshToken);
                console.log('✅ Refresh token stored');
            }

            // Update connection status
            const folderId = await this.getGoogleDriveFolderId();
            this.sendMessage({
                type: 'drive-connection-status',
                connected: true,
                folderId: folderId
            });

            this.sendMessage({
                type: 'success',
                message: 'Access token saved successfully!'
            });

        } catch (error) {
            console.error('❌ Error storing access token:', error);
            this.sendMessage({
                type: 'error',
                message: `Failed to store token: ${error.message}`
            });
        }
    }

    /**
     * Store OAuth client ID
     */
    async handleStoreClientId(msg) {
        try {
            const clientId = msg.clientId && typeof msg.clientId === 'string' ? msg.clientId.trim() : null;
            
            if (!clientId) {
                throw new Error('Client ID is required');
            }

            await figma.clientStorage.setAsync('googleDriveClientId', clientId);
            
            this.sendMessage({
                type: 'success',
                message: 'Client ID saved.'
            });

        } catch (error) {
            console.error('Error storing client ID:', error);
            this.sendMessage({
                type: 'error',
                message: `Failed to store client ID: ${error.message}`
            });
        }
    }

    /**
     * Store Google Drive folder ID
     */
    async handleStoreFolderId(msg) {
        try {
            const folderId = msg.folderId && typeof msg.folderId === 'string' ? msg.folderId.trim() : null;
            
            if (!folderId) {
                throw new Error('Folder ID is required');
            }

            console.log('💾 Saving folder ID to clientStorage:', folderId);
            await figma.clientStorage.setAsync('googleDriveFolderId', folderId);
            
            // Verify it was saved
            const savedId = await figma.clientStorage.getAsync('googleDriveFolderId');
            console.log('✅ Verified saved folder ID:', savedId);
            
            // Update connection status with new folder ID
            const accessToken = await figma.clientStorage.getAsync('googleDriveAccessToken');
            if (accessToken) {
                const isValid = await this.verifyGoogleDriveToken(accessToken);
                this.sendMessage({
                    type: 'drive-connection-status',
                    connected: isValid,
                    folderId: savedId
                });
            } else {
                this.sendMessage({
                    type: 'drive-connection-status',
                    connected: false,
                    folderId: savedId
                });
            }
            
            this.sendMessage({
                type: 'success',
                message: `Folder ID saved: ${savedId.substring(0, 12)}...`
            });

        } catch (error) {
            console.error('Error storing folder ID:', error);
            this.sendMessage({
                type: 'error',
                message: `Failed to store folder ID: ${error.message}`
            });
        }
    }

    /**
     * Store service account key JSON
     */
    async handleStoreServiceAccountKey(msg) {
        try {
            const serviceAccountJson = msg.serviceAccountKey && typeof msg.serviceAccountKey === 'string' ? msg.serviceAccountKey.trim() : null;
            
            if (!serviceAccountJson) {
                throw new Error('Service account JSON is required');
            }

            // Validate JSON format
            let parsedKey;
            try {
                parsedKey = JSON.parse(serviceAccountJson);
            } catch (parseError) {
                throw new Error('Invalid JSON format: ' + parseError.message);
            }

            // Validate it's a service account key
            if (!parsedKey.type || parsedKey.type !== 'service_account') {
                throw new Error('Invalid service account key: missing or incorrect type field');
            }

            if (!parsedKey.private_key || !parsedKey.client_email) {
                throw new Error('Invalid service account key: missing required fields (private_key, client_email)');
            }

            // Store the JSON string (will parse when needed)
            await figma.clientStorage.setAsync('googleServiceAccountKey', serviceAccountJson);
            
            this.sendMessage({
                type: 'success',
                message: 'Service account key saved successfully.'
            });

        } catch (error) {
            console.error('Error storing service account key:', error);
            this.sendMessage({
                type: 'error',
                message: `Failed to store service account key: ${error.message}`
            });
        }
    }

    /**
     * Get current settings and send to UI
     * Shows which settings are configured at build time vs user settings
     */
    async handleGetSettings() {
        try {
            const folderId = await this.getGoogleDriveFolderId();
            const accessToken = await figma.clientStorage.getAsync('googleDriveAccessToken');
            
            // Check build-time configuration
            // Note: If constant is set to `undefined` (not configured), typeof check will be false
            // If constant has a value (configured), typeof check will be true
            const buildTimeClientId = (typeof GOOGLE_CLIENT_ID !== 'undefined' && GOOGLE_CLIENT_ID !== null && GOOGLE_CLIENT_ID !== undefined) ? GOOGLE_CLIENT_ID : null;
            const buildTimeBackendUrl = (typeof GOOGLE_AUTH_BACKEND_URL !== 'undefined' && GOOGLE_AUTH_BACKEND_URL !== null && GOOGLE_AUTH_BACKEND_URL !== undefined) ? GOOGLE_AUTH_BACKEND_URL : null;
            const buildTimeServiceAccount = (typeof SERVICE_ACCOUNT_KEY !== 'undefined' && SERVICE_ACCOUNT_KEY !== null && SERVICE_ACCOUNT_KEY !== undefined) ? SERVICE_ACCOUNT_KEY : null;
            const buildTimeFolderId = (typeof GOOGLE_DRIVE_FOLDER_ID !== 'undefined' && GOOGLE_DRIVE_FOLDER_ID !== null && GOOGLE_DRIVE_FOLDER_ID !== undefined) ? GOOGLE_DRIVE_FOLDER_ID : null;
            
            console.log('🔧 Build-time config check:', {
                hasClientId: !!buildTimeClientId,
                hasBackendUrl: !!buildTimeBackendUrl,
                hasServiceAccount: !!buildTimeServiceAccount,
                hasFolderId: !!buildTimeFolderId,
                clientIdType: typeof GOOGLE_CLIENT_ID,
                backendUrlType: typeof GOOGLE_AUTH_BACKEND_URL,
                serviceAccountType: typeof SERVICE_ACCOUNT_KEY,
                folderIdType: typeof GOOGLE_DRIVE_FOLDER_ID
            });
            
            // Get user-overridden settings (only if not set at build time)
            const userClientId = buildTimeClientId ? null : await figma.clientStorage.getAsync('googleDriveClientId');
            const userBackendUrl = buildTimeBackendUrl ? null : await figma.clientStorage.getAsync('googleAuthBackendUrl');
            const userServiceAccountKey = buildTimeServiceAccount ? null : await figma.clientStorage.getAsync('googleServiceAccountKey');
            
            this.sendMessage({
                type: 'settings-loaded',
                folderId: folderId || null,
                // Show user settings only if not configured at build time
                clientId: userClientId || null,
                hasAccessToken: !!accessToken, // Don't send actual token for security
                hasServiceAccountKey: !!userServiceAccountKey, // Don't send actual key for security
                backendUrl: userBackendUrl || null,
                // Indicate which settings are configured at build time
                buildTimeConfig: {
                    hasClientId: !!buildTimeClientId,
                    hasBackendUrl: !!buildTimeBackendUrl,
                    hasServiceAccount: !!buildTimeServiceAccount,
                    hasFolderId: !!buildTimeFolderId
                }
            });
        } catch (error) {
            console.error('Error getting settings:', error);
            this.sendMessage({
                type: 'settings-loaded',
                folderId: null,
                clientId: null,
                hasAccessToken: false,
                hasServiceAccountKey: false,
                backendUrl: null,
                buildTimeConfig: {
                    hasClientId: false,
                    hasBackendUrl: false,
                    hasServiceAccount: false,
                    hasFolderId: false
                }
            });
        }
    }

    /**
     * Store backend URL for JWT signing
     */
    async handleStoreBackendUrl(msg) {
        try {
            const backendUrl = msg.backendUrl && typeof msg.backendUrl === 'string' ? msg.backendUrl.trim() : null;
            
            if (backendUrl) {
                // Validate URL format
                try {
                    new URL(backendUrl);
                } catch (urlError) {
                    throw new Error('Invalid URL format');
                }

                await figma.clientStorage.setAsync('googleAuthBackendUrl', backendUrl);
                
                this.sendMessage({
                    type: 'success',
                    message: 'Backend URL saved.'
                });
            }

        } catch (error) {
            console.error('Error storing backend URL:', error);
            this.sendMessage({
                type: 'error',
                message: `Failed to store backend URL: ${error.message}`
            });
        }
    }

    /**
     * Verify Google Drive access token is valid
     */
    async verifyGoogleDriveToken(accessToken) {
        try {
            console.log('🔍 Verifying access token...');
            const response = await fetch('https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' + accessToken);
            
            if (response.ok) {
                const tokenInfo = await response.json();
                console.log('✅ Token info:', {
                    expires_in: tokenInfo.expires_in,
                    scope: tokenInfo.scope,
                    audience: tokenInfo.audience
                });
                
                // Check if token has drive scope
                const hasDriveScope = tokenInfo.scope && (
                    tokenInfo.scope.includes('drive') || 
                    tokenInfo.scope.includes('https://www.googleapis.com/auth/drive')
                );
                
                if (!hasDriveScope) {
                    console.warn('⚠️  Token does not have drive scope. Scopes:', tokenInfo.scope);
                    console.warn('⚠️  You need drive.readonly or drive scope to list folder contents.');
                }
                
                // Check expiration (expires_in is in seconds)
                if (tokenInfo.expires_in !== undefined) {
                    const minutesLeft = Math.floor(tokenInfo.expires_in / 60);
                    if (minutesLeft < 5) {
                        console.warn(`⚠️  Token expires in ${minutesLeft} minutes. Consider getting a new token soon.`);
                    } else {
                        console.log(`✅ Token valid for ${minutesLeft} more minutes`);
                    }
                }
                
                return true;
            } else {
                const errorText = await response.text();
                console.error('❌ Token verification failed:', response.status);
                
                if (response.status === 401) {
                    console.error('❌ Token expired or invalid. Please get a new access token.');
                    console.error('   See docs/OAUTH_ALTERNATIVES.md for methods:');
                    console.error('   - oauth2l CLI (easiest): brew install oauth2l');
                    console.error('   - Backend service (for teams)');
                    console.error('   - OAuth Playground (manual)');
                } else {
                    console.error('❌ Error response:', errorText);
                }
                return false;
            }
        } catch (error) {
            console.error('❌ Token verification error:', error);
            return false;
        }
    }

    /**
     * Fetch existing presentations from Google Drive
     */
    async handleFetchPresentations() {
        try {
            let accessToken = await figma.clientStorage.getAsync('googleDriveAccessToken');
            const folderId = await this.getGoogleDriveFolderId();
            
            console.log('🔍 Fetching presentations - Token exists:', !!accessToken, 'Folder ID:', folderId);
            
            // If no access token in clientStorage, try service account (if configured)
            if (!accessToken) {
                console.log('🔍 No access token in clientStorage, trying service account...');
                const serviceAccountKey = await this.getServiceAccountKey();
                if (serviceAccountKey) {
                    try {
                        const serviceAccountToken = await this.getServiceAccountAccessToken(serviceAccountKey);
                        if (serviceAccountToken) {
                            console.log('✅ Got access token from service account');
                            accessToken = serviceAccountToken;
                            // Optionally store it for future use (but it may expire)
                            // await figma.clientStorage.setAsync('googleDriveAccessToken', serviceAccountToken);
                        } else {
                            console.warn('⚠️  Service account configured but failed to get token (may need backend for JWT signing)');
                        }
                    } catch (error) {
                        console.error('❌ Error getting token from service account:', error);
                    }
                } else {
                    console.log('ℹ️  No service account configured');
                }
            }
            
            if (!accessToken || !folderId) {
                console.warn('❌ Missing access token or folder ID');
                console.warn('   - Access token:', accessToken ? 'exists' : 'MISSING');
                console.warn('   - Folder ID:', folderId || 'MISSING');
                if (!accessToken) {
                    console.warn('   💡 To get an access token:');
                    console.warn('      1. Use OAuth flow (click "Connect to Google Drive")');
                    console.warn('      2. Or configure backend service for service account JWT signing');
                    console.warn('      3. Or use oauth2l CLI (see docs/OAUTH_ALTERNATIVES.md)');
                }
                this.sendMessage({
                    type: 'presentations-loaded',
                    presentations: []
                });
                return;
            }
            
            console.log('✅ Token and folder ID found, proceeding...');

            // First, verify token is still valid
            console.log('🔍 Verifying token validity...');
            const tokenValid = await this.verifyGoogleDriveToken(accessToken);
            if (!tokenValid) {
                console.error('❌ Token is expired or invalid. Please get a new access token.');
                console.error('   See docs/OAUTH_ALTERNATIVES.md for methods: oauth2l CLI (easiest), backend service, or OAuth Playground.');
                this.sendMessage({
                    type: 'presentations-loaded',
                    presentations: [],
                    error: 'Token expired. Get a new token using: oauth2l CLI (easiest), backend service, or OAuth Playground. See docs/OAUTH_ALTERNATIVES.md for details.'
                });
                return;
            }

            // First, verify we can access the folder itself
            console.log('🔍 Verifying folder access...');
            const folderInfo = await this.getFolderInfo(folderId, accessToken);
            if (folderInfo) {
                console.log('✅ Folder accessible:', folderInfo.name, '(ID:', folderId.substring(0, 12) + '...)');
                if (folderInfo.capabilities) {
                    console.log('📋 Folder capabilities:', {
                        canListChildren: folderInfo.capabilities.canListChildren,
                        canReadRevisions: folderInfo.capabilities.canReadRevisions
                    });
                }
                if (folderInfo.driveId) {
                    console.log('🔍 Folder is in shared drive:', folderInfo.driveId);
                } else if (folderInfo.shared) {
                    console.log('⚠️  Folder is shared but has no driveId - might be a regular shared folder, not a shared drive');
                }
                
                // Verify folder name matches expectations
                const folderNameLower = folderInfo.name.toLowerCase();
                if (folderNameLower === 'presentations') {
                    console.log('✅ Folder name is "presentations" - this should be the correct folder');
                } else {
                    console.warn(`⚠️  Folder name is "${folderInfo.name}" (not "presentations").`);
                    console.warn('   If this is the parent folder, the plugin will look for a "presentations" subfolder.');
                    console.warn('   If this should be the presentations folder, verify the folder ID in Settings.');
                }
                
                // Show folder location in hierarchy
                if (folderInfo.parents && folderInfo.parents.length > 0) {
                    console.log('📂 This folder is inside parent folder(s):', folderInfo.parents);
                    console.log('   If presentations are not here, they might be in a sibling or parent folder.');
                }
            } else {
                console.error('❌ Cannot access folder. Token may be expired or folder ID/permissions are incorrect.');
                this.sendMessage({
                    type: 'presentations-loaded',
                    presentations: [],
                    error: 'Cannot access folder. Token may be expired - try getting a new access token from OAuth Playground.'
                });
                return;
            }

            console.log('🔍 Fetching presentations for folder:', folderId);
            
            // Debug: Try a simple query to see if token can see ANY files
            console.log('🔍 Testing token access - trying to list recent files...');
            try {
                const testUrl = `https://www.googleapis.com/drive/v3/files?pageSize=5&fields=files(name,id)&orderBy=modifiedTime desc&supportsAllDrives=true&includeItemsFromAllDrives=true`;
                const testResponse = await fetch(testUrl, {
                    headers: { 'Authorization': `Bearer ${accessToken}` }
                });
                if (testResponse.ok) {
                    const testData = await testResponse.json();
                    console.log('📋 Token can see files. Recent files count:', testData.files ? testData.files.length : 0);
                } else {
                    console.warn('⚠️  Token test query failed:', testResponse.status);
                }
            } catch (e) {
                console.warn('⚠️  Token test query error:', e.message);
            }
            
            // Strategy: Check if the folder ID points directly to a "presentations" folder
            // or if it's a parent folder that contains a "presentations" subfolder
            
            // Strategy 1: List ALL items (files and folders) first - this is the most reliable approach
            // This helps identify if the folder is empty, contains shortcuts, or has items we're not seeing
            console.log('📋 Strategy 1: Listing ALL items (files and folders) in provided folder...');
            const driveId = folderInfo.driveId || null;
            let allItems = []; // Declare at function scope so it's accessible throughout
            let presentations = []; // Declare at function scope
            
            // First, try a simple query without corpora (for regular shared folders, not shared drives)
            if (!driveId) {
                // Regular shared folder - try simple query first (no corpora parameter)
                console.log('🔍 Trying simple query (no corpora) for regular shared folder...');
                try {
                    const simpleQuery = `'${folderId}' in parents and trashed=false`;
                    const simpleUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(simpleQuery)}&fields=files(id,name,mimeType,shortcutDetails)&orderBy=name&supportsAllDrives=true&includeItemsFromAllDrives=true`;
                    const simpleResponse = await fetch(simpleUrl, {
                        headers: { 'Authorization': `Bearer ${accessToken}` }
                    });
                    
                    if (simpleResponse.ok) {
                        const simpleData = await simpleResponse.json();
                        console.log('📁 Simple query response:', simpleData);
                        if (simpleData.files && simpleData.files.length > 0) {
                            allItems = simpleData.files.map(f => ({
                                id: f.id,
                                name: f.name,
                                mimeType: f.mimeType,
                                isFolder: f.mimeType === 'application/vnd.google-apps.folder',
                                isShortcut: f.mimeType === 'application/vnd.google-apps.shortcut',
                                shortcutTargetId: f.shortcutDetails ? f.shortcutDetails.targetId : null
                            }));
                            console.log(`✅ Found ${allItems.length} item(s) via simple query`);
                        } else {
                            console.log('📁 Simple query returned empty files array');
                        }
                    } else {
                        console.warn('⚠️  Simple query failed with status:', simpleResponse.status);
                    }
                } catch (simpleError) {
                    console.warn('⚠️  Simple query failed:', simpleError.message);
                }
            }
            
            // If simple query didn't work, try the full listAllItemsInFolder method
            if (allItems.length === 0) {
                console.log('🔍 Simple query returned empty, trying full listAllItemsInFolder method...');
                allItems = await this.listAllItemsInFolder(folderId, accessToken, driveId);
            }
            
            console.log(`📋 Total items found: ${allItems.length}`);
            
            // Analyze what we found
            if (allItems.length > 0) {
                const folders = allItems.filter(item => item.isFolder);
                const files = allItems.filter(item => !item.isFolder && !item.isShortcut);
                const shortcuts = allItems.filter(item => item.isShortcut);
                
                console.log(`📊 Item breakdown: ${folders.length} folder(s), ${files.length} file(s), ${shortcuts.length} shortcut(s)`);
                
                if (shortcuts.length > 0) {
                    console.log('🔗 Shortcuts found (first 3):', shortcuts.slice(0, 3).map(s => ({
                        name: s.name,
                        targetId: s.shortcutTargetId
                    })));
                    console.warn('⚠️  Items in this folder are shortcuts. The actual files/folders may be in different locations.');
                }
                
                if (files.length > 0) {
                    console.log('📄 Files found (first 5):', files.slice(0, 5).map(f => ({ name: f.name, mimeType: f.mimeType })));
                }
                
                if (folders.length > 0) {
                    presentations = folders.map(item => item.name).sort();
                    console.log('✅ Presentation folders found:', presentations);
                } else {
                    console.warn('⚠️  Folder contains items but no subfolders. Presentations must be folders, not files.');
                    if (files.length > 0) {
                        console.warn('   Found files instead. If these should be presentations, they need to be folders.');
                    }
                    if (shortcuts.length > 0) {
                        console.warn('   Found shortcuts. The actual presentation folders may be in different locations.');
                    }
                }
            } else {
                console.warn('⚠️  Folder appears to be empty (no items found)');
                console.warn('   This could mean:');
                console.warn('   1. The folder is actually empty');
                console.warn('   2. OAuth scope limitation (drive.readonly cannot query children of shared folders)');
                console.warn('   3. Items exist but are in a different location');
                
                // Try alternative: List all folders the user can see and check their parents
                console.log('🔍 Trying diagnostic: Listing all accessible folders to check parents...');
                try {
                    const altQuery = `mimeType='application/vnd.google-apps.folder' and trashed=false`;
                    const altUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(altQuery)}&fields=files(id,name,parents)&pageSize=100&supportsAllDrives=true&includeItemsFromAllDrives=true`;
                    const altResponse = await fetch(altUrl, {
                        headers: { 'Authorization': `Bearer ${accessToken}` }
                    });
                    
                    if (altResponse.ok) {
                        const altData = await altResponse.json();
                        console.log('📋 Found', altData.files ? altData.files.length : 0, 'total accessible folders');
                        
                        // Filter folders that have our target folder as a parent
                        const childFolders = altData.files ? altData.files.filter(f => {
                            return f.parents && f.parents.includes(folderId);
                        }) : [];
                        
                        console.log('📋 Folders with target folder as parent:', childFolders.length);
                        if (childFolders.length > 0) {
                            presentations = childFolders.map(f => f.name).sort();
                            console.log('✅ Found presentations via diagnostic method:', presentations);
                        } else {
                            console.log('📋 Sample folders found (first 5):', altData.files ? altData.files.slice(0, 5).map(f => ({ 
                                name: f.name, 
                                parents: f.parents,
                                hasTargetAsParent: f.parents && f.parents.includes(folderId)
                            })) : []);
                            
                            // Check if the target folder itself appears in the list
                            const targetFolderInList = altData.files ? altData.files.find(f => f.id === folderId) : null;
                            if (targetFolderInList) {
                                console.log('🔍 Target folder found in list:', {
                                    name: targetFolderInList.name,
                                    id: targetFolderInList.id,
                                    parents: targetFolderInList.parents
                                });
                                console.log('   This folder is a child of:', targetFolderInList.parents);
                                
                                // Check if there's a parent folder that might contain presentations
                                if (targetFolderInList.parents && targetFolderInList.parents.length > 0) {
                                    const parentFolderId = targetFolderInList.parents[0];
                                    console.log('🔍 Checking parent folder for presentations...');
                                    const parentChildren = altData.files ? altData.files.filter(f => {
                                        return f.parents && f.parents.includes(parentFolderId);
                                    }) : [];
                                    console.log(`   Parent folder has ${parentChildren.length} child folder(s):`, parentChildren.map(f => f.name));
                                }
                            } else {
                                console.warn('⚠️  Target folder not found in accessible folders list. This is unusual.');
                            }
                            
                            // Look for folders named "presentations" to help identify the right one
                            const presentationsFolders = altData.files ? altData.files.filter(f => 
                                f.name.toLowerCase() === 'presentations' || f.name.toLowerCase().includes('presentation')
                            ) : [];
                            if (presentationsFolders.length > 0) {
                                console.log('🔍 Found folder(s) with "presentation" in name:', presentationsFolders.map(f => ({
                                    name: f.name,
                                    id: f.id,
                                    parents: f.parents,
                                    isTarget: f.id === folderId
                                })));
                                
                                // If current folder is empty and we found other "presentations" folders, suggest the correct one
                                if (presentationsFolders.length > 1) {
                                    const otherPresentationsFolders = presentationsFolders.filter(f => f.id !== folderId);
                                    if (otherPresentationsFolders.length > 0) {
                                        console.warn('⚠️  Found multiple "presentations" folders. Current folder is empty.');
                                        console.warn('   Other "presentations" folders found:');
                                        otherPresentationsFolders.forEach(f => {
                                            console.warn(`   - ${f.name} (ID: ${f.id})`);
                                            if (f.parents && f.parents.includes('1niY69DtVtp8t7TRY_1Nr1llpKHKBy3F2')) {
                                                console.warn(`     ✅ This one is in the uxync-shared parent folder - use this ID in Settings!`);
                                            }
                                        });
                                    }
                                }
                            }
                            
                            // If folder is empty and has a parent, try looking in the parent for a "presentations" subfolder
                            if (allItems.length === 0 && folderInfo && folderInfo.parents && folderInfo.parents.length > 0) {
                                const parentFolderId = folderInfo.parents[0];
                                console.log('🔍 Current folder is empty. Checking parent folder for "presentations" subfolder...');
                                const parentPresentationsFolders = altData.files ? altData.files.filter(f => 
                                    f.name.toLowerCase() === 'presentations' && 
                                    f.parents && 
                                    f.parents.includes(parentFolderId) &&
                                    f.id !== folderId
                                ) : [];
                                
                                if (parentPresentationsFolders.length > 0) {
                                    console.log('✅ Found "presentations" folder in parent:', parentPresentationsFolders.map(f => ({
                                        name: f.name,
                                        id: f.id
                                    })));
                                    console.warn('⚠️  You are using an empty "presentations" folder.');
                                    console.warn(`   The correct folder ID is: ${parentPresentationsFolders[0].id}`);
                                    console.warn('   Update the Folder ID in Settings to use this ID instead.');
                                }
                            }
                        }
                    }
                } catch (altError) {
                    console.warn('⚠️  Diagnostic query failed:', altError.message);
                }
            }
            
            // If we found folders, check if this looks like a presentations folder
            // (has presentation folders inside) or if it's the parent folder
            if (presentations.length > 0) {
                // Check if any of these folders look like presentations (not named "presentations")
                const hasPresentationFolders = presentations.some(p => p !== 'presentations');
                
                if (hasPresentationFolders) {
                    // This folder ID IS the presentations folder - use it directly
                    console.log('✅ Folder ID points directly to presentations folder');
                    this.sendMessage({
                        type: 'presentations-loaded',
                        presentations: presentations,
                        message: `Found ${presentations.length} presentation(s)`
                    });
                    return;
                }
            }
            
            // Strategy 2: Look for a "presentations" subfolder
            // This handles the case where folder ID is the parent folder, OR if current folder is empty, check parent
            console.log('📋 Strategy 2: Looking for "presentations" subfolder...');
            let presentationsFolderId = await this.findFolder(folderId, 'presentations', accessToken, driveId);
            let correctFolderIdFound = null; // Track if we found the correct folder ID
            
            // If current folder is empty and has a parent, also check the parent folder
            // This allows users to configure either:
            // 1. The presentations folder ID directly (recommended: 1ZsA1vVb7Z-azEqAn5ZMr0Jjre_AWEIDq)
            // 2. The parent folder ID (will find presentations subfolder: 1niY69DtVtp8t7TRY_1Nr1llpKHKBy3F2)
            if (!presentationsFolderId && allItems.length === 0 && folderInfo && folderInfo.parents && folderInfo.parents.length > 0) {
                const parentFolderId = folderInfo.parents[0];
                console.log('🔍 Current folder is empty. Checking parent folder for "presentations" subfolder...');
                console.log('   Parent folder ID:', parentFolderId);
                console.log('   💡 Tip: You can use either:');
                console.log('      - The presentations folder ID directly (recommended)');
                console.log('      - The parent folder ID (will auto-find presentations subfolder)');
                const parentFolderInfo = await this.getFolderInfo(parentFolderId, accessToken);
                const parentDriveId = parentFolderInfo && parentFolderInfo.driveId ? parentFolderInfo.driveId : null;
                presentationsFolderId = await this.findFolder(parentFolderId, 'presentations', accessToken, parentDriveId);
                
                if (presentationsFolderId) {
                    correctFolderIdFound = presentationsFolderId;
                    console.log('✅ Found "presentations" subfolder in parent:', presentationsFolderId.substring(0, 12) + '...');
                    console.warn('⚠️  You are using an empty folder ID.');
                    console.warn(`   The correct presentations folder ID is: ${presentationsFolderId}`);
                    console.warn('   Update the Folder ID in Settings to use this ID for better performance.');
                }
            }
            
            if (presentationsFolderId) {
                console.log('✅ Using "presentations" subfolder:', presentationsFolderId.substring(0, 12) + '...');
                
                // Get info about the presentations subfolder to get its driveId if different
                const presentationsFolderInfo = await this.getFolderInfo(presentationsFolderId, accessToken);
                const presentationsDriveId = presentationsFolderInfo && presentationsFolderInfo.driveId ? presentationsFolderInfo.driveId : driveId;
                
                // List folders inside the presentations subfolder
                presentations = await this.listFoldersInFolder(presentationsFolderId, accessToken, presentationsDriveId);
                console.log('📋 Found presentations in subfolder:', presentations);
                
                // If no folders found, try listing ALL items
                if (presentations.length === 0) {
                    console.log('🔍 No folders found. Checking for all items...');
                    const subfolderAllItems = await this.listAllItemsInFolder(presentationsFolderId, accessToken, presentationsDriveId);
                    console.log('📋 All items in presentations folder:', subfolderAllItems);
                    
                    if (subfolderAllItems.length > 0) {
                        const folders = subfolderAllItems.filter(item => item.isFolder);
                        presentations = folders.map(item => item.name);
                        console.log('📁 Folders found:', presentations);
                    }
                }
            } else {
                // No "presentations" subfolder found
                console.log('⚠️  No "presentations" subfolder found');
            }
            
            if (presentations.length === 0) {
                const folders = allItems.filter(item => item.isFolder);
                const files = allItems.filter(item => !item.isFolder && !item.isShortcut);
                const shortcuts = allItems.filter(item => item.isShortcut);
                
                console.error('❌ No presentation folders found.');
                
                if (allItems.length === 0) {
                    console.error('   The folder appears to be empty or queries return no results.');
                    console.error('   Possible causes:');
                    console.error('   1. Folder is actually empty');
                    console.error('   2. OAuth scope limitation (drive.readonly cannot query children of shared folders)');
                    console.error('   3. Items exist but are in a different location');
                    console.error('');
                    console.error('🔧 SOLUTION: Get a new token with FULL drive scope (not just drive.readonly)');
                    console.error('   1. Run: oauth2l fetch --credentials=oauth-credentials.json \\');
                    console.error('      --scope=https://www.googleapis.com/auth/drive \\');
                    console.error('      --output_format=bare');
                    console.error('   2. Copy the token and update it in Settings → Access Token');
                    console.error('   3. Click Refresh to reload presentations');
                    console.error('');
                    console.error('   Note: drive.readonly can access files directly but cannot query children');
                    console.error('   of shared folders. The full drive scope is required for this operation.');
                } else if (files.length > 0) {
                    console.error(`   Found ${files.length} file(s) but no folders. Presentations must be folders, not files.`);
                } else if (shortcuts.length > 0) {
                    console.error(`   Found ${shortcuts.length} shortcut(s) but no folders. The actual presentation folders`);
                    console.error('   may be in different locations. Shortcuts point to files/folders elsewhere.');
                }
            }
            
            // Build helpful error message
            let errorMessage = null;
            if (presentations.length === 0) {
                if (allItems.length === 0) {
                    if (correctFolderIdFound) {
                        errorMessage = `Using empty folder. Correct folder ID: ${correctFolderIdFound}. Update Folder ID in Settings.`;
                    } else {
                        errorMessage = 'Folder appears empty. Verify: 1) Folder ID is correct (should be the "presentations" folder), 2) Folder actually contains 3 presentation folders, 3) Get new token with full drive scope if using shared folder.';
                    }
                } else {
                    const folders = allItems.filter(item => item.isFolder);
                    const files = allItems.filter(item => !item.isFolder && !item.isShortcut);
                    if (files.length > 0) {
                        errorMessage = `Found ${files.length} file(s) but no folders. Presentations must be folders, not files.`;
                    } else {
                        errorMessage = 'Cannot list folder contents. Get new token with full drive scope: oauth2l fetch --credentials=oauth-credentials.json --scope=https://www.googleapis.com/auth/drive --output_format=bare';
                    }
                }
            }
            
            let userMessage = presentations.length > 0 ? 
                `Found ${presentations.length} presentation(s)` : 
                (allItems.length === 0 ? 
                    (correctFolderIdFound ? 
                        `No items found. Update Folder ID in Settings to: ${correctFolderIdFound}` :
                        'No items found. Check folder ID in Settings - should be the "presentations" folder that contains your 3 presentation folders.') :
                    'No presentation folders found. Check console for details.');
            
            this.sendMessage({
                type: 'presentations-loaded',
                presentations: presentations,
                error: errorMessage,
                message: userMessage
            });
        } catch (error) {
            console.error('Error fetching presentations:', error);
            this.sendMessage({
                type: 'presentations-loaded',
                presentations: [],
                error: error.message
            });
        }
    }

    /**
     * Get folder metadata to verify access
     */
    async getFolderInfo(folderId, accessToken) {
        try {
            const url = `https://www.googleapis.com/drive/v3/files/${folderId}?fields=id,name,mimeType,capabilities,driveId,shared,parents&supportsAllDrives=true`;
            
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Failed to get folder info. Status:', response.status);
                console.error('❌ Error response:', errorText);
                
                // Check if token expired (401)
                if (response.status === 401) {
                    console.error('❌ Token expired or invalid. Please get a new access token.');
                    console.error('   See docs/OAUTH_ALTERNATIVES.md for methods:');
                    console.error('   - oauth2l CLI (easiest): brew install oauth2l');
                    console.error('   - Backend service (for teams)');
                    console.error('   - OAuth Playground (manual)');
                }
                return null;
            }
            
            const folderInfo = await response.json();
            console.log('📋 Full folder info:', JSON.stringify(folderInfo, null, 2));
            if (folderInfo.driveId) {
                console.log('🔍 Folder is in shared drive:', folderInfo.driveId);
            }
            if (folderInfo.parents && folderInfo.parents.length > 0) {
                console.log('📂 Folder is a child of parent folder(s):', folderInfo.parents);
            } else {
                console.log('📂 Folder has no parents (likely a root folder)');
            }
            return folderInfo;
        } catch (error) {
            console.error('❌ Error getting folder info:', error);
            return null;
        }
    }

    /**
     * List all items (files and folders) in a Google Drive folder
     */
    async listAllItemsInFolder(parentFolderId, accessToken, driveId) {
        try {
            // Build query - encodeURIComponent will properly encode spaces as %20 and quotes as %27
            let query = `'${parentFolderId}' in parents and trashed=false`;
            // Include shortcutDetails to detect shortcuts
            // Try with corpora=allDrives first (works for both shared drives and shared folders)
            let url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(name,id,mimeType,shortcutDetails)&orderBy=name&corpora=allDrives&supportsAllDrives=true&includeItemsFromAllDrives=true`;
            
            if (driveId) {
                url += `&driveId=${encodeURIComponent(driveId)}`;
            }
            
            console.log('🔍 Listing ALL items in parent:', parentFolderId);
            if (driveId) {
                console.log('🔍 Using driveId:', driveId);
            }
            
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Failed to list items. Status:', response.status, errorText);
                return [];
            }
            
            const data = await response.json();
            console.log('📁 All items response:', JSON.stringify(data, null, 2));
            console.log('📁 Response status:', response.status);
            
            if (!data.files || data.files.length === 0) {
                return [];
            }
            
            return data.files.map(file => ({
                name: file.name,
                id: file.id,
                mimeType: file.mimeType,
                isFolder: file.mimeType === 'application/vnd.google-apps.folder',
                isShortcut: file.mimeType === 'application/vnd.google-apps.shortcut',
                shortcutTargetId: file.shortcutDetails ? file.shortcutDetails.targetId : null
            }));
        } catch (error) {
            console.error('❌ Error listing all items:', error);
            return [];
        }
    }

    /**
     * List folders in a Google Drive folder
     */
    async listFoldersInFolder(parentFolderId, accessToken, driveId) {
        try {
            // Build query - Google Drive API expects: 'FOLDER_ID' in parents and mimeType='application/vnd.google-apps.folder'
            // encodeURIComponent will properly encode spaces as %20 and quotes as %27
            let query = `'${parentFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`;
            let baseUrl = 'https://www.googleapis.com/drive/v3/files';
            
            // For shared folders, we may need corpora=allDrives to see all accessible files
            // Try with corpora=allDrives first
            let url = `${baseUrl}?q=${encodeURIComponent(query)}&fields=files(name,id)&orderBy=name&corpora=allDrives&supportsAllDrives=true&includeItemsFromAllDrives=true`;
            
            if (driveId) {
                url += `&driveId=${encodeURIComponent(driveId)}`;
            }
            
            console.log('🔍 Listing folders in parent:', parentFolderId);
            console.log('🔍 Trying query WITH supportsAllDrives...');
            if (driveId) {
                console.log('🔍 Using driveId:', driveId);
            }
            console.log('🔍 Query URL:', url);
            
            let response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            
            let data = null;
            if (response.ok) {
                data = await response.json();
                console.log('📁 API Response (with supportsAllDrives):', JSON.stringify(data, null, 2));
                
                // If we got results, use them
                if (data.files && data.files.length > 0) {
                    const folderNames = data.files.map(f => f.name).sort();
                    console.log('✅ Found folders:', folderNames);
                    return folderNames;
                }
            } else {
                const errorText = await response.text();
                console.warn('⚠️  Query with supportsAllDrives failed:', response.status, errorText);
            }
            
            // Fallback: Try different corpora options for regular shared folders
            if (!driveId && (!data || !data.files || data.files.length === 0)) {
                // Try with corpora=user (for user's accessible files including shared)
                console.log('🔍 Trying fallback query with corpora=user...');
                url = `${baseUrl}?q=${encodeURIComponent(query)}&fields=files(name,id)&orderBy=name&corpora=user&supportsAllDrives=true&includeItemsFromAllDrives=true`;
                console.log('🔍 Fallback Query URL (corpora=user):', url);
                
                response = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                
                if (response.ok) {
                    data = await response.json();
                    console.log('📁 API Response (corpora=user):', JSON.stringify(data, null, 2));
                    
                    if (data.files && data.files.length > 0) {
                        const folderNames = data.files.map(f => f.name).sort();
                        console.log('✅ Found folders (corpora=user):', folderNames);
                        return folderNames;
                    }
                }
                
                // Try without corpora and without supportsAllDrives
                console.log('🔍 Trying fallback query WITHOUT corpora and supportsAllDrives...');
                url = `${baseUrl}?q=${encodeURIComponent(query)}&fields=files(name,id)&orderBy=name`;
                console.log('🔍 Fallback Query URL (basic):', url);
                
                response = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                
                if (response.ok) {
                    data = await response.json();
                    console.log('📁 API Response (without supportsAllDrives):', JSON.stringify(data, null, 2));
                    
                    if (data.files && data.files.length > 0) {
                        const folderNames = data.files.map(f => f.name).sort();
                        console.log('✅ Found folders (fallback):', folderNames);
                        return folderNames;
                    }
                } else {
                    const errorText = await response.text();
                    console.error('❌ Fallback query also failed. Status:', response.status);
                    console.error('❌ Error response:', errorText);
                    
                    // If insufficient permissions, log specific error
                    if (response.status === 403) {
                        throw new Error('Insufficient permissions. OAuth token may not have drive.readonly scope. Please get a new token with drive.readonly scope.');
                    }
                    if (response.status === 404) {
                        throw new Error('Folder not found. Check that the folder ID is correct and you have access.');
                    }
                    throw new Error(`Failed to list folders: ${response.status} ${errorText}`);
                }
            } else if (!response.ok && response.status !== 200) {
                // If first query failed with an error (not just empty results)
                const errorText = await response.text();
                console.error('❌ Query failed. Status:', response.status);
                console.error('❌ Error response:', errorText);
                
                if (response.status === 403) {
                    throw new Error('Insufficient permissions. OAuth token may not have drive.readonly scope. Please get a new token with drive.readonly scope.');
                }
                if (response.status === 404) {
                    throw new Error('Folder not found. Check that the folder ID is correct and you have access.');
                }
                throw new Error(`Failed to list folders: ${response.status} ${errorText}`);
            }
            
            console.log('📁 Response status:', response ? response.status : 'unknown');
            console.warn('⚠️  No folders found in parent folder:', parentFolderId);
            return [];
        } catch (error) {
            console.error('❌ Error listing folders:', error);
            console.error('❌ Error stack:', error.stack);
            return [];
        }
    }

    /**
     * Find a folder in Google Drive (does NOT create - only finds existing)
     */
    async findFolder(parentFolderId, folderName, accessToken, driveId) {
        try {
            // Build query - use raw IDs/names, encode the entire query once
            // Google Drive API expects: 'PARENT_ID' in parents and name='FOLDER_NAME' and mimeType='application/vnd.google-apps.folder'
            // Use spaces (not + signs) - encodeURIComponent will convert them to %20
            let query = `'${parentFolderId}' in parents and name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`;
            let url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name)&orderBy=name&supportsAllDrives=true&includeItemsFromAllDrives=true`;
            
            if (driveId) {
                url += `&driveId=${encodeURIComponent(driveId)}`;
            }
            
            console.log('🔍 Searching for folder:', folderName, 'in parent:', parentFolderId);
            if (driveId) {
                console.log('🔍 Using driveId:', driveId);
            }
            console.log('🔍 Query URL:', url);
            
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('📁 Search response:', JSON.stringify(data, null, 2));
                
                if (data.files && data.files.length > 0) {
                    // Found multiple folders with same name - try each one to find the one with content
                    if (data.files.length > 1) {
                        console.log(`⚠️  Found ${data.files.length} folders named "${folderName}". Checking which one has content...`);
                        
                        // Check each folder to see which has items
                        for (let i = 0; i < data.files.length; i++) {
                            const folder = data.files[i];
                            // Get the driveId for this folder if available
                            const folderInfo = await this.getFolderInfo(folder.id, accessToken);
                            const folderDriveId = folderInfo && folderInfo.driveId ? folderInfo.driveId : driveId;
                            const items = await this.listFoldersInFolder(folder.id, accessToken, folderDriveId);
                            console.log(`📋 Folder ${i + 1} (${folder.id}): ${items.length} items found`);
                            
                            if (items.length > 0) {
                                console.log(`✅ Using folder with content: ${folder.id} (${items.length} items)`);
                                return folder.id;
                            }
                        }
                        
                        // If none have content, use the first one (might be empty but at least we found it)
                        console.log('⚠️  No folders have content, using first one');
                    }
                    
                    // Found the folder - return first match
                    const foundFolder = data.files[0];
                    console.log('✅ Found folder:', folderName, 'with ID:', foundFolder.id);
                    return foundFolder.id;
                } else {
                    console.log('⚠️  Folder not found:', folderName);
                    return null;
                }
            } else {
                const errorText = await response.text();
                console.warn('⚠️  Search for folder failed:', response.status, errorText);
                return null;
            }
        } catch (error) {
            console.error('❌ Error finding folder:', error);
            console.error('❌ Error stack:', error.stack);
            return null;
        }
    }

    /**
     * Find or create a folder in Google Drive (creates ONLY if needed during export)
     * WARNING: Only use during export when creating directory structure
     */
    async findOrCreateFolder(parentFolderId, folderName, accessToken) {
        try {
            // First try to find existing folder using findFolder
            const foundFolder = await this.findFolder(parentFolderId, folderName, accessToken);
            if (foundFolder) {
                console.log('✅ Using existing folder:', folderName);
                return foundFolder;
            }
            
            // Folder doesn't exist, create it (ONLY during export - this should be rare)
            console.log('📝 Creating new folder:', folderName, 'in parent:', parentFolderId.substring(0, 12) + '...');
            const createResponse = await fetch('https://www.googleapis.com/drive/v3/files?supportsAllDrives=true', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: folderName,
                    mimeType: 'application/vnd.google-apps.folder',
                    parents: [parentFolderId]
                })
            });
            
            if (createResponse.ok) {
                const newFolder = await createResponse.json();
                console.log('✅ Created new folder:', folderName, 'with ID:', newFolder.id.substring(0, 12) + '...');
                return newFolder.id;
            } else {
                const errorText = await createResponse.text();
                console.error('❌ Failed to create folder:', createResponse.status, errorText);
                return null;
            }
        } catch (error) {
            console.error('❌ Error finding/creating folder:', error);
            return null;
        }
    }

    /**
     * Sanitize presentation name
     */
    sanitizePresentationName(input) {
        if (!input || typeof input !== 'string') {
            return null;
        }
        
        let sanitized = input
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
        
        if (sanitized.length < 3) {
            return null;
        }
        
        if (sanitized.length > 50) {
            sanitized = sanitized.substring(0, 50).replace(/-$/, '');
        }
        
        return sanitized;
    }

    /**
     * Generate unique presentation name
     */
    async generateUniquePresentationName(baseName, existingPresentations, accessToken, presentationsFolderId) {
        let candidate = baseName;
        let counter = 2;
        
        while (existingPresentations.includes(candidate)) {
            candidate = `${baseName}-${counter}`;
            counter++;
            
            if (counter > 1000) {
                throw new Error('Could not generate unique name');
            }
        }
        
        return candidate;
    }

    /**
     * Export to Showroom (Google Drive)
     */
    async handleExportToShowroom(msg) {
        if (this.isGenerating) {
            this.sendMessage({
                type: 'export-to-showroom-error',
                message: 'Export already in progress'
            });
            return;
        }

        this.isGenerating = true;
        this.sendMessage({
            type: 'export-to-showroom-started'
        });

        try {
            const folderId = await this.getGoogleDriveFolderId();
            
            if (!folderId) {
                throw new Error('Google Drive folder ID not configured. Please set it in Settings.');
            }

            // Primary: Use OAuth token (recommended, simplest)
            let accessToken = await figma.clientStorage.getAsync('googleDriveAccessToken');
            if (accessToken) {
                console.log('🔐 Using OAuth access token...');
                // Verify token is still valid
                const isValid = await this.verifyGoogleDriveToken(accessToken);
                if (!isValid) {
                    console.warn('⚠️  OAuth token expired, clearing...');
                    await figma.clientStorage.deleteAsync('googleDriveAccessToken');
                    accessToken = null;
                } else {
                    console.log('✅ OAuth token valid');
                }
            }
            
            // Fallback: Try service account (optional, for managed deployments)
            // Only if not using backend service (backend handles auth)
            if (!accessToken && !backendUrl) {
                const serviceAccountKey = await this.getServiceAccountKey();
                if (serviceAccountKey) {
                    console.log('🔐 Attempting service account authentication...');
                    accessToken = await this.getServiceAccountAccessToken(serviceAccountKey);
                    if (accessToken) {
                        console.log('✅ Service account authentication successful');
                    }
                }
            }
            
            if (!accessToken) {
                throw new Error('Google Drive not connected. Please connect via OAuth (click "Connect to Google Drive") or configure service account in Settings.');
            }

            let presentationName = msg.presentationName;
            const isNewPresentation = msg.isNewPresentation || false;
            const wallName = msg.wallName || 'wall1';
            // Auto-gen slide nav is always enabled for showroom exports
            const autoGenerateNavigation = true;

            // Find existing presentations folder (don't create - just find)
            // If it doesn't exist, we'll create it as part of the directory structure below
            let presentationsFolderId = await this.findFolder(folderId, 'presentations', accessToken);
            
            if (!presentationsFolderId) {
                console.log('📝 "presentations" folder not found, creating it...');
                presentationsFolderId = await this.findOrCreateFolder(folderId, 'presentations', accessToken);
                if (!presentationsFolderId) {
                    throw new Error('Failed to create presentations folder');
                }
            } else {
                console.log('✅ Found existing presentations folder:', presentationsFolderId.substring(0, 12) + '...');
            }
            
            const existingPresentations = await this.listFoldersInFolder(presentationsFolderId, accessToken);

            // Check for conflicts if new presentation
            if (isNewPresentation) {
                if (existingPresentations.includes(presentationName)) {
                    const suggestedName = await this.generateUniquePresentationName(
                        presentationName,
                        existingPresentations,
                        accessToken,
                        presentationsFolderId
                    );
                    
                    this.sendMessage({
                        type: 'presentation-conflict',
                        sanitizedName: presentationName,
                        suggestedName: suggestedName,
                        originalData: msg
                    });
                    this.isGenerating = false;
                    return;
                }
            }

            // Generate HTML
            const nodes = this.getSelectedNodes();
            if (nodes.length === 0) {
                throw new Error('No nodes selected');
            }

            const extractedNodes = this.extractNodeData(nodes);
            const pass1Result = await this.nodeStructurePass.process(extractedNodes);
            const pass2Result = await this.nodeStylesPass.process(extractedNodes, pass1Result);
            
            const htmlFilename = `${wallName}.html`;
            const html = this.wrapInHTMLDocument(
                pass1Result.html,
                pass2Result.css,
                extractedNodes,
                false,
                htmlFilename,
                autoGenerateNavigation
            );

            // Create directory structure
            const presentationFolderId = await this.findOrCreateFolder(presentationsFolderId, presentationName, accessToken);
            const wallFolderId = await this.findOrCreateFolder(presentationFolderId, wallName, accessToken);
            
            // Create subdirectories
            await this.findOrCreateFolder(wallFolderId, 'rules', accessToken);
            await this.findOrCreateFolder(wallFolderId, 'img', accessToken);
            await this.findOrCreateFolder(wallFolderId, 'video', accessToken);
            await this.findOrCreateFolder(wallFolderId, 'lottie', accessToken);

            // Upload HTML file
            await this.uploadFileToGoogleDrive(
                wallFolderId,
                htmlFilename,
                html,
                'text/html',
                accessToken
            );

            // Generate and upload rules.json if media detected
            const videoFiles = this.detectVideoFiles(extractedNodes);
            const imageFiles = this.detectImageFiles(extractedNodes);
            
            if (videoFiles.length > 0 || imageFiles.length > 0) {
                const pass4Result = await this.ruleGenerationPass.process(extractedNodes, pass1Result, htmlFilename);
                const rulesJson = JSON.stringify(pass4Result.rules, null, 2);
                
                const rulesFolderId = await this.findOrCreateFolder(wallFolderId, 'rules', accessToken);
                await this.uploadFileToGoogleDrive(
                    rulesFolderId,
                    'rules.json',
                    rulesJson,
                    'application/json',
                    accessToken
                );
            }

            this.sendMessage({
                type: 'export-to-showroom-complete',
                path: `presentations/${presentationName}/${wallName}/${htmlFilename}`
            });

        } catch (error) {
            console.error('Error exporting to showroom:', error);
            this.sendMessage({
                type: 'export-to-showroom-error',
                message: error.message
            });
        } finally {
            this.isGenerating = false;
        }
    }

    /**
     * Handle export rules to showroom (Google Drive)
     */
    async handleExportRulesToShowroom(msg) {
        if (this.isGenerating) {
            this.sendMessage({
                type: 'export-rules-to-showroom-error',
                message: 'Export already in progress'
            });
            return;
        }

        this.isGenerating = true;
        this.sendMessage({
            type: 'export-rules-to-showroom-started'
        });

        try {
            const folderId = await this.getGoogleDriveFolderId();
            
            if (!folderId) {
                throw new Error('Google Drive folder ID not configured. Please set it in Settings.');
            }

            // Get access token (same logic as handleExportToShowroom)
            let accessToken = await figma.clientStorage.getAsync('googleDriveAccessToken');
            if (accessToken) {
                console.log('🔐 Using OAuth access token...');
                const isValid = await this.verifyGoogleDriveToken(accessToken);
                if (!isValid) {
                    console.warn('⚠️  OAuth token expired, clearing...');
                    await figma.clientStorage.deleteAsync('googleDriveAccessToken');
                    accessToken = null;
                } else {
                    console.log('✅ OAuth token valid');
                }
            }
            
            // Check for backend service (build-time or clientStorage)
            let backendUrl = typeof GOOGLE_AUTH_BACKEND_URL !== 'undefined' ? GOOGLE_AUTH_BACKEND_URL : null;
            if (!backendUrl) {
                backendUrl = await figma.clientStorage.getAsync('googleAuthBackendUrl');
            }
            
            // Only try service account if not using backend (backend handles auth)
            if (!accessToken && !backendUrl) {
                const serviceAccountKey = await this.getServiceAccountKey();
                if (serviceAccountKey) {
                    console.log('🔐 Attempting service account authentication...');
                    accessToken = await this.getServiceAccountAccessToken(serviceAccountKey);
                    if (accessToken) {
                        console.log('✅ Service account authentication successful');
                    }
                }
            }
            
            if (!accessToken) {
                throw new Error('Google Drive not connected. Please connect via OAuth (click "Connect to Google Drive") or configure service account in Settings.');
            }

            const presentationName = msg.presentationName;
            const wallName = msg.wallName || 'wall1';

            if (!presentationName) {
                throw new Error('Presentation name is required');
            }

            // Get selected nodes
            const nodes = this.getSelectedNodes();
            if (nodes.length === 0) {
                throw new Error('No nodes selected. Please select nodes to export.');
            }

            // Extract node data
            const extractedNodes = this.extractNodeData(nodes);
            
            // Generate filename for rules (needed for rule generation)
            const htmlFilename = this.generateIntelligentFilename(extractedNodes);
            
            // Pass 1: Generate HTML structure (needed for metadata)
            const pass1Result = await this.nodeStructurePass.process(extractedNodes);
            
            // Pass 4: Generate rules
            console.log('🎯 Generating event rules (Pass 4)...');
            const pass4Result = await this.ruleGenerationPass.process(extractedNodes, pass1Result, htmlFilename);
            console.log('✅ Pass 4 complete, rules generated:', pass4Result.metadata.ruleCount);
            
            const rulesJson = JSON.stringify(pass4Result.ruleSet, null, 2);
            
            // Navigate folder structure: presentations/{presentationName}/{wallName}/rules/
            const presentationsFolderId = await this.findOrCreateFolder(folderId, 'presentations', accessToken);
            const presentationFolderId = await this.findOrCreateFolder(presentationsFolderId, presentationName, accessToken);
            const wallFolderId = await this.findOrCreateFolder(presentationFolderId, wallName, accessToken);
            const rulesFolderId = await this.findOrCreateFolder(wallFolderId, 'rules', accessToken);
            
            // Upload rules.json
            await this.uploadFileToGoogleDrive(
                rulesFolderId,
                'rules.json',
                rulesJson,
                'application/json',
                accessToken
            );

            this.sendMessage({
                type: 'export-rules-to-showroom-complete',
                path: `presentations/${presentationName}/${wallName}/rules/rules.json`,
                message: `Exported ${pass4Result.metadata.ruleCount} rules to showroom`
            });

        } catch (error) {
            console.error('Error exporting rules to showroom:', error);
            this.sendMessage({
                type: 'export-rules-to-showroom-error',
                message: error.message
            });
        } finally {
            this.isGenerating = false;
        }
    }

    /**
     * Handle presentation conflict resolution
     */
    async handleResolvePresentationConflict(msg) {
        if (msg.useSuggested) {
            // Retry export with suggested name
            const originalData = msg.originalData;
            originalData.presentationName = msg.suggestedName;
            await this.handleExportToShowroom(originalData);
        }
    }

    /**
     * Upload file to Google Drive
     * Uses multipart upload for files under 5MB
     */
    async uploadFileToGoogleDrive(parentFolderId, fileName, fileContent, mimeType, accessToken) {
        try {
            // Check if file exists and delete it first (for updates)
            const existingFileId = await this.findFileInFolder(parentFolderId, fileName, accessToken);
            if (existingFileId) {
                await this.deleteFileFromGoogleDrive(existingFileId, accessToken);
            }

            // Create file metadata
            const metadata = {
                name: fileName,
                parents: [parentFolderId]
            };

            // Create multipart body manually (FormData may not work in Figma plugin environment)
            const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
            const metadataPart = `--${boundary}\r\n` +
                `Content-Type: application/json\r\n\r\n` +
                `${JSON.stringify(metadata)}\r\n`;
            
            const filePart = `--${boundary}\r\n` +
                `Content-Type: ${mimeType}\r\n\r\n` +
                `${fileContent}\r\n` +
                `--${boundary}--`;

            const multipartBody = metadataPart + filePart;

            const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&supportsAllDrives=true', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': `multipart/related; boundary=${boundary}`
                },
                body: multipartBody
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to upload file: ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    }

    /**
     * Find file in folder by name
     */
    async findFileInFolder(parentFolderId, fileName, accessToken) {
        try {
            // Build query - use raw IDs/names, encode the entire query once
            // Use spaces (not + signs) - encodeURIComponent will convert them to %20
            let query = `'${parentFolderId}' in parents and name='${fileName}'`;
            let url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id)`;
            
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.files && data.files.length > 0) {
                    return data.files[0].id;
                }
            }
            return null;
        } catch (error) {
            console.error('Error finding file:', error);
            return null;
        }
    }

    /**
     * Delete file from Google Drive
     */
    async deleteFileFromGoogleDrive(fileId, accessToken) {
        try {
            const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            return response.ok;
        } catch (error) {
            console.error('Error deleting file:', error);
            return false;
        }
    }

    /**
     * Send message to UI
     * @param {Object} message - Message object
     */
    sendMessage(message) {
        figma.ui.postMessage(message);
    }
}

// Initialize the plugin
new FigmaToHTMLPluginCode();