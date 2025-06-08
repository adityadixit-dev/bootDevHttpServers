import express from "express";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";

import { middlewareLogResponses } from "./middleware/log_responses.js";
import { middlewareMetricsInc } from "./middleware/metrics_inc.js";
import { errorHandler } from "./middleware/error_handling.js";

import { handlerHits } from "./admin/hits.js";
import { handlerReset } from "./admin/reset.js";

import { handlerReadiness } from "./api/readiness.js";

import { errWrapper } from "./utils/error_wrapper.js";

import { config } from "./config.js";
import { handlerCreateUser } from "./api/users/create_user.js";
import { handlerCreateChirp } from "./api/chirps/create_chirp.js";
import { handlerGetAllChirps } from "./api/chirps/get_all_chirps.js";
import { handlerGetChirpFromId } from "./api/chirps/get_chirp_from_id.js";
import { handlerLoginUser } from "./api/users/login_user.js";
import { handlerRefresh } from "./api/tokens/refresh.js";
import { handlerRevoke } from "./api/tokens/revoke.js";
import { handlerUpdateUser } from "./api/users/update_user.js";
import { handlerDeleteChirpWithId } from "./api/chirps/delete_chirp.js";
import { handlerUpgradeToChirpyRed } from "./api/users/upgrade_to_chirpy_red.js";

const migrationClient = postgres(config.db.dbURL, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

const app = express();

app.use(middlewareLogResponses);
app.use(express.json());

app.use("/app", middlewareMetricsInc);
app.use("/app", express.static("./src/app"));

app.get("/api/healthz", errWrapper(handlerReadiness));
app.post("/api/users", errWrapper(handlerCreateUser));
app.post("/api/chirps", errWrapper(handlerCreateChirp));
app.get("/api/chirps", errWrapper(handlerGetAllChirps));
app.get("/api/chirps/:chirpID", errWrapper(handlerGetChirpFromId));
app.delete("/api/chirps/:chirpID", errWrapper(handlerDeleteChirpWithId));

app.post("/api/login", errWrapper(handlerLoginUser));
app.post("/api/refresh", errWrapper(handlerRefresh));
app.post("/api/revoke", errWrapper(handlerRevoke));
app.put("/api/users", errWrapper(handlerUpdateUser));
app.post("/api/polka/webhooks", errWrapper(handlerUpgradeToChirpyRed));

app.get("/admin/metrics", errWrapper(handlerHits));
app.post("/admin/reset", errWrapper(handlerReset));

app.use(errorHandler);

const PORT = config.api.port;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
