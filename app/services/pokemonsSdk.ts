import axiosClient from "../utils/axiosClient";
import { pagMapToModel } from "../utils/pagination";
import { ErrorResponse } from "../utils/Errors";
import { IMetaItem, IPokeApiPagResponse, IPokemonResponse, IPokemonSprites, IPokeTypes } from "../interfaces";
import { AxiosResponse, isAxiosError } from "axios";

export class PokeApiSDK {
  private static baseUrl = "https://pokeapi.co/api/v2/";
  /**
   * Method to fetch Pokémon data with pagination.
   * @param page The page number to retrieve. Defaults to `1` if not provided.
   * @param pageSize The number of Pokémon per page. Defaults to `20` if not provided.
   * @returns A promise that resolves to an `IPokeApiPagResponse` object containing the list of Pokémon and pagination metadata.
   *
   * @throws ErrorResponse If there is an issue retrieving the Pokémon data, an `ErrorResponse` is thrown with a status code of `500` and an error message.
   */
  public static async getPokemons(page: number, pageSize: number): Promise<Partial<IPokemonResponse[]>> {
    try {
      const { offset, limit } = pagMapToModel(isNaN(page) ? 1 : page, isNaN(pageSize) ? 20 : pageSize > 100 ? 100 : pageSize);
      const pokemonsApiRes: AxiosResponse<IPokeApiPagResponse> = await axiosClient.get<IPokeApiPagResponse>(`${PokeApiSDK.baseUrl}pokemon${offset || limit ? `?offset=${offset}&limit=${limit}` : ""}`);

      const pokemonsApiDetailsPromise = pokemonsApiRes?.data?.results?.map((pokeMeta) => axiosClient.get<IPokemonResponse>(pokeMeta.url));

      const types: IMetaItem[] = await this.getTypes();
      console.log(types);

      const pokemonsApiDetails: any[] = (await Promise.allSettled(pokemonsApiDetailsPromise))
        .filter((pokemonApiDetails) => pokemonApiDetails.status === "fulfilled")
        .map((data) => {
          const pokemon = data.value.data;

          return {
            id: pokemon.id,
            name: pokemon.name,
            weight: pokemon.weight,
            height: pokemon.height,
            types: pokemon.types.map((type: IPokeTypes) => types.find((t) => t.name === type.type.name)),
            sprites: pokemon.sprites,
          };
        });

      return pokemonsApiDetails;
    } catch (error) {
      console.error("Error al obtener Pokémon:", error);
      throw new ErrorResponse({
        status: 500,
        message: "Internal Server Error",
        data: error,
      });
    }
  }

  public static async getTypes(): Promise<IMetaItem[]> {
    try {
      const typesResponse: AxiosResponse<IPokeApiPagResponse> = await axiosClient.get<IPokeApiPagResponse>(`${PokeApiSDK.baseUrl}type`);
      const typesData: IMetaItem[] = typesResponse.data.results;
      const typesDetailsUrl: string[] = typesData.map((typeData) => typeData.url);
      console.log(typesDetailsUrl);
      const typesDetailsResPromises: Promise<IMetaItem>[] = typesDetailsUrl.map((typeDetailUrl) =>
        axiosClient
          .get<IMetaItem>(typeDetailUrl)
          .then((res: AxiosResponse<IMetaItem>) => ({ id: res.data.id, name: res.data.name, sprites: this.getFirstValidIcon(res.data.sprites as IPokemonSprites) })),
      );
      const typesDetailsRes: IMetaItem[] = (await Promise.allSettled(typesDetailsResPromises))
        .filter((typesDetailRes: PromiseSettledResult<IMetaItem>) => typesDetailRes.status === "fulfilled")
        .map((typesDetailRes: PromiseFulfilledResult<IMetaItem>) => typesDetailRes.value);

      return typesDetailsRes;
    } catch (error) {
      console.warn("getTypes was broken retriving this error: ");
      console.error(error);
      throw error;
    }
  }

  public static async getPokemon(pokemon): Promise<IPokemonResponse> {
    try {
      const types: IMetaItem[] = await this.getTypes();
      const pokemonsRes: AxiosResponse<IPokemonResponse> = await axiosClient.get<IPokemonResponse>(`${PokeApiSDK.baseUrl}pokemon/${pokemon}`);
      const pokemonDetail = pokemonsRes.data;

      return {
        id: pokemonDetail.id,
        name: pokemonDetail.name,
        weight: pokemonDetail.weight,
        height: pokemonDetail.height,
        types: pokemonDetail.types.map((type: IPokeTypes) => types.find((t) => t.name === type.type.name)),
        sprites: pokemonDetail.sprites,
      };
    } catch (error) {
      console.error("Error al obtener Pokémon:", error);

      if (!isAxiosError(error))
        throw new ErrorResponse({
          status: 500,
          message: "Internal Server Error",
          data: error,
        });

      throw new ErrorResponse({
        status: error.response.status,
        message: `${error.message}: Pokemon Not found`,
        data: error.stack,
      });
    }
  }
  public static getFirstValidIcon(sprites: IPokemonSprites): string {
    return Object.values(sprites) // Get the values of the generations.
      .flatMap((generation) => Object.values(generation)) // Flatten the games within each generation.
      .map((game: any) => game.name_icon as string) // Map each game to get its 'name_icon'.
      .find((icon) => icon !== null); // Find the first 'name_icon' that is not 'null'.
  }
}
