# Lottie Directory

This directory contains Lottie animation files (JSON format) that will be served by your web server.

## Usage

1. Place your Lottie animation files (JSON format) in this directory
2. In Figma, create frames with names like `[LOTTIE] filename.json`
3. The exporter will automatically generate Lottie HTML elements that reference these files

## Example

If you have a Lottie animation file named `loading-animation.json` in this directory:

1. Create a frame in Figma named `[LOTTIE] loading-animation.json`
2. The exporter will generate:
   ```html
   <div data-figma-name="[LOTTIE] loading-animation.json" data-lottie-frame="true" data-lottie-filename="loading-animation.json">
     <div class="lottie-container" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
       <div id="lottie-123-456" 
            style="width: 100%; height: 100%;"
            data-lottie-src="lottie/loading-animation.json">
         <div style="padding: 20px; text-align: center; color: #666;">
           Loading Lottie animation...
         </div>
       </div>
     </div>
   </div>
   ```

## Supported Formats

- **JSON** - Standard Lottie animation format (recommended)
- **Lottie JSON** - Exported from After Effects using Bodymovin plugin

## File Structure

```
examples/
├── lottie/
│   ├── loading-animation.json
│   ├── success-checkmark.json
│   ├── error-x.json
│   └── custom-animation.json
└── figma-structure.html
```

## Web Server Requirements

Make sure your web server is configured to serve JSON files with the correct MIME type:

- `application/json` for JSON files

For local development, you can use:
- Python: `python -m http.server 8000`
- Node.js: `npx serve .`
- PHP: `php -S localhost:8000`
- Use the included streaming server: `node examples/video-streaming-server.js`

## Lottie Library

The generated HTML automatically includes:
- **lottie-web** - Core Lottie animation library
- **lottie-player** - Web component for Lottie animations

## Animation Features

- **Auto-play**: Animations start automatically
- **Looping**: Animations loop continuously
- **SVG Rendering**: High-quality vector animations
- **Multiple Path Support**: Tries multiple file paths automatically
- **Error Handling**: Shows helpful error messages if files fail to load
- **Loading States**: Shows loading indicator while fetching animation

## JavaScript API

Access the Lottie manager in the browser console:

```javascript
// Play a specific animation
window.lottieManager.playAnimation('lottie-123-456');

// Pause a specific animation
window.lottieManager.pauseAnimation('lottie-123-456');

// Stop a specific animation
window.lottieManager.stopAnimation('lottie-123-456');
```

## Troubleshooting

### Animation Not Loading
1. Check that the JSON file is valid Lottie format
2. Verify the file path in the frame name matches the actual file
3. Ensure the web server is serving JSON files correctly
4. Check browser console for error messages

### Performance Issues
- Large Lottie files may take time to load
- Consider optimizing animations in After Effects before export
- Use the streaming server for better performance

### File Path Issues
The system tries multiple paths automatically:
- `lottie/filename.json`
- `./lottie/filename.json`
- `../lottie/filename.json`
- `/examples/lottie/filename.json`
- `examples/lottie/filename.json`

## Creating Lottie Animations

1. **After Effects**: Create animation and export using Bodymovin plugin
2. **LottieFiles**: Download pre-made animations from lottiefiles.com
3. **Online Editors**: Use online Lottie editors like lottiefiles.com/editor

## Best Practices

- Keep file sizes reasonable (under 1MB when possible)
- Use simple animations for better performance
- Test animations on different devices and browsers
- Provide fallback content for users with JavaScript disabled
