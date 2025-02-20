import React, { useState, useEffect } from 'react';
import { getOrders } from '../api/warehouseAPI';
import { Table, Container, Form, Row, Col, Button, Alert, Spinner, Pagination, Modal } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const formatTimestamp = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  date.setHours(date.getHours() + 7);
  return date.toISOString().replace("T", " ").substring(0, 19);
};

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState({
    type: '',
    name: '',
    startDate: '',
    endDate: '',
    productId: '',
    employee_name: '',
    employee_id: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const itemsPerPage = 20;

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getOrders();
        setReports(data.map(report => ({
          ...report,
          timestamp: formatTimestamp(report.timestamp)
        })));
      } catch (error) {
        setError("Không thể tải báo cáo!");
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleExportExcel = () => {
    const exportData = filteredReports.map(report => ({
      ID: report.id,
      "Product ID": report.productid,
      "Product Name": report.productname,
      Quantity: report.quantity,
      Date: report.timestamp
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reports");

    const filterInfo = [
      ["Filters Applied:"],
      ["Type", filter.type || "All"],
      ["Name", filter.name || "All"],
      ["Start Date", filter.startDate || "All"],
      ["End Date", filter.endDate || "All"],
      ["Product ID", filter.productId || "All"],
      ["Employee Name", filter.employee_name || "All"],
      ["Employee ID", filter.employee_id || "All"]
    ];

    const filterSheet = XLSX.utils.aoa_to_sheet(filterInfo);
    XLSX.utils.book_append_sheet(workbook, filterSheet, "Filters");

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(dataBlob, `Reports_${new Date().toISOString().substring(0,19)}.xlsx`);
    setShowModal(false);
  };

  const filteredReports = reports.filter((report) => {
    const { type, name, startDate, endDate, productId, employee_name, employee_id } = filter;
    const reportDate = new Date(report.timestamp);
    const start = startDate ? new Date(startDate + "T00:00:00") : null;
    const end = endDate ? new Date(endDate + "T23:59:59") : null;

    return (
      (!type || report.type === type) &&
      (!name || report.productname.toLowerCase().includes(name.toLowerCase())) &&
      (!start || reportDate >= start) &&
      (!end || reportDate <= end) &&
      (!productId || report.productid.toString().includes(productId)) &&
      (!employee_name || report.employee_name.toLowerCase().includes(employee_name.toLowerCase())) &&
      (!employee_id || report.employee_id.toString().includes(employee_id))
    );
  });

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const displayedReports = filteredReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Container className="mt-4">
      <h1>📊 Báo cáo</h1>
      <Row className="mb-3 d-flex justify-content-between">
        <Col md={2}>
          <Form.Control
            type="date"
            name="startDate"
            value={filter.startDate}
            onChange={handleFilterChange}
          />
        </Col>
        <Col md={2}>
          <Form.Control
            type="date"
            name="endDate"
            value={filter.endDate}
            onChange={handleFilterChange}
          />
        </Col>
        <Col md={3}>
          <Form.Control
            type="text"
            placeholder="🔍 Tìm theo tên nhân viên..."
            name="employee_name"
            value={filter.employee_name}
            onChange={handleFilterChange}
          />
        </Col>
        <Col md={2}>
          <Form.Control
            type="text"
            placeholder="🔍 Tìm theo ID sản phẩm..."
            name="productId"
            value={filter.productId}
            onChange={handleFilterChange}
          />
        </Col>
        <Col md={2}>
          <Form.Control
            type="text"
            placeholder="🔍 Tìm theo ID nhân viên..."
            name="employee_id"
            value={filter.employee_id}
            onChange={handleFilterChange}
          />
        </Col>
        <Col md={1} className="d-flex justify-content-end">
          <Button variant="success" onClick={() => setShowModal(true)}>
            Xuất
          </Button>
        </Col>
      </Row>
      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && (
        <>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID sản phẩm</th>
                <th>Tên sản phẩm</th>
                <th>Nhân viên</th>
                <th>Mã nhân viên</th>
                <th>Số lượng</th>
                <th>Ngày thực hiện</th>
              </tr>
            </thead>
            <tbody>
              {displayedReports.length > 0 ? (
                displayedReports.map((report) => (
                  <tr key={report.id}>
                    <td>{report.productid}</td>
                    <td>{report.productname}</td>
                    <td>{report.employee_name}</td>
                    <td>{report.employee_id}</td>
                    <td>{report.quantity}</td>
                    <td>{report.timestamp}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">
                    Không có dữ liệu.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          <Pagination className="justify-content-center">
            {[...Array(totalPages).keys()].map((page) => (
              <Pagination.Item
                key={page + 1}
                active={page + 1 === currentPage}
                onClick={() => setCurrentPage(page + 1)}
              >
                {page + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Nhập các trường filter</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formStartDate">
              <Form.Label>Ngày bắt đầu</Form.Label>
              <Form.Control
                type="date"
                name="startDate"
                value={filter.startDate}
                onChange={handleFilterChange}
              />
            </Form.Group>
            <Form.Group controlId="formEndDate">
              <Form.Label>Ngày kết thúc</Form.Label>
              <Form.Control
                type="date"
                name="endDate"
                value={filter.endDate}
                onChange={handleFilterChange}
              />
            </Form.Group>
            <Form.Group controlId="formProductId">
              <Form.Label>ID sản phẩm</Form.Label>
              <Form.Control
                type="text"
                name="productId"
                value={filter.productId}
                onChange={handleFilterChange}
              />
            </Form.Group>
            <Form.Group controlId="formEmployeeName">
              <Form.Label>Tên nhân viên</Form.Label>
              <Form.Control
                type="text"
                name="employee_name"
                value={filter.employee_name}
                onChange={handleFilterChange}
              />
            </Form.Group>
            <Form.Group controlId="formEmployeeId">
              <Form.Label>ID nhân viên</Form.Label>
              <Form.Control
                type="text"
                name="employee_id"
                value={filter.employee_id}
                onChange={handleFilterChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Đóng
          </Button>
          <Button variant="primary" onClick={handleExportExcel}>
            Xuất
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Reports;