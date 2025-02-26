import React, { useState, useEffect, useContext } from 'react';
import { getOrders } from '../api/warehouseAPI';
import { Table, Container, Form, Row, Col, Button, Alert, Spinner, Pagination, Modal } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { LanguageContext } from '../services/LanguageContext';
import locales from '../locales';

const formatTimestamp = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  date.setHours(date.getHours() + 7);
  return date.toISOString().replace("T", " ").substring(0, 19);
};

const Reports = () => {
  const { language } = useContext(LanguageContext);
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
        setError(locales[language].fetchError);
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [language]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleExportExcel = () => {
    const exportData = filteredReports.map(report => ({
      ID: report.id,
      "ERP Order ID": report.erp_order_id,
      "Product ID": report.productid,
      "Product Name": report.productname,
      Quantity: report.quantity,
      Date: report.timestamp
    }));
  
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reports");
  
    const filterInfo = [
      [locales[language].filtersApplied],
      [locales[language].type, filter.type || locales[language].all],
      [locales[language].name, filter.name || locales[language].all],
      [locales[language].startDate, filter.startDate || locales[language].all],
      [locales[language].endDate, filter.endDate || locales[language].all],
      [locales[language].productId, filter.productId || locales[language].all],
      [locales[language].employeeName, filter.employee_name || locales[language].all],
      [locales[language].employeeId, filter.employee_id || locales[language].all]
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
      <h1>📊 {locales[language].reports}</h1>
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
            placeholder={locales[language].searchByName}
            name="employee_name"
            value={filter.employee_name}
            onChange={handleFilterChange}
          />
        </Col>
        <Col md={2}>
          <Form.Control
            type="text"
            placeholder={locales[language].searchById}
            name="productId"
            value={filter.productId}
            onChange={handleFilterChange}
          />
        </Col>
        <Col md={2}>
          <Form.Control
            type="text"
            placeholder={locales[language].searchByEmployeeId}
            name="employee_id"
            value={filter.employee_id}
            onChange={handleFilterChange}
          />
        </Col>
        <Col md={1} className="d-flex justify-content-end">
          <Button variant="success" onClick={() => setShowModal(true)}>
            {locales[language].export}
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
                <th>{locales[language].productId}</th>
                <th>{locales[language].erpOrderId}</th>
                <th>{locales[language].productName}</th>
                <th>{locales[language].employeeName}</th>
                <th>{locales[language].employeeId}</th>
                <th>{locales[language].quantity}</th>
                <th>{locales[language].date}</th>
              </tr>
            </thead>
            <tbody>
              {displayedReports.length > 0 ? (
                displayedReports.map((report) => (
                  <tr key={report.id}>
                    <td>{report.productid}</td>
                    <td>{report.erp_order_id}</td>
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
                    {locales[language].noData}
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
          <Modal.Title>{locales[language].enterFilterFields}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formStartDate">
              <Form.Label>{locales[language].startDate}</Form.Label>
              <Form.Control
                type="date"
                name="startDate"
                value={filter.startDate}
                onChange={handleFilterChange}
              />
            </Form.Group>
            <Form.Group controlId="formEndDate">
              <Form.Label>{locales[language].endDate}</Form.Label>
              <Form.Control
                type="date"
                name="endDate"
                value={filter.endDate}
                onChange={handleFilterChange}
              />
            </Form.Group>
            <Form.Group controlId="formProductId">
              <Form.Label>{locales[language].productId}</Form.Label>
              <Form.Control
                type="text"
                name="productId"
                value={filter.productId}
                onChange={handleFilterChange}
              />
            </Form.Group>
            <Form.Group controlId="formEmployeeName">
              <Form.Label>{locales[language].employeeName}</Form.Label>
              <Form.Control
                type="text"
                name="employee_name"
                value={filter.employee_name}
                onChange={handleFilterChange}
              />
            </Form.Group>
            <Form.Group controlId="formEmployeeId">
              <Form.Label>{locales[language].employeeId}</Form.Label>
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
            {locales[language].close}
          </Button>
          <Button variant="primary" onClick={handleExportExcel}>
            {locales[language].export}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Reports;