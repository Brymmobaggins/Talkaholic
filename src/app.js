/** @format */

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
    <div class="bg-[#f9fafa] border-0 rounded-sm p-2.5 mt-5">
      <div class="flex justify-between items-center">
         <h2 class="heading-color">${word}</h2>
         <button type="button" id="addToFavoriteBtn" class="rounded-sm p-1 bg-blue-500 border-0 text-white font-bold" 
         onclick="addToFavourites('${word}')">Add to favourite</button>
       
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
  addRecentSearch(word);

  document.getElementById("user-input").value = "";
}

let favourites = JSON.parse(localStorage.getItem("favourites")) || [];
const favouriteListHeader = document.getElementById("favouritelist-header");
const favouriteSection = document.getElementById("favourite-word-section");
const clearAllBtn = document.getElementById("clear-btn");

function renderFavouriteList() {
  const retrieveWords = JSON.parse(localStorage.getItem("favourites")) || [];

  if (retrieveWords.length === 0) {
    favouriteListHeader.textContent = "";
    favouriteSection.innerHTML = `
      <div class="text-center mt-4">
      <h3 class="text-black font-bold">No favourite  word yet </h3>
        <span class="tex-gray-500">Search for any word and click the <b>Add to Favourite</b> button to save them here.</span>
      </div>
    `;
    clearAllBtn.classList.add("hidden");
  } else {
    favouriteListHeader.textContent = "Favourite Words";
    favouriteSection.innerHTML = "";
    clearAllBtn.classList.remove("hidden");

    retrieveWords.forEach((retrieveWord) => {
      favouriteSection.innerHTML += `
        <div class="flex p-3 justify-between items-center bg-slate-100 rounded mb-2">
          <span>${retrieveWord[0].toUpperCase() + retrieveWord.slice(1)}</span>
          <button 
            class="font-bold text-red-500 hover:text-red-700" 
            onclick="removeFromFavourites('${retrieveWord}')"
          >
            X
          </button>
        </div>
      `;
    });
  }
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

function removeFromFavourites(word) {
  favourites = favourites.filter((fav) => fav !== word);
  // update the local storage back to its state
  localStorage.setItem("favourites", JSON.stringify(favourites));
  renderFavouriteList();
}

clearAllBtn.addEventListener("click", clearAllFavourites);
function clearAllFavourites() {
  localStorage.removeItem("favourites");
  favourites = [];
  favouriteSection.innerHTML = "";
  favouriteSection.classList.add("hidden");
  favouriteListHeader.textContent = "";
}

function addRecentSearch(word) {
  let recentSearchArr =
    JSON.parse(localStorage.getItem("recentSearchArr")) || [];
  recentSearchArr = recentSearchArr.filter((recent) => recent !== word);
  recentSearchArr.unshift(word);
  if (recentSearchArr.length > 10) {
    recentSearchArr.pop();
  }
  localStorage.setItem("recentSearchArr", JSON.stringify(recentSearchArr));
  renderRecentSearch();
}

function renderRecentSearch() {
  const resentSearchDiv = document.getElementById("recent-search");
  let recentSearchArr =
    JSON.parse(localStorage.getItem("recentSearchArr")) || [];
  resentSearchDiv.innerHTML = "";

  recentSearchArr.forEach((word) => {
    resentSearchDiv.innerHTML += `
    <div class="bg-[#d1f0f0]">
      <button class="border-none px-1.5 py-0.75 rounded-sm text-black bg-blue-200 hover:bg-blue-300 hover:cursor-pointer" onclick="renderResultFromHistory('${word}')">${word}</button>
    <div>`;
  });
}
async function renderResultFromHistory(word) {
  const results = await fetchDefinition(word);
  if (results.error) {
    return renderMessage(results.error);
  } else {
    const word = results[0]?.word || "No word available";

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
    <div class="bg-[#f9fafa] border-0 rounded-sm p-2.5 mt-5">
      <div class="flex justify-between items-center">
         <h2 class="heading-color">${word[0].toUpperCase() + word.slice(1)}</h2>
         <button type="button" class="border p-1 rounded-sm" id="addToFavoriteBtn"
         onclick="addToFavourites('${word}')">Add to Favourite</button>
       
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
}

function getRandomWord() {
  const words = [
    "serendipity",
    "color",
    "shedule",
    "exhausted",
    "cart",
    "eloquent",
    "tranquil",
    "ephemeral",
    "Cholera",
    "resilient",
  ];
  const randomIndex = Math.floor(Math.random() * words.length);
  return words[randomIndex];
}

// this function render the word of when the home button is click
async function renderWordOfTheDay() {
  const wordofthdayDiv = document.getElementById("word-of-day");
  wordofthdayDiv.innerHTML = "loading ....";

  const randomWord = getRandomWord();
  const results = await fetchDefinition(randomWord);

  if (results.error) {
    wordofthdayDiv.innerHTML = `<p class="text-color-600">${results.error}</p>`;
  } else {
    const word = results[0]?.word || "No word Available";
    const definition =
      results[0]?.meanings[0]?.definitions[0]?.definition || "No definition";
    wordofthdayDiv.innerHTML = `
       <h4 class="text-lg">${word[0].toUpperCase() + word.slice(1)}</h4>
       <p>${definition}</p>
    `;
  }
}

// Get references to sections
const homeSection = document.getElementById("home-section");
const outputSection = document.getElementById("output"); // Search results

const homeBtn = document.getElementById("home-btn");
const searchBtn = document.getElementById("search-btn");
const favouriteBtn = document.getElementById("favourite-btn");

// Utility function to hide all sections
function hideAllSections() {
  homeSection.classList.add("hidden");
  outputSection.classList.add("hidden");
  favouriteSection.classList.add("hidden");
}

// Show Home section
homeBtn.addEventListener("click", () => {
  renderWordOfTheDay();
  hideAllSections();
  homeSection.classList.remove("hidden");
  renderRecentSearch();
});

// Show Search section
searchBtn.addEventListener("click", () => {
  hideAllSections();
  outputSection.classList.remove("hidden");
});

// Show Favourite section
favouriteBtn.addEventListener("click", () => {
  hideAllSections();
  favouriteSection.classList.remove("hidden");
  renderFavouriteList;
});

renderFavouriteList();
