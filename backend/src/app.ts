import express from "express";
import helmet from "helmet";
import cookieparser from "cookie-parser";
import { gigRouter } from "./routes/gigs";
import { authRouter } from "./routes/auth";
import { bidRouter } from "./routes/bids";

export const app = express();
app.use(express.json());
app.use(cookieparser());
app.use(helmet());

app.use("/auth", authRouter);
app.use("/gigs", gigRouter);
app.use("/bids", bidRouter);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});
