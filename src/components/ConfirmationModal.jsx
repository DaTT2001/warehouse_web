import React from "react";
import { Modal, Button, Spinner } from "react-bootstrap";

const ConfirmationModal = ({ show, onHide, title, message, onConfirm, loading }) => {
  return (
    <Modal show={show} onHide={!loading ? onHide : null} centered>
      <Modal.Header closeButton={!loading}>
        <Modal.Title>{title || "Xác nhận"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" role="status" />
            <p className="mt-2">Đang xử lý...</p>
          </div>
        ) : (
          <p>{message || "Bạn có chắc chắn không?"}</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          ❌ Không
        </Button>
        <Button variant="danger" onClick={onConfirm} disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : "✅ Có"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationModal;