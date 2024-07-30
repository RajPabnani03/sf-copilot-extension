// Log when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  console.log('Salesforce Copilot Extension installed/updated');
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getSuggestion') {
    // Placeholder for future GitHub Copilot API integration
    // For now, just echo back a simple suggestion
    const suggestion = `Suggestion for: ${request.input}`;
    sendResponse({ suggestion: suggestion });
  }
  // Return true to indicate you wish to send a response asynchronously
  return true;
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'error') {
    console.error('Error in content script:', message.error);
  }
});
