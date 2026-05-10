import { useState } from "react";
import API from "../services/api";

export default function ArticleEditor({ article, onCreated, onUpdated }) {
  const [title, setTitle] = useState(article ? article.title : "");
  const [content, setContent] = useState(article ? article.content : "");

  const handleSave = async () => {
    if (article) {
      await API.put(`/author-api/articles/${article._id}`, { title, content });
      alert("Article updated!");
      onUpdated && onUpdated();
    } else {
      await API.post("/author-api/articles", { title, content });
      alert("Article created!");
      onCreated && onCreated();
    }
    setTitle("");
    setContent("");
  };

  return (
    <div className="mt-4">
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Title"
        className="border p-2 w-full mb-2 rounded"
      />
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Content"
        className="border p-2 w-full mb-2 rounded"
      />
      <button
        onClick={handleSave}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {article ? "Update" : "Create"}
      </button>
    </div>
  );
}
