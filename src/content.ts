// Content script for PromptNest Extension
import { PromptUI } from './PromptUI';
import { InputObserver } from './InputObserver';

// Initialize the extension components
const promptUI = new PromptUI();
const inputObserver = new InputObserver();

// Show the UI when the page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // Don't auto-show the UI, let users toggle it manually
    console.log('PromptNest Extension loaded - ready to use!');
  });
} else {
  console.log('PromptNest Extension loaded - ready to use!');
}

// Keyboard shortcut to toggle the UI
document.addEventListener('keydown', (event) => {
  // Ctrl/Cmd + Shift + P to toggle the PromptNest UI
  if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'P') {
    event.preventDefault();
    promptUI.toggle();
  }
});

// Add a floating toggle button for easier access
const createToggleButton = () => {
  const toggleButton = document.createElement('button');
  toggleButton.innerHTML = '📝';
  toggleButton.title = 'PromptNest (Ctrl+Shift+P)';
  toggleButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: #007acc;
    color: white;
    border: none;
    font-size: 20px;
    cursor: pointer;
    z-index: 9999;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  `;

  toggleButton.addEventListener('mouseenter', () => {
    toggleButton.style.transform = 'scale(1.1)';
    toggleButton.style.backgroundColor = '#005a9e';
  });

  toggleButton.addEventListener('mouseleave', () => {
    toggleButton.style.transform = 'scale(1)';
    toggleButton.style.backgroundColor = '#007acc';
  });

  toggleButton.addEventListener('click', () => {
    promptUI.toggle();
  });

  document.body.appendChild(toggleButton);
};

// Add the toggle button when the page is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createToggleButton);
} else {
  createToggleButton();
}

console.log('PromptNest Extension content script loaded');
