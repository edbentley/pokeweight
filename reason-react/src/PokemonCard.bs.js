'use strict';

var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");
var $$String = require("bs-platform/lib/js/string.js");
var Caml_option = require("bs-platform/lib/js/caml_option.js");
var Pokemon$Pokeweight = require("./lib/Pokemon.bs.js");

function PokemonCard(Props) {
  var pokemon = Props.pokemon;
  var didChoose = Props.didChoose;
  var deciding = Props.deciding;
  if (pokemon !== undefined) {
    var p = Caml_option.valFromOption(pokemon);
    var text = $$String.capitalize_ascii(Pokemon$Pokeweight.getName(p)) + (": " + (
        deciding ? "?" : Pokemon$Pokeweight.getWeight(p)
      ));
    return React.createElement("button", {
                className: "quiz-card",
                onClick: (function (param) {
                    if (deciding) {
                      return Curry._1(didChoose, /* () */0);
                    } else {
                      return 0;
                    }
                  })
              }, React.createElement("img", {
                    height: "96px",
                    src: Pokemon$Pokeweight.getSpriteUrl(p),
                    width: "96px"
                  }), React.createElement("span", undefined, text));
  } else {
    return React.createElement("button", {
                className: "quiz-card"
              });
  }
}

var make = PokemonCard;

exports.make = make;
/* react Not a pure module */
