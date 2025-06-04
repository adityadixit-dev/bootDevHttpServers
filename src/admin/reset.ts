import { Request, Response } from "express";
import { config } from "../config.js";

export const handlerReset = async (_req: Request, res: Response) => {
  config.fileserverHits = 0;
  res
    .status(200)
    .set({
      "Content-Type": "text/plain; charset=utf-8",
    })
    .send(`Hits reset back to 0`)
    .end();
};
