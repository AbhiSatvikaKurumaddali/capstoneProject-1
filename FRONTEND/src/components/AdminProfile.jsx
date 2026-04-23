import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../store/authStore";
import { useNavigate } from "react-router";
axios.defaults.withCredentials = true;
function AdminProfile() {
  const [users, setUsers] = useState([]);

  const currentUser = useAuth((state) => state.currentUser);
  const logout = useAuth((state) => state.logout);
  const navigate = useNavigate();

  const onLogout = async () => {
    await logout();
    navigate("/login");
  };

  const fetchUsers = async () => {
    let res = await axios.get("https://blogapp-ppg0.onrender.com/admin-api/users", {
      withCredentials: true,
    });
    setUsers(res.data.payload);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleStatus = async (user) => {
    await axios.patch(
      "https://blogapp-ppg0.onrender.com/admin-api/user-status",
      {
        userId: user._id,
        isUserActive: !user.isUserActive,
      },
      { withCredentials: true }
    );

    fetchUsers();
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* PROFILE HEADER */}
      <div className="bg-white border border-[#e8e8ed] rounded-3xl p-6 mb-8 shadow-sm flex items-center justify-between">
        
        {/* LEFT */}
        <div className="flex items-center gap-4">
          {currentUser?.profileImageUrl ? (
            <img
              src={currentUser.profileImageUrl}
              className="w-16 h-16 rounded-full object-cover border"
              alt="profile"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-[#0066cc]/10 text-[#0066cc] flex items-center justify-center text-xl font-semibold">
              {currentUser?.firstName?.charAt(0).toUpperCase()}
            </div>
          )}

          <div>
            <p className="text-sm text-[#6e6e73]">Admin Panel</p>
            <h2 className="text-xl font-semibold text-[#1d1d1f]">
              {currentUser?.firstName}
            </h2>
          </div>
        </div>

        {/* LOGOUT */}
        <button
          className="bg-[#ff3b30] text-white text-sm px-5 py-2 rounded-full hover:bg-[#d62c23] transition"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>

      {/* TITLE */}
      <h2 className="text-xl mb-4 font-semibold">Manage Users & Authors</h2>

      {/* USERS LIST */}
      {users.map((user) => (
        <div
          key={user._id}
          className="border p-4 mb-3 rounded flex justify-between items-center"
        >
          <div>
            <p>
              {user.firstName} ({user.role})
            </p>
            <p className="text-sm text-gray-500">{user.email}</p>
            <p>Status: {user.isUserActive ? "Active" : "Blocked"}</p>
          </div>

          <button
            onClick={() => toggleStatus(user)}
            className={`px-4 py-2 text-white rounded ${
              user.isUserActive ? "bg-red-500" : "bg-green-500"
            }`}
          >
            {user.isUserActive ? "Block" : "Unblock"}
          </button>
        </div>
      ))}
    </div>
  );
}

export default AdminProfile;
