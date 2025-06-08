import { describe, it, expect, beforeAll } from "vitest";
import { hashPassword, checkPasswordHash, getBearerToken } from "./auth";
import { Request } from "express";
import { UnauthorizedError } from "../middleware/error_handling";

describe("Check Password Hashing", () => {
  const password1 = "correctPassword";
  const password2 = "wrongPassword";
  let hash1: string;
  let hash2: string;

  beforeAll(async () => {
    hash1 = await hashPassword(password1);
    hash2 = await hashPassword(password2);
  });

  it("Should return true for correct Password", async () => {
    const result = await checkPasswordHash(password1, hash1);
    expect(result).toBe(true);
  });

  it("Should return false for incorrect Password", async () => {
    const result = await checkPasswordHash("blahblah", hash1);
    expect(result).toBe(false);
  });

  it("Should return false for incorrect hash", async () => {
    const result = await checkPasswordHash(password1, hash2);
    expect(result).toBe(false);
  });
});

describe("Check Retrieval of Token from Request Headers", () => {
  const req = {
    headers: {
      authorization: "Bearer SomeRandomTokenString",
    },
  } as Request;

  const badReq = {} as Request;

  it("Should return token - SomeRandomTokenString", () => {
    const resultToken = getBearerToken(req);
    expect(resultToken).toBe("SomeRandomTokenString");
  });

  it("Should throw an Unauthorized error", () => {
    expect(() => getBearerToken(badReq)).toThrow(UnauthorizedError);
  });
});
