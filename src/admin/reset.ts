import { Request, Response } from "express";
import { config, resetHitsInConfig } from "../config.js";

export const handlerReset = async (_req: Request, res: Response) => {
  resetHitsInConfig();
  res
    .status(200)
    .set({
      "Content-Type": "text/plain; charset=utf-8",
    })
    .send(`Hits reset back to 0`)
    .end();
};
