import jwt from "jsonwebtoken";

export function signAccessToken(
  payload: object,
  secret: string,
  options?: jwt.SignOptions
) {
  return jwt.sign(payload, secret, { expiresIn: "15m", ...options });
}

export function signRefreshToken(
  payload: object,
  secret: string,
  options?: jwt.SignOptions
) {
  return jwt.sign(payload, secret, { expiresIn: "7d", ...options });
}

export function verifyToken(token: string, secret: string) {
  return jwt.verify(token, secret);
}
export function decodeToken(token: string) {
  return jwt.decode(token);
}

