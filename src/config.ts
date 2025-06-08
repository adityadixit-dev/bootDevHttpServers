process.loadEnvFile();
import type { MigrationConfig } from "drizzle-orm/migrator";

type Config = {
  api: APIConfig;
  db: DBConfig;
  defaults: DefaultValuesConfig;
};

type DefaultValuesConfig = {
  maxJwtExpiry: number;
  maxRefreshExpiryInSeconds: number;
};

type APIConfig = {
  fileserverHits: number;
  port: number;
  platform: "dev" | "prod";
  jwtSecret: string;
  polkaKey: string;
};

type DBConfig = {
  dbURL: string;
  migrationConfig: MigrationConfig;
};

const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/migrations",
};

export const config: Config = {
  api: {
    fileserverHits: 0,
    port: Number(envOrThrow("PORT")),
    platform: devProdOrThrow("PLATFORM"),
    jwtSecret: envOrThrow("JWT_SECRET"),
    polkaKey: envOrThrow("POLKA_KEY"),
  },
  db: {
    dbURL: envOrThrow("DB_URL"),
    migrationConfig: migrationConfig,
  },
  defaults: {
    maxJwtExpiry: 3600, // 1 hour =  3600 seconds
    maxRefreshExpiryInSeconds: 60 * 24 * 60 * 60,
  },
};

export function incHitsInConfig(): void {
  config.api.fileserverHits++;
}

export function resetHitsInConfig(): void {
  config.api.fileserverHits = 0;
}

export function getHitsInConfig(): number {
  return config.api.fileserverHits;
}

function envOrThrow(key: string): string {
  const val = process.env[key];
  if (!val) {
    throw new Error(`Env Variable ${key} Not Found`);
  }

  return val;
}

function devProdOrThrow(key: string): "dev" | "prod" {
  const val = envOrThrow(key);
  if (val === "dev" || val === "prod") {
    return val;
  }

  throw new Error("PLATFORM must be dev or prod");
}
