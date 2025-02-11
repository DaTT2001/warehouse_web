import React, { useEffect, useState } from "react";
import { Table, Container, Spinner, Alert, Pagination, Form, Row, Col, Button } from "react-bootstrap";
import { getProducts, getSuppliers, deleteProduct, updateProduct, saveOrder } from "../api/warehouseAPI"; // Thêm API updateProduct
import useActivityLogger from "../hooks/useActivityLogger";
import { getUserRole } from "../utils/auth";
import ProductForm from "../components/ProductForm";
import EditProductForm from "../components/EditProductForm"; // Form chỉnh sửa sản phẩm
import { toast } from "react-toastify";
import ConfirmationModal from "../components/ConfirmationModal";
import AddProductModal from "../components/AddProductModal"; // Modal thêm sản phẩm
import { activityLogger } from "../utils/activityLogger";
import { jwtDecode } from "jwt-decode";

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
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showAddQuantityModal, setShowAddQuantityModal] = useState(false); // Thêm trạng thái cho modal thêm số lượng
  const [productToAddQuantity, setProductToAddQuantity] = useState(null); // Thêm trạng thái cho sản phẩm cần thêm số lượng

  const itemsPerPage = 10;

  useEffect(() => {
    setRole(getUserRole());
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDeleteClick = (product) => {
    setProductToDelete(product);  // Lưu sản phẩm cần xóa
    setShowDeleteModal(true);     // Hiển thị modal xác nhận
  };

  const handleAddQuantityClick = (product) => {
    setProductToAddQuantity(product);  // Lưu sản phẩm cần thêm số lượng
    console.log(product);
    setShowAddQuantityModal(true);     // Hiển thị modal thêm số lượng
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data.sort((a, b) => a.productid - b.productid)); // Sắp xếp theo ID
    } catch (err) {
      setError("Không thể tải danh sách sản phẩm!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const data = await getSuppliers();
        setSuppliers(data);
        console.log(data);
      } catch (err) {
        setError("Không thể tải danh sách nhà cung cấp!");
      }
    };
    fetchSuppliers();
  }, []);

  const handleDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      await deleteProduct(productToDelete.productid);
      activityLogger(`Xóa sản phẩm ${productToDelete.productid} thành công`);
      toast.success("Xóa sản phẩm thành công!");
      fetchProducts();
    } catch (err) {
      toast.error("Xóa thất bại! Vui lòng thử lại.");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setProductToDelete(null);
    }
  };

  const handleAddQuantity = async (productId, quantity) => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      toast.error("Lỗi: Không tìm thấy token! ❌");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const product = products.find(p => p.productid === productId);
      const updatedProduct = { ...product, quantity: product.quantity + quantity };

      const newOrderData = {
        employee_name: decoded.fullname,
        employee_id: decoded.username,
        role: decoded.role,
        productid: product.productid,
        productname: product.productname,
        quantity: quantity,
        timestamp: new Date().toISOString(),
        type: "Add"
      };

      await saveOrder(newOrderData);
      await updateProduct(productId, updatedProduct);
      activityLogger(`Thêm ${quantity} sản phẩm vào ${productId} thành công`);

      toast.success("Thêm số lượng sản phẩm thành công!");
      fetchProducts();
    } catch (err) {
      toast.error("Thêm số lượng thất bại! Vui lòng thử lại.");
      console.log(err);
    } finally {
      setShowAddQuantityModal(false);
      setProductToAddQuantity(null);
    }
  };

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

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>📦 Quản lý kho</h2>
        {(role === "Admin" || role === "Warehouse_Manager") && (
          <Button variant="success" onClick={() => setShowAddModal(true)}>➕ Thêm Sản Phẩm</Button>
        )}
      </div>

      <Row className="mb-3">
        <Col md={4}>
          <Form.Control
            type="text"
            placeholder="🔍 Tìm theo mã hoặc tên sản phẩm..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setCurrentPage(1)
            }}
          />
        </Col>
        <Col md={4}>
          <Form.Select value={selectedSupplier} onChange={(e) => {setSelectedSupplier(e.target.value); setCurrentPage(1)}}>
            <option value="">Tất cả nhà cung cấp</option>
            {suppliers.map((s) => (
              <option key={s.supplierid} value={s.supplierid}>
                {s.suppliername}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col md={4}>
        <Form.Select
          value={stockFilter}
          onChange={(e) => {
            setStockFilter(e.target.value);
            setCurrentPage(1); // Reset pagination
          }}
        >
          <option value="">Tất cả số lượng</option>
          <option value="low">Tồn kho thấp (&lt;10)</option>
          <option value="high">Tồn kho cao (&ge;10)</option>
          <option value="restock">Cần bổ sung (&lt;=5)</option>
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
                {(role === "Admin" || role === "Warehouse_Manager") && <th>Hành động</th>}
              </tr>
            </thead>
            <tbody>
              {displayedProducts.length > 0 ? (
                displayedProducts.map((product) => {
                  const supplierName = suppliers.find(s => s.supplierid === product.supplierid)?.suppliername || "Không có";
                  return (
                    <tr key={product.productid}>
                      <td>{product.productid}</td>
                      <td>{product.productname}</td>
                      <td>{product.unit}</td>
                      <td>{product.price.toLocaleString("vi-VN")}</td>
                      <td>{product.quantity}</td>
                      <td>{supplierName}</td>
                      {(role === "Admin" || role === "Warehouse_Manager") && (
                        <td>
                          <Button
                            variant="warning"
                            size="sm"
                            className="me-2"
                            onClick={() => {
                              setEditingProduct(product);
                              setShowEditModal(true);
                            }}
                          >
                            ✏️ Sửa
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            className="me-2"
                            onClick={() => handleDeleteClick(product)}
                          >
                            🗑️ Xóa
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleAddQuantityClick(product)}
                          >
                            ➕ Thêm
                          </Button>
                        </td>
                      )}
                    </tr>
                  );
                })
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

      {/* Modal thêm sản phẩm */}
      <ProductForm show={showAddModal} onHide={() => setShowAddModal(false)} onProductAdded={fetchProducts} suppliers={suppliers}/>

      {/* Modal sửa sản phẩm */}
      {editingProduct && (
        <EditProductForm
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          onProductUpdated={fetchProducts}
          initialData={editingProduct}
          suppliers={suppliers}
        />
      )}
      {/* Modal thêm số lượng */}
      {productToAddQuantity && (
        <AddProductModal
          show={showAddQuantityModal}
          onHide={() => setShowAddQuantityModal(false)}
          onAddQuantity={handleAddQuantity}
          product={productToAddQuantity}
        />
      )}
      {/* Modal xác nhận xóa */}
      <ConfirmationModal 
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        title="Xác nhận xóa"
        message={`Bạn có chắc chắn muốn xóa sản phẩm "${productToDelete?.productname}" không?`}
        onConfirm={handleDelete}
        loading={isDeleting}
      />
    </Container>
  );
};

export default Inventory;