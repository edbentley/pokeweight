type t = {
  name: string,
  weight: int,
  spriteUrl: string,
};

let getName = (pokemon: t) => pokemon.name;

let getWeight = (pokemon: t) => string_of_int(pokemon.weight);

let getSpriteUrl = (pokemon: t) => pokemon.spriteUrl;

let weighsGreaterThan = (pokemonA: t, pokemonB: t) =>
  pokemonA.weight > pokemonB.weight;

module Decode = {
  let spriteUrl = sprites =>
    Json.Decode.(sprites |> field("front_default", string));

  let pokemon = json =>
    Json.Decode.{
      name: json |> field("name", string),
      weight: json |> field("weight", int),
      spriteUrl: json |> field("sprites", spriteUrl),
    };
};

let fetchPokemonById = id =>
  Js.Promise.(
    Fetch.fetch("https://pokeapi.co/api/v2/pokemon/" ++ string_of_int(id))
    |> then_(Fetch.Response.json)
    |> then_(json =>
         json |> Decode.pokemon |> (pokemon => Some(pokemon) |> resolve)
       )
    |> catch(_err => resolve(None))
  );

let rec fetch2RandomPokemon = () => {
  let randomIdA = Random.int(150) + 1;
  let randomIdB = Random.int(150) + 1;

  if (randomIdA === randomIdB) {
    fetch2RandomPokemon();
  } else {
    Js.Promise.all2((
      fetchPokemonById(randomIdA),
      fetchPokemonById(randomIdB),
    ))
    |> Js.Promise.then_(((resA, resB)) =>
         switch (resA, resB) {
         | (Some(pokemonA), Some(pokemonB))
             when pokemonA.weight === pokemonB.weight =>
           fetch2RandomPokemon()
         | (Some(pokemonA), Some(pokemonB)) =>
           Js.Promise.resolve(Some((pokemonA, pokemonB)))
         | _ => Js.Promise.resolve(None)
         }
       );
  };
};
