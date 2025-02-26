import { useState, useEffect, useContext } from "react";
import { Modal, Button, Form, Table } from "react-bootstrap";
import { generateUniqueOrderID, getEmployeeData, getInventoryByID, insertData, insertINBData } from "../api/erpAPI";
import { saveOrder } from "../api/warehouseAPI";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { activityLogger } from "../utils/activityLogger";
import { getCurrentTimeString } from "../utils/functions";
import { sendOrderEmail } from "../api/emailAPI";
import { LanguageContext } from "../services/LanguageContext";
import locales from "../locales";

const TakeProductModal = ({ show, handleClose }) => {
  const { language } = useContext(LanguageContext);
  const [productID, setProductID] = useState("");
  const [quantity, setQuantity] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderData, setOrderData] = useState(null); // Lưu đơn hàng xem trước
  const [showPreview, setShowPreview] = useState(false); // Kiểm soát hiển thị modal preview
  const [countdown, setCountdown] = useState(300); // Đếm ngược 5 phút
  const [isProductIDDisabled, setIsProductIDDisabled] = useState(false); // Trạng thái disable của ô nhập mã sản phẩm
  // const [employeeData, setEmployeeData] = useState(null);

  useEffect(() => {
    let timer;
    if (showPreview && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setShowPreview(false);
      setOrderData(null);
      toast.info(locales[language].confirmationTimeout);
    }

    return () => clearInterval(timer);
  }, [showPreview, countdown, language]);

  const handleCheckProduct = async () => {
    try {
      const product = await getInventoryByID(productID);
      if (product) {
        setSelectedProduct(product);
        console.log(product);
        
        setQuantity("");
        setIsProductIDDisabled(true); // Disable ô nhập mã sản phẩm
      } else {
        toast.error(locales[language].productNotFound);
      }
    } catch (error) {
      toast.error(locales[language].productFetchError);
    }
  };

  const handlePreviewOrder = () => {
    if (!selectedProduct || !quantity) return;
    if (selectedProduct.qty_available - parseInt(quantity) < 0) return;

    // Lấy token từ sessionStorage
    const token = sessionStorage.getItem("token");
    if (!token) {
      toast.error(locales[language].tokenNotFound);
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
        type: "Export"
      });

      setCountdown(300); // Reset countdown
      setShowPreview(true); // Mở modal xem trước đơn hàng

    } catch (error) {
      toast.error(locales[language].tokenDecodeError);
    }
  };

  const handleConfirmOrder = async () => {
    if (!orderData) {
      toast.error(locales[language].invalidOrderData);
      return;
    }
    try {
      console.log(locales[language].processingOrder, orderData);
      // Bước 1: Sinh mã đơn hàng mới
      const orderID = await generateUniqueOrderID();
      console.log(locales[language].orderID, orderID);
      const newOrderData = { ...orderData, erp_order_id: orderID };
      console.log(newOrderData); // Kiểm tra lại dữ liệu trước khi gửi
      await saveOrder(newOrderData);

      // Bước 2: Lấy thông tin nhân viên (CHẮC CHẮN phải có await)
      const employeeData = await getEmployeeData(orderData.employee_id);
      if (!employeeData || !employeeData.deptID) {
        console.error(locales[language].employeeDataNotFound);
        toast.error(locales[language].employeeDataError);
        return;
      }
      console.log(locales[language].employeeInfo, employeeData);

      // Bước 3: Đảm bảo dữ liệu đã có trước khi insert
      const deptID = employeeData.deptID;
      const employeeID = orderData.employee_id;
      const timeString = getCurrentTimeString();
      console.log(locales[language].dataToInsert, { orderID, deptID, employeeID, timeString });

      // Bước 4: Insert dữ liệu (CHẮC CHẮN phải có await)
      await insertData(orderID, deptID, employeeID, timeString);
      await insertINBData(orderID, orderData.productid, orderData.quantity, selectedProduct.UNIT);
      await sendOrderEmail(orderID, orderData.productid, orderData.productname, orderData.quantity, orderData.timestamp, orderData.employee_id, orderData.employee_name); // Gửi email thông báo
      // Hiển thị thông báo thành công
      toast.success(locales[language].orderSuccess);

      // Ghi log hoạt động
      activityLogger(`${locales[language].logProductTaken} ${orderData.productid} ${locales[language].quantity} ${orderData.quantity} ${locales[language].success}`);

      // Đóng modal & reset form
      setShowPreview(false);
      handleClose();
      resetForm();
    } catch (error) {
      console.error(locales[language].orderProcessingError, error);
      toast.error(locales[language].orderProcessingError);
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
          <Modal.Title>{locales[language].takeProduct}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>{locales[language].enterProductID}</Form.Label>
            <Form.Control
              type="text"
              value={productID}
              onChange={(e) => setProductID(e.target.value)}
              autoFocus
              disabled={isProductIDDisabled} // Disable ô nhập mã sản phẩm nếu đã kiểm tra
            />
          </Form.Group>
          <Button variant="info" className="mb-3 w-100" onClick={handleCheckProduct} disabled={!productID}>
            {locales[language].check}
          </Button>

          {selectedProduct && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>{locales[language].quantityToTake} ({locales[language].max}: {selectedProduct.QTY_AVAILABLE})</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
                {parseInt(quantity) > selectedProduct.QTY_AVAILABLE && (
                  <Form.Text className="text-danger">
                    {locales[language].quantityExceeds}
                  </Form.Text>
                )}
              </Form.Group>
              <Button
                variant="warning"
                className="w-100"
                onClick={handlePreviewOrder}
                disabled={!quantity || parseInt(quantity) > selectedProduct.QTY_AVAILABLE}
              >
                🔍 {locales[language].previewOrder}
              </Button>
            </>
          )}
        </Modal.Body>
      </Modal>

      {/* Modal xem trước đơn hàng */}
      <Modal show={showPreview} onHide={() => { setShowPreview(false); resetForm(); }} centered>
        <Modal.Header closeButton>
          <Modal.Title>🔍 {locales[language].previewOrder}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {orderData && (
            <Table striped bordered hover>
              <tbody>
                <tr>
                  <td><strong>{locales[language].employee}</strong></td>
                  <td>{orderData.employee_name} ({orderData.role})</td>
                </tr>
                <tr>
                  <td><strong>{locales[language].employeeID}</strong></td>
                  <td>{orderData.employee_id}</td>
                </tr>
                <tr>
                  <td><strong>{locales[language].product}</strong></td>
                  <td>{orderData.productname} (ID: {orderData.productid})</td>
                </tr>
                <tr>
                  <td><strong>{locales[language].quantity}</strong></td>
                  <td>{orderData.quantity} {selectedProduct.UNIT}</td>
                </tr>
                <tr>
                  <td><strong>{locales[language].time}</strong></td>
                  <td>{new Date(orderData.timestamp).toLocaleString()}</td>
                </tr>
                <tr>
                  <td><strong>{locales[language].timeRemaining}</strong></td>
                  <td>{Math.floor(countdown / 60)} {locales[language].minutes} {countdown % 60} {locales[language].seconds}</td>
                </tr>
              </tbody>
            </Table>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setShowPreview(false); resetForm(); handleClose() }}>❌ {locales[language].cancel}</Button>
          <Button variant="primary" onClick={handleConfirmOrder}>✅ {locales[language].confirm}</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TakeProductModal;