document.addEventListener('DOMContentLoaded', () => {
    const generateButton = document.getElementById('generate-button');
    const flashcardsContainer = document.getElementById('flashcards-container');
    const languageSelect = document.getElementById('language-select');

    // --- Language Persistence ---

    function saveLanguagePreference() {
        const selectedLanguage = languageSelect.value;
        chrome.storage.local.set({ language: selectedLanguage });
    }

    function loadLanguagePreference() {
        chrome.storage.local.get(['language'], (result) => {
            if (result.language) {
                languageSelect.value = result.language;
            }
        });
    }

    // Load saved language on startup and add listener for changes
    loadLanguagePreference();
    languageSelect.addEventListener('change', saveLanguagePreference);

    // --- Core Logic ---

    generateButton.addEventListener('click', () => {
        generateButton.disabled = true;
        flashcardsContainer.innerHTML = '<p>Generating flashcards...</p>';

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const activeTab = tabs[0];
            if (!activeTab || !activeTab.id) {
                flashcardsContainer.innerHTML = '<p>Could not find active tab.</p>';
                generateButton.disabled = false;
                return;
            }

            chrome.scripting.executeScript(
                {
                    target: { tabId: activeTab.id },
                    files: ['content.js'],
                },
                (injectionResults) => {
                    if (chrome.runtime.lastError || !injectionResults || injectionResults.length === 0) {
                        flashcardsContainer.innerHTML = '<p>Error: Could not access page content. Try a different page.</p>';
                        generateButton.disabled = false;
                        return;
                    }

                    const pageText = injectionResults[0].result;
                    if (!pageText) {
                        flashcardsContainer.innerHTML = '<p>Could not extract text from the page.</p>';
                        generateButton.disabled = false;
                        return;
                    }

                    // Using a more robust regex to better match words
                    const words = pageText.match(/[\p{L}]+/gu) || [];
                    const uniqueWords = [...new Set(words.map(word => word.toLowerCase()))];

                    const wordsToDefine = uniqueWords.slice(0, 5);

                    if (wordsToDefine.length === 0) {
                        flashcardsContainer.innerHTML = '<p>No words found on the page.</p>';
                        generateButton.disabled = false;
                        return;
                    }

                    const selectedLanguage = languageSelect.value;
                    getDefinitions(wordsToDefine, selectedLanguage);
                }
            );
        });
    });

    async function getDefinitions(words, lang) {
        const promises = words.map(word =>
            fetch(`https://freedictionaryapi.com/api/v1/entries/${lang}/${word}`)
                .then(response => {
                    if (!response.ok) return null;
                    return response.json();
                })
                .catch(() => null)
        );

        const results = await Promise.all(promises);

        flashcardsContainer.innerHTML = ''; // Clear loading message
        let definitionsFound = 0;

        results.forEach(result => {
            if (result && result.word) {
                const wordData = result.entries?.[0];
                if (!wordData) return;

                const definition = wordData.senses?.[0]?.definition || 'No definition found.';
                const partOfSpeech = wordData.partOfSpeech || '';

                const card = document.createElement('div');
                card.className = 'flashcard';
                card.innerHTML = `<h3>${result.word} <em>(${partOfSpeech})</em></h3><p>${definition}</p>`;
                flashcardsContainer.appendChild(card);
                definitionsFound++;
            }
        });

        if (definitionsFound === 0) {
            flashcardsContainer.innerHTML = '<p>Could not find definitions for any words on the page.</p>';
        }

        generateButton.disabled = false;
    }
});
