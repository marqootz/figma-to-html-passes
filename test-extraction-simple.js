// Simple test to debug the extractTransitionFromReactions method
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

// Test with the actual reaction data from our HTML
const testReactions = [
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
        actions: [
            {
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
            }
        ],
        trigger: {
            type: 'AFTER_TIMEOUT',
            timeout: 0.800000011920929
        }
    }
];

console.log('=== Testing extractTransitionFromReactions ===');
const result = extractTransitionFromReactions(testReactions);
console.log('Final result:', result);
