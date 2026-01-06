/**
 * PWA 아이콘 생성 스크립트
 *
 * favicon.svg를 기반으로 다양한 크기의 PNG 아이콘을 생성합니다.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import zlib from 'zlib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sizes = [192, 512];
const inputSvg = path.join(__dirname, '../public/favicon.svg');
const outputDir = path.join(__dirname, '../public/icons');
const publicDir = path.join(__dirname, '../public');

function createChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);

  const typeBuffer = Buffer.from(type, 'ascii');
  const crcData = Buffer.concat([typeBuffer, data]);

  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(crcData), 0);

  return Buffer.concat([length, typeBuffer, data, crc]);
}

function crc32(buffer) {
  let crc = 0xffffffff;
  const table = getCRC32Table();

  for (let i = 0; i < buffer.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buffer[i]) & 0xff];
  }

  return (crc ^ 0xffffffff) >>> 0;
}

let crcTable = null;
function getCRC32Table() {
  if (crcTable) return crcTable;

  crcTable = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    crcTable[i] = c;
  }
  return crcTable;
}

function createPNGWithZlib(size) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(size, 0);
  ihdrData.writeUInt32BE(size, 4);
  ihdrData.writeUInt8(8, 8);
  ihdrData.writeUInt8(2, 9);
  ihdrData.writeUInt8(0, 10);
  ihdrData.writeUInt8(0, 11);
  ihdrData.writeUInt8(0, 12);
  const ihdrChunk = createChunk('IHDR', ihdrData);

  // IDAT - Teal colored image
  const rawData = [];
  for (let y = 0; y < size; y++) {
    rawData.push(0); // filter byte
    for (let x = 0; x < size; x++) {
      rawData.push(15, 118, 110); // Teal RGB (#0f766e)
    }
  }
  const idatData = zlib.deflateSync(Buffer.from(rawData));
  const idatChunk = createChunk('IDAT', idatData);

  // IEND
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

async function generateIcons() {
  console.log('PWA 아이콘 생성 시작...\n');

  // 출력 디렉토리 생성
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  let sharp;
  try {
    sharp = (await import('sharp')).default;
    console.log('sharp 라이브러리 발견 - SVG에서 PNG 생성\n');
  } catch {
    console.log('sharp 라이브러리 없음 - placeholder 이미지 생성\n');
  }

  if (sharp && fs.existsSync(inputSvg)) {
    // sharp를 사용한 고품질 아이콘 생성
    const svgBuffer = fs.readFileSync(inputSvg);

    for (const size of sizes) {
      const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(outputPath);
      console.log(`생성됨: icon-${size}x${size}.png`);
    }

    // apple-touch-icon
    await sharp(svgBuffer)
      .resize(180, 180)
      .png()
      .toFile(path.join(publicDir, 'apple-touch-icon.png'));
    console.log('생성됨: apple-touch-icon.png');

  } else {
    // Placeholder 이미지 생성 (zlib 사용)
    for (const size of sizes) {
      const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);
      const pngBuffer = createPNGWithZlib(size);
      fs.writeFileSync(outputPath, pngBuffer);
      console.log(`생성됨 (placeholder): icon-${size}x${size}.png`);
    }

    // apple-touch-icon (180x180)
    const appleIconBuffer = createPNGWithZlib(180);
    fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), appleIconBuffer);
    console.log('생성됨 (placeholder): apple-touch-icon.png');
  }

  console.log('\n아이콘 생성 완료!');
}

generateIcons().catch(console.error);
