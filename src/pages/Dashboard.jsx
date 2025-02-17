import React, { useState, useEffect } from "react";
import { Card, Button, Row, Col, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Line, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import TakeProductModal from "../components/TakeProductModal";
import { getInventory, getTotalQuantity } from "../api/erpAPI";

ChartJS.register(CategoryScale,ArcElement, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, zoomPlugin);

const Dashboard = () => {
  const navigate = useNavigate();
  const [inventory, setInventory] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState(0);
  const [outOfStockProducts, setOutOfStockProducts] = useState(0);
  const [showTakeModal, setShowTakeModal] = useState(false);
  const [records, setRecords] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const inventoryData = await getInventory();
        const getTotalQuantityData = await getTotalQuantity();
        const getLowStockProductsData = await getInventory({ minQty: 1, maxQty: 1 });
        const getOutOfStockProductsData = await getInventory({ maxQty: 0 });
        // const suppliersData = await getSuppliers();
        if (Array.isArray(getLowStockProductsData.data)) {
          setLowStockProducts(getLowStockProductsData.totalRecords);
        }
        if (Array.isArray(getOutOfStockProductsData.data)) {
          setOutOfStockProducts(getOutOfStockProductsData.totalRecords);
        }
        if (inventoryData.totalRecords) {
          setRecords(inventoryData.totalRecords);
        }
        if (getTotalQuantityData) {
          setTotalProducts(getTotalQuantityData);
        }
        if (Array.isArray(inventoryData.data)) {
          setInventory(inventoryData.data);
        } else {
          console.error("Dữ liệu trả về không hợp lệ:", inventoryData);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
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
  // const chartData = {
  //   labels: limitedInventory.map(product => abbreviateName(product.PRODUCT_NAME)),
  //   datasets: [
  //     {
  //       label: "Số lượng sản phẩm",
  //       data: limitedInventory.map(product => product.QTY_AVAILABLE),
  //       backgroundColor: "rgba(75,192,192,0.4)",
  //       borderColor: "rgba(75,192,192,1)",
  //       borderWidth: 2,
  //       pointRadius: 5, // Điểm trên biểu đồ
  //     },
  //   ],
  // };
  const chartData = {
    labels: ['Sản phẩm hết hàng', 'Sản phẩm sắp hết', 'Sản phẩm còn lại'],
    datasets: [{
      data: [outOfStockProducts, lowStockProducts, totalProducts - outOfStockProducts - lowStockProducts],
      backgroundColor: ['#FF4B5C', '#FFB144', '#28A745'],
      hoverOffset: 4,
    }]
  };

  // Cấu hình biểu đồ
  // const chartOptions = {
  //   responsive: true,
  //   maintainAspectRatio: false,
  //   scales: {
  //     x: {
  //       ticks: {
  //         autoSkip: false, // Không bỏ qua nhãn trục x
  //       },
  //     },
  //     y: {
  //       beginAtZero: true,
  //     },
  //   },
  //   plugins: {
  //     zoom: {
  //       pan: {
  //         enabled: true,
  //         mode: "x", // Chỉ kéo ngang
  //       },
  //       zoom: {
  //         wheel: {
  //           enabled: true, // Zoom bằng cuộn chuột
  //         },
  //         pinch: {
  //           enabled: true, // Zoom bằng cảm ứng
  //         },
  //         mode: "x",
  //       },
  //     },
  //   },
  // };
  const chartOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw}`;
          }
        }
      },
    }
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
                  <h3 className="fw-bold text-primary">{records}</h3>
                </Col>
                <Col>
                  <h5 className="text-muted">Sản phẩm tồn kho</h5>
                  <h3 className="fw-bold text-success">{totalProducts}</h3>
                </Col>
                <Col>
                  <h5 className="text-muted">Sản phẩm hết hàng</h5>
                  <h3 className="fw-bold text-danger">{outOfStockProducts}</h3>
                </Col>
                <Col>
                  <h5 className="text-muted">Sản phẩm sắp hết hàng</h5>
                  <h3 className="fw-bold text-warning">{lowStockProducts}</h3>
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

      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Thống kê tình trạng kho</Card.Title>
              <Doughnut data={chartData} options={chartOptions} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Biểu đồ số lượng tồn kho</Card.Title>
              <div style={{ minWidth: "1200px", height: "400px" }}>
                <Line data={chartData} options={chartOptions} />
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