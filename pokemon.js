const MAX_POKEMON = 649
const caixaLista = document.querySelector(".caixa-lista");
const pesquisaInput = document.querySelector("#pesquisa-input");
const numeroFiltro = document.querySelector("#number");
const nomeFiltro = document.querySelector("#name");
const naoEncontradoMensagem = document.querySelector("#nao-encontrado-mensagem");

let allPokemons = [];

fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`)
.then((resposta) => resposta.json())
.then((data) => {
    allPokemons = data.results;
    mostrarPokemon(allPokemons);
})

async function fetchPokemonDataBeforeRedirect(id){
    try{
        const [pokemon, pokemonSpecies] = await Promise.all([
            fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) => 
            res.json()
            ),
            fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res) => 
            res.json()
        )
    ])
    return true
    } catch (error){
        console.error("Falhou em pegar data dos Pokemons antes do Redirect")
    }
}

function mostrarPokemon (pokemon){
    caixaLista.innerHTML = "";

    pokemon.forEach((pokemon) => {
        const pokemonId = pokemon.url.split("/")[6];
        const ItemLista =  document.createElement("div")
        ItemLista.className = "lista-item"
        ItemLista.innerHTML = `
            <div class="numero-poke">
                <p class="caption-fonts">#${pokemonId}</p>
            </div>
            <div class="png-poke">
                <img src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemonId}.svg" alt="${pokemon.name}"/>
            </div>
            <div class="name-poke">
                <p class="body3-fonts">#${pokemon.name}</p>
            </div>
        `;

        ItemLista.addEventListener("click", async () => {
            const sucesso = await fetchPokemonDataBeforeRedirect(pokemonId);
            if (sucesso){
                window.location.href = `detail.html?id=${pokemonId}`;
            }
        });

        caixaLista.appendChild(ItemLista);
    });
}

pesquisaInput.addEventListener("keyup", handleSearch);

function handleSearch(){
    const pesquisa = pesquisaInput.value.toLowerCase();
    let PokemonsFiltrados;

    if(numeroFiltro.checked){
        PokemonsFiltrados = allPokemons.filter((pokemon) => {
            const pokemonId = pokemon.url.split("/")[6];
            return pokemonId.startsWith(pesquisa)
        });
    } else if(nomeFiltro.checked){
        PokemonsFiltrados = allPokemons.filter((pokemon) => 
            pokemon.name.toLowerCase().startsWith(pesquisa)
        );
    } else{
        PokemonsFiltrados = allPokemons
    }

    mostrarPokemon(PokemonsFiltrados);

    if(PokemonsFiltrados.length === 0){
        naoEncontradoMensagem.style.display = "block";
    }else{
        naoEncontradoMensagem.style.display = "none";
    }
}

const fecharBotao = document.querySelector(".icone-pesquisa-fechar");
fecharBotao.addEventListener("click", apagarPesquisa);

function apagarPesquisa() {
    pesquisaInput.value = "";
    mostrarPokemon(allPokemons)
    naoEncontradoMensagem.style.display = "none"
}