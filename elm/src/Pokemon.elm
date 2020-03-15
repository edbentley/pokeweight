module Pokemon exposing (Pokemon, decoder, equalWeights, weighsMoreThan)

import Json.Decode exposing (Decoder, field, int, map3, string)


type alias Pokemon =
    { name : String
    , weight : Int
    , spriteUrl : String
    }


weighsMoreThan : Pokemon -> Pokemon -> Bool
weighsMoreThan pokemonA pokemonB =
    pokemonA.weight > pokemonB.weight


equalWeights : Pokemon -> Pokemon -> Bool
equalWeights pokemonA pokemonB =
    pokemonA.weight == pokemonB.weight


decoder : Decoder Pokemon
decoder =
    map3 Pokemon
        (field "name" string)
        (field "weight" int)
        (field "sprites" (field "front_default" string))
