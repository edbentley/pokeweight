module Main exposing (Model, Msg(..), init, main, update, view)

import Browser
import Html exposing (Html, button, div, img, span, text)
import Html.Attributes exposing (class)
import Html.Events exposing (onClick)
import Http
import Pokemon
import Random



-- MAIN


main : Program () Model Msg
main =
    Browser.document
        { init = init
        , update = update
        , view = view
        , subscriptions = subscriptions
        }



-- MODEL


type alias Model =
    { score : Int
    , view : View
    }


type View
    = Quiz QuizModel
    | Result


type alias QuizModel =
    { round : Int
    , quizAnswerState : QuizAnswerState
    , pokemon : LoadPokemonState
    }


type QuizAnswerState
    = Waiting
    | Correct
    | Fail


type LoadPokemonState
    = Loading
    | Error
    | PartialLoaded Pokemon.Pokemon
    | Loaded Pokemon.Pokemon Pokemon.Pokemon


init : () -> ( Model, Cmd Msg )
init _ =
    ( { score = 0
      , view =
            Quiz
                { round = 1
                , quizAnswerState = Waiting
                , pokemon = Loading
                }
      }
    , get2RandomPokemonIds
    )



-- UPDATE


type Msg
    = ChoseCard LeftRight
    | NextRound
    | Retry
    | RandomPokemonIds ( Int, Int )
    | GotPokemon LeftRight (Result Http.Error Pokemon.Pokemon)


type LeftRight
    = Left
    | Right


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case model.view of
        Quiz quizModel ->
            let
                ( newView, newScore, cmd ) =
                    updateQuiz msg quizModel model.score
            in
            ( { model | score = newScore, view = newView }, cmd )

        Result ->
            case msg of
                Retry ->
                    init ()

                _ ->
                    ( model, Cmd.none )


updateQuiz : Msg -> QuizModel -> Int -> ( View, Int, Cmd Msg )
updateQuiz msg model score =
    case model.pokemon of
        Loading ->
            case msg of
                RandomPokemonIds ( id1, id2 ) ->
                    if id1 == id2 then
                        ( Quiz model, score, get2RandomPokemonIds )

                    else
                        ( Quiz model, score, get2PokemonById id1 id2 )

                GotPokemon _ pokemonResult ->
                    ( Quiz
                        { model
                            | pokemon =
                                case pokemonResult of
                                    Ok pokemon ->
                                        PartialLoaded pokemon

                                    Err _ ->
                                        Error
                        }
                    , score
                    , Cmd.none
                    )

                _ ->
                    ( Quiz model, score, Cmd.none )

        Error ->
            ( Quiz model, score, Cmd.none )

        PartialLoaded firstLoadedPokemon ->
            case msg of
                GotPokemon side pokemonResult ->
                    case pokemonResult of
                        Ok pokemon ->
                            -- Refetch if the same weight
                            if Pokemon.equalWeights firstLoadedPokemon pokemon then
                                ( Quiz { model | pokemon = Loading }
                                , score
                                , get2RandomPokemonIds
                                )

                            else
                                ( Quiz
                                    { model
                                        | pokemon =
                                            if side == Left then
                                                Loaded pokemon firstLoadedPokemon

                                            else
                                                Loaded firstLoadedPokemon pokemon
                                    }
                                , score
                                , Cmd.none
                                )

                        Err _ ->
                            ( Quiz { model | pokemon = Error }, score, Cmd.none )

                _ ->
                    ( Quiz model, score, Cmd.none )

        Loaded pokemonA pokemonB ->
            case msg of
                ChoseCard side ->
                    if isAnswerCorrect side pokemonA pokemonB then
                        ( Quiz { model | quizAnswerState = Correct }
                        , score + 1
                        , Cmd.none
                        )

                    else
                        ( Quiz { model | quizAnswerState = Fail }, score, Cmd.none )

                NextRound ->
                    if model.round == 10 then
                        ( Result
                        , score
                        , Cmd.none
                        )

                    else
                        ( Quiz
                            { model
                                | quizAnswerState = Waiting
                                , round = model.round + 1
                                , pokemon = Loading
                            }
                        , score
                        , get2RandomPokemonIds
                        )

                RandomPokemonIds _ ->
                    ( Quiz model, score, Cmd.none )

                GotPokemon _ _ ->
                    ( Quiz model, score, Cmd.none )

                Retry ->
                    ( Quiz model, score, Cmd.none )


