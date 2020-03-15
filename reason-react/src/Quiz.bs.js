'use strict';

var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");
var Caml_option = require("bs-platform/lib/js/caml_option.js");
var Pokemon$Pokeweight = require("./lib/Pokemon.bs.js");
var PokemonCard$Pokeweight = require("./PokemonCard.bs.js");

function Quiz(Props) {
  var incScore = Props.incScore;
  var gameOver = Props.gameOver;
  var match = React.useState((function () {
          return 1;
        }));
  var setRound = match[1];
  var round = match[0];
  var match$1 = React.useState((function () {
          return /* Waiting */0;
        }));
  var setAnswerState = match$1[1];
  var answerState = match$1[0];
  var match$2 = React.useState((function () {
          return /* Loading */0;
        }));
  var setPokemon = match$2[1];
  var pokemon = match$2[0];
  React.useEffect((function () {
          Pokemon$Pokeweight.fetch2RandomPokemon(/* () */0).then((function (res) {
                  if (res !== undefined) {
                    var match = res;
                    var pokemonB = match[1];
                    var pokemonA = match[0];
                    Curry._1(setPokemon, (function (param) {
                            return /* Loaded */[
                                    pokemonA,
                                    pokemonB
                                  ];
                          }));
                    return Promise.resolve(/* () */0);
                  } else {
                    Curry._1(setPokemon, (function (param) {
                            return /* Error */1;
                          }));
                    return Promise.resolve(/* () */0);
                  }
                }));
          return ;
        }), /* array */[round]);
  var nextButton = React.createElement("button", {
        onClick: (function (param) {
            if (round === 10) {
              return Curry._1(gameOver, /* () */0);
            } else {
              Curry._1(setPokemon, (function (param) {
                      return /* Loading */0;
                    }));
              Curry._1(setAnswerState, (function (param) {
                      return /* Waiting */0;
                    }));
              return Curry._1(setRound, (function (r) {
                            return r + 1 | 0;
                          }));
            }
          })
      }, "Next →");
  var tmp;
  if (typeof pokemon === "number") {
    tmp = pokemon !== 0 ? React.createElement("span", undefined, "Error loading pokemon") : React.createElement("span", undefined, "Loading");
  } else {
    switch (answerState) {
      case /* Waiting */0 :
          tmp = React.createElement("span", undefined, "Which Pokemon weighs more?");
          break;
      case /* Correct */1 :
          tmp = React.createElement(React.Fragment, {
                children: null
              }, React.createElement("span", {
                    className: "weight600 green"
                  }, "Correct!"), nextButton);
          break;
      case /* Fail */2 :
          tmp = React.createElement(React.Fragment, {
                children: null
              }, React.createElement("span", {
                    className: "weight600 red"
                  }, "Wrong!"), nextButton);
          break;
      
    }
  }
  return React.createElement("div", {
              className: "quiz"
            }, React.createElement("div", {
                  className: "flex quiz-cards"
                }, React.createElement(PokemonCard$Pokeweight.make, {
                      pokemon: typeof pokemon === "number" ? undefined : Caml_option.some(pokemon[0]),
                      didChoose: (function (param) {
                          if (typeof pokemon === "number") {
                            return /* () */0;
                          } else if (Pokemon$Pokeweight.weighsGreaterThan(pokemon[0], pokemon[1])) {
                            Curry._1(setAnswerState, (function (param) {
                                    return /* Correct */1;
                                  }));
                            return Curry._1(incScore, /* () */0);
                          } else {
                            return Curry._1(setAnswerState, (function (param) {
                                          return /* Fail */2;
                                        }));
                          }
                        }),
                      deciding: answerState === /* Waiting */0
                    }), React.createElement(PokemonCard$Pokeweight.make, {
                      pokemon: typeof pokemon === "number" ? undefined : Caml_option.some(pokemon[1]),
                      didChoose: (function (param) {
                          if (typeof pokemon === "number") {
                            return /* () */0;
                          } else if (Pokemon$Pokeweight.weighsGreaterThan(pokemon[1], pokemon[0])) {
                            Curry._1(setAnswerState, (function (param) {
                                    return /* Correct */1;
                                  }));
                            return Curry._1(incScore, /* () */0);
                          } else {
                            return Curry._1(setAnswerState, (function (param) {
                                          return /* Fail */2;
                                        }));
                          }
                        }),
                      deciding: answerState === /* Waiting */0
                    })), tmp);
}

var make = Quiz;

exports.make = make;
/* react Not a pure module */
