import React, { useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css"; // Import Bootstrap Icons
import styles from "../styles/Footer.module.css";
import { LanguageContext } from "../services/LanguageContext";

const locales = {
  vi: {
      warehouseManagement: "Quản Lý Kho",
      allRightsReserved: "Mọi quyền được bảo lưu.",
      developedBy: "Phát triển bởi"
  },
  en: {
      warehouseManagement: "Warehouse Management",
      allRightsReserved: "All rights reserved.",
      developedBy: "Developed by"
  },
  zh: {
      warehouseManagement: "仓库管理",
      allRightsReserved: "版权所有。",
      developedBy: "开发者"
  }
};


const Footer = () => {
  const { language } = useContext(LanguageContext);

  return (
    <footer className="bg-dark text-light text-center py-3">
      <Container>
        <Row>
          <Col>
            <p>© {new Date().getFullYear()} {locales[language].warehouseManagement}. {locales[language].allRightsReserved}</p>
          </Col>
        </Row>
        <Row>
          <Col className="d-flex justify-content-center align-items-center">
            <span className="me-2">{locales[language].developedBy}</span>
            <a
              href="https://github.com/DaTT2001"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-light d-flex align-items-center ${styles.footerLink}`}
            >
              <i className="bi bi-github me-1" style={{ fontSize: "1.2rem" }}></i>
              DaTT2001
            </a>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;