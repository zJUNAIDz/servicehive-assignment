// title, description, budget, ownerId, status (open or assigned).

import { model, Schema } from "mongoose";
const gigSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  budget: {
    type: Number,
    required: true,
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["open", "assigned"],
    default: "open",
  },
});

export const gigModel = model("Gig", gigSchema);
