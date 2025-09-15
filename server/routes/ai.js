import express from "express";
import auth from "../middleware/authMiddleware.js";
import Goal from "../models/Goal.js";
import Message from "../models/Message.js";

const router = express.Router();

function mockTutor(goalTitle, userText) {
    const goalLower = goalTitle.toLowerCase();
    const userLower = userText.toLowerCase();
    
    // Context-aware responses based on goal type
    let response = "";
    
    if (goalLower.includes("data scientist") || goalLower.includes("machine learning")) {
        if (userLower.includes("stuck") || userLower.includes("difficult")) {
            response = `I understand you're facing challenges with ${goalTitle}. Here's my advice:\n\n`;
            response += `**Break it down**: Focus on one concept at a time. Start with basic statistics before diving into algorithms.\n`;
            response += `**Practice daily**: Spend 30 minutes coding in Python/R every day, even if it's just simple data manipulation.\n`;
            response += `**Build projects**: Create a portfolio with 3-5 data science projects using real datasets.\n\n`;
            response += `**Next 3 days plan**:\n1. Day 1: Review basic statistics concepts\n2. Day 2: Practice pandas data manipulation\n3. Day 3: Start your first simple analysis project`;
        } else if (userLower.includes("progress") || userLower.includes("how am i")) {
            response = `Great question! For ${goalTitle}, here's how to track your progress:\n\n`;
            response += `**Weekly milestones**: Complete one new concept + one practice exercise\n`;
            response += `**Coding practice**: Aim for 5-10 hours of hands-on coding per week\n`;
            response += `**Documentation**: Keep a learning journal of key insights\n\n`;
            response += `**This week's focus**: Choose one ML algorithm (like linear regression) and implement it from scratch.`;
        } else {
            response = `Excellent! For ${goalTitle}, here's your personalized guidance:\n\n`;
            response += `**Learning path**: Statistics → Python → Data Visualization → ML Algorithms → Projects\n`;
            response += `**Time management**: 2-3 hours daily, with 70% hands-on practice\n`;
            response += `**Success metrics**: Build 3 projects, master 5 algorithms, create a portfolio\n\n`;
            response += `**Immediate action**: Start with a simple dataset analysis using pandas and matplotlib.`;
        }
    } else if (goalLower.includes("full stack") || goalLower.includes("web development")) {
        if (userLower.includes("stuck") || userLower.includes("difficult")) {
            response = `I see you're hitting some roadblocks with ${goalTitle}. Let's get you unstuck:\n\n`;
            response += `**Frontend first**: Master HTML/CSS/JavaScript before moving to frameworks\n`;
            response += `**Build daily**: Create one small project every day, even if it's just a button\n`;
            response += `**Iterate quickly**: Don't perfect one thing - build many things and improve gradually\n\n`;
            response += `**Next 3 days plan**:\n1. Day 1: Build a responsive navigation bar\n2. Day 2: Add JavaScript interactions\n3. Day 3: Connect to a simple API`;
        } else {
            response = `Perfect! For ${goalTitle}, here's your roadmap:\n\n`;
            response += `**Frontend**: HTML/CSS → JavaScript → React/Vue → State Management\n`;
            response += `**Backend**: Node.js/Python → Databases → APIs → Authentication\n`;
            response += `**Deployment**: Git → Cloud platforms → CI/CD → Monitoring\n\n`;
            response += `**This week's goal**: Build a complete CRUD application with user authentication.`;
        }
    } else if (goalLower.includes("dsa") || goalLower.includes("algorithms")) {
        response = `Great choice! For ${goalTitle}, here's your structured approach:\n\n`;
        response += `**Study order**: Arrays → Linked Lists → Stacks/Queues → Trees → Graphs → Dynamic Programming\n`;
        response += `**Practice daily**: Solve 2-3 problems on LeetCode/HackerRank\n`;
        response += `**Understand patterns**: Focus on problem-solving patterns, not memorizing solutions\n\n`;
        response += `**This week's focus**: Master array manipulation and basic sorting algorithms.`;
    } else {
        // Generic response for other goals
        response = `I'm here to help you achieve "${goalTitle}"! Here's my guidance:\n\n`;
        response += `**Set clear milestones**: Break your goal into weekly objectives\n`;
        response += `**Consistent practice**: Dedicate 1-2 hours daily to your goal\n`;
        response += `**Track progress**: Keep a journal of what you learn each day\n`;
        response += `**Review weekly**: Assess what worked and what needs adjustment\n\n`;
        response += `**Next steps**: Define your first week's specific learning objectives.`;
    }
    
    return response;
}

router.post("/reply", auth, async (req, res) => {
    const { goalId, text } = req.body;
    const goal = await Goal.findOne({ _id: goalId, userId: req.userId });
    if (!goal) return res.status(404).json({ message: "Goal not found" });

    // store user message
    await Message.create({ userId: req.userId, goalId, role: "user", text });

    const reply = mockTutor(goal.title, text);

    // store assistant message
    const saved = await Message.create({ userId: req.userId, goalId, role: "assistant", text: reply });

    res.json(saved);
});

router.get("/history/:goalId", auth, async (req, res) => {
    const msgs = await Message.find({ userId: req.userId, goalId: req.params.goalId }).sort({ createdAt: 1 });
    res.json(msgs);
});

export default router;
