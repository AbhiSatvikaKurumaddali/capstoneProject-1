import express from "express";
import { hash } from "bcryptjs";
import { UserModel } from "../models/UserModel.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { ArticleModel } from "../models/ArticleModel.js";

export const userApp = express.Router();

// REGISTRATION ENDPOINT - ADD THIS
userApp.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    // Validation
    if (!firstName || !email || !password) {
      return res.status(400).json({ 
        message: "First name, email and password are required" 
      });
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        message: "User already exists with this email" 
      });
    }

    // Set default role if not provided
    let userRole = role || "USER";
    let allowedRoles = ["USER", "AUTHOR"];
    if (!allowedRoles.includes(userRole)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create new user
    const newUserDoc = new UserModel({
      firstName,
      lastName: lastName || "",
      email,
      password: hashedPassword,
      role: userRole,
      isUserActive: true
    });
    
    await newUserDoc.save();

    res.status(201).json({ 
      message: "User created successfully",
      user: {
        firstName: newUserDoc.firstName,
        email: newUserDoc.email,
        role: newUserDoc.role
      }
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({
      message: "Server error during registration",
      error: err.message
    });
  }
});

// Get articles
userApp.get("/articles", verifyToken("USER"), async (req, res) => {
  try {
    const articleList = await ArticleModel.find({ isArticleActive: true });
    res.status(200).json({ 
      message: "Articles fetched successfully", 
      payload: articleList 
    });
  } catch (err) {
    console.error("Error fetching articles:", err);
    res.status(500).json({ 
      message: "Server error", 
      error: err.message 
    });
  }
});

// Add comments
userApp.put("/articles", verifyToken("USER"), async (req, res) => {
  try {
    const { articleId, comment } = req.body;
    
    if (!articleId || !comment) {
      return res.status(400).json({ 
        message: "Article ID and comment are required" 
      });
    }
    
    const articleDocument = await ArticleModel.findOne({ 
      _id: articleId, 
      isArticleActive: true 
    });
    
    if (!articleDocument) {
      return res.status(404).json({ 
        message: "Article not found" 
      });
    }
    
    const userId = req.user?.id;
    
    articleDocument.comments.push({ 
      user: userId, 
      comment: comment,
      createdAt: new Date()
    });
    
    await articleDocument.save();
    
    res.status(200).json({ 
      message: "Comment added successfully", 
      payload: articleDocument 
    });
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ 
      message: "Server error", 
      error: err.message 
    });
  }
});
