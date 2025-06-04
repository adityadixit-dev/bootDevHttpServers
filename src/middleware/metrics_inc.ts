import { NextFunction, Request, Response } from "express";
import { incHitsInConfig } from "../config.js";

export function middlewareMetricsInc(_req: Request, _res: Response, next: NextFunction) {
  incHitsInConfig();
  next();
}
