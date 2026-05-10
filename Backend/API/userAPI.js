import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { ArticleModel } from "../models/ArticleModel.js";

export const userApp = express.Router();

// Read articles of all authors
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

// Add comments to an article
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
