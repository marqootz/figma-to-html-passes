// Test script to simulate the exact variant creation process
function extractTransitionFromReactions(reactions) {
    console.log('DEBUG: extractTransitionFromReactions called with:', reactions);
    if (!reactions || !Array.isArray(reactions)) {
        console.log('DEBUG: No reactions or not array, returning null');
        return null;
    }
    
    // Find the first reaction with a transition
    for (let i = 0; i < reactions.length; i++) {
        const reaction = reactions[i];
        console.log('DEBUG: Checking reaction', i, ':', reaction);
        if (reaction.action && reaction.action.transition) {
            console.log('DEBUG: Found transition in reaction', i, ':', reaction.action.transition);
            return reaction.action.transition;
        }
    }
    
    console.log('DEBUG: No transition found in any reaction');
    return null;
}

// Simulate the exact variant creation process from the plugin
const variant = {
    id: '7950:1870',
    name: 'Property 1=start',
    type: 'COMPONENT',
    visible: true,
    width: 310,
    height: 310,
    x: 0,
    y: 0,
    rotation: 0,
    opacity: 1,
    blendMode: 'PASS_THROUGH',
    reactions: [
        {
            action: {
                type: 'NODE',
                destinationId: '7950:1874',
                navigation: 'CHANGE_TO',
                transition: {
                    type: 'SMART_ANIMATE',
                    easing: {
                        type: 'EASE_IN_AND_OUT_BACK'
                    },
                    duration: 0.30000001192092896
                },
                resetVideoPosition: false
            },
            trigger: {
                type: 'AFTER_TIMEOUT',
                timeout: 0.800000011920929
            }
        }
    ]
};

console.log('=== Testing variant creation process ===');
console.log('Original variant reactions:', variant.reactions);

// Simulate the exact variantData creation from the plugin
const variantData = {
    id: variant.id,
    name: variant.name || 'Unnamed Variant',
    type: 'COMPONENT',
    visible: variant.visible !== false,
    children: [],
    parent: null, // componentSetData would be here
    // Extract reactions from the variant
    reactions: variant.reactions || [],
    
    // Extract transition data from reactions
    transition: (() => {
        console.log('DEBUG: Creating variant', variant.id, 'with reactions:', variant.reactions);
        const transition = extractTransitionFromReactions(variant.reactions);
        console.log('DEBUG: Extracted transition for variant', variant.id, ':', transition);
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
    blendMode: variant.blendMode
};

console.log('\n=== Final variant data ===');
console.log('- Has transition:', !!variantData.transition);
console.log('- Transition data:', variantData.transition);
console.log('- Has reactions:', !!variantData.reactions);
console.log('- Reactions:', variantData.reactions);
