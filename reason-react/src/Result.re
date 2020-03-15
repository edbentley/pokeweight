[@react.component]
let make = (~score, ~retry) => {
  <div className="result">
    <span className="result-score">
      {React.string("Score: " ++ string_of_int(score) ++ "/10")}
    </span>
    <span className="result-score">
      {React.string(
         switch (score) {
         | score when score < 1 => "Shocking!"
         | score when score < 6 => "Better luck next time!"
         | score when score < 8 => "Not bad!"
         | score when score < 10 => "Good job!"
         | _ => "Perfect!"
         },
       )}
    </span>
    <button className="result-retry" onClick=retry>
      {React.string("Retry")}
    </button>
  </div>;
};
