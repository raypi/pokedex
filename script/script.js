let counterPoke = 0;
let loadedPokes = [];
let searchResults = [];
let AUDIO_BING = new Audio('assets/audio/bing.mp3');
let AUDIO_KEYPRESS = new Audio('assets/audio/keypress.mp3');
let AUDIO_TRASH = new Audio('assets/audio/trash.mp3');
let AUDIO_SWIPE = new Audio('assets/audio/slider.mp3');
let AUDIO_LOAD = new Audio('assets/audio/load.mp3');


function init() {
    renderPokes(counterPoke);
}


async function getPokefromApi(start = 0, limit = 20) {
    const apiUrl = `https://pokeapi.co/api/v2/pokemon?offset=${start}&limit=${limit}`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Fehler beim Abrufen der Daten:', error);
        return [];
    }
}


async function renderPokes(counterPoke) {
    const pokes = await getPokefromApi(counterPoke);
    const cardContainer = document.getElementById('content');
    if (!cardContainer) {
        console.error('Container mit ID "content" nicht gefunden.');
        return;
    }
    let htmlContent = '';
    for (let i = 0; i < pokes.length; i++) {
        const poke = pokes[i];
        htmlContent += await loadPoke(poke);
    }
    cardContainer.innerHTML += htmlContent;
    createLoadMoreButton();
}


async function loadPoke(poke) {
    try {
        const pokeDetails = await fetch(poke.url).then(res => res.json());
        loadedPokes.push({
            id: pokeDetails.id,
            name: pokeDetails.name,
            details: pokeDetails
        });
        return renderPokeCardSmal(pokeDetails);
    } catch (error) {
        console.error(`Fehler beim Abrufen der Details für ${poke.name}:`, error);
        return '';
    }
}


function openBigCard(pokeId) {
    const overlay = document.getElementById('overlay');
    const bigCardContainer = document.getElementById('big-card-container');
    const pokeDetails = 
        searchResults.find(poke => poke.id === pokeId)?.details || 
        loadedPokes.find(poke => poke.id === pokeId)?.details;
    if (pokeDetails) {
        renderBigCard(pokeDetails, bigCardContainer, overlay);
        AUDIO_BING.play();
    } else {
        fetchRenderBigCard(pokeId, bigCardContainer, overlay);
    }
}


async function fetchRenderBigCard(pokeId, bigCardContainer, overlay) {
    try {
        const pokeDetails = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokeId}`).then(res => res.json());
        if (!loadedPokes.find(poke => poke.id === pokeId)) {
            loadedPokes.push({
                id: pokeDetails.id,
                name: pokeDetails.name,
                details: pokeDetails
            });
        }
        renderBigCard(pokeDetails, bigCardContainer, overlay);
    } catch (error) {
        console.error("Fehler beim Abrufen der Details der großen Karte:", error);
    }
}


function renderBigCard(pokeDetails, bigCardContainer, overlay) {
    const bigCardHtml = getBigCardHTML(pokeDetails);
    bigCardContainer.innerHTML = bigCardHtml;
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}


function closeBigCard(event) {
    const overlay = document.getElementById('overlay');
    const bigCardContainer = document.getElementById('big-card-container');
    if (event.target === overlay || event.target.classList.contains('close-button')) {
        overlay.style.display = 'none';
        bigCardContainer.innerHTML = '';
        document.body.style.overflow = 'auto';
        AUDIO_TRASH.play();
    }
}


function createLoadMoreButton() {
    const buttonContainer = document.getElementById('buttonContainer');
    if (!buttonContainer) {
        console.error('Button-Container nicht gefunden.');
        return;
    }

    loadMoreBtn(counterPoke, buttonContainer);
}


function loadMoreBtn(counterPoke, buttonContainer) {
    buttonContainer.innerHTML = '';
    const loadMoreButton = document.createElement('button');
    loadMoreButton.textContent = 'Mehr Pokémon laden';
    loadMoreButton.id = `load-more-${counterPoke}`;
    loadMoreButton.className = 'load-button';
    loadMoreButton.onclick = () => {
        showLoadingButton();
        AUDIO_LOAD.play();
    };
    buttonContainer.appendChild(loadMoreButton);
}


function showLoadingButton() {
    const buttonContainer = document.getElementById('buttonContainer');
    const redButton = createButton(buttonContainer);
    setTimeout(() => delayButton(redButton, counterPoke), 2000);
}


function createButton(container) {
    container.innerHTML = '';
    const button = document.createElement('button');
    button.textContent = 'Lade die nächsten 20 Pokes';
    button.className = 'load-button red-button'; 
    button.disabled = true;
    container.appendChild(button);
    return button;
}


function delayButton(button, counter) {
    button.disabled = false;
    counterPoke = counter + 20;
    renderPokes(counterPoke);
}


function nextPoke(currentId) {
    const currentList = searchResults.length > 0 ? searchResults : loadedPokes;
    const currentIndex = currentList.findIndex(poke => poke.id === currentId);
    if (currentIndex === -1) return; // Sicherheitscheck
    let nextIndex = (currentIndex + 1) % currentList.length;
    openBigCard(currentList[nextIndex].id);
    AUDIO_SWIPE.pause();
    AUDIO_SWIPE.currentTime = 0;
    AUDIO_SWIPE.play();
}


function lastPoke(currentId) {
    const currentList = searchResults.length > 0 ? searchResults : loadedPokes;
    const currentIndex = currentList.findIndex(poke => poke.id === currentId);
    if (currentIndex === -1) return; // Sicherheitscheck
    let prevIndex = (currentIndex - 1 + currentList.length) % currentList.length;
    openBigCard(currentList[prevIndex].id);
    AUDIO_SWIPE.pause();
    AUDIO_SWIPE.currentTime = 0;
    AUDIO_SWIPE.play();
}


async function fetchAndFilterPokes(query) {
    const apiUrl = `https://pokeapi.co/api/v2/pokemon?limit=1281`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.results.filter(poke => poke.name.includes(query));
    } catch (error) {
        console.error('Fehler beim Abrufen der Daten:', error);
        return [];
    }
}


