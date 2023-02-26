let currentPokemon;

async function init() {
    loadPokemon();
}

async function loadPokemon() {
    for (let i = 1; i < 13; i++) {
        let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        let response = await fetch(url);
        currentPokemon = await response.json();
        console.log('Loaded ', currentPokemon);

        document.getElementById('pokemon').innerHTML += `
        <div id="pokedex">           
            <img class="pokemonImg" id="pokemonImg${i}" src="" alt="">
            <div class="pokemoncard" id="pokemoncard${i}">
                <div class="pokemondetails">
                    <h3 id="pokemonName${i}"></h3>
                    <button id="types${i}"></button>
                </div>
            </div>
        </div>    
        `;
        renderPokemonInfo(i);
    }
}


function renderPokemonInfo(i) {
    document.getElementById(`pokemonName${i}`).innerHTML = currentPokemon['name'];
    document.getElementById(`pokemonImg${i}`).src = currentPokemon['sprites']['other']['official-artwork']['front_default'];

    for (let j = 0; j < currentPokemon['types'].length; j++) {
        document.getElementById(`types${i}`).innerHTML += currentPokemon['types'][j]['type']['name'];
    }
}
