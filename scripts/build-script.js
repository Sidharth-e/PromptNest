const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const esbuild = require('esbuild');

async function run() {
  const packageJsonPath = path.resolve('package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  const version = packageJson.version || '0.0.0';

  const distDir = 'dist';
  const buildDir = 'build';
  const releaseDir = 'releases';

  // Clean output folders
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
  }
  if (fs.existsSync(buildDir)) {
    fs.rmSync(buildDir, { recursive: true, force: true });
  }
  fs.mkdirSync(distDir, { recursive: true });
  fs.mkdirSync(buildDir, { recursive: true });

  // Build TypeScript sources with esbuild (bundled per entry)
  await esbuild.build({
    entryPoints: [
      'src/background.ts',
      'src/content.ts',
      'src/InputObserver.ts',
      'src/PromptManager.ts',
      'src/PromptUI.ts',
      'src/Ui/popup.ts'
    ],
    outdir: distDir,
    bundle: true,
    format: 'iife',
    target: ['es2020'],
    sourcemap: false,
    platform: 'browser',
    logLevel: 'info'
  });

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

  if (fs.existsSync(distDir)) {
    copyDirectory(distDir, buildDir);
  }

  // Create releases directory
  fs.mkdirSync(releaseDir, { recursive: true });
  const zipName = `PromptNest-${version}.zip`;
  const zipPath = path.join(releaseDir, zipName);

  // Zip the build directory
  await new Promise((resolve, reject) => {
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', resolve);
    archive.on('error', reject);

    archive.pipe(output);
    archive.directory(buildDir + '/', false);
    archive.finalize();
  });

  console.log('Build completed successfully!');
  console.log(`Extension folder: ${buildDir}`);
  console.log(`ZIP created: ${zipPath}`);
  console.log('You can load the folder in developer mode, or distribute the ZIP.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
