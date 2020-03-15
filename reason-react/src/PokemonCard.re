[@react.component]
let make = (~pokemon: option(Pokemon.t), ~didChoose, ~deciding) => {
  switch (pokemon) {
  | Some(p) =>
    let text =
      String.capitalize_ascii(Pokemon.getName(p))
      ++ ": "
      ++ (deciding ? "?" : Pokemon.getWeight(p));

    <button
      className="quiz-card"
      onClick={_ =>
        if (deciding) {
          didChoose();
        }
      }>
      <img src={Pokemon.getSpriteUrl(p)} width="96px" height="96px" />
      <span> {React.string(text)} </span>
    </button>;
  | None => <button className="quiz-card" />
  };
};
