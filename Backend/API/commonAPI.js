import express from "express";
import User from "../models/userModel.js";
import Article from "../models/articleModel.js";

const router = express.Router();

// Get all users (public - limited info)
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}).select("-password -email");
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

// Get single article by ID (public)
router.get("/articles/:id", async (req, res) => {
  try {
    const article = await Article.findById(req.params.id).populate("authorId", "firstName lastName email");
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