async function fetchPokeDetails(pokeUrl) {
    try {
        const response = await fetch(pokeUrl);
        return await response.json();
    } catch (error) {
        console.error(`Fehler beim Abrufen der Details: ${pokeUrl}`, error);
        return null;
    }
}


function isValidQuery(query) {
    return query.length >= 3 && !/\d/.test(query);
}


function getQuery() {
    const inputField = document.getElementById('searchPoke');
    return inputField.value.trim().toLowerCase();
}


function clearButtonContainer() {
    const buttonContainer = document.getElementById('buttonContainer');
    if (buttonContainer) {
        buttonContainer.innerHTML = "";
    }
}


function showInvalidQueryMessage(resultContainer) {
    resultContainer.innerHTML = `<p>Gib bitte mindestens 3 Buchstaben ein.</p>`;
}


function displayNoMatchesFound(resultContainer) {
    resultContainer.innerHTML = `<p>Keine Pokes mit deinen Kriterien gefunden.</p>`;
}


async function createHtmlContent(matches) {
    let htmlContent = '';
    for (const match of matches) {
        const pokeDetails = await fetchPokeDetails(match.url);
        if (pokeDetails) {
            loadedPokes.push({
                id: pokeDetails.id,
                name: pokeDetails.name,
                details: pokeDetails,
            });
            htmlContent += getSearchPokeHTML(pokeDetails);
        }
    }
    return htmlContent;
}


async function filterMatches(query) {
    return await fetchAndFilterPokes(query);
}


async function searchPoke() {
    const resultContainer = document.getElementById('content');
    const query = getQuery();
    clearButtonContainer();
    const searchInput = document.getElementById('searchPoke');
    if (searchInput) {
        searchInput.value = '';
        searchInput.placeholder = 'Poke suchen';
    }
    if (!isValidQuery(query)) return showInvalidQueryMessage(resultContainer);
    const matches = await getMatches(query);
    if (matches.length === 0) return handleNoResults(resultContainer);
    const { htmlContent, results } = await doSearchResults(matches.slice(0, 20));
    searchResults = results;
    resultContainer.innerHTML = htmlContent;
}



async function getMatches(query) {
    return await filterMatches(query);
}


function handleNoResults(resultContainer) {
    displayNoMatchesFound(resultContainer);
}


async function doSearchResults(matches) {
    let htmlContent = '';
    const results = [];

    for (const match of matches) {
        const pokeDetails = await getOrFetchPokeDetails(match);
        if (pokeDetails) {
            htmlContent += pushResults(pokeDetails, results);
        }
    }

    return { htmlContent, results };
}


async function getOrFetchPokeDetails(match) {
    let pokeDetails = loadedPokes.find(poke => poke.name === match.name)?.details;
    if (!pokeDetails) {
        try {
            pokeDetails = await fetchPokeDetails(match.url);
            if (pokeDetails) {
                loadedPokes.push({
                    id: pokeDetails.id,
                    name: pokeDetails.name,
                    details: pokeDetails,
                });
            }
        } catch (error) {
            console.error(`Fehler beim Abrufen der Details für ${match.name}:`, error);
            return null;
        }
    }
    return pokeDetails;
}


function pushResults(pokeDetails, results) {
    results.push({
        id: pokeDetails.id,
        name: pokeDetails.name,
        details: pokeDetails,
    });

    return getSearchPokeHTML(pokeDetails);
}


function reStart() {
    loadedPokes = [];
    searchResults = [];
    const cardContainer = document.getElementById('content');
    if (cardContainer) {
        cardContainer.innerHTML = '';
    }
    renderPokes(counterPoke);
}
