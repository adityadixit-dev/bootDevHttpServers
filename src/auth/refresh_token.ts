import { randomBytes } from "crypto";

export function makeRefreshToken() {
  const buf = randomBytes(32); // 32 Bytes or 256 bits of random data.
  const bufInStr = buf.toString("hex");

  return bufInStr;
}
