
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Lock, Mail, UserPlus, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    studentId: '',
    role: 'student'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/student-details';

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // Login API call
        const response = await axios.post("http://localhost:5000/api/login", {
          email: formData.email,
          password: formData.password
        });

        const userData = response.data.user; // backend should return { user, token }
        const token = response.data.token;

        // Save user info & token in localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token);

        // Update auth context
        login(userData);

        navigate(userData.role === 'admin' ? '/admin' : from, { replace: true });

      } else {
        // Signup API call
        const response = await axios.post("http://localhost:5000/api/signup", {
          name: formData.name,
          studentId: formData.studentId,
          role: formData.role,
          email: formData.email,
          password: formData.password
        });

        const userData = response.data.user;
        const token = response.data.token;

        // Save user info & token in localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token);

        // Update auth context
        login(userData);

        navigate('/student-details', { replace: true });
      }
    } catch (err) {
      console.error(err.response?.data || err);
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-center" style={{ minHeight: 'calc(100vh - 80px)', padding: '40px 0' }}>
      <div className="container">
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
          <div className="card fade-in">
            <div className="text-center mb-4">
              <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '8px' }}>
                {isLogin ? 'Welcome Back' : 'Join MindTech'}
              </h1>
              <p style={{ color: 'var(--text-secondary)' }}>
                {isLogin 
                  ? 'Sign in to access your mental health dashboard' 
                  : 'Create your account to get started'
                }
              </p>
            </div>

            {error && (
              <div className="alert alert-danger">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <>
                  <div className="form-group">
                    <label className="form-label">
                      <User size={16} style={{ marginRight: '8px' }} />
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      className="form-input"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required={!isLogin}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <User size={16} style={{ marginRight: '8px' }} />
                      Student ID
                    </label>
                    <input
                      type="text"
                      name="studentId"
                      className="form-input"
                      placeholder="Enter your student ID"
                      value={formData.studentId}
                      onChange={handleInputChange}
                      required={!isLogin}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Role</label>
                    <select
                      name="role"
                      className="form-select"
                      value={formData.role}
                      onChange={handleInputChange}
                    >
                      <option value="student">Student</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>
                </>
              )}

              <div className="form-group">
                <label className="form-label">
                  <Mail size={16} style={{ marginRight: '8px' }} />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Lock size={16} style={{ marginRight: '8px' }} />
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  className="form-input"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', marginBottom: '16px' }}
                disabled={loading}
              >
                {loading ? (
                  <div className="spinner" style={{ width: '20px', height: '20px', margin: '0' }}></div>
                ) : (
                  <>
                    {isLogin ? <LogIn size={16} /> : <UserPlus size={16} />}
                    {isLogin ? 'Sign In' : 'Create Account'}
                  </>
                )}
              </button>
            </form>

            <div className="text-center">
              <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                {isLogin ? "Don't have an account?" : "Already have an account?"}
              </p>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setFormData({
                    email: '',
                    password: '',
                    name: '',
                    studentId: '',
                    role: 'student'
                  });
                }}
                style={{ width: '100%' }}
              >
                {isLogin ? 'Create New Account' : 'Sign In Instead'}
              </button>
            </div>

            {isLogin && (
              <div className="mt-3" style={{ padding: '16px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  <strong>Demo Credentials:</strong>
                </p>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Student: any email + any password
                </p>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  Admin: admin@mindtech.com + any password
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;