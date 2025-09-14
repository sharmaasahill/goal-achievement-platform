import mongoose from "mongoose";

const CheckinSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    goalId: { type: mongoose.Schema.Types.ObjectId, ref: "Goal", index: true },
    frequency: { type: String, enum: ["daily", "weekly", "biweekly"], default: "weekly" },
    nextAt: { type: Date, default: () => new Date(Date.now() + 7 * 24 * 3600 * 1000) },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Checkin", CheckinSchema);
