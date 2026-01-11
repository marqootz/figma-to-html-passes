#!/usr/bin/env node

/**
 * Video File Organizer Script
 * 
 * This script helps organize downloaded files from the Figma to HTML plugin
 * into the correct directory structure for video support.
 * 
 * Usage:
 * 1. Download all files from the Figma plugin
 * 2. Run this script in the directory where you downloaded the files
 * 3. The script will create the video directory and move files appropriately
 */

const fs = require('fs');
const path = require('path');

function organizeVideoFiles() {
    console.log('🎬 Figma to HTML Video File Organizer');
    console.log('=====================================\n');

    const currentDir = process.cwd();
    console.log(`📁 Working in: ${currentDir}\n`);

    // Find the HTML file
    const htmlFiles = fs.readdirSync(currentDir).filter(file => file.endsWith('.html'));
    
    if (htmlFiles.length === 0) {
        console.error('❌ No HTML files found in current directory');
        console.log('   Make sure you downloaded the HTML file from the Figma plugin');
        return;
    }

    const htmlFile = htmlFiles[0];
    console.log(`📄 Found HTML file: ${htmlFile}`);

    // Create video directory
    const videoDir = path.join(currentDir, 'video');
    if (!fs.existsSync(videoDir)) {
        fs.mkdirSync(videoDir);
        console.log(`📁 Created video directory: ${videoDir}`);
    } else {
        console.log(`📁 Video directory already exists: ${videoDir}`);
    }

    // Find and move video-related files
    const files = fs.readdirSync(currentDir);
    let movedCount = 0;

    files.forEach(file => {
        const filePath = path.join(currentDir, file);
        
        // Skip directories and HTML files
        if (fs.statSync(filePath).isDirectory() || file.endsWith('.html')) {
            return;
        }

        // Move README.md to video directory
        if (file === 'README.md') {
            const newPath = path.join(videoDir, file);
            if (!fs.existsSync(newPath)) {
                fs.renameSync(filePath, newPath);
                console.log(`📝 Moved ${file} to video directory`);
                movedCount++;
            } else {
                console.log(`⚠️  ${file} already exists in video directory`);
            }
        }

        // Move video placeholder files to video directory
        if (file.endsWith('.txt') && file !== 'README.md') {
            const newPath = path.join(videoDir, file);
            if (!fs.existsSync(newPath)) {
                fs.renameSync(filePath, newPath);
                console.log(`🎥 Moved ${file} to video directory`);
                movedCount++;
            } else {
                console.log(`⚠️  ${file} already exists in video directory`);
            }
        }
    });

    console.log(`\n✅ Organization complete! Moved ${movedCount} files to video directory`);

    // Show final structure
    console.log('\n📂 Final directory structure:');
    console.log(`${htmlFile}`);
    console.log(`video/`);
    
    if (fs.existsSync(videoDir)) {
        const videoFiles = fs.readdirSync(videoDir);
        videoFiles.forEach(file => {
            console.log(`├── ${file}`);
        });
    }

    // Show next steps
    console.log('\n🎯 Next steps:');
    console.log('1. Replace the .txt placeholder files in the video/ directory with your actual video files');
    console.log('2. Keep the same filenames (remove the .txt extension)');
    console.log('3. Serve the HTML file with a web server (not file:// protocol)');
    console.log('\n💡 Example web server commands:');
    console.log('   python -m http.server 8000');
    console.log('   npx serve .');
    console.log('   php -S localhost:8000');
}

// Run the organizer
try {
    organizeVideoFiles();
} catch (error) {
    console.error('❌ Error organizing files:', error.message);
    process.exit(1);
}
