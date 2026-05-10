import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import Article from "../models/articleModel.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// REGISTER endpoint - Handle BOTH /Register and /register (case-insensitive)
router.post(["/Register", "/register"], async (req, res) => {
  try {
    console.log("Registration request received:", req.body);
    
    const { firstName, lastName, email, password, role, profileImageUrl } = req.body;
    
    // Validation
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    let userRole = "USER";
    if (role && role.toUpperCase() === "AUTHOR") userRole = "AUTHOR";
    if (role && role.toUpperCase() === "ADMIN") userRole = "ADMIN";
    
    const user = new User({ 
      firstName, 
      lastName, 
      email, 
      password: hashedPassword, 
      role: userRole, 
      profileImageUrl 
    });
    
    await user.save();
    
    // Create token
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: "7d" }
    );
    
    res.status(201).json({ 
      message: "User registered successfully",
      token, 
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// LOGIN endpoint
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: "7d" }
    );
    
    res.json({ 
      message: "Login successful",
      token, 
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all published articles
router.get("/articles", verifyToken, async (req, res) => {
  try {
    const articles = await Article.find({ published: true }).populate("authorId", "firstName email");
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add comment
router.put("/articles", verifyToken, async (req, res) => {
  try {
    const { articleId, comment } = req.body;
    const article = await Article.findById(articleId);
    if (!article) return res.status(404).json({ message: "Article not found" });
    
    article.comments.push({ comment });
    await article.save();
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
