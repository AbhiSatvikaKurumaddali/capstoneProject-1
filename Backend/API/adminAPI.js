import express from "express";
import Article from "../models/articleModel.js";
import User from "../models/userModel.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// Get all pending articles
router.get("/articles", verifyToken, async (req, res) => {
  const articles = await Article.find({ published: false });
  res.json(articles);
});

// Approve article
router.put("/articles/:id/approve", verifyToken, async (req, res) => {
  const article = await Article.findById(req.params.id);
  if (!article) return res.status(404).json({ message: "Article not found" });

  if (req.user.role !== "ADMIN") return res.status(403).json({ message: "Not authorized" });

  article.published = true;
  await article.save();
  res.json({ message: "Article approved successfully", article });
});

// Get all users
router.get("/users", verifyToken, async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Promote user
router.put("/users/:id/promote", verifyToken, async (req, res) => {
  const { role } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.role = role;
  await user.save();
  res.json(user);
});

// Delete user
router.delete("/users/:id", verifyToken, async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ message: "User deleted successfully" });
});

export default router;
