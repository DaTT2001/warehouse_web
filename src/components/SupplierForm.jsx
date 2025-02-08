import React, { useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { addSupplier } from "../api/warehouseAPI";
import { toast } from "react-toastify";

const SupplierForm = ({ show, onHide, onSupplierAdded }) => {
  const [formData, setFormData] = useState({
    suppliername: "",
    contactname: "",
    phone: "",
    email: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // setError(null);
    try {
      await addSupplier(formData);
      onSupplierAdded(); // Refresh danh sách nhà cung cấp
      onHide(); // Đóng modal
      toast.success("Thêm nhà cung cấp thành công!");
      setFormData({
        suppliername: "",
        contactname: "",
        phone: "",
        email: "",
        address: "",
      })
    } catch (err) {
    //   setError("Thêm nhà cung cấp thất bại. Vui lòng thử lại!");
      const errorMessage = err.response?.data?.error || "Thêm thất bại! Lỗi không xác định.";
      toast.error(errorMessage);
    //   onHide(); // Đóng modal
    } finally {
      setLoading(false);
    //   onHide();
    }
  };

  return (
    <Modal show={show} onHide={!loading ? onHide : null} centered>
      <Modal.Header closeButton={!loading}>
        <Modal.Title>➕ Thêm Nhà Cung Cấp</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* {error && <p className="text-danger">{error}</p>} */}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Tên Nhà Cung Cấp</Form.Label>
            <Form.Control
              type="text"
              name="suppliername"
              value={formData.suppliername}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Người Liên Hệ</Form.Label>
            <Form.Control
              type="text"
              name="contactname"
              value={formData.contactname}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Điện Thoại</Form.Label>
            <Form.Control
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Địa Chỉ</Form.Label>
            <Form.Control
              as="textarea"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </Form.Group>
          <Modal.Footer>
            <Button variant="secondary" onClick={onHide} disabled={loading}>
              ❌ Hủy
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : "✅ Thêm"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default SupplierForm;