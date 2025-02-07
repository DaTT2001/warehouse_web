import React, { useEffect, useState } from "react";
import { Table, Container, Spinner, Alert, Pagination } from "react-bootstrap";
import useActivityLogger from "../hooks/useActivityLogger";
import { getLogs } from "../api/warehouseAPI"; // Đảm bảo import đúng file API

const LogsPage = () => {
  useActivityLogger("Truy cập trang nhật ký");
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 20;

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await getLogs();
        setLogs(data);
      } catch (err) {
        setError("Không thể tải logs!");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  // Tính toán phân trang
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = logs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(logs.length / logsPerPage);

  return (
    <Container className="mt-4">
      <h2 className="mb-4">📜 Nhật ký hoạt động</h2>

      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && (
        <>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Người dùng</th>
                <th>Hành động</th>
                <th>Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {currentLogs.length > 0 ? (
                currentLogs.map((log, index) => (
                  <tr key={log.id || index}>
                    <td>{indexOfFirstLog + index + 1}</td>
                    <td>{log.username}</td>
                    <td>{log.action}</td>
                    <td>{new Date(log.timestamp).toLocaleString("vi-VN")}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    Không có dữ liệu.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          {/* Phân trang */}
          {totalPages > 1 && (
            <Pagination className="justify-content-center">
              {[...Array(totalPages)].map((_, pageIndex) => (
                <Pagination.Item
                  key={pageIndex + 1}
                  active={pageIndex + 1 === currentPage}
                  onClick={() => setCurrentPage(pageIndex + 1)}
                >
                  {pageIndex + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          )}
        </>
      )}
    </Container>
  );
};

export default LogsPage;
