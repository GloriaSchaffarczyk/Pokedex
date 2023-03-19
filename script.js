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
    document.getElementById(`pokemonName${i}`).innerHTML = currentPokemon['name'].charAt(0).toUpperCase();
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

function getOverlayBackground(pokemonType) {
    let overlayPokedex = document.querySelector('.overlayPokedex');
    let overlayBackground = `url('img/types-background/${pokemonType}.png')`;
    overlayPokedex.style.backgroundImage = overlayBackground;
}

function capitalizeFirstLetter(currentPokemon) {
    return currentPokemon['name'].charAt(0).toUpperCase() + currentPokemon['name'].slice(1);
}

function loadMorePokemon() {
    currentlyLoaded = loadedPokemon + 1;
    loadedPokemon += 33;
    loadPokemon();
}

function openImage(id) {
    let Pokemon = pokemonList.find(pokemon => pokemon.id === id);
    let overlay = document.getElementById('overlay');
    overlay.classList.remove('d-none');
    overlay.innerHTML = templateOverlay(id);
    scrollStop();
    renderOverlayPokemonInfo(id, Pokemon);
    renderPokemonTypes(id, Pokemon);
    getOverlayBackground(Pokemon['types'][0]['type']['name']);
}


function closeImage() {
    let overlay = document.getElementById('overlay');
    overlay.classList.add('d-none');
    scrollStart();
}

function renderOverlayPokemonInfo(i, currentPokemon) {
    document.getElementById(`pokemonName${i}`).innerHTML = currentPokemon['name'];
    document.getElementById(`pokemonName${i}`).innerHTML = capitalizeFirstLetter(currentPokemon);
    document.getElementById(`pokemonImg${i}`).src = currentPokemon['sprites']['other']['official-artwork']['front_default'];
    document.getElementById(`pokemonId${i}`).innerHTML = '#' + currentPokemon['id'];
    document.getElementById(`pokemonWeight${i}`).innerHTML = currentPokemon['weight'] + ' lbs';
}

function backward(i, loadedPokemon) {
    if (i !== 0) {
        i--
    } else {
        i = loadedPokemon - 1
    }
    document.getElementById('overlay').innerHTML = ``;
    openImage(i);
}

function forward(i, loadedPokemon) {
    if (i < loadedPokemon - 1) {
        i++
    } else {
        i = 0
    }
    document.getElementById('overlay').innerHTML = ``;
    openImage(i);
}

function scrollStop() {
    document.getElementById('body').classList.add('scrollStop');
}

function scrollStart() {
    document.getElementById('body').classList.remove('scrollStop');
}

function searchPokemon(event) {
    event.preventDefault();
    let search = document.getElementById('search').value;
    search = search.toLowerCase();

    document.getElementById('pokemon').innerHTML = '';

    for (let i = 0; i < pokemonList.length; i++) {
        const currentPokemon = pokemonList[i];
        const pokemonName = currentPokemon['name'];
        if (pokemonName.startsWith(search)) {
            document.getElementById('pokemon').innerHTML += loadPokemonHTML(index, currentPokemon);
            renderPokemonInfo(i, currentPokemon);
            renderPokemonTypes(i, currentPokemon);
        }
    }
}






// HTML templates

function loadPokemonHTML(index, currentPokemon) {
    return `
        <div class="pokedex" id="pokedex${index}" onclick="openImage(${currentPokemon.id})">           
            <img class="pokemonImg" id="pokemonImg${index}" src="" alt="">
            <div class="pokemoncard" id="pokemoncard${index}">
                <div class="pokemondetails">
                    <div class="nameAndId">
                        <h3 id="pokemonId${index}"></h3>
                        <h3 id="pokemonName${index}"></h3>
                    </div>
                    <div class="types">
                        <span id="types${index}"></span>
                    </div>
                </div>
            </div>
        </div>    
    `;
}

function templateOverlay(i) {
    return `
        <div class="overlayPokedex" id="pokedex${i}" onclick="closeImage(${i})">           
            <img class="overlayPokemonImg" id="pokemonImg${i}" src="" alt="">
            <div class="overlayPokemoncard" id="pokemoncard${i}">
                <div class="overlayPokemondetails">
                    <div class="overlayNameAndId">
                        <h3 id="pokemonId${i}"></h3>
                        <h3 id="pokemonName${i}"></h3>
                    </div>
                    <div class="overlayTypes">
                        <span id="types${i}"></span>
                    </div>
                    <div class="weight">
                    <span id="pokemonWeight${i}"></span>
                    </div>
                </div>
            </div>
        </div>    
        `;
}

