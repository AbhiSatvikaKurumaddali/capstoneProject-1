import express from "express";
import Article from "../models/articleModel.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// Get all published articles
router.get("/articles", verifyToken, async (req, res) => {
  const articles = await Article.find({ published: true }).populate("authorId", "firstName email");
  res.json(articles);
});

// Add comment
router.put("/articles", verifyToken, async (req, res) => {
  const { articleId, comment } = req.body;
  const article = await Article.findById(articleId);
  if (!article) return res.status(404).json({ message: "Article not found" });

  article.comments.push({ comment });
  await article.save();
  res.json(article);
});

export default router;
