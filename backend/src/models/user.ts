import { model, Schema } from "mongoose";
import { transformDoc } from "../lib/utils";

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform: transformDoc,
    },
  }
);
export const userModel = model("User", userSchema);
