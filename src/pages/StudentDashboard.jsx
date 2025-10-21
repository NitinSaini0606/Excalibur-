import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Brain, 
  BookOpen, 
  Users, 
  Calendar, 
  MessageCircle, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Heart
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [screeningResults, setScreeningResults] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    // Load screening results from localStorage
    const savedResults = localStorage.getItem('mindtech-screening-results');
    if (savedResults) {
      setScreeningResults(JSON.parse(savedResults));
    }

    // Mock recent activity
    setRecentActivity([
      { id: 1, type: 'resource', title: 'Watched: Managing Anxiety', time: '2 hours ago' },
      { id: 2, type: 'peer', title: 'Posted in Peer Support Forum', time: '1 day ago' },
      { id: 3, type: 'screening', title: 'Completed PHQ-9 Assessment', time: '3 days ago' }
    ]);
  }, []);

  const getWellnessStatus = () => {
    if (!screeningResults) return { status: 'unknown', message: 'Take a screening test to assess your mental wellness' };
    
    const totalScore = screeningResults.phq9Score + screeningResults.gad7Score;
    
    if (totalScore <= 8) {
      return { status: 'good', message: 'Your mental wellness appears to be in good shape' };
    } else if (totalScore <= 16) {
      return { status: 'moderate', message: 'Consider exploring our resources and support options' };
    } else {
      return { status: 'attention', message: 'We recommend speaking with a counselor' };
    }
  };

  const wellnessStatus = getWellnessStatus();

  const quickActions = [
    {
      title: 'Take Screening Test',
      description: 'Assess your mental health with validated tools',
      icon: <Brain size={24} />,
      link: '/screening',
      color: 'var(--accent-primary)'
    },
    {
      title: 'Explore Resources',
      description: 'Access videos, articles, and wellness guides',
      icon: <BookOpen size={24} />,
      link: '/resources',
      color: 'var(--accent-secondary)'
    },
    {
      title: 'Peer Support',
      description: 'Connect with other students in our community',
      icon: <Users size={24} />,
      link: '/peer-support',
      color: 'var(--accent-warning)'
    },
    {
      title: 'Book Appointment',
      description: 'Schedule a session with a counselor',
      icon: <Calendar size={24} />,
      link: '/book-appointment',
      color: 'var(--accent-danger)'
    }
  ];

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div className="fade-in">
        {/* Welcome Section */}
        <div className="mb-5">
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '8px' }}>
            Welcome back, {user.name}! 
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
            Here's your mental wellness dashboard. Take care of yourself today.
          </p>
        </div>

        {/* Wellness Status Card */}
        <div className="card mb-4" style={{
          background: wellnessStatus.status === 'good' 
            ? 'linear-gradient(135deg, var(--accent-secondary), #51cf66)' 
            : wellnessStatus.status === 'moderate'
            ? 'linear-gradient(135deg, var(--accent-warning), #ffd43b)'
            : wellnessStatus.status === 'attention'
            ? 'linear-gradient(135deg, var(--accent-danger), #ff6b6b)'
            : 'linear-gradient(135deg, var(--accent-primary), #4dabf7)',
          color: 'white',
          border: 'none'
        }}>
          <div className="flex-between" style={{ alignItems: 'flex-start' }}>
            <div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '8px' }}>
                Mental Wellness Status
              </h3>
              <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
                {wellnessStatus.message}
              </p>
              {!screeningResults && (
                <Link 
                  to="/screening" 
                  className="btn"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    marginTop: '16px'
                  }}
                >
                  Take Assessment
                </Link>
              )}
            </div>
            <div style={{ fontSize: '3rem' }}>
              {wellnessStatus.status === 'good' && <CheckCircle size={48} />}
              {wellnessStatus.status === 'moderate' && <Clock size={48} />}
              {wellnessStatus.status === 'attention' && <AlertTriangle size={48} />}
              {wellnessStatus.status === 'unknown' && <Heart size={48} />}
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="mb-5">
          <h2 style={{ fontSize: '1.75rem', fontWeight: '600', marginBottom: '24px' }}>
            Quick Actions
          </h2>
          <div className="grid grid-2">
            {quickActions.map((action, index) => (
              <Link 
                key={index}
                to={action.link}
                className="card"
                style={{ 
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'all 0.3s ease'
                }}
              >
                <div className="flex" style={{ alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{ color: action.color, flexShrink: 0 }}>
                    {action.icon}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '8px' }}>
                      {action.title}
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                      {action.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-2">
          {/* Recent Activity */}
          <div className="card">
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '20px' }}>
              Recent Activity
            </h3>
            {recentActivity.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {recentActivity.map((activity) => (
                  <div 
                    key={activity.id}
                    className="flex"
                    style={{ 
                      alignItems: 'center', 
                      gap: '12px',
                      padding: '12px',
                      backgroundColor: 'var(--bg-tertiary)',
                      borderRadius: '8px'
                    }}
                  >
                    <div style={{ color: 'var(--accent-primary)' }}>
                      {activity.type === 'resource' && <BookOpen size={16} />}
                      {activity.type === 'peer' && <Users size={16} />}
                      {activity.type === 'screening' && <Brain size={16} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: '500', marginBottom: '4px' }}>
                        {activity.title}
                      </p>
                      <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '20px' }}>
                No recent activity. Start exploring our resources!
              </p>
            )}
          </div>

          {/* Emergency Support */}
          <div className="card" style={{ backgroundColor: 'var(--accent-danger)', color: 'white', border: 'none' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '16px' }}>
              Need Immediate Help?
            </h3>
            <p style={{ marginBottom: '20px', opacity: 0.9 }}>
              If you're experiencing a mental health crisis, don't hesitate to reach out for immediate support.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button 
                className="btn"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }}
                onClick={() => window.open('tel:+911234567890')}
              >
                <MessageCircle size={16} />
                Crisis Helpline: 123-456-7890
              </button>
              <Link 
                to="/book-appointment"
                className="btn"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }}
              >
                <Calendar size={16} />
                Book Emergency Session
              </Link>
            </div>
          </div>
        </div>

        {/* Screening Results */}
        {screeningResults && (
          <div className="card mt-4">
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '20px' }}>
              Latest Assessment Results
            </h3>
            <div className="grid grid-2">
              <div style={{ 
                padding: '16px', 
                backgroundColor: 'var(--bg-tertiary)', 
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <h4 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '8px' }}>
                  PHQ-9 Score
                </h4>
                <div style={{ 
                  fontSize: '2rem', 
                  fontWeight: 'bold', 
                  color: screeningResults.phq9Score <= 4 ? 'var(--accent-secondary)' : 
                         screeningResults.phq9Score <= 9 ? 'var(--accent-warning)' : 'var(--accent-danger)'
                }}>
                  {screeningResults.phq9Score}/27
                </div>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  Depression Assessment
                </p>
              </div>
              <div style={{ 
                padding: '16px', 
                backgroundColor: 'var(--bg-tertiary)', 
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <h4 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '8px' }}>
                  GAD-7 Score
                </h4>
                <div style={{ 
                  fontSize: '2rem', 
                  fontWeight: 'bold', 
                  color: screeningResults.gad7Score <= 4 ? 'var(--accent-secondary)' : 
                         screeningResults.gad7Score <= 9 ? 'var(--accent-warning)' : 'var(--accent-danger)'
                }}>
                  {screeningResults.gad7Score}/21
                </div>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  Anxiety Assessment
                </p>
              </div>
            </div>
            <div className="text-center mt-3">
              <Link to="/screening" className="btn btn-outline">
                <TrendingUp size={16} />
                Retake Assessment
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;