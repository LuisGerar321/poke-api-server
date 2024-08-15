import { AutoIncrement, BelongsToMany, Column, Model, PrimaryKey, Table } from "sequelize-typescript";
import User from "./user";
import UserPokemon from "./userPokemon";

@Table({ tableName: "Pokemons" })
class Pokemon extends Model<Pokemon> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  pokemonId: number;

  @BelongsToMany(() => User, () => UserPokemon)
  user: User[];
}

export default Pokemon;
