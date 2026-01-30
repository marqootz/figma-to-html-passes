/**
 * Generate macOS tray template icons per Apple HIG:
 * trayIconTemplate.png (18×18) and trayIconTemplate@2x.png (36×36).
 * Recommended: 16×16 or 18×18 @1x, 32×32 or 36×36 @2x; max height 22px.
 * Black + alpha only so macOS can tint for light/dark menu bar.
 * Filename must end in "Template" for Electron/macOS to treat as template image.
 */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const assetsDir = path.join(__dirname, '..', 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// CRC32 for PNG chunks (standard polynomial)
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  crcTable[n] = c >>> 0;
}
function crc32(buf) {
  let c = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ (-1)) >>> 0;
}

function writeU32(buf, offset, val) {
  buf[offset] = (val >>> 24) & 0xff;
  buf[offset + 1] = (val >>> 16) & 0xff;
  buf[offset + 2] = (val >>> 8) & 0xff;
  buf[offset + 3] = val & 0xff;
}

function createPng(size) {
  const w = size;
  const h = size;
  const padding = Math.max(2, Math.floor(size * 0.18));

  // Raw RGBA scanlines with filter byte 0 per row (black + alpha for template)
  const rowSize = 1 + w * 4;
  const raw = Buffer.alloc(rowSize * h);
  let off = 0;
  for (let y = 0; y < h; y++) {
    raw[off++] = 0; // filter type
    for (let x = 0; x < w; x++) {
      const inSquare =
        x >= padding &&
        x < w - padding &&
        y >= padding &&
        y < h - padding;
      // Template: black + alpha only. macOS tints for light/dark menu bar.
      raw[off++] = inSquare ? 0 : 0;   // R
      raw[off++] = inSquare ? 0 : 0;   // G
      raw[off++] = inSquare ? 0 : 0;   // B
      raw[off++] = inSquare ? 255 : 0; // A
    }
  }

  // PNG IDAT requires zlib-wrapped deflate (with header), NOT raw deflate
  const deflated = zlib.deflateSync(raw, { level: 9 });

  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  const ihdrData = Buffer.alloc(13);
  writeU32(ihdrData, 0, w);
  writeU32(ihdrData, 4, h);
  ihdrData[8] = 8;  // bit depth
  ihdrData[9] = 6;  // color type RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdrChunk = Buffer.concat([
    Buffer.from([0, 0, 0, 13]),
    Buffer.from('IHDR'),
    ihdrData,
    Buffer.alloc(4)
  ]);
  writeU32(ihdrChunk, ihdrChunk.length - 4, crc32(Buffer.concat([Buffer.from('IHDR'), ihdrData])));

  const idatChunk = Buffer.concat([
    Buffer.alloc(4),
    Buffer.from('IDAT'),
    deflated,
    Buffer.alloc(4)
  ]);
  writeU32(idatChunk, 0, deflated.length);
  writeU32(idatChunk, idatChunk.length - 4, crc32(Buffer.concat([Buffer.from('IDAT'), deflated])));

  const iendChunk = Buffer.concat([
    Buffer.from([0, 0, 0, 0]),
    Buffer.from('IEND'),
    Buffer.alloc(4)
  ]);
  writeU32(iendChunk, iendChunk.length - 4, crc32(Buffer.from('IEND')));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const png18 = createPng(18);
const png36 = createPng(36);

fs.writeFileSync(path.join(assetsDir, 'trayIconTemplate.png'), png18);
fs.writeFileSync(path.join(assetsDir, 'trayIconTemplate@2x.png'), png36);

console.log('Generated assets/trayIconTemplate.png (18×18) and trayIconTemplate@2x.png (36×36)');
