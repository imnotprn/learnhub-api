import { RequestHandler } from "express";
import { IUserHandler } from ".";
import { ICreateUserDto, IUserDto } from "../dto/user.dto";
import { ErrorDto } from "../dto/error.dto";
import { IUserRepository } from "../repositories";
import { hashPassword, verifyPassword } from "../utils/bcrypt";
import { ICreadentialDto, ILoginDto } from "../dto/auth.dto";

import { sign } from "jsonwebtoken";
import { JWT_SECRET } from "../const";
import { AuthStatus } from "../middleware/jwt";

export default class UserHandler implements IUserHandler {
  private repo: IUserRepository;
  constructor(repo: IUserRepository) {
    this.repo = repo;
  }

  public selfcheck: RequestHandler<
    {},
    IUserDto | ErrorDto,
    unknown,
    unknown,
    AuthStatus
  > = async (req, res) => {
    try {
      const { registeredAt, ...others } = await this.repo.findById(
        res.locals.user.id
      );
      return res
        .status(200)
        .json({ ...others, registeredAt: registeredAt.toISOString() })
        .end();
    } catch (error) {
      console.error(error);

      return res.status(500).send({ message: "Internal Server Error" });
    }
  };

  public login: RequestHandler<{}, ICreadentialDto | ErrorDto, ILoginDto> =
    async (req, res) => {
      const { username, password: plainPassword } = req.body;
      try {
        const { password, id } = await this.repo.findByUsername(username);

        if (!verifyPassword(plainPassword, password))
          throw new Error("Invalid username or password");

        const accessToken = sign({ id }, JWT_SECRET, {
          algorithm: "HS512",
          expiresIn: "12h",
          issuer: "learnhub-api",
          subject: "user-credential",
        });

        return res.status(200).json({ accessToken }).end();
      } catch (error) {
        return res
          .status(401)
          .json({ message: "Invalid username or password" });
      }
    };

  public registeration: RequestHandler<
    {},
    IUserDto | ErrorDto,
    ICreateUserDto
  > = async (req, res) => {
    // const name = req.body.name
    // const username = req.body.username
    const { name, username, password: plainPassword } = req.body;

    if (typeof name !== "string" || name.length === 0)
      return res.status(400).json({ message: "name is invalid" });

    if (typeof username !== "string" || username.length === 0)
      return res.status(400).json({ message: "username is invalid" });

    if (typeof plainPassword !== "string" || plainPassword.length === 0)
      return res.status(400).json({ message: "password is invalid" });

    const {
      id: registeredId,
      name: registeredName,
      registeredAt,
      username: registeredUsername,
    } = await this.repo.create({
      name,
      username,
      password: hashPassword(plainPassword),
    });
    return res
      .status(201)
      .json({
        id: registeredId,
        name: registeredName,
        registeredAt: `${registeredAt}`,
        username: registeredUsername,
      })
      .end();

    // const plainPassword = req.body.password;
  };
}
