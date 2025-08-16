# Chrome Extension Projects

This repository contains projects for building Chrome extensions.

## Available Extensions

This repository holds two separate extension projects:

1.  **Starter Template (root directory: `/`)**
    - A very basic "Hello, World!" template. Use this as a starting point for a new, simple extension.
    - To install, load the **root directory** of this repository as an unpacked extension in Chrome.

2.  **Automatic Flashcards (subdirectory: `/flashcards-extension`)**
    - A more advanced extension that demonstrates how to read content from a webpage, call an API, and display the results.
    - To install, load the `flashcards-extension` **subdirectory** as an unpacked extension in Chrome.

## Getting Started

1.  Decide which extension you want to install or modify.
2.  Open Chrome and navigate to `chrome://extensions`.
3.  Enable "Developer mode".
4.  Click "Load unpacked".
5.  Select the correct directory for the extension you want to load (either the root folder for the template or the `flashcards-extension` folder for the flashcard tool).

---

### Original Starter Template README

The files in the root directory (`manifest.json`, `popup.html`, etc.) form a basic starter template.

*   **Structure**:
    *   `manifest.json`: The main configuration file for the extension.
    *   `popup.html`: The HTML for the extension's popup.
    *   `popup.js`: The JavaScript for the extension's popup.
    *   `popup.css`: The CSS for the extension's popup.
    *   `images/`: A directory for the extension's icons.

*   **Customization**:
    *   Edit `manifest.json` to change the extension's name, description, etc.
    *   Modify the `popup` files to create your UI.
    *   Replace the placeholder icons in `images/`.
