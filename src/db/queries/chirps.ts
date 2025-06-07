import { db } from "../index.js";
import { chirps } from "../schema.js";
import type { NewChirp } from "../schema.js";

export async function createChirp(chirp: NewChirp) {
  console.log(`Body: ${chirp.body}\n${chirp.userId}`);

  try {
    const [result] = await db
      .insert(chirps)
      .values({
        body: chirp.body,
        userId: chirp.userId,
      })
      .returning();
    return result;
  } catch (err) {
    const errMsg = `Error Creating Chirp: ${(err as Error).message}`;
    console.log(errMsg);
    throw new Error(errMsg);
  }
}
