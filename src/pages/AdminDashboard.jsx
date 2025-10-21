


import React, { useState, useEffect } from 'react';
import { 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  UserCheck
} from 'lucide-react';
import axios from 'axios';

// For simple static charts
const BarChart = ({ data, labels, color, height = 180 }) => (
  <div style={{ display: 'flex', alignItems: 'end', gap: 8, height }}>
    {data.map((value, idx) => (
      <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div
          style={{
            width: '100%',
            background: color,
            height: `${(value / Math.max(...data)) * (height - 30)}px`,
            borderRadius: '4px 4px 0 0',
            marginBottom: 6,
            transition: 'height 0.3s'
          }}
        />
        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{labels[idx]}</span>
      </div>
    ))}
  </div>
);

const PieChart = ({ data, colors, labels, size = 120 }) => {
  const total = data.reduce((a, b) => a + b, 0);
  let acc = 0;
  const arcs = data.map((val, i) => {
    const start = acc / total;
    acc += val;
    const end = acc / total;
    const large = end - start > 0.5 ? 1 : 0;
    const a = 2 * Math.PI * start;
    const b = 2 * Math.PI * end;
    const x1 = size / 2 + (size / 2) * Math.sin(a);
    const y1 = size / 2 - (size / 2) * Math.cos(a);
    const x2 = size / 2 + (size / 2) * Math.sin(b);
    const y2 = size / 2 - (size / 2) * Math.cos(b);
    return (
      <path
        key={i}
        d={`M${size / 2},${size / 2} L${x1},${y1} A${size / 2},${size / 2} 0 ${large} 1 ${x2},${y2} Z`}
        fill={colors[i]}
      />
    );
  });
  return (
    <svg width={size} height={size} style={{ display: 'block', margin: 'auto' }}>
      {arcs}
    </svg>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 1247,
    activeUsers: 892,
    screeningsCompleted: 456,
    appointmentsBooked: 234,
    highRiskStudents: 23,
    moderateRiskStudents: 67
  });

  const [recentAlerts, setRecentAlerts] = useState([]);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');

  const timeframes = [
    { id: 'week', name: 'This Week' },
    { id: 'month', name: 'This Month' },
    { id: 'quarter', name: 'This Quarter' },
    { id: 'year', name: 'This Year' }
  ];

  // Static data for department analytics
  const departmentData = [
    { name: 'Computer Science', students: 245, highRisk: 8, moderateRisk: 23 },
    { name: 'Engineering', students: 198, highRisk: 5, moderateRisk: 18 },
    { name: 'Business', students: 167, highRisk: 4, moderateRisk: 12 },
    { name: 'Arts & Sciences', students: 134, highRisk: 3, moderateRisk: 9 },
    { name: 'Medicine', students: 89, highRisk: 2, moderateRisk: 4 },
    { name: 'Others', students: 414, highRisk: 1, moderateRisk: 1 }
  ];

  const screeningsPerDept = departmentData.map(d => d.students);
  const highRiskPerDept = departmentData.map(d => d.highRisk);
  const moderateRiskPerDept = departmentData.map(d => d.moderateRisk);
  const deptLabels = departmentData.map(d => d.name.split(' ')[0]);

  const pieData = [23, 67, 1157]; // high, moderate, low risk
  const pieColors = ['var(--accent-danger)', 'var(--accent-warning)', 'var(--accent-secondary)'];
  const pieLabels = ['High', 'Moderate', 'Low'];

  const weekLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weekScreenings = [12, 19, 15, 25, 22, 30, 28];

  // Fetch notifications from backend
  const fetchNotifications = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/notifications');
      setRecentAlerts(res.data.notifications);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  // Fetch appointment notifications from backend
  // const fetchAppointments = async () => {
  //   try {
  //     const res = await axios.get('http://localhost:5000/api/admin/appointments');
  //     console.log("Appointments response:", res.data);
  //     setRecentAppointments(res.data.notifications);
  //   } catch (err) {
  //     console.error('Failed to fetch appointments:', err);
  //   }
  // };
