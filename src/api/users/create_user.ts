import { Request, Response } from "express";
import type { NewUser } from "../../db/schema.js";
import { BadRequestError } from "../../middleware/error_handling.js";
import { respondWithJSON } from "../../utils/json_resp.js";
import { createUser } from "../../db/queries/users.js";

type CreateUserParams = {
  email: string;
};

export async function handlerCreateUser(req: Request, res: Response) {
  const createUserParams: CreateUserParams = req.body;
  if (isInvalidCreateUserRequest(createUserParams)) {
    throw new BadRequestError("Please check input values");
  }

  const user: NewUser = {
    email: createUserParams.email,
  };

  try {
    const result = await createUser(user);
    // TODO: Check is result is actually of type user
    respondWithJSON(res, 201, result);
  } catch (err) {
    const errMesg = `Error creating New user: ${(err as Error).message}`;
    console.log(errMesg);
    throw new Error(errMesg);
  }
}

function isInvalidCreateUserRequest(requestInput: CreateUserParams) {
  if (!requestInput.email) {
    return true;
  }

  // TODO: Also check if email is valid

  return false;
}
