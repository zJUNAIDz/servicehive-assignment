import dotenv from "dotenv";
dotenv.config();
function getEnv(key: string, fallback: string) {
  return process.env[key] ?? fallback;
}

export const PORT = getEnv("PORT", "3000");
export const JWT_ACCESS_SECRET = getEnv("ACCESS_SECRET", "default");
export const JWT_REFRESH_SECRET = getEnv("REFRESH_SECRET", "default");
export const CLIENT_URL = getEnv("CLIENT_URL", "http://localhost:5173");

export const MONGO_URI = getEnv("MONGO_URI", "mongodb://localhost:27017/assignments");
export const ACCESS_EXPIRY = getEnv("ACCESS_TOKEN_EXP", "15m");
export const REFRESH_EXPIRY = getEnv("REFRESH_TOKEN_EXP", "7d");