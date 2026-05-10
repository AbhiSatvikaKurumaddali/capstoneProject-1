import express from "express";
import User from "../models/userModel.js";
import Article from "../models/articleModel.js";

const router = express.Router();

// Get all users (admin only - add auth later)
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all published articles (public)
router.get("/articles", async (req, res) => {
  try {
    const articles = await Article.find({ published: true }).populate("authorId", "firstName lastName email");
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
