import React from "react";

function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center px-6">
      {/* Hero Section */}
      <div className="max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
          Simple to Start, Easier to Grow
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Turn your idea into a blog in minutes. Then take it further with flexible, intuitive tools designed to help you grow.
        </p>
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-500 transition">
          Start your blog
        </button>
      </div>
    </div>
  );
}

export default Home;
