// Background script for PromptNest Extension
console.log("PromptNest Background script running");

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
  console.log("PromptNest Extension installed");
  
  if (details.reason === 'install') {
    // Initialize default storage if needed
    chrome.storage.local.get(['promptNest_prompts'], (result) => {
      if (!result.promptNest_prompts) {
        chrome.storage.local.set({ promptNest_prompts: [] });
        console.log("Initialized empty prompts storage");
      }
    });
  }
});

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getPrompts') {
    chrome.storage.local.get(['promptNest_prompts'], (result) => {
      sendResponse({ prompts: result.promptNest_prompts || [] });
    });
    return true; // Keep message channel open for async response
  }
  
  if (request.action === 'savePrompt') {
    chrome.storage.local.get(['promptNest_prompts'], (result) => {
      const prompts = result.promptNest_prompts || [];
      prompts.push(request.prompt);
      chrome.storage.local.set({ promptNest_prompts: prompts }, () => {
        sendResponse({ success: true });
      });
    });
    return true;
  }
  
  if (request.action === 'deletePrompt') {
    chrome.storage.local.get(['promptNest_prompts'], (result) => {
      const prompts = result.promptNest_prompts || [];
      const filteredPrompts = prompts.filter((p: any) => p.id !== request.promptId);
      chrome.storage.local.set({ promptNest_prompts: filteredPrompts }, () => {
        sendResponse({ success: true });
      });
    });
    return true;
  }
});

// Optional: Add context menu for quick access
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'promptNest',
    title: 'Open PromptNest',
    contexts: ['editable']
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'promptNest' && tab?.id) {
    chrome.tabs.sendMessage(tab.id, { action: 'togglePromptNest' });
  }
});
