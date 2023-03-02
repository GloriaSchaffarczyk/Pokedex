let currentPokemon;


async function init() {
    loadPokemon();
}

async function loadPokemon() {
    for (let i = 1; i < 33; i++) {
        let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        let response = await fetch(url);
        currentPokemon = await response.json();
        console.log('Loaded ', currentPokemon);

        document.getElementById('pokemon').innerHTML += `
        <div class="pokedex" id="pokedex${i}">           
            <img class="pokemonImg" id="pokemonImg${i}" src="" alt="">
            <div class="pokemoncard glowing-circle" id="pokemoncard${i}">
                <div class="pokemondetails">
                    <h3 id="pokemonName${i}"></h3>
                    <span id="types${i}"></span>
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
    document.getElementById(`pokemonImg${i}`).src = currentPokemon['sprites']['other']['official-artwork']['front_default'];
}

function renderPokemonTypes(i) {
    for (let j = 0; j < currentPokemon['types'].length; j++) {
        let pokemonType = currentPokemon['types'][j]['type']['name'];
        document.getElementById(`types${i}`).innerHTML += `
        <div class="types-container${i}">
        <div class="type-icons">${getPokemonColors(pokemonType)}</div>
        </div>`;
        getBackgroundColor(i, pokemonType);
    }
}

function getPokemonColors(pokemonType) {
    return `
<img src="img/types/${pokemonType}.png"></img>
`;
}

function getBackgroundColor(i, pokemonType) {
    document.getElementById(`pokemoncard${i}`).classList.add(pokemonType);
}
