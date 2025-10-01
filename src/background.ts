// Background script for Hello World Extension
console.log("Background running");

// Optional: Add any background functionality here
chrome.runtime.onInstalled.addListener(() => {
  console.log("Hello World Extension installed");
});
