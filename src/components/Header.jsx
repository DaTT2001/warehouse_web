import React, { useState, useEffect, useContext } from "react";
import { Navbar, Nav, Container, Dropdown } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/images/KD logo tách nềnn.png";
import ConfirmationModal from "./ConfirmationModal";
import { jwtDecode } from "jwt-decode";
import { sendLog } from "../utils/functions";
import locales from "../locales"; // Import file dịch
import { LanguageContext } from "../services/LanguageContext"; 

const Header = () => {
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userInfo, setUserInfo] = useState({ username: "", role: "" });
    const { language, setLanguage } = useContext(LanguageContext);
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUserInfo({ username: decoded.username, role: decoded.role });
            } catch (error) {
                console.error("Lỗi khi giải mã token:", error);
            }
        }
    }, []);

    const handleLogout = () => {
        setLoading(true);
        setTimeout(() => {
            sessionStorage.removeItem("token");
            sendLog(userInfo.username, locales[language].logoutSuccess);
            setLoading(false);
            navigate("/login");
        }, 1000);
    };

    const handleLanguageChange = async (lang) => {
      await setLanguage(lang);
      window.location.reload();
    };

    return (
        <>
            <Navbar bg="dark" variant="dark" expand="lg">
                <Container>
                    <Navbar.Brand as={NavLink} to="/">
                        <img
                            src={logo}
                            alt="Quản Lý Kho"
                            height="40"
                            className="d-inline-block align-top"
                        />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <Nav.Link as={NavLink} to="/">🏠 {locales[language].home}</Nav.Link>
                            <Nav.Link as={NavLink} to="/inventory">📦 {locales[language].inventory}</Nav.Link>
                            <Nav.Link as={NavLink} to="/logs">📜 {locales[language].logs}</Nav.Link>
                            <Nav.Link as={NavLink} to="/reports">📊 {locales[language].reports}</Nav.Link>
                            <div className="d-flex align-items-center justify-content-center flex-grow-1 gap-2">
                                {userInfo.username && (
                                    <Dropdown align="end">
                                        <Dropdown.Toggle variant="secondary" id="user-dropdown">
                                            👤 {userInfo.username} - {userInfo.role}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={() => setShowModal(true)}>
                                                🚪 {locales[language].logout}
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                )}
                                <Dropdown align="end">
                                    <Dropdown.Toggle variant="secondary" id="language-dropdown">
                                        🌐 {language === "vi" ? locales.vi.vietnamese : language === "en" ? locales.en.english : locales.zh.chinese}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => handleLanguageChange("vi")}>
                                            {locales.vi.vietnamese}
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={() => handleLanguageChange("en")}>
                                            {locales.en.english}
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={() => handleLanguageChange("zh")}>
                                            {locales.zh.chinese}
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <ConfirmationModal
                show={showModal}
                onHide={() => setShowModal(false)}
                title={locales[language].logout}
                message={locales[language].logoutConfirm}
                onConfirm={handleLogout}
                loading={loading}
                language = {language}
            />
        </>
    );
};

export default Header;
