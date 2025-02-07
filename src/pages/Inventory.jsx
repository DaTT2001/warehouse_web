import React, { useEffect, useState } from "react";
import { Table, Container, Spinner, Alert, Pagination, Form, Row, Col } from "react-bootstrap";
import { getProducts, getSuppliers } from "../api/warehouseAPI";
// import { sendLog } from '../utils/functions';
import useActivityLogger from "../hooks/useActivityLogger";
import { getUserRole } from "../utils/auth";

const Inventory = () => {
  useActivityLogger("Truy cập trang kho hàng");
  const [role, setRole] = useState(null);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [stockFilter, setStockFilter] = useState("");

  const itemsPerPage = 20;
  useEffect(() => {
      setRole(getUserRole()); // Lấy quyền khi component mount
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        setError("Không thể tải danh sách sản phẩm!");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const data = await getSuppliers();
        setSuppliers(data);
      } catch (err) {
        setError("Không thể tải danh sách nhà cung cấp!");
      }
    };
    fetchSuppliers();
  }, []);

  // Lọc sản phẩm theo điều kiện tìm kiếm
  const filteredProducts = products.filter((product) => {
    return (
      (search === "" ||
        product.productname.toLowerCase().includes(search.toLowerCase()) ||
        product.productid.toString().includes(search)) &&
      (selectedSupplier === "" || product.supplierid === parseInt(selectedSupplier)) &&
      (stockFilter === ""
        || (stockFilter === "low" && product.quantity < 10)
        || (stockFilter === "high" && product.quantity >= 10)
        || (stockFilter === "restock" && product.quantity <= 5))
    );
  });

  // Phân trang
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Container className="mt-4">
      <h2 className="mb-4">📦 Quản lý kho</h2>

      {/* Thanh tìm kiếm và bộ lọc */}
      <Row className="mb-3">
        <Col md={4}>
          <Form.Control
            type="text"
            placeholder="🔍 Tìm theo mã hoặc tên sản phẩm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col md={4}>
          <Form.Select value={selectedSupplier} onChange={(e) => setSelectedSupplier(e.target.value)}>
            <option value="">Tất cả nhà cung cấp</option>
            {suppliers.map((s) => (
              <option key={s.supplierid} value={s.supplierid}>
                {s.suppliername}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col md={4}>
          <Form.Select value={stockFilter} onChange={(e) => setStockFilter(e.target.value)}>
            <option value="">Tất cả số lượng</option>
            <option value="low">Tồn kho thấp (&lt;10)</option>
            <option value="high">Tồn kho cao (&ge;10)</option>
            <option value="restock">Cần bổ sung (&lt;=1)</option>
          </Form.Select>
        </Col>
      </Row>

      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && (
        <>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên sản phẩm</th>
                <th>Đơn vị</th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Nhà cung cấp</th>
                {
                  (role === "Admin" || role === "Warehouse_Manager") && <th>Hành động</th>
                } 
              </tr>
            </thead>
            <tbody>
              {displayedProducts.length > 0 ? (
                displayedProducts.map((product, index) => {
                  const supplierName = suppliers.find(s => s.supplierid === product.supplierid)?.suppliername || "Không có";
                  return (
                    <tr key={product.productid}>
                      <td>{product.productid}</td>
                      <td>{product.productname}</td>
                      <td>{product.unit}</td>
                      <td>{product.price.toLocaleString("vi-VN")}</td>
                      <td>{product.quantity}</td>
                      <td>{supplierName}</td>
                      {
                        (role === "Admin" || role === "Warehouse_Manager") && <td></td>
                      }    
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    Không có dữ liệu.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          {/* Phân trang */}
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

export default Inventory;