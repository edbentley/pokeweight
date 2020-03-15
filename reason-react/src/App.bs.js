'use strict';

var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");
var Quiz$Pokeweight = require("./Quiz.bs.js");
var Result$Pokeweight = require("./Result.bs.js");

function App(Props) {
  var match = React.useState((function () {
          return 0;
        }));
  var setScore = match[1];
  var match$1 = React.useState((function () {
          return /* Quiz */0;
        }));
  var setGameState = match$1[1];
  if (match$1[0]) {
    return React.createElement(Result$Pokeweight.make, {
                score: match[0],
                retry: (function (param) {
                    Curry._1(setGameState, (function (param) {
                            return /* Quiz */0;
                          }));
                    return Curry._1(setScore, (function (param) {
                                  return 0;
                                }));
                  })
              });
  } else {
    return React.createElement(Quiz$Pokeweight.make, {
                incScore: (function (param) {
                    return Curry._1(setScore, (function (s) {
                                  return s + 1 | 0;
                                }));
                  }),
                gameOver: (function (param) {
                    return Curry._1(setGameState, (function (param) {
                                  return /* Result */1;
                                }));
                  })
              });
  }
}

var make = App;

exports.make = make;
/* react Not a pure module */
