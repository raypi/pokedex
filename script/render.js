// Funktion zum Rendern einer kleinen Pokémon-Karte
function renderPokeCardSmal(pokeDetails) {
    // Name mit großem Anfangsbuchstaben formatieren
    const formattedName = pokeDetails.name.charAt(0).toUpperCase() + pokeDetails.name.slice(1).toLowerCase();

    // Dynamische Typ-Klassen: Nur der erste Typ wird verwendet
    const mainType = pokeDetails.types[0].type.name;
    const typeClass = `type-${mainType}`;

    // HTML für die Pokémon-Karte
    return `
        <div class="card-smal ${typeClass}" onclick="openBigCard(${pokeDetails.id})" id="poke-${pokeDetails.id}">
            <div class="card-header-smal">
                #${pokeDetails.id} ${formattedName}
            </div>
            <div class="card-img-smal-section">
                <img src="${pokeDetails.sprites.front_default}" alt="${pokeDetails.name}" class="card-img-smal">
            </div>
            <div class="card-footer-smal">
                ${pokeDetails.types.map(typeInfo => `<span class="type-icon">${typeInfo.type.name}</span>`).join(' ')}
            </div>
        </div>
    `;
}

