/** @format */

// alert("Hello World");
const output = document.getElementById("output");

function getInputWord() {
  const userInput = document.getElementById("user-input").value.trim();
  if (!userInput) {
    return alert("add some word");
  }
}

function renderMessage(msg) {}

async function fetchDefiniton(word) {
  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(
        word
      )}`
    );
    if (!response.ok) {
      throw new Error("Word not found");
    }
    return await response.json();
  } catch (error) {
    return { error: error.message };
  }
}

async function renderResult() {
  const word = getInputWord();
  const results = await fetchDefiniton(word);

  if (results.error) {
    return (output.innerHTML = `<p>${results.error}</p>`);
  }

  const definition = results[0].meanings[0].definitions[0].definition;
  const phonetic = results[0].phonetics[0]?.text || "No Phonetic available";

  output.innerHTML = `
    <h2 class="text-bold">${results[0].word}</h2>
    <p><strong>Definition:</strong> ${definition}</p>
    <p><strong>Phonetic:</strong> ${phonetic}</p>
  `;

  document.getElementById("user-input").value = "";
}

document.getElementById("searchBtn").addEventListener("click", renderResult);
