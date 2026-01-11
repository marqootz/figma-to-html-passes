#!/usr/bin/env node

/**
 * Video File Setup Script
 * 
 * This script automatically creates the video directory and copies
 * video files based on the information from your Figma export.
 * 
 * Usage:
 * 1. Export your HTML from Figma
 * 2. Run this script in the same directory as your HTML file
 * 3. The script will automatically detect and copy video files
 */

const fs = require('fs');
const path = require('path');

function setupVideoFiles() {
    console.log('🎬 Video File Setup Script');
    console.log('==========================\n');

    const currentDir = process.cwd();
    console.log(`📁 Working in: ${currentDir}\n`);

    // Find HTML files in the current directory
    const htmlFiles = fs.readdirSync(currentDir).filter(file => file.endsWith('.html'));
    
    if (htmlFiles.length === 0) {
        console.error('❌ No HTML files found in current directory');
        console.log('   Make sure you exported your HTML file from Figma');
        return;
    }

    // Prioritize figma-structure.html, then other HTML files
    const htmlFile = htmlFiles.includes('figma-structure.html') 
        ? 'figma-structure.html' 
        : htmlFiles[0];
    console.log(`📄 Found HTML file: ${htmlFile}`);

    // Read the HTML file to extract video information
    const htmlContent = fs.readFileSync(htmlFile, 'utf8');
    
    // Find video elements with data-video-source attributes
    const videoRegex = /data-video-source="([^"]+)"/g;
    const videoSources = [];
    let match;
    
    while ((match = videoRegex.exec(htmlContent)) !== null) {
        videoSources.push(match[1]);
    }

    if (videoSources.length === 0) {
        console.log('ℹ️  No video files detected in HTML');
        return;
    }

    console.log(`🎥 Found ${videoSources.length} video file(s):`);
    videoSources.forEach((source, index) => {
        const filename = source.split(/[\/\\]/).pop();
        console.log(`   ${index + 1}. ${filename} (from: ${source})`);
    });
    console.log('');

    // Create video directory
    const videoDir = path.join(currentDir, 'video');
    if (!fs.existsSync(videoDir)) {
        fs.mkdirSync(videoDir);
        console.log(`📁 Created video directory: ${videoDir}`);
    } else {
        console.log(`📁 Video directory already exists: ${videoDir}`);
    }

    // Copy video files
    let copiedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    videoSources.forEach((sourcePath, index) => {
        const filename = sourcePath.split(/[\/\\]/).pop();
        const destPath = path.join(videoDir, filename);
        
        console.log(`\n📋 Processing ${index + 1}/${videoSources.length}: ${filename}`);
        
        // Check if source file exists
        if (!fs.existsSync(sourcePath)) {
            console.log(`❌ Source file not found: ${sourcePath}`);
            console.log(`   Please check the path and try again`);
            errorCount++;
            return;
        }

        // Check if destination already exists
        if (fs.existsSync(destPath)) {
            console.log(`⚠️  File already exists: ${destPath}`);
            console.log(`   Skipping copy to avoid overwriting`);
            skippedCount++;
            return;
        }

        try {
            // Copy the file
            fs.copyFileSync(sourcePath, destPath);
            console.log(`✅ Copied: ${sourcePath} → ${destPath}`);
            copiedCount++;
        } catch (error) {
            console.log(`❌ Error copying file: ${error.message}`);
            errorCount++;
        }
    });

    // Show summary
    console.log('\n📊 Summary');
    console.log('==========');
    console.log(`✅ Files copied: ${copiedCount}`);
    console.log(`⚠️  Files skipped: ${skippedCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log(`📁 Total files: ${videoSources.length}`);

    if (copiedCount > 0 || skippedCount > 0) {
        console.log('\n🎉 Video setup complete!');
        console.log('\n📂 Final directory structure:');
        console.log(`${htmlFile}`);
        console.log(`video/`);
        
        if (fs.existsSync(videoDir)) {
            const videoFiles = fs.readdirSync(videoDir);
            videoFiles.forEach(file => {
                console.log(`├── ${file}`);
            });
        }

        console.log('\n🌐 To test your setup:');
        console.log(`   python -m http.server 8000`);
        console.log(`   # Then visit: http://localhost:8000/${htmlFile}`);
    } else {
        console.log('\n⚠️  No files were copied. Please check the source paths.');
    }
}

// Run the setup
try {
    setupVideoFiles();
} catch (error) {
    console.error('❌ Error setting up video files:', error.message);
    process.exit(1);
}
