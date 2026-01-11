# Video Support Troubleshooting Guide

## Common Issues and Solutions

### 1. "Failed to load resource: net::ERR_FILE_NOT_FOUND"

This error occurs when the browser cannot find the video file at the specified path.

#### **Solution A: Check File Structure**
Make sure your video files are in the correct location:
```
your-project/
├── index.html (or your generated HTML file)
└── video/
    └── your-video.mp4
```

#### **Solution B: Use a Web Server**
Never open HTML files directly in the browser (file:// protocol). Use a web server instead:

**Option 1: Python (recommended)**
```bash
cd your-project-directory
python -m http.server 8000
# Then visit: http://localhost:8000
```

**Option 2: Node.js**
```bash
cd your-project-directory
npx serve .
# Or use the included serve.js script
node examples/serve.js
```

**Option 3: PHP**
```bash
cd your-project-directory
php -S localhost:8000
```

#### **Solution C: Check Video Paths**
The generated HTML includes multiple video source paths to handle different scenarios:
```html
<video controls preload="metadata">
    <source src="video/your-video.mp4" type="video/mp4">
    <source src="./video/your-video.mp4" type="video/mp4">
    <source src="../video/your-video.mp4" type="video/mp4">
    <source src="/examples/video/your-video.mp4" type="video/mp4">
    <source src="examples/video/your-video.mp4" type="video/mp4">
</video>
```

### 2. Video File Not Loading

#### **Check Video File Format**
- Ensure your video file is in a web-compatible format (MP4, WebM, OGG)
- MP4 with H.264 codec is most widely supported
- Check file size (large files may take time to load)

#### **Check MIME Types**
Your web server must serve video files with correct MIME types:
- `.mp4` → `video/mp4`
- `.webm` → `video/webm`
- `.ogg` → `video/ogg`

#### **Check File Permissions**
Make sure the video file is readable by the web server.

### 3. Video Shows but Won't Play

#### **Check Video Codec**
- MP4 files should use H.264 video codec and AAC audio codec
- Some browsers don't support certain codecs

#### **Check File Integrity**
- Ensure the video file is not corrupted
- Try opening it in a video player first

### 4. Testing Your Setup

#### **Use the Test Server**
The project includes a test server in `examples/serve.js`:

```bash
cd examples
node serve.js
```

Then visit: http://localhost:8000/video-test.html

#### **Check Browser Console**
Open browser developer tools (F12) and check the Console tab for error messages.

#### **Test Video Paths**
The test page includes JavaScript to test different video paths automatically.

### 5. Figma Integration

#### **Frame Naming**
In Figma, name your video frames exactly like this:
```
[VIDEO] my-video.mp4
[VIDEO] demo.mp4
[VIDEO] presentation.webm
```

#### **Export Process**
1. Create frame with `[VIDEO]` prefix
2. Export your design
3. Place video files in the `video/` directory
4. Serve with a web server

### 6. Production Deployment

#### **For Web Hosting**
- Upload your HTML files and video directory to your web server
- Ensure your hosting provider supports video MIME types
- Consider using a CDN for large video files

#### **For Local Development**
- Always use a web server, never open HTML files directly
- The included `serve.js` script is perfect for development

### 7. Debugging Commands

#### **Check if video file exists:**
```bash
ls -la video/your-video.mp4
```

#### **Test video file:**
```bash
# On macOS
open video/your-video.mp4

# On Linux
xdg-open video/your-video.mp4

# On Windows
start video/your-video.mp4
```

#### **Check web server logs:**
Look at your web server console output for 404 errors or other issues.

### 8. Quick Fix Checklist

- [ ] Video file exists in the correct directory
- [ ] Using a web server (not file:// protocol)
- [ ] Video file is in a supported format (MP4 recommended)
- [ ] Web server serves correct MIME types
- [ ] Figma frame is named with `[VIDEO]` prefix
- [ ] No typos in video filename
- [ ] Check browser console for specific error messages

### 9. Still Having Issues?

If you're still experiencing problems:

1. **Check the browser console** for specific error messages
2. **Verify the video file** plays in a standalone video player
3. **Test with a different video file** to isolate the issue
4. **Try a different browser** to see if it's browser-specific
5. **Check network tab** in browser dev tools to see the actual HTTP requests

### 10. Example Working Setup

Here's a complete working example:

```
my-project/
├── index.html
├── video/
│   ├── demo.mp4
│   └── test-video.mp4
└── serve.js (optional)
```

**Figma frame name:** `[VIDEO] demo.mp4`

**Generated HTML:**
```html
<div data-video-frame="true" data-video-filename="demo.mp4">
    <video controls preload="metadata" style="width: 100%; height: 100%; object-fit: contain;">
        <source src="video/demo.mp4" type="video/mp4">
        <!-- ... other source paths ... -->
    </video>
</div>
```

**Serve with:**
```bash
python -m http.server 8000
# Visit: http://localhost:8000
```
