// Aufgaben:
// Zusatz:
// Layout optimieren
// Sound hinzufügen (next, close, open)
// 
// *** Code ***
// Aussagekräftige Namen für Funktionen und Variablen
// camelCase für die Benennung 
// Code ist formatiert
// Höchstens 14 Zeilen pro Funktion
// Gleicher Abstand zwischen Funktionen (1 oder 2 Leerzeilen)
// Lagere HTML Templates aus in extra-Funktionen
// *** Responsive ***
// Bis 320px Breite alles responsive ohne Scrollbalken
// Content-Begrenzung für große Monitore (max-width z.B. bei 1920px oder 1440px)
// *** Sonstiges ***
// Favicon
// Dokumenten Titel
// Header mit: Logo, Titel, Suchleiste (man soll mindestens 3 Buchstaben eingeben bevor gesucht werden kann, wenn diese Buchstaben Teil des Namens eines Pokemons sind, sollten diese Pokemon angezeigt werden. Es sollte eine begrenzte Anzahl an Pokemon mit den Suchkriterien angezeigt werden, z.B. 10 stück)
// Footer (optional)

// let promError = false;

let counterPoke = 0;
let loadedPokes = [];



// Initialisiert die Anwendung
function init() {
    renderPokes(counterPoke);
}


// Ruft Pokémon von der API ab
async function getPokefromApi(start = 0, limit = 20) {
    const apiUrl = `https://pokeapi.co/api/v2/pokemon?offset=${start}&limit=${limit}`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.results; // Gibt eine Liste von Pokémon mit Name und URL zurück
    } catch (error) {
        console.error('Fehler beim Abrufen der Daten:', error);
        return [];
    }
}


// Bringt Pokémon ins HTML
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


// laden des Poke 
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



// Öffnet eine große Karte
function openBigCard(pokeId) {
    const overlay = document.getElementById('overlay');
    const bigCardContainer = document.getElementById('big-card-container');
    const smallCard = document.getElementById(`poke-${pokeId}`);

    if (!smallCard) return;

    const pokeDetails = loadedPokes.find(poke => poke.id === pokeId)?.details;

    if (pokeDetails) {
        renderBigCard(pokeDetails, bigCardContainer, overlay);
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


// Hilfsfunktion für das Rendern der großen Karte
function renderBigCard(pokeDetails, bigCardContainer, overlay) {
    const bigCardHtml = getBigCardHTML(pokeDetails);
    bigCardContainer.innerHTML = bigCardHtml;
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}


// Schließt die große Karte bei Overlay und Button
function closeBigCard(event) {
    const overlay = document.getElementById('overlay');
    const bigCardContainer = document.getElementById('big-card-container');
    if (event.target === overlay || event.target.classList.contains('close-button')) {
        overlay.style.display = 'none';
        bigCardContainer.innerHTML = '';
        document.body.style.overflow = 'auto';
    }
}


// Erstellt oder aktualisiert den "Load More"-Button
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
    };
    buttonContainer.appendChild(loadMoreButton);
}


// Zeigt den farbigen Button für 2 Sekunden an
function showLoadingButton() {
    const buttonContainer = document.getElementById('buttonContainer');
    const redButton = createButton(buttonContainer);
    setTimeout(() => delayButton(redButton, counterPoke), 2000);
}

// Hilfsfunktion: Erstellt und fügt einen Button ein
function createButton(container) {
    container.innerHTML = '';
    const button = document.createElement('button');
    button.textContent = 'Lade die nächsten 20 Pokes';
    button.className = 'load-button red-button'; 
    button.disabled = true;
    container.appendChild(button);
    return button;
}



// Funktion für die dauer der Anzeige
function delayButton(button, counter) {
    button.disabled = false;
    counterPoke = counter + 20;
    renderPokes(counterPoke);
}



function nextPoke(currentId) {
    const currentIndex = loadedPokes.findIndex(poke => poke.id === currentId);
    let nextIndex = (currentIndex + 1) % loadedPokes.length;
    openBigCard(loadedPokes[nextIndex].id);
}

