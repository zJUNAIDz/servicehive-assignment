import { JwtPayload } from "jsonwebtoken";
type UserJWT = { id: string; email: string; name: string };
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & UserJWT;
    }
  }
}
