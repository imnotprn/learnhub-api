import { User } from "@prisma/client";
import { ICreateUserDto, IUserDto } from "../dto/user.dto";
import { ICreadentialDto } from "../dto/auth.dto";

export interface IUser {
  id: string;
  username: string;
  name: string;
  registeredAt: Date;
}

// export interface IUserExtended
// extends Pick<User, "id" | "name" | "username" | "registeredAt"> {
// }

export interface IUserRepository {
  findByUsername(username: string): Promise<User>;
  create(user: ICreateUserDto): Promise<IUser>;
  findById(id: string): Promise<IUser>;
}
