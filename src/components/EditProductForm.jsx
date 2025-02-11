// src/components/EditProductForm.jsx
import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { updateProduct } from "../api/warehouseAPI";
import { toast } from "react-toastify";
import { activityLogger } from "../utils/activityLogger";

const EditProductForm = ({ show, onHide, onProductUpdated, initialData, suppliers }) => {
  const [formData, setFormData] = useState({
    productid: "",
    productname: "",
    unit: "",
    price: "",
    quantity: "",
    supplierid: "",
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

    try {
      await updateProduct(formData.productid, formData);
      onProductUpdated();
      onHide();
      activityLogger(`Sửa sản phẩm ${formData.productid} thành công`);
      toast.success("Cập nhật sản phẩm thành công!");
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Cập nhật thất bại! Lỗi không xác định.";
        activityLogger(`Sửa sản phẩm ${formData.productid} thất bại`);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={!loading ? onHide : null} centered>
      <Modal.Header closeButton={!loading}>
        <Modal.Title>✏️ Chỉnh Sửa Sản Phẩm</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>ID Sản Phẩm</Form.Label>
            <Form.Control
              type="text"
              name="productid"
              value={formData.productid}
              disabled
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Tên Sản Phẩm</Form.Label>
            <Form.Control
              type="text"
              name="productname"
              value={formData.productname}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Đơn Vị</Form.Label>
            <Form.Control
              type="text"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Giá</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              name="price"
              value={formData.price}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Số Lượng</Form.Label>
            <Form.Control
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Nhà Cung Cấp</Form.Label>
            <Form.Select
              name="supplierid"
              value={formData.supplierid}
              onChange={handleChange}
              required
            >
              <option value="">-- Chọn Nhà Cung Cấp --</option>
              {suppliers.map((supplier) => (
                <option key={supplier.supplierid} value={supplier.supplierid}>
                  {supplier.suppliername}
                </option>
              ))}
            </Form.Select>
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

export default EditProductForm;