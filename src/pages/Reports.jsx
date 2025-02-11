import React, { useState, useEffect } from 'react';
import { deleteOrder, getOrders, getProductWithID, updateProduct } from '../api/warehouseAPI';
import { Table, Container, Form, Row, Col, Button, Alert, Spinner, Pagination } from 'react-bootstrap';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// Hàm chuyển timestamp về UTC+7 và format "yyyy-MM-dd HH:mm:ss"
const formatTimestamp = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  date.setHours(date.getHours() + 7); // Chuyển về UTC+7
  return date.toISOString().replace("T", " ").substring(0, 19); // "yyyy-MM-dd HH:mm:ss"
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
  const itemsPerPage = 20;

  // Fetch reports on component mount
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getOrders();
        setReports(data.map(report => ({
          ...report,
          timestamp: formatTimestamp(report.timestamp) // Chuyển về UTC+7
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

  // Handle filter input changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Reset pagination
  };

  // Handle undo action
  const handleUndo = async (productid, reportid) => {
    try {
      const product = await getProductWithID(productid);
      if (!product) {
        toast.error("Không tìm thấy sản phẩm!");
        return;
      }
  
      const report = reports.find((r) => r.id === reportid);
      if (!report) {
        toast.error("Không tìm thấy báo cáo!");
        return;
      }
  
      const updatedProduct = {
        productname: product.productname,
        unit: product.unit,
        price: product.price,
        quantity: product.quantity + report.quantity, // Cộng lại số lượng đã xuất
        supplierid: product.supplierid,
      };
      await deleteOrder(reportid);
      const response = await updateProduct(productid, updatedProduct);
      if (response && response.quantity === product.quantity + report.quantity) {
        setReports((prev) => prev.filter((r) => r.productid !== productid));
        toast.success("Hoàn tác báo cáo thành công!");
      } else {
        toast.error("Không thể hoàn tác báo cáo!");
      }
    } catch (error) {
      toast.error("Không thể hoàn tác báo cáo!");
      console.error("Lỗi:", error);
    }
  };

  const handleExportExcel = () => {
    // Tạo dữ liệu xuất ra Excel từ filteredReports
    const exportData = filteredReports.map(report => ({
      ID: report.id,
      "Product ID": report.productid,
      "Product Name": report.productname,
      Type: report.type,
      Quantity: report.quantity,
      Date: report.timestamp
    }));

    // Tạo worksheet từ dữ liệu
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    // Tạo workbook mới
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reports");
    // Xuất file Excel
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(dataBlob, `Reports_${new Date().toISOString().substring(0,19)}.xlsx`);
  };

  // Filter reports based on filter criteria
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
        <Col md={1}>
          <Form.Select name="type" value={filter.type} onChange={handleFilterChange}>
            <option value="">Tất cả loại</option>
            <option value="Add">Add</option>
            <option value="Export">Export</option>
          </Form.Select>
        </Col>
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
        <Col md={2}>
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
          <Button variant="success" onClick={handleExportExcel}>
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
                <th>Hành động</th>
                <th>Số lượng</th>
                <th>Ngày thực hiện</th>
                <th>Chức năng</th>
              </tr>
            </thead>
            <tbody>
              {displayedReports.length > 0 ? (
                displayedReports.map((report) => {
                  const reportDate = new Date(report.timestamp.replace(" ", "T"));
                  const now = new Date();
                  const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000); // Lùi 10 phút
                  const canUndo = reportDate.getTime() >= tenMinutesAgo.getTime();
                  return (
                    <tr key={report.id}>
                      <td>{report.productid}</td>
                      <td>{report.productname}</td>
                      <td>{report.employee_name}</td>
                      <td>{report.employee_id}</td>
                      <td>{report.type}</td>
                      <td>{report.quantity}</td>
                      <td>{report.timestamp}</td>
                      <td>
                        {canUndo && (
                          <Button variant="danger" size="sm" onClick={() => handleUndo(report.productid, report.id)}>
                            Hoàn tác
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })
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
    </Container>
  );
};

export default Reports;