import { useEffect, useState } from "react";
import API from "../services/api";
import ArticleEditor from "../components/ArticleEditor";

export default function AuthorDashboard() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    API.get("/author-api/articles").then(res => setArticles(res.data));
  }, []);

  const refreshArticles = () => {
    API.get("/author-api/articles").then(res => setArticles(res.data));
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Your Articles</h2>
      {articles.map(a => (
        <div key={a._id} className="border p-4 rounded shadow mb-4">
          <h3 className="font-semibold">{a.title}</h3>
          <p>{a.content}</p>
          <ArticleEditor article={a} onUpdated={refreshArticles} />
        </div>
      ))}
      <h3 className="mt-6 font-semibold">Create New Article</h3>
      <ArticleEditor onCreated={refreshArticles} />
    </div>
  );
}
