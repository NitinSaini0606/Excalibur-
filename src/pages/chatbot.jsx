

import React, { useState, useRef, useEffect } from 'react';
import { Search, Play, BookOpen, Headphones, Download, ExternalLink, Filter, MessageCircle, Send, X, Bot, User } from 'lucide-react';
const SimpleChatbot = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: 'Hello! I\'m your AI mental health assistant. How can I help you today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const predefinedResponses = {
    'anxiety': 'I understand you\'re feeling anxious. Try the 4-7-8 breathing technique: breathe in for 4, hold for 7, exhale for 8. Would you like more anxiety management resources?',
    'stress': 'Stress is very common. Some quick stress relief techniques include deep breathing, progressive muscle relaxation, or taking a short walk. What specific situation is causing you stress?',
    'depression': 'I\'m sorry you\'re feeling this way. Remember that seeking help is a sign of strength. Consider talking to a mental health professional. Would you like information about support resources?',
    'sleep': 'Good sleep is crucial for mental health. Try maintaining a regular sleep schedule, avoiding screens before bed, and creating a relaxing bedtime routine. What specific sleep issues are you experiencing?',
    'help': 'I can help you with various mental health topics including anxiety, depression, stress management, sleep hygiene, and mindfulness. I can also guide you to appropriate resources. What would you like to explore?',
    'hello': 'Hello! I\'m here to support you with mental health resources and guidance. What\'s on your mind today?',
    'hi': 'Hi there! How are you feeling today? I\'m here to help with any mental health concerns or questions you might have.',
    'resources': 'I can help you find various mental health resources including articles, videos, and audio guides. You can also browse our resource hub above. What type of resource are you looking for?',
    'mindfulness': 'Mindfulness can be very helpful for mental wellbeing. Try focusing on your breath, practicing body scans, or doing brief meditation sessions. Would you like specific mindfulness techniques?',
    'panic': 'If you\'re experiencing panic, try grounding techniques: name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste. Focus on slow, deep breathing.',
    'academic': 'Academic stress is common among students. Try breaking tasks into smaller chunks, creating a study schedule, taking regular breaks, and maintaining work-life balance. What specific academic challenges are you facing?'
  };

  const getKeywords = (text) => {
    const keywords = ['anxiety', 'stress', 'depression', 'sleep', 'help', 'hello', 'hi', 'resources', 'mindfulness', 'panic', 'academic'];
    return keywords.find(keyword => text.toLowerCase().includes(keyword));
  };

  const generateResponse = (userInput) => {
    const keyword = getKeywords(userInput);
    if (keyword && predefinedResponses[keyword]) {
      return predefinedResponses[keyword];
    }
    
    if (userInput.toLowerCase().includes('thank')) {
      return 'You\'re welcome! Remember, taking care of your mental health is important. Is there anything else I can help you with?';
    }
    
    if (userInput.toLowerCase().includes('bye')) {
      return 'Take care! Remember, I\'m here whenever you need support. Don\'t hesitate to reach out again.';
    }
    
    if (userInput.toLowerCase().includes('crisis') || userInput.toLowerCase().includes('emergency')) {
      return 'If you\'re in crisis, please reach out to emergency services (911) or a crisis hotline immediately. The National Suicide Prevention Lifeline is 988. Your safety is the top priority.';
    }
    
    return 'I understand you\'re reaching out for support. While I\'m here to provide general guidance, please remember that for serious concerns, it\'s important to speak with a qualified mental health professional. How can I assist you today?';
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: inputValue
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        type: 'bot',
        text: generateResponse(inputValue)
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '400px',
      height: '600px',
      backgroundColor: '#23272a',
      borderRadius: '16px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1000,
      border: '1px solid #40444b'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#5865f2',
        color: 'white',
        padding: '16px 20px',
        borderRadius: '16px 16px 0 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: '50%',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Bot size={20} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>AI Mental Health Assistant</h3>
            <p style={{ margin: 0, fontSize: '12px', opacity: 0.8 }}>Online now</p>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages Container */}
      <div style={{
        flex: 1,
        padding: '20px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              flexDirection: message.type === 'user' ? 'row-reverse' : 'row'
            }}
          >
            <div style={{
              backgroundColor: message.type === 'user' ? '#2ecc71' : '#40444b',
              borderRadius: '50%',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '32px',
              height: '32px'
            }}>
              {message.type === 'user' ? <User size={16} color="white" /> : <Bot size={16} color="white" />}
            </div>
            <div
              style={{
                backgroundColor: message.type === 'user' ? '#2ecc71' : '#5865f2',
                color: 'white',
                padding: '12px 16px',
                borderRadius: '16px',
                maxWidth: '70%',
                fontSize: '14px',
                lineHeight: '1.4',
                wordWrap: 'break-word'
              }}
            >
              {message.text}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
            <div style={{
              backgroundColor: '#40444b',
              borderRadius: '50%',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '32px',
              height: '32px'
            }}>
              <Bot size={16} color="white" />
            </div>
            <div
              style={{
                backgroundColor: '#40444b',
                color: 'white',
                padding: '12px 16px',
                borderRadius: '16px',
                fontSize: '14px'
              }}
            >
              <span style={{ opacity: 0.7 }}>Typing...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Container */}
      <div style={{
        padding: '20px',
        borderTop: '1px solid #40444b'
      }}>
        <div style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'center'
        }}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            style={{
              flex: 1,
              padding: '12px 16px',
              backgroundColor: '#40444b',
              color: 'white',
              border: 'none',
              borderRadius: '24px',
              fontSize: '14px',
              outline: 'none'
            }}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            style={{
              backgroundColor: inputValue.trim() ? '#5865f2' : '#72767d',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: inputValue.trim() ? 'pointer' : 'not-allowed',
              transition: 'background-color 0.2s'
            }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

const ResourceHub = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [chatbotOpen, setChatbotOpen] = useState(false);

  const categories = [
    { id: 'all', name: 'All Resources' },
    { id: 'anxiety', name: 'Anxiety Management' },
    { id: 'depression', name: 'Depression Support' },
    { id: 'stress', name: 'Stress Relief' },
    { id: 'sleep', name: 'Sleep Hygiene' },
    { id: 'mindfulness', name: 'Mindfulness' },
    { id: 'academic', name: 'Academic Stress' }
  ];

  const languages = [
    { id: 'all', name: 'All Languages' },
    { id: 'english', name: 'English' },
    { id: 'hindi', name: 'Hindi' },
    { id: 'tamil', name: 'Tamil' },
    { id: 'telugu', name: 'Telugu' },
    { id: 'bengali', name: 'Bengali' }
  ];

  const resources = [
    {
      id: 1,
      title: 'Understanding Anxiety: A Complete Guide',
      type: 'article',
      category: 'anxiety',
      language: 'english',
      duration: '10 min read',
      description: 'Learn about anxiety symptoms, causes, and effective coping strategies.',
      thumbnail: 'https://images.pexels.com/photos/3807738/pexels-photo-3807738.jpeg?auto=compress&cs=tinysrgb&w=300',
      url: '#'
    },
    {
      id: 2,
      title: 'Guided Meditation for Stress Relief',
      type: 'audio',
      category: 'stress',
      language: 'english',
      duration: '15 min',
      description: 'A calming guided meditation to help reduce stress and anxiety.',
      thumbnail: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=300',
      url: '#'
    },
    {
      id: 3,
      title: 'Breathing Techniques for Panic Attacks',
      type: 'video',
      category: 'anxiety',
      language: 'hindi',
      duration: '8 min',
      description: 'Learn effective breathing techniques to manage panic attacks.',
      thumbnail: 'https://images.pexels.com/photos/3771115/pexels-photo-3771115.jpeg?auto=compress&cs=tinysrgb&w=300',
      url: '#'
    },
    {
      id: 4,
      title: 'Sleep Hygiene: Better Sleep for Better Mental Health',
      type: 'article',
      category: 'sleep',
      language: 'english',
      duration: '12 min read',
      description: 'Discover how proper sleep habits can improve your mental wellbeing.',
      thumbnail: 'https://images.pexels.com/photos/3771069/pexels-photo-3771069.jpeg?auto=compress&cs=tinysrgb&w=300',
      url: '#'
    },
    {
      id: 5,
      title: 'Managing Academic Pressure',
      type: 'video',
      category: 'academic',
      language: 'tamil',
      duration: '20 min',
      description: 'Strategies to handle academic stress and maintain work-life balance.',
      thumbnail: 'https://images.pexels.com/photos/3807755/pexels-photo-3807755.jpeg?auto=compress&cs=tinysrgb&w=300',
      url: '#'
    },
    {
      id: 6,
      title: 'Mindfulness Exercises for Daily Practice',
      type: 'audio',
      category: 'mindfulness',
      language: 'english',
      duration: '25 min',
      description: 'Simple mindfulness exercises you can practice anywhere.',
      thumbnail: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=300',
      url: '#'
    },
    {
      id: 7,
      title: 'Recognizing Signs of Depression',
      type: 'article',
      category: 'depression',
      language: 'bengali',
      duration: '8 min read',
      description: 'Understanding depression symptoms and when to seek help.',
      thumbnail: 'https://images.pexels.com/photos/3807738/pexels-photo-3807738.jpeg?auto=compress&cs=tinysrgb&w=300',
      url: '#'
    },
    {
      id: 8,
      title: 'Progressive Muscle Relaxation',
      type: 'video',
      category: 'stress',
      language: 'telugu',
      duration: '18 min',
      description: 'Learn progressive muscle relaxation techniques for stress relief.',
      thumbnail: 'https://images.pexels.com/photos/3771115/pexels-photo-3771115.jpeg?auto=compress&cs=tinysrgb&w=300',
      url: '#'
    }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesLanguage = selectedLanguage === 'all' || resource.language === selectedLanguage;
    
    return matchesSearch && matchesCategory && matchesLanguage;
  });

  const getResourceIcon = (type) => {
    switch (type) {
      case 'video': return <Play size={16} />;
      case 'audio': return <Headphones size={16} />;
      case 'article': return <BookOpen size={16} />;
      default: return <BookOpen size={16} />;
    }
  };

  const getResourceTypeColor = (type) => {
    switch (type) {
      case 'video': return 'var(--accent-danger)';
      case 'audio': return 'var(--accent-warning)';
      case 'article': return 'var(--accent-primary)';
      default: return 'var(--accent-primary)';
    }
  };

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div className="fade-in">
        {/* Header */}
        <div className="text-center mb-5">
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '16px' }}>
            Resource Hub
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            Explore our comprehensive collection of mental health resources including articles, videos, 
            and audio guides in multiple languages.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="card mb-4">
          <div className="grid grid-2 mb-3">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <div style={{ position: 'relative' }}>
                <Search 
                  size={20} 
                  style={{ 
                    position: 'absolute', 
                    left: '12px', 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    color: 'var(--text-secondary)'
                  }} 
                />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ paddingLeft: '44px' }}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                className="form-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <select
                className="form-select"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
              >
                {languages.map(language => (
                  <option key={language.id} value={language.id}>
                    {language.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex-between" style={{ alignItems: 'center' }}>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
              <Filter size={16} style={{ marginRight: '8px' }} />
              {filteredResources.length} resource{filteredResources.length !== 1 ? 's' : ''} found
            </p>
            <button 
              className="btn btn-outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedLanguage('all');
              }}
              style={{ padding: '8px 16px', fontSize: '14px' }}
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Resources Grid */}
        {filteredResources.length > 0 ? (
          <div className="grid grid-3">
            {filteredResources.map(resource => (
              <div key={resource.id} className="card">
                <div style={{ position: 'relative', marginBottom: '16px' }}>
                  <img
                    src={resource.thumbnail}
                    alt={resource.title}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    backgroundColor: getResourceTypeColor(resource.type),
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    {getResourceIcon(resource.type)}
                    {resource.type.toUpperCase()}
                  </div>
                  <div style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '12px',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {resource.duration}
                  </div>
                </div>

                <div>
                  <h3 style={{ 
                    fontSize: '1.1rem', 
                    fontWeight: '600', 
                    marginBottom: '8px',
                    lineHeight: '1.3'
                  }}>
                    {resource.title}
                  </h3>
                  
                  <p style={{ 
                    color: 'var(--text-secondary)', 
                    fontSize: '14px',
                    lineHeight: '1.4',
                    marginBottom: '12px'
                  }}>
                    {resource.description}
                  </p>

                  <div className="flex-between" style={{ alignItems: 'center', marginBottom: '16px' }}>
                    <span style={{
                      backgroundColor: 'var(--bg-tertiary)',
                      color: 'var(--text-secondary)',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '500',
                      textTransform: 'capitalize'
                    }}>
                      {resource.language}
                    </span>
                    <span style={{
                      backgroundColor: 'var(--accent-primary)',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '500',
                      textTransform: 'capitalize'
                    }}>
                      {categories.find(cat => cat.id === resource.category)?.name.replace(' Management', '').replace(' Support', '')}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      className="btn btn-primary"
                      style={{ flex: 1, padding: '8px 12px', fontSize: '14px' }}
                      onClick={() => window.open(resource.url, '_blank')}
                    >
                      <ExternalLink size={14} />
                      {resource.type === 'video' ? 'Watch' : resource.type === 'audio' ? 'Listen' : 'Read'}
                    </button>
                    <button 
                      className="btn btn-outline"
                      style={{ padding: '8px 12px', fontSize: '14px' }}
                      title="Save for later"
                    >
                      <Download size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center" style={{ padding: '60px 20px' }}>
            <div style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
              <Search size={48} />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '8px' }}>
              No Resources Found
            </h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Try adjusting your search terms or filters to find relevant resources.
            </p>
            <button 
              className="btn btn-primary"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedLanguage('all');
              }}
            >
              Show All Resources
            </button>
          </div>
        )}

        {/* AI Chatbot Section */}
        <div className="card mt-5" style={{
          background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
          color: 'white',
          border: 'none'
        }}>
          <div className="text-center">
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '16px' }}>
              Need Personalized Support?
            </h3>
            <p style={{ marginBottom: '24px', opacity: 0.9 }}>
              Chat with our AI-powered mental health assistant for personalized coping strategies and immediate support.
            </p>
            <button 
              className="btn"
              onClick={() => setChatbotOpen(true)}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                margin: '0 auto'
              }}
            >
              <MessageCircle size={20} />
              Start Chat with AI Assistant
            </button>
          </div>
        </div>

        {/* Simple Chatbot Component */}
        <SimpleChatbot isOpen={chatbotOpen} onClose={() => setChatbotOpen(false)} />

        {/* Floating Chat Button */}
        {!chatbotOpen && (
          <button
            onClick={() => setChatbotOpen(true)}
            style={{
              position: 'fixed',
              bottom: '30px',
              right: '30px',
              backgroundColor: '#5865f2',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '60px',
              height: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(88, 101, 242, 0.4)',
              zIndex: 999,
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'scale(1.1)';
              e.target.style.boxShadow = '0 6px 16px rgba(88, 101, 242, 0.6)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 4px 12px rgba(88, 101, 242, 0.4)';
            }}
          >
            <MessageCircle size={24} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ResourceHub;

