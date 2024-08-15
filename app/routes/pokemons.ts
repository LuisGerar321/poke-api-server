import { Router } from "express";
import PokemonController from "../controllers/pokemons";
import { validateSchema, validateToken } from "../middlewares";
import { createPokemonSchema } from "../validators";

const Pokemon = Router();

Pokemon.delete("/self/:pokemonId", validateToken, PokemonController.handleReleasePokemon);
Pokemon.get("/self", validateToken, PokemonController.handleMyPokemon);
Pokemon.post("/self", validateToken, validateSchema(createPokemonSchema), PokemonController.handleCapturePokemon);
Pokemon.get("/:pokemon", PokemonController.handleGetPokemon);
Pokemon.get("/", PokemonController.handleGetPokemons);

export default Pokemon;
