import { Request, Response } from "express";
import { upgradeUserToChirpyRed } from "../../db/queries/users.js";
import { NotFoundError, UnauthorizedError } from "../../middleware/error_handling.js";
import { getAPIKey } from "../../auth/auth.js";
import { config } from "../../config.js";

type InputWebHookParams = {
  event: string;
  data: {
    userId: string;
  };
};

export async function handlerUpgradeToChirpyRed(req: Request, res: Response) {
  const apiKey = getAPIKey(req);

  if (apiKey !== config.api.polkaKey) {
    throw new UnauthorizedError("Invalid API Key");
  }

  const webhook = req.body as InputWebHookParams;

  if (webhook.event !== "user.upgraded") {
    res.status(204).end();
    return;
  }

  const result = await upgradeUserToChirpyRed(webhook.data.userId);
  if (result) {
    res.status(204).end();
    return;
  }

  throw new NotFoundError("User not found");
}
