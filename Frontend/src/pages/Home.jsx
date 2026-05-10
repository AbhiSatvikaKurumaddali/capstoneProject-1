import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-indigo-400 to-pink-500 text-white">
      <h1 className="text-4xl font-bold mb-6">Welcome to BlogApp</h1>
      <div className="flex gap-4">
        <Link to="/login" className="bg-white text-indigo-600 px-4 py-2 rounded shadow hover:bg-gray-100">Login</Link>
        <Link to="/register" className="bg-white text-indigo-600 px-4 py-2 rounded shadow hover:bg-gray-100">Register</Link>
      </div>
    </div>
  );
}
