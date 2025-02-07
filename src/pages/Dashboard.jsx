import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Table, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getProducts, getReports } from '../api/warehouseAPI'; // Các API lấy dữ liệu

const Dashboard = () => {
  const navigate = useNavigate();
  const [inventory, setInventory] = useState([]);
  const [reports, setReports] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(0);

  useEffect(() => {
    // Fetch dữ liệu khi trang được load
    const fetchData = async () => {
      const inventoryData = await getProducts(); // Lấy danh sách hàng trong kho
    //   console.log(inventoryData)
      const reportsData = await getReports(); // Lấy báo cáo kho
      setInventory(inventoryData);
      setReports(reportsData);
    //   const total = response.data.reduce((acc, product) => acc + product.quantity, 0);
        setTotalQuantity(inventoryData.reduce((acc, product) => acc + product.quantity, 0));
    };

    fetchData();
  }, []);

  // Điều hướng khi click vào các chức năng
  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        {/* Card tổng quan kho */}
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Tổng quan kho</Card.Title>
              <p><strong>Loại sản phẩm:</strong> {inventory.length}</p>
              <p><strong>Sản phẩm tồn kho:</strong> {totalQuantity}</p>
              <Button variant="primary" onClick={() => handleNavigate('/inventory')}>Quản lý kho</Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Card nhập hàng */}
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Nhập hàng</Card.Title>
              <Button variant="success" onClick={() => handleNavigate('/import')}>Nhập hàng</Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Card lấy hàng */}
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Lấy hàng</Card.Title>
              <Button variant="warning" onClick={() => handleNavigate('/take')}>Lấy hàng</Button>
            </Card.Body>
          </Card>
        </Col>
        {/* Card Log */}
      </Row>

      {/* Báo cáo kho */}
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <Card.Title className="mb-0">Báo cáo kho</Card.Title>
                <a href="/reports" className="text-primary fw-bold">Chi tiết →</a>
              </div>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Ngày</th>
                    <th>Sản phẩm</th>
                    <th>Nhập</th>
                    <th>Xuất</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report, index) => (
                    <tr key={index}>
                      <td>{report.date}</td>
                      <td>{report.product}</td>
                      <td>{report.in}</td>
                      <td>{report.out}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
