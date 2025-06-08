import { Request, Response } from "express";
import { getBearerToken, hashPassword } from "../../auth/auth.js";
import { validateJWT } from "../../auth/jwt.js";
import { config } from "../../config.js";
import { BadRequestError, UnauthorizedError } from "../../middleware/error_handling.js";
import { updateUser } from "../../db/queries/users.js";
import { respondWithJSON } from "../../utils/json_resp.js";

export async function handlerUpdateUser(req: Request, res: Response) {
  const newEmail = req.body?.email;
  const newPassword = req.body?.password;
  if (!newEmail || !newPassword) {
    throw new BadRequestError("Missing Fields");
  }

  try {
    const currentAccessToken = getBearerToken(req);
    const userId = validateJWT(currentAccessToken, config.api.jwtSecret);
    const pwdHash = await hashPassword(newPassword);
    const result = await updateUser(userId, newEmail, pwdHash);
    if (result) {
      respondWithJSON(res, 200, {
        id: result.id,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
        email: result.email,
        isChirpyRed: result.isChirpyRed,
      });
      return;
    }
  } catch (err) {
    throw new UnauthorizedError("Invalid Token");
  }

  throw new UnauthorizedError("Unable to update User");
}
