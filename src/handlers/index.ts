import { RequestHandler } from "express";
import { ICreateUserDto, IUserDto } from "../dto/user.dto";
import { ErrorDto } from "../dto/error.dto";
import { ICreadentialDto, ILoginDto } from "../dto/auth.dto";
import { AuthStatus } from "../middleware/jwt";

export interface IUserHandler {
  login: RequestHandler<{}, ICreadentialDto | ErrorDto, ILoginDto>;
  registeration: RequestHandler<{}, IUserDto | ErrorDto, ICreateUserDto>;

  selfcheck: RequestHandler<
    {},
    IUserDto | ErrorDto,
    unknown,
    unknown,
    AuthStatus
  >;
}
