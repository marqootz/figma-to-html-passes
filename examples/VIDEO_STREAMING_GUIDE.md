# Video Streaming Guide for Large MP4 Files

## 🎯 Problem
Large MP4 files don't load completely because browsers try to download the entire file before playing.

## ✅ Solutions

### **1. Immediate Fix - Change Preload Strategy**
The HTML generation has been updated to use `preload="none"` instead of `preload="metadata"`:

```html
<video controls preload="none" style="width: 100%; height: 100%; object-fit: contain;">
    <source src="video/your-large-video.mp4" type="video/mp4">
</video>
```

**Benefits:**
- Video only loads when user clicks play
- Much faster initial page load
- Supports progressive loading

### **2. Use the Streaming Server**
For optimal streaming performance, use the included streaming server:

```bash
node examples/video-streaming-server.js
```

**Features:**
- HTTP Range request support (true streaming)
- Optimized for large video files
- Proper MIME types
- Caching headers

### **3. Video Format Optimization**

#### **Convert to Streamable Format:**
```bash
# Using FFmpeg to optimize for streaming
ffmpeg -i input.mp4 -c:v libx264 -preset fast -crf 23 -c:a aac -movflags +faststart output.mp4
```

**Key parameters:**
- `+faststart`: Moves metadata to beginning of file (enables immediate playback)
- `preset fast`: Faster encoding, good quality
- `crf 23`: Good quality/size balance

#### **Create Multiple Quality Versions:**
```bash
# High quality
ffmpeg -i input.mp4 -c:v libx264 -preset fast -crf 18 -c:a aac -movflags +faststart -b:v 5M output_hd.mp4

# Medium quality  
ffmpeg -i input.mp4 -c:v libx264 -preset fast -crf 23 -c:a aac -movflags +faststart -b:v 2M output_medium.mp4

# Low quality
ffmpeg -i input.mp4 -c:v libx264 -preset fast -crf 28 -c:a aac -movflags +faststart -b:v 800k output_low.mp4
```

### **4. HTML5 Video Optimization**

#### **Add Streaming Attributes:**
```html
<video 
    controls 
    preload="none"
    playsinline
    webkit-playsinline
    style="width: 100%; height: 100%; object-fit: contain;">
    <source src="video/your-video.mp4" type="video/mp4">
</video>
```

#### **Add Loading States:**
```html
<video 
    controls 
    preload="none"
    onloadstart="this.style.opacity='0.5'" 
    oncanplay="this.style.opacity='1'" 
    onerror="this.innerHTML='Video failed to load'">
    <source src="video/your-video.mp4" type="video/mp4">
</video>
```

### **5. Advanced Streaming Options**

#### **HLS (HTTP Live Streaming) - For Very Large Files:**
```bash
# Convert to HLS format
ffmpeg -i input.mp4 -c:v libx264 -c:a aac -f hls -hls_time 10 -hls_list_size 0 output.m3u8
```

#### **DASH (Dynamic Adaptive Streaming):**
```bash
# Convert to DASH format
ffmpeg -i input.mp4 -map 0 -c:v libx264 -c:a aac -f dash output.mpd
```

### **6. Server Configuration**

#### **Apache (.htaccess):**
```apache
# Enable range requests
Header set Accept-Ranges bytes

# Video MIME types
AddType video/mp4 .mp4
AddType video/webm .webm
AddType video/ogg .ogg

# Enable compression (but not for video files)
<FilesMatch "\.(mp4|webm|ogg)$">
    SetEnv no-gzip dont-vary
</FilesMatch>
```

#### **Nginx:**
```nginx
location ~* \.(mp4|webm|ogg)$ {
    add_header Accept-Ranges bytes;
    add_header Cache-Control "public, max-age=3600";
    
    # Disable gzip for video files
    gzip off;
}
```

### **7. Testing Your Setup**

#### **Check Range Request Support:**
```bash
# Test if server supports range requests
curl -I -H "Range: bytes=0-1023" http://localhost:8000/video/your-video.mp4

# Should return: HTTP/1.1 206 Partial Content
```

#### **Browser Testing:**
1. Open browser developer tools
2. Go to Network tab
3. Load your video
4. Look for "206 Partial Content" responses
5. Check that video starts playing before full download

### **8. Performance Tips**

1. **Use `preload="none"`** - Only load when needed
2. **Optimize video files** - Use `+faststart` flag
3. **Enable HTTP Range requests** - Use the streaming server
4. **Add loading states** - Better user experience
5. **Consider multiple qualities** - For different connection speeds
6. **Use CDN** - For production deployments

### **9. Troubleshooting**

#### **Video Still Not Streaming:**
- Check server supports HTTP Range requests
- Verify video file is optimized with `+faststart`
- Test with the streaming server: `node examples/video-streaming-server.js`

#### **Slow Loading:**
- Convert video with `+faststart` flag
- Use lower bitrate/quality
- Consider HLS for very large files

#### **Browser Compatibility:**
- MP4 with H.264 is most compatible
- Add multiple source formats as fallbacks
- Test on different browsers/devices

## 🚀 Quick Start

1. **Rebuild your plugin** to get the updated video HTML
2. **Use the streaming server**: `node examples/video-streaming-server.js`
3. **Optimize your video**: `ffmpeg -i input.mp4 -movflags +faststart output.mp4`
4. **Test**: Open your HTML file through the streaming server

Your large MP4 files should now stream properly instead of trying to load completely!
