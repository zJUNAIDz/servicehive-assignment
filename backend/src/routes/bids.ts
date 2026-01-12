import { Router } from "express";
import mongoose from "mongoose";
import { bidModel } from "../models/bid";
import { gigModel } from "../models/gig";
import { userModel } from "../models/user";

export const bidRouter = Router();

bidRouter.post("/", async (req, res) => {
  const { gigId, freelancerId, message, status } = req.body;
  try {
    // check if the bid already exist
    const existingBid = await bidModel.findOne({ gigId, freelancerId });
    if (existingBid) {
      return res.status(400).json({
        message: "Bid already exists for this gig by the freelancer.",
      });
    }

    const newBid = new bidModel({
      gigId,
      freelancerId,
      message,
      status,
    });
    await newBid.save();
    res.status(201).json(newBid);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
});

bidRouter.get("/:gigId", async (req, res) => {
  const { gigId } = req.params;
  try {
    const user = await userModel.findById(req.query.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    const gig = await gigModel.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: "Gig not found." });
    }
    // check if gig belongs to user
    if (gig.ownerId.toString() !== user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to view these bids." });
    }
    const bids = await bidModel.find({ gigId });
    if (bids.length === 0) {
      return res.status(404).json({ message: "No bids found for this gig." });
    }
    res.status(200).json(bids);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
});

bidRouter.patch("/:bidId/hire", async (req, res) => {
  const { bidId } = req.params;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const bid = await bidModel
      .findOne({ _id: bidId, status: "pending" })
      .session(session);
    if (!bid) {
      await session.abortTransaction();
      return res
        .status(404)
        .json({ message: "Bid not found in pending status." });
    }

    const gig = await gigModel
      .findOne({ _id: bid.gigId, status: "open" })
      .session(session);
    if (!gig) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Gig not found in open status." });
    }

    // update the gig status to assigned
    gig.status = "assigned";
    await gig.save({ session });
    // update the bid status to hired
    bid.status = "hired";
    await bid.save({ session });

    // reject all other bids for the same gig
    await bidModel
      .updateMany(
        { gigId: bid.gigId, _id: { $ne: bidId } },
        { status: "rejected" }
      )
      .session(session);

    await session.commitTransaction();
    res.status(200).json(bid);
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ message: "Internal server error", error });
  } finally {
    session.endSession();
  }
});
