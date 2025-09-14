import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists with this email" });
        }
        
        // Validate password strength
        if (password.length < 8) {
            return res.status(400).json({ error: "Password must be at least 8 characters long" });
        }
        
        const hashed = await bcrypt.hash(password, 10);
        const verificationToken = crypto.randomBytes(32).toString('hex');
        
        const user = new User({ 
            name, 
            email, 
            password: hashed, 
            verificationToken 
        });
        await user.save();
        
        // In a real app, you would send an email here
        console.log(`Verification token for ${email}: ${verificationToken}`);
        
        res.json({ 
            message: "User registered successfully. Please check your email for verification.",
            verificationToken // Only for development
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // Check if email is verified (optional - you can make this required)
        if (!user.isVerified) {
            return res.status(400).json({ 
                message: "Please verify your email before logging in",
                needsVerification: true 
            });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Verify email
router.post("/verify", async (req, res) => {
    try {
        const { token } = req.body;
        const user = await User.findOne({ verificationToken: token });
        
        if (!user) {
            return res.status(400).json({ error: "Invalid verification token" });
        }
        
        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();
        
        res.json({ message: "Email verified successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Resend verification
router.post("/resend-verification", async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }
        
        if (user.isVerified) {
            return res.status(400).json({ error: "Email already verified" });
        }
        
        const verificationToken = crypto.randomBytes(32).toString('hex');
        user.verificationToken = verificationToken;
        await user.save();
        
        // In a real app, you would send an email here
        console.log(`New verification token for ${email}: ${verificationToken}`);
        
        res.json({ message: "Verification email sent" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
