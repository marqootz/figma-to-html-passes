// Test script to debug transition data extraction
const fs = require('fs');

// Read the HTML file
const html = fs.readFileSync('examples/figma-structure.html', 'utf8');

// Extract the extractedNodesData JSON
const match = html.match(/const extractedNodesData = (\[.*?\]);/s);
if (match) {
    const extractedNodesData = JSON.parse(match[1]);
    
    // Find the specific nodes we're looking for
    function findNodeById(nodes, id) {
        for (const node of nodes) {
            if (node.id === id) {
                return node;
            }
            if (node.children) {
                const found = findNodeById(node.children, id);
                if (found) return found;
            }
        }
        return null;
    }
    
    const node1870 = findNodeById(extractedNodesData, '7950:1870');
    const node1874 = findNodeById(extractedNodesData, '7950:1874');
    
    console.log('Node 7950:1870:');
    console.log('- Has transition:', !!node1870?.transition);
    console.log('- Transition data:', node1870?.transition);
    console.log('- Has reactions:', !!node1870?.reactions);
    console.log('- Reactions:', JSON.stringify(node1870?.reactions, null, 2));
    
    console.log('\nNode 7950:1874:');
    console.log('- Has transition:', !!node1874?.transition);
    console.log('- Transition data:', node1874?.transition);
    console.log('- Has reactions:', !!node1874?.reactions);
    console.log('- Reactions:', JSON.stringify(node1874?.reactions, null, 2));
} else {
    console.log('Could not find extractedNodesData in HTML');
}
