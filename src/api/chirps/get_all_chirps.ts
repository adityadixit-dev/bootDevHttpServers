import { Request, Response } from "express";
import { getAllChirps } from "../../db/queries/chirps.js";
import type { SelectChirp } from "../../db/schema.js";
import { respondWithJSON } from "../../utils/json_resp.js";

export async function handlerGetAllChirps(req: Request, res: Response) {
  const results: SelectChirp[] = await getAllChirps();
  if (results) {
    respondWithJSON(res, 200, results);
    return;
  }
  throw new Error("Unable to retrieve Chirps");
}
