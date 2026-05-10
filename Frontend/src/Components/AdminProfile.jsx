import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../store/authStore";
import { useNavigate } from "react-router";

axios.defaults.withCredentials = true;

function AdminProfile() {
  const [users, setUsers] = useState([]);
  const [authors, setAuthors] = useState([]);

  const currentUser = useAuth((state) => state.currentUser);
  const logout = useAuth((state) => state.logout);
  const navigate = useNavigate();

  const onLogout = async () => {
    await logout();
    navigate("/login");
  };

  const fetchUsers = async () => {
    try {
      let res = await axios.get("https://blogapp-00eh.onrender.com/admin-api/emails", {
        withCredentials: true,
      });

      console.log("API RESPONSE:", res.data);

      // FIXED: Handle the response structure correctly
      setUsers(res.data.USERS || []);
      setAuthors(res.data.AUTHORS || []);
    } catch (err) {
      console.error("Fetch error:", err);
      // Handle 401/403 errors
      if (err.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleStatus = async (user) => {
    try {
      await axios.put(
        "https://blogapp-00eh.onrender.com/admin-api/userStatus",
        {
          email: user.email, // Good - using email
          isUserActive: !user.isUserActive,
        },
        { withCredentials: true },
      );

      fetchUsers(); // Refresh the list
    } catch (err) {
      console.error("Status update error:", err.response?.data || err.message);
    }
  };

  const renderList = (list, title) => (
    <>
      <h3 className="text-lg font-semibold mt-6 mb-2">{title}</h3>

      {list.length === 0 ? (
        <p className="text-gray-500">No data found</p>
      ) : (
        list.map((user) => (
          <div
            key={user.email || user._id} // FIXED: Use email or _id
            className="border p-4 mb-3 rounded flex justify-between items-center"
          >
            <div>
              {/* FIXED: Handle different field names */}
              <p className="font-medium">
                {user.username || user.firstName || user.email}
              </p>
              <p className="text-sm text-gray-500">{user.email}</p>
              <p>Status: {user.isUserActive !== false ? "Active" : "Blocked"}</p>
              <p className="text-xs text-gray-400">Role: {user.role}</p>
            </div>

            <button
              onClick={() => toggleStatus(user)}
              className={`px-4 py-2 text-white rounded ${
                user.isUserActive !== false ? "bg-red-500" : "bg-green-500"
              }`}
            >
              {user.isUserActive !== false ? "Block" : "Unblock"}
            </button>
          </div>
        ))
      )}
    </>
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* PROFILE HEADER */}
      <div className="bg-white border rounded-3xl p-6 mb-8 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-xl">
            {currentUser?.username?.charAt(0).toUpperCase() || 
             currentUser?.email?.charAt(0).toUpperCase()}
          </div>

          <div>
            <p className="text-sm text-gray-500">Admin Panel</p>
            <h2 className="text-xl font-semibold">
              {currentUser?.username || currentUser?.email}
            </h2>
            <p className="text-sm text-gray-500">{currentUser?.email}</p>
          </div>
        </div>

        <button
          className="bg-red-500 text-white px-5 py-2 rounded-full hover:bg-red-600"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>

      {/* USERS */}
      {renderList(users, "Users")}

      {/* AUTHORS */}
      {renderList(authors, "Authors")}
    </div>
  );
}

export default AdminProfile;
