import { useState } from "react";
import API from "../services/api";

export default function RegisterForm() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", role: "USER" });

  const handleRegister = async () => {
    try {
      // ✅ FIXED: Changed from /common-api/users to /user-api/register
      const response = await API.post("/user-api/register", form);
      console.log("Registration success:", response.data);
      
      // Save the token and user data
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      
      alert("Registered successfully!");
      
      // Redirect based on role
      if (response.data.user.role === "ADMIN") {
        window.location.href = "/admin-dashboard";
      } else if (response.data.user.role === "AUTHOR") {
        window.location.href = "/author-dashboard";
      } else {
        window.location.href = "/user-dashboard";
      }
    } catch (error) {
      console.error("Registration failed:", error.response?.data);
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="bg-white p-8 rounded shadow-md w-96">
      <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
      {["firstName", "lastName", "email", "password"].map((field) => (
        <input
          key={field}
          type={field === "password" ? "password" : "text"}
          placeholder={field}
          className="border p-2 w-full mb-4 rounded"
          value={form[field]}
          onChange={(e) => setForm({ ...form, [field]: e.target.value })}
        />
      ))}
      <select
        className="border p-2 w-full mb-4 rounded"
        value={form.role}
        onChange={(e) => setForm({ ...form, role: e.target.value })}
      >
        <option value="USER">User</option>
        <option value="AUTHOR">Author</option>
      </select>
      <button
        onClick={handleRegister}
        className="w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600"
      >
        Register
      </button>
    </div>
  );
}
