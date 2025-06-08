import jwt, { JwtPayload } from "jsonwebtoken";
import { UnauthorizedError } from "../middleware/error_handling.js";

type Payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

const TOKEN_ISSUER = "chirpy";

export function makeJWT(userID: string, expiresIn: number, secret: string): string {
  const currTimeInSecs = Date.now() / 1000;

  const payload: Payload = {
    iss: TOKEN_ISSUER,
    sub: userID,
    iat: currTimeInSecs,
    exp: currTimeInSecs + expiresIn,
  };

  const token = jwt.sign(payload, secret, { algorithm: "HS256" });
  return token;
}

export function validateJWT(tokenString: string, secret: string): string {
  let decodedPayload: Payload;

  try {
    decodedPayload = jwt.verify(tokenString, secret) as JwtPayload;
  } catch (err) {
    throw new UnauthorizedError("Invalid Token");
  }

  if (decodedPayload.iss !== TOKEN_ISSUER) {
    throw new UnauthorizedError("Invalid Issuer");
  }
  if (!decodedPayload.sub) {
    throw new UnauthorizedError("No user ID in Token");
  }

  return decodedPayload.sub;
}
