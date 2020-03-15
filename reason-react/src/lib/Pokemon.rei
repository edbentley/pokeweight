type t;

let fetch2RandomPokemon: unit => Js.Promise.t(option((t, t)));

let getName: t => string;

let getWeight: t => string;

let getSpriteUrl: t => string;

let weighsGreaterThan: (t, t) => bool;
