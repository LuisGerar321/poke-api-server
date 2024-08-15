import Joi from "joi";

export const createUserSchema = Joi.object({
  username: Joi.string().required(),
});

export const createPokemonSchema = Joi.object({
  pokemonId: Joi.number().integer().required(),
});
