import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Row, Col, Card, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import { EyeFill, EyeSlashFill } from 'react-bootstrap-icons'; // Import icon
import { isAuthenticated } from '../services/authService';
import LoadingSpinner from '../components/LoadingSpinner';
import logo from "../assets/images/KD logo tách nềnn.png"
import { sendLog } from '../utils/functions';
import { useContext } from 'react';
import { LanguageContext } from '../services/LanguageContext';

const locales = {
  en: {
    appName: 'Warehouse Management',
    login: 'Login',
    username: 'Username',
    password: 'Password',
    enterUsername: 'Enter username',
    enterPassword: 'Enter password',
    loggingIn: 'Logging in...',
  },
  vi: {
    appName: 'Quản lý kho',
    login: 'Đăng Nhập',
    username: 'Tên Đăng Nhập',
    password: 'Mật Khẩu',
    enterUsername: 'Nhập tên đăng nhập',
    enterPassword: 'Nhập mật khẩu',
    loggingIn: 'Đang đăng nhập...',
  },
  zh: {
    appName: '仓库管理',
    login: '登录',
    username: '用户名',
    password: '密码',
    enterUsername: '输入用户名',
    enterPassword: '输入密码',
    loggingIn: '正在登录...',
  }
};

function Login() {
  const { language } = useContext(LanguageContext);
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
                <img src={logo} alt={locales[language].appName} style={{ height: '60px' }} />
              </div>

              <h2 className="text-center mb-4" style={{ color: '#333' }}>{locales[language].login}</h2>
              {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}

              <Form onSubmit={handleLogin}>
                <Form.Group controlId="formUsername" className="mb-3">
                  <Form.Label style={{ fontWeight: 'bold', color: '#555' }}>{locales[language].username}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={locales[language].enterUsername}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={loading}
                  />
                </Form.Group>

                {/* Input mật khẩu có nút hiển thị */}
                <Form.Group controlId="formPassword" className="mb-3">
                  <Form.Label style={{ fontWeight: 'bold', color: '#555' }}>{locales[language].password}</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? 'text' : 'password'}
                      placeholder={locales[language].enterPassword}
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
                  {loading ? <LoadingSpinner size="sm" message={locales[language].loggingIn} /> : locales[language].login}
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
