import React, { useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { addProduct } from "../api/warehouseAPI";
import { toast } from "react-toastify";
import { activityLogger } from "../utils/activityLogger";

const ProductForm = ({ show, onHide, onProductAdded, suppliers }) => {
  const [formData, setFormData] = useState({
    productid: "", // Người dùng tự kiểm soát productID
    productname: "",
    unit: "",
    price: "",
    quantity: "",
    supplierid: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addProduct(formData);
      onProductAdded(); // Refresh danh sách sản phẩm
      onHide(); // Đóng modal
      toast.success("Thêm sản phẩm thành công!");
      setFormData({
        productid: "",
        productname: "",
        unit: "",
        price: "",
        quantity: "",
        supplierid: "",
      });
      activityLogger(`Thêm sản phẩm ${formData.productid} thành công`);
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Thêm thất bại! Lỗi không xác định.";
      toast.error(errorMessage);
      activityLogger("Thêm sản phẩm mới thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleModalHide = () => {
    if (!loading) {
      setFormData({
        productid: "",
        productname: "",
        unit: "",
        price: "",
        quantity: "",
        supplierid: "",
      });
      onHide();
    }
  };

  return (
    <Modal show={show} onHide={handleModalHide} centered>
      <Modal.Header closeButton={!loading}>
        <Modal.Title>➕ Thêm Sản Phẩm</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>ID Sản Phẩm</Form.Label>
            <Form.Control
              type="text"
              name="productid"
              value={formData.productid}
              onChange={handleChange}
              required
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
            <Button variant="secondary" onClick={handleModalHide} disabled={loading}>
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

export default ProductForm;