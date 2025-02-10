import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { updateSupplier } from "../api/warehouseAPI";
import { toast } from "react-toastify";
import { activityLogger } from "../utils/activityLogger";

const EditSupplierForm = ({ show, onHide, onSupplierUpdated, initialData }) => {
  const [formData, setFormData] = useState({
    suppliername: "",
    contactname: "",
    phone: "",
    email: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log(initialData);
    try {
      await updateSupplier(formData.supplierid, formData);
      onSupplierUpdated(); // Refresh danh sách nhà cung cấp
      onHide(); // Đóng modal
      toast.success("Cập nhật nhà cung cấp thành công!");
      activityLogger(`Sửa nhà cung cấp ${formData.suppliername} thành công`);
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Cập nhật thất bại! Lỗi không xác định.";
      activityLogger(`Sửa nhà cung cấp ${formData.suppliername} thất bại`);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={!loading ? onHide : null} centered>
      <Modal.Header closeButton={!loading}>
        <Modal.Title>✏️ Chỉnh Sửa Nhà Cung Cấp</Modal.Title>
      </Modal.Header>
      <Modal.Body>
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
              {loading ? <Spinner animation="border" size="sm" /> : "💾 Lưu"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditSupplierForm;