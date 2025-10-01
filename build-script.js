const fs = require('fs');
const path = require('path');

// Clean and create build directory
const buildDir = 'build';
if (fs.existsSync(buildDir)) {
  fs.rmSync(buildDir, { recursive: true, force: true });
}
fs.mkdirSync(buildDir, { recursive: true });

// Copy manifest.json
fs.copyFileSync('manifest.json', path.join(buildDir, 'manifest.json'));

// Copy icons directory
if (fs.existsSync('icons')) {
  fs.cpSync('icons', path.join(buildDir, 'icons'), { recursive: true });
}

// Copy compiled JavaScript files from dist (including subdirectories)
function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const items = fs.readdirSync(src);
  items.forEach(item => {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    
    if (fs.statSync(srcPath).isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else if (item.endsWith('.js')) {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

if (fs.existsSync('dist')) {
  copyDirectory('dist', buildDir);
}

console.log('Build completed successfully!');
console.log('Extension files are in the "build" directory.');
console.log('Load the extension from the build directory in Chrome/Edge developer mode.');
