import { Request, Response } from "express";
import { getBearerToken } from "../../auth/auth.js";
import { getUserIdFromRefreshToken, revokeRefreshToken } from "../../db/queries/refresh_tokens.js";
import { BadRequestError, UnauthorizedError } from "../../middleware/error_handling.js";
import { makeJWT } from "../../auth/jwt.js";
import { config } from "../../config.js";
import { respondWithJSON } from "../../utils/json_resp.js";

export async function handlerRevoke(req: Request, res: Response) {
  const bearerToken = getBearerToken(req);

  if (req.body) {
    throw new BadRequestError("Does not accept a request body");
  }

  const result = await revokeRefreshToken(bearerToken);

  if (result) {
    res.status(204).end();
    return;
  }

  throw new UnauthorizedError("Unable to revoke token");
}
