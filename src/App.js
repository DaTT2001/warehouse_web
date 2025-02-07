import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { ToastContainer } from "react-toastify";
import "./App.css"

// Import các trang
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import NotFound from './pages/NotFound';
import PrivateRoute from './components/PrivateRoute';
import Suppliers from './pages/Suppliers';
import LogsPage from './pages/LogsPage';

const Layout = ({ children }) => {
  const location = useLocation();
  const hideHeaderFooter = location.pathname === "/login";

  return (
    <div className='app-container'>
      {!hideHeaderFooter && <Header />}
      <main className="main-content">{children}</main>
      {!hideHeaderFooter && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} /> 
          <Route path="/" element={<PrivateRoute element={<Dashboard />} />} />
          <Route path="/inventory" element={<PrivateRoute element={<Inventory />} />} />
          <Route path="/logs" element={<PrivateRoute element={<LogsPage />} />} />
          <Route path="/suppliers" element={<PrivateRoute element={<Suppliers />} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;
