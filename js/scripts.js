const url = "https://pokeapi.co/api/v2/pokemon/1/"
const templateCard = $(".pokedex-body__cards-template")

async function getInfoPoke() {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    console.log(response);

    data.species.map((card) => {
        const name = document.createElement("p");
        name.innerText = card.name;

        templateCard.appendChild(name);

    })

}

getInfoPoke();