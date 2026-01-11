# CSP-Compliant Video Support Guide

## Overview

The Figma to HTML plugin now provides video support that works within Figma's Content Security Policy (CSP) restrictions. Instead of creating a ZIP file, it downloads multiple files that you can organize into the correct directory structure.

## How It Works

When you export a design with video frames:

1. **Downloads HTML file** - Your main design file
2. **Downloads README.md** - Complete setup instructions  
3. **Downloads placeholder files** - One for each video with instructions
4. **Provides organization script** - Automatically organizes files

## Quick Setup Process

### Step 1: Export from Figma
- Create frames with `[VIDEO] filename.mp4` names
- Export your design
- Multiple files will download automatically

### Step 2: Organize Files
You have two options:

**Option A: Use the Organizer Script (Recommended)**
```bash
# Navigate to your download directory
cd /path/to/your/downloads

# Run the organizer script
node /path/to/organize-video-files.js
```

**Option B: Manual Organization**
```bash
# Create video directory
mkdir video

# Move files manually
mv README.md video/
mv *.txt video/
```

### Step 3: Add Your Videos
```bash
# Replace placeholder files with actual videos
cd video
rm demo-video.mp4.txt
cp /path/to/your/demo-video.mp4 ./
```

## File Structure After Organization

```
your-project/
├── video-img.html
└── video/
    ├── README.md
    ├── demo-video.mp4.txt (placeholder)
    ├── presentation.webm.txt (placeholder)
    └── tutorial.mov.txt (placeholder)
```

After adding videos:
```
your-project/
├── video-img.html
└── video/
    ├── README.md
    ├── demo-video.mp4 (your actual video)
    ├── presentation.webm (your actual video)
    └── tutorial.mov (your actual video)
```

## Benefits of This Approach

✅ **CSP Compliant** - Works within Figma's security restrictions
✅ **No External Dependencies** - Uses only browser built-in features
✅ **Automatic Downloads** - All files download automatically
✅ **Clear Instructions** - README and placeholders guide you
✅ **Organization Script** - Automates file organization
✅ **Fallback Support** - Graceful degradation if anything fails

## Troubleshooting

### Multiple Files Downloaded
This is normal! The plugin downloads:
- Your HTML file
- `video/README.md` (instructions)
- `video/filename.txt` (placeholders for each video)

### Files Not Organizing
If the organizer script doesn't work:
1. Manually create a `video` directory
2. Move `README.md` and all `.txt` files into it
3. Keep the same directory structure

### Videos Not Loading
1. Make sure you're using a web server (not opening file directly)
2. Check that video filenames match exactly (case-sensitive)
3. Ensure video files are in the `video/` directory
4. Verify video format is supported (MP4 recommended)

## Example Commands

```bash
# Download and organize
cd ~/Downloads
node /path/to/figma-to-html-passes/examples/organize-video-files.js

# Serve with web server
python -m http.server 8000
# Visit: http://localhost:8000/video-img.html
```

## Supported Video Formats

- **MP4 (H.264)** - Recommended, best browser support
- **WebM** - Good for modern browsers
- **OGG** - Alternative format

## File Size Recommendations

- Keep videos under 50MB for web performance
- Use appropriate compression
- Consider multiple quality versions for responsive design

## Security Note

This approach is fully compliant with Figma's Content Security Policy and doesn't require external script loading or network access beyond the plugin's allowed domains.
