import { Request, Response } from "express";
import { respondWithError, respondWithJSON } from "../utils/json_resp.js";

export const handlerValidateChirp = async (req: Request, res: Response) => {
  type parameters = { body: string };

  try {
    const params: parameters = req.body;
    const maxChirpLength = 140;
    if (params.body.length > maxChirpLength) {
      respondWithError(res, 400, "Chirp is too long");
      return;
    }

    respondWithJSON(res, 200, { valid: true });
  } catch (e) {
    respondWithError(res, 400, "Invalid JSON");
    return;
  }
};
