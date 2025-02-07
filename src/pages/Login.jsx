import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Row, Col, Card, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import { EyeFill, EyeSlashFill } from 'react-bootstrap-icons'; // Import icon
import { isAuthenticated } from '../services/authService';
import LoadingSpinner from '../components/LoadingSpinner';
import logo from "../assets/images/KD logo tách nềnn.png"
import { sendLog } from '../utils/functions';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Trạng thái hiển thị mật khẩu
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(async () => {
      try {
        const data = await login(username, password);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('token', data.token);
        sessionStorage.setItem('token', data.token);
        await sendLog(username, "Đăng nhập thành công");
        navigate('/');
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    },1000)
  };
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/');
    }
  }, [navigate]);
  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{ backgroundColor: '#f4f6f9' }}
    >
      <Row className="w-100">
        <Col md={5} sm={10} className="mx-auto">
          <Card className="shadow-lg p-4" style={{ borderRadius: '15px', border: 'none' }}>
            <Card.Body>
              {/* Logo */}
              <div className="text-center mb-3">
                <img src={logo} alt="Quản Lý Kho" style={{ height: '60px' }} />
              </div>

              <h2 className="text-center mb-4" style={{ color: '#333' }}>Đăng Nhập</h2>
              {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}

              <Form onSubmit={handleLogin}>
                <Form.Group controlId="formUsername" className="mb-3">
                  <Form.Label style={{ fontWeight: 'bold', color: '#555' }}>Tên Đăng Nhập</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nhập tên đăng nhập"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={loading}
                  />
                </Form.Group>

                {/* Input mật khẩu có nút hiển thị */}
                <Form.Group controlId="formPassword" className="mb-3">
                  <Form.Label style={{ fontWeight: 'bold', color: '#555' }}>Mật Khẩu</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Nhập mật khẩu"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeSlashFill /> : <EyeFill />}
                    </Button>
                  </InputGroup>
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100"
                  style={{ backgroundColor: '#007bff', border: 'none', padding: '10px', fontSize: '16px', borderRadius: '8px' }}
                  disabled={loading}
                >
                  {loading ? <LoadingSpinner size="sm" message="Đang đăng nhập..." /> : "Đăng Nhập"}
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
