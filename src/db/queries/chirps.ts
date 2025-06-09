import { db } from "../index.js";
import { chirps } from "../schema.js";
import type { NewChirp, SelectChirp } from "../schema.js";
import { config } from "../../config.js";
import { ForbiddenError } from "../../middleware/error_handling.js";
import { desc, eq } from "drizzle-orm";

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

export async function getChirpFromId(chirpID: string) {
  const [result] = await db.select().from(chirps).where(eq(chirps.id, chirpID));
  return result;
}

export async function deleteChirpWithId(chirpId: string) {
  const [result] = await db.delete(chirps).where(eq(chirps.id, chirpId)).returning();
  return result;
}

export async function getAllChirps(authorId = "", sortAsc = true) {
  try {
    if (authorId === "") {
      const results = await db
        .select()
        .from(chirps)
        .orderBy(sortAsc ? chirps.createdAt : desc(chirps.createdAt));
      return results;
    } else {
      const results = await db
        .select()
        .from(chirps)
        .where(eq(chirps.userId, authorId))
        .orderBy(sortAsc ? chirps.createdAt : desc(chirps.createdAt));
      return results;
    }
  } catch (err) {
    const errMsg = `Error Getting All Chirps: ${(err as Error).message}`;
    console.log(errMsg);
    throw new Error(errMsg);
  }
}

export async function resetAllChirps() {
  if (config.api.platform === "dev") {
    await db.delete(chirps);
  } else {
    throw new ForbiddenError("Unable to reset outside of Dev Env");
  }
}
