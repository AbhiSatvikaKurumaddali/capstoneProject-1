import React from "react";

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-12">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Left: Branding */}
        <div className="text-center md:text-left">
          <h2 className="text-xl font-bold">MyBlog</h2>
          <p className="text-gray-400 text-sm">
            Sharing ideas, stories, and knowledge.
          </p>
        </div>

        {/* Middle: Links */}
        <div className="flex gap-6 text-sm">
          <a href="/" className="hover:text-blue-400">Home</a>
          <a href="/about" className="hover:text-blue-400">About</a>
          <a href="/contact" className="hover:text-blue-400">Contact</a>
        </div>

        {/* Right: Socials */}
        <div className="flex gap-4">
          <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-blue-400">
            Twitter
          </a>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-blue-400">
            GitHub
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-blue-400">
            LinkedIn
          </a>
        </div>
      </div>

      {/* Bottom */}
      <div className="text-center text-gray-500 text-xs mt-6">
        © {new Date().getFullYear()} MyBlog. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
