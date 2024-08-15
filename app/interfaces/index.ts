import { Request } from "express";

export interface IResponse {
  status: number;
  message: string;
  data?: IPaginationResponse | any;
}

export interface IPaginationResponse {
  page: number;
  pageSize: number;
  totalItems: number;
  items: any[];
}

export interface IPagMapToModel {
  offset: number;
  limit: number;
}

export interface IMetaItem {
  id?: number;
  name?: string;
  url?: string;
  sprites?: IPokemonSprites | string;
}
export interface IPokeApiPagResponse {
  count: number;
  next: string;
  previous: string;
  results: IMetaItem[];
}

export interface IPokemonAbility {
  is_hidden: boolean;
  slot: number;
  ability: IMetaItem;
}

export interface IGameIndex {
  game_index: number;
  version: IMetaItem;
}

export interface IVersionDetails {
  rarity: number;
  version: IMetaItem;
}

export interface IHeldItem {
  item: IMetaItem;
  version_details: IVersionDetails[];
}

export interface IMoveVersionGroupDetail {
  level_learned_at: number;
  version_group: IMetaItem;
  move_learn_method: IMetaItem;
}

export interface IPokemonMove {
  move: IMetaItem;
  version_group_details: IMoveVersionGroupDetail[];
}

export interface ISpriteVersions {
  [key: string]: {
    [key: string]: {
      back_default?: string;
      back_female?: string | null;
      back_shiny?: string;
      back_shiny_female?: string | null;
      front_default?: string;
      front_female?: string | null;
      front_shiny?: string;
      front_shiny_female?: string | null;
    };
  };
}

export interface IPokemonSprites {
  back_default: string;
  back_female: string | null;
  back_shiny: string;
  back_shiny_female: string | null;
  front_default: string;
  front_female: string | null;
  front_shiny: string;
  front_shiny_female: string | null;
  other: {
    dream_world: {
      front_default: string;
      front_female: string | null;
    };
    home: {
      front_default: string;
      front_female: string | null;
      front_shiny: string;
      front_shiny_female: string | null;
    };
    "official-artwork": {
      front_default: string;
      front_shiny: string;
    };
    showdown: {
      back_default: string;
      back_female: string | null;
      back_shiny: string;
      back_shiny_female: string | null;
      front_default: string;
      front_female: string | null;
      front_shiny: string;
      front_shiny_female: string | null;
    };
  };
  versions: ISpriteVersions;
}

export interface IPokemonCries {
  latest: string;
  legacy: string;
}

export interface IPokemonStat {
  base_stat: number;
  effort: number;
  stat: IMetaItem;
}

export interface IPokeTypes extends IMetaItem {
  type?: {
    name: string;
    url: string;
    sprite?: string;
  };
}

export interface IPokemonResponse {
  id?: number;
  name?: string;
  base_experience?: number;
  height?: number;
  is_default?: boolean;
  order?: number;
  weight?: number;
  abilities?: IPokemonAbility[];
  forms?: IMetaItem[];
  game_indices?: IGameIndex[];
  held_items?: IHeldItem[];
  location_area_encounters?: string;
  moves?: IPokemonMove[];
  species?: IMetaItem;
  sprites?: IPokemonSprites;
  cries?: IPokemonCries;
  stats?: IPokemonStat[];
  types?: IPokeTypes[];
}

export interface IUser {
  id: string;
  username: string;
}

export interface ReqWithUser extends Request {
  id: string;
}
