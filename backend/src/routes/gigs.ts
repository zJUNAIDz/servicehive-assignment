import { Router } from "express";
import type { JwtPayload } from "jsonwebtoken";
import { gigModel } from "../models/gig";

export const gigRouter = Router();

gigRouter.post("/", async (req, res) => {
  try {
    const { title, description, budget } = req.body;
    if (!title || !description || !budget) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const user = req.user;
    const newGig = new gigModel({
      title,
      description,
      budget,
      ownerId: (user as JwtPayload).id,
    });
    await newGig.save();
    return res.status(201).json(newGig);
  } catch (err) {
    console.error("Error creating gig:", err);
    return res.status(500).json({ error: "Failed to create gig" });
  }
});

gigRouter.get("/", async (req, res) => {
  try {
    const searchQuery = req.query.search as string | undefined;
    const ownerId = req.query.ownerId as string | undefined;

    const filter: any = {};

    if (ownerId) {
      filter.ownerId = ownerId;
    }

    if (searchQuery) {
      filter.title = { $regex: searchQuery, $options: "i" };
    }

    const gigs = (await gigModel.find(filter)).map((doc) => doc.toJSON());
    console.log("Fetched gigs:", gigs);
    return res.json(gigs);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch gigs" });
  }
});
