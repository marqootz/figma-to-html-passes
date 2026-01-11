# Showroom Export Guide

Complete instructions for exporting Figma prototypes for the UXync GDF Showroom experience.

---

## Overview

This guide walks you through creating multi-screen presentations in Figma and exporting them for the showroom system. The showroom uses HTML files with automatic media control to create synchronized, interactive experiences across multiple displays.

---

## Part 1: Setting Up Your Figma File

### 1.1 Create a Component Set (Presentation)

Your presentation is a **Component Set** where each variant is a "slide":

1. In Figma, create a **Component Set**
2. Name it descriptively (e.g., "Investor Presentation Wall 1")
3. Set the size to match your display resolution (e.g., 8640×3840 for video wall)

```
📦 Investor Presentation Wall 1 (COMPONENT_SET)
├── 🎨 Property 1=Slide1 (COMPONENT/VARIANT)
├── 🎨 Property 1=Slide2 (COMPONENT/VARIANT)
├── 🎨 Property 1=Slide3 (COMPONENT/VARIANT)
└── 🎨 Property 1=Slide4 (COMPONENT/VARIANT)
```

### 1.2 Add Content to Each Slide

Inside each variant (slide), add your content:

**Text:**
- Regular text frames work normally
- Font, size, color all preserved

**Images:**
- Name frames: `[IMG] filename.jpg`
- Place image files in `img/` directory

**Videos:**
- Name frames: `[VIDEO] filename.mp4`
- Place video files in `video/` directory

**Lottie Animations:**
- Name frames: `[LOTTIE] filename.json`
- Place animation files in `lottie/` directory

### Example Slide Structure:

```
🎨 Property 1=Slide1
├── 📝 Made for cities (TEXT)
├── 📝 10,000 people per hour (TEXT)
├── 🎬 [VIDEO] intro-clip.mp4 (FRAME)
├── ✨ [LOTTIE] loading-spinner.json (FRAME)
└── 🖼️ [IMG] logo.png (FRAME)
```

---

## Part 2: Exporting from Figma

### 2.1 Open the Plugin

1. In Figma, select your **Component Set** (the entire presentation)
2. Go to **Plugins** → **Development** → **Figma to HTML**
3. The plugin window opens

### 2.2 Configure Export Options

**Checkbox: "Auto-gen slide nav (Use for Showroom)"**
- ✅ **CHECK THIS** for showroom presentations
- Enables keyboard navigation (Key 1=Previous, 2=Next)
- Perfect for kiosk/showroom use

⚠️ **Note**: If you have custom Figma reactions using keys 1 or 2, uncheck this box to avoid conflicts.

### 2.3 Export HTML

1. Click **"Convert to HTML"** button
2. Save the file as: `wall1.html` (or your chosen name)
3. The browser downloads the HTML file

**File naming convention:**
- `wall1.html` - First video wall
- `wall2.html` - Second video wall
- `kiosk1.html` - Kiosk display
- etc.

### 2.4 Export Media Control (Showroom Only)

If your presentation has videos or Lottie animations:

1. Click **"Export Media Control"** button (purple button)
2. Save the file as: `rules.json`
3. This file controls automatic play/pause of media as you navigate slides

---

## Part 3: Organizing Your Files

### 3.1 Create Directory Structure

```
presentations/
└── investor1/              (your presentation folder)
    ├── wall1/
    │   ├── wall1.html      (your exported HTML)
    │   ├── img/            (image assets)
    │   ├── video/          (video assets)
    │   ├── lottie/         (Lottie animations)
    │   └── rules/
    │       └── rules.json  (media control file)
    └── wall2/
        ├── wall2.html
        ├── img/
        ├── video/
        ├── lottie/
        └── rules/
            └── rules.json
```

### 3.2 Save Files to Correct Locations

**HTML File:**
- Save to: `/presentations/{presentation-name}/{wall-name}/{filename}.html`
- Example: `/presentations/investor1/wall1/wall1.html`

