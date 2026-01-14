//  gigId, freelancerId, message, status (pending, hired, rejected).
import { model, Schema } from "mongoose";
import { transformDoc } from "../lib/utils";

const bidSchema = new Schema(
  {
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
  },
  {
    toJSON: {
      transform: transformDoc,
    },
  }
);

export const bidModel = model("Bid", bidSchema);
