import { Request, Response } from "express";
import { respondWithError, respondWithJSON } from "../utils/json_resp.js";

type Parameters = { body: string };

export const handlerValidateChirp = async (req: Request, res: Response) => {
  const params: Parameters = req.body;

  if (isBodyUndefined(params, res)) {
    return;
  }

  if (isChirpTooLong(params)) {
    throw new Error("Chirp is too long");
  }

  const cleanedBody: string = cleanInputBody(params.body);

  respondWithJSON(res, 200, { cleanedBody: cleanedBody });
};

function cleanInputBody(bodyStr: string) {
  //.
  const badWords = ["kerfuffle", "sharbert", "fornax"];
  const bleeperWord = "****";
  const wordsInBody = bodyStr.split(" ");
  const cleanedMessage: string[] = [];

  for (const word of wordsInBody) {
    if (badWords.includes(word.toLowerCase())) {
      cleanedMessage.push(bleeperWord);
    } else {
      cleanedMessage.push(word);
    }
  }

  return cleanedMessage.join(" ");
}

function isChirpTooLong(params: Parameters) {
  const maxChirpLength = 140;
  if (params.body.length > maxChirpLength) {
    // respondWithError(res, 400, "Chirp is too long");
    return true;
  }
  return false;
}

function isBodyUndefined(params: Parameters, res: Response) {
  if (!params.body || typeof params.body !== "string") {
    respondWithError(res, 400, "Invalid Request body missing or body type is wrong");
    return true;
  }
  return false;
}
