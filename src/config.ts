import fs from "node:fs";

export type PhraseConfig = { phrase: string; severity: number };
export type UserConfig = { threshold?: number; phrases?: PhraseConfig[] };

export function loadConfig(path?: string): UserConfig {
  if (!path) return {};
  const raw = fs.readFileSync(path, "utf8");
  return JSON.parse(raw);
}