isAnswerCorrect : LeftRight -> Pokemon.Pokemon -> Pokemon.Pokemon -> Bool
isAnswerCorrect side pokemonA pokemonB =
    if side == Left && Pokemon.weighsMoreThan pokemonA pokemonB then
        True

    else if side == Right && Pokemon.weighsMoreThan pokemonB pokemonA then
        True

    else
        False



-- HTTP


getPokemonById : Int -> LeftRight -> Cmd Msg
getPokemonById id side =
    Http.get
        { url = "https://pokeapi.co/api/v2/pokemon/" ++ String.fromInt id
        , expect = Http.expectJson (GotPokemon side) Pokemon.decoder
        }


get2PokemonById : Int -> Int -> Cmd Msg
get2PokemonById id1 id2 =
    Cmd.batch [ getPokemonById id1 Left, getPokemonById id2 Right ]


get2RandomPokemonIds : Cmd Msg
get2RandomPokemonIds =
    Random.generate RandomPokemonIds (Random.pair pokemonId pokemonId)


pokemonId : Random.Generator Int
pokemonId =
    Random.int 1 150



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none



-- VIEW


view : Model -> Browser.Document Msg
view model =
    { title = "Pokeweight"
    , body =
        [ div [ class "main" ]
            [ case model.view of
                Quiz quizState ->
                    quizView quizState

                Result ->
                    resultView model.score
            ]
        ]
    }


quizView : QuizModel -> Html Msg
quizView model =
    let
        deciding =
            model.quizAnswerState == Waiting
    in
    let
        emptyQuizCards =
            div [ class "flex quiz-cards" ]
                [ button [ class "quiz-card" ] []
                , button [ class "quiz-card" ] []
                ]
    in
    div [ class "quiz" ]
        (case model.pokemon of
            Loading ->
                [ emptyQuizCards, span [] [ text "Loading" ] ]

            PartialLoaded _ ->
                [ emptyQuizCards, span [] [ text "Loading" ] ]

            Error ->
                [ emptyQuizCards, span [] [ text "Error loading pokemon" ] ]

            Loaded pokemonA pokemonB ->
                [ div [ class "flex quiz-cards" ]
                    [ quizCard pokemonA deciding (ChoseCard Left)
                    , quizCard pokemonB deciding (ChoseCard Right)
                    ]
                , case model.quizAnswerState of
                    Waiting ->
                        span [] [ text "Which Pokemon weighs more?" ]

                    Correct ->
                        span [ class "weight600 green" ] [ text "Correct!" ]

                    Fail ->
                        span [ class "weight600 red" ] [ text "Wrong!" ]
                , if deciding then
                    text ""

                  else
                    button [ onClick NextRound ] [ text "Next →" ]
                ]
        )


quizCard : Pokemon.Pokemon -> Bool -> Msg -> Html Msg
quizCard pokemon deciding handleClick =
    let
        name =
            capitaliseString pokemon.name
                ++ ": "
                ++ (if deciding then
                        "?"

                    else
                        String.fromInt pokemon.weight
                   )
    in
    button [ class "quiz-card", onClick handleClick ]
        [ img
            [ Html.Attributes.width 96
            , Html.Attributes.height 96
            , Html.Attributes.src pokemon.spriteUrl
            ]
            []
        , span [] [ text name ]
        ]


capitaliseString : String -> String
capitaliseString str =
    str
        |> String.uncons
        |> Maybe.map (Tuple.mapFirst Char.toLocaleUpper)
        |> Maybe.map stringTupleCons
        |> Maybe.withDefault str


stringTupleCons : ( Char, String ) -> String
stringTupleCons ( c, str ) =
    String.cons c str


resultView : Int -> Html Msg
resultView score =
    div [ class "result" ]
        [ span [ class "result-score" ] [ text ("Score: " ++ String.fromInt score ++ "/10") ]
        , span [ class "result-score" ]
            [ text
                (if score < 1 then
                    "Shocking!"

                 else if score < 6 then
                    "Better luck next time!"

                 else if score < 8 then
                    "Not bad!"

                 else if score < 10 then
                    "Good job!"

                 else
                    "Perfect!"
                )
            ]
        , button [ class "result-retry", onClick Retry ] [ text "Retry" ]
        ]
