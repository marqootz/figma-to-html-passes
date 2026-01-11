#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const port = 8000;
const publicDir = __dirname;

// MIME types for video files
const mimeTypes = {
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.ogg': 'video/ogg',
    '.ogv': 'video/ogg',
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json'
};

function getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return mimeTypes[ext] || 'application/octet-stream';
}

function serveFile(filePath, res) {
    const mimeType = getMimeType(filePath);
    
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('File not found');
            return;
        }
        
        res.writeHead(200, { 'Content-Type': mimeType });
        res.end(data);
    });
}

function serveDirectory(dirPath, res) {
    fs.readdir(dirPath, (err, files) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error reading directory');
            return;
        }
        
        let html = '<html><head><title>Directory Listing</title></head><body>';
        html += '<h1>Directory Listing</h1><ul>';
        
        files.forEach(file => {
            const filePath = path.join(dirPath, file);
            const stats = fs.statSync(filePath);
            const isDir = stats.isDirectory();
            const icon = isDir ? '📁' : '📄';
            html += `<li>${icon} <a href="${file}">${file}</a></li>`;
        });
        
        html += '</ul></body></html>';
        
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
    });
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    
    // Remove leading slash and resolve path
    let filePath = pathname.substring(1);
    if (filePath === '') filePath = 'video-test.html';
    
    const fullPath = path.join(publicDir, filePath);
    
    // Security check - prevent directory traversal
    if (!fullPath.startsWith(publicDir)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('Forbidden');
        return;
    }
    
    fs.stat(fullPath, (err, stats) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('File not found');
            return;
        }
        
        if (stats.isDirectory()) {
            serveDirectory(fullPath, res);
        } else {
            serveFile(fullPath, res);
        }
    });
});

server.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
    console.log(`📁 Serving files from: ${publicDir}`);
    console.log(`🎥 Video test page: http://localhost:${port}/video-test.html`);
    console.log(`📂 Directory listing: http://localhost:${port}/`);
    console.log('\nPress Ctrl+C to stop the server');
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    server.close(() => {
        console.log('✅ Server stopped');
        process.exit(0);
    });
});
