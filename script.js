let currentPokemon;
let loadedPokemon = 33;
let currentlyLoaded = 1;
let pokemonList = [];

function init() {
    loadPokemon();
}

async function loadPokemon() {
    for (let i = currentlyLoaded; i < loadedPokemon; i++) {
        let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        let response = await fetch(url);
        let currentPokemon = await response.json();
        console.log('Loaded ', currentPokemon);

        pokemonList.push(currentPokemon);

        document.getElementById('pokemon').innerHTML += loadPokemonHTML(i, currentPokemon);

        renderPokemonInfo(i, currentPokemon);
        renderPokemonTypes(i, currentPokemon);
    }
}

function renderPokemonInfo(i, currentPokemon) {
    document.getElementById(`pokemonName${i}`).innerHTML = currentPokemon['name'];
    document.getElementById(`pokemonName${i}`).innerHTML = capitalizeFirstLetter(currentPokemon);
    document.getElementById(`pokemonImg${i}`).src = currentPokemon['sprites']['other']['official-artwork']['front_default'];
    document.getElementById(`pokemonId${i}`).innerHTML = '#' + currentPokemon['id'];
}

function renderPokemonTypes(i, currentPokemon) {
    document.getElementById(`types${i}`).innerHTML = '';

    for (let j = 0; j < currentPokemon['types'].length; j++) {
        let pokemonType = currentPokemon['types'][j]['type']['name'];
        document.getElementById(`types${i}`).innerHTML += `
        <div class="types-container${i}">
            <div class="type-icons">${getPokemonColors(pokemonType)}</div>
        </div>`;
    }
    getBorderColor(i, currentPokemon['types'][0]['type']['name']);
}

function getPokemonColors(pokemonType) {
    return `
<img src="img/types/${pokemonType}.png"></img>
`;
}

function getPokemonBackgroundColors(pokemonType) {
    return `
<img src="img/types-background/${pokemonType}.png"></img>
`;
}

function getBorderColor(i, pokemonType) {
    document.getElementById(`pokemoncard${i}`).classList.add(pokemonType);
}

function capitalizeFirstLetter(currentPokemon) {
    return currentPokemon['name'].charAt(0).toUpperCase() + currentPokemon['name'].slice(1);
}

function loadMorePokemon() {
    currentlyLoaded = loadedPokemon + 1;
    loadedPokemon += 33;
    loadPokemon();
}


// SEARCH //

function searchPokemon(event) {
    event.preventDefault();
    let search = document.getElementById('search').value;
    search = search.toLowerCase();

    document.getElementById('pokemon').innerHTML = '';

    for (let i = 0; i < pokemonList.length; i++) {
        const currentPokemon = pokemonList[i];
        const pokemonName = currentPokemon['name'];
        if (pokemonName.startsWith(search)) {
            document.getElementById('pokemon').innerHTML += loadPokemonHTML(i, currentPokemon);
            renderPokemonInfo(i, currentPokemon);
            renderPokemonTypes(i, currentPokemon);
        }
    }
}


// OVERLAY //

function getOverlayBackground(pokemonType) {
    let overlayPokedex = document.querySelector('.overlayPokedex');
    let overlayBackground = `url('img/types-background/${pokemonType}.png')`;
    overlayPokedex.style.backgroundImage = overlayBackground;
}

function openOverlay(id) {
    let Pokemon = pokemonList.find(pokemon => pokemon.id === id);
    let overlay = document.getElementById('overlay');
    overlay.classList.remove('d-none');
    overlay.innerHTML = templateOverlay(id, loadedPokemon);
    scrollStop();
    renderOverlayPokemonInfo(id, Pokemon);
    renderOverlayPokemonTypes(id, Pokemon);
    getOverlayBackground(Pokemon['types'][0]['type']['name']);
}

function closeOverlay() {
    let overlay = document.getElementById('overlay');
    overlay.classList.add('d-none');
    scrollStart();
}

function renderOverlayPokemonInfo(i, currentPokemon) {
    document.getElementById(`pokemonName${i}`).innerHTML = currentPokemon['name'];
    document.getElementById(`pokemonName${i}`).innerHTML = capitalizeFirstLetter(currentPokemon);
    document.getElementById(`pokemonImg${i}`).src = currentPokemon['sprites']['other']['official-artwork']['front_default'];
    document.getElementById(`pokemonId${i}`).innerHTML = '#' + currentPokemon['id'];
    document.getElementById(`pokemonWeight${i}`).innerHTML = (currentPokemon['weight'] / 10).toFixed(1) + ' kg';
    document.getElementById(`pokemonHeight${i}`).innerHTML = (currentPokemon['height'] / 10).toFixed(1) + ' m';
    showMoves(i, currentPokemon);
}

