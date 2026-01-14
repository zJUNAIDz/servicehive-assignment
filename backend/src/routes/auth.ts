import bcrypt from "bcryptjs";
import { Router, type Request, type Response } from "express";
import type { JwtPayload } from "jsonwebtoken";
import { ACCESS_SECRET, REFRESH_SECRET } from "../lib/constants";
import { signAccessToken, signRefreshToken, verifyToken } from "../lib/jwt";
import { requireAuth } from "../middlewares/auth";
import { userModel } from "../models/user";
export const authRouter = Router();

authRouter.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res
        .status(400)
        .json({ message: "Name, email, and password are required" });
      return;
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      res.status(409).json({ message: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      res.status(401).json({ message: "Invalid email" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid password" });
      return;
    }
    const userPayload = { id: user._id, name: user.name, email: user.email };
    const accessToken = signAccessToken(userPayload, ACCESS_SECRET);
    const refreshToken = signRefreshToken(userPayload, REFRESH_SECRET);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

authRouter.post("/refresh", (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(401);

  try {
    const payload = verifyToken(token, REFRESH_SECRET) as { userId: string };
    const newAccessToken = signAccessToken(
      { userId: payload.userId },
      ACCESS_SECRET
    );
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });
    res.json({ message: "Access token refreshed successfully" });
  } catch (err) {
    return res.sendStatus(403);
  }
});
//* FOR TESTING PURPOSE
authRouter.get("/me", requireAuth, async (req: Request, res: Response) => {
  try {
    const user = await userModel.findById((req.user as JwtPayload).id);
    if (!user) return res.sendStatus(404);
    res.json(user);
  } catch (err) {
    return res.sendStatus(403);
  }
});
authRouter.post("/logout", (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully" });
});
