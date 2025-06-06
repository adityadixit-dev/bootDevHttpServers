import { Request, Response } from "express";
import { respondWithError, respondWithJSON } from "../utils/json_resp.js";
import { BadRequestError } from "../middleware/error_handling.js";

type Parameters = { body: string };

const MAX_CHIRP_LENGTH = 140;

export const handlerValidateChirp = async (req: Request, res: Response) => {
  const params: Parameters = req.body;

  if (isBodyUndefined(params)) {
    throw new BadRequestError("Body of the message is not valid");
  }

  if (isChirpTooLong(params)) {
    throw new BadRequestError(`Chirp is too long. Max length is ${MAX_CHIRP_LENGTH}`);
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
  if (params.body.length > MAX_CHIRP_LENGTH) {
    // respondWithError(res, 400, "Chirp is too long");
    return true;
  }
  return false;
}

function isBodyUndefined(params: Parameters) {
  if (!params.body || typeof params.body !== "string") {
    return true;
  }
  return false;
}
