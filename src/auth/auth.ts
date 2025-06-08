import bcrypt from "bcrypt";
import { Request } from "express";
import { UnauthorizedError } from "../middleware/error_handling.js";
const SALT_ROUNDS = 10;

export async function hashPassword(password: string) {
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    return hashedPassword;
  } catch (err) {
    const errMgs = `Error hashing password: ${(err as Error).message}`;
    console.log(errMgs);
    throw new Error(errMgs);
  }
}

export async function checkPasswordHash(password: string, hash: string): Promise<boolean> {
  const isMatch = await bcrypt.compare(password, hash);
  if (isMatch) return true;
  return false;
  //
}

export function getBearerToken(req: Request): string {
  const authHeader = req.headers?.authorization;

  const tokenString = getTokenFromHeader(authHeader);
  if (!tokenString) {
    throw new UnauthorizedError("Invalid or Missing Token");
  }

  return tokenString;
}

function getTokenFromHeader(authHeader: string | undefined): string {
  if (!authHeader) {
    return "";
  }
  const authSplit = authHeader.split(" ");
  if (authSplit.length !== 2 || authSplit[0].toLowerCase() !== "bearer" || !authSplit[1]) {
    return "";
  }

  return authSplit[1];
}

export function getAPIKey(req: Request): string {
  const authHeader = req.headers?.authorization;

  if (!authHeader) {
    throw new UnauthorizedError("Missing Authorization Headers");
  }

  const authSplit = authHeader.split(" ");
  if (authSplit.length !== 2 || authSplit[0].toLowerCase() !== "apikey" || !authSplit[1]) {
    throw new UnauthorizedError("Invalid Authorization Header format");
  }

  const authApiKey = authSplit[1];

  return authApiKey;
}
