import { NextFunction, Request, Response } from "express";
import { respondWithError } from "../utils/json_resp.js";

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  console.log(`ERROR: ${err.message}`);

  respondWithError(res, 500, "Something went wrong on our end");
}
