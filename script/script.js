// Aufgaben:
// *** Große Ansicht: *** 
// Wie du diese gestaltet und welche du hier alle anzeigen lässt, ist dir überlassen, jedoch sollten hier mindestens gewisse Werte wie z.B. hp/ attack/ defense etc. des Pokemon angezeigt werden, weiteres ist Optional.
// Es gibt Pfeile oder ähnliches, um zwischen den Karten in der großen Ansicht zu wechseln (wie bei der Fotogalerie).
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
const overlay = document.getElementById('overlay');
overlay.addEventListener('click', closeBigCard);

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

            // Name mit großem Anfangsbuchstaben formatieren
            const formattedName = pokeDetails.name.charAt(0).toUpperCase() + pokeDetails.name.slice(1).toLowerCase();

            // Dynamische Typ-Klassen: Nur der erste Typ wird verwendet
            const mainType = pokeDetails.types[0].type.name;
            const typeClass = `type-${mainType}`; // Nur der erste Typ für die Farbe

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
                            return typeHtml.trim(); // Entfernt das letzte Leerzeichen
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

    // Hole Details für das Pokémon
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokeId}`)
        .then(res => res.json())
        .then(pokeDetails => {
            // Setze Inhalte in die große Karte
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
                        <div id="bigCardNav">
                            <div><button class="close-button" onclick="nextPoke">Vorwärt</button></div>
                            <div>${pokeDetails.id}</div>
                            <div><button class="close-button" onclick="lastPoke">Rückwerts</button></div>
                        </div>
                    </div>
                </div>
            `;
            bigCardContainer.innerHTML = bigCardHtml;
            overlay.style.display = 'flex'; // Zeige das Overlay und die große Karte an

            // Verhindere das Scrollen des Hintergrunds
            document.body.style.overflow = 'hidden';
        })
        .catch(error => console.error("Fehler beim Abrufen der Details der großen Karte:", error));
}


// schliesst die große Karte bei Overlay und Button
function closeBigCard(event) {
    const overlay = document.getElementById('overlay');
    const bigCardContainer = document.getElementById('big-card-container');

    // Schließe nur, wenn ins Overlay oder den Button geklickt wurde
    if (event.target === overlay || event.target.classList.contains('close-button')) {
        // Blende die große Karte und das Overlay aus
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