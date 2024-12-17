// util.js

// Sleep function: pauses execution for a specified number of milliseconds
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// TypeText function: simulates typing text character by character
export const typeText = async (text, setText) => {
  setText(""); // Clear any existing text
  let currentMessage = "";
  for (let i = 0; i < text.length; i++) {
    currentMessage += text.charAt(i);
    setText(currentMessage);
    await sleep(50); // Wait 50ms between each character
  }
};