function lastPoke(currentId) {
    const currentIndex = loadedPokes.findIndex(poke => poke.id === currentId);
    let prevIndex = (currentIndex - 1 + loadedPokes.length) % loadedPokes.length;
    openBigCard(loadedPokes[prevIndex].id);
}


// async function searchPoke() {
//     const inputField = document.getElementById('searchPoke');
//     const query = inputField.value.trim().toLowerCase(); 
//     const resultContainer = document.getElementById('content');
//     const buttonContainer = document.getElementById('buttonContainer');

//     if (buttonContainer) {
//         buttonContainer.innerHTML = "";
//     }

//     if (query.length < 3 || /\d/.test(query)) {
//         resultContainer.innerHTML = `<p>Gib bitte mindestens 3 Buchstaben ein.</p>`;
//         return;
//     }

//     const apiUrl = `https://pokeapi.co/api/v2/pokemon?limit=1281`;
//     try {
//         const response = await fetch(apiUrl);
//         const data = await response.json();
//         const matches = data.results.filter(poke => poke.name.includes(query));

//         if (matches.length === 0) {
//             resultContainer.innerHTML = `<p>Keine Pokes mit deinen Kriterien gefunden.</p>`;
//             return;
//         }

//         const limitedMatches = matches.slice(0, 20);
//         let htmlContent = '';

//         loadedPokes = [];

//         for (const match of limitedMatches) {
//             try {
//                 const pokeDetails = await fetch(match.url).then(res => res.json());

//                 loadedPokes.push({
//                     id: pokeDetails.id,
//                     name: pokeDetails.name,
//                     details: pokeDetails,
//                 });

//                 htmlContent += getSearchPokeHTML(pokeDetails);
//             } catch (error) {
//                 console.error(`Fehler beim Abrufen der Details für ${match.name}:`, error);
//             }
//         }

//         resultContainer.innerHTML = htmlContent;
//     } catch (error) {
//         console.error('Fehler beim Abrufen der Daten:', error);
//         resultContainer.innerHTML = `<p>Ein Fehler ist aufgetreten. Bitte versuche es später erneut.</p>`;
//     }
// }


// async function searchPoke() {
//     const inputField = document.getElementById('searchPoke');
//     const query = inputField.value.trim().toLowerCase();
//     const resultContainer = document.getElementById('content');
//     const buttonContainer = document.getElementById('buttonContainer');

//     if (buttonContainer) {
//         buttonContainer.innerHTML = "";
//     }

//     // Eingabeprüfung
//     if (!isValidQuery(query)) {
//         resultContainer.innerHTML = `<p>Gib bitte mindestens 3 Buchstaben ein.</p>`;
//         return;
//     }

//     // Pokémon-Daten abrufen und filtern
//     const matches = await fetchAndFilterPokes(query);

//     if (matches.length === 0) {
//         resultContainer.innerHTML = `<p>Keine Pokes mit deinen Kriterien gefunden.</p>`;
//         return;
//     }

//     // Pokémon-Details abrufen und HTML erstellen
//     const limitedMatches = matches.slice(0, 20);
//     let htmlContent = '';

//     loadedPokes = [];

//     for (const match of limitedMatches) {
//         const pokeDetails = await fetchPokeDetails(match.url);
//         if (pokeDetails) {
//             loadedPokes.push({
//                 id: pokeDetails.id,
//                 name: pokeDetails.name,
//                 details: pokeDetails,
//             });
//             htmlContent += getSearchPokeHTML(pokeDetails);
//         }
//     }

//     resultContainer.innerHTML = htmlContent;
// }


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
    if (!isValidQuery(query)) {
        showInvalidQueryMessage(resultContainer);
        return;
    }
    const matches = await filterMatches(query);
    if (matches.length === 0) {
        displayNoMatchesFound(resultContainer);
        return;
    }
    const limitedMatches = matches.slice(0, 20);
    const htmlContent = await createHtmlContent(limitedMatches);
    resultContainer.innerHTML = htmlContent;
}

