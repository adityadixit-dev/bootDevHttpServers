import { Request, Response } from "express";
import { getBearerToken } from "../../auth/auth.js";
import { validateJWT } from "../../auth/jwt.js";
import { config } from "../../config.js";
import { deleteChirpWithId, getChirpFromId } from "../../db/queries/chirps.js";
import { ForbiddenError, NotFoundError } from "../../middleware/error_handling.js";

export async function handlerDeleteChirpWithId(req: Request, res: Response) {
  const bearerToken = getBearerToken(req);
  const userId = validateJWT(bearerToken, config.api.jwtSecret);
  const { chirpID } = req.params;
  const chirp = await getChirpFromId(chirpID);

  if (userId !== chirp.userId) {
    throw new ForbiddenError("Forbeeeedun");
  }

  const result = await deleteChirpWithId(chirpID);
  if (!result) {
    throw new NotFoundError("Chirp Not Found");
  }
  res.status(204).end();
}
