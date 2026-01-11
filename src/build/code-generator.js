/**
 * Code Generator for Figma to HTML Plugin
 * 
 * Generates the final plugin code by combining modular passes
 * and the main plugin class into a single file.
 */

const fs = require('fs').promises;
const path = require('path');

class CodeGenerator {
    constructor() {
        this.rootDir = path.join(__dirname, '../..');
        this.passesDir = path.join(this.rootDir, 'src', 'passes');
    }

    /**
     * Generate the complete plugin code
     * @returns {string} Generated plugin code
     */
    async generateCode() {
        console.log('🔧 Generating plugin code from modular passes...');
        
        // Read all pass files
        const pass1Code = await this.readPassFile('pass1-node-structure.js');
        const pass2Code = await this.readModularPass('pass2-node-styles');
        const pass4Code = await this.readPassFile('pass4-rule-generation.js');
        
        // Read the main plugin template
        const pluginTemplate = await this.readPluginTemplate();
        
        // Combine everything
        const generatedCode = this.combineCode(pass1Code, pass2Code, pass4Code, pluginTemplate);
        
        console.log('✅ Plugin code generated successfully');
        return generatedCode;
    }

    /**
     * Read a modular pass directory and combine all modules
     * @param {string} passName - Pass directory name
     * @returns {string} Combined pass class code
     */
    async readModularPass(passName) {
        const passDir = path.join(this.passesDir, passName);
        const indexPath = path.join(passDir, 'index.js');
        
        // Read the main index file
        const indexContent = await fs.readFile(indexPath, 'utf8');
        
        // Read all module files and inline them
        const modules = await this.readAllModules(passDir);
        
        // Combine modules with the main class
        return this.combineModularPass(indexContent, modules);
    }

    /**
     * Read all module files in a pass directory
     * @param {string} passDir - Pass directory path
     * @returns {Object} Object with module names as keys and content as values
     */
    async readAllModules(passDir) {
        const modules = {};
        
        // Read extractors
        const extractorsDir = path.join(passDir, 'extractors');
        if (await this.directoryExists(extractorsDir)) {
            const extractorFiles = await fs.readdir(extractorsDir);
            for (const file of extractorFiles) {
                if (file.endsWith('.js')) {
                    const content = await fs.readFile(path.join(extractorsDir, file), 'utf8');
                    modules[`extractors/${file}`] = content;
                }
            }
        }
        
        // Read generators
        const generatorsDir = path.join(passDir, 'generators');
        if (await this.directoryExists(generatorsDir)) {
            const generatorFiles = await fs.readdir(generatorsDir);
            for (const file of generatorFiles) {
                if (file.endsWith('.js')) {
                    const content = await fs.readFile(path.join(generatorsDir, file), 'utf8');
                    modules[`generators/${file}`] = content;
                }
            }
        }
        
        // Read mappers
        const mappersDir = path.join(passDir, 'mappers');
        if (await this.directoryExists(mappersDir)) {
            const mapperFiles = await fs.readdir(mappersDir);
            for (const file of mapperFiles) {
                if (file.endsWith('.js')) {
                    const content = await fs.readFile(path.join(mappersDir, file), 'utf8');
                    modules[`mappers/${file}`] = content;
                }
            }
        }
        
        // Read utils
        const utilsDir = path.join(passDir, 'utils');
        if (await this.directoryExists(utilsDir)) {
            const utilFiles = await fs.readdir(utilsDir);
            for (const file of utilFiles) {
                if (file.endsWith('.js')) {
                    const content = await fs.readFile(path.join(utilsDir, file), 'utf8');
                    modules[`utils/${file}`] = content;
                }
            }
        }
        
        return modules;
    }

    /**
     * Check if a directory exists
     * @param {string} dirPath - Directory path
     * @returns {boolean} True if directory exists
     */
    async directoryExists(dirPath) {
        try {
            const stats = await fs.stat(dirPath);
            return stats.isDirectory();
        } catch {
            return false;
        }
    }

