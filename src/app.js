/** @format */

// alert("Hello World");
const output = document.getElementById("output");

function getInputWord() {
  const userInput = document.getElementById("user-input").value.trim();
  if (!userInput) {
    renderMessage("Please Enter a word");
  }
  return userInput;
}

function renderMessage(msg) {
  output.innerHTML = `<p class="text-red-600">${msg}</p>`;
}

async function fetchDefinition(word) {
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
  if (!word) return;

  const results = await fetchDefinition(word);
  if (results.error) {
    return renderMessage(results.error);
  } else {
    const definition = results[0].meanings[0].definitions[0].definition;
    const phonetic = results[0].phonetics[0]?.text || "No Phonetic available";
    const partOfSpeech = results[0].meanings[0].partOfSpeech;
    const example = results[0].meanings[0].definitions[0].example || "No example available"
    const synonyms =  results[0].meanings[0].definitions[0].synonyms

    output.innerHTML = `
    <div class="bg-[#F6F6F6] border-0 rounded-sm p-5 mt-5">
      <div class="flex justify-between items-center">
         <h2 class="text-bold">${results[0].word}</h2>
        <svg class="w-6 h-6 text-gray-800 dark:text-white" 
        aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
        fill="currentColor" 
        viewBox="0 0 24 24"><path d="m12.75 20.66 6.184-7.098c2.677-2.884 2.559-6.506.754-8.705-.898-1.095-2.206-1.816-3.72-1.855-1.293-.034-2.652.43-3.963 1.442-1.315-1.012-2.678-1.476-3.973-1.442-1.515.04-2.825.76-3.724 1.855-1.806 2.201-1.915 5.823.772 8.706l6.183 7.097c.19.216.46.34.743.34a.985.985 0 0 0 .743-.34Z"/>
        </svg>
      </div>
        <p class="mt-8"><strong>Definition:</strong> ${definition}</p>
        <p><strong>Phonetic:</strong> ${phonetic}</p>
        <p><strong>Part of Speech:</strong> ${partOfSpeech}</p>
        <p><strong>Example in a sentence:</strong> ${example}</p>
        <p><strong>Synonyms:</strong> ${synonyms && synonyms.length ? synonyms.join(", ") : "No synonyms"}</p>
      </div>
      `;
  }
  

  document.getElementById("user-input").value = "";
}

document.getElementById("searchBtn").addEventListener("click", renderResult);
