let currentPokemon;
let loadedPokemon = 26;
let currentlyLoaded = 1;
let pokemonList = [];

function init() {
    loadPokemon();
}

async function loadPokemon() {
    const pokemonContainer = document.getElementById('pokemon');
    let html = '';

    let startIndex = currentlyLoaded;
    let endIndex = loadedPokemon;

    const requests = [];
    for (let i = startIndex; i < endIndex; i++) {
        const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        requests.push(fetch(url).then(res => res.json()));
    }

    const results = await Promise.all(requests);

    results.forEach((currentPokemon, index) => {
        const i = startIndex + index;
        pokemonList.push(currentPokemon);
        html += loadPokemonHTML(i, currentPokemon);
    });

    pokemonContainer.innerHTML += html;

    for (let i = startIndex; i < endIndex; i++) {
        const currentPokemon = pokemonList[i - 1];
        renderPokemonInfo(i, currentPokemon);
        renderPokemonTypes(i, currentPokemon);
    }
}

function renderPokemonInfo(i, currentPokemon) {
    document.getElementById(`pokemonName${i}`).innerHTML = capitalizeFirstLetter(currentPokemon);
    document.getElementById(`pokemonImg${i}`).src = currentPokemon['sprites']['other']['official-artwork']['front_default'];
    document.getElementById(`pokemonId${i}`).innerHTML = '#' + currentPokemon['id'];
}

function renderPokemonTypes(i, currentPokemon) {
    const typesContainer = document.getElementById(`types${i}`);
    typesContainer.innerHTML = '';

    for (let j = 0; j < currentPokemon['types'].length; j++) {
        let pokemonType = currentPokemon['types'][j]['type']['name'];
        typesContainer.innerHTML += `
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
    currentlyLoaded = loadedPokemon;
    loadedPokemon += 26;
    loadPokemon();
}

// SEARCH //
async function searchPokemon(event) {
    event.preventDefault();
    let search = document.getElementById('search').value.toLowerCase();

    document.getElementById('pokemon').innerHTML = '';
    document.getElementById('loadMoreButton').innerHTML = '';

    let foundPokemon = 0;

    for (let i = 0; i < pokemonList.length; i++) {
        const currentPokemon = pokemonList[i];
        if (currentPokemon['name'].startsWith(search)) {
            foundPokemon++;
            document.getElementById('pokemon').innerHTML += loadPokemonHTML(i, currentPokemon);
            renderPokemonInfo(i, currentPokemon);
            renderPokemonTypes(i, currentPokemon);
        }
    }

    if (foundPokemon === 0) {
        try {
            const url = `https://pokeapi.co/api/v2/pokemon/${search}`;
            const response = await fetch(url);
            const currentPokemon = await response.json();

            pokemonList.push(currentPokemon);
            foundPokemon++;
            document.getElementById('pokemon').innerHTML += loadPokemonHTML(currentPokemon.id, currentPokemon);
            renderPokemonInfo(currentPokemon.id, currentPokemon);
            renderPokemonTypes(currentPokemon.id, currentPokemon);
        } catch {
            displayError();
        }
    }

    if (foundPokemon === 0) {
        displayError();
    }
}

function displayError() {
    document.getElementById('pokemon').innerHTML = `<div class="error"><p class="error-message">Note: A Pokémon with that name could not be found. Please note, that you are only able to search by name, not by ID. Please try again or load more Pokémon. You can go back by clicking on the Logo.</p></div>`;
}

function submitSearch() {
    let inputField = document.getElementById('search');
    
    if(inputField.value.trim() !== '') {
        document.forms['search'].dispatchEvent(new Event('submit'));
    } else {
        console.log('Das Eingabefeld ist leer.');
    }
}

function inputFocus(element) {
    element.classList.add('input-focused');
    element.placeholder = "Search by name";
}

function inputBlur(element) {
    if (element.value.trim() === '') {
        element.classList.remove('input-focused');
        element.placeholder = "";
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
}

function backward(i) {
    if (i > 1) {
        i--;
    } else {
    }
    document.getElementById('overlay').innerHTML = ``;
    openOverlay(i);
}

function forward(i) {
    if (i < pokemonList.length) {
        i++;
    } else {
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
function renderPokemonMoves(currentPokemon) {
    let movesContainer = document.getElementById('overlayPokemonInnerCard');
    movesContainer.innerHTML = '';

    let moveDivContainer = document.createElement('div');
    moveDivContainer.classList.add('move-container');

    for (let j = 0; j < currentPokemon['moves'].length; j++) {
        let move = currentPokemon['moves'][j]['move']['name'];
        move = move.charAt(0).toUpperCase() + move.slice(1);
        moveDivContainer.innerHTML += `<div class="move">${move}</div>`;
    }
    movesContainer.appendChild(moveDivContainer);
}

// SHOW MOVES //
function showMoves(i) {
    let currentPokemon = pokemonList[i - 1];
    if (currentPokemon) {
        renderPokemonMoves(currentPokemon);
    } else {
        console.error(`Pokemon with index ${i} not found.`);
    }
}

// EXTRACT CHART DATA FROM API //
function extractStatsData(currentPokemon) {
    let statsData = [];
    for (let j = 0; j < currentPokemon['stats'].length; j++) {
        statsData.push(currentPokemon['stats'][j]['base_stat']);
    }
    return statsData;
}

// CREATE DATA AND STYLE OF CHART //
function createStatsChartData(statsData) {
    return {
        labels: ['HP', 'Attack', 'Defense', 'Special Attack', 'Special Defense', 'Speed'],
        datasets: [{
            label: 'Stats',
            data: statsData,
            Color: [
                'rgba(255, 255, 255, 0.8)',
            ],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 2,
            borderRadius: 5
        }]
    };
}

// CREATE TYPE OF CHART: BAR //
function createStatsChart(canvasElementId, data) {
    const ctxStats = document.getElementById(canvasElementId);
    new Chart(ctxStats, {
        type: 'bar',
        data: data,
        options: {
            plugins: {
                legend: {
                    display: false,
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.8)',
                    },
                },
                x: {
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.8)',
                    },
                },
            },
        },
    });
}

// SHOW CHART //
function showStats(i) {
    let currentPokemon = pokemonList[i - 1];
    if (currentPokemon) {
        const statsData = extractStatsData(currentPokemon);
        const overlayPokemonInnerCard = document.getElementById(`overlayPokemonInnerCard`);
        overlayPokemonInnerCard.innerHTML = '';
        overlayPokemonInnerCard.innerHTML += `
        <div class="canvasContainer">
            <canvas id="myChartStats"></canvas>
        </div>
        `;
        const dataStats = createStatsChartData(statsData);
        createStatsChart('myChartStats', dataStats);
    } else {
        console.error(`Pokemon with index ${i} not found.`);
    }
}

// HTML TEMPLATES OVERVIEW & OVERLAY //
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
                            <button class="stats" onclick="showStats(${i})">Stats</button>
                            <button class="moves" onclick="showMoves(${i})">Moves</button>
                        </div>
                    </div>
            </div>
        </div>`;
}