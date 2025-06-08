import { Request, Response } from "express";
import { getBearerToken } from "../../auth/auth.js";
import { getUserIdFromRefreshToken } from "../../db/queries/refresh_tokens.js";
import { UnauthorizedError } from "../../middleware/error_handling.js";
import { makeJWT } from "../../auth/jwt.js";
import { config } from "../../config.js";
import { respondWithJSON } from "../../utils/json_resp.js";

export async function handlerRefresh(req: Request, res: Response) {
  //
  const bearerToken = getBearerToken(req);
  const userId = await getUserIdFromRefreshToken(bearerToken);
  if (!userId) {
    throw new UnauthorizedError("Invalid or Expired Token");
  }

  const newAccessToken = makeJWT(userId, config.defaults.maxJwtExpiry, config.api.jwtSecret);
  respondWithJSON(res, 200, {
    token: newAccessToken,
  });
}
