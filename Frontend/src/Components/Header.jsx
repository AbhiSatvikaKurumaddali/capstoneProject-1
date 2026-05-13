import React from "react";
import { NavLink, useNavigate } from "react-router-dom"; // use react-router-dom
import { useAuth } from "../store/authStore";

function Header() {
  const { isAuthenticated, logout } = useAuth((state) => state);
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    await logout();
    navigate("/login");
  };

  return (
    <header className="bg-blue-600 shadow-md">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo / Brand */}
        <NavLink to="/" className="text-2xl font-bold text-white hover:text-gray-200">
          MyBlog
        </NavLink>

        {/* Navigation Links */}
        <nav>
          <ul className="flex gap-6 text-lg text-white">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? "font-semibold underline" : "hover:text-gray-200"
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  isActive ? "font-semibold underline" : "hover:text-gray-200"
                }
              >
                Register
              </NavLink>
            </li>
            {isAuthenticated ? (
              <li>
                <button
                  onClick={handleLogout}
                  className="hover:text-gray-200 transition"
                >
                  Logout
                </button>
              </li>
            ) : (
              <li>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    isActive ? "font-semibold underline" : "hover:text-gray-200"
                  }
                >
                  Login
                </NavLink>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
