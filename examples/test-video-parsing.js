#!/usr/bin/env node

/**
 * Test Video Path Parsing
 * 
 * This script tests the video path parsing functionality
 * to ensure it correctly extracts filenames and source paths.
 */

// Simulate the extractVideoInfo function from the plugin
function extractVideoInfo(node) {
    if (!isVideoFrame(node)) return null;
    
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

function isVideoFrame(node) {
    return typeof node.name === 'string' && node.name.startsWith('[VIDEO]');
}

// Test cases
const testCases = [
    {
        name: "[VIDEO] /Users/markmanfrey/Downloads/IMG_0843.mp4",
        expected: {
            filename: "IMG_0843.mp4",
            sourcePath: "/Users/markmanfrey/Downloads/IMG_0843.mp4"
        }
    },
    {
        name: "[VIDEO] /Users/markmanfrey/Movies/presentation.webm",
        expected: {
            filename: "presentation.webm",
            sourcePath: "/Users/markmanfrey/Movies/presentation.webm"
        }
    },
    {
        name: "[VIDEO] /path/to/video/tutorial.mov",
        expected: {
            filename: "tutorial.mov",
            sourcePath: "/path/to/video/tutorial.mov"
        }
    },
    {
        name: "[VIDEO] C:\\Users\\markmanfrey\\Videos\\demo.mp4",
        expected: {
            filename: "demo.mp4",
            sourcePath: "C:\\Users\\markmanfrey\\Videos\\demo.mp4"
        }
    },
    {
        name: "Not a video frame",
        expected: null
    },
    {
        name: "[VIDEO] ",
        expected: null
    }
];

console.log('🧪 Testing Video Path Parsing');
console.log('============================\n');

let passed = 0;
let failed = 0;

testCases.forEach((testCase, index) => {
    const node = { name: testCase.name };
    const result = extractVideoInfo(node);
    
    console.log(`Test ${index + 1}: ${testCase.name}`);
    
    if (testCase.expected === null) {
        if (result === null) {
            console.log('✅ PASS - Correctly returned null');
            passed++;
        } else {
            console.log('❌ FAIL - Expected null but got:', result);
            failed++;
        }
    } else {
        if (result && 
            result.filename === testCase.expected.filename && 
            result.sourcePath === testCase.expected.sourcePath) {
            console.log(`✅ PASS - Filename: ${result.filename}, Source: ${result.sourcePath}`);
            passed++;
        } else {
            console.log('❌ FAIL - Expected:', testCase.expected, 'Got:', result);
            failed++;
        }
    }
    console.log('');
});

console.log('📊 Test Results');
console.log('===============');
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);

if (failed === 0) {
    console.log('\n🎉 All tests passed! Video path parsing is working correctly.');
} else {
    console.log('\n⚠️  Some tests failed. Check the implementation.');
    process.exit(1);
}
