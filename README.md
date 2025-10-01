# Hello World Browser Extension

A TypeScript-based browser extension that displays a "Hello World" message on web pages.

## Project Structure

```
project-root/
│── icons/                 # Extension icons (16x16, 48x48, 128x128)
│── src/                   # TypeScript source files
│   ├── background.ts      # Background service worker
│   ├── content.ts         # Content script that injects UI
│   └── Ui/
│       └── popup.ts       # UI component
│── manifest.json          # Extension manifest (Manifest V3)
│── tsconfig.json          # TypeScript configuration
│── package.json           # Dependencies and build scripts
│── build-script.js        # Build script to organize files
│── README.md              # This file
```

## Features

- **No popup.html**: UI is injected directly into web pages via content script
- **TypeScript**: Full TypeScript support with proper type definitions
- **Manifest V3**: Uses the latest extension manifest format
- **Modern UI**: Clean, responsive UI component with close functionality
- **Keyboard Shortcut**: Press `Ctrl/Cmd + Shift + H` to toggle the UI

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Build the extension**:
   ```bash
   npm run build
   ```

3. **Load in browser**:
   - Open Chrome/Edge
   - Go to `chrome://extensions/` or `edge://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `build` folder

## Development

- **Watch mode**: `npm run dev` (compiles TypeScript on file changes)
- **Clean build**: `npm run clean` (removes dist and build folders)
- **Build only**: `npm run build:ts` (compiles TypeScript only)

## Usage

Once loaded, the extension will:
1. Display a "Hello World" message on all web pages
2. Show a floating UI component in the top-right corner
3. Allow closing the UI with the × button
4. Toggle visibility with `Ctrl/Cmd + Shift + H`

## Customization

- **UI Styling**: Modify the CSS in `src/Ui/popup.ts`
- **Permissions**: Update `manifest.json` permissions as needed
- **Content Scripts**: Adjust matches in `manifest.json` to target specific sites

## Notes

- The icon files in `icons/` are placeholders and should be replaced with actual PNG icons
- The extension uses ES modules and requires a modern browser
- Background script logs messages to the browser console for debugging
