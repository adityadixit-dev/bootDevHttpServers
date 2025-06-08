import { and, eq, gt, isNull } from "drizzle-orm";
import { makeRefreshToken } from "../../auth/refresh_token.js";
import { config } from "../../config.js";
import { UnauthorizedError } from "../../middleware/error_handling.js";
import { db } from "../index.js";
import { refreshTokens } from "../schema.js";

export async function createRefreshTokenFromUserId(userId: string) {
  const newRefreshToken = makeRefreshToken();
  const expiryInMilliSeconds = config.defaults.maxRefreshExpiryInSeconds * 1000;
  const expiresAt = new Date(Date.now() + expiryInMilliSeconds);
  try {
    const [result] = await db
      .insert(refreshTokens)
      .values({
        token: newRefreshToken,
        userId: userId,
        expiresAt: expiresAt,
        revokedAt: null,
      })
      .returning();
    return result;
  } catch (err) {
    console.log((err as Error).message);
    throw new UnauthorizedError("Unable to authorize user");
  }
}

export async function getUserIdFromRefreshToken(inputToken: string): Promise<string> {
  const [result] = await db
    .select()
    .from(refreshTokens)
    .where(
      and(
        eq(refreshTokens.token, inputToken),
        gt(refreshTokens.expiresAt, new Date()),
        isNull(refreshTokens.revokedAt),
      ),
    );
  return result.userId ?? "";
}
