

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Phone, Save } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const StudentDetailsPage = () => {
  const [formData, setFormData] = useState({
    hostelNo: '',
    roomNo: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { updateUser } = useAuth();
  const navigate = useNavigate();

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
      if (!formData.hostelNo || !formData.roomNo || !formData.phone) {
        setError('Please fill in all required fields');
        return;
      }

      if (!/^\d{10}$/.test(formData.phone)) {
        setError('Please enter a valid 10-digit phone number');
        return;
      }

      // Get logged-in user from localStorage
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.id) {
        setError('User not found. Please login again.');
        setLoading(false);
        return;
      }

      // Send details to backend
      const response = await axios.post("http://localhost:5000/api/student-details", {
        userId: user.id,
        hostelNo: formData.hostelNo,
        roomNo: formData.roomNo,
        phone: formData.phone
      });

      // Update context / localStorage
      updateUser({
        hostelNo: formData.hostelNo,
        roomNo: formData.roomNo,
        phone: formData.phone,
        profileCompleted: true
      });
      localStorage.setItem('mindtech-student-details', JSON.stringify(formData));

      navigate('/dashboard', { replace: true });

    } catch (err) {
      console.error(err.response?.data || err);
      setError(err.response?.data?.error || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-center" style={{ minHeight: 'calc(100vh - 80px)', padding: '40px 0' }}>
      <div className="container">
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div className="card fade-in">
            <div className="text-center mb-4">
              <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '8px' }}>
                Complete Your Profile
              </h1>
              <p style={{ color: 'var(--text-secondary)' }}>
                Please provide your contact details to help us serve you better in case of emergencies.
              </p>
            </div>

            {error && (
              <div className="alert alert-danger">{error}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">
                  <Home size={16} style={{ marginRight: '8px' }} />
                  Hostel Number
                </label>
                <input
                  type="text"
                  name="hostelNo"
                  className="form-input"
                  placeholder="Enter your hostel number (e.g., H1, H2)"
                  value={formData.hostelNo}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Home size={16} style={{ marginRight: '8px' }} />
                  Room Number
                </label>
                <input
                  type="text"
                  name="roomNo"
                  className="form-input"
                  placeholder="Enter your room number (e.g., 101, 202)"
                  value={formData.roomNo}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Phone size={16} style={{ marginRight: '8px' }} />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  className="form-input"
                  placeholder="Enter your 10-digit phone number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  pattern="[0-9]{10}"
                  maxLength="10"
                  required
                />
                <small style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                  This will only be used for emergency contact purposes
                </small>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '16px' }}
                disabled={loading}
              >
                {loading ? (
                  <div className="spinner" style={{ width: '20px', height: '20px', margin: '0' }}></div>
                ) : (
                  <>
                    <Save size={16} />
                    Save Details & Continue
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailsPage;
