import UserPokemon from "../models/userPokemon";
import { ErrorResponse } from "../utils/Errors";
import { isAxiosError } from "axios";
import { PokeApiSDK } from "./pokemonsSdk";
import { IPokemonResponse } from "../interfaces";
import Pokemon from "../models/pokemon";
import User from "../models/user";
import sequelize from "../db";

export const getMyPokemons = async (userId: number): Promise<IPokemonResponse[]> => {
  try {
    const user = await User.findOne({
      where: {
        id: userId,
      },
      include: {
        model: Pokemon,
        as: "pokemons",
      },
    });

    const myPokemonsDetailsPromise = user.pokemons.map((pokemon) => PokeApiSDK.getPokemon(pokemon.pokemonId));
    const myPokemonDetails = (await Promise.allSettled(myPokemonsDetailsPromise))
      .filter((data): data is PromiseFulfilledResult<IPokemonResponse> => data.status === "fulfilled")
      .map((data) => data.value);

    return myPokemonDetails;
  } catch (error) {
    if (!isAxiosError(error))
      throw new ErrorResponse({
        status: 500,
        message: "Internal Server Error",
        data: error,
      });

    throw new ErrorResponse({
      status: error.response?.status ?? 500,
      message: `${error.message}: Pokemon Not found`,
      data: error.stack,
    });
  }
};

export const addMyPokemon = async (pokemonPayload: { pokemonId: number }, userId: number): Promise<UserPokemon> => {
  const t = await sequelize.transaction();
  try {
    if (isNaN(userId) || !pokemonPayload.pokemonId)
      throw new ErrorResponse({
        status: 400,
        message: "Bad Request, ids are not defined or not numbers",
      });

    const user = await User.findOne({
      where: { id: userId },
      include: {
        model: Pokemon,
        as: "pokemons",
      },
      transaction: t,
    });
    if (!user)
      throw new ErrorResponse({
        status: 400,
        message: "User does not exist in the database; Pokémon cannot be attached.",
      });

    if (user?.pokemons?.length > 3)
      throw new ErrorResponse({
        status: 400,
        message: "User reach the max number of pokemons",
      });

    const [pokemon] = await Pokemon.findOrCreate({
      where: { pokemonId: pokemonPayload.pokemonId },
      transaction: t,
    });

    console.log(pokemon.toJSON());
    if (!pokemon)
      throw new ErrorResponse({
        status: 500,
        message: "Error trying to create a new Pokemon record.",
      });

    const [addPokemon] = await UserPokemon.findOrCreate({
      where: { userId: user.id, pokemonId: pokemon.id },
      transaction: t,
    });

    await t.commit();
    return addPokemon;
  } catch (error) {
    await t.rollback();
    if (!isAxiosError(error)) {
      if (error.name === "SequelizeForeignKeyConstraintError") {
        throw new ErrorResponse({
          status: 400,
          message: "Foreign key constraint fails. Please ensure the referenced records exist.",
          data: error,
        });
      }
      throw new ErrorResponse({
        status: 500,
        message: "Internal Server Error",
        data: error,
      });
    }

    throw new ErrorResponse({
      status: error.response?.status ?? 500,
      message: `${error.message}: Pokémon Not found`,
      data: error.stack,
    });
  }
};

export const deleteMyPokemon = async (pokemonIdFromApi: number, userId: number): Promise<void> => {
  const t = await sequelize.transaction();
  try {
    if (isNaN(userId) || isNaN(pokemonIdFromApi)) {
      throw new ErrorResponse({
        status: 400,
        message: "Bad Request, ids are not defined or not numbers",
      });
    }

    const user = await User.findOne({
      where: { id: userId },
      include: {
        model: Pokemon,
        as: "pokemons",
      },
      transaction: t,
    });

    if (!user) {
      throw new ErrorResponse({
        status: 400,
        message: "User does not exist in the database; Pokémon cannot be detached.",
      });
    }

    const pokemon = await Pokemon.findOne({
      where: { pokemonId: pokemonIdFromApi },
      transaction: t,
    });

    if (!pokemon) {
      throw new ErrorResponse({
        status: 404,
        message: "Pokémon not found in the database.",
      });
    }

    const userPokemon = await UserPokemon.findOne({
      where: { userId: user.id, pokemonId: pokemon.id },
      transaction: t,
    });

    if (!userPokemon) {
      throw new ErrorResponse({
        status: 404,
        message: "Relationship not found between user and Pokémon.",
      });
    }

    await userPokemon.destroy({ transaction: t });

    await t.commit();
  } catch (error) {
    await t.rollback();
    if (!isAxiosError(error)) {
      if (error.name === "SequelizeForeignKeyConstraintError") {
        throw new ErrorResponse({
          status: 400,
          message: "Foreign key constraint fails. Please ensure the referenced records exist.",
          data: error,
        });
      }
      throw new ErrorResponse({
        status: 500,
        message: "Internal Server Error",
        data: error,
      });
    }

    throw new ErrorResponse({
      status: error.response?.status ?? 500,
      message: `${error.message}: Pokémon Not found`,
      data: error.stack,
    });
  }
};
