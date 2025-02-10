import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const AddProductModal = ({ show, onHide, onAddQuantity, product }) => {
  const [quantity, setQuantity] = useState(0);

  const handleAdd = () => {
    onAddQuantity(product.productid, quantity);
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Thêm số lượng sản phẩm</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formQuantity">
            <Form.Label>Số lượng</Form.Label>
            <Form.Control
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              min="1"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Hủy
        </Button>
        <Button variant="primary" onClick={handleAdd}>
          Thêm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddProductModal;