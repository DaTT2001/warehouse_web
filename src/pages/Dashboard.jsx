import React, { useState, useEffect, useContext } from "react";
import { Card, Button, Row, Col, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import TakeProductModal from "../components/TakeProductModal";
import { getInventory } from "../api/erpAPI";
import { LanguageContext } from "../services/LanguageContext"; 
import locales from "../locales";

// Register ChartJS plugins
ChartJS.register(CategoryScale, ArcElement, LinearScale, BarElement, Title, Tooltip, Legend, zoomPlugin, ChartDataLabels);

const Dashboard = () => {
  const navigate = useNavigate();
  const [lowStockProducts, setLowStockProducts] = useState(0);
  const [outOfStockProducts, setOutOfStockProducts] = useState(0);
  const [showTakeModal, setShowTakeModal] = useState(false);
  const [records, setRecords] = useState(0);
  const { language } = useContext(LanguageContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const inventoryData = await getInventory();
        const getLowStockProductsData = await getInventory({ minQty: 1, maxQty: 1 });
        const getOutOfStockProductsData = await getInventory({ maxQty: 0 });

        if (Array.isArray(getLowStockProductsData.data)) {
          setLowStockProducts(getLowStockProductsData.totalRecords);
        }
        if (Array.isArray(getOutOfStockProductsData.data)) {
          setOutOfStockProducts(getOutOfStockProductsData.totalRecords);
        }
        if (inventoryData.totalRecords) {
          setRecords(inventoryData.totalRecords);
        }
        if (Array.isArray(inventoryData.data)) {
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

  const chartData = {
    labels: [locales[language].outOfStock, locales[language].lowStock, locales[language].inStock],
    datasets: [{
      data: [outOfStockProducts, lowStockProducts, records - outOfStockProducts - lowStockProducts],
      backgroundColor: ['#FF4B5C', '#FFB144', '#28A745'],
      hoverOffset: 4,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw}`;
          }
        }
      },
      datalabels: {
        formatter: (value, context) => {
          const total = context.chart.data.datasets[0].data.reduce((acc, val) => acc + val, 0);
          const percentage = ((value / total) * 100).toFixed(2) + '%';
          return percentage;
        },
        color: '#fff',
        font: {
          weight: 'bold'
        }
      }
    }
  };

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col md={12}>
          <Card className="p-4 shadow-sm">
            <Card.Body>
              <Card.Title className="text-center fw-bold fs-4">{locales[language].warehouseDetail}</Card.Title>
              <Row className="text-center">
                <Col>
                  <h5 className="text-muted">{locales[language].productType}</h5>
                  <h3 className="fw-bold text-primary">{records}</h3>
                </Col>
                <Col>
                  <h5 className="text-muted">{locales[language].totalProducts}</h5>
                  <h3 className="fw-bold text-success">{records - outOfStockProducts - lowStockProducts}</h3>
                </Col>
                <Col>
                  <h5 className="text-muted">{locales[language].outOfStockProducts}</h5>
                  <h3 className="fw-bold text-danger">{outOfStockProducts}</h3>
                </Col>
                <Col>
                  <h5 className="text-muted">{locales[language].lowStockProducts}</h5>
                  <h3 className="fw-bold text-warning">{lowStockProducts}</h3>
                </Col>
              </Row>
              <div className="d-flex justify-content-center gap-3 mt-4">
                <Button variant="primary" size="lg" onClick={() => handleNavigate("/inventory")}>
                 {locales[language].manage}
                </Button>
                <Button variant="warning" size="lg" onClick={() => setShowTakeModal(true)}>
                {locales[language].export}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* Biểu đồ thống kê */}
      <Row className="mb-4">
        <Col md={12}>
          <Card>
            <Card.Body>
              <Card.Title>{locales[language].warehouseStatus}</Card.Title>
              <div style={{ width: "100%", height: "300px" }}>
                <Doughnut data={chartData} options={chartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* Modal lấy hàng */}
      <TakeProductModal show={showTakeModal} handleClose={() => setShowTakeModal(false)} />
    </Container>
  );
};

export default Dashboard;