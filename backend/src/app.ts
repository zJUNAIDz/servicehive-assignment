import cookieparser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { CLIENT_URL } from "./lib/constants";
import { requireAuth } from "./middlewares/auth";
import { authRouter } from "./routes/auth";
import { bidRouter } from "./routes/bids";
import { gigRouter } from "./routes/gigs";
export const app = express();
app.use(express.json());
app.use(cookieparser());
app.use(helmet());
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

app.use("/auth", authRouter);
app.use(requireAuth);
app.use("/gigs", gigRouter);
app.use("/bids", bidRouter);

app.get("/", (req, res) => {
  res.send("Hello, Friend!");
});
