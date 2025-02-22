import { API_URL } from "./constants";
import axios from "axios";
export const sendLog = async (username, action) => {
    try {
      await axios.post(`${API_URL}/logs`, { username, action });
    } catch (error) {
      console.error("Gửi log thất bại:", error);
    }
};
export const getCurrentTimeString = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  return `${hours}:${minutes}:${seconds}`;
};