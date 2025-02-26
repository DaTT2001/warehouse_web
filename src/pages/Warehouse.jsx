import React, { useEffect, useState, useContext } from "react";
import { Table, Container, Spinner, Alert, Pagination, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { getInventory } from "../api/erpAPI";
import useActivityLogger from "../hooks/useActivityLogger";
import locales from "../locales"; // Import file dịch
import { LanguageContext } from "../services/LanguageContext"; 
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const Warehouse = () => {
  const {language} = useContext(LanguageContext);
  useActivityLogger(locales[language].logWarehouseAccess);

  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [productId, setProductId] = useState("");
  const [minQty, setMinQty] = useState("");
  const [maxQty, setMaxQty] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const itemsPerPage = 50;

  useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true);
      try {
        const data = await getInventory({ id: productId, minQty, maxQty, search, page: currentPage, limit: itemsPerPage });
        
        if (Array.isArray(data.data)) {
          setInventory(data.data);
          setTotalPages(data.totalPages > 0 ? data.totalPages : 1);
        } else {
          setError(locales[language].invalidData);
        }
        setError(null);
      } catch (error) {
        setError(locales[language].fetchError);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, [currentPage, search, productId, minQty, maxQty, language]);

  const handleExportExcel = () => {
    const exportData = inventory.map(item => ({
      "Product ID": item.PRODUCT_ID,
      "Product Name": item.PRODUCT_NAME,
      "Description": item.DESCRIPTION,
      "Quantity": item.QTY_AVAILABLE ?? "N/A",
      "Unit": item.UNIT,
      "Warehouse ID": item.WAREHOUSE_ID
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");

    const filterInfo = [
      [locales[language].filtersApplied],
      [locales[language].search, search || locales[language].all],
      [locales[language].productId, productId || locales[language].all],
      [locales[language].minQty, minQty || locales[language].all],
      [locales[language].maxQty, maxQty || locales[language].all]
    ];

    const filterSheet = XLSX.utils.aoa_to_sheet(filterInfo);
    XLSX.utils.book_append_sheet(workbook, filterSheet, "Filters");

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(dataBlob, `Inventory_${new Date().toISOString().substring(0,19)}.xlsx`);
    setShowModal(false);
  };

  return (
    <Container className="mt-4">
      <h2>📦 {locales[language].warehouseManagement}</h2>

      <Row className="mb-2">
        <Col md={3}>
          <Form.Control
            type="text"
            placeholder={locales[language].searchByName}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </Col>
        <Col md={3}>
          <Form.Control
            type="text"
            placeholder={locales[language].searchById}
            value={productId}
            onChange={(e) => {
              setProductId(e.target.value);
              setCurrentPage(1);
            }}
          />
        </Col>
        <Col md={2}>
          <Form.Control
            type="number"
            placeholder={locales[language].minQty}
            value={minQty}
            onChange={(e) => {
              setMinQty(e.target.value);
              setCurrentPage(1);
            }}
          />
        </Col>
        <Col md={2}>
          <Form.Control
            type="number"
            placeholder={locales[language].maxQty}
            value={maxQty}
            onChange={(e) => {
              setMaxQty(e.target.value);
              setCurrentPage(1);
            }}
          />
        </Col>
        <Col className="d-flex justify-content-end">
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
                <th>#</th>
                <th>{locales[language].productId}</th>
                <th>{locales[language].productName}</th>
                <th>{locales[language].description}</th>
                <th>{locales[language].quantity}</th>
                <th>{locales[language].unit}</th>
                <th>{locales[language].warehouseId}</th>
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
            <Form.Group controlId="formSearch">
              <Form.Label>{locales[language].searchByName}</Form.Label>
              <Form.Control
                type="text"
                name="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formProductId">
              <Form.Label>{locales[language].productId}</Form.Label>
              <Form.Control
                type="text"
                name="productId"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formMinQty">
              <Form.Label>{locales[language].minQty}</Form.Label>
              <Form.Control
                type="number"
                name="minQty"
                value={minQty}
                onChange={(e) => setMinQty(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formMaxQty">
              <Form.Label>{locales[language].maxQty}</Form.Label>
              <Form.Control
                type="number"
                name="maxQty"
                value={maxQty}
                onChange={(e) => setMaxQty(e.target.value)}
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

export default Warehouse;