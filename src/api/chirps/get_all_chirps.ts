import { Request, Response } from "express";
import { getAllChirps } from "../../db/queries/chirps.js";
import type { SelectChirp } from "../../db/schema.js";
import { respondWithJSON } from "../../utils/json_resp.js";

export async function handlerGetAllChirps(req: Request, res: Response) {
  let authorId = "";
  let sortAsc = true;
  const authorIdQuery = req.query.authorId;
  if (typeof authorIdQuery === "string") {
    authorId = authorIdQuery;
  }
  const sortAscQuery = req.query.sort;
  if (sortAscQuery === "desc") {
    sortAsc = false;
  }

  const results: SelectChirp[] = await getAllChirps(authorId, sortAsc);
  if (results) {
    respondWithJSON(res, 200, results);
    return;
  }
  throw new Error("Unable to retrieve Chirps");
}
