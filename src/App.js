// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// Import các trang
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import NotFound from './pages/NotFound';

// Import PrivateRoute
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} /> {/* Trang Login */}
        <Route path="/" element={<PrivateRoute element={<Dashboard />} />} /> {/* Trang Dashboard */}
        <Route path="/inventory" element={<PrivateRoute element={<Inventory />} />} /> {/* Trang Quản lý kho */}
        <Route path="*" element={<NotFound />} /> {/* Trang 404 nếu không tìm thấy route */}
      </Routes>
    </Router>
  );
}

export default App;
