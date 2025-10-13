const url = "https://pokeapi.co/api/v2/pokemon?limit=20";
const templateCard = document.getElementById('pokedex-template');
const container = document.querySelector('.pokedex-body__cards-container');

async function getInfoPoke() {
    const response = await fetch(url);
    const data = await response.json();

    data.results.forEach(async (pokemon) => {
        // Faz a requisição individual
        const pokeResponse = await fetch(pokemon.url);
        const pokeData = await pokeResponse.json();

        // Clona o template
        const card = templateCard.cloneNode(true);
        card.style.display = "flex";
        card.classList.remove("template");
        card.classList.add("pokedex-card");
        card.removeAttribute("id");

        // Formatar ID
        const id = pokemon.url.split("/")[6];
        const formattedId = `#${id.toString().padStart(3, "0")}`;

        // Preenche os dados
        card.querySelector(".pokemon-img").src = pokeData.sprites.front_default;
        card.querySelector(".pokemon-span__cards-id").textContent = formattedId;
        card.querySelector(".pokemon-span__cards-name").textContent = pokeData.name;

        // Tipos
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
        });

        // Adiciona o card ao container
        container.appendChild(card);
    });
}

getInfoPoke();
