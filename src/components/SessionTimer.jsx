import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

const SessionTimer = ({ onSessionExpire }) => {
  const [timeLeft, setTimeLeft] = useState(() => {
    const token = sessionStorage.getItem("token");
    if (!token) return 0;

    try {
      const decoded = jwtDecode(token);
      const expireTime = decoded.exp * 1000; // Chuyển từ giây sang ms
      return Math.max(0, expireTime - Date.now());
    } catch (error) {
      return 0; // Token lỗi
    }
  });

  useEffect(() => {
    if (timeLeft <= 0) {
      onSessionExpire();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1000) {
          clearInterval(interval);
          toast.warning("Phiên làm việc đã hết hạn! ⏳");
          onSessionExpire();
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, onSessionExpire]);

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  return (
    <div style={styles.timerContainer}>
      ⏳ {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
    </div>
  );
};

// CSS cố định góc dưới bên phải
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