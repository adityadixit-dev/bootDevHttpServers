import express from "express";

import { middlewareLogResponses } from "./middleware/log_responses.js";
import { middlewareMetricsInc } from "./middleware/metrics_inc.js";

import { handlerReadiness } from "./api/readiness.js";
import { handlerHits } from "./admin/hits.js";
import { handlerReset } from "./admin/reset.js";
import { handlerValidateChirp } from "./api/validate_chirp.js";
import { errorHandler } from "./middleware/error_handling.js";
import { errWrapper } from "./utils/error_wrapper.js";

const app = express();
const PORT = 8080;

app.use(middlewareLogResponses);
app.use(express.json());

app.use("/app", middlewareMetricsInc);
app.use("/app", express.static("./src/app"));

app.get("/api/healthz", errWrapper(handlerReadiness));
app.post("/api/validate_chirp", errWrapper(handlerValidateChirp));

app.get("/admin/metrics", errWrapper(handlerHits));
app.post("/admin/reset", errWrapper(handlerReset));

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
