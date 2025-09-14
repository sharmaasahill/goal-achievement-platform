import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    goalId: { type: mongoose.Schema.Types.ObjectId, ref: "Goal", index: true },
    type: { 
        type: String, 
        enum: ["checkin", "reminder", "progress", "achievement", "general"], 
        required: true 
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Notification", NotificationSchema);
