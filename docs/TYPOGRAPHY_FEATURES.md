# Enhanced Typography Features

This document outlines the comprehensive typography support added to the Figma-to-HTML plugin's Pass 2 (Node Styles).

## Overview

The enhanced typography system now supports a wide range of Figma text properties, converting them to appropriate CSS properties for accurate visual reproduction.

## Supported Features

### 1. Font Properties

#### Basic Font Properties
- **Font Family**: Maps to `font-family` with fallback fonts
- **Font Size**: Maps to `font-size` in pixels
- **Font Weight**: Maps to `font-weight` (100-900)
- **Font Style**: Maps to `font-style` (normal, italic)

#### Advanced Font Properties
- **Font Variant**: Maps to `font-variant` (small-caps, etc.)
- **Font Stretch**: Maps to `font-stretch` (condensed, expanded, etc.)

```css
/* Example output */
[data-figma-id="text1"][data-figma-type="TEXT"] {
    font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 24px;
    font-weight: 700;
    font-style: italic;
    font-variant: small-caps;
    font-stretch: condensed;
}
```

### 2. Text Decoration

Supports comprehensive text decoration with style and color:

- **Underline**: `text-decoration: underline`
- **Strikethrough**: `text-decoration: line-through`
- **Overline**: `text-decoration: overline`
- **Decoration Style**: solid, dashed, dotted, wavy
- **Decoration Color**: Custom color support

```css
/* Example output */
[data-figma-id="text1"][data-figma-type="TEXT"] {
    text-decoration: underline dashed #e74c3c;
}
```

### 3. Text Case Transformations

Maps Figma text case to CSS `text-transform`:

- **UPPER** → `text-transform: uppercase`
- **LOWER** → `text-transform: lowercase`
- **TITLE** → `text-transform: capitalize`
- **SMALL_CAPS** → `text-transform: uppercase` (with font-variant: small-caps)

```css
/* Example output */
[data-figma-id="text1"][data-figma-type="TEXT"] {
    text-transform: uppercase;
    letter-spacing: 2px; /* Often combined with uppercase */
}
```

### 4. Text Alignment

#### Horizontal Alignment
- **LEFT** → `text-align: left`
- **CENTER** → `text-align: center`
- **RIGHT** → `text-align: right`
- **JUSTIFIED** → `text-align: justify`

#### Vertical Alignment
- **TOP** → `vertical-align: top`
- **CENTER** → `vertical-align: middle`
- **BOTTOM** → `vertical-align: bottom`
- **JUSTIFIED** → `vertical-align: baseline`

### 5. Spacing and Layout

#### Line and Letter Spacing
- **Line Height**: Maps to `line-height` in pixels
- **Letter Spacing**: Maps to `letter-spacing` in pixels
- **Word Spacing**: Maps to `word-spacing` in pixels
- **Paragraph Spacing**: Maps to `margin-bottom` in pixels
- **Text Indent**: Maps to `text-indent` in pixels

```css
/* Example output */
[data-figma-id="text1"][data-figma-type="TEXT"] {
    line-height: 1.5;
    letter-spacing: 1px;
    word-spacing: 2px;
    text-indent: 20px;
    margin-bottom: 16px;
}
```

### 6. Text Effects

#### Text Shadow
Extracts drop shadow effects and converts to `text-shadow`:

```css
/* Example output */
[data-figma-id="text1"][data-figma-type="TEXT"] {
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}
```

#### Text Stroke
Converts stroke properties to `-webkit-text-stroke`:

```css
/* Example output */
[data-figma-id="text1"][data-figma-type="TEXT"] {
    -webkit-text-stroke: 2px #e74c3c;
    color: transparent;
}
```

### 7. Advanced Properties

#### White Space Handling
- **NORMAL** → `white-space: normal`
- **NOWRAP** → `white-space: nowrap`
- **PRE** → `white-space: pre`
- **PRE_WRAP** → `white-space: pre-wrap`
- **PRE_LINE** → `white-space: pre-line`

#### Text Overflow
- **CLIP** → `text-overflow: clip`
- **ELLIPSIS** → `text-overflow: ellipsis`

```css
/* Example output */
[data-figma-id="text1"][data-figma-type="TEXT"] {
    white-space: pre;
    text-overflow: ellipsis;
    overflow: hidden;
}
```

### 8. Opacity and Blending

#### Text Opacity
- Maps to `opacity` property for text transparency

#### Blend Modes
- **NORMAL** → `mix-blend-mode: normal`
- **MULTIPLY** → `mix-blend-mode: multiply`
- **SCREEN** → `mix-blend-mode: screen`
- **OVERLAY** → `mix-blend-mode: overlay`
- And more...

```css
/* Example output */
[data-figma-id="text1"][data-figma-type="TEXT"] {
    opacity: 0.8;
    mix-blend-mode: multiply;
}
```

## Implementation Details

### Extraction Process

The typography extraction happens in the `extractTypography()` method:

1. **Node Type Check**: Only processes TEXT nodes
2. **Style Property Access**: Reads from `node.style` object
3. **Property Mapping**: Maps Figma properties to CSS equivalents
4. **Fallback Values**: Provides sensible defaults for missing properties

### CSS Generation

The CSS generation happens in the `generateTypographyCSS()` method:

1. **Property Validation**: Checks if properties exist and are not default values
2. **CSS Rule Building**: Constructs CSS rules with proper syntax
3. **Vendor Prefixes**: Adds necessary vendor prefixes (e.g., `-webkit-text-stroke`)
4. **Fallback Fonts**: Includes comprehensive font fallback stacks

### Specificity and Override

Typography styles use high-specificity selectors to ensure they override any debug styles:

```css
/* High specificity selector */
[data-figma-id="text1"][data-figma-type="TEXT"] {
    /* Typography styles */
}
```

## Browser Compatibility

### Well-Supported Features
- Font properties (family, size, weight, style)
- Text alignment and spacing
- Text decoration
- Text transform
- Opacity

### Partially Supported Features
- Text stroke (WebKit browsers)
- Mix blend modes (modern browsers)
- Font stretch (limited browser support)

### Fallbacks
The system includes appropriate fallbacks for less-supported features:

```css
/* Example with fallbacks */
[data-figma-id="text1"][data-figma-type="TEXT"] {
    -webkit-text-stroke: 2px #e74c3c; /* WebKit browsers */
    color: #e74c3c; /* Fallback for other browsers */
}
```

## Examples

See the following example files:
- `examples/figma-enhanced-typography.html` - Comprehensive typography examples
- `examples/figma-text-colors.html` - Text color handling
- `examples/figma-structure-with-styles.html` - Complete integration example

## Future Enhancements

Potential future improvements:
- Font loading optimization
- CSS custom properties for dynamic theming
- Advanced text effects (gradients, patterns)
- Better support for complex text layouts
- Performance optimizations for large text blocks
