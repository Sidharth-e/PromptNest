// Content script for Hello World Extension
import { HelloWorldUI } from './Ui/popup';

// Initialize the extension UI
const helloWorldUI = new HelloWorldUI();

// Show the UI when the page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    helloWorldUI.show();
  });
} else {
  helloWorldUI.show();
}

// Optional: Add keyboard shortcut to toggle the UI
document.addEventListener('keydown', (event) => {
  // Ctrl/Cmd + Shift + H to toggle the UI
  if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'H') {
    event.preventDefault();
    if (helloWorldUI.isVisible()) {
      helloWorldUI.hide();
    } else {
      helloWorldUI.show();
    }
  }
});

console.log('Hello World Extension content script loaded');
