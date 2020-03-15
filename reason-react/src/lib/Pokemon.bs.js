'use strict';

var Random = require("bs-platform/lib/js/random.js");
var Json_decode = require("@glennsl/bs-json/src/Json_decode.bs.js");

function getName(pokemon) {
  return pokemon[/* name */0];
}

function getWeight(pokemon) {
  return String(pokemon[/* weight */1]);
}

function getSpriteUrl(pokemon) {
  return pokemon[/* spriteUrl */2];
}

function weighsGreaterThan(pokemonA, pokemonB) {
  return pokemonA[/* weight */1] > pokemonB[/* weight */1];
}

function spriteUrl(sprites) {
  return Json_decode.field("front_default", Json_decode.string, sprites);
}

function pokemon(json) {
  return /* record */[
          /* name */Json_decode.field("name", Json_decode.string, json),
          /* weight */Json_decode.field("weight", Json_decode.$$int, json),
          /* spriteUrl */Json_decode.field("sprites", spriteUrl, json)
        ];
}

function fetchPokemonById(id) {
  return fetch("https://pokeapi.co/api/v2/pokemon/" + String(id)).then((function (prim) {
                    return prim.json();
                  })).then((function (json) {
                  var pokemon$1 = pokemon(json);
                  return Promise.resolve(pokemon$1);
                })).catch((function (_err) {
                return Promise.resolve(undefined);
              }));
}

function fetch2RandomPokemon(_param) {
  while(true) {
    var randomIdA = Random.$$int(150) + 1 | 0;
    var randomIdB = Random.$$int(150) + 1 | 0;
    if (randomIdA === randomIdB) {
      _param = /* () */0;
      continue ;
    } else {
      return Promise.all(/* tuple */[
                    fetchPokemonById(randomIdA),
                    fetchPokemonById(randomIdB)
                  ]).then((function (param) {
                    var resB = param[1];
                    var resA = param[0];
                    if (resA !== undefined && resB !== undefined) {
                      var pokemonB = resB;
                      var pokemonA = resA;
                      if (pokemonA[/* weight */1] === pokemonB[/* weight */1]) {
                        return fetch2RandomPokemon(/* () */0);
                      } else {
                        return Promise.resolve(/* tuple */[
                                    pokemonA,
                                    pokemonB
                                  ]);
                      }
                    } else {
                      return Promise.resolve(undefined);
                    }
                  }));
    }
  };
}

exports.fetch2RandomPokemon = fetch2RandomPokemon;
exports.getName = getName;
exports.getWeight = getWeight;
exports.getSpriteUrl = getSpriteUrl;
exports.weighsGreaterThan = weighsGreaterThan;
/* No side effect */
