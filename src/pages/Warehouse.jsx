import React, { useEffect, useState } from "react";
import { Table, Container, Spinner, Alert, Pagination, Form, Row, Col } from "react-bootstrap";
import { getInventory } from "../api/erpAPI";
import useActivityLogger from "../hooks/useActivityLogger";

const Warehouse = () => {
  useActivityLogger("Truy cập trang kho hàng");
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [productId, setProductId] = useState("");
  const [minQty, setMinQty] = useState("");
  const [maxQty, setMaxQty] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 50;

  useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true);
      try {
        const data = await getInventory({ id: productId, minQty, maxQty, search, page: currentPage, limit: itemsPerPage });
        console.log("🔥 Dữ liệu tồn kho:", data.data);
        
        if (Array.isArray(data.data)) {
          setInventory(data.data);
          const calculatedTotalPages = data.totalPages;
          setTotalPages(calculatedTotalPages > 0 ? calculatedTotalPages : 1); // Đảm bảo totalPages luôn >= 1
          console.log("📦 Dữ liệu tồn kho:", data.data);
        } else {
          setError("Dữ liệu trả về không hợp lệ");
        }
        setError(null);
      } catch (error) {
        setError("❌ Lỗi khi lấy dữ liệu tồn kho");
        console.error("❌ Lỗi khi lấy dữ liệu tồn kho:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, [currentPage, search, productId, minQty, maxQty]);

  return (
    <Container className="mt-4">
      <h2>📦 Quản lý kho</h2>

      <Row className="mb-3">
        <Col md={3}>
          <Form.Control
            type="text"
            placeholder="🔍 Tìm theo tên sản phẩm hoặc mô tả..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1); // Reset pagination
            }}
          />
        </Col>
        <Col md={3}>
          <Form.Control
            type="text"
            placeholder="🔍 Tìm theo ID sản phẩm..."
            value={productId}
            onChange={(e) => {
              setProductId(e.target.value);
              setCurrentPage(1); // Reset pagination
            }}
          />
        </Col>
        <Col md={3}>
          <Form.Control
            type="number"
            placeholder="🔍 Số lượng tối thiểu..."
            value={minQty}
            onChange={(e) => {
              setMinQty(e.target.value);
              setCurrentPage(1); // Reset pagination
            }}
          />
        </Col>
        <Col md={3}>
          <Form.Control
            type="number"
            placeholder="🔍 Số lượng tối đa..."
            value={maxQty}
            onChange={(e) => {
              setMaxQty(e.target.value);
              setCurrentPage(1); // Reset pagination
            }}
          />
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
                <th>Mã sản phẩm</th>
                <th>Tên sản phẩm</th>
                <th>Mô tả</th>
                <th>Số lượng</th>
                <th>Đơn vị</th>
                <th>Mã kho</th>
              </tr>
            </thead>
            <tbody>
              {inventory.length > 0 ? (
                inventory.map((item, index) => (
                  <tr key={item.RNUM}>
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td>{item.PRODUCT_ID}</td>
                    <td>{item.PRODUCT_NAME}</td>
                    <td>{item.DESCRIPTION}</td>
                    <td>{item.QTY_AVAILABLE ?? "N/A"}</td>
                    <td>{item.UNIT}</td>
                    <td>{item.WAREHOUSE_ID}</td>
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
    </Container>
  );
};

export default Warehouse;