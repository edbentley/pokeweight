type gameState =
  | Quiz
  | Result;

[@react.component]
let make = () => {
  let (score, setScore) = React.useState(() => 0);
  let (gameState, setGameState) = React.useState(() => Quiz);

  switch (gameState) {
  | Quiz =>
    <Quiz
      incScore={_ => setScore(s => s + 1)}
      gameOver={_ => setGameState(_ => Result)}
    />
  | Result =>
    <Result
      score
      retry={_ => {
        setGameState(_ => Quiz);
        setScore(_ => 0);
      }}
    />
  };
};
