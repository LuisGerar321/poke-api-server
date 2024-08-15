import { Request, Response } from "express";
import { ErrorResponse } from "../utils/Errors";
import { IPokemonResponse, ReqWithUser } from "../interfaces";
import { PokeApiSDK } from "../services/pokemonsSdk";
import { addMyPokemon, getMyPokemons, deleteMyPokemon } from "../services/pokemon";

export default class PokemonsController {
  public static async handleGetPokemons(req: Request, res: Response) {
    try {
      const { page, pagesize } = req.query;
      const pokemons: IPokemonResponse[] = await PokeApiSDK.getPokemons(Number(page), Number(pagesize));
      res.status(200).send({
        status: 200,
        message: "Pokemons Found",
        data: pokemons,
      });
    } catch (error) {
      if (error instanceof ErrorResponse) return res.status(error?.status).send(error);
      if (error instanceof Error) return res.status(500).send(new ErrorResponse({ status: 500, message: error.message, data: error }));
    }
  }

  public static async handleGetPokemon(req: Request, res: Response) {
    try {
      const { pokemon } = req.params;
      const pokemonRes: any = await PokeApiSDK.getPokemon(pokemon);
      res.status(200).send({
        status: 200,
        message: "Pokemons Found",
        data: pokemonRes,
      });
    } catch (error) {
      if (error instanceof ErrorResponse) return res.status(error?.status).send(error);
      if (error instanceof Error) return res.status(500).send(new ErrorResponse({ status: 500, message: error.message, data: error }));
    }
  }

  public static async handleMyPokemon(req: ReqWithUser, res: Response) {
    try {
      const userId = req.id;
      const pokemonRes: IPokemonResponse[] = await getMyPokemons(Number(userId));
      res.status(200).send({
        status: 200,
        message: "Pokemons Found",
        data: pokemonRes,
      });
    } catch (error) {
      if (error instanceof ErrorResponse) return res.status(error?.status).send(error);
      if (error instanceof Error) return res.status(500).send(new ErrorResponse({ status: 500, message: error.message, data: error }));
    }
  }

  public static async handleCapturePokemon(req: ReqWithUser, res: Response) {
    try {
      const pokemon: { pokemonId: number } = req.body;
      const userId = req.id;
      const pokemonRes: any = await addMyPokemon(pokemon, Number(userId));
      res.status(200).send({
        status: 200,
        message: "Pokemon Captured Successfully",
        data: pokemonRes,
      });
    } catch (error) {
      if (error instanceof ErrorResponse) return res.status(error?.status).send(error);
      if (error instanceof Error) return res.status(500).send(new ErrorResponse({ status: 500, message: error.message, data: error }));
    }
  }

  public static async handleReleasePokemon(req: ReqWithUser, res: Response) {
    try {
      const { pokemonId } = req.params;
      const userId = req.id;
      await deleteMyPokemon(Number(pokemonId), Number(userId));
      res.status(200).send({
        status: 200,
        message: "Pokemon Released Successfully",
      });
    } catch (error) {
      if (error instanceof ErrorResponse) return res.status(error?.status).send(error);
      if (error instanceof Error) return res.status(500).send(new ErrorResponse({ status: 500, message: error.message, data: error }));
    }
  }
}
