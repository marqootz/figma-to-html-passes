/**
 * Simple Build Script for Figma to HTML Plugin
 * 
 * Builds the plugin with a clean, focused approach.
 * Loads backend/.env before building so GOOGLE_CLIENT_ID, GOOGLE_DRIVE_FOLDER_ID,
 * GOOGLE_AUTH_BACKEND_URL, etc. are available without manual export.
 */

const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');

// Load backend/.env into process.env so plugin build picks up values (no manual export needed)
const backendEnvPath = path.join(__dirname, 'backend', '.env');
if (fsSync.existsSync(backendEnvPath)) {
  const content = fsSync.readFileSync(backendEnvPath, 'utf8');
  content.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const eq = trimmed.indexOf('=');
      if (eq > 0) {
        const key = trimmed.slice(0, eq).trim();
        let val = trimmed.slice(eq + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) process.env[key] = val;
      }
    }
  });
  console.log('📋 Loaded env from backend/.env for plugin build');
}

const CodeGenerator = require('./src/build/code-generator');

class SimpleBuilder {
    constructor() {
        this.rootDir = __dirname;
        this.distDir = path.join(this.rootDir, 'dist');
        this.pluginDir = path.join(this.distDir, 'plugin');
    }

    async build() {
        console.log('🔨 Starting simple build...');
        
        try {
            // Clean previous builds
            await this.clean();
            
            // Create directories
            await this.createDirectories();
            
        // Build plugin
        await this.buildPlugin();
        
        // Copy to figma-plugin for development
        await this.copyToDevelopment();
        
        console.log('✅ Build complete!');
        console.log(`📦 Output: ${this.distDir}`);
        console.log('🔧 Development files copied to figma-plugin/');
            
        } catch (error) {
            console.error('❌ Build failed:', error);
            process.exit(1);
        }
    }

    async clean() {
        console.log('🧹 Cleaning previous builds...');
        try {
            await fs.rm(this.distDir, { recursive: true, force: true });
        } catch (error) {
            // Directory might not exist, that's okay
        }
    }

    async createDirectories() {
        console.log('📁 Creating directories...');
        await fs.mkdir(this.distDir, { recursive: true });
        await fs.mkdir(this.pluginDir, { recursive: true });
    }

    async buildPlugin() {
        console.log('🔌 Building plugin...');
        
        // Copy manifest
        await this.copyFile('figma-plugin/manifest.json', 'plugin/manifest.json');
        
        // Copy UI
        await this.copyFile('figma-plugin/ui.html', 'plugin/ui.html');
        
        // Copy icon if it exists
        const iconPath = path.join(this.rootDir, 'figma-plugin', 'icon.png');
        try {
            await fs.access(iconPath);
            await this.copyFile('figma-plugin/icon.png', 'plugin/icon.png');
            console.log('✅ Icon copied');
        } catch (error) {
            console.log('ℹ️  No icon found (optional)');
        }
        
        // Process and generate code
        await this.processPluginCode();
        
        console.log('✅ Plugin built');
    }

    async processPluginCode() {
        console.log('⚙️ Processing plugin code...');
        
        // Generate code from modular passes
        // The CodeGenerator will handle injecting config values from environment variables
        const codeGenerator = new CodeGenerator();
        const generatedCode = await codeGenerator.generateCode();
        
        // Write to dist
        const outputPath = path.join(this.pluginDir, 'code.js');
        await fs.writeFile(outputPath, generatedCode, 'utf8');
    }


    async copyFile(source, destination) {
        const sourcePath = path.join(this.rootDir, source);
        const destPath = path.join(this.distDir, destination);
        
        // Create destination directory if it doesn't exist
        const destDir = path.dirname(destPath);
        await fs.mkdir(destDir, { recursive: true });
        
        await fs.copyFile(sourcePath, destPath);
    }

    async copyToDevelopment() {
        console.log('🔧 Copying to development directory...');
        
        // Copy generated files back to figma-plugin for development
        const devCodePath = path.join(this.rootDir, 'figma-plugin', 'code.js');
        const devManifestPath = path.join(this.rootDir, 'figma-plugin', 'manifest.json');
        const devUIPath = path.join(this.rootDir, 'figma-plugin', 'ui.html');
        
        const distCodePath = path.join(this.pluginDir, 'code.js');
        const distManifestPath = path.join(this.pluginDir, 'manifest.json');
        const distUIPath = path.join(this.pluginDir, 'ui.html');
        
        await fs.copyFile(distCodePath, devCodePath);
        await fs.copyFile(distManifestPath, devManifestPath);
        await fs.copyFile(distUIPath, devUIPath);
        
        // Copy icon if it exists in dist
        const distIconPath = path.join(this.pluginDir, 'icon.png');
        const devIconPath = path.join(this.rootDir, 'figma-plugin', 'icon.png');
        try {
            await fs.access(distIconPath);
            await fs.copyFile(distIconPath, devIconPath);
        } catch (error) {
            // Icon doesn't exist, that's okay
        }
    }
}

// Run the build
if (require.main === module) {
    const builder = new SimpleBuilder();
    builder.build().catch(console.error);
}

module.exports = SimpleBuilder;