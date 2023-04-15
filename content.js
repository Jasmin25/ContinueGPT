// Function to add the "Continue response" button to the ChatGPT page
function addButton() {
  console.log('addButton called');
  // Get the "Regenerate" button element
  const regenerateBtn = document.querySelector('.btn-neutral');

  // If the "Regenerate" button exists
  if (regenerateBtn) {
    // Check if the "Continue response" button already exists
    const existingContinueBtn = document.querySelector('.continue-response-btn');
    if (existingContinueBtn) {
      console.log('Continue response button already exists');
      return false;
    }

    console.log('Regenerate button found');
    // Clone the "Regenerate" button to create the "Continue response" button
    const continueBtn = regenerateBtn.cloneNode(true);
    continueBtn.classList.remove('btn-neutral');
    continueBtn.classList.add('btn-neutral', 'continue-response-btn');
    // Update the innerHTML of the "Continue response" button
    continueBtn.innerHTML = '<div class="flex w-full items-center justify-center gap-2">' +
      '<svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" stroke="currentColor" fill="none" stroke-width="1.5" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-3 w-3" height="1em" width="1em">' +
      '<path d="M11 21.883l-6.235-7.527-.765.644 7.521 9 7.479-9-.764-.645-6.236 7.529v-21.884h-1v21.883z"/>' +
      '</svg>Continue response</div>';

    // Add a click event listener to the "Continue response" button
    continueBtn.addEventListener('click', () => {
      // Get the textarea element
      const textBox = document.querySelector('textarea');

      // Fetch the saved message from chrome.storage.sync
      chrome.storage.sync.get(['continueMessage'], (result) => {
        const savedMessage = result.continueMessage;

        // If the saved message exists, use it; otherwise, use the hardcoded message
        const message = savedMessage ? savedMessage : "You didn't finish your message, continue from where you left off";

        // Set the textarea value to the message and dispatch input and keydown events
        textBox.value = message;
        textBox.dispatchEvent(new Event('input', { bubbles: true }));
        textBox.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      });
    });

    // Insert the "Continue response" button before the "Regenerate" button
    regenerateBtn.parentElement.insertBefore(continueBtn, regenerateBtn);
    return true;
  }
  return false;
}

// Function to setup a MutationObserver to monitor changes in the ChatGPT page
function setupObserver() {
  // Define the target node and configuration for the MutationObserver
  const targetNode = document.body;
  const config = { childList: true, subtree: true };

  // Create a MutationObserver and define its callback function
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      // If the mutation type is 'childList', call addButton function
      if (mutation.type === 'childList') {
        addButton();
      }
    }
  });

  // Start observing the target node with the specified configuration
  observer.observe(targetNode, config);
}

// Run addButton function and setupObserver function when the script is executed
setTimeout(() => {
  addButton();
  setupObserver();
}, 1000);
