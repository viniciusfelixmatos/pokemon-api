const url = "https://pokeapi.co/api/v2/pokemon?limit=24";
const templateCard = document.getElementById('pokedex-template');
const container = document.querySelector('.pokedex-body__cards-container');

async function getInfoPoke() {
    const response = await fetch(url);
    const data = await response.json();

    for (const pokemon of data.results) {
        const pokeResponse = await fetch(pokemon.url);
        const pokeData = await pokeResponse.json();

        // Clonar e preencher o card
        const card = templateCard.cloneNode(true);
        card.style.display = "flex";
        card.classList.remove("template");
        card.classList.add("pokedex-card");
        card.removeAttribute("id");

        // ID formatado
        const id = pokemon.url.split("/")[6];
        const formattedId = `#${id.toString().padStart(3, "0")}`;

        // Preenche dados do card
        card.querySelector(".pokemon-img").src = pokeData.sprites.front_default;
        card.querySelector(".pokemon-span__cards-id").textContent = formattedId;
        card.querySelector(".pokemon-span__cards-name").textContent = pokeData.name;

        // Preenche tipos
        const typeContainer = card.querySelector(".pokedex-body__cards-type");
        typeContainer.innerHTML = "";
        pokeData.types.forEach((t) => {
            const typeDiv = document.createElement("div");
            typeDiv.classList.add("pokedex-body__cards-especie");
            typeDiv.innerHTML = `
                <img src="img/${t.type.name}-type-icon.png" alt="${t.type.name}">
                <span>${t.type.name}</span>
            `;
            typeContainer.appendChild(typeDiv);
            console.log(pokeData);
        });

        // Adiciona listener de clique **dentro do loop**
        card.addEventListener("click", () => {
            const pokemonModal = new bootstrap.Modal(document.getElementById('pokemonModal'));

            document.getElementById('pokemonModalLabel').textcontent = pokeData.name;
            document.querySelector('.modal-pokemon-img').src = pokeData.sprites.front_default;
            document.querySelector('.modal-pokemon__id').textContent = formattedId;
            document.querySelector('.modal-pokemon__name').textContent = pokeData.name;

            const types = pokeData.types.map(t => t.type.name).join(', ');
            document.querySelector('.modal-pokemon__types').textContent = types;

            document.querySelector('.modal-pokemon__height').textContent = pokeData.height / 10;
            document.querySelector('.modal-pokemon__weight').textContent = pokeData.weight / 10;


            pokeData.types.forEach((t) => {
                const typeDiv = document.createElement("div");
                typeDiv.classList.add("modal-pokedex-especie");
                typeDiv.innerHTML = `
                    <img src="img/${t.type.name}-type-icon.png" alt="${t.type.name}">
                    <span>${t.type.name}</span>               
                `;

                typeContainer.appendChild(typeDiv);
            })

            pokemonModal.show();
        });

        // Adiciona o card ao container
        container.appendChild(card);
    }
}

getInfoPoke();
