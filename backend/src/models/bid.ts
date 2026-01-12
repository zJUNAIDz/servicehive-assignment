//  gigId, freelancerId, message, status (pending, hired, rejected).
import { model, Schema } from "mongoose";

const bidSchema = new Schema({
  gigId: {
    type: Schema.Types.ObjectId,
    ref: "Gig",
    required: true,
  },
  freelancerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "hired", "rejected"],
    default: "pending",
  },
});

export const bidModel = model("Bid", bidSchema);