    /**
     * Combine modular pass files into a single class
     * @param {string} indexContent - Main index file content
     * @param {Object} modules - Object with module contents
     * @returns {string} Combined pass class code
     */
    combineModularPass(indexContent, modules) {
        let combined = '';
        
        // Add all module contents first (without module.exports and require statements)
        for (const [modulePath, content] of Object.entries(modules)) {
            // Remove module.exports and require statements
            let cleanContent = content
                .replace(/module\.exports\s*=\s*\{[^}]*\};?\s*$/gm, '')
                .replace(/const\s*\{[^}]*\}\s*=\s*require\([^)]+\);\s*/g, '')
                .replace(/require\([^)]+\);\s*/g, '');
            
            combined += `// ${modulePath}\n${cleanContent}\n\n`;
        }
        
        // Add the main index content (without module.exports and require statements)
        let cleanIndex = indexContent
            .replace(/module\.exports\s*=\s*[^;]+;?\s*$/gm, '')
            .replace(/const\s*\{[^}]*\}\s*=\s*require\([^)]+\);\s*/g, '')
            .replace(/require\([^)]+\);\s*/g, '');
        
        combined += cleanIndex;
        
        return combined;
    }

    /**
     * Read a pass file and extract the class definition
     * @param {string} filename - Pass filename
     * @returns {string} Pass class code
     */
    async readPassFile(filename) {
        const filePath = path.join(this.passesDir, filename);
        const content = await fs.readFile(filePath, 'utf8');
        
        // Extract the class definition (everything except module.exports)
        const lines = content.split('\n');
        const classLines = [];
        let inClass = false;
        
        for (const line of lines) {
            // Skip module.exports line
            if (line.trim().startsWith('module.exports')) {
                break;
            }
            
            // Start collecting from the class declaration
            if (line.includes('class ') && line.includes('Pass')) {
                inClass = true;
            }
            
            if (inClass) {
                classLines.push(line);
            }
        }
        
        return classLines.join('\n');
    }

    /**
     * Read the main plugin template
     * @returns {string} Plugin template code
     */
    async readPluginTemplate() {
        const templatePath = path.join(this.rootDir, 'src', 'plugin', 'figma-to-html-plugin.js');
        
        try {
            return await fs.readFile(templatePath, 'utf8');
        } catch (error) {
            // If template doesn't exist, create a basic one
            return this.createBasicPluginTemplate();
        }
    }

    /**
     * Create a basic plugin template if none exists
     * @returns {string} Basic plugin template
     */
    createBasicPluginTemplate() {
        return `/**
 * Main Plugin Class
 * 
 * Orchestrates the multi-pass system for Figma to HTML conversion
 */
class FigmaToHTMLPluginCode {
    constructor() {
        this.isGenerating = false;
        this.nodeStructurePass = new NodeStructurePass();
        this.nodeStylesPass = new NodeStylesPass();
        this.setupMessageHandlers();
        this.showUI();
    }

    /**
     * Show the plugin UI
     */
    showUI() {
        figma.showUI(__html__, { 
            width: 300, 
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
            switch (msg.type) {
                case 'generate-html':
                    await this.handleGenerateHTML(msg);
                    break;
                case 'get-selection':
                    await this.handleGetSelection();
                    break;
                case 'close-plugin':
                    figma.closePlugin();
                    break;
                default:
                    console.warn('Unknown message type:', msg.type);
            }
        } catch (error) {
            console.error('Error handling message:', error);
            this.sendMessage({
                type: 'error',
                message: error.message
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
            // Get selected nodes
            const nodes = this.getSelectedNodes();
            
            if (nodes.length === 0) {
                throw new Error('No nodes selected. Please select nodes to export.');
            }


            // Extract node data
            const extractedNodes = this.extractNodeData(nodes);
            
            // Pass 1: Generate HTML structure
            const pass1Result = await this.nodeStructurePass.process(extractedNodes);
            
            // Pass 2: Extract and generate CSS styles
            const pass2Result = await this.nodeStylesPass.process(extractedNodes, pass1Result);
            
            // Generate title from filename
            const filename = msg.filename || 'figma-structure.html';
            const title = filename;
            
            // Combine structure and styles into complete HTML document
            const html = this.wrapInHTMLDocument(pass1Result.html, pass2Result.css, title);
            
            // Export to file
            await this.exportToFile(html, msg.filename || 'figma-structure.html');
            
            this.sendMessage({
                type: 'generation-complete',
                message: 'HTML generation complete!',
                metadata: {
                    nodeCount: extractedNodes.length,
                    filename: msg.filename || 'figma-structure.html',
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
     * Extract data from a single node
     * @param {Object} node - Figma node
     * @param {Object} parent - Parent node (if any)
     * @param {Set} processedNodes - Set of processed node IDs
     * @param {number} depth - Current traversal depth
     * @returns {Object} Extracted node data
     */
    extractSingleNode(node, parent = null, processedNodes = new Set(), depth = 0) {
        if (!node || processedNodes.has(node.id)) {
            return null;
        }

        processedNodes.add(node.id);

        const nodeData = {
            id: node.id,
            name: node.name || 'Unnamed',
            type: node.type || 'UNKNOWN',
            visible: node.visible !== false,
            children: [],
            parent: parent
        };

        // Add text content for text nodes
        if (node.type === 'TEXT' && node.characters) {
            nodeData.characters = node.characters;
        }

        // Handle INSTANCE nodes - traverse to component set with nested instance support
        if (node.type === 'INSTANCE') {
            
            // Get the main component from the instance
            const mainComponent = node.mainComponent;
            if (mainComponent) {
                
                // If the main component is a COMPONENT, get its parent COMPONENT_SET
                if (mainComponent.type === 'COMPONENT') {
                    const componentSet = mainComponent.parent;
                    if (componentSet && componentSet.type === 'COMPONENT_SET') {
                        
                        // Update nodeData to reflect the component set structure
                        nodeData.type = 'COMPONENT_SET';
                        nodeData.id = componentSet.id;
                        nodeData.name = componentSet.name;
                        
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
                                    parent: nodeData
                                };
                                
                                // Process the variant's children with nested instance support
                                this.processNodeChildren(variant, variantData, processedNodes, depth + 1);
                                
                                // Add the variant as a child of the component set
                                nodeData.children.push(variantData);
                            }
                        }
                    } else {
                        // If no component set, process the main component directly
                        nodeData.type = 'COMPONENT';
                        nodeData.id = mainComponent.id;
                        nodeData.name = mainComponent.name;
                        this.processNodeChildren(mainComponent, nodeData, processedNodes, depth + 1);
                    }
                }
            }
        } else {
            // Process children for non-instance nodes
            this.processNodeChildren(node, nodeData, processedNodes, depth);
        }

        return nodeData;
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
                    
                    // Process the nested instance recursively - this should expand it to component set
                    const childData = this.extractSingleNode(child, parentData, processedNodes, depth + 1);
                    if (childData) {
                        parentData.children.push(childData);
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
     * Wrap the pass-generated HTML in a complete HTML document
     * @param {string} structureHTML - HTML structure from pass1
     * @param {string} generatedCSS - CSS styles from pass2
     * @param {string} title - Custom title for the HTML document
     * @returns {string} Complete HTML document
     */
    wrapInHTMLDocument(structureHTML, generatedCSS = '', title = 'Figma Structure with Styles') {
        return \`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        /* Base styles */
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8f9fa; padding: 20px; }
        
        /* Debug styles for structure visualization */
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
        
        /* Generated styles from Figma */
        \${generatedCSS}
    </style>
</head>
<body>
    <div class="figma-container">
\${structureHTML}
    </div>
</body>
</html>\`;
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
     * Export HTML to file
     * @param {string} html - HTML content
     * @param {string} filename - Filename
     */
    async exportToFile(html, filename) {
        this.sendMessage({
            type: 'download-file',
            content: html,
            filename: filename,
            mimeType: 'text/html'
        });
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
new FigmaToHTMLPluginCode();`;
    }

    /**
     * Combine all code components into the final plugin code
     * @param {string} pass1Code - Pass 1 class code
     * @param {string} pass2Code - Pass 2 class code
     * @param {string} pass4Code - Pass 4 class code
     * @param {string} pluginCode - Main plugin code
     * @returns {string} Combined plugin code
     */
    combineCode(pass1Code, pass2Code, pass4Code, pluginCode) {
        const header = `/**
 * Figma to HTML Plugin - Generated Code
 * 
 * Generated on: ${new Date().toISOString()}
 * Version: 2.0.0
 * 
 * This file is automatically generated from modular passes.
 * Do not edit directly - modify the source files in src/passes/ and src/plugin/
 */

`;

        // Inject service account key if provided via environment variable
        const serviceAccountKey = this.getServiceAccountKeyFromEnv();
        const configCode = serviceAccountKey ? this.generateConfigCode(serviceAccountKey) : this.generateConfigCode(null);
        
        return header + configCode + '\n\n' + pass1Code + '\n\n' + pass2Code + '\n\n' + pass4Code + '\n\n' + pluginCode;
    }

    /**
     * Get service account key from environment variable
     * Can be set via: GOOGLE_SERVICE_ACCOUNT_JSON environment variable (JSON string)
     * Or from config/service-account.json file (gitignored)
     */
    getServiceAccountKeyFromEnv() {
        // Try environment variable first
        if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
            try {
                return JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
            } catch (error) {
                console.warn('⚠️  Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON from environment:', error.message);
            }
        }
        
        // Try config file (gitignored, for local development)
        try {
            const fs = require('fs');
            const path = require('path');
            const configPath = path.join(this.rootDir, 'config', 'service-account.json');
            if (fs.existsSync(configPath)) {
                const configContent = fs.readFileSync(configPath, 'utf8');
                return JSON.parse(configContent);
            }
        } catch (error) {
            // Config file doesn't exist - that's fine, it's optional
        }
        
        return null;
    }

    /**
     * Get Google Drive folder ID from environment variable
     */
    getGoogleDriveFolderIdFromEnv() {
        return process.env.GOOGLE_DRIVE_FOLDER_ID || null;
    }

    /**
     * Generate configuration code with injected values
     */
    generateConfigCode(serviceAccountKey) {
        const folderId = this.getGoogleDriveFolderIdFromEnv();
        
        let code = '// Configuration injected at build time\n';
        
        if (serviceAccountKey) {
            code += `const SERVICE_ACCOUNT_KEY = ${JSON.stringify(serviceAccountKey)};\n`;
            console.log('✅ Service account key will be injected into plugin');
        } else {
            code += 'const SERVICE_ACCOUNT_KEY = undefined; // Not configured - use Settings to configure\n';
            console.log('ℹ️  Service account key not configured (use Settings or GOOGLE_SERVICE_ACCOUNT_JSON env var)');
        }
        
        if (folderId) {
            code += `const GOOGLE_DRIVE_FOLDER_ID = ${JSON.stringify(folderId)};\n`;
            console.log('✅ Google Drive folder ID will be injected into plugin');
        } else {
            code += 'const GOOGLE_DRIVE_FOLDER_ID = undefined; // Not configured - use Settings to configure\n';
            console.log('ℹ️  Google Drive folder ID not configured (use Settings or GOOGLE_DRIVE_FOLDER_ID env var)');
        }
        
        // Backend URL for JWT signing (optional)
        const backendUrl = process.env.GOOGLE_AUTH_BACKEND_URL || null;
        if (backendUrl) {
            code += `const GOOGLE_AUTH_BACKEND_URL = ${JSON.stringify(backendUrl)};\n`;
        } else {
            code += 'const GOOGLE_AUTH_BACKEND_URL = undefined; // Optional: Backend URL for service account JWT signing\n';
        }
        
        // OAuth Client ID (optional, can be set at build time for universal config)
        const clientId = process.env.GOOGLE_CLIENT_ID || null;
        if (clientId) {
            code += `const GOOGLE_CLIENT_ID = ${JSON.stringify(clientId)};\n`;
        } else {
            code += 'const GOOGLE_CLIENT_ID = undefined; // Optional: OAuth Client ID (can be set via Settings or GOOGLE_CLIENT_ID env var)\n';
        }
        
        code += '\n';
        
        return code;
    }
}

module.exports = CodeGenerator;
