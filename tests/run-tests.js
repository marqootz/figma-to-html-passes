/**
 * Test Runner for Figma to HTML Passes
 * 
 * This script runs comprehensive tests on the multi-pass HTML generation system.
 */

const path = require('path');
const fs = require('fs').promises;

// Import the main system
const FigmaToHTMLPasses = require('../src/main');

// Import test data
const {
    sampleFigmaNodes,
    sampleFigmaReactions,
    sampleMetadata,
    complexSampleNodes,
    complexSampleReactions
} = require('./test-data/sample-figma-data');

class TestRunner {
    constructor() {
        this.tests = [];
        this.results = {
            passed: 0,
            failed: 0,
            total: 0,
            errors: []
        };
        this.outputDir = path.join(__dirname, 'output');
    }

    /**
     * Run all tests
     */
    async runAllTests() {
        console.log('🧪 Starting Figma to HTML Passes Test Suite...\n');
        
        // Ensure output directory exists
        await this.ensureOutputDirectory();
        
        // Register all tests
        this.registerTests();
        
        // Run tests
        for (const test of this.tests) {
            await this.runTest(test);
        }
        
        // Generate report
        await this.generateReport();
        
        console.log('\n✅ Test suite completed!');
        console.log(`📊 Results: ${this.results.passed}/${this.results.total} tests passed`);
        
        if (this.results.failed > 0) {
            console.log(`❌ ${this.results.failed} tests failed`);
            process.exit(1);
        }
    }

    /**
     * Register all test cases
     */
    registerTests() {
        // Basic functionality tests
        this.addTest('Basic HTML Generation', this.testBasicHTMLGeneration);
        this.addTest('CSS Generation', this.testCSSGeneration);
        this.addTest('JavaScript Generation', this.testJavaScriptGeneration);
        this.addTest('Document Assembly', this.testDocumentAssembly);
        
        // Component tests
        this.addTest('Component Set Handling', this.testComponentSetHandling);
        this.addTest('Variant Management', this.testVariantManagement);
        this.addTest('Nested Components', this.testNestedComponents);
        
        // Interaction tests
        this.addTest('Click Interactions', this.testClickInteractions);
        this.addTest('Hover Interactions', this.testHoverInteractions);
        this.addTest('Navigation Flow', this.testNavigationFlow);
        
        // Edge case tests
        this.addTest('Empty Input Handling', this.testEmptyInputHandling);
        this.addTest('Invalid Data Handling', this.testInvalidDataHandling);
        this.addTest('Large Dataset Handling', this.testLargeDatasetHandling);
        
        // Performance tests
        this.addTest('Performance Benchmark', this.testPerformanceBenchmark);
        
        // Output validation tests
        this.addTest('HTML Validation', this.testHTMLValidation);
        this.addTest('CSS Validation', this.testCSSValidation);
        this.addTest('JavaScript Validation', this.testJavaScriptValidation);
    }

    /**
     * Add a test to the test suite
     * @param {string} name - Test name
     * @param {Function} testFn - Test function
     */
    addTest(name, testFn) {
        this.tests.push({ name, testFn });
    }

    /**
     * Run a single test
     * @param {Object} test - Test object
     */
    async runTest(test) {
        this.results.total++;
        console.log(`🔍 Running: ${test.name}...`);
        
        try {
            const startTime = Date.now();
            await test.testFn();
            const duration = Date.now() - startTime;
            
            this.results.passed++;
            console.log(`✅ ${test.name} passed (${duration}ms)`);
        } catch (error) {
            this.results.failed++;
            this.results.errors.push({
                test: test.name,
                error: error.message,
                stack: error.stack
            });
            console.log(`❌ ${test.name} failed: ${error.message}`);
        }
    }

