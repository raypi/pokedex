// Aufgaben:
// Zusatz:
// Layout optimieren
// Sound hinzufügen
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

        try {
            const pokeDetails = await fetch(poke.url).then(res => res.json());

            // Zum globalen Array hinzufügen
            loadedPokes.push({
                id: pokeDetails.id,
                name: pokeDetails.name,
                details: pokeDetails
            });

            // Name mit großem Anfangsbuchstaben formatieren
            const formattedName = pokeDetails.name.charAt(0).toUpperCase() + pokeDetails.name.slice(1).toLowerCase();

            // Dynamische Typ-Klassen: Nur der erste Typ wird verwendet
            const mainType = pokeDetails.types[0].type.name;
            const typeClass = `type-${mainType}`;

            // HTML für die Pokémon-Karten erstellen
            htmlContent += `
                <div class="card-smal ${typeClass}" onclick="openBigCard(${pokeDetails.id})" id="poke-${pokeDetails.id}">
                    <div class="card-header-smal">
                        #${pokeDetails.id} ${formattedName}
                    </div>
                    <div class="card-img-smal-section">
                        <img src="${pokeDetails.sprites.front_default}" alt="${pokeDetails.name}" class="card-img-smal">
                    </div>
                    <div class="card-footer-smal">
                        ${(() => {
                            let typeHtml = '';
                            for (let i = 0; i < pokeDetails.types.length; i++) {
                                const typeInfo = pokeDetails.types[i];
                                typeHtml += `<span class="type-icon">${typeInfo.type.name}</span> `;
                            }
                            return typeHtml.trim();
                        })()}
                    </div>
                </div>
            `;
        } catch (error) {
            console.error(`Fehler beim Abrufen der Details für ${poke.name}:`, error);
        }
    }

    // Füge die Karten in den Container ein
    cardContainer.innerHTML += htmlContent;

    // Button für weitere Pokémon erstellen
    createLoadMoreButton();
}


// Öffnet eine große Karte
function openBigCard(pokeId) {
    const overlay = document.getElementById('overlay');
    const bigCardContainer = document.getElementById('big-card-container');
    const smallCard = document.getElementById(`poke-${pokeId}`);

    if (!smallCard) return;

    // Prüfe, ob das Pokémon bereits in loadedPokes gespeichert ist
    const pokeDetails = loadedPokes.find(poke => poke.id === pokeId)?.details;

    if (pokeDetails) {
        // Details direkt verwenden
        renderBigCard(pokeDetails, bigCardContainer, overlay);
    } else {
        // Details aus der API laden
        fetch(`https://pokeapi.co/api/v2/pokemon/${pokeId}`)
            .then(res => res.json())
            .then(pokeDetails => {
                // Optional: Zum globalen Array hinzufügen, falls nicht vorhanden
                if (!loadedPokes.find(poke => poke.id === pokeId)) {
                    loadedPokes.push({
                        id: pokeDetails.id,
                        name: pokeDetails.name,
                        details: pokeDetails
                    });
                }
                renderBigCard(pokeDetails, bigCardContainer, overlay);
            })
            .catch(error => console.error("Fehler beim Abrufen der Details der großen Karte:", error));
    }
}

// Hilfsfunktion für das Rendern der großen Karte
function renderBigCard(pokeDetails, bigCardContainer, overlay) {
    const formattedName = pokeDetails.name.charAt(0).toUpperCase() + pokeDetails.name.slice(1).toLowerCase();
    const mainType = pokeDetails.types[0].type.name;
    const typeClass = `type-${mainType}`;

    let bigCardHtml = `
        <div class="card-big ${typeClass}">
            <div class="card-header-big">
                <div>#${pokeDetails.id} ${formattedName}</div>
                <div><button class="close-button" onclick="closeBigCard(event)">✖</button></div>
            </div>
            <div class="card-img-big-section">
                <img src="${pokeDetails.sprites.front_default}" alt="${pokeDetails.name}" class="card-img-big">
            </div>
            <div class="card-footer-big">
                ${(() => {
                    let typeHtml = '';
                    for (let i = 0; i < pokeDetails.types.length; i++) {
                        const typeInfo = pokeDetails.types[i];
                        typeHtml += `<span class="type-icon">${typeInfo.type.name}</span> `;
                    }
                    return typeHtml.trim();
                })()}
                <div class="poke-stats">
                    <div>HP: ${pokeDetails.stats[0].base_stat}</div>
                    <div>Attack: ${pokeDetails.stats[1].base_stat}</div>
                    <div>Defense: ${pokeDetails.stats[2].base_stat}</div>
                </div>
                <div id="bigCardNav" class="big-Card-Nav">
                    <div><button class="nav-button" onclick="lastPoke(${pokeDetails.id})">Rückwärts</button></div>
                    <div>${pokeDetails.id}</div>
                    <div><button class="nav-button" onclick="nextPoke(${pokeDetails.id})">Vorwärts</button></div>
                </div>
            </div>
        </div>
    `;
    bigCardContainer.innerHTML = bigCardHtml;
    overlay.style.display = 'flex'; // Zeige das Overlay und die große Karte an

    // Verhindere das Scrollen des Hintergrunds
    document.body.style.overflow = 'hidden';
}


// Schließt die große Karte bei Overlay und Button
function closeBigCard(event) {
    const overlay = document.getElementById('overlay');
    const bigCardContainer = document.getElementById('big-card-container');

    // Schließe nur, wenn ins Overlay oder auf den Schließen-Button geklickt wurde
    if (event.target === overlay || event.target.classList.contains('close-button')) {
        overlay.style.display = 'none';
        bigCardContainer.innerHTML = '';

        // Erlaube wieder das Scrollen
        document.body.style.overflow = 'auto';
    }
}


