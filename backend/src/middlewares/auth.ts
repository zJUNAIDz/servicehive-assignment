import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../lib/jwt";
import { ACCESS_SECRET } from "../lib/constants";

//* NOTE: 403 when no refresh token (redirect to login), 401 when trying to refresh token
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    console.log("No refresh token");
    return res.sendStatus(403); // Forbidden (no refresh token, redirect to login page)
  }

  if (!accessToken) {
    console.log("No access token");
    return res.sendStatus(401); // Unauthorized (try refreshing token)
  }

  try {
    const payload = verifyToken(accessToken, ACCESS_SECRET);
    console.log({ payload });
    req.user = payload;
    next();
  } catch (err) {
    console.log("Invalid access token");
    return res.sendStatus(401);
  }
}
