import React, { useEffect, useState, useContext } from "react";
import { Table, Container, Spinner, Alert, Pagination, Form, Row, Col, ButtonGroup, DropdownButton, Dropdown } from "react-bootstrap";
import { getLogs } from "../api/warehouseAPI"; // Đảm bảo import đúng file API
import { LanguageContext } from "../services/LanguageContext";
import locales from "../locales";

const LogsPage = () => {
  const { language } = useContext(LanguageContext);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [userFilter, setUserFilter] = useState(""); // Thêm trạng thái cho bộ lọc người dùng
  const [sortOrder, setSortOrder] = useState("desc"); // Thêm trạng thái cho sắp xếp thời gian
  const [startDate, setStartDate] = useState(""); // Thêm trạng thái cho ngày bắt đầu
  const [endDate, setEndDate] = useState(""); // Thêm trạng thái cho ngày kết thúc
  const logsPerPage = 50;

  // Lấy dữ liệu logs từ API
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await getLogs();
        setLogs(data);
      } catch (err) {
        setError(locales[language].fetchError);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [language]);

  // Lọc logs theo người dùng và khoảng thời gian
  const filteredLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    const isUserMatch = log.username.toLowerCase().includes(userFilter.toLowerCase());
    const isStartDateMatch = startDate ? logDate >= new Date(startDate) : true;
    const isEndDateMatch = endDate ? logDate < new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1)) : true;
    return isUserMatch && isStartDateMatch && isEndDateMatch;
  });

  // Sắp xếp logs theo thời gian
  const sortedLogs = filteredLogs.sort((a, b) => {
    if (sortOrder === "asc") {
      return new Date(a.timestamp) - new Date(b.timestamp);
    } else {
      return new Date(b.timestamp) - new Date(a.timestamp);
    }
  });

  // Tính toán phân trang
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = sortedLogs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(sortedLogs.length / logsPerPage);

  // Đặt lại trang hiện tại về 1 khi thay đổi bộ lọc ngày
  useEffect(() => {
    setCurrentPage(1);
  }, [startDate, endDate]);

  return (
    <Container className="mt-4">
      <h2 className="mb-4">📜 {locales[language].activityLogs}</h2>

      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && (
        <>
          <Row className="mb-3">
            <Col md={3}>
              <Form.Control
                type="text"
                placeholder={locales[language].filterByUser}
                value={userFilter}
                onChange={(e) => {
                  setUserFilter(e.target.value);
                  setCurrentPage(1); // Reset pagination
                }}
              />
            </Col>
            <Col md={3}>
              <Form.Control
                type="date"
                placeholder={locales[language].fromDate}
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setCurrentPage(1); // Reset pagination
                }}
              />
            </Col>
            <Col md={3}>
              <Form.Control
                type="date"
                placeholder={locales[language].toDate}
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setCurrentPage(1); // Reset pagination
                }}
              />
            </Col>
            <Col md={3} className="d-flex justify-content-end">
              <DropdownButton
                as={ButtonGroup}
                title={`${locales[language].sortByTime} ${sortOrder === "asc" ? "⬆️" : "⬇️"}`}
                id="bg-nested-dropdown"
                variant="secondary"
              >
                <Dropdown.Item
                  eventKey="1"
                  active={sortOrder === "asc"}
                  onClick={() => {
                    setSortOrder("asc");
                    setCurrentPage(1); // Reset pagination
                  }}
                >
                  ⬆️ {locales[language].ascending}
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="2"
                  active={sortOrder === "desc"}
                  onClick={() => {
                    setSortOrder("desc");
                    setCurrentPage(1); // Reset pagination
                  }}
                >
                  ⬇️ {locales[language].descending}
                </Dropdown.Item>
              </DropdownButton>
            </Col>
          </Row>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>{locales[language].user}</th>
                <th>{locales[language].action}</th>
                <th>{locales[language].time}</th>
              </tr>
            </thead>
            <tbody>
              {currentLogs.length > 0 ? (
                currentLogs.map((log, index) => (
                  <tr key={log.id || index}>
                    <td>{indexOfFirstLog + index + 1}</td>
                    <td>{log.username}</td>
                    <td>{log.action}</td>
                    <td>{new Date(log.timestamp).toLocaleString(language)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    {locales[language].noData}
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