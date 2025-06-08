import { Request, Response } from "express";
import type { NewUser } from "../../db/schema.js";
import { BadRequestError } from "../../middleware/error_handling.js";
import { respondWithJSON } from "../../utils/json_resp.js";
import { createUser } from "../../db/queries/users.js";
import { hashPassword } from "../../auth/auth.js";

type CreateUserParams = {
  email: string;
  password: string;
};

export async function handlerCreateUser(req: Request, res: Response) {
  const createUserParams: CreateUserParams = req.body;
  if (isInvalidCreateUserRequest(createUserParams)) {
    throw new BadRequestError("Please check input values");
  }

  const hashedPassword = await hashPassword(createUserParams.password);

  const user: NewUser = {
    email: createUserParams.email,
    hashedPassword: hashedPassword,
  };

  try {
    const result = await createUser(user);
    // TODO: Check is result is actually of type user
    respondWithJSON(res, 201, {
      id: result.id,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
      email: result.email,
      isChirpyRed: result.isChirpyRed,
    });
  } catch (err) {
    const errMesg = `Error creating New user: ${(err as Error).message}`;
    console.log(errMesg);
    throw new Error(errMesg);
  }
}

function isInvalidCreateUserRequest(requestInput: CreateUserParams) {
  if (!requestInput.email || !requestInput.password) {
    return true;
  }

  // TODO: Also check if email is valid email address

  return false;
}
