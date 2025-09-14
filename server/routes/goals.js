import express from "express";
import auth from "../middleware/authMiddleware.js";
import Goal from "../models/Goal.js";
import Message from "../models/Message.js";
import { suggestDurationWeeks, generateChunks, recalcProgress } from "../utils/breakdown.js";

const router = express.Router();

// Create goal + auto-suggest breakdown
router.post("/", auth, async (req, res) => {
    const { title, description, durationWeeks } = req.body;
    const dw = durationWeeks || suggestDurationWeeks(title);
    const chunks = generateChunks(title, dw);

    const goal = await Goal.create({
        userId: req.userId,
        title, description,
        durationWeeks: dw,
        chunks
    });

    res.json(goal);
});

// List goals (current user)
router.get("/", auth, async (req, res) => {
    const goals = await Goal.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(goals);
});

// Get single goal
router.get("/:id", auth, async (req, res) => {
    const g = await Goal.findOne({ _id: req.params.id, userId: req.userId });
    if (!g) return res.status(404).json({ message: "Not found" });
    res.json(g);
});

// Toggle a chunk complete
router.patch("/:id/chunk/:weekIndex", auth, async (req, res) => {
    const { id, weekIndex } = req.params;
    const g = await Goal.findOne({ _id: id, userId: req.userId });
    if (!g) return res.status(404).json({ message: "Not found" });

    const idx = g.chunks.findIndex(c => c.weekIndex === Number(weekIndex));
    if (idx === -1) return res.status(404).json({ message: "Chunk not found" });

    g.chunks[idx].completed = !!req.body.completed;
    g.progress = recalcProgress(g.chunks);
    await g.save();
    res.json(g);
});

// Update check-in frequency
router.patch("/:id/checkin", auth, async (req, res) => {
    const { checkinFrequency } = req.body;
    const allowed = ["daily", "weekly", "biweekly"];
    if (!allowed.includes(checkinFrequency)) {
        return res.status(400).json({ message: "Invalid frequency" });
    }
    const g = await Goal.findOneAndUpdate(
        { _id: req.params.id, userId: req.userId },
        { $set: { checkinFrequency } },
        { new: true }
    );
    if (!g) return res.status(404).json({ message: "Not found" });
    res.json(g);
});

// Update goal (edit)
router.patch("/:id", auth, async (req, res) => {
    const { title, description, durationWeeks, checkinFrequency, status } = req.body;
    const updateData = {};
    
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (durationWeeks) updateData.durationWeeks = durationWeeks;
    if (checkinFrequency) updateData.checkinFrequency = checkinFrequency;
    if (status) updateData.status = status;
    
    const g = await Goal.findOneAndUpdate(
        { _id: req.params.id, userId: req.userId },
        { $set: updateData },
        { new: true }
    );
    if (!g) return res.status(404).json({ message: "Not found" });
    res.json(g);
});

// Delete goal
router.delete("/:id", auth, async (req, res) => {
    const g = await Goal.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!g) return res.status(404).json({ message: "Not found" });
    
    // Also delete associated messages
    await Message.deleteMany({ goalId: req.params.id, userId: req.userId });
    
    res.json({ message: "Goal deleted successfully" });
});

export default router;
