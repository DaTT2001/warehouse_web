import React from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import locales from "../locales"; // Import file dịch

const ConfirmationModal = ({ show, onHide, title, message, onConfirm, loading, language }) => {
  return (
    <Modal show={show} onHide={!loading ? onHide : null} centered>
      <Modal.Header closeButton={!loading}>
        <Modal.Title>{title || locales[language].confirmation || "Xác nhận"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" role="status" />
            <p className="mt-2">{locales[language].processing || "Đang xử lý..."}</p>
          </div>
        ) : (
          <p>{message || locales[language].confirmQuestion || "Bạn có chắc chắn không?"}</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          ❌ {locales[language].no || "Không"}
        </Button>
        <Button variant="danger" onClick={onConfirm} disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : `✅ ${locales[language].yes || "Có"}`}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationModal;