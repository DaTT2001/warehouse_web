import React, {useState, useEffect} from "react";
import { Navbar, Nav, Container, Dropdown } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/images/KD logo tách nềnn.png"
import ConfirmationModal from "./ConfirmationModal";
import { jwtDecode } from "jwt-decode";
import { sendLog } from "../utils/functions";

const Header = () => {
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [userInfo, setUserInfo] = useState({ username: "", role: "" });
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
          setCurrentTime(new Date());
        }, 1000);
    
        return () => clearInterval(interval); // Cleanup khi component unmount
      }, []);
      useEffect(() => {
        // Lấy token từ sessionStorage và giải mã
        const token = sessionStorage.getItem("token");
        if (token) {
          try {
            const decoded = jwtDecode(token);
            setUserInfo({ username: decoded.username, role: decoded.role }); // Giả sử token có username và role
          } catch (error) {
            console.error("Lỗi khi giải mã token:", error);
          }
        }
      }, []);
    const handleLogout = () => {
        setLoading(true);
        setTimeout (() => {
            sessionStorage.removeItem("token");
            sendLog(userInfo.username, "Đăng xuất thành công")
            setLoading(false);
            navigate("/login");
        }, 1000)
    };

  return (
    <>
        <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
            <Navbar.Brand as={NavLink} to="/">
                <img
                    src={logo}
                    alt="Quản Lý Kho"
                    height="40" // Thay đổi kích thước theo nhu cầu
                    className="d-inline-block align-top"
                />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
                <Nav.Link as={NavLink} to="/">🏠 Trang chủ</Nav.Link>
                <Nav.Link as={NavLink} to="/inventory">📦 Kho hàng</Nav.Link>
                <Nav.Link as={NavLink} to="/logs">📜 Nhật ký</Nav.Link>
                <Nav.Link as={NavLink} to="/reports">📊 Báo cáo</Nav.Link>
                <Nav.Link as={NavLink} to="/suppliers">🚚 Nhà cung cấp</Nav.Link>
                {/* Hiển thị ngày giờ */}
                <div className="d-flex align-items-center justify-content-center flex-grow-1 gap-2">
                    <span className="text-light">
                        🕒 {currentTime.toLocaleString("vi-VN")}
                    </span>
                    {
                        userInfo.username && (
                            <Dropdown align="end">
                            <Dropdown.Toggle variant="secondary" id="user-dropdown">
                                👤 {userInfo.username} - {userInfo.role}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => setShowModal(true)}>
                                🚪 Đăng xuất
                                </Dropdown.Item>
                            </Dropdown.Menu>
                            </Dropdown>
                        )
                    }
                </div>
            </Nav>
            </Navbar.Collapse>
        </Container>
        </Navbar>
        <ConfirmationModal
            show={showModal}
            onHide={() => setShowModal(false)}
            title="Xác nhận đăng xuất"
            message="Bạn có chắc chắn muốn đăng xuất không?"
            onConfirm={handleLogout}
            loading={loading}
        />
    </>
  );
};

export default Header;
