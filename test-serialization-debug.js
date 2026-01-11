// Test script to debug the serialization process
function serializeNodesForJS(nodes) {
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
            
            // Debug logging for transition data
            if (key === 'transition' && value) {
                console.log('DEBUG: Serializing transition data for node:', obj.id, 'transition:', value);
            }
            
            result[key] = sanitize(value);
        }
        
        seen.delete(obj);
        return result;
    };
    
    return JSON.stringify(sanitize(nodes), null, 2);
}

// Test with mock variant data that has transition
const mockVariantData = {
    id: '7950:1870',
    name: 'Property 1=start',
    type: 'COMPONENT',
    visible: true,
    children: [],
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
    ],
    transition: {
        type: 'SMART_ANIMATE',
        easing: {
            type: 'EASE_IN_AND_OUT_BACK'
        },
        duration: 0.30000001192092896
    }
};

console.log('=== Testing serialization ===');
console.log('Input variant data:');
console.log('- Has transition:', !!mockVariantData.transition);
console.log('- Transition data:', mockVariantData.transition);

const serialized = serializeNodesForJS(mockVariantData);
const parsed = JSON.parse(serialized);

console.log('\nAfter serialization:');
console.log('- Has transition:', !!parsed.transition);
console.log('- Transition data:', parsed.transition);
