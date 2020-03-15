'use strict';

var React = require("react");

function Result(Props) {
  var score = Props.score;
  var retry = Props.retry;
  return React.createElement("div", {
              className: "result"
            }, React.createElement("span", {
                  className: "result-score"
                }, "Score: " + (String(score) + "/10")), React.createElement("span", {
                  className: "result-score"
                }, score < 1 ? "Shocking!" : (
                    score < 6 ? "Better luck next time!" : (
                        score < 8 ? "Not bad!" : (
                            score < 10 ? "Good job!" : "Perfect!"
                          )
                      )
                  )), React.createElement("button", {
                  className: "result-retry",
                  onClick: retry
                }, "Retry"));
}

var make = Result;

exports.make = make;
/* react Not a pure module */
