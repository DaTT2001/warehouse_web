import { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

const SessionTimer = () => {
  const [timeLeft, setTimeLeft] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();  
  const token = sessionStorage.getItem("token");

  const handleSessionExpire = useCallback(() => {
    sessionStorage.removeItem("token"); // Xóa token
    setTimeLeft(null);

    // Nếu không ở trang login thì mới hiển thị toast
    if (location.pathname !== "/login") {
        toast.warning("Phiên làm việc đã hết hạn! ⏳");
        navigate("/login");
    }       
  }, [location.pathname, navigate]);

  const updateTimeLeft = useCallback(() => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      handleSessionExpire();
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const exp = decoded.exp * 1000;
      const now = Date.now();
      const remainingTime = Math.max(0, Math.floor((exp - now) / 1000));

      if (remainingTime === 0) {
        handleSessionExpire();
      } else {
        setTimeLeft(remainingTime);
      }
    } catch (error) {
      console.error("Lỗi giải mã token:", error);
      handleSessionExpire();
    }
  }, [handleSessionExpire]);

  useEffect(() => {
    if (!token) return; // Không có token thì không làm gì

    const interval = setInterval(() => {
        updateTimeLeft();
    }, 1000);

    return () => clearInterval(interval);
  }, [token, updateTimeLeft]); // Thêm token vào dependency array


  if (timeLeft === null) return null; // Không hiển thị nếu không có token

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div style={styles.timerContainer}>
      ⏳ {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
    </div>
  );
};

// CSS cố định góc phải
const styles = {
  timerContainer: {
    position: "fixed",
    bottom: "10px",
    right: "10px",
    background: "rgba(0, 0, 0, 0.7)",
    color: "white",
    padding: "8px 12px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "bold",
    zIndex: 1000,
  },
};

export default SessionTimer;