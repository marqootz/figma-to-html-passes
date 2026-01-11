# Video Setup Guide

## Quick Setup (Automated)

### Option 1: Use the Setup Script (Recommended)

1. **Export your HTML** from the Figma plugin
2. **Navigate to your export directory** (where your HTML file is)
3. **Run the setup script**:
   ```bash
   node /path/to/figma-to-html-passes/examples/setup-video-files.js
   ```

The script will:
- ✅ Automatically detect video files from your HTML
- ✅ Create the `video/` directory
- ✅ Copy all video files to the correct location
- ✅ Show you the final directory structure

### Option 2: Manual Setup

1. **Create video directory**:
   ```bash
   mkdir video
   ```

2. **Copy your video files** using the commands shown in the Figma plugin:
   ```bash
   cp "/Users/markmanfrey/Downloads/IMG_0843.mp4" "./video/IMG_0843.mp4"
   ```

3. **Serve with a web server**:
   ```bash
   python -m http.server 8000
   ```

## Example Workflow

### In Figma:
```
[VIDEO] /Users/markmanfrey/Downloads/IMG_0843.mp4
```

### After Export:
```
your-project/
├── your-design.html
└── video/
    └── IMG_0843.mp4
```

### Setup Script Output:
```
🎬 Video File Setup Script
==========================

📁 Working in: /path/to/your/project

📄 Found HTML file: your-design.html
🎥 Found 1 video file(s):
   1. IMG_0843.mp4 (from: /Users/markmanfrey/Downloads/IMG_0843.mp4)

📁 Created video directory: /path/to/your/project/video

📋 Processing 1/1: IMG_0843.mp4
✅ Copied: /Users/markmanfrey/Downloads/IMG_0843.mp4 → /path/to/your/project/video/IMG_0843.mp4

📊 Summary
==========
✅ Files copied: 1
⚠️  Files skipped: 0
❌ Errors: 0
📁 Total files: 1

🎉 Video setup complete!

📂 Final directory structure:
your-design.html
video/
├── IMG_0843.mp4

🌐 To test your setup:
   python -m http.server 8000
   # Then visit: http://localhost:8000/your-design.html
```

## Troubleshooting

### "No video files detected in HTML"
- Make sure your Figma frames are named with `[VIDEO] /full/path/to/video.mp4`
- Check that the HTML file was exported correctly

### "Source file not found"
- Verify the file path in your Figma frame name is correct
- Make sure the video file exists at that location

### "File already exists"
- The script skips copying if the file already exists
- Delete the existing file if you want to replace it

### Videos not loading in browser
- Make sure you're using a web server (not opening HTML directly)
- Check that video files are in the `video/` directory
- Verify video file formats are supported (MP4 recommended)

## Supported Video Formats

- **MP4 (H.264)** - Recommended, best browser support
- **WebM** - Good for modern browsers  
- **OGG** - Alternative format

## File Size Recommendations

- Keep videos under 50MB for web performance
- Use appropriate compression
- Consider multiple quality versions for responsive design
