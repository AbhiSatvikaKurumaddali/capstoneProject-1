import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  comment: String,
  createdAt: { type: Date, default: Date.now }
});

const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  published: { type: Boolean, default: false },
  comments: [commentSchema]
});

export default mongoose.model("Article", articleSchema);
