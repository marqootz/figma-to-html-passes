#!/usr/bin/env node

/**
 * Test Symbol Conversion Fix
 * 
 * This script tests the fixes for Symbol-to-string conversion errors.
 */

// Test the sanitizeClassName function with various input types
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

// Test the String() conversion function
function safeStringConversion(value) {
    return String(value);
}

// Test the color conversion function
function safeColorConversion(rgba) {
    if (!rgba || typeof rgba !== 'object') return '#000000';
    
    const r = (typeof rgba.r === 'number' && !isNaN(rgba.r)) ? Math.round(rgba.r * 255) : 0;
    const g = (typeof rgba.g === 'number' && !isNaN(rgba.g)) ? Math.round(rgba.g * 255) : 0;
    const b = (typeof rgba.b === 'number' && !isNaN(rgba.b)) ? Math.round(rgba.b * 255) : 0;
    const a = (typeof rgba.a === 'number' && !isNaN(rgba.a)) ? rgba.a : 1;
    
    const toHex = (n) => {
        if (typeof n !== 'number' || isNaN(n)) return '00';
        const hex = Math.round(n).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    
    if (a === 1) {
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    } else {
        return `rgba(${r}, ${g}, ${b}, ${a})`;
    }
}

// Test cases for Symbol conversion
const testCases = [
    // String conversion tests
    { type: 'string_conversion', input: Symbol('test'), expected: 'Symbol(test)' },
    { type: 'string_conversion', input: Symbol(), expected: 'Symbol()' },
    { type: 'string_conversion', input: 123, expected: '123' },
    { type: 'string_conversion', input: null, expected: 'null' },
    { type: 'string_conversion', input: undefined, expected: 'undefined' },
    { type: 'string_conversion', input: {}, expected: '[object Object]' },
    
    // Sanitize class name tests
    { type: 'sanitize_class', name: Symbol('component'), nodeType: 'COMPONENT', expected: 'figma-component' },
    { type: 'sanitize_class', name: Symbol(), nodeType: 'FRAME', expected: 'figma-frame' },
    { type: 'sanitize_class', name: 'Valid Name', nodeType: 'COMPONENT', expected: 'valid-name' },
    
    // Color conversion tests
    { type: 'color_conversion', input: { r: Symbol('red'), g: 0.5, b: 0.5, a: 1 }, expected: '#008080' },
    { type: 'color_conversion', input: { r: 1, g: Symbol('green'), b: 0.5, a: 0.5 }, expected: 'rgba(255, 0, 128, 0.5)' },
    { type: 'color_conversion', input: null, expected: '#000000' },
    { type: 'color_conversion', input: undefined, expected: '#000000' },
];

console.log('🧪 Testing Symbol Conversion Fixes');
console.log('==================================\n');

let passed = 0;
let failed = 0;

testCases.forEach((testCase, index) => {
    try {
        let result;
        
        switch (testCase.type) {
            case 'string_conversion':
                result = safeStringConversion(testCase.input);
                break;
            case 'sanitize_class':
                result = sanitizeClassName(testCase.name, testCase.nodeType);
                break;
            case 'color_conversion':
                result = safeColorConversion(testCase.input);
                break;
            default:
                throw new Error(`Unknown test type: ${testCase.type}`);
        }
        
        if (result === testCase.expected) {
            console.log(`✅ Test ${index + 1}: PASS`);
            console.log(`   Type: ${testCase.type}`);
            console.log(`   Input: ${String(testCase.input)}`);
            console.log(`   Output: "${result}"`);
            passed++;
        } else {
            console.log(`❌ Test ${index + 1}: FAIL`);
            console.log(`   Type: ${testCase.type}`);
            console.log(`   Input: ${String(testCase.input)}`);
            console.log(`   Expected: "${testCase.expected}"`);
            console.log(`   Got: "${result}"`);
            failed++;
        }
    } catch (error) {
        console.log(`❌ Test ${index + 1}: ERROR`);
        console.log(`   Type: ${testCase.type}`);
        console.log(`   Input: ${String(testCase.input)}`);
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
    console.log('\n🎉 All tests passed! Symbol conversion fixes are working correctly.');
} else {
    console.log('\n⚠️  Some tests failed. Check the implementation.');
    process.exit(1);
}
