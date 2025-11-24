const url = "https://pokeapi.co/api/v2/pokemon?limit=72";
const templateCard = document.getElementById('pokedex-template');
const container = document.querySelector('.pokedex-body__cards-container');

// Começo da lógica de carregamento dos Pokémons
let allPokemonData = []; // Armazena em um array todos os dados dos Pokémons vindo da 'url'
let currentIndex = 0;
const initialLoad = 24;
const pageSize = 12;

let selectedType = 'all';
let selectedRegion = 'all';

let favoritePokemons = new Set();

let searchQuery = "";

const loadMoreBtn = document.getElementById('load-more-btn');

async function getInfoPoke() {

    // Lógica dos selects customizados
    document.addEventListener("click", function(e) {

        document.getElementById("search-input").addEventListener("input", function () {
            searchQuery = this.value.trim().toLowerCase();
            applyFilters();
        });

        const select = e.target.closest(".custom-select"); // Verifica se o clique foi em um select customizado

        document.querySelectorAll(".custom-select").forEach(s => {
            if (s === select) {
                s.classList.toggle("open");
            } else {
                s.classList.remove("open");
            }
        });

        const option = e.target.closest(".custom-select__option"); // Verifica se o clique foi em uma opção
        if (option) {
            const sel = option.closest(".custom-select");
            const trigger = sel.querySelector(".custom-select__trigger");

            trigger.childNodes[0].textContent = option.textContent;
            sel.classList.remove("open");

            const filterType = sel.dataset.filter;
            if (filterType === 'type') selectedType = option.dataset.value;
            if (filterType === 'region') selectedRegion = option.dataset.value;

            applyFilters();
        }
    });

    const response = await fetch(url);
    const data = await response.json();

    // Busca os dados detalhados de cada Pokémon
    for (const pokemon of data.results) {
        const pokeResponse = await fetch(pokemon.url);
        const pokeData = await pokeResponse.json();

        pokeData.region = (pokeData.id <= 151) ? 'kanto' : 'other';

        allPokemonData.push(pokeData); // Armazena cada Pokémon no array
    }

    loadNextBatch(initialLoad); // Carrega os primeiros 24 Pokémons
}

