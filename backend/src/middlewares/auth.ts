import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../lib/jwt";
import { ACCESS_SECRET } from "../lib/constants";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.sendStatus(403); // Forbidden (no refresh token, redirect to login page)
  }
  
  if (!accessToken) {
    return res.sendStatus(401); // Unauthorized (try refreshing token)
  }

  try {
    const payload = verifyToken(accessToken, ACCESS_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.sendStatus(401);
  }
}
