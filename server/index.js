import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import goalRoutes from "./routes/goals.js";
import checkinRoutes from "./routes/checkins.js";
import aiRoutes from "./routes/ai.js";
import notificationRoutes from "./routes/notifications.js";


dotenv.config();               // must be before connectDB()
const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        credentials: true
    }
});

connectDB();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());
// ...
app.use("/api/goals", goalRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/checkins", checkinRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/notifications", notificationRoutes);

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join goal-specific room
    socket.on('join-goal', (goalId) => {
        socket.join(`goal-${goalId}`);
        console.log(`User ${socket.id} joined goal ${goalId}`);
    });

    // Handle real-time chat messages
    socket.on('chat-message', async (data) => {
        try {
            const { goalId, message, userId } = data;
            
            // Broadcast message to all users in the goal room
            socket.to(`goal-${goalId}`).emit('new-message', {
                id: Date.now(),
                userId,
                message,
                timestamp: new Date(),
                type: 'user'
            });

            // Simulate AI response
            setTimeout(() => {
                const aiResponse = generateAIResponse(message);
                io.to(`goal-${goalId}`).emit('new-message', {
                    id: Date.now() + 1,
                    userId: 'ai-tutor',
                    message: aiResponse,
                    timestamp: new Date(),
                    type: 'ai'
                });
            }, 1000 + Math.random() * 2000); // Random delay 1-3 seconds

        } catch (error) {
            console.error('Error handling chat message:', error);
        }
    });

    // Handle typing indicators
    socket.on('typing', (data) => {
        socket.to(`goal-${data.goalId}`).emit('user-typing', {
            userId: data.userId,
            isTyping: data.isTyping
        });
    });

    // Handle progress updates
    socket.on('progress-update', (data) => {
        socket.to(`goal-${data.goalId}`).emit('progress-changed', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Simple AI response generator
function generateAIResponse(userMessage) {
    const responses = [
        "That's a great question! Let me help you understand this concept better.",
        "I see you're making good progress. Here's what I suggest for your next steps...",
        "Excellent point! This relates to what we discussed earlier. Let me elaborate...",
        "You're on the right track! Here's how you can apply this to your specific goal...",
        "That's a common challenge. Here's a proven approach that works well...",
        "Great observation! This is actually a key concept in your learning journey...",
        "I'm impressed with your understanding so far. Let's build on that foundation...",
        "That's exactly the kind of thinking that leads to success! Here's more guidance..."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

app.use((err, req, res, next) => {
    console.error("Unhandled:", err);
    res.status(500).json({ message: "Server error" });
});

