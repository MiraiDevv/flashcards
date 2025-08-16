# Automatic Flashcards Extension

This Chrome extension generates flashcards from the text content of the current webpage.

## How to Install

1.  Open Chrome and navigate to `chrome://extensions`.
2.  Enable "Developer mode" using the toggle in the top-right corner.
3.  Click the "Load unpacked" button.
4.  In the file selection dialog, choose the `flashcards-extension` directory (this directory). **Do not select the root folder of the repository.**

## How to Use

1.  Navigate to any webpage with a good amount of text content (e.g., a news article, a blog post).
2.  Click the extension's icon in the Chrome toolbar.
3.  In the popup that appears, click the "Generate Flashcards" button.
4.  The extension will extract words from the page, find their definitions, and display them as flashcards in the popup.

## How it Works

*   `popup.js` contains the main logic. When the button is clicked, it injects `content.js` into the current page.
*   `content.js` grabs all the visible text on the page and sends it back to `popup.js`.
*   `popup.js` processes the text to find the first 5 unique words.
*   It then calls the [Free Dictionary API](https://dictionaryapi.dev/) to get definitions for those words.
*   Finally, it renders the words and their definitions as flashcards in the popup window.
