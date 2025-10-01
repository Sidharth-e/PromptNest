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

// Add a slim sidebar toggle for easier access
const createToggleButton = () => {
  const sidebarToggle = document.createElement('div');
  sidebarToggle.id = 'pn-sidebar-toggle';
  sidebarToggle.title = 'PromptNest (Ctrl+Shift+P)';
  sidebarToggle.style.cssText = `
    position: fixed;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    width: 14px;
    height: 120px;
    background: #007acc;
    color: white;
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
    z-index: 9999;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  `;

  // Add a subtle chevron
  sidebarToggle.innerHTML = `<svg viewBox="0 0 24 24" width="10" height="10" fill="#ffffff"><path d="M9.29 6.71a1 1 0 0 0 0 1.41L12.17 11l-2.88 2.88a1 1 0 1 0 1.42 1.41l3.59-3.59a1 1 0 0 0 0-1.41L10.71 6.7a1 1 0 0 0-1.42.01z"/></svg>`;

  sidebarToggle.addEventListener('mouseenter', () => {
    sidebarToggle.style.width = '16px';
    sidebarToggle.style.backgroundColor = '#005a9e';
  });

  sidebarToggle.addEventListener('mouseleave', () => {
    sidebarToggle.style.width = '14px';
    sidebarToggle.style.backgroundColor = '#007acc';
  });

  sidebarToggle.addEventListener('click', () => {
    promptUI.toggle();
  });

  document.body.appendChild(sidebarToggle);
};

// Add the toggle button when the page is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createToggleButton);
} else {
  createToggleButton();
}

console.log('PromptNest Extension content script loaded');
