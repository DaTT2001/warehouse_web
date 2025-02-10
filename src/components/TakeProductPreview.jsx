import { useEffect } from "react";
import { Modal, Button } from "react-bootstrap";

const TakeProductPreview = ({ orderData, onConfirm, onCancel }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onCancel(); // Hủy đơn sau 5 phút
    }, 300000); // 5 phút = 300000 ms

    return () => clearTimeout(timer);
  }, [onCancel]);

  return (
    <Modal show={!!orderData} onHide={onCancel}>
      <Modal.Header closeButton>
        <Modal.Title>🔍 Xem trước đơn hàng</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><strong>Nhân viên:</strong> {orderData?.employee_name} ({orderData?.role})</p>
        <p><strong>Mã NV:</strong> {orderData?.employee_id}</p>
        <p><strong>Sản phẩm:</strong> {orderData?.productname} (ID: {orderData?.productid})</p>
        <p><strong>Số lượng:</strong> {orderData?.quantity}</p>
        <p><strong>Thời gian:</strong> {new Date(orderData?.timestamp).toLocaleString()}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>❌ Hủy</Button>
        <Button variant="primary" onClick={onConfirm}>✅ Xác nhận</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TakeProductPreview;
