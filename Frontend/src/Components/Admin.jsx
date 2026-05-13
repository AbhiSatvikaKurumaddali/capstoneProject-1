import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../store/authStore";
import { useNavigate } from "react-router";
import {
  pageWrapper,
  pageTitleClass,
  errorClass,
  loadingClass,
  emptyStateClass,
} from "../styles/common";

function AdminProfile() {
  const { currentUser, logout } = useAuth((state) => state);
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const onLogout = async () => {
    await logout();
    navigate("/login");
  };

  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/admin/users`,
        { withCredentials: true },
      );
      setUsers(res.data.payload || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleBlock = async (userId, isCurrentlyActive) => {
    try {
      if (isCurrentlyActive) {
        await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/admin/user/${userId}`,
          {},
          { withCredentials: true },
        );
      } else {
        await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/admin/user-unblock/${userId}`,
          {},
          { withCredentials: true },
        );
      }
      // Refresh user list
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update user status.");
    }
  };

  if (loading) return <div className={loadingClass}>Loading users...</div>;
  if (error)
    return (
      <div className="text-center mt-10">
        <div className={errorClass}>{error}</div>
      </div>
    );

  return (
    <div className={pageWrapper}>
      {/* PROFILE HEADER */}
      <div className="bg-white border border-[#e8e8ed] rounded-3xl p-6 mb-8 shadow-sm flex items-center justify-between">
        {/* LEFT */}
        <div className="flex items-center gap-4">
          {/* Avatar */}
          {currentUser?.profileImageUrl ? (
            <img
              src={currentUser.profileImageUrl}
              className="w-16 h-16 rounded-full object-cover border"
              alt="profile"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-[#0066cc]/10 text-[#0066cc] flex items-center justify-center text-xl font-semibold">
              {currentUser?.firstName?.charAt(0).toUpperCase() || "A"}
            </div>
          )}

          {/* Name */}
          <div>
            <p className="text-sm text-[#6e6e73]">Welcome back, Admin</p>
          </div>
        </div>

        {/* LOGOUT */}
        <button
          className="bg-[#ff3b30] text-white text-sm px-5 py-2 rounded-full hover:bg-[#d62c23] transition-colors cursor-pointer"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>

      <h1 className={pageTitleClass}>Admin Dashboard</h1>
      <p className="text-[#6e6e73] mb-10">
        Manage registered users and authors.
      </p>

      {users.length === 0 ? (
        <div className={emptyStateClass}>No users found.</div>
      ) : (
        <div className="bg-[#f5f5f7] rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#e8e8ed] border-b border-[#d2d2d7]/50 text-sm font-semibold text-[#1d1d1f]">
                <tr>
                  <th className="px-6 py-5">Name</th>
                  <th className="px-6 py-5">Email</th>
                  <th className="px-6 py-5">Role</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5 text-right w-32">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d2d2d7]/30 text-sm text-[#1d1d1f]">
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-white/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium flex items-center gap-3">
                      {user.profileImageUrl ? (
                        <img
                          src={user.profileImageUrl}
                          alt="avatar"
                          className="w-8 h-8 rounded-full border border-[#d2d2d7]"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[#0066cc]/10 text-[#0066cc] flex items-center justify-center font-bold text-xs">
                          {user.firstName?.charAt(0) || "U"}
                        </div>
                      )}
                      <span>
                        {user.firstName} {user.lastName}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#6e6e73] font-medium">
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-[#0066cc]/10 text-[#0066cc] px-2.5 py-1 rounded font-bold text-[10px] uppercase tracking-wider">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {user.isUserActive !== false ? (
                        <span className="text-[#248a3d] bg-[#34c759]/10 px-2.5 py-1 rounded-full font-bold text-[10px] uppercase tracking-wide">
                          Active
                        </span>
                      ) : (
                        <span className="text-[#cc2f26] bg-[#ff3b30]/10 px-2.5 py-1 rounded-full font-bold text-[10px] uppercase tracking-wide">
                          Blocked
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() =>
                          handleToggleBlock(
                            user._id,
                            user.isUserActive !== false,
                          )
                        }
                        className={
                          user.isUserActive !== false
                            ? "bg-[#ff3b30] text-white font-semibold flex-1 px-4 py-1.5 rounded-full hover:bg-[#d62c23] transition-colors cursor-pointer text-xs w-full text-center"
                            : "bg-[#34c759] text-white font-semibold flex-1 px-4 py-1.5 rounded-full hover:bg-[#248a3d] transition-colors cursor-pointer text-xs w-full text-center"
                        }
                      >
                        {user.isUserActive !== false ? "Block" : "Unblock"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProfile;

//admin@gmail.com
//Password123!
