function renderPokeCardSmal(pokeDetails) {
    const formattedName = pokeDetails.name.charAt(0).toUpperCase() + pokeDetails.name.slice(1).toLowerCase();
    const mainType = pokeDetails.types[0].type.name;
    const typeClass = `type-${mainType}`;
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


function getBigCardHTML(pokeDetails) {
    const formattedName = pokeDetails.name.charAt(0).toUpperCase() + pokeDetails.name.slice(1).toLowerCase();
    const mainType = pokeDetails.types[0].type.name;
    const typeClass = `type-${mainType}`;
    return `
        <div class="card-big ${typeClass}">
            <div class="card-header-big">
                <div>#${pokeDetails.id} ${formattedName}</div>
                <div><button class="close-button" onclick="closeBigCard(event)">✖</button></div>
            </div>
            <div class="card-img-big-section">
                <img src="${pokeDetails.sprites.front_default}" alt="${pokeDetails.name}" class="card-img-big">
            </div>
            <div class="card-footer-big">
                ${pokeDetails.types.map(typeInfo => `<span class="type-icon">${typeInfo.type.name}</span>`).join(' ')}
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
}


function getSearchPokeHTML(pokeDetails) {
    const formattedName = pokeDetails.name.charAt(0).toUpperCase() + pokeDetails.name.slice(1).toLowerCase();
    const mainType = pokeDetails.types[0].type.name;
    const typeClass = `type-${mainType}`;

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