import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css"; // Import Bootstrap Icons
import styles from "../styles/Footer.module.css"

const Footer = () => {
  return (
    <footer className="bg-dark text-light text-center py-3">
      <Container>
        <Row>
          <Col>
            <p>© {new Date().getFullYear()} Quản Lý Kho. All rights reserved.</p>
          </Col>
        </Row>
        <Row>
          <Col className="d-flex justify-content-center align-items-center">
            <span className="me-2">Developed by</span>
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
