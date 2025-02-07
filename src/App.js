// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header';
import Footer from './components/Footer';
import "./App.css"
// Import các trang
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import NotFound from './pages/NotFound';

// Import PrivateRoute
import PrivateRoute from './components/PrivateRoute';
import Suppliers from './pages/Suppliers';
import LogsPage from './pages/LogsPage'

function App() {
  return (
    <div className='app-container'>
    <Router>
      <Header/>
      <Routes>
        <Route path="/login" element={<Login />} /> {/* Trang Login */}
        <Route path="/" element={<PrivateRoute element={<Dashboard />} />} /> {/* Trang Dashboard */}
        <Route path="/inventory" element={<PrivateRoute element={<Inventory />} />} /> {/* Trang Quản lý kho */}
        <Route path="/logs" element={<PrivateRoute element={<LogsPage />} />} /> {/* Trang Quản lý kho */}
        <Route path="/suppliers" element={<PrivateRoute element={<Suppliers />} />} /> {/* Trang Quản lý Nhà cung cấp */}
        <Route path="*" element={<NotFound />} /> {/* Trang 404 nếu không tìm thấy route */}
      </Routes>
      <Footer/>
    </Router>
    </div>
  );
}

export default App;
