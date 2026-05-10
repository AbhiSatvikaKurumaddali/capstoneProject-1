import { useState } from "react";
import API from "../services/api";

export default function RegisterForm() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", role: "USER" });

  const handleRegister = async () => {
    try {
      await API.post("/common-api/users", form);
      alert("Registered successfully! Please login.");
    } catch {
      alert("Registration failed");
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
