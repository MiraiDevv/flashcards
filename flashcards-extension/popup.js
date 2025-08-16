document.addEventListener('DOMContentLoaded', () => {
    const generateButton = document.getElementById('generate-button');
    const flashcardsContainer = document.getElementById('flashcards-container');

    generateButton.addEventListener('click', () => {
        generateButton.disabled = true;
        flashcardsContainer.innerHTML = '<p>Generating flashcards...</p>';

        // 1. Get the active tab
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const activeTab = tabs[0];
            if (!activeTab) {
                flashcardsContainer.innerHTML = '<p>Could not find active tab.</p>';
                generateButton.disabled = false;
                return;
            }

            // 2. Execute the content script
            chrome.scripting.executeScript(
                {
                    target: { tabId: activeTab.id },
                    files: ['content.js'],
                },
                (injectionResults) => {
                    if (chrome.runtime.lastError || !injectionResults || injectionResults.length === 0) {
                        flashcardsContainer.innerHTML = '<p>Error injecting script. Make sure you are on a valid webpage.</p>';
                        generateButton.disabled = false;
                        return;
                    }

                    // 3. Process the result from the content script
                    const pageText = injectionResults[0].result;
                    if (!pageText) {
                        flashcardsContainer.innerHTML = '<p>Could not extract text from the page.</p>';
                        generateButton.disabled = false;
                        return;
                    }

                    // 4. Extract unique words
                    const words = pageText.match(/[a-zA-Z]+/g) || [];
                    const uniqueWords = [...new Set(words.map(word => word.toLowerCase()))];

                    // Let's just take the first 5 words to avoid too many API calls
                    const wordsToDefine = uniqueWords.slice(0, 5);

                    if (wordsToDefine.length === 0) {
                        flashcardsContainer.innerHTML = '<p>No words found on the page.</p>';
                        generateButton.disabled = false;
                        return;
                    }

                    // 5. Fetch definitions
                    getDefinitions(wordsToDefine);
                }
            );
        });
    });

    async function getDefinitions(words) {
        const promises = words.map(word =>
            fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
                .then(response => {
                    if (!response.ok) {
                       return null; // Word not found or API error
                    }
                    return response.json();
                })
        );

        const results = await Promise.all(promises);

        // 6. Display flashcards
        flashcardsContainer.innerHTML = ''; // Clear loading message
        results.forEach(result => {
            if (result && result.length > 0) {
                const wordData = result[0];
                const word = wordData.word;
                const definition = wordData.meanings[0]?.definitions[0]?.definition || 'No definition found.';

                const card = document.createElement('div');
                card.className = 'flashcard';
                card.innerHTML = `<h3>${word}</h3><p>${definition}</p>`;
                flashcardsContainer.appendChild(card);
            }
        });

        if (flashcardsContainer.innerHTML === '') {
            flashcardsContainer.innerHTML = '<p>Could not find definitions for any words on the page.</p>';
        }

        generateButton.disabled = false;
    }
});
