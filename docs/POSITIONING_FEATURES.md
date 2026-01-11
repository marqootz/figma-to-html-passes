# Enhanced Positioning Features

This document describes the comprehensive positioning support added to the Figma to HTML conversion system.

## 🎯 Overview

The enhanced positioning system provides full support for Figma's positioning properties, including absolute positioning, transforms, constraints, and layout sizing.

## 📍 Positioning Types

### 1. Absolute Positioning

**When Used:** When a node has `x` and `y` coordinates and `layoutMode` is `'NONE'`

**CSS Generated:**
```css
position: absolute;
left: 100px;
top: 50px;
```

**Figma Properties:**
- `x` - Horizontal position
- `y` - Vertical position
- `layoutMode` - Must be `'NONE'` for absolute positioning

### 2. Layout Positioning

**When Used:** When `layoutPositioning` is specified

**CSS Generated:**
```css
position: relative; /* or absolute, fixed, sticky */
```

**Figma Properties:**
- `layoutPositioning` - Figma's positioning mode
  - `'ABSOLUTE'` → `position: absolute`
  - `'RELATIVE'` → `position: relative`
  - `'FIXED'` → `position: fixed`
  - `'STICKY'` → `position: sticky`

## 🔄 Transform Properties

### Rotation
**CSS Generated:**
```css
transform: rotate(45deg);
```

**Figma Properties:**
- `rotation` - Rotation angle in degrees

### Transform Matrix
**CSS Generated:**
```css
transform: translate(10px, 20px) scale(1.2, 0.8) skewX(5deg) skewY(-3deg);
```

**Figma Properties:**
- `relativeTransform` - 6-element transform matrix `[a, b, c, d, tx, ty]`

**Matrix Parsing:**
- `a, d` → `scaleX, scaleY`
- `b, c` → `skewY, skewX` (converted to degrees)
- `tx, ty` → `translateX, translateY`

## 📐 Layout Constraints

### Horizontal Constraints
**CSS Generated:**
```css
/* LEFT */
left: 0;

/* RIGHT */
right: 0;

/* CENTER */
left: 50%;
transform: translateX(-50%);

/* LEFT_RIGHT */
left: 0;
right: 0;
```

### Vertical Constraints
**CSS Generated:**
```css
/* TOP */
top: 0;

/* BOTTOM */
bottom: 0;

/* CENTER */
top: 50%;
transform: translateY(-50%);

/* TOP_BOTTOM */
top: 0;
bottom: 0;
```

**Figma Properties:**
- `constraints.horizontal` - Horizontal constraint type
- `constraints.vertical` - Vertical constraint type

## 📏 Layout Sizing

### Horizontal Sizing
**CSS Generated:**
```css
/* FIXED */
width: 200px;

/* FILL */
width: 100%;

/* HUG */
width: fit-content;
```

### Vertical Sizing
**CSS Generated:**
```css
/* FIXED */
height: 150px;

/* FILL */
height: 100%;

/* HUG */
height: fit-content;
```

**Figma Properties:**
- `layoutSizingHorizontal` - Horizontal sizing behavior
- `layoutSizingVertical` - Vertical sizing behavior

### Min/Max Dimensions
**CSS Generated:**
```css
min-width: 100px;
max-width: 500px;
min-height: 50px;
max-height: 300px;
```

**Figma Properties:**
- `minWidth` - Minimum width
- `maxWidth` - Maximum width
- `minHeight` - Minimum height
- `maxHeight` - Maximum height

## 📚 Z-Index Support

**CSS Generated:**
```css
z-index: 5;
```

**Figma Properties:**
- `zIndex` - Layer ordering value

## 🔧 Implementation Details

### New Methods Added

1. **`generatePositioningCSS(layout, rules)`**
   - Determines positioning strategy
   - Handles absolute positioning
   - Applies constraints
   - Sets z-index

2. **`generateTransformCSS(layout, rules)`**
   - Combines rotation and transform matrix
   - Generates complete transform string
   - Handles multiple transform functions

3. **`generateLayoutSizingCSS(layout, rules)`**
   - Applies min/max dimensions
   - Handles layout sizing behavior
   - Generates appropriate CSS properties

4. **`generateConstraintsCSS(constraints, rules)`**
   - Maps Figma constraints to CSS
   - Handles horizontal and vertical constraints
   - Applies appropriate positioning

5. **`parseTransformMatrix(matrix)`**
   - Parses 6-element transform matrix
   - Extracts scale, skew, and translate values
   - Converts to CSS-compatible units

6. **`mapLayoutPositioningToCSS(positioning)`**
   - Maps Figma positioning to CSS position
   - Handles all positioning types

7. **`mapLayoutSizingToCSS(sizing, direction)`**
   - Maps Figma sizing to CSS properties
   - Handles horizontal and vertical sizing

### Enhanced Properties Extracted

**New Properties Added:**
- `relativeTransform` - Transform matrix
- `absoluteTransform` - Absolute transform matrix
- `absoluteBoundingBox` - Absolute bounding box
- `absoluteRenderBounds` - Absolute render bounds
- `constraints` - Layout constraints
- `layoutPositioning` - Layout positioning mode
- `zIndex` - Layer ordering

## 🎨 Usage Examples

### Basic Absolute Positioning
```javascript
// Figma node with x=100, y=50, layoutMode='NONE'
// Generates:
position: absolute;
left: 100px;
top: 50px;
```

### Transform with Rotation
```javascript
// Figma node with rotation=45, relativeTransform=[1,0,0,1,10,20]
// Generates:
transform: rotate(45deg) translate(10px, 20px);
```

### Constraints
```javascript
// Figma node with constraints: {horizontal: 'CENTER', vertical: 'TOP'}
// Generates:
left: 50%;
top: 0;
transform: translateX(-50%);
```

### Layout Sizing
```javascript
// Figma node with layoutSizingHorizontal='FILL', layoutSizingVertical='HUG'
// Generates:
width: 100%;
height: fit-content;
```

## 🚀 Benefits

1. **Precise Positioning:** Full support for Figma's positioning system
2. **Transform Support:** Complete transform matrix parsing
3. **Constraint Handling:** Proper constraint-to-CSS mapping
4. **Layout Flexibility:** Support for all layout sizing modes
5. **Layer Ordering:** Z-index support for proper layering
6. **Responsive Design:** Min/max dimensions for responsive layouts

## 🔍 Testing

Use the `figma-advanced-positioning.html` example to test all positioning features:

- Absolute positioning with x/y coordinates
- Transform properties (rotation, scale, skew, translate)
- Layout constraints (horizontal/vertical centering, filling)
- Z-index layering
- Layout sizing (fixed, fill, hug)

## 📝 Notes

- Transform matrix parsing handles complex transformations
- Constraints are properly mapped to CSS positioning
- Layout sizing respects Figma's sizing behavior
- Z-index maintains proper layer ordering
- All positioning works with existing flexbox auto-layout
