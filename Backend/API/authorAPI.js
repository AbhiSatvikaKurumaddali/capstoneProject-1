import exp from "express";
import { UserModel } from "../models/UserModel.js";
import { ArticleModel } from "../models/ArticleModel.js";
import { verifyToken } from "../middlewares/verifyToken.js";

export const authorApp = exp.Router();

//CREATE(write) ARTICLE
authorApp.post("/article", verifyToken("AUTHOR"), async (req, res) => {
  try {
    const user = req.user;

    // get author from DB
    const author = await UserModel.findById(user.id);

    if (!author) {
      return res.status(404).json({ message: "Invalid author" });
    }

    // create article 
    const articleObj = {
      ...req.body,
      author: user.id,
    };

    const articleDoc = new ArticleModel(articleObj);
    await articleDoc.save();

    res.status(201).json({
      message: "Article published successfully",
    });
  } catch (err) {
    console.log("ARTICLE ERROR:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
});

//GET OWN ARTICLES
authorApp.get("/article", verifyToken("AUTHOR"), async (req, res) => {
  try {
    const id = req.user.id;

    const articles = await ArticleModel.find({ author: id });

    res.status(200).json({
      message: "articles",
      payload: articles,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//EDIT ARTICLE
authorApp.put("/article", verifyToken("AUTHOR"), async (req, res) => {
  try {
    const authorId = req.user.id;
    const { articleId, title, category, content } = req.body;

    const updated = await ArticleModel.findOneAndUpdate(
      { _id: articleId, author: authorId },
      { $set: { title, category, content } },
      { new: true },
    );

    if (!updated) {
      return res.status(403).json({
        message: "Not authorized to edit article",
      });
    }

    res.status(200).json({
      message: "Article updated",
      payload: updated,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//  SOFT DELETE / TOGGLE
authorApp.patch("/articles", verifyToken("AUTHOR"), async (req, res) => {
  try {
    const authorId = req.user.id;
    const { articleId, isArticleActive } = req.body;

    const article = await ArticleModel.findOne({
      _id: articleId,
      author: authorId,
    });

    if (!article) {
      return res.status(404).json({
        message: "Article not found or not authorized",
      });
    }

    if (article.isArticleActive === isArticleActive) {
      return res.status(200).json({
        message: "article already in same state",
      });
    }

    article.isArticleActive = isArticleActive;
    await article.save();

    res.status(200).json({
      message: "Article updated successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
