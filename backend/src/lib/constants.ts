import dotenv from "dotenv";
dotenv.config();
function getEnv(key: string, fallback: string) {
  return process.env[key] ?? fallback;
}

export const PORT = getEnv("PORT", "3000")
export const ACCESS_SECRET = getEnv("ACCESS_SECRET", "default");
export const REFRESH_SECRET = getEnv("REFRESH_SECRET", "default");