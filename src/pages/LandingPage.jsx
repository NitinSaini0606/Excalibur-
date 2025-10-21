import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Shield, Users, BookOpen, MessageCircle, Calendar, BarChart3, Heart } from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: <MessageCircle size={32} />,
      title: 'AI-Guided Support',
      description: 'Interactive chatbot offering immediate coping strategies and professional referrals when needed.'
    },
    {
      icon: <Calendar size={32} />,
      title: 'Confidential Booking',
      description: 'Secure appointment scheduling with on-campus counselors and mental health professionals.'
    },
    {
      icon: <BookOpen size={32} />,
      title: 'Resource Hub',
      description: 'Comprehensive library of videos, audio guides, and wellness resources in multiple languages.'
    },
    {
      icon: <Users size={32} />,
      title: 'Peer Support',
      description: 'Moderated peer-to-peer support forums with trained student volunteers.'
    },
    {
      icon: <BarChart3 size={32} />,
      title: 'Analytics Dashboard',
      description: 'Anonymous data insights for administrators to recognize trends and plan interventions.'
    },
    {
      icon: <Shield size={32} />,
      title: 'Privacy First',
      description: 'Complete anonymity and confidentiality in all interactions and data collection.'
    }
  ];

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section className="section section-hero">
        <div className="container">
          <div className="section-content">
            <h1 style={{ 
              fontSize: '3.5rem', 
              fontWeight: 'bold', 
              marginBottom: '24px',
              lineHeight: '1.2'
            }}>
              Welcome to <span style={{ color: '#ffd43b' }}>MindTech</span>
            </h1>
            <p style={{ 
              fontSize: '1.25rem', 
              marginBottom: '40px',
              opacity: 0.9,
              lineHeight: '1.6'
            }}>
              Your comprehensive digital platform for mental health support, designed specifically for college students. 
              Get confidential, accessible, and culturally-sensitive psychological intervention services.
            </p>
            <div className="flex-center gap-3" style={{ flexWrap: 'wrap' }}>
              <Link to="/login" className="btn" style={{
                backgroundColor: 'white',
                color: 'var(--accent-primary)',
                fontSize: '18px',
                padding: '16px 32px'
              }}>
                <Heart size={20} />
                Get Started
              </Link>
              <Link to="#features" className="btn btn-outline" style={{
                borderColor: 'white',
                color: 'white',
                fontSize: '18px',
                padding: '16px 32px'
              }}>
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section section-secondary">
        <div className="container">
          <div className="text-center mb-5">
            <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '16px' }}>
              Comprehensive Mental Health Support
            </h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
              Our platform provides a complete ecosystem of mental health resources tailored for the unique needs of college students.
            </p>
          </div>
          
          <div className="grid grid-3">
            {features.map((feature, index) => (
              <div key={index} className="card text-center">
                <div style={{ 
                  color: 'var(--accent-primary)', 
                  marginBottom: '16px',
                  display: 'flex',
                  justifyContent: 'center'
                }}>
                  {feature.icon}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '12px' }}>
                  {feature.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-5">
            <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '16px' }}>
              Making a Real Impact
            </h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
              Mental health support that makes a difference in students' lives
            </p>
          </div>
          
          <div className="grid grid-3">
            <div className="card text-center">
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--accent-primary)', marginBottom: '8px' }}>
                24/7
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '8px' }}>
                Available Support
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Round-the-clock access to mental health resources and AI-guided support
              </p>
            </div>
            
            <div className="card text-center">
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--accent-secondary)', marginBottom: '8px' }}>
                100%
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '8px' }}>
                Confidential
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Complete privacy and anonymity in all interactions and assessments
              </p>
            </div>
            
            <div className="card text-center">
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--accent-danger)', marginBottom: '8px' }}>
                <Brain size={48} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '8px' }}>
                Evidence-Based
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Using validated psychological screening tools and proven intervention methods
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section section-secondary text-center">
        <div className="container">
          <div className="section-content-small">
            <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '24px' }}>
              Ready to Take Care of Your Mental Health?
            </h2>
            <p style={{ 
              fontSize: '1.1rem', 
              color: 'var(--text-secondary)', 
              marginBottom: '40px',
              lineHeight: '1.6'
            }}>
              Join thousands of students who are already benefiting from our comprehensive mental health support platform.
            </p>
            <Link to="/login" className="btn btn-primary" style={{
              fontSize: '18px',
              padding: '16px 32px'
            }}>
              <Heart size={20} />
              Start Your Journey
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;