//   const fetchAppointments = async () => {
//   try {
//     const res = await axios.get('http://localhost:5000/api/admin/appointments');
//     console.log("Appointments response:", res.data); // check the key
//     setRecentAppointments(res.data.appointments); // use the correct key
//   } catch (err) {
//     console.error('Failed to fetch appointments:', err);
//   }
// };

//   const fetchAppointments = async () => {
//   try {
//     const res = await axios.get('http://localhost:5000/api/admin/appointments');
//     console.log("Appointments response:", res.data);
//     // Use the correct key:
//     setRecentAppointments(res.data.notifications || res.data.appointments);
//   } catch (err) {
//     console.error('Failed to fetch appointments:', err);
//   }
// };

  const fetchAppointments = async () => {
  try {
    const res = await axios.get('http://localhost:5000/api/appointments');
    console.log(res.data); // debug
    setRecentAppointments(res.data.appointments || []);
  } catch (err) {
    console.error(err);
  }
};




  useEffect(() => {
    fetchNotifications();
    fetchAppointments();
  }, []);

  // const getRiskLevelColor = (level) => {
  //   switch (level) {
  //     case 'high': return 'var(--accent-danger)';
  //     case 'moderate': return 'var(--accent-warning)';
  //     case 'low': return 'var(--accent-secondary)';
  //     default: return 'var(--text-secondary)';
  //   }
  // };
  const getRiskLevelColor = (level) => {
  switch (level) {
    case 'Severe': return 'var(--accent-danger)';
    case 'Moderate': return 'var(--accent-warning)';
    case 'Mild': return 'var(--accent-secondary)';
    default: return 'var(--text-secondary)';
  }
};


  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'var(--accent-danger)';
      case 'contacted': return 'var(--accent-warning)';
      case 'appointment_scheduled': return 'var(--accent-secondary)';
      default: return 'var(--text-secondary)';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pending Action';
      case 'contacted': return 'Student Contacted';
      case 'appointment_scheduled': return 'Appointment Scheduled';
      default: return 'Unknown';
    }
  };

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div className="fade-in">
        {/* Header */}
        <div className="flex-between mb-5">
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '8px' }}>
              Admin Dashboard
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
              Monitor student mental health trends and manage interventions
            </p>
          </div>
          <div className="flex gap-2">
            <select
              className="form-select"
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              style={{ width: 'auto' }}
            >
              {timeframes.map(timeframe => (
                <option key={timeframe.id} value={timeframe.id}>
                  {timeframe.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-3 mb-5">
          <div className="card">
            <div className="flex-between mb-2">
              <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Total Students</h3>
              <Users size={20} style={{ color: 'var(--accent-primary)' }} />
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>
              {stats.totalStudents.toLocaleString()}
            </div>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              <TrendingUp size={14} style={{ marginRight: '4px' }} />
              +12% from last month
            </p>
          </div>

          <div className="card">
            <div className="flex-between mb-2">
              <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Active Users</h3>
              <UserCheck size={20} style={{ color: 'var(--accent-secondary)' }} />
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--accent-secondary)' }}>
              {stats.activeUsers.toLocaleString()}
            </div>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {((stats.activeUsers / stats.totalStudents) * 100).toFixed(1)}% engagement rate
            </p>
          </div>

          <div className="card">
            <div className="flex-between mb-2">
              <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-secondary)' }}>High Risk Students</h3>
              <AlertTriangle size={20} style={{ color: 'var(--accent-danger)' }} />
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--accent-danger)' }}>
              {stats.highRiskStudents}
            </div>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Require immediate attention
            </p>
          </div>
        </div>

        {/* Analytics Graphs */}
        <div className="grid grid-2 mb-5">
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: 12 }}>Students per Department</h3>
            <BarChart data={screeningsPerDept} labels={deptLabels} color="var(--accent-primary)" height={160} />
          </div>
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: 12 }}>High Risk by Department</h3>
            <BarChart data={highRiskPerDept} labels={deptLabels} color="var(--accent-danger)" height={120} />
          </div>
        </div>

        <div className="grid grid-2 mb-5">
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: 12 }}>Risk Distribution (All Students)</h3>
            <PieChart data={pieData} colors={pieColors} labels={pieLabels} size={120} />
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 10 }}>
              {pieLabels.map((label, i) => (
                <span key={label} style={{ fontSize: 13 }}>
                  <span style={{
                    display: 'inline-block',
                    width: 12,
                    height: 12,
                    background: pieColors[i],
                    borderRadius: 2,
                    marginRight: 6,
                    verticalAlign: 'middle'
                  }} />
                  {label}
                </span>
              ))}
            </div>
          </div>
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: 12 }}>Weekly Screenings</h3>
            <BarChart data={weekScreenings} labels={weekLabels} color="var(--accent-primary)" height={120} />
          </div>
        </div>

        {/* Recent Risk Notifications */}
        <div className="card">
          <div className="flex-between mb-4">
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Recent Risk Notifications</h3>
            <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '14px' }} onClick={fetchNotifications}>
              Refresh
            </button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Student ID</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Name</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Location</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Phone</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Risk Level</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Scores</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Time</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentAlerts.map(alert => (
                  <tr key={alert.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px', fontWeight: '500' }}>{alert.studentId}</td>
                    <td style={{ padding: '12px' }}>{alert.name}</td>
                    <td style={{ padding: '12px' }}>{alert.hostelNo} - {alert.roomNo}</td>
                    <td style={{ padding: '12px' }}>{alert.phone}</td>
                    <td style={{ padding: '12px', color: getRiskLevelColor(alert.riskLevel) }}>{alert.riskLevel}</td>
                    {/* <td style={{ padding: '12px', fontSize: '14px' }}>PHQ-9: {alert.phq9Score} | GAD-7: {alert.gad7Score}</td> */}
                    <td style={{ padding: '12px', fontSize: '14px' }}>PHQ-9: {alert.phq9} | GAD-7: {alert.gad7}</td>

                    <td style={{ padding: '12px', fontSize: '14px' }}>{new Date(alert.createdAt).toLocaleString()}</td>
                    <td style={{ padding: '12px', fontWeight: '500', color: getStatusColor(alert.status) }}>{getStatusText(alert.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Appointments */}
        <div className="card" style={{ marginTop: '40px' }}>
          <div className="flex-between mb-4">
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Recent Appointments</h3>
            <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '14px' }} onClick={fetchAppointments}>
              Refresh
            </button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                  <th style={{ padding: '12px', fontWeight: '600', textAlign: 'left' }}>ID</th>
                  <th style={{ padding: '12px', fontWeight: '600', textAlign: 'left' }}>Student Hostel No.</th>
                  <th style={{ padding: '12px', fontWeight: '600', textAlign: 'left' }}>Counselor Name</th>
                  <th style={{ padding: '12px', fontWeight: '600', textAlign: 'left' }}>Date</th>
                  <th style={{ padding: '12px', fontWeight: '600', textAlign: 'left' }}>Time</th>
                  <th style={{ padding: '12px', fontWeight: '600', textAlign: 'left' }}>Type</th>
                  <th style={{ padding: '12px', fontWeight: '600', textAlign: 'left' }}>Urgency</th>
                  <th style={{ padding: '12px', fontWeight: '600', textAlign: 'left' }}>Reason</th>
                  <th style={{ padding: '12px', fontWeight: '600', textAlign: 'left' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentAppointments.map(app => (
                  <tr key={app.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px', fontWeight: '500' }}>{app.id}</td>
                    <td style={{ padding: '12px' }}>{app.student_name}</td>
                    <td style={{ padding: '12px' }}>{app.counselor_name}</td>
                    <td style={{ padding: '12px' }}>{app.date}</td>
                    <td style={{ padding: '12px' }}>{app.time}</td>
                    <td style={{ padding: '12px' }}>{app.type}</td>
                    <td style={{ padding: '12px' }}>{app.urgency}</td>
                    <td style={{ padding: '12px' }}>{app.reason}</td>
                    <td style={{ padding: '12px', fontWeight: '500', color: app.status === 'pending' ? 'var(--accent-danger)' : 'var(--accent-secondary)' }}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
