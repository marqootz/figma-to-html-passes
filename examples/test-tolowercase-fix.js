#!/usr/bin/env node

/**
 * Test toLowerCase Fix
 * 
 * This script tests the fixes for toLowerCase() being called on undefined values.
 */

// Test the sanitizeClassName function
function sanitizeClassName(name, type) {
    if (!name || typeof name !== 'string') return `figma-${type ? type.toLowerCase() : 'node'}`;
    
    return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-=]/g, '') // Keep = and numbers
        .replace(/\s+/g, '-')
        .replace(/=+/g, '-') // Convert = to -
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '') || `figma-${type ? type.toLowerCase() : 'node'}`;
}

// Test cases
const testCases = [
    { name: "My Component", type: "COMPONENT", expected: "my-component" },
    { name: "Button-Text", type: "TEXT", expected: "button-text" },
    { name: undefined, type: "FRAME", expected: "figma-frame" },
    { name: null, type: "FRAME", expected: "figma-frame" },
    { name: "", type: "FRAME", expected: "figma-frame" },
    { name: 123, type: "FRAME", expected: "figma-frame" },
    { name: {}, type: "FRAME", expected: "figma-frame" },
    { name: "Special@Characters#", type: "COMPONENT", expected: "specialcharacters" },
    { name: undefined, type: undefined, expected: "figma-node" },
    { name: "Valid Name", type: undefined, expected: "valid-name" }
];

console.log('🧪 Testing toLowerCase Fix');
console.log('=========================\n');

let passed = 0;
let failed = 0;

testCases.forEach((testCase, index) => {
    try {
        const result = sanitizeClassName(testCase.name, testCase.type);
        
        if (result === testCase.expected) {
            console.log(`✅ Test ${index + 1}: PASS`);
            console.log(`   Input: name="${testCase.name}", type="${testCase.type}"`);
            console.log(`   Output: "${result}"`);
            passed++;
        } else {
            console.log(`❌ Test ${index + 1}: FAIL`);
            console.log(`   Input: name="${testCase.name}", type="${testCase.type}"`);
            console.log(`   Expected: "${testCase.expected}"`);
            console.log(`   Got: "${result}"`);
            failed++;
        }
    } catch (error) {
        console.log(`❌ Test ${index + 1}: ERROR`);
        console.log(`   Input: name="${testCase.name}", type="${testCase.type}"`);
        console.log(`   Error: ${error.message}`);
        failed++;
    }
    console.log('');
});

console.log('📊 Test Results');
console.log('===============');
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);

if (failed === 0) {
    console.log('\n🎉 All tests passed! toLowerCase() fixes are working correctly.');
} else {
    console.log('\n⚠️  Some tests failed. Check the implementation.');
    process.exit(1);
}