    /**
     * Test basic HTML generation
     */
    async testBasicHTMLGeneration() {
        const generator = new FigmaToHTMLPasses();
        const result = await generator.generateHTML(sampleFigmaNodes, sampleFigmaReactions);
        
        if (!result || typeof result !== 'string') {
            throw new Error('HTML generation returned invalid result');
        }
        
        if (!result.includes('<!DOCTYPE html>')) {
            throw new Error('Generated HTML missing DOCTYPE declaration');
        }
        
        if (!result.includes('<html')) {
            throw new Error('Generated HTML missing html tag');
        }
        
        if (!result.includes('<body')) {
            throw new Error('Generated HTML missing body tag');
        }
        
        // Save output for inspection
        await this.saveTestOutput('basic-html-generation.html', result);
    }

    /**
     * Test CSS generation
     */
    async testCSSGeneration() {
        const generator = new FigmaToHTMLPasses();
        
        // We need to access the CSS generator directly for this test
        const cssGenerator = generator.cssGenerator;
        const domSkeleton = await generator.domBuilder.buildSkeleton(sampleFigmaNodes);
        const cssResult = await cssGenerator.generateCSS(domSkeleton, sampleFigmaNodes);
        
        if (!cssResult || !cssResult.css) {
            throw new Error('CSS generation returned invalid result');
        }
        
        if (!cssResult.css.includes('/* Base Styles */')) {
            throw new Error('Generated CSS missing base styles');
        }
        
        if (!cssResult.css.includes('position: absolute')) {
            throw new Error('Generated CSS missing positioning styles');
        }
        
        // Save output for inspection
        await this.saveTestOutput('css-generation.css', cssResult.css);
    }

    /**
     * Test JavaScript generation
     */
    async testJavaScriptGeneration() {
        const generator = new FigmaToHTMLPasses();
        
        // Access the interaction manager directly
        const interactionManager = generator.interactionManager;
        const domSkeleton = await generator.domBuilder.buildSkeleton(sampleFigmaNodes);
        const jsResult = await interactionManager.generateInteractions(domSkeleton, sampleFigmaReactions);
        
        if (!jsResult || !jsResult.javascript) {
            throw new Error('JavaScript generation returned invalid result');
        }
        
        if (!jsResult.javascript.includes('class EventHandlerManager')) {
            throw new Error('Generated JavaScript missing event handler manager');
        }
        
        if (!jsResult.javascript.includes('addEventListener')) {
            throw new Error('Generated JavaScript missing event listeners');
        }
        
        // Save output for inspection
        await this.saveTestOutput('javascript-generation.js', jsResult.javascript);
    }

    /**
     * Test document assembly
     */
    async testDocumentAssembly() {
        const generator = new FigmaToHTMLPasses();
        
        // Access the document assembler directly
        const documentAssembler = generator.documentAssembler;
        const dataExtractor = generator.dataExtractor;
        
        const extractedData = await dataExtractor.extractAll(sampleFigmaNodes, sampleFigmaReactions);
        const domSkeleton = await generator.domBuilder.buildSkeleton(extractedData.nodes);
        const cssData = await generator.cssGenerator.generateCSS(domSkeleton, extractedData.nodes);
        const interactionData = await generator.interactionManager.generateInteractions(domSkeleton, extractedData.reactions);
        
        const assemblyResult = await documentAssembler.assemble(domSkeleton, cssData, interactionData, extractedData.metadata);
        
        if (!assemblyResult || !assemblyResult.html) {
            throw new Error('Document assembly returned invalid result');
        }
        
        if (!assemblyResult.html.includes('<!DOCTYPE html>')) {
            throw new Error('Assembled document missing DOCTYPE');
        }
        
        if (!assemblyResult.html.includes('<style>')) {
            throw new Error('Assembled document missing CSS');
        }
        
        if (!assemblyResult.html.includes('<script>')) {
            throw new Error('Assembled document missing JavaScript');
        }
        
        // Save output for inspection
        await this.saveTestOutput('document-assembly.html', assemblyResult.html);
    }

    /**
     * Test component set handling
     */
    async testComponentSetHandling() {
        const generator = new FigmaToHTMLPasses();
        const result = await generator.generateHTML(sampleFigmaNodes, sampleFigmaReactions);
        
        if (!result.includes('COMPONENT_SET')) {
            throw new Error('Component sets not properly handled');
        }
        
        if (!result.includes('data-variant')) {
            throw new Error('Component variants not properly handled');
        }
    }

