import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import Article from "../models/articleModel.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// REGISTER endpoint
router.post("/register", async (req, res) => {
  try {
    console.log("Registration request received:", req.body);
    
    const { firstName, lastName, email, password, role } = req.body;
    
    // Validation
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ 
        message: "All fields are required" 
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        message: "User already exists with this email" 
      });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Convert role to uppercase to match your model
    let userRole = "USER"; // Default role
    if (role && role.toUpperCase() === "AUTHOR") userRole = "AUTHOR";
    if (role && role.toUpperCase() === "ADMIN") userRole = "ADMIN";
    
    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: userRole,
      profileImageUrl: req.body.profileImageUrl || ""
    });
    
    await newUser.save();
    
    // Create JWT token
    const token = jwt.sign(
      { 
        userId: newUser._id, 
        email: newUser.email, 
        role: newUser.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Return success response
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role,
        profileImageUrl: newUser.profileImageUrl
      }
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ 
      message: "Server error during registration",
      error: error.message 
    });
  }
});

// LOGIN endpoint
router.post("/login", async (req, res) => {
  try {
    console.log("Login request received for email:", req.body.email);
    
    const { email, password } = req.body;
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        message: "Email and password are required" 
      });
    }
    
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        message: "Invalid email or password" 
      });
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: "Invalid email or password" 
      });
    }
    
    // Create JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Return success response
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        profileImageUrl: user.profileImageUrl
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      message: "Server error during login",
      error: error.message 
    });
  }
});

// Get current user profile (protected route example)
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all published articles (your existing endpoint)
router.get("/articles", verifyToken, async (req, res) => {
  try {
    const articles = await Article.find({ published: true }).populate("authorId", "firstName email");
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add comment (your existing endpoint)
router.put("/articles", verifyToken, async (req, res) => {
  try {
    const { articleId, comment } = req.body;
    const article = await Article.findById(articleId);
    if (!article) return res.status(404).json({ message: "Article not found" });
    
    article.comments.push({ comment, userId: req.user.userId });
    await article.save();
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
