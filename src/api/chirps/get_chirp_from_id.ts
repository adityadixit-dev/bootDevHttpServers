import { Request, Response } from "express";
import { SelectChirp } from "../../db/schema.js";
import { getChirpFromId } from "../../db/queries/chirps.js";
import { respondWithError, respondWithJSON } from "../../utils/json_resp.js";

export async function handlerGetChirpFromId(req: Request, res: Response) {
  const { chirpID } = req.params;

  try {
    const chirp: SelectChirp = await getChirpFromId(chirpID);
    if (chirp) {
      respondWithJSON(res, 200, chirp);
      return;
    } else {
      respondWithError(res, 404, "Chirp not Found. Check id");
    }
  } catch (err) {
    const errMsg = `Error Getting Chirp with ID: ${chirpID}: ${(err as Error).message}`;
    console.log(errMsg);
    throw new Error(errMsg);
  }

  throw new Error("Something went wrong in gettinig chirp by ID");
}
