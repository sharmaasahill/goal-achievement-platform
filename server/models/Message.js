import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    goalId: { type: mongoose.Schema.Types.ObjectId, ref: "Goal", index: true },
    role: { type: String, enum: ["user", "assistant"], required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Message", MessageSchema);
