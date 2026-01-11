// Test script to debug the extraction process directly
const FigmaToHTMLPluginCode = require('./src/plugin/figma-to-html-plugin.js');

// Create a mock Figma node with reactions and transition data
const mockVariant = {
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

// Create plugin instance
const plugin = new FigmaToHTMLPluginCode();

console.log('=== Testing extractTransitionFromReactions ===');
const extractedTransition = plugin.extractTransitionFromReactions(mockVariant.reactions);
console.log('Extracted transition:', extractedTransition);

console.log('\n=== Testing variant data creation ===');
const variantData = {
    id: mockVariant.id,
    name: mockVariant.name || 'Unnamed Variant',
    type: 'COMPONENT',
    visible: mockVariant.visible !== false,
    children: [],
    reactions: mockVariant.reactions || [],
    transition: plugin.extractTransitionFromReactions(mockVariant.reactions)
};

console.log('Variant data created:');
console.log('- Has transition:', !!variantData.transition);
console.log('- Transition data:', variantData.transition);
console.log('- Has reactions:', !!variantData.reactions);
console.log('- Reactions:', variantData.reactions);
