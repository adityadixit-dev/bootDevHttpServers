import bcrypt from "bcrypt";
import { resolve } from "path";
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
