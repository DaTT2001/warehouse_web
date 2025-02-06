// src/utils/tokenUtils.js

// Lưu token vào sessionStorage
export const setToken = (token) => {
    sessionStorage.setItem('token', token);
  };
  
  // Lấy token từ sessionStorage
  export const getToken = () => {
    return sessionStorage.getItem('token');
  };
  
  // Xóa token khỏi sessionStorage
  export const removeToken = () => {
    sessionStorage.removeItem('token');
  };
  
  // Kiểm tra xem token có hết hạn chưa
  export const isTokenExpired = (token) => {
    const decodedToken = JSON.parse(atob(token.split('.')[1])); // Giải mã JWT
    const expirationTime = decodedToken.exp * 1000; // Thời gian hết hạn (milliseconds)
    const currentTime = Date.now();
    
    return currentTime > expirationTime;
  };
  