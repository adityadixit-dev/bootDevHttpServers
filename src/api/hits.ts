import { Request, Response } from "express";
import { getHitsInConfig } from "../config.js";

export const handlerHits = async (_req: Request, res: Response) => {
  res
    .status(200)
    .set({
      "Content-Type": "text/plain; charset=utf-8",
    })
    .send(`Hits: ${getHitsInConfig()}`)
    .end();
};
