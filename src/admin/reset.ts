import { Request, Response } from "express";
import { resetHitsInConfig } from "../config.js";
import { resetUsers } from "../db/queries/users.js";

export const handlerReset = async (_req: Request, res: Response) => {
  await resetUsers();
  // No need to actually delete all chirps since cascade is set
  resetHitsInConfig();

  res
    .status(200)
    .set({
      "Content-Type": "text/plain; charset=utf-8",
    })
    .send(`Hits reset back to 0`)
    .end();
};