// Erstellt oder aktualisiert den "Load More"-Button
function createLoadMoreButton() {
    const buttonContainer = document.getElementById('buttonContainer'); // Container für den Button
    if (!buttonContainer) {
        console.error('Button-Container nicht gefunden.');
        return;
    }

    buttonContainer.innerHTML = ''; // Vorherigen Button entfernen, falls vorhanden

    const loadMoreButton = document.createElement('button');
    loadMoreButton.textContent = 'Mehr Pokémon laden';
    loadMoreButton.id = `load-more-${counterPoke}`; // ID mit dem aktuellen Startpunkt
    loadMoreButton.className = 'load-button'; // Standard Button
    loadMoreButton.onclick = () => {
        // Beim Klick auf "Mehr Pokémon laden" den roten Button anzeigen
        showRedLoadMoreButton();
    };

    buttonContainer.appendChild(loadMoreButton);
}

// Zeigt den roten Button für 2 Sekunden an
function showRedLoadMoreButton() {
    const buttonContainer = document.getElementById('buttonContainer');
    
    // Erstelle den roten Button
    const redButton = document.createElement('button');
    redButton.textContent = 'Lade die nächsten 20 Pokes';
    redButton.className = 'load-button red-button'; // Rote Farbe für den Button
    redButton.disabled = true; // Button deaktivieren während des Wartens

    // Button in den Container einfügen
    buttonContainer.innerHTML = ''; // Vorherigen Button entfernen
    buttonContainer.appendChild(redButton);

    // Nach 3 Sekunden den Button zurücksetzen und Pokémon laden
    setTimeout(() => {
        redButton.disabled = false; // Reaktiviert den Button
        counterPoke += 20; // Erhöhe den Startpunkt um 20
        renderPokes(counterPoke);
    }, 2000); // 3 Sekunden warten
}



function nextPoke(currentId) {
    const currentIndex = loadedPokes.findIndex(poke => poke.id === currentId);
    let nextIndex = (currentIndex + 1) % loadedPokes.length; // Nächstes Pokémon, zyklisch durchgehen
    openBigCard(loadedPokes[nextIndex].id);
}

function lastPoke(currentId) {
    const currentIndex = loadedPokes.findIndex(poke => poke.id === currentId);
    let prevIndex = (currentIndex - 1 + loadedPokes.length) % loadedPokes.length; // Vorheriges Pokémon, zyklisch durchgehen
    openBigCard(loadedPokes[prevIndex].id);
}


async function searchPoke() {
    const inputField = document.getElementById('searchPoke');
    const query = inputField.value.trim().toLowerCase(); // Leerzeichen entfernen und in Kleinbuchstaben umwandeln
    const resultContainer = document.getElementById('content'); // Annahme: Ergebnisse werden hier gerendert

    if (query.length < 3 || /\d/.test(query)) {
        resultContainer.innerHTML = `<p>Gib bitte mindestens 3 Buchstaben ein.</p>`;
        return;
    }

    const apiUrl = `https://pokeapi.co/api/v2/pokemon?limit=1281`; // Vollständige Liste aller Pokémon
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const matches = data.results.filter(poke => poke.name.includes(query));

        if (matches.length === 0) {
            resultContainer.innerHTML = `<p>Keine Pokes mit deinen Kriterien gefunden.</p>`;
            return;
        }

        const limitedMatches = matches.slice(0, 20); // Maximal 20 Treffer anzeigen
        let htmlContent = '';

        // Clear the loadedPokes array and populate it with search results
        loadedPokes = [];

        for (const match of limitedMatches) {
            try {
                const pokeDetails = await fetch(match.url).then(res => res.json());

                // Füge Pokémon zu loadedPokes hinzu
                loadedPokes.push({
                    id: pokeDetails.id,
                    name: pokeDetails.name,
                    details: pokeDetails,
                });

                const formattedName = pokeDetails.name.charAt(0).toUpperCase() + pokeDetails.name.slice(1).toLowerCase();
                const mainType = pokeDetails.types[0].type.name;
                const typeClass = `type-${mainType}`;

                htmlContent += `
                    <div class="card-smal ${typeClass}" onclick="openBigCard(${pokeDetails.id})" id="poke-${pokeDetails.id}">
                        <div class="card-header-smal">
                            #${pokeDetails.id} ${formattedName}
                        </div>
                        <div class="card-img-smal-section">
                            <img src="${pokeDetails.sprites.front_default}" alt="${pokeDetails.name}" class="card-img-smal">
                        </div>
                        <div class="card-footer-smal">
                            ${(() => {
                                let typeHtml = '';
                                for (let i = 0; i < pokeDetails.types.length; i++) {
                                    const typeInfo = pokeDetails.types[i];
                                    typeHtml += `<span class="type-icon">${typeInfo.type.name}</span> `;
                                }
                                return typeHtml.trim();
                            })()}
                        </div>
                    </div>
                `;
            } catch (error) {
                console.error(`Fehler beim Abrufen der Details für ${match.name}:`, error);
            }
        }

        resultContainer.innerHTML = htmlContent;
    } catch (error) {
        console.error('Fehler beim Abrufen der Daten:', error);
        resultContainer.innerHTML = `<p>Ein Fehler ist aufgetreten. Bitte versuche es später erneut.</p>`;
    }
}

