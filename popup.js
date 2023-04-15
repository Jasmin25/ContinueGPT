// Wait for the DOM to be fully loaded before executing the script
document.addEventListener('DOMContentLoaded', () => {
  // Get references to the form, input textarea, and save button elements
  const form = document.getElementById('message-form');
  const input = document.getElementById('continue-message');
  const saveButton = document.querySelector('button[type="submit"]');

  // Fetch the stored continueMessage from chrome.storage.sync
  chrome.storage.sync.get(['continueMessage'], (result) => {
    // If a continueMessage is stored, set the input value to it
    if (result.continueMessage) {
      input.value = result.continueMessage;
    }
  });

  // Add a submit event listener to the form
  form.addEventListener('submit', (event) => {
    // Prevent the default form submission behavior
    event.preventDefault();
    // Get the trimmed input value
    const message = input.value.trim();

    // If there's a message, save it to chrome.storage.sync
    if (message) {
      chrome.storage.sync.set({ continueMessage: message }, () => {
        console.log('Message saved:', message);
      });
    } else {
      // If the message is empty, remove the continueMessage from chrome.storage.sync
      chrome.storage.sync.remove('continueMessage', () => {
        console.log('Message cleared');
      });
    }

    // Provide UI feedback
    // Change the save button text and style to indicate the message has been saved
    saveButton.textContent = 'Saved';
    saveButton.classList.remove('bg-indigo-600', 'hover:bg-indigo-700');
    saveButton.classList.add('bg-green-500', 'hover:bg-green-600');

    // Reset the save button text and style after a short delay
    setTimeout(() => {
      saveButton.textContent = 'Save';
      saveButton.classList.remove('bg-green-500', 'hover:bg-green-600');
      saveButton.classList.add('bg-indigo-600', 'hover:bg-indigo-700');
    }, 1500);
  });
});