function backward(i) {
    if (i !== 1) {
        i--;
    } else {
        i = pokemonList.length;
    }
    document.getElementById('overlay').innerHTML = ``;
    openOverlay(i);
}

function forward(i) {
    if (i < pokemonList.length) {
        i++;
    } else {
        i = 1;
    }
    document.getElementById('overlay').innerHTML = ``;
    openOverlay(i);
}

function scrollStop() {
    document.getElementById('body').classList.add('scrollStop');
}

function scrollStart() {
    document.getElementById('body').classList.remove('scrollStop');
}

function renderOverlayPokemonTypes(i, currentPokemon) {
    document.getElementById(`overlayTypes${i}`).innerHTML = '';

    for (let k = 0; k < currentPokemon['types'].length; k++) {
        let pokemonType = currentPokemon['types'][k]['type']['name'];
        document.getElementById(`overlayTypes${i}`).innerHTML += `
        <div class="types-container${i}">
            <div class="overlayTypeIcons">
                ${getPokemonColors(pokemonType)}
                <h3 class="type-name">${pokemonType.charAt(0).toUpperCase() + pokemonType.slice(1)}</h3>
            </div>
        </div>`;
    }
    getBorderColor(i, currentPokemon['types'][0]['type']['name']);
}

// RENDERING MOVES //


// CHARTS //

function showMoves(i, currentPokemon) {
    document.getElementById(`pokemonMoves${i}`).innerHTML = '';

    for (let j = 0; j < currentPokemon['moves'].length; j++) {
        let moveName = currentPokemon['moves'][j]['move']['name'];
        document.getElementById(`pokemonMoves${i}`).innerHTML += `
            <div class="move">
                ${moveName}
            </div>`;
    }
}

function showStats() {
    document.getElementById(`overlayPokemonInnerCard`).innerHTML = '';
    document.getElementById(`overlayPokemonInnerCard`).innerHTML += `
    <div>
        <div id="myChartStats"></div>
    </div>
    `;
    
    // Daten für Statistik-Chart
    const dataStats = {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            borderWidth: 1
        }]
    };
    
    // Chart für Statistik-Canvas erstellen
    const ctxStats = document.getElementById('myChartStats');
    new Chart(ctxStats, {
        type: 'bar',
        data: dataStats,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// HTML TEMPLATES //

function loadPokemonHTML(i, currentPokemon) {
    return `
        <div class="pokedex" id="pokedex${i}" onclick="openOverlay(${currentPokemon.id})">           
            <img class="pokemonImg" id="pokemonImg${i}" src="" alt="">
            <div class="pokemoncard" id="pokemoncard${i}">
                <div class="pokemondetails">
                    <div class="nameAndId">
                        <h3 id="pokemonId${i}"></h3>
                        <h3 id="pokemonName${i}"></h3>
                    </div>
                    <div class="types">
                        <span id="types${i}"></span>
                    </div>
                </div>
            </div>
        </div>    
    `;
}

function templateOverlay(i) {
    return `
        <div class="overlayPokedex" id="pokedex${i}">
            <div class="closeIcon">  
                <h2 class="overlayNumber" id="pokemonId${i}"></h2>
                <img class="close" src="img/close.png" onclick="closeOverlay(${i})">
            </div>          
            <img class="overlayPokemonImg" id="pokemonImg${i}" src="" alt="">
            <div class="overlayPokemoncard" id="pokemoncard${i}">
                <div class="backwardAndForward">
                    <img class="backward" src="img/backward.png" onclick="backward(${i})">
                    <img class="forward" src="img/forward.png" onclick="forward(${i})">
                </div>
                    <div class="overlayPokemondetails">
                            <div class="overlayNameAndId">
                                <h1 id="pokemonName${i}"></h1>
                            </div>
                        <div id="overlayPokemonInnerCard">
                            <div class="overlayTypes">
                                <span id="overlayTypes${i}"></span>
                            </div>
                            <div class="weightAndHeight">
                                <div class="weight">
                                    <h2 id="pokemonWeight${i}"></h2>
                                    <h4>Weight</h4>
                                </div>
                                <div class="height">
                                    <h2 id="pokemonHeight${i}"></h2>
                                    <h4>Height</h4>
                                </div>
                            </div>
                        </div>    
                        <div class="overlayNavigation">
                            <button class="stats" onclick="showStats()">Stats</button>
                            <button class="moves" onclick="showMoves()">Moves</button>
                        </div>
                    </div>
            </div>
        </div>`;
}

