# Export Scenarios

## Regular Export (No Videos)

**When:** Your Figma design has no frames with `[VIDEO]` prefix

**What happens:**
1. ✅ HTML file downloads successfully
2. ✅ Shows simple success message: "🎉 Export complete! No video files detected in this design."
3. ✅ No additional setup required

**Result:**
```
your-design.html
```

## Video Export (With Videos)

**When:** Your Figma design has frames named like `[VIDEO] /path/to/video.mp4`

**What happens:**
1. ✅ HTML file downloads successfully
2. ✅ Shows video detection: "🎥 Found 1 video file(s): IMG_0843.mp4"
3. ✅ Shows video setup instructions with copy commands
4. ✅ Provides setup script for automatic video file copying

**Result:**
```
your-design.html
video/
└── IMG_0843.mp4 (after running setup script)
```

## Setup Process for Videos

### Automatic (Recommended)
```bash
# After exporting, run the setup script:
node /path/to/figma-to-html-passes/examples/setup-video-files.js
```

### Manual
```bash
# Create video directory
mkdir video

# Copy video files (use commands from plugin)
cp "/Users/markmanfrey/Downloads/IMG_0843.mp4" "./video/IMG_0843.mp4"
```

## UI Messages

### No Videos Detected
- **During export:** No special message
- **After download:** "🎉 Export complete! No video files detected in this design."

### Videos Detected
- **During export:** "🎥 Found 1 video file(s): IMG_0843.mp4"
- **After download:** Detailed video setup instructions with copy commands

## Console Logs

### No Videos
```
ℹ️ No video files detected in design
📄 HTML Content Debug: {htmlLength: 12345, ...}
```

### With Videos
```
🎥 Video files detected: IMG_0843.mp4
📄 HTML Content Debug: {htmlLength: 12345, videoFilesCount: 1}
```

## File Structure Examples

### Simple Design (No Videos)
```
project/
├── design.html
└── assets/ (if any)
```

### Video Design
```
project/
├── design.html
├── video/
│   ├── IMG_0843.mp4
│   └── presentation.webm
└── assets/ (if any)
```

## Troubleshooting

### "No video files detected" but you have videos
- Check frame names start with `[VIDEO]`
- Ensure path is complete: `[VIDEO] /full/path/to/video.mp4`

### Videos detected but setup instructions don't show
- Check browser console for errors
- Ensure download completed successfully first

### Setup script doesn't find videos
- Make sure you're running it in the same directory as your HTML file
- Check that the HTML file contains `data-video-source` attributes
