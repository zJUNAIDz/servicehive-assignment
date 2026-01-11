import express from "express";
import helmet from "helmet";
import cookieparser from "cookie-parser";

export const app = express();
app.use(express.json());
app.use(cookieparser());
app.use(helmet());
