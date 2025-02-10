import axios from "axios";
import { API_URL } from "../utils/constants";
import { jwtDecode } from "jwt-decode";

// Hàm gửi log lên server
export const activityLogger = async (action) => {
  try {
    const token = sessionStorage.getItem("token");
    if (!token) throw new Error("Không tìm thấy token!");

    const decoded = jwtDecode(token);
    const username = decoded?.username || "Unknown User";

    await axios.post(`${API_URL}/logs`, { username, action });
  } catch (error) {
    console.error("Gửi log thất bại", error);
  }
};