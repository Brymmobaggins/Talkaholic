/** @format */

// alert("Hello World");
const output = document.getElementById("output");
document.getElementById("searchBtn").addEventListener("click", renderResult);

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
    let word = results[0]?.word || "No word available";
    word = word[0].toUpperCase() + word.slice(1);

    const definition =
      results[0]?.meanings[0]?.definitions[0]?.definition ||
      "No definition available";
    const phonetic = results[0].phonetics[0]?.text || "";
    const audio = results[0].phonetics[0]?.audio || "";
    const partOfSpeech =
      results[0]?.meanings[0]?.partOfSpeech || "Not specified";
    const example =
      results[0].meanings[0].definitions[0].example || "No example available";
    const synonyms = results[0]?.meanings[0]?.definitions[0]?.synonyms || [];

    output.innerHTML = `
    <div class="bg-[#f9fafa] border-0 rounded-sm p-5 mt-5">
      <div class="flex justify-between items-center">
         <h2 class="heading-color">${word}</h2>
         <button type="button" class="border p-1" id="addToFavoriteBtn"
         onclick="addToFavourites('${word}')">Add to bookmark</button>
       
      </div>
        <p class="mt-8 text-color"><strong>Definition:</strong> ${definition}</p>
        <p class="text-color"><strong>Phonetic:</strong> ${
          phonetic || "no phonetic available"
        }</p>
          <p><strong>Audio</strong>
        ${
          audio
            ? `<audio controls src="${audio}"></audio>`
            : "<span>No audio available</span>"
        }</p>
        
        <p class="text-color"><strong>Part of speech:</strong> ${partOfSpeech}</p>
        <p class="text-color"><strong>Example in a sentence:</strong> ${example}</p>
        <p class="text-color"><strong>Synonyms:</strong> ${
          synonyms && synonyms.length ? synonyms.join(", ") : "No synonyms"
        }</p>
    </div>
      `;
  }

  document.getElementById("user-input").value = "";
}

let favourites = JSON.parse(localStorage.getItem("favourites")) || [];
const favouriteTab = document.getElementById("favourite");
function renderFavouriteList() {
  const retrieveWords = JSON.parse(localStorage.getItem("favourites")) || [];
  favouriteTab.innerHTML = ""
  
  retrieveWords.forEach((retrieveWord) => {
    favouriteTab.innerHTML += `
          <div class="bg-[#f9fafa] border-0 rounded-sm p-5 mt-5">
           <p class="text-color">${retrieveWord}</p>
          </div>
        `;
  });
}


function addToFavourites(word) {
  if (!favourites.includes(word)) {
    favourites.push(word);
    localStorage.setItem("favourites", JSON.stringify(favourites));
    renderFavouriteList();
  } else {
    alert(`${word} is already in favourites!`);
  }
}
