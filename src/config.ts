process.loadEnvFile();
import type { MigrationConfig } from "drizzle-orm/migrator";

type Config = {
  api: APIConfig;
  db: DBConfig;
};

type APIConfig = {
  fileserverHits: number;
  port: number;
  platform: "dev" | "prod";
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
  },
  db: {
    dbURL: envOrThrow("DB_URL"),
    migrationConfig: migrationConfig,
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
