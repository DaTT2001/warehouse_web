import { useState, useEffect } from "react";
import { Modal, Button, Form, Table } from "react-bootstrap";
import { getInventoryByID, updateProductQuantity } from "../api/erpAPI";
import { saveOrder } from "../api/warehouseAPI";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { activityLogger } from "../utils/activityLogger";

const TakeProductModal = ({ show, handleClose }) => {
  const [productID, setProductID] = useState("");
  const [quantity, setQuantity] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderData, setOrderData] = useState(null); // Lưu đơn hàng xem trước
  const [showPreview, setShowPreview] = useState(false); // Kiểm soát hiển thị modal preview
  const [countdown, setCountdown] = useState(300); // Đếm ngược 5 phút
  const [isProductIDDisabled, setIsProductIDDisabled] = useState(false); // Trạng thái disable của ô nhập mã sản phẩm

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

  const handleCheckProduct = async () => {
    try {
      const product = await getInventoryByID(productID);
      if (product) {
        setSelectedProduct(product);
        console.log(product);
        
        setQuantity("");
        setIsProductIDDisabled(true); // Disable ô nhập mã sản phẩm
      } else {
        toast.error("Mã sản phẩm không tồn tại!");
      }
    } catch (error) {
      toast.error("Lỗi khi lấy thông tin sản phẩm!");
    }
  };

  const handlePreviewOrder = () => {
    if (!selectedProduct || !quantity) return;
    if (selectedProduct.qty_available - parseInt(quantity) < 0) return;

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
        productid: selectedProduct.PRODUCT_ID,
        productname: selectedProduct.PRODUCT_NAME,
        quantity: parseInt(quantity),
        timestamp: new Date().toISOString(),
        type: "Export",
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
      await updateProductQuantity(orderData.productid, orderData.quantity);
      await saveOrder(orderData);
      console.log(orderData);
      
      // await updateProductQuantity(orderData.productid, orderData.quantity);
      toast.success("Lấy hàng thành công! ✅");
      activityLogger(`Lấy sản phẩm ${orderData.productid} số lượng  ${orderData.quantity} thành công`);
      setShowPreview(false); // Đóng modal preview
      handleClose(); // Đóng modal chính
      resetForm(); // Reset form
    } catch (error) {
      toast.error("Lỗi khi xử lý đơn xuất kho ❌");
    }
  };

  const resetForm = () => {
    setProductID("");
    setQuantity("");
    setSelectedProduct(null);
    setOrderData(null);
    setShowPreview(false);
    setCountdown(300);
    setIsProductIDDisabled(false);
  };

  return (
    <>
      {/* Modal nhập thông tin lấy hàng */}
      <Modal show={show} onHide={() => { handleClose(); resetForm(); }} centered>
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
              disabled={isProductIDDisabled} // Disable ô nhập mã sản phẩm nếu đã kiểm tra
            />
          </Form.Group>
          <Button variant="info" className="mb-3 w-100" onClick={handleCheckProduct} disabled={!productID}>
            Kiểm tra
          </Button>

          {selectedProduct && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Số lượng lấy (Tối đa: {selectedProduct.QTY_AVAILABLE})</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
                {parseInt(quantity) > selectedProduct.QTY_AVAILABLE && (
                  <Form.Text className="text-danger">
                    Số lượng nhập vào vượt quá số lượng tối đa!
                  </Form.Text>
                )}
              </Form.Group>
              <Button
                variant="warning"
                className="w-100"
                onClick={handlePreviewOrder}
                disabled={!quantity || parseInt(quantity) > selectedProduct.QTY_AVAILABLE}
              >
                🔍 Xem trước đơn hàng
              </Button>
            </>
          )}
        </Modal.Body>
      </Modal>

      {/* Modal xem trước đơn hàng */}
      <Modal show={showPreview} onHide={() => { setShowPreview(false); resetForm(); }} centered>
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
          <Button variant="secondary" onClick={() => { setShowPreview(false); resetForm(); handleClose() }}>❌ Hủy</Button>
          <Button variant="primary" onClick={handleConfirmOrder}>✅ Xác nhận</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TakeProductModal;