import { create } from "zustand";
import axios from "axios";

export const useAuth = create((set) => ({
  currentUser: null,
  loading: false,
  isAuthenticated: false,
  error: null,

  login: async (userCred) => {
    try {
      set({
        loading: true,
        currentUser: null,
        isAuthenticated: false,
        error: null,
      });

      let res = await axios.post(
        "https://atp-vj9u.onrender.com/common-api/login",
        userCred,
        { withCredentials: true },
      );

      if (res.status === 200) {
        set({
          currentUser: res.data?.payload,
          loading: false,
          isAuthenticated: true,
          error: null,
        });
      }
    } catch (err) {
      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        error:
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Login failed",
      });
    }
  },

  logout: async () => {
    try {
      set({ loading: true });

      let res = await axios.get(
        "https://atp-vj9u.onrender.com/common-api/logout",
        { withCredentials: true },
      );

      if (res.status === 200) {
        set({
          currentUser: null,
          isAuthenticated: false,
          error: null,
          loading: false,
        });
      }
    } catch (err) {
      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        error:
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Logout failed",
      });
    }
  },

  checkAuth: async () => {
    try {
      set({ loading: true });

      const res = await axios.get(
        "https://atp-vj9u.onrender.com/common-api/check-auth",
        { withCredentials: true },
      );

      set({
        currentUser: res.data.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
    } catch (err) {
      if (err.response?.status === 401) {
        set({
          currentUser: null,
          isAuthenticated: false,
          loading: false,
        });
        return;
      }

      set({
        loading: false,
        error:
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Auth check failed",
      });
    }
  },
}));