**Media Control File:**
- Save to: `/presentations/{presentation-name}/{wall-name}/rules/rules.json`
- Example: `/presentations/investor1/wall1/rules/rules.json`

**Media Assets:**
- Images: `/presentations/{presentation-name}/{wall-name}/img/`
- Videos: `/presentations/{presentation-name}/{wall-name}/video/`
- Lotties: `/presentations/{presentation-name}/{wall-name}/lottie/`

---

## Part 4: Adding Media Files

### 4.1 Video Files

For each `[VIDEO] filename.mp4` frame in your Figma:

1. Get the actual video file
2. Rename it to match exactly: `filename.mp4`
3. Place in the `video/` folder
4. **Recommended formats**: MP4 (H.264), WebM
5. **Keep files under 100MB** for best performance

### 4.2 Lottie Animations

For each `[LOTTIE] filename.json` frame:

1. Export Lottie animation from After Effects (Bodymovin plugin)
2. Rename to match exactly: `filename.json`
3. Place in the `lottie/` folder

### 4.3 Images

For each `[IMG] filename.jpg` frame:

1. Get the image file
2. Rename to match exactly: `filename.jpg`
3. Place in the `img/` folder
4. **Supported formats**: JPG, PNG, GIF, WebP

---

## Part 5: Integrating with Showroom System

### 5.1 Merge Media Control Rules (If Using)

If you exported a `rules.json` file:

1. Open `/config/rules/rule-sets.json` in the showroom system
2. Copy the `ruleSets` object from your exported `rules.json`
3. Paste into the main `rule-sets.json` file
4. Ensure `"active": true` is set

**Example merge:**
```json
{
  "categories": { ... },
  "ruleSets": {
    "existing-rule-set": { ... },
    "custom-1760195817714": {    ← Your exported rule set
      "name": "wall1",
      "rules": [ ... ],
      "active": true
    }
  }
}
```

### 5.2 Test the Presentation

1. Start the showroom server
2. Navigate to your HTML file
3. Test keyboard navigation:
   - Press **"2"** to go to next slide
   - Press **"1"** to go to previous slide
4. Verify videos/Lotties play automatically when entering slides
5. Verify they stop when leaving slides

---

## Part 6: Multi-Display Coordination

### 6.1 Syncing Multiple Walls

For presentations across multiple displays:

**Example: 3-wall video wall**
1. Create 3 component sets in Figma: "Wall 1", "Wall 2", "Wall 3"
2. Export each as: `wall1.html`, `wall2.html`, `wall3.html`
3. Place in their respective directories
4. Use the showroom system to sync navigation across all walls

### 6.2 Naming Best Practices

**Wall Files:**
- `wall1.html`, `wall2.html`, `wall3.html` - For video walls
- `kiosk1.html`, `kiosk2.html` - For kiosk displays
- `screen1.html`, `screen2.html` - For general displays

**Media Files:**
- Use descriptive names: `intro-animation.mp4`, `product-demo.json`
- Keep names lowercase with hyphens: `feature-highlight.mp4`
- Match exactly between Figma frame names and actual files

---

## Quick Reference Checklist

### Before Export:
- [ ] Component set created with variants as slides
- [ ] Media frames named with `[VIDEO]`, `[LOTTIE]`, or `[IMG]` prefix
- [ ] Content positioned correctly in each slide
- [ ] Checked if you need auto-navigation (checkbox)

### During Export:
- [ ] Component set selected in Figma
- [ ] Auto-nav checkbox set correctly
- [ ] Clicked "Convert to HTML"
- [ ] Saved HTML to correct directory
- [ ] (If using media) Clicked "Export Media Control"
- [ ] Saved rules.json to `/rules/` folder

### After Export:
- [ ] HTML file in `/presentations/{name}/{wall}/`
- [ ] rules.json in `/presentations/{name}/{wall}/rules/`
- [ ] Media files in appropriate folders (video/, lottie/, img/)
- [ ] Filenames match exactly between Figma and actual files
- [ ] Tested in browser locally
- [ ] Deployed to showroom system