// Função para capitalizar a primeira letra de uma string
function capitalizeFirstLetter(string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function filterPokemonArray() {
    return allPokemonData.filter(pokeData => {
        const types = pokeData.types.map(t => t.type.name.toLowerCase());
        const region = pokeData.region ? pokeData.region.toLowerCase() : 'kanto';
        
        const typeMatch = selectedType === 'all' || types.includes(selectedType.toLowerCase());
        const regionMatch = selectedRegion === 'all' || region === selectedRegion.toLowerCase();

        const name = pokeData.name.toLowerCase();
        const id = pokeData.id.toString();

        const searchMatch =
            searchQuery === "" ||
            name.includes(searchQuery) ||
            id === searchQuery;

        return typeMatch && regionMatch && searchMatch;
    });
}

// Aplica os filtros selecionados e recarrega os Pokémons exibidos
function applyFilters() {
    currentIndex = 0;
    container.innerHTML = '';
    loadNextBatch(initialLoad);
}

// Função para carregar o próximo lote de Pokémons
function loadNextBatch(batchSize = pageSize) {
    const filtered = filterPokemonArray(); // Obtém o array filtrado de Pokémons
    const nextBatch = filtered.slice(currentIndex, currentIndex + batchSize); // Seleciona o próximo lote com base no índice atual

    nextBatch.forEach(pokeData => {
        const card = templateCard.cloneNode(true);
        card.style.display = "flex";
        card.classList.remove("template");
        card.classList.add("pokedex-card");
        card.removeAttribute("id");

        const mainType = pokeData.types[0].type.name;
        card.querySelector(".pokemon-span__cards-id").classList.add(`bg-${mainType}-type`);

        const formattedId = `#${pokeData.id.toString().padStart(3, "0")}`;
        card.querySelector(".pokemon-img").src = pokeData.sprites.other.dream_world.front_default;
        card.querySelector(".pokemon-span__cards-id").textContent = formattedId;
        card.querySelector(".pokemon-span__cards-name").textContent = capitalizeFirstLetter(pokeData.name);

        const typeContainer = card.querySelector(".pokedex-body__cards-type");
        typeContainer.innerHTML = "";
        pokeData.types.forEach((t) => {
            const typeDiv = document.createElement("div");
            typeDiv.classList.add("pokedex-body__cards-especie");
            typeDiv.innerHTML = `
                <img src="img/${t.type.name}-type-icon.png" alt="${t.type.name}">
                <span>${capitalizeFirstLetter(t.type.name)}</span>
            `;
            typeContainer.appendChild(typeDiv);
        });

        const favBtnCard = card.querySelector('.pokemon-fav-card');

        if (favoritePokemons.has(pokeData.id)) {
            favBtnCard.classList.remove('d-none');
            favBtnCard.classList.add('favorited');
        } else {
            favBtnCard.classList.add('d-none');
            favBtnCard.classList.remove('favorited');
        }

        card.addEventListener("click", () => {
            const pokemonModal = new bootstrap.Modal(document.getElementById('pokemonModal'));

            document.querySelector('.modal-pokemon-img').src = pokeData.sprites.other.dream_world.front_default;
            document.querySelector('.modal-pokemon__id').textContent = formattedId;
            document.querySelector(".modal-pokemon__id").className = 'modal-pokemon__id';
            document.querySelector(".modal-pokemon__id").classList.add(`bg-${mainType}-type`);
            document.querySelector('.modal-pokemon__name').textContent = capitalizeFirstLetter(pokeData.name);

            const modalTypeContainer = document.querySelector('.modal-pokemon__types');
            modalTypeContainer.innerHTML = "";
            pokeData.types.forEach((t) => {
                const typeDiv = document.createElement("div");
                typeDiv.classList.add("pokedex-body__cards-especie");
                typeDiv.innerHTML = `
                    <img src="img/${t.type.name}-type-icon.png" alt="${t.type.name}">
                    <span>${capitalizeFirstLetter(t.type.name)}</span>
                `;
                modalTypeContainer.appendChild(typeDiv);
            });

            const modalAbilityContainer = document.querySelector('.pokemon__abilities-container');
            modalAbilityContainer.innerHTML = '';
            pokeData.abilities.forEach((t) => {
                const abilitiesDiv = document.createElement("div");
                abilitiesDiv.classList.add("modal-pokemon__info-box");
                abilitiesDiv.innerHTML = `<span>${capitalizeFirstLetter(t.ability.name)}</span>`;
                modalAbilityContainer.appendChild(abilitiesDiv);
            });

            document.querySelector('.modal-pokemon__height').textContent = pokeData.height / 10;
            document.querySelector('.modal-pokemon__weight').textContent = pokeData.weight / 10;
            const geneticDetails = document.querySelectorAll('.modal-pokemon__genetic .modal-pokemon__detail span');
            if (geneticDetails.length >= 3) geneticDetails[2].textContent = pokeData.base_experience;

            const modalFavBtn = document.querySelector('.pokemon-fav-btn');

            if (favoritePokemons.has(pokeData.id)) {
                modalFavBtn.classList.add('favorited');
            } else {
                modalFavBtn.classList.remove('favorited');
            }

            modalFavBtn.onclick = () => {
                const isFav = favoritePokemons.has(pokeData.id);

                if (isFav) {
                    favoritePokemons.delete(pokeData.id);
                    modalFavBtn.classList.remove('favorited');
                } else {
                    favoritePokemons.add(pokeData.id);
                    modalFavBtn.classList.add('favorited');
                }

                updateCardFavoriteState(pokeData.id);
            };

            pokemonModal.show();
        });

        container.appendChild(card);
    });

    currentIndex += batchSize;

    if (currentIndex >= filtered.length) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'inline-block';
    }
}

function updateCardFavoriteState(pokeId) {
    const allCards = document.querySelectorAll('.pokedex-card');

    allCards.forEach(card => {
        const idText = card.querySelector('.pokemon-span__cards-id').textContent.replace('#', '');
        const numericId = parseInt(idText);

        const favBtn = card.querySelector('.pokemon-fav-card');

        if (!favBtn) return;

        if (favoritePokemons.has(numericId)) {
            favBtn.classList.remove('d-none');
        } else {
            favBtn.classList.add('d-none');
        }
    });
}


loadMoreBtn.addEventListener('click', () => loadNextBatch(pageSize));

getInfoPoke();