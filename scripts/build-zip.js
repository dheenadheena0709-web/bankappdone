import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

const rootDir = process.cwd();
const publicDir = path.join(rootDir, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const zip = new JSZip();

const IGNORED_PATHS = [
  'node_modules',
  '.git',
  'dist',
  '.vite',
  'dheena-bank-mobile.zip',
  'hsbc-mobile-banking.zip',
  'public/dheena-bank-mobile.zip',
  'public/hsbc-mobile-banking.zip',
  'package-lock.json'
];

function shouldInclude(relPath) {
  for (const ignored of IGNORED_PATHS) {
    if (relPath === ignored || relPath.startsWith(ignored + '/') || relPath.startsWith(ignored + '\\')) {
      return false;
    }
  }
  return true;
}

function addFilesRecursively(currentDir, baseDir) {
  const items = fs.readdirSync(currentDir);
  for (const item of items) {
    const fullPath = path.join(currentDir, item);
    const relPath = path.relative(baseDir, fullPath).replace(/\\/g, '/');

    if (!shouldInclude(relPath)) continue;

    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      addFilesRecursively(fullPath, baseDir);
    } else {
      const content = fs.readFileSync(fullPath);
      zip.file(relPath, content);
      console.log(`Added: ${relPath}`);
    }
  }
}

console.log('Generating ZIP archive for HSBC Mobile Banking...');
addFilesRecursively(rootDir, rootDir);

zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE', compressionOptions: { level: 9 } })
  .then(buffer => {
    // Write both filenames so any previously copied link still works seamlessly
    fs.writeFileSync(path.join(publicDir, 'hsbc-mobile-banking.zip'), buffer);
    fs.writeFileSync(path.join(rootDir, 'hsbc-mobile-banking.zip'), buffer);
    fs.writeFileSync(path.join(publicDir, 'dheena-bank-mobile.zip'), buffer);
    fs.writeFileSync(path.join(rootDir, 'dheena-bank-mobile.zip'), buffer);
    console.log(`Successfully created ZIP archives (${(buffer.length / 1024).toFixed(1)} KB)`);
  })
  .catch(err => {
    console.error('Failed to generate zip:', err);
    process.exit(1);
  });
