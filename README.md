# Figma to HTML Plugin

A clean, modular Figma plugin that converts Figma designs to HTML using a multi-pass methodology with full CSS styling support.

## Architecture

This plugin uses a **multi-pass methodology** where each pass handles a specific aspect of the conversion:

- **Pass 1: Node Structure Recreation** - Recreates the exact Figma node hierarchy in HTML with full nested instance support
- **Pass 2: Node CSS Styles** - Extracts and applies visual styles (fills, strokes, effects, typography, layout) from Figma nodes
- **Pass 4: Rule Generation** - Generates event-driven rules for controlling media playback in presentations

## Features

- ✅ **Modular Architecture** - Clean, extensible multi-pass system
- ✅ **Structure Recreation** - Maintains exact Figma hierarchy with nested instance support
- ✅ **Full CSS Styling** - Extracts and applies all Figma visual styles
- ✅ **Style Support** - Fills, strokes, effects, typography, layout properties
- ✅ **Gradient Support** - Linear and radial gradients with proper CSS
- ✅ **Flexbox Layout** - Converts Figma auto-layout to CSS flexbox
- ✅ **Typography** - Font families, sizes, weights, alignment, spacing
- ✅ **Effects** - Drop shadows, blur effects, opacity
- ✅ **Video & Lottie Support** - Automatic detection and HTML generation for media frames
- ✅ **Component Set Variants** - Full support for variant switching and animations
- ✅ **Sequential Navigation** - Auto-generate keyboard navigation (Key 1/2) for slide presentations
- ✅ **Rule Generation** - Export event-driven rules for media playback control
- ✅ **Export Functionality** - Export selected nodes with complete styling
- ✅ **Visual Debugging** - Color-coded elements with type labels

## Usage

1. **Build the plugin:**
   ```bash
   node build.js
   ```

2. **Load in Figma:**
   - Open Figma
   - Go to Plugins → Development → Import plugin from manifest
   - Select `figma-plugin/manifest.json`

3. **Use the plugin:**
   - Select the plugin from the plugins menu
   - Click "Refresh Page" to see nodes on the current page
   - Enter a filename and click "Export to File"

## Generated HTML Structure

The plugin generates complete HTML with CSS styling that recreates the Figma design:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <style>
        /* Generated CSS from Figma styles */
        [data-figma-id="123"] {
            background: linear-gradient(90deg, #ff0000 0%, #0000ff 100%);
            border: 2px solid #000000;
            font-family: "Inter", sans-serif;
            font-size: 16px;
            display: flex;
            flex-direction: row;
            gap: 8px;
            box-shadow: 0px 4px 8px 0px rgba(0,0,0,0.2);
        }
    </style>
</head>
<body>
    <div class="figma-container">
        <div class="header" data-figma-id="123" data-figma-type="FRAME">
            <p class="title" data-figma-id="456" data-figma-type="TEXT">
                Welcome to our site
            </p>
            <div class="logo" data-figma-id="789" data-figma-type="VECTOR">
            </div>
        </div>
    </div>
</body>
</html>
```

## Node Type Mapping

| Figma Type | HTML Tag | Description |
|------------|----------|-------------|
| TEXT | `<p>` | Text content |
| FRAME | `<div>` | Container element |
| COMPONENT | `<div>` | Component definition |
| INSTANCE | `<div>` | Component instance |
| VECTOR | `<div>` | Vector graphics |
| RECTANGLE | `<div>` | Rectangular shapes |
| ELLIPSE | `<div>` | Elliptical shapes |
| LINE | `<hr>` | Line elements |
| IMAGE | `<img>` | Image elements |

## Development

### Project Structure

```
├── src/
│   ├── passes/
│   │   ├── pass1-node-structure.js    # Pass 1: Structure recreation
│   │   └── pass2-node-styles.js       # Pass 2: CSS styles
│   ├── plugin/
│   │   └── figma-to-html-plugin.js    # Main plugin class
│   └── build/
│       └── code-generator.js          # Build tool
├── figma-plugin/
│   ├── manifest.json                  # Plugin manifest
│   ├── code.js                        # Generated plugin code
│   └── ui.html                        # Plugin UI
├── build.js                           # Build script
└── dist/                              # Built plugin (generated)
    └── plugin/
        ├── manifest.json
        ├── code.js
        └── ui.html
```

### Adding New Passes

To add a new pass:

1. Create a new pass file in `src/passes/` (e.g., `pass3-layout.js`)
2. Implement the pass class with a `process()` method
3. Add the pass to the main plugin class in `src/plugin/figma-to-html-plugin.js`
4. Update the build system in `src/build/code-generator.js` to include the new pass
5. Run `node build.js` to generate the updated plugin

Example:
```javascript
// src/passes/pass3-layout.js
class LayoutPass {
    async process(nodes, previousPassResults) {
        // Generate layout-specific CSS
        return { layoutCSS: '...', metadata: {} };
    }
}
```

### Build Process

The build system automatically:
1. Reads all pass files from `src/passes/`
2. Combines them with the main plugin class
3. Generates a single `code.js` file
4. Copies files to both `dist/plugin/` and `figma-plugin/` for development

## License

MIT