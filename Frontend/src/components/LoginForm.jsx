import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post("/common-api/login", { email, password });
      localStorage.setItem("token", res.data.token);

      const payload = JSON.parse(atob(res.data.token.split(".")[1]));
      if (payload.role === "USER") navigate("/user-dashboard");
      else if (payload.role === "AUTHOR") navigate("/author-dashboard");
      else if (payload.role === "ADMIN") navigate("/admin-dashboard");
    } catch {
      alert("Login failed");
    }
  };

  return (
    <div className="bg-white p-8 rounded shadow-md w-96">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      <input
        type="email"
        placeholder="Email"
        className="border p-2 w-full mb-4 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="border p-2 w-full mb-4 rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleLogin}
        className="w-full bg-emerald-500 text-white py-2 rounded hover:bg-emerald-600"
      >
        Login
      </button>
    </div>
  );
}
