import mongoose from "mongoose";

const ChunkSchema = new mongoose.Schema({
    title: String,
    description: String,
    weekIndex: Number,          // 1-based
    targetDate: Date,           // optional
    completed: { type: Boolean, default: false }
}, { _id: false });

const GoalSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    title: { type: String, required: true },
    description: String,
    durationWeeks: { type: Number, default: 12 },  // 6-24 weeks suggested
    checkinFrequency: { type: String, enum: ["daily", "weekly", "biweekly"], default: "weekly" },
    status: { type: String, enum: ["active", "archived", "completed"], default: "active" },
    chunks: [ChunkSchema],
    progress: { type: Number, default: 0 },        // 0..100
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Goal", GoalSchema);
