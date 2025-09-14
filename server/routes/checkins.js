import express from "express";
import auth from "../middleware/authMiddleware.js";
import Checkin from "../models/Checkin.js";

const router = express.Router();

// Upsert for a goal
router.post("/", auth, async (req, res) => {
    const { goalId, frequency } = req.body;
    const stepMs = frequency === "daily" ? 86400000 : frequency === "biweekly" ? 14 * 86400000 : 7 * 86400000;
    const nextAt = new Date(Date.now() + stepMs);

    const doc = await Checkin.findOneAndUpdate(
        { userId: req.userId, goalId },
        { $set: { frequency, nextAt } },
        { new: true, upsert: true }
    );
    res.json(doc);
});

// List upcoming
router.get("/upcoming", auth, async (req, res) => {
    const docs = await Checkin.find({ userId: req.userId }).sort({ nextAt: 1 }).limit(10);
    res.json(docs);
});

export default router;
