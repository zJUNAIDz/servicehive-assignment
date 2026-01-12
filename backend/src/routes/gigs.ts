import { Router } from "express";
import { gigModel } from "../models/gig";

export const gigRouter = Router();

gigRouter.post("/", (req, res) => {
  const { title, description, budget, ownerId, status } = req.body;
  if (!title || !description || !budget || !ownerId) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const newGig = new gigModel({
    title,
    description,
    budget,
    ownerId,
  });
  newGig
    .save()
    .then((gig) => res.status(201).json(gig))
    .catch((err) => res.status(500).json({ error: "Failed to create gig" }));
});

gigRouter.get("/", async (req, res) => {
  const searchQuery = req.query.search as string | undefined;
  if (!searchQuery) {
    const gigs = await gigModel.find();
    if (gigs.length === 0) {
      return res.status(404).json({ error: "No gigs found" });
    }
    return res.json(gigs);
  }
  const gigs = await gigModel.find({
    $or: [
      { title: { $regex: searchQuery, $options: "i" } },
      { description: { $regex: searchQuery, $options: "i" } },
    ],
  });
  if (gigs.length === 0) {
    return res.status(404).json({ error: "No gigs found" });
  }
  return res.json(gigs);
});
