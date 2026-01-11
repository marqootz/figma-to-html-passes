/**
 * Pass 4: Rule Generation
 * 
 * Generates event-driven rules for controlling video and Lottie playback
 * based on component set variant navigation.
 */

class RuleGenerationPass {
    constructor() {
        this.rules = [];
    }

    /**
     * Process nodes and generate rules
     * @param {Array} nodes - Extracted nodes from Figma
     * @param {Object} pass1Result - Results from Pass 1
     * @param {string} htmlFilename - Name of the HTML file
     * @returns {Object} Generated rules data
     */
    async process(nodes, pass1Result, htmlFilename) {
        console.log('🎯 Pass 4: Starting rule generation...');
        
        this.rules = [];
        this.htmlFilename = htmlFilename;
        
        // Find all component sets
        const componentSets = this.findComponentSets(nodes);
        
        if (componentSets.length === 0) {
            console.log('ℹ️ No component sets found, skipping rule generation');
            return this.createEmptyRuleSet();
        }
        
        // Process each component set
        for (const componentSet of componentSets) {
            this.processComponentSet(componentSet);
        }
        
        // Create rule set structure
        const ruleSet = this.createRuleSet();
        
        console.log(`✅ Pass 4 complete: Generated ${this.rules.length} rules`);
        
        return {
            ruleSet: ruleSet,
            metadata: {
                ruleCount: this.rules.length,
                componentSetCount: componentSets.length
            }
        };
    }
    
    /**
     * Find all component sets in the node tree
     * @param {Array} nodes - Node array to search
     * @returns {Array} Array of component set nodes
     */
    findComponentSets(nodes) {
        const componentSets = [];
        
        const traverse = (node) => {
            if (node.type === 'COMPONENT_SET') {
                componentSets.push(node);
            }
            
            if (node.children && Array.isArray(node.children)) {
                node.children.forEach(child => traverse(child));
            }
        };
        
        nodes.forEach(node => traverse(node));
        return componentSets;
    }
    
    /**
     * Process a component set and generate rules for its variants
     * @param {Object} componentSet - Component set node
     */
    processComponentSet(componentSet) {
        console.log(`📋 Processing component set: ${componentSet.name}`);
        
        if (!componentSet.children || componentSet.children.length === 0) {
            console.log('⚠️ Component set has no variants');
            return;
        }
        
        // Process each variant (slide)
        componentSet.children.forEach((variant, index) => {
            if (variant.type === 'COMPONENT') {
                this.processVariant(variant, index);
            }
        });
    }
    
    /**
     * Process a single variant and generate rules for its media elements
     * @param {Object} variant - Variant/component node
     * @param {number} index - Index of the variant in sequence
     */
    processVariant(variant, index) {
        console.log(`  📄 Processing variant ${index + 1}: ${variant.name} (ID: ${variant.id})`);
        console.log(`    🔍 Variant has ${variant.children ? variant.children.length : 0} children`);
        
        // Find all videos and Lotties in this variant
        const videos = this.findMediaElements(variant, 'video');
        const lotties = this.findMediaElements(variant, 'lottie');
        
        console.log(`    🎬 Found ${videos.length} videos, ${lotties.length} Lotties`);
        
        if (videos.length > 0) {
            console.log(`    📹 Video nodes:`, videos.map(v => ({ name: v.name, id: v.id })));
        }
        if (lotties.length > 0) {
            console.log(`    🎨 Lottie nodes:`, lotties.map(l => ({ name: l.name, id: l.id })));
        }
        
        // Generate play rules (when variant appears)
        videos.forEach(video => {
            this.rules.push(this.createVideoRule(variant, video, 'play'));
        });
        
        lotties.forEach(lottie => {
            this.rules.push(this.createLottieRule(variant, lottie, 'play'));
        });
        
        // Generate stop rules (when variant disappears)
        videos.forEach(video => {
            this.rules.push(this.createVideoRule(variant, video, 'stop'));
        });
        
        lotties.forEach(lottie => {
            this.rules.push(this.createLottieRule(variant, lottie, 'stop'));
        });
    }
    
    /**
     * Find all media elements of a specific type in a node tree
     * @param {Object} node - Node to search
     * @param {string} mediaType - 'video' or 'lottie'
     * @returns {Array} Array of media element nodes
     */
    findMediaElements(node, mediaType) {
        const mediaElements = [];
        let nodesChecked = 0;
        
        const traverse = (currentNode, depth = 0) => {
            nodesChecked++;
            const indent = '      ' + '  '.repeat(depth);
            
            // Check if this node is a media element
            if (mediaType === 'video' && this.isVideoNode(currentNode)) {
                console.log(`${indent}✅ Found video: ${currentNode.name} (${currentNode.id})`);
                mediaElements.push(currentNode);
            } else if (mediaType === 'lottie' && this.isLottieNode(currentNode)) {
                console.log(`${indent}✅ Found lottie: ${currentNode.name} (${currentNode.id})`);
                mediaElements.push(currentNode);
            }
            
            // Traverse children
            if (currentNode.children && Array.isArray(currentNode.children)) {
                currentNode.children.forEach(child => traverse(child, depth + 1));
            }
        };
        
        traverse(node);
        console.log(`    🔍 Checked ${nodesChecked} nodes for ${mediaType}`);
        return mediaElements;
    }
    
