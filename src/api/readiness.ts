import { Request, Response } from "express";

export const handlerReadiness = async (_req: Request, res: Response) => {
  res
    .status(200)
    .set({
      "Content-Type": "text/plain; charset=utf-8",
    })
    .send("OK")
    .end();
};
