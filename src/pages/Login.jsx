import React, { useState } from 'react';
import { Button, Form, Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    // Kiểm tra thông tin đăng nhập (ví dụ giả sử thông tin đăng nhập đúng là admin/1234)
    try {
        // Gọi API đăng nhập
        const data = await login(username, password);
        // Lưu thông tin đăng nhập vào localStorage và chuyển hướng
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('token', data.token);  // Ví dụ token trả về
        console.log(data.token)
        sessionStorage.setItem('token', data.token);
        navigate('/');
      } catch (error) {
        setErrorMessage(error.message);
      }
    // if (username === 'admin' && password === '1234') {
    //   // Nếu đăng nhập thành công, lưu trạng thái vào localStorage và chuyển hướng đến dashboard
    //   localStorage.setItem('isLoggedIn', 'true');
    //   navigate('/dashboard');
    // } else {
    //   // Nếu đăng nhập không thành công, hiển thị thông báo lỗi
    //   setErrorMessage('Thông tin đăng nhập không chính xác');
    // }
  };

  return (
    <Container fluid="sm" className="d-flex justify-content-center align-items-center min-vh-100">
      <Row className="w-100">
        <Col md={6} sm={12} className="mx-auto">
          <Card className="shadow-lg">
            <Card.Body>
              <h2 className="text-center mb-4">Đăng Nhập</h2>
              {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}
              <Form onSubmit={handleLogin}>
                <Form.Group controlId="formUsername" className="mb-3">
                  <Form.Label>Tên Đăng Nhập</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nhập tên đăng nhập"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formPassword" className="mb-3">
                  <Form.Label>Mật Khẩu</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                  Đăng Nhập
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
