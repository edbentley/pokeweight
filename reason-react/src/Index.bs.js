'use strict';

var React = require("react");
var Random = require("bs-platform/lib/js/random.js");
var ReactDOMRe = require("reason-react/src/ReactDOMRe.js");
var App$Pokeweight = require("./App.bs.js");

Random.init(Date.now() | 0);

ReactDOMRe.renderToElementWithId(React.createElement(App$Pokeweight.make, { }), "main");

/*  Not a pure module */