    /**
     * Check if a node is a video node
     * @param {Object} node - Node to check
     * @returns {boolean}
     */
    isVideoNode(node) {
        return node.name && 
               typeof node.name === 'string' && 
               node.name.startsWith('[VIDEO]');
    }
    
    /**
     * Check if a node is a Lottie node
     * @param {Object} node - Node to check
     * @returns {boolean}
     */
    isLottieNode(node) {
        return node.name && 
               typeof node.name === 'string' && 
               node.name.startsWith('[LOTTIE]');
    }
    
    /**
     * Create a video rule
     * @param {Object} variant - Variant node (source)
     * @param {Object} video - Video node (target)
     * @param {string} action - 'play' or 'stop'
     * @returns {Object} Rule object
     */
    createVideoRule(variant, video, action) {
        const videoId = `video-${video.id.replace(/[:.]/g, '-')}`;
        const sourceEvent = action === 'play' ? 'figma_element_appeared' : 'figma_element_disappeared';
        const targetEvent = action === 'play' ? 'play_video' : 'stop_video';
        
        return {
            name: `${action}_video_${video.name}`,
            sourceHtml: this.htmlFilename,
            sourceEvent: sourceEvent,
            sourceFigmaId: video.id, // Use media element ID as source
            targetHtml: this.htmlFilename,
            targetEvent: targetEvent,
            targetFigmaId: video.id, // Use media element ID as target (same as source)
            videoId: videoId,
            id: this.generateRuleId(video.id, video.id, action)
        };
    }
    
    /**
     * Create a Lottie rule
     * @param {Object} variant - Variant node (source)
     * @param {Object} lottie - Lottie node (target)
     * @param {string} action - 'play' or 'stop'
     * @returns {Object} Rule object
     */
    createLottieRule(variant, lottie, action) {
        const lottieId = `lottie-${lottie.id.replace(/[:.]/g, '-')}`;
        const sourceEvent = action === 'play' ? 'figma_element_appeared' : 'figma_element_disappeared';
        const targetEvent = action === 'play' ? 'play_lottie' : 'stop_lottie';
        
        return {
            name: `${action}_lottie_${lottie.name}`,
            sourceHtml: this.htmlFilename,
            sourceEvent: sourceEvent,
            sourceFigmaId: lottie.id, // Use media element ID as source
            targetHtml: this.htmlFilename,
            targetEvent: targetEvent,
            targetFigmaId: lottie.id, // Use media element ID as target (same as source)
            lottieId: lottieId,
            id: this.generateRuleId(lottie.id, lottie.id, action)
        };
    }
    
    /**
     * Generate a unique rule ID
     * @param {string} variantId - Variant ID
     * @param {string} mediaId - Media element ID
     * @param {string} action - Action type
     * @returns {string} Unique rule ID
     */
    generateRuleId(variantId, mediaId, action) {
        const combined = `${variantId}-${mediaId}-${action}`;
        return combined.replace(/[:.]/g, '-');
    }
    
    /**
     * Create the rule set structure
     * @returns {Object} Rule set object compatible with rule-sets.json
     */
    createRuleSet() {
        const timestamp = Date.now();
        const ruleSetId = `custom-${timestamp}`;
        const baseFilename = this.htmlFilename.replace(/\.html$/, '');
        
        return {
            categories: {
                interaction: {
                    name: "Interaction Rules",
                    description: "Rules for user interactions between clients",
                    color: "#667eea"
                },
                feedback: {
                    name: "Feedback Rules",
                    description: "Rules for providing feedback between clients",
                    color: "#764ba2"
                },
                audio: {
                    name: "Audio Rules",
                    description: "Rules for triggering audio playback",
                    color: "#ff6b6b"
                }
            },
            ruleSets: {
                [ruleSetId]: {
                    name: baseFilename,
                    description: `Auto-generated rules for ${this.htmlFilename}`,
                    category: "interaction",
                    project: "Unassigned",
                    tags: ["auto-generated", "figma-export"],
                    rules: this.rules,
                    variables: {},
                    isTemplate: false,
                    active: true
                }
            }
        };
    }
    
    /**
     * Create an empty rule set (when no component sets found)
     * @returns {Object} Empty rule set structure
     */
    createEmptyRuleSet() {
        return {
            ruleSet: {
                categories: {},
                ruleSets: {}
            },
            metadata: {
                ruleCount: 0,
                componentSetCount: 0
            }
        };
    }
}

module.exports = { RuleGenerationPass };

