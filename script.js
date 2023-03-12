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
        currentPokemon = await response.json();
        console.log('Loaded ', currentPokemon);

        pokemonList.push(currentPokemon);

        document.getElementById('pokemon').innerHTML += `
        <div class="pokedex" id="pokedex${i}" onclick="openImage(${i}), scrollStop()">           
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
        renderPokemonInfo(i);
        renderPokemonTypes(i);
    }
}

function renderPokemonInfo(i) {
    document.getElementById(`pokemonName${i}`).innerHTML = currentPokemon['name'];
    document.getElementById(`pokemonName${i}`).innerHTML = capitalizeFirstLetter(currentPokemon);
    document.getElementById(`pokemonImg${i}`).src = currentPokemon['sprites']['other']['official-artwork']['front_default'];
    document.getElementById(`pokemonId${i}`).innerHTML = '#' + currentPokemon['id'];
}

function renderPokemonTypes(i) {
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

function openImage(i) {
    let overlay = document.getElementById('overlay');
    overlay.classList.remove('d-none');
    overlay.innerHTML = templateOverlay(i);
    let pokemon = pokemonList[i -1];
    renderPokemonInfo(i, pokemon);
    renderPokemonTypes(i, pokemon);
}

function closeImage() {
    let overlay = document.getElementById('overlay');
    overlay.classList.add('d-none');
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

function templateOverlay(i) {
    return `
        <div class="pokedex" id="pokedex${i}" onclick="openImage(${i}), scrollStop()">           
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