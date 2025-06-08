import { Request, Response } from "express";
import { BadRequestError, UnauthorizedError } from "../../middleware/error_handling.js";
import { createChirp } from "../../db/queries/chirps.js";
import { respondWithJSON } from "../../utils/json_resp.js";
import { getBearerToken } from "../../auth/auth.js";
import { validateJWT } from "../../auth/jwt.js";
import { config } from "../../config.js";

const MAX_CHIRP_LENGTH = 140;

type ChirpRequest = {
  body: string;
};

export async function handlerCreateChirp(req: Request, res: Response) {
  let userID: string;

  try {
    const bearerToken = getBearerToken(req);
    userID = validateJWT(bearerToken, config.api.jwtSecret);
  } catch (err) {
    throw new UnauthorizedError("Invalid or missing Token");
  }

  const chirpRequest: ChirpRequest = req.body;
  if (!isChirpRequestValid(chirpRequest)) {
    throw new BadRequestError("Incomplete or Invalid Request");
  }

  if (isChirpTooLong(chirpRequest.body)) {
    throw new BadRequestError(`Chirp is too long. Max length is ${MAX_CHIRP_LENGTH}`);
  }

  const cleanedBody: string = cleanInputBody(chirpRequest.body);

  // TODO: Write a check to see if userID is valid

  const result = await createChirp({
    body: cleanedBody,
    userId: userID,
  });

  if (result) {
    // console.log(result);
    respondWithJSON(res, 201, result);
    return;
  }
  throw new Error("Unable to create Chirp");
}

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

function isChirpRequestValid(chirpRequest: ChirpRequest) {
  if (!chirpRequest.body) {
    return false;
  }
  return true;
}

function isChirpTooLong(chirpBody: string) {
  if (chirpBody.length > MAX_CHIRP_LENGTH) {
    return true;
  }
  return false;
}
