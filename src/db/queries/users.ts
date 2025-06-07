import { config } from "../../config.js";
import { ForbiddenError } from "../../middleware/error_handling.js";
import { db } from "../index.js";
import { users } from "../schema.js";
import type { NewUser } from "../schema.js";

export async function createUser(user: NewUser) {
  const [result] = await db.insert(users).values(user).onConflictDoNothing().returning();

  if (!result) {
    // TODO: - insert does nothing on a onConflictDoNothing
    //  probably means user already exists. get that user and return it if needed.
  }

  return result;
}

export async function resetUsers() {
  if (config.api.platform === "dev") {
    await db.delete(users);
  } else {
    throw new ForbiddenError("Reset is only allowed in Dev Environment");
  }
}
