

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

const BookAppointment = () => {
  const [selectedCounselor, setSelectedCounselor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentType, setAppointmentType] = useState('individual');
  const [urgency, setUrgency] = useState('normal');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Replace this with your actual logged-in student name
  const [studentName, setStudentName] = useState('');

  useEffect(() => {
    const name = localStorage.getItem('studentName') || '';
    setStudentName(name);
  }, []);

  const counselors = [
    { name: 'Dr. Sarah', specialization: 'Anxiety & Depression', experience: '8 years', rating: 4.9, availability: 'Mon-Fri', image: 'https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg?auto=compress&cs=tinysrgb&w=150' },
    { name: 'Dr. Aman Yadav', specialization: 'Academic Stress & ADHD', experience: '6 years', rating: 4.8, availability: 'Tue-Sat', image: 'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=150' },
    { name: 'Dr. Priya Sharma', specialization: 'Trauma & PTSD', experience: '10 years', rating: 4.9, availability: 'Mon-Thu', image: 'https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=150' }
  ];

  const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];

  const getMinDate = () => new Date().toISOString().split('T')[0];
  const getMaxDate = () => {
    const max = new Date();
    max.setDate(max.getDate() + 30);
    return max.toISOString().split('T')[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('http://localhost:5000/api/appointments', {
        student_name: studentName,
        counselor_name: selectedCounselor,
        date: selectedDate,
        time: selectedTime,
        type: appointmentType,
        urgency,
        reason
      });

      setSuccess(true);
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Something went wrong while booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container" style={{ padding: '40px 20px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="card fade-in text-center">
            <div style={{ color: 'var(--accent-secondary)', marginBottom: '16px' }}>
              <CheckCircle size={64} />
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '16px' }}>
              Appointment Confirmed!
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '1.1rem' }}>
              Your appointment has been successfully booked. You will receive a confirmation email shortly.
            </p>

            <div className="card" style={{ backgroundColor: 'var(--bg-tertiary)', textAlign: 'left' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '16px' }}>Appointment Details</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <p><strong>Student:</strong> {studentName}</p>
                <p><strong>Counselor:</strong> {selectedCounselor}</p>
                <p><strong>Date:</strong> {new Date(selectedDate).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {selectedTime}</p>
                <p><strong>Type:</strong> {appointmentType === 'individual' ? 'Individual Session' : 'Group Session'}</p>
                <p><strong>Priority:</strong> {urgency === 'urgent' ? 'Urgent' : 'Normal'}</p>
              </div>
            </div>

            <div className="flex-center gap-3 mt-4" style={{ flexWrap: 'wrap' }}>
              <button onClick={() => window.location.href = '/dashboard'} className="btn btn-primary">
                Back to Dashboard
              </button>
              <button onClick={() => setSuccess(false)} className="btn btn-outline">
                Book Another Appointment
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div className="fade-in">
        <div className="text-center mb-5">
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '16px' }}>Book an Appointment</h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            Schedule a confidential session with one of our qualified mental health professionals. All appointments are completely private and secure.
          </p>
        </div>

        {/* Booking Form */}
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '24px' }}>Schedule Your Session</h2>

          <form onSubmit={handleSubmit}>
            {/* Student Name Input (optional if login is implemented) */}
            {!studentName && (
              <div className="form-group">
                <label>Student Hostel No.(only no.)</label>
                <input
                  type="text"
                  className="form-input"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  required
                />
              </div>
            )}

            {/* Appointment Type */}
            <div className="form-group">
              <label className="form-label">Session Type</label>
              <select className="form-select" value={appointmentType} onChange={(e) => setAppointmentType(e.target.value)} required>
                <option value="individual">Individual Session (1-on-1)</option>
                <option value="group">Group Session</option>
              </select>
            </div>

            {/* Urgency */}
            <div className="form-group">
              <label className="form-label">Priority Level</label>
              <select className="form-select" value={urgency} onChange={(e) => setUrgency(e.target.value)} required>
                <option value="normal">Normal (within 1-2 weeks)</option>
                <option value="urgent">Urgent (within 2-3 days)</option>
              </select>
            </div>

            {/* Counselor Selection */}
            <div className="form-group">
              <label className="form-label">Select Counselor</label>
              <select className="form-select" value={selectedCounselor} onChange={(e) => setSelectedCounselor(e.target.value)} required>
                <option value="">Choose a counselor...</option>
                {counselors.map(c => (
                  <option key={c.name} value={c.name}>{c.name} - {c.specialization}</option>
                ))}
              </select>
            </div>

            {/* Date Selection */}
            <div className="form-group">
              <label className="form-label">
                <Calendar size={16} style={{ marginRight: '8px' }} />
                Preferred Date
              </label>
              <input type="date" className="form-input" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} min={getMinDate()} max={getMaxDate()} required />
            </div>

            {/* Time Selection */}
            <div className="form-group">
              <label className="form-label">
                <Clock size={16} style={{ marginRight: '8px' }} />
                Preferred Time
              </label>
              <select className="form-select" value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} required>
                <option value="">Select time...</option>
                {timeSlots.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>

            {/* Reason */}
            <div className="form-group">
              <label className="form-label">Reason for Appointment (Mandatory to answer)</label>
              <textarea className="form-input form-textarea" placeholder="Briefly describe what you'd like to discuss" value={reason} onChange={(e) => setReason(e.target.value)} style={{ minHeight: '100px' }} />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? "Booking..." : "Book Appointment"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
