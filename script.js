// Handles the fetching of pokemon data from multiple sources
const fetchPokemon = pokemon => {
    pokemon = pokemon.toLowerCase();
    const urls = [
        `https://pokeapi.co/api/v2/pokemon/${pokemon}`,
        `https://pokeapi.co/api/v2/pokemon-species/${pokemon}`,
    ];
    const requests = urls.map(url => fetch(url));
    Promise.all(requests)
        .then(responses => Promise.all(responses.map(response => response.json())))
        .then(data => displayPokemonInfo(data))
        .catch(error => console.log(error));
};

const searchInput = document.querySelector('.search-form__input');
const searchButton = document.querySelector('.search-form__button');

// Store user input and use it to get the information for the relevant pokemon
searchButton.addEventListener('click', (e) => {
    e.preventDefault();
    const pokemon = searchInput.value;
    searchInput.value = '';
    fetchPokemon(pokemon);
});

const pokemonCardContainer = document.querySelector('#pokemon-card-container');

// Creates a card element along with the information extracted from the pokemonData array
const displayPokemonInfo = pokemonData => {
    // Destructure the pokemonData array for easier access to the relevant properties
    const [pokemon, pokemonSpecies] = pokemonData;

    const pokemonCard = document.createElement('article');
    pokemonCard.classList.add('pokemon-card');
    pokemonCard.innerHTML = `
        <aside class="pokemon-card__aside">
            <figure class="pokemon-card__figure">
                <img 
                    src="https://pokeres.bastionbot.org/images/pokemon/${pokemon.id}.png" 
                    alt="Official artwork of ${pokemon.name[0].toUpperCase() + pokemon.name.slice(1)}" 
                    class="pokemon-card__image"
                >
                <figcaption class="pokemon-card__caption">#${pokemon.id.toString().padStart(3, '0')}</figcaption> 
            </figure>
        </aside>
        <header class="pokemon-card__header"> 
           <h2 class="pokemon-card__title">${pokemon.name[0].toUpperCase() + pokemon.name.slice(1)}</h2> 
           <h3 class="pokemon-card__subtitle">${pokemonSpecies.genera.find(genus => genus.language.name === 'en').genus}</h3>
        </header>
        <section class="pokemon-card__body">
            <p class="pokemon-card__description">${pokemonSpecies.flavor_text_entries.find(textEntry => textEntry.language.name === 'en').flavor_text}</p>
        </section>
        <footer class="pokemon-card__footer">
            <p class="pokemon-card__type">Type: ${pokemon.types.map(type => type.type.name.toUpperCase()).join(' | ')}</p>
        </footer>
    `;
    // Make only one card appear on the page
    (pokemonCardContainer.firstChild) ? pokemonCardContainer.firstChild.replaceWith(pokemonCard) : pokemonCardContainer.appendChild(pokemonCard);
};