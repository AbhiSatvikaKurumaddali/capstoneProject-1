import express from "express";
import Article from "../models/articleModel.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// Get author's own articles
router.get("/articles", verifyToken, async (req, res) => {
  const articles = await Article.find({ authorId: req.user.id });
  res.json(articles);
});

// Create new article
router.post("/articles", verifyToken, async (req, res) => {
  const { title, content } = req.body;
  const article = new Article({ title, content, authorId: req.user.id });
  await article.save();
  res.json(article);
});

// Edit article
router.put("/articles/:id", verifyToken, async (req, res) => {
  const { title, content } = req.body;
  const article = await Article.findById(req.params.id);
  if (!article) return res.status(404).json({ message: "Article not found" });

  if (article.authorId.toString() !== req.user.id) {
    return res.status(403).json({ message: "Not authorized" });
  }

  article.title = title;
  article.content = content;
  await article.save();
  res.json(article);
});

export default router;
