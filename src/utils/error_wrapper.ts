import { NextFunction, Request, Response } from "express";

type HandlerFunction = (req: Request, res: Response) => Promise<void>;

export function errWrapper(inputFunction: HandlerFunction) {
  async function wrapper(req: Request, res: Response, next: NextFunction) {
    try {
      await inputFunction(req, res);
    } catch (err) {
      next(err);
    }
  }
  return wrapper;
}
