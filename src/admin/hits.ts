import { Request, Response } from "express";
import { getHitsInConfig } from "../config.js";

export const handlerHits = async (_req: Request, res: Response) => {
  res
    .status(200)
    .set({
      "Content-Type": "text/html; charset=utf-8",
    })
    .send(
      `
<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${getHitsInConfig()} times!</p>
  </body>
</html>
`,
    )
    .end();
};
