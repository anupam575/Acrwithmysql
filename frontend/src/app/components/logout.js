"use client";

import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import API from "../../utils/axiosInstance";
import LogoutIcon from "@mui/icons-material/Logout";

// auth
import { clearUser } from "../../redux/slices/authslice";

export default function LogoutButton() {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // 🔥 Backend logout
      await API.post("/logout");

      // 🔥 Clear Redux state
      dispatch(clearUser());

      // 🔥 Toast
      toast.success("✅ Logged out successfully");

      // 🔥 Redirect
      router.push("/");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Logout failed, please try again."
      );
    }
  };

  return (
  
<button
  onClick={handleLogout}
  className="
    flex items-center gap-2
    px-4 py-2
    bg-red-600
    text-white
    rounded-lg
    font-medium
    transition-all duration-200
    hover:bg-red-700
  "
>
  <LogoutIcon fontSize="small" />
  Logout
</button>
  )
}