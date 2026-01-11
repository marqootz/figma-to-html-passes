#!/usr/bin/env node

/**
 * Video Streaming Server
 * 
 * This server is optimized for serving large video files with proper
 * HTTP Range request support for streaming.
 * 
 * Usage:
 * node examples/video-streaming-server.js [port]
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.argv[2] || 8000;
const ROOT_DIR = path.join(__dirname, '..');

// MIME types for video files
const MIME_TYPES = {
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.ogg': 'video/ogg',
    '.ogv': 'video/ogg',
    '.mov': 'video/quicktime',
    '.avi': 'video/x-msvideo',
    '.wmv': 'video/x-ms-wmv'
};

function getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return MIME_TYPES[ext] || 'application/octet-stream';
}

function parseRange(rangeHeader, fileSize) {
    if (!rangeHeader) return null;
    
    const rangeMatch = rangeHeader.match(/bytes=(\d+)-(\d*)/);
    if (!rangeMatch) return null;
    
    const start = parseInt(rangeMatch[1]);
    const end = rangeMatch[2] ? parseInt(rangeMatch[2]) : fileSize - 1;
    
    return { start, end };
}

function serveVideoFile(req, res, filePath) {
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const mimeType = getMimeType(filePath);
    
    // Parse Range header for streaming
    const range = parseRange(req.headers.range, fileSize);
    
    if (range) {
        // Partial content request (streaming)
        const { start, end } = range;
        const chunkSize = (end - start) + 1;
        
        res.statusCode = 206;
        res.setHeader('Content-Range', `bytes ${start}-${end}/${fileSize}`);
        res.setHeader('Accept-Ranges', 'bytes');
        res.setHeader('Content-Length', chunkSize);
        res.setHeader('Content-Type', mimeType);
        res.setHeader('Cache-Control', 'public, max-age=3600');
        
        const stream = fs.createReadStream(filePath, { start, end });
        stream.pipe(res);
        
        stream.on('error', (err) => {
            console.error('Stream error:', err);
            res.statusCode = 500;
            res.end('Internal Server Error');
        });
    } else {
        // Full file request
        res.statusCode = 200;
        res.setHeader('Content-Length', fileSize);
        res.setHeader('Content-Type', mimeType);
        res.setHeader('Accept-Ranges', 'bytes');
        res.setHeader('Cache-Control', 'public, max-age=3600');
        
        const stream = fs.createReadStream(filePath);
        stream.pipe(res);
        
        stream.on('error', (err) => {
            console.error('Stream error:', err);
            res.statusCode = 500;
            res.end('Internal Server Error');
        });
    }
}

function serveStaticFile(req, res, filePath) {
    try {
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            // Serve directory listing
            const files = fs.readdirSync(filePath);
            const html = `
                <!DOCTYPE html>
                <html>
                <head><title>Directory: ${path.basename(filePath)}</title></head>
                <body>
                    <h1>Directory: ${path.basename(filePath)}</h1>
                    <ul>
                        ${files.map(file => `<li><a href="${path.join(req.url, file)}">${file}</a></li>`).join('')}
                    </ul>
                </body>
                </html>
            `;
            res.setHeader('Content-Type', 'text/html');
            res.end(html);
        } else {
            // Check if it's a video file
            const ext = path.extname(filePath).toLowerCase();
            if (MIME_TYPES[ext]) {
                serveVideoFile(req, res, filePath);
            } else {
                // Regular file
                const stream = fs.createReadStream(filePath);
                const mimeType = getMimeType(filePath);
                res.setHeader('Content-Type', mimeType);
                stream.pipe(res);
            }
        }
    } catch (err) {
        res.statusCode = 404;
        res.end('File not found');
    }
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url);
    let filePath = path.join(ROOT_DIR, parsedUrl.pathname);
    
    // Security check - prevent directory traversal
    if (!filePath.startsWith(ROOT_DIR)) {
        res.statusCode = 403;
        res.end('Forbidden');
        return;
    }
    
    console.log(`${req.method} ${req.url} - ${req.headers.range ? 'Range: ' + req.headers.range : 'Full request'}`);
    
    serveStaticFile(req, res, filePath);
});

server.listen(PORT, () => {
    console.log(`🚀 Video Streaming Server running on http://localhost:${PORT}`);
    console.log(`📁 Serving files from: ${ROOT_DIR}`);
    console.log(`🎥 Video streaming enabled with HTTP Range support`);
    console.log(`\nUsage:`);
    console.log(`  Open your HTML file: http://localhost:${PORT}/examples/figma-structure.html`);
    console.log(`  Video files: http://localhost:${PORT}/examples/video/`);
    console.log(`\nPress Ctrl+C to stop`);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use. Try a different port:`);
        console.error(`   node examples/video-streaming-server.js ${PORT + 1}`);
    } else {
        console.error('Server error:', err);
    }
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    server.close(() => {
        console.log('✅ Server stopped');
        process.exit(0);
    });
});
