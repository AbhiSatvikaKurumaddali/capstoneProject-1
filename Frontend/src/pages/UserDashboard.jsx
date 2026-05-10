import { useEffect, useState } from "react";
import API from "../services/api";
import ArticleList from "../components/ArticleList";

export default function UserDashboard() {
  const [articles, setArticles] = useState([]);
  const [comment, setComment] = useState("");
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    API.get("/user-api/articles").then(res => setArticles(res.data));
  }, []);

  const handleComment = async () => {
    if (!selectedArticle) return alert("Select an article first!");
    await API.put("/user-api/articles", { articleId: selectedArticle, comment });
    alert("Comment added!");
    setComment("");
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">All Articles</h2>
      <ArticleList articles={articles} onSelect={setSelectedArticle} />
      <textarea value={comment} onChange={e => setComment(e.target.value)} className="border p-2 w-full mt-6 rounded" placeholder="Write a comment..." />
      <button onClick={handleComment} className="mt-2 bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600">Add Comment</button>
    </div>
  );
}
