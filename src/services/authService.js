import { setToken, getToken, removeToken, isTokenExpired } from '../utils/tokenUtils';
import axios from 'axios';

// Đăng nhập và lưu token
export const login = async (credentials) => {
  try {
    const response = await axios.post('/api/login', credentials);
    const token = response.data.token;

    // Lưu token vào sessionStorage
    setToken(token);

    return response;
  } catch (error) {
    console.error("Login failed", error);
    throw error;
  }
};

// Đăng xuất và xóa token
export const logout = () => {
  removeToken();
  window.location.href = '/login'; // Điều hướng về trang đăng nhập
};

// Kiểm tra xem token đã hết hạn chưa
export const isAuthenticated = () => {
  const token = getToken();
  if (token) {
    return !isTokenExpired(token);
  }
  return false;
};
