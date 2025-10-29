const url = "https://pokeapi.co/api/v2/pokemon?limit=24";
const templateCard = document.getElementById('pokedex-template');
const container = document.querySelector('.pokedex-body__cards-container');
const filterGroup = document.querySelectorAll('.type-item');
const filterText = filterGroup.textContent;
console.log(filterText);
const filterArray = Array.from(filterGroup);
const filterinnerArea = document.querySelector('.pokedex-body__filters-dropdown')

// FUNÇÃO PARA CAPITALIZAR A PRIMEIRA LETRA
function capitalizeFirstLetter(string) {
    if (!string) {
        return '';
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
}


filterinnerArea.addEventListener('click', function() {

    console.log(filterArray);

    filterArray.forEach(() => {
        
    })

})


async function getInfoPoke() {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);

    for (const pokemon of data.results) {
        const pokeResponse = await fetch(pokemon.url);
        const pokeData = await pokeResponse.json();

        console.log(pokeData);

        // CLONAR E PREENCHER O CARD
        const card = templateCard.cloneNode(true);
        card.style.display = "flex";
        card.classList.remove("template");
        card.classList.add("pokedex-card");
        card.removeAttribute("id");

        // NOVO: PEGAR O PRIMEIRO TIPO E APLICAR CLASSE DE COR PRINCIPAL NO CARD
        const mainType = pokeData.types[0].type.name;
        card.querySelector(".pokemon-span__cards-id").classList.add(`bg-${mainType}-type`); 
        
        // ID FORMATADO
        const id = pokeData.id;
        console.log(typeof id);
        const formattedId = `#${id.toString().padStart(3, "0")}`;

        // PREENCHE DADOS DO CARD
        card.querySelector(".pokemon-img").src = pokeData.sprites.other.dream_world.front_default;
        card.querySelector(".pokemon-span__cards-id").textContent = formattedId;
        card.querySelector(".pokemon-span__cards-name").textContent = capitalizeFirstLetter(pokeData.name);

        // PREENCHER TIPOS
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

        // Adiciona listener de clique **dentro do loop**
        card.addEventListener("click", () => {
            const pokemonModal = new bootstrap.Modal(document.getElementById('pokemonModal'));
            
            // PREENCHE DADOS BÁSICOS DO MODAL
            document.querySelector('.modal-pokemon-img').src = pokeData.sprites.front_default;
            document.querySelector('.modal-pokemon__id').textContent = formattedId;
            const mainType = pokeData.types[0].type.name;
            document.querySelector(".modal-pokemon__id").classList.add(`bg-${mainType}-type`);
            document.querySelector('.modal-pokemon__name').textContent = capitalizeFirstLetter(pokeData.name);

            // PREENCHIMENTO DE TIPOS
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

            // PREENCHER ÁREA DE ABILIDADES
            const modalAbilityContainer = document.querySelector('.pokemon__abilities-container');
            modalAbilityContainer.innerHTML = ''

            pokeData.abilities.forEach((t) => {
                const abilitiesDiv = document.createElement("div");
                abilitiesDiv.classList.add("modal-pokemon__info-box");

                abilitiesDiv.innerHTML = `
                <span>${capitalizeFirstLetter(t.ability.name)}</span>
                `
                modalAbilityContainer.appendChild(abilitiesDiv);
            })

            // PREENCHE ALTURA, PESO E BASE EXP.
            document.querySelector('.modal-pokemon__height').textContent = pokeData.height / 10;
            document.querySelector('.modal-pokemon__weight').textContent = pokeData.weight / 10;
            
            const geneticDetails = document.querySelectorAll('.modal-pokemon__genetic .modal-pokemon__detail span');
            if (geneticDetails.length >= 3) {
                geneticDetails[2].textContent = pokeData.base_experience;
            }

            pokemonModal.show();
        });

        // Adiciona o card ao container
        container.appendChild(card);
    }
}

getInfoPoke();