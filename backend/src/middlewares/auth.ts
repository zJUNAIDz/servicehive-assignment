import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../lib/jwt";
import { ACCESS_SECRET } from "../lib/constants";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const payload = verifyToken(token, ACCESS_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.sendStatus(401);
  }
}
