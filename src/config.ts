type APIConfig = {
  fileserverHits: number;
};

export const config: APIConfig = {
  fileserverHits: 0,
};

export function incHitsInConfig(): void {
  config.fileserverHits++;
}

export function getHitsInConfig(): number {
  return config.fileserverHits;
}
