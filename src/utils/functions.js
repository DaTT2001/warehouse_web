import { API_URL } from "./constants";
import axios from "axios";
export const sendLog = async (username, action) => {
    try {
      await axios.post(`${API_URL}/logs`, { username, action });
    } catch (error) {
      console.error("Gửi log thất bại:", error);
    }
};