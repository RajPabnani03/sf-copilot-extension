(function() {
  console.log('Content script starting');

  function initializeCopilot() {
    try {
      console.log('Initializing Copilot');

      // Function to inject UI
      function injectExtensionUI() {
        if (document.getElementById('sf-copilot-extension')) {
          console.log('UI already injected');
          return;
        }

        console.log('Injecting UI');
        const extensionDiv = document.createElement('div');
        extensionDiv.id = 'sf-copilot-extension';
        extensionDiv.innerHTML = `
          <div id="sf-copilot-header">
            <button id="sf-copilot-toggle">Copilot</button>
          </div>
          <div id="sf-copilot-body" style="display:none;">
            <textarea id="sf-copilot-input" placeholder="Enter your code here..."></textarea>
            <button id="sf-copilot-get-suggestion">Get Suggestion</button>
            <div id="sf-copilot-output"></div>
          </div>
        `;
        document.body.appendChild(extensionDiv);

        // Add event listeners
        document.getElementById('sf-copilot-toggle').addEventListener('click', toggleCopilotUI);
        document.getElementById('sf-copilot-get-suggestion').addEventListener('click', getSuggestion);
        
        console.log('UI injected successfully');
      }

      // Function to toggle UI visibility
      function toggleCopilotUI() {
        const body = document.getElementById('sf-copilot-body');
        body.style.display = body.style.display === 'none' ? 'block' : 'none';
        console.log('Toggled Copilot UI');
      }

      // Function to get suggestion (placeholder)
      function getSuggestion() {
        const input = document.getElementById('sf-copilot-input').value;
        chrome.runtime.sendMessage({action: 'getSuggestion', input: input}, function(response) {
          document.getElementById('sf-copilot-output').textContent = response.suggestion;
        });
      }

      // Improved check for Developer Console
      function isDeveloperConsole() {
        return document.title.includes('Developer Console') || 
               document.body.innerText.includes('Developer Console') ||
               document.querySelector('.devConsoleTabHeader') !== null;
      }

      // Check if we're in the Developer Console
      if (isDeveloperConsole()) {
        console.log('Salesforce Developer Console detected');
        injectExtensionUI();
      } else {
        console.log('Not in Developer Console');
      }

      // Inject CSS
      const link = document.createElement('link');
      link.href = chrome.runtime.getURL('styles.css');
      link.type = 'text/css';
      link.rel = 'stylesheet';
      (document.head || document.documentElement).appendChild(link);
      console.log('CSS injected');

    } catch (error) {
      console.error('Error in content script:', error);
      chrome.runtime.sendMessage({type: 'error', message: error.message});
    }
  }

  // Wait for the DOM to be fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCopilot);
  } else {
    initializeCopilot();
  }

  // Additional check for dynamic content loading
  const observer = new MutationObserver((mutations) => {
    if (isDeveloperConsole() && !document.getElementById('sf-copilot-extension')) {
      console.log('Developer Console detected after page mutation');
      initializeCopilot();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

})();
