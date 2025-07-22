// contexts/AuthStore.jsx
import { create } from "zustand";
import axiosInstance from "../api/axiosConfig";

export const useAuthStore = create((set) => ({
  authUser: null,
  authRole: null,
  isCheckingAuth: true,

  checkAuth: async () => {
    try {

       set({ isCheckingAuth: true });
      const res = await axiosInstance.get("/auth/check");
      const user = res.data;
      set({
        authUser: user,
        authRole: user.role,
        isCheckingAuth: false,
      });
   
    } catch (error) {
      set({ authUser: null, authRole: null, isCheckingAuth: false });
    }
  },

  login: async (formData) => {
    try {
      const res = await axiosInstance.post("/auth/login", formData);
      const user = res.data;
      set({
        authUser: user,
        authRole: user.role,
        isCheckingAuth: false,
      });
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Login failed",
      };
    }
  },

  logout: async () => {
    await axiosInstance.post("/auth/logout");
    set({ authUser: null, authRole: null });
  },
}));
