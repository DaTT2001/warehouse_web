import React, { useEffect, useState } from "react";
import { Table, Container, Spinner, Alert, Pagination, Form, Row, Col, Button } from "react-bootstrap";
import { getSuppliers, deleteSupplier } from "../api/warehouseAPI";

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const data = await getSuppliers();
        setSuppliers(data);
      } catch (err) {
        setError("Không thể tải danh sách nhà cung cấp!");
      } finally {
        setLoading(false);
      }
    };
    fetchSuppliers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa nhà cung cấp này?")) {
      try {
        await deleteSupplier(id);
        setSuppliers(suppliers.filter((s) => s.supplierid !== id));
      } catch (err) {
        alert("Xóa thất bại!");
      }
    }
  };

  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.suppliername.toLowerCase().includes(search.toLowerCase()) ||
    supplier.contactname.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);
  const displayedSuppliers = filteredSuppliers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Container className="mt-4">
      <h2 className="mb-4">🏢 Quản lý Nhà Cung Cấp</h2>
      
      <Row className="mb-3">
        <Col md={8}>
          <Form.Control
            type="text"
            placeholder="🔍 Tìm theo tên hoặc người liên hệ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col md={4} className="text-end">
          <Button variant="primary">➕ Thêm Nhà Cung Cấp</Button>
        </Col>
      </Row>

      {loading && <Spinner animation="border" />} 
      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && (
        <>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Tên Nhà Cung Cấp</th>
                <th>Người Liên Hệ</th>
                <th>Điện Thoại</th>
                <th>Email</th>
                <th>Địa Chỉ</th>
                <th>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {displayedSuppliers.length > 0 ? (
                displayedSuppliers.map((supplier, index) => (
                  <tr key={supplier.supplierid}>
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td>{supplier.suppliername}</td>
                    <td>{supplier.contactname}</td>
                    <td>{supplier.phone}</td>
                    <td>{supplier.email}</td>
                    <td>{supplier.address}</td>
                    <td>
                      <Button variant="warning" size="sm" className="me-2">✏️ Sửa</Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(supplier.supplierid)}>🗑️ Xóa</Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
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

export default Suppliers;
