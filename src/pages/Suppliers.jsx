import React, { useEffect, useState } from "react";
import { Table, Container, Spinner, Alert, Pagination, Form, Row, Col, Button } from "react-bootstrap";
import { getSuppliers, deleteSupplier } from "../api/warehouseAPI";
import ConfirmationModal from "../components/ConfirmationModal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useActivityLogger from "../hooks/useActivityLogger";
import { getUserRole } from "../utils/auth";

const Suppliers = () => {
  useActivityLogger("Truy cập trang nhà cung cấp");
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    setRole(getUserRole()); // Lấy quyền khi component mount
  }, []);

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

  const handleShowDeleteModal = (supplier) => {
    setSupplierToDelete(supplier);
    setShowDeleteModal(true);
    setDeleteError(null);
  };

  const handleDelete = async () => {
    if (!supplierToDelete) return;
    setIsDeleting(true);

    try {
      await deleteSupplier(supplierToDelete.supplierid);
      setSuppliers(suppliers.filter((s) => s.supplierid !== supplierToDelete.supplierid));
      toast.success("✅ Xóa nhà cung cấp thành công!");
      setShowDeleteModal(false);
    } catch (err) {
      const errorMessage = err.response?.data?.error || "❌ Xóa thất bại! Lỗi không xác định.";
      toast.error(errorMessage);
      setShowDeleteModal(false); // Đóng modal ngay cả khi lỗi xảy ra
    } finally {
      setIsDeleting(false);
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
          {
            (role === "Admin" || role === "Warehouse_Manager") && <Button variant="primary">➕ Thêm Nhà Cung Cấp</Button>
          }
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
                {
                  (role === "Admin" || role === "Warehouse_Manager") && <th>Hành động</th>
                } 
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
                      {
                        (role === "Admin" || role === "Warehouse_Manager") &&
                        <td>
                          <Button variant="warning" size="sm" className="me-2">✏️ Sửa</Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleShowDeleteModal(supplier)}
                          >
                            🗑️ Xóa
                          </Button>
                        </td>
                      }
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

      {/* Modal xác nhận xóa */}
      <ConfirmationModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        title="Xác nhận xóa"
        message={`Bạn có chắc chắn muốn xóa nhà cung cấp "${supplierToDelete?.suppliername}" không?`}
        onConfirm={handleDelete}
        loading={isDeleting}
      />
      
      {/* {deleteError && (
        <Alert variant="danger" className="mt-3" onClose={() => setDeleteError(null)} dismissible>
          {deleteError}
        </Alert>
      )} */}
      {deleteError && (
        <Alert variant="danger" className="mt-3" onClose={() => setDeleteError(null)} dismissible>
          {deleteError}
        </Alert>
      )}


    </Container>
  );
};

export default Suppliers;
