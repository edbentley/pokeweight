type loadState =
  | Loading
  | Error
  | Loaded(Pokemon.t, Pokemon.t);

type answerState =
  | Waiting
  | Correct
  | Fail;

[@react.component]
let make = (~incScore, ~gameOver) => {
  let (round, setRound) = React.useState(() => 1);
  let (answerState, setAnswerState) = React.useState(() => Waiting);

  let (pokemon, setPokemon) = React.useState(() => Loading);

  React.useEffect1(
    () => {
      Pokemon.fetch2RandomPokemon()
      |> Js.Promise.then_(res =>
           switch (res) {
           | Some((pokemonA, pokemonB)) =>
             setPokemon(_ => Loaded(pokemonA, pokemonB));
             Js.Promise.resolve();
           | None =>
             setPokemon(_ => Error);
             Js.Promise.resolve();
           }
         )
      |> ignore;
      None;
    },
    [|round|],
  );

  let nextButton =
    <button
      onClick={_ =>
        if (round === 10) {
          gameOver();
        } else {
          setPokemon(_ => Loading);
          setAnswerState(_ => Waiting);
          setRound(r => r + 1);
        }
      }>
      {React.string({js|Next →|js})}
    </button>;

  <div className="quiz">
    <div className="flex quiz-cards">
      <PokemonCard
        pokemon={
          switch (pokemon) {
          | Loaded(pokemonA, _) => Some(pokemonA)
          | _ => None
          }
        }
        deciding={answerState === Waiting}
        didChoose={_ =>
          switch (pokemon) {
          | Loaded(pokemonA, pokemonB) =>
            if (Pokemon.weighsGreaterThan(pokemonA, pokemonB)) {
              setAnswerState(_ => Correct);
              incScore();
            } else {
              setAnswerState(_ => Fail);
            }
          | _ => ()
          }
        }
      />
      <PokemonCard
        pokemon={
          switch (pokemon) {
          | Loaded(_, pokemonB) => Some(pokemonB)
          | _ => None
          }
        }
        deciding={answerState === Waiting}
        didChoose={_ =>
          switch (pokemon) {
          | Loaded(pokemonA, pokemonB) =>
            if (Pokemon.weighsGreaterThan(pokemonB, pokemonA)) {
              setAnswerState(_ => Correct);
              incScore();
            } else {
              setAnswerState(_ => Fail);
            }
          | _ => ()
          }
        }
      />
    </div>
    {switch (pokemon, answerState) {
     | (Loading, _) => <span> {React.string("Loading")} </span>
     | (Error, _) => <span> {React.string("Error loading pokemon")} </span>
     | (_, Waiting) =>
       <span> {React.string("Which Pokemon weighs more?")} </span>
     | (_, Correct) =>
       <React.Fragment>
         <span className="weight600 green"> {React.string("Correct!")} </span>
         nextButton
       </React.Fragment>
     | (_, Fail) =>
       <React.Fragment>
         <span className="weight600 red"> {React.string("Wrong!")} </span>
         nextButton
       </React.Fragment>
     }}
  </div>;
};
