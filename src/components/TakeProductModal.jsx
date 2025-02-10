import { useState, useEffect } from "react";
import { Modal, Button, Form, Table } from "react-bootstrap";
import { updateProduct, saveOrder } from "../api/warehouseAPI";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

const TakeProductModal = ({ show, handleClose, inventory }) => {
  const [productID, setProductID] = useState("");
  const [quantity, setQuantity] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderData, setOrderData] = useState(null); // Lưu đơn hàng xem trước
  const [showPreview, setShowPreview] = useState(false); // Kiểm soát hiển thị modal preview
  const [countdown, setCountdown] = useState(300); // Đếm ngược 5 phút



  useEffect(() => {
    let timer;
    if (showPreview && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setShowPreview(false);
      setOrderData(null);
      toast.info("Hết thời gian xác nhận, đơn xuất kho đã bị hủy! ⏳");
    }

    return () => clearInterval(timer);
  }, [showPreview, countdown]);

  const handleCheckProduct = () => {
    const product = inventory.find((item) => String(item.productid) === String(productID));
    if (product) {
      setSelectedProduct(product);
      setQuantity("");
    } else {
      toast.error("Mã sản phẩm không tồn tại!");
    }
  };

  const handlePreviewOrder = () => {
    if (!selectedProduct || !quantity) return;
    if (selectedProduct.quantity - parseInt(quantity) < 0) return;

    // Lấy token từ sessionStorage
    const token = sessionStorage.getItem("token");
    if (!token) {
      toast.error("Lỗi: Không tìm thấy token! ❌");
      return;
    }

    try {
      const decoded = jwtDecode(token); // Giải mã token

      setOrderData({
        employee_name: decoded.fullname,
        employee_id: decoded.username,
        role: decoded.role,
        productid: selectedProduct.productid,
        productname: selectedProduct.productname,
        quantity: parseInt(quantity),
        timestamp: new Date().toISOString(),
      });

      setCountdown(300); // Reset countdown
      setShowPreview(true); // Mở modal xem trước đơn hàng

    } catch (error) {
      toast.error("Lỗi khi giải mã token!");
    }
  };

  const handleConfirmOrder = async () => {
    if (!orderData) return;

    try {
      // Cập nhật số lượng sản phẩm
      const updatedProduct = {
        productname: selectedProduct.productname,
        unit: selectedProduct.unit,
        price: selectedProduct.price,
        quantity: selectedProduct.quantity - orderData.quantity,
        supplierid: selectedProduct.supplierid,
      };

      await updateProduct(orderData.productid, updatedProduct);
      await saveOrder(orderData);

      toast.success("Lấy hàng thành công! ✅");

      setShowPreview(false); // Đóng modal preview
      handleClose(); // Đóng modal chính
    } catch (error) {
      toast.error("Lỗi khi xử lý đơn xuất kho ❌");
    }
  };

  return (
    <>
      {/* Modal nhập thông tin lấy hàng */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Lấy hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nhập mã sản phẩm</Form.Label>
            <Form.Control
              type="text"
              value={productID}
              onChange={(e) => setProductID(e.target.value)}
              autoFocus
            />
          </Form.Group>
          <Button variant="info" className="mb-3 w-100" onClick={handleCheckProduct} disabled={!productID}>
            Kiểm tra
          </Button>

          {selectedProduct && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Số lượng lấy (Tối đa: {selectedProduct.quantity})</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  max={selectedProduct.quantity}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </Form.Group>
              <Button variant="warning" className="w-100" onClick={handlePreviewOrder} disabled={!quantity}>
                🔍 Xem trước đơn hàng
              </Button>
            </>
          )}
        </Modal.Body>
      </Modal>

      {/* Modal xem trước đơn hàng */}
      <Modal show={showPreview} onHide={() => setShowPreview(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>🔍 Xem trước đơn xuất kho</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {orderData && (
            <Table striped bordered hover>
              <tbody>
                <tr>
                  <td><strong>Nhân viên</strong></td>
                  <td>{orderData.employee_name} ({orderData.role})</td>
                </tr>
                <tr>
                  <td><strong>Mã NV</strong></td>
                  <td>{orderData.employee_id}</td>
                </tr>
                <tr>
                  <td><strong>Sản phẩm</strong></td>
                  <td>{orderData.productname} (ID: {orderData.productid})</td>
                </tr>
                <tr>
                  <td><strong>Số lượng</strong></td>
                  <td>{orderData.quantity}</td>
                </tr>
                <tr>
                  <td><strong>Thời gian</strong></td>
                  <td>{new Date(orderData.timestamp).toLocaleString()}</td>
                </tr>
                <tr>
                  <td><strong>Thời gian còn lại</strong></td>
                  <td>{Math.floor(countdown / 60)} phút {countdown % 60} giây</td>
                </tr>
              </tbody>
            </Table>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPreview(false)}>❌ Hủy</Button>
          <Button variant="primary" onClick={handleConfirmOrder}>✅ Xác nhận</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TakeProductModal;
