import { Request, Response } from "express";
import { BadRequestError, UnauthorizedError } from "../../middleware/error_handling.js";
import { getHashedPwdFromEmail, getUserFromEmail } from "../../db/queries/users.js";
import { checkPasswordHash } from "../../auth/auth.js";
import { respondWithJSON } from "../../utils/json_resp.js";

type LoginUserParams = {
  email: string;
  password: string;
};

export async function handlerLoginUser(req: Request, res: Response) {
  //
  const loginUserParams: LoginUserParams = req.body;
  if (!isValidLoginUserParams(loginUserParams)) {
    throw new BadRequestError("Invalid login parameters");
  }

  const user = await getUserFromEmail(loginUserParams.email);
  if (!user) {
    throw new UnauthorizedError("Incorrect Email or Password");
  }

  const hashedPwdInDb = user.hashedPassword;
  const isMatch = await checkPasswordHash(loginUserParams.password, hashedPwdInDb);
  if (!isMatch) {
    throw new UnauthorizedError("Incorrect Email or Password");
  }

  respondWithJSON(res, 200, {
    id: user.id,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    email: user.email,
  });
}

function isValidLoginUserParams(loginParams: LoginUserParams) {
  if (!loginParams.email || !loginParams.password) {
    return false;
  }
  return true;
}