---

## Troubleshooting

### Videos Not Playing

**Problem**: Video appears but doesn't play

**Solutions:**
- Ensure video filename matches exactly (case-sensitive)
- Check file is in `video/` folder
- Use MP4 format with H.264 codec
- Keep file size under 100MB
- Serve with web server (not file:// protocol)

### Slides Not Changing

**Problem**: Pressing 1/2 doesn't navigate

**Solutions:**
- Verify "Auto-gen slide nav" checkbox was checked during export
- Check browser console for errors
- Ensure you're viewing the latest exported HTML
- Try closing and reopening browser

### Lottie Animations Not Loading

**Problem**: Lottie shows "Loading..." forever

**Solutions:**
- Check filename matches exactly: `[LOTTIE] name.json` → `lottie/name.json`
- Verify JSON file is valid Lottie format
- Check browser console for 404 errors
- Ensure file is in `lottie/` folder

### Media Control Rules Not Working

**Problem**: Videos don't auto-play when entering slides

**Solutions:**
- Verify `rules.json` is in `/rules/` directory
- Check rule set is merged into main `rule-sets.json`
- Ensure `"active": true` in the rule set
- Verify showroom event system is running
- Check HTML filename matches rule's `sourceHtml` field

---

## Tips & Best Practices

### Design Tips:
- ✅ Keep slide count reasonable (5-10 slides per presentation)
- ✅ Use high-resolution assets for large displays
- ✅ Test on target display resolution
- ✅ Keep videos under 50MB for smooth playback
- ✅ Use consistent naming conventions

### Workflow Tips:
- ✅ Export HTML first, test navigation
- ✅ Then add media files and export media control
- ✅ Keep Figma file organized with clear variant names
- ✅ Document which wall/display each export is for
- ✅ Version your presentations (wall1-v1.html, wall1-v2.html)

### Performance Tips:
- ✅ Optimize video files (compress, reduce bitrate)
- ✅ Use appropriate image formats (WebP for photos, PNG for graphics)
- ✅ Minimize number of Lottie animations per slide
- ✅ Test on actual showroom hardware before deployment

---

## Example Workflow: Creating a 2-Wall Presentation

### Step 1: Design in Figma
1. Create two component sets: "Investor Wall 1", "Investor Wall 2"
2. Each has 5 variants (slides)
3. Add `[VIDEO] intro.mp4` to Slide 1 of Wall 1
4. Add `[LOTTIE] loading.json` to Slide 2 of Wall 2

### Step 2: Export Wall 1
1. Select "Investor Wall 1" component set
2. Check "Auto-gen slide nav"
3. Click "Convert to HTML" → Save as `wall1.html`
4. Click "Export Media Control" → Save as `rules.json`

### Step 3: Export Wall 2
1. Select "Investor Wall 2" component set
2. Check "Auto-gen slide nav"
3. Click "Convert to HTML" → Save as `wall2.html`
4. Click "Export Media Control" → Save as `rules.json`

### Step 4: Organize Files
```
presentations/investor1/
├── wall1/
│   ├── wall1.html
│   ├── video/
│   │   └── intro.mp4
│   └── rules/
│       └── rules.json
└── wall2/
    ├── wall2.html
    ├── lottie/
    │   └── loading.json
    └── rules/
        └── rules.json
```

### Step 5: Deploy
1. Copy to showroom system
2. Merge both `rules.json` files into main config
3. Test navigation and media playback
4. Done! 🎉

---

## Support

**Issues or Questions?**
- Check browser console for error messages
- Verify file paths and filenames match exactly
- Review this guide's troubleshooting section
- Check the main repository documentation

**Documentation:**
- Main README: `/README.md`
- Rule Generation: `/docs/RULE_GENERATION.md`
- Video Setup: `/examples/VIDEO_SETUP_README.md`
- Lottie Setup: `/examples/lottie/README.md`