    /**
     * Test variant management
     */
    async testVariantManagement() {
        const generator = new FigmaToHTMLPasses();
        const result = await generator.generateHTML(sampleFigmaNodes, sampleFigmaReactions);
        
        if (!result.includes('variant-')) {
            throw new Error('Variant classes not generated');
        }
        
        if (!result.includes('setComponentVariant')) {
            throw new Error('Variant management JavaScript not generated');
        }
    }

    /**
     * Test nested components
     */
    async testNestedComponents() {
        const generator = new FigmaToHTMLPasses();
        const result = await generator.generateHTML(complexSampleNodes, complexSampleReactions);
        
        if (!result.includes('nested')) {
            throw new Error('Nested components not properly handled');
        }
    }

    /**
     * Test click interactions
     */
    async testClickInteractions() {
        const generator = new FigmaToHTMLPasses();
        const result = await generator.generateHTML(sampleFigmaNodes, sampleFigmaReactions);
        
        if (!result.includes('ON_CLICK')) {
            throw new Error('Click interactions not generated');
        }
        
        if (!result.includes('addEventListener')) {
            throw new Error('Event listeners not generated');
        }
    }

    /**
     * Test hover interactions
     */
    async testHoverInteractions() {
        const generator = new FigmaToHTMLPasses();
        const result = await generator.generateHTML(sampleFigmaNodes, sampleFigmaReactions);
        
        if (!result.includes('ON_HOVER')) {
            throw new Error('Hover interactions not generated');
        }
    }

    /**
     * Test navigation flow
     */
    async testNavigationFlow() {
        const generator = new FigmaToHTMLPasses();
        const result = await generator.generateHTML(sampleFigmaNodes, sampleFigmaReactions);
        
        if (!result.includes('NAVIGATE')) {
            throw new Error('Navigation flow not generated');
        }
        
        if (!result.includes('navigationHandler')) {
            throw new Error('Navigation handler not generated');
        }
    }

    /**
     * Test empty input handling
     */
    async testEmptyInputHandling() {
        const generator = new FigmaToHTMLPasses();
        
        try {
            const result = await generator.generateHTML([], []);
            if (!result || result.length === 0) {
                throw new Error('Empty input should return valid HTML structure');
            }
        } catch (error) {
            // This is expected for empty input
            if (!error.message.includes('Invalid') && !error.message.includes('empty')) {
                throw error;
            }
        }
    }

    /**
     * Test invalid data handling
     */
    async testInvalidDataHandling() {
        const generator = new FigmaToHTMLPasses();
        
        try {
            await generator.generateHTML(null, null);
            throw new Error('Should have thrown error for null input');
        } catch (error) {
            // This is expected
            if (!error.message) {
                throw new Error('Should have thrown meaningful error');
            }
        }
    }

    /**
     * Test large dataset handling
     */
    async testLargeDatasetHandling() {
        const generator = new FigmaToHTMLPasses();
        
        // Create a large dataset
        const largeNodes = [];
        for (let i = 0; i < 100; i++) {
            largeNodes.push({
                id: `node-${i}`,
                name: `Node ${i}`,
                type: 'FRAME',
                visible: true,
                absoluteBoundingBox: { x: i * 10, y: i * 10, width: 100, height: 100 },
                children: []
            });
        }
        
        const startTime = Date.now();
        const result = await generator.generateHTML(largeNodes, []);
        const duration = Date.now() - startTime;
        
        if (duration > 5000) { // 5 seconds
            throw new Error(`Large dataset processing took too long: ${duration}ms`);
        }
        
        if (!result) {
            throw new Error('Large dataset processing failed');
        }
    }

    /**
     * Test performance benchmark
     */
    async testPerformanceBenchmark() {
        const generator = new FigmaToHTMLPasses();
        
        const iterations = 10;
        const times = [];
        
        for (let i = 0; i < iterations; i++) {
            const startTime = Date.now();
            await generator.generateHTML(sampleFigmaNodes, sampleFigmaReactions);
            const duration = Date.now() - startTime;
            times.push(duration);
        }
        
        const averageTime = times.reduce((a, b) => a + b, 0) / times.length;
        const maxTime = Math.max(...times);
        
        console.log(`    📊 Average time: ${averageTime.toFixed(2)}ms`);
        console.log(`    📊 Max time: ${maxTime}ms`);
        
        if (averageTime > 1000) { // 1 second
            throw new Error(`Performance too slow: average ${averageTime.toFixed(2)}ms`);
        }
    }

