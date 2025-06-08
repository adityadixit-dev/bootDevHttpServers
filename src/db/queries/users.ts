import { eq } from "drizzle-orm";
import { config } from "../../config.js";
import { ForbiddenError } from "../../middleware/error_handling.js";
import { db } from "../index.js";
import { users } from "../schema.js";
import type { NewUser, SelectUser } from "../schema.js";

type UserResponse = Omit<SelectUser, "hashedPassword">;

export async function createUser(user: NewUser) {
  const [result] = await db.insert(users).values(user).onConflictDoNothing().returning({
    id: users.id,
    createdAt: users.createdAt,
    updatedAt: users.updatedAt,
    email: users.email,
  });

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

export async function getHashedPwdFromEmail(email: string) {
  const [result] = await db
    .select({
      hashedPassword: users.hashedPassword,
    })
    .from(users)
    .where(eq(users.email, email));
  return result.hashedPassword;
}

export async function getUserFromEmail(email: string) {
  const [result] = await db.select().from(users).where(eq(users.email, email));
  return result;
}
