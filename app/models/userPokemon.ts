import { AutoIncrement, Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import User from "./user";
import Pokemon from "./pokemon";

@Table({ tableName: "UsersPokemons" })
class UserPokemon extends Model<UserPokemon> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @ForeignKey(() => Pokemon)
  @Column
  pokemonId: number;
}

export default UserPokemon;
