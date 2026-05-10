import { useEffect, useState } from "react";
import API from "../services/api";
import AdminPanel from "../components/AdminPanel";

export default function AdminDashboard() {
  const [articles, setArticles] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    API.get("/admin-api/articles").then(res => setArticles(res.data));
    API.get("/admin-api/users").then(res => setUsers(res.data));
  }, []);

  const refreshData = () => {
    API.get("/admin-api/articles").then(res => setArticles(res.data));
    API.get("/admin-api/users").then(res => setUsers(res.data));
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Pending Articles</h2>
      {articles.map(a => (
        <div key={a._id} className="border p-4 rounded shadow mb-4">
          <h3 className="font-semibold">{a.title}</h3>
          <p>{a.content}</p>
          <button
            onClick={async () => {
              await API.put(`/admin-api/articles/${a._id}/approve`);
              alert("Article approved!");
              refreshData();
            }}
            className="bg-green-500 text-white px-3 py-1 mt-2 rounded hover:bg-green-600"
          >
            Approve
          </button>
        </div>
      ))}

      <h2 className="text-3xl font-bold mt-6 mb-4">Users</h2>
      <AdminPanel users={users} onChanged={refreshData} />
    </div>
  );
}
