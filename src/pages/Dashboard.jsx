import React, { useState, useEffect } from "react";
import { Card, Button, Row, Col, Container, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getProducts, getSuppliers } from "../api/warehouseAPI";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import TakeProductModal from "../components/TakeProductModal";


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, zoomPlugin);

const Dashboard = () => {
  const navigate = useNavigate();
  const [inventory, setInventory] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [showTakeModal, setShowTakeModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const inventoryData = await getProducts();
      const suppliersData = await getSuppliers();
      setInventory(inventoryData);
      setSuppliers(suppliersData);
      setTotalQuantity(inventoryData.reduce((acc, product) => acc + product.quantity, 0));
      setLowStockProducts(inventoryData.filter(product => product.quantity < 10));
    };

    fetchData();
  }, []);

  const handleNavigate = (path) => {
    navigate(path);
  };

  const abbreviateName = (name, maxLength = 20) => {
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength) + "...";
  };

  // Giới hạn số sản phẩm ban đầu
  const limitedInventory = inventory; // Hiển thị tất cả sản phẩm


  // Dữ liệu cho biểu đồ
  const chartData = {
    labels: limitedInventory.map(product => abbreviateName(product.productname)),
    datasets: [
      {
        label: "Số lượng sản phẩm",
        data: limitedInventory.map(product => product.quantity),
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 2,
        pointRadius: 5, // Điểm trên biểu đồ
      },
    ],
  };

  // Cấu hình biểu đồ
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          autoSkip: false, // Không bỏ qua nhãn trục x
        },
      },
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      zoom: {
        pan: {
          enabled: true,
          mode: "x", // Chỉ kéo ngang
        },
        zoom: {
          wheel: {
            enabled: true, // Zoom bằng cuộn chuột
          },
          pinch: {
            enabled: true, // Zoom bằng cảm ứng
          },
          mode: "x",
        },
      },
    },
  };

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col md={12}>
          <Card className="p-4 shadow-sm">
            <Card.Body>
              <Card.Title className="text-center fw-bold fs-4">Tổng quan kho</Card.Title>
              <Row className="text-center">
                <Col>
                  <h5 className="text-muted">Loại sản phẩm</h5>
                  <h3 className="fw-bold text-primary">{inventory.length}</h3>
                </Col>
                <Col>
                  <h5 className="text-muted">Sản phẩm tồn kho</h5>
                  <h3 className="fw-bold text-success">{totalQuantity}</h3>
                </Col>
                <Col>
                  <h5 className="text-muted">Nhà cung cấp</h5>
                  <h3 className="fw-bold text-danger">{suppliers.length}</h3>
                </Col>
              </Row>
              <div className="d-flex justify-content-center gap-3 mt-4">
                <Button variant="primary" size="lg" onClick={() => handleNavigate("/inventory")}>
                  Quản lý kho
                </Button>
                <Button variant="warning" size="lg" onClick={() => setShowTakeModal(true)}>
                  Xuất kho
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {lowStockProducts.length > 0 && (
        <Alert variant="danger">
          <strong>Chú ý!</strong> Có {lowStockProducts.length} sản phẩm sắp hết hàng.
        </Alert>
      )}

      {/* Biểu đồ thống kê */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Thống kê số lượng sản phẩm</Card.Title>
              <div style={{ width: "100%", overflowX: "auto", padding: "10px" }}>
                <div style={{ minWidth: "1200px", height: "400px" }}> {/* Min-width giúp tạo thanh cuộn */}
                  <Line data={chartData} options={chartOptions} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* Modal lấy hàng */}
      <TakeProductModal show={showTakeModal} handleClose={() => setShowTakeModal(false)} inventory={inventory} />
    </Container>
  );
};

export default Dashboard;