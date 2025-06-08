import { describe, it, expect, beforeAll } from "vitest";
import { makeJWT, validateJWT } from "./jwt";
import { UnauthorizedError } from "../middleware/error_handling";

describe("Checking JWTs", () => {
  const userID = "dixi";
  const expiresIn = 100;
  const secret = "arsenal";
  let token: string;

  beforeAll(() => {
    token = makeJWT(userID, expiresIn, secret);
  });

  it("Should return userID for valid token", () => {
    const decodedUserId = validateJWT(token, secret);
    expect(decodedUserId).toBe(userID);
  });

  it("Should throw Unauthorized Error for invalid token string", () => {
    expect(() => validateJWT("Gibberish", secret)).toThrow(UnauthorizedError);
  });

  it("Should throw error if secret is wrong", () => {
    expect(() => validateJWT(token, "wrongsecret")).toThrow(UnauthorizedError);
  });
});
