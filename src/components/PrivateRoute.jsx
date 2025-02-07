// src/components/PrivateRoute.js

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../services/authService';  // Import logic kiểm tra xác thực

const PrivateRoute = ({ element }) => {
  const [loading, setLoading] = useState(true);  // Trạng thái loading khi kiểm tra token
  const navigate = useNavigate(); // Dùng useNavigate để điều hướng

  useEffect(() => {
    // Kiểm tra token khi component được render
    const checkAuth = () => {
      if (!isAuthenticated()) {
        // Nếu không xác thực, điều hướng về trang login
        navigate('/login');
      } else {
        setLoading(false);  // Nếu đã xác thực, không cần loading nữa
      }
    };

    checkAuth();
  }, [navigate]);

  // Nếu đang loading (kiểm tra token), không render gì cả
  if (loading) {
    return <div>Loading...</div>;
  }

  // Nếu đã xác thực, render component bảo vệ
  return isAuthenticated() ? element : null;
};

export default PrivateRoute;
