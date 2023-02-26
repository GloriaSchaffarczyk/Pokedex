let currentPokemon;

async function init() {
    loadPokemon();
}

async function loadPokemon() {
    for (let i = 1; i < 13; i++) {
        let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        let response = await fetch(url);
        currentPokemon = await response.json();
        let name = currentPokemon['name']
        console.log('Loaded ', currentPokemon, name);
        renderPokemonInfo();
    }
}

function renderPokemonInfo() {
    document.getElementById('pokemonName').innerHTML = currentPokemon['name'];
    document.getElementById('pokemonImg').src = currentPokemon['sprites']['other']['official-artwork']['front_default'];
    document.getElementById('type').innerHTML = currentPokemon['types'][0]['type']['name'];
    renderPokemonTypes();
}

function renderPokemonTypes() {
    for (let i = 0; i < currentPokemon['types'].length; i++) {
        document.getElementById(`types${currentPokemon['name']}`).innerHTML += `
        <button>currentPokemon['types'][i]['type']['name']</button>
        `;
    }
}