    /**
     * Test HTML validation
     */
    async testHTMLValidation() {
        const generator = new FigmaToHTMLPasses();
        const result = await generator.generateHTML(sampleFigmaNodes, sampleFigmaReactions);
        
        // Basic HTML structure validation
        const requiredTags = ['<!DOCTYPE html>', '<html', '<head', '<body', '</html>'];
        
        for (const tag of requiredTags) {
            if (!result.includes(tag)) {
                throw new Error(`HTML validation failed: missing ${tag}`);
            }
        }
        
        // Check for proper nesting
        const htmlTagCount = (result.match(/<html/g) || []).length;
        const bodyTagCount = (result.match(/<body/g) || []).length;
        
        if (htmlTagCount !== 1) {
            throw new Error('HTML validation failed: multiple html tags');
        }
        
        if (bodyTagCount !== 1) {
            throw new Error('HTML validation failed: multiple body tags');
        }
    }

    /**
     * Test CSS validation
     */
    async testCSSValidation() {
        const generator = new FigmaToHTMLPasses();
        const result = await generator.generateHTML(sampleFigmaNodes, sampleFigmaReactions);
        
        // Extract CSS from the result
        const cssMatch = result.match(/<style>([\s\S]*?)<\/style>/);
        if (!cssMatch) {
            throw new Error('CSS validation failed: no style tag found');
        }
        
        const css = cssMatch[1];
        
        // Check for basic CSS properties
        const requiredProperties = ['position:', 'width:', 'height:', 'display:'];
        
        for (const property of requiredProperties) {
            if (!css.includes(property)) {
                throw new Error(`CSS validation failed: missing ${property}`);
            }
        }
    }

    /**
     * Test JavaScript validation
     */
    async testJavaScriptValidation() {
        const generator = new FigmaToHTMLPasses();
        const result = await generator.generateHTML(sampleFigmaNodes, sampleFigmaReactions);
        
        // Extract JavaScript from the result
        const jsMatch = result.match(/<script>([\s\S]*?)<\/script>/);
        if (!jsMatch) {
            throw new Error('JavaScript validation failed: no script tag found');
        }
        
        const js = jsMatch[1];
        
        // Check for basic JavaScript functionality
        const requiredFeatures = ['addEventListener', 'class ', 'function'];
        
        for (const feature of requiredFeatures) {
            if (!js.includes(feature)) {
                throw new Error(`JavaScript validation failed: missing ${feature}`);
            }
        }
    }

    /**
     * Ensure output directory exists
     */
    async ensureOutputDirectory() {
        try {
            await fs.access(this.outputDir);
        } catch {
            await fs.mkdir(this.outputDir, { recursive: true });
        }
    }

    /**
     * Save test output to file
     * @param {string} filename - Output filename
     * @param {string} content - Content to save
     */
    async saveTestOutput(filename, content) {
        const filepath = path.join(this.outputDir, filename);
        await fs.writeFile(filepath, content, 'utf8');
    }

    /**
     * Generate test report
     */
    async generateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                total: this.results.total,
                passed: this.results.passed,
                failed: this.results.failed,
                successRate: (this.results.passed / this.results.total * 100).toFixed(2) + '%'
            },
            errors: this.results.errors
        };
        
        const reportPath = path.join(this.outputDir, 'test-report.json');
        await fs.writeFile(reportPath, JSON.stringify(report, null, 2), 'utf8');
        
        console.log(`\n📋 Test report saved to: ${reportPath}`);
    }
}

// Run tests if this file is executed directly
if (require.main === module) {
    const testRunner = new TestRunner();
    testRunner.runAllTests().catch(error => {
        console.error('❌ Test runner failed:', error);
        process.exit(1);
    });
}

module.exports = TestRunner;
