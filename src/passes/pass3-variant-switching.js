/**
 * Pass 3: Variant Switching System
 * Handles interactive variant switching with compartmentalized event management
 */

class VariantSwitcher {
    constructor() {
        this.currentVariants = new Map(); // componentSetId -> currentVariantId
        this.activeEventHandlers = new Map(); // componentSetId -> Set of handlers
        this.componentSets = new Map(); // componentSetId -> componentSet data
        this.initialized = false;
    }

    /**
     * Initialize the variant switching system
     * @param {Object} extractedNodes - Full node hierarchy from Pass 1
     */
    initialize(extractedNodes) {
        // Find all component sets and their variants
        this.findComponentSets(extractedNodes);
        
        // Set default variants and hide non-default ones
        this.setDefaultVariants();
        
        // Bind initial events
        this.bindInitialEvents();
        
        this.initialized = true;
    }

    /**
     * Find all component sets and their variants in the node hierarchy
     * @param {Object} node - Current node to process
     * @param {string} parentComponentSetId - Parent component set ID if nested
     */
    findComponentSets(node, parentComponentSetId = null) {
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

        // Recursively process children
        if (node.children) {
            const currentComponentSetId = node.type === 'COMPONENT_SET' ? node.id : parentComponentSetId;
            node.children.forEach(child => {
                this.findComponentSets(child, currentComponentSetId);
            });
        }
    }

    /**
     * Get the default variant for a component set
     * @param {Object} componentSet - Component set data
     * @returns {string} Default variant ID
     */
    getDefaultVariant(componentSet) {
        // Check for Figma's default variant in variant properties
        if (componentSet.node.variantProperties) {
            const defaultProperty = componentSet.node.variantProperties.find(prop => 
                prop.property === 'Property 1' && prop.defaultValue
            );
            if (defaultProperty) {
                const defaultVariant = componentSet.variants.find(variant => 
                    variant.variantProperties && 
                    variant.variantProperties.some(vp => 
                        vp.property === 'Property 1' && vp.value === defaultProperty.defaultValue
                    )
                );
                if (defaultVariant) {
                    return defaultVariant.id;
                }
            }
        }

        // Fallback to first variant
        return (componentSet.variants && componentSet.variants[0] && componentSet.variants[0].id) || null;
    }

    /**
     * Set default variants and hide non-default ones
     */
    setDefaultVariants() {
        this.componentSets.forEach((componentSet, componentSetId) => {
            const defaultVariantId = this.getDefaultVariant(componentSet);
            
            if (defaultVariantId) {
                // Set current variant
                this.currentVariants.set(componentSetId, defaultVariantId);
                
                // Show default variant, hide others
                this.showVariant(defaultVariantId);
                componentSet.variants.forEach(variant => {
                    if (variant.id !== defaultVariantId) {
                        this.hideVariant(variant.id);
                    }
                });
                
            }
        });
    }

    /**
     * Show a variant by ID
     * @param {string} variantId - Variant ID to show
     */
    showVariant(variantId) {
        const element = document.querySelector(`[data-figma-id="${variantId}"]`);
        if (element) {
            element.style.display = 'block';
            element.setAttribute('data-variant-active', 'true');
        }
    }

    /**
     * Hide a variant by ID
     * @param {string} variantId - Variant ID to hide
     */
    hideVariant(variantId) {
        const element = document.querySelector(`[data-figma-id="${variantId}"]`);
        if (element) {
            element.style.display = 'none';
            element.removeAttribute('data-variant-active');
        }
    }

    /**
     * Bind initial events for all component sets
     */
    bindInitialEvents() {
        this.componentSets.forEach((componentSet, componentSetId) => {
            const currentVariantId = this.currentVariants.get(componentSetId);
            if (currentVariantId) {
                this.bindEventsForVariant(componentSetId, currentVariantId);
            }
        });
    }

    /**
     * Bind events for a specific variant
     * @param {string} componentSetId - Component set ID
     * @param {string} variantId - Variant ID
     */
    bindEventsForVariant(componentSetId, variantId) {
        // Clean up existing events for this component set
        this.cleanupEventsForComponentSet(componentSetId);
        
        const variantElement = document.querySelector(`[data-figma-id="${variantId}"]`);
        if (!variantElement) return;

        // Find all clickable elements in this variant
        const clickableElements = variantElement.querySelectorAll('[data-variant-trigger]');
        
        const handlers = new Set();
        clickableElements.forEach(element => {
            const handler = (e) => this.handleVariantSwitch(e, componentSetId);
            element.addEventListener('click', handler);
            handlers.add({ element, handler });
        });

        this.activeEventHandlers.set(componentSetId, handlers);
    }

    /**
     * Clean up events for a specific component set
     * @param {string} componentSetId - Component set ID
     */
    cleanupEventsForComponentSet(componentSetId) {
        const handlers = this.activeEventHandlers.get(componentSetId);
        if (handlers) {
            handlers.forEach(({ element, handler }) => {
                element.removeEventListener('click', handler);
            });
            handlers.clear();
        }
    }

    /**
     * Handle variant switch click event
     * @param {Event} event - Click event
     * @param {string} componentSetId - Component set ID
     */
    handleVariantSwitch(event, componentSetId) {
        event.preventDefault();
        event.stopPropagation();

        const targetElement = event.target;
        const targetVariantId = targetElement.getAttribute('data-variant-target');
        
        if (!targetVariantId) {
            console.warn('No target variant specified for click event');
            return;
        }

        
        // Switch to target variant
        this.switchToVariant(componentSetId, targetVariantId);
    }

    /**
     * Switch to a specific variant
     * @param {string} componentSetId - Component set ID
     * @param {string} targetVariantId - Target variant ID
     */
    switchToVariant(componentSetId, targetVariantId) {
        const componentSet = this.componentSets.get(componentSetId);
        if (!componentSet) {
            console.warn(`Component set not found: ${componentSetId}`);
            return;
        }

        // Validate target variant exists in this component set
        const targetVariant = componentSet.variants.find(v => v.id === targetVariantId);
        if (!targetVariant) {
            console.warn(`Target variant not found in component set: ${targetVariantId}`);
            return;
        }

        // Hide current variant
        const currentVariantId = this.currentVariants.get(componentSetId);
        if (currentVariantId) {
            this.hideVariant(currentVariantId);
        }

        // Show target variant
        this.showVariant(targetVariantId);

        // Update current variant
        this.currentVariants.set(componentSetId, targetVariantId);

        // Re-bind events for the new variant
        this.bindEventsForVariant(componentSetId, targetVariantId);

    }

    /**
     * Get current variant for a component set
     * @param {string} componentSetId - Component set ID
     * @returns {string|null} Current variant ID
     */
    getCurrentVariant(componentSetId) {
        return this.currentVariants.get(componentSetId) || null;
    }

    /**
     * Clean up all event handlers
     */
    destroy() {
        this.activeEventHandlers.forEach((handlers, componentSetId) => {
            this.cleanupEventsForComponentSet(componentSetId);
        });
        this.activeEventHandlers.clear();
        this.currentVariants.clear();
        this.componentSets.clear();
        this.initialized = false;
    }
}

// Global instance
window.variantSwitcher = new VariantSwitcher();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Will be initialized by the HTML generation system
    });
} else {
    // DOM already ready
}

module.exports = { VariantSwitcher };
