import jwt from "jsonwebtoken";
import { ACCESS_EXPIRY, REFRESH_EXPIRY } from "./constants";
import type ms from "ms";

export function signAccessToken(
  payload: object,
  secret: string,
  options?: jwt.SignOptions
) {
  return jwt.sign(payload, secret, {
    expiresIn: ACCESS_EXPIRY as ms.StringValue,
    ...options,
  });
}

export function signRefreshToken(
  payload: object,
  secret: string,
  options?: jwt.SignOptions
) {
  return jwt.sign(payload, secret, {
    expiresIn: REFRESH_EXPIRY as ms.StringValue,
    ...options,
  });
}

export function verifyToken(token: string, secret: string) {
  return jwt.verify(token, secret);
}
export function decodeToken(token: string) {
  return jwt.decode(token);
}
