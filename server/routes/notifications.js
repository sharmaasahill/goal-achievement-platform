import express from "express";
import auth from "../middleware/authMiddleware.js";
import Notification from "../models/Notification.js";

const router = express.Router();

// Get user notifications
router.get("/", auth, async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.userId })
            .sort({ createdAt: -1 })
            .limit(50);
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Mark notification as read
router.patch("/:id/read", auth, async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            { read: true },
            { new: true }
        );
        
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }
        
        res.json(notification);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete notification
router.delete("/:id", auth, async (req, res) => {
    try {
        const notification = await Notification.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId
        });
        
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }
        
        res.json({ message: "Notification deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create notification (internal use)
router.post("/", auth, async (req, res) => {
    try {
        const { type, title, message, goalId } = req.body;
        
        const notification = new Notification({
            userId: req.userId,
            type,
            title,
            message,
            goalId
        });
        
        await notification.save();
        res.json(notification);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
