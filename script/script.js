// Aufgaben
// *** Hauptbildschirm / kleine Ansicht ***
// Es soll eine bestimmte Anzahl an Pokemon Karten direkt gerendert werden. Am besten zwischen 20 und 40
// Unten gibt es einen Button, um weitere 20-40 Pokemon zu laden. (Info: insgesamt gibt es über 1000 Pokemon)
// Beim laden erscheint ein Loadingscreen (Userfeedback)
// Der Button zum Nachladen kann während des Ladens nicht erneut angeklickt werden
// Sichtbar soll auf jeder kleinen Pokemon Karte sein: Name, Typ/en, Bild des Pokemons, Hintergrundfarbe passend zum Typ, ID (optional)
// Es soll einen Hover-Effekt auf der kleinen Pokemon Karte geben: cursor-pointer,  Pokemon erscheint größer etc. (optional)
// *** Große Ansicht: *** 
// Beim Klicken auf die Pokemonkarte soll sich diese in groß öffnen.
// Benutze ein transparentes Overlay, beim Klicken darauf schließt sich die Karte wieder (wie beim Dialog Fenster). Der Hintergrund ist nicht scrollbar in der großen Ansicht.
// Wie du diese gestaltet und welche du hier alle anzeigen lässt, ist dir überlassen, jedoch sollten hier mindestens gewisse Werte wie z.B. hp/ attack/ defense etc. des Pokemon angezeigt werden, weiteres ist Optional.
// Es gibt Pfeile oder ähnliches, um zwischen den Karten in der großen Ansicht zu wechseln (wie bei der Fotogalerie).
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


// ruft die Funtionen auf die ich beim Start bzw. beim laden der Seite benötige
function init(){
    renderPokes(counterPoke);
}


// Ruft die Pokémon von der API ab
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


// Bringt die Pokémon ins HTML
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

            // HTML für die Pokémon-Karten erstellen
            htmlContent += `
                <div class="card-smal">
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
    loadMoreButton.onclick = () => {
        counterPoke += 20; // Erhöhe den Startpunkt um 20
        renderPokes(counterPoke);
    };

    buttonContainer.appendChild(loadMoreButton);
}

// function getPromise(){
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             if(promError){
//                 reject("hat nicht geklappt");
//             } else {
//                 resolve("hat gegefunst"); // kann auch ein Objekt sein was die DB zurück gegeben hat
//             }
//         }, 2000);
//     });
// }


// async function usePromise(){
//     try {
//         await getPromise();
//     } catch (error) {
//         console.error(error);
//     }
//     console.log("ende")
// }


// async function fetchDataJson() {
//     let response = await fetch("./script/database.json");
//     let responseAsJason = await response.json();
//     console.log(responseAsJason);
// }

// // Anzeigen von Apfel
// async function fetchDataText(fruitName) {
//     let response = await fetch('https://www.fruityvice.com/api/fruit/${fruitName}');
//     let responseAsJson = await response.json();
//     console.log(fruitName);
//     // document.getElementById("content").innerHTML = responseAsJson;
// }

// function showFruits(){
//     fetchDataText("Apple");
//     fetchDataText("Guava");
// }

// // fatch Data Test fruitivice
// async function fetchDataText() {
//     let response = await fetch('https://restcountries.com/v3.1/all');
//     // let response = await fetch('https://www.fruityvice.com/api/fruit/all', {
//     //     mode: 'no-cors'
//     // });
//     let responseAsJson = await response.json();
//     console.log(responseAsJson);
//     // document.getElementById("content").innerHTML = responseAsJson;
// }

// fatchData für TXT datei im Root verzeichniss
// async function fetchDataText() {
//     let response = await fetch('test.txt');
//     let responseAsText = await response.text();
//     document.getElementById("content").innerHTML = responseAsText;
// }


// fatechDataText inkl. fehlerbehandlung
// async function fetchDataText() {
//     try {
//         let response = await fetch('test.txt');
//         if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
//         let responseAsText = await response.text();
//         document.getElementById("content").innerHTML = responseAsText;
//     } catch (error) {
//         console.error("Fehler beim Laden der Datei:", error);
//     }
// }
