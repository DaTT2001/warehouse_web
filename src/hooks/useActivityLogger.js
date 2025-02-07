import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../utils/constants";
import { jwtDecode } from "jwt-decode";

const sendLogToServer = async (username, action) => {
  try {
    await axios.post(`${API_URL}/logs`, { username, action });
  } catch (error) {
    console.error("Gửi log thất bại", error);
  }
};

const useActivityLogger = (action) => {
  const location = useLocation();
  const hasLogged = useRef(false); // Đánh dấu đã gửi log chưa

  useEffect(() => {
    if (hasLogged.current) return; // Nếu đã log, không gửi lại

    const token = sessionStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      const username = decoded?.username || "Unknown User";
      sendLogToServer(username, action || `Truy cập ${location.pathname}`);
    }

    hasLogged.current = true; // Đánh dấu đã gửi log
  }, [location, action]); // Chạy lại nếu URL thay đổi
};

export default useActivityLogger;
