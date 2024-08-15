import { AutoIncrement, BelongsToMany, Column, Model, PrimaryKey, Table } from "sequelize-typescript";
import Pokemon from "./pokemon";
import UserPokemon from "./userPokemon";

@Table({ tableName: "Users" })
class User extends Model<User> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  username: string;

  @BelongsToMany(() => Pokemon, () => UserPokemon)
  pokemons: Pokemon[];
}

export default User;
