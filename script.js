let currentPokemon;
let loadedPokemon = 33;
let currentlyLoaded = 1;


function init() {
    loadPokemon();
}

async function loadPokemon() {
    for (let i = currentlyLoaded; i < loadedPokemon; i++) {
        let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        let response = await fetch(url);
        currentPokemon = await response.json();
        console.log('Loaded ', currentPokemon);

        document.getElementById('pokemon').innerHTML += `
        <div class="pokedex" id="pokedex${i}">           
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
        renderPokemonTypes(i)
    }
}

function renderPokemonInfo(i) {
    document.getElementById(`pokemonName${i}`).innerHTML = currentPokemon['name'];
    document.getElementById(`pokemonName${i}`).innerHTML = capitalizeFirstLetter(currentPokemon);
    document.getElementById(`pokemonImg${i}`).src = currentPokemon['sprites']['other']['official-artwork']['front_default'];
    document.getElementById(`pokemonId${i}`).innerHTML = '#' + currentPokemon['id'];
    document.getElementById(`pokemonImg${i}`).src = currentPokemon['sprites']['other']['official-artwork']['front_default'];
    document.getElementById(`pokemonImg${i}`).src = currentPokemon['sprites']['other']['official-artwork']['front_default'];
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
 }

function closeImage() {
    let overlay = document.getElementById('overlay');
    overlay.classList.add('d-none');
}

function backward(i, loadedPokemon) {
    if (i !== 0) {
        i--
    } else {
        i = loadedPokemon -1
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

function templateOverlay(i, pokemonImg) {
    return `
    <div class="pokemonDetails">
        <span class="close" onclick="closeImage(), scrollStart()">&times;</span>
        <div class="overlay-bgr"></div>
        <img class="zoomedImage" src="${pokemonImg[i]}">
        <div id="backward" class="backward" onclick="backward(${i})"><img src="img/backward.png"></div>
        <div id="forward" class="forward" onclick="forward(${i})"><img src="img/forward.png"></div>
    </div>
    `
} 

/* function searchPokemon() {
    let pokemon = document.getElementById('pokemon');
    pokemon.innerHTML = '';

    for (let k = 0; k < currentPokemon['name'].length; j++) {
        let pokemonName = currentPokemon['name'];
        pokemon.innerHTML += `
        <div class="pokedex" id="pokedex${k}">           
            <img class="pokemonImg" id="pokemonImg${k}" src="" alt="">
            <div class="pokemoncard" id="pokemoncard${k}">
                <div class="pokemondetails">
                    <div class="nameAndId">
                        <h3 id="pokemonId${k}"></h3>
                        <h3 id="pokemonName${k}"></h3>
                    </div>
                    <div class="types">
                        <span id="types${k}"></span>
                    </div>
                </div>
            </div>
        </div>    
        `;
    }
} */