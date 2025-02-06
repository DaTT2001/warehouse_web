// src/api/auth.js
import axios from 'axios';

// URL của API backend
const API_URL = 'http://192.168.10.87:3000'; // Thay đổi theo API của bạn

// Hàm đăng nhập
export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { username, password });
    return response.data; // Dữ liệu trả về từ API
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Lỗi khi đăng nhập');
  }
};
