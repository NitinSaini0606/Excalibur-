




import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { 
  Search, Play, BookOpen, Headphones, ExternalLink, Filter, MessageCircle, Send, X, Bot, User 
} from 'lucide-react';

const SimpleChatbot = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: "Hello! I'm your AI mental health assistant. How can I help you today?" }
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

//   const handleSendMessage = async () => {
//   if (!inputValue.trim()) return;

//   const userMessage = {
//     id: messages.length + 1,
//     type: 'user',
//     text: inputValue
//   };

//   setMessages(prev => [...prev, userMessage]);
//   setInputValue('');
//   setIsTyping(true);

//   try {
//     const response = await axios.post('http://127.0.0.1:8000/chat', {
//       question: userMessage.text   // <-- must be "question"
//     });

//     const botMessage = {
//       id: messages.length + 2,
//       type: 'bot',
//       text: response.data.answer   // <-- FastAPI returns "answer"
//     };

//     setMessages(prev => [...prev, botMessage]);
//   } catch (error) {
//     console.error(error);
//     const botMessage = {
//       id: messages.length + 2,
//       type: 'bot',
//       text: "Sorry, I'm having trouble connecting to the server. Please try again later."
//     };
//     setMessages(prev => [...prev, botMessage]);
//   } finally {
//     setIsTyping(false);
//   }
// };
  const handleSendMessage = async () => {
  if (!inputValue.trim()) return;

  const userMessage = {
    id: messages.length + 1,
    type: 'user',
    text: inputValue
  };

  setMessages(prev => [...prev, userMessage]);
  setInputValue('');
  setIsTyping(true);

  try {
    // Call your Node.js backend (RAG + Gemini)
    const response = await axios.post('http://localhost:5000/api/chat', {
      question: userMessage.text
    });

    const botMessage = {
      id: messages.length + 2,
      type: 'bot',
      text: response.data.answer
    };

    setMessages(prev => [...prev, botMessage]);
  } catch (error) {
    console.error(error);
    const botMessage = {
      id: messages.length + 2,
      type: 'bot',
      text: "Sorry, I'm having trouble connecting to the server. Please try again later."
    };
    setMessages(prev => [...prev, botMessage]);
  } finally {
    setIsTyping(false);
  }
};


  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSendMessage();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', bottom: '20px', right: '20px', width: '400px', height: '600px',
      backgroundColor: '#23272a', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
      display: 'flex', flexDirection: 'column', zIndex: 1000, border: '1px solid #40444b'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#5865f2', color: 'white', padding: '16px 20px', borderRadius: '16px 16px 0 0',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '50%', padding: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Bot size={20} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>AI Mental Health Assistant</h3>
            <p style={{ margin: 0, fontSize: '12px', opacity: 0.8 }}>Online now</p>
          </div>
        </div>
        <button onClick={onClose} style={{
          background: 'none', border: 'none', color: 'white', cursor: 'pointer',
          padding: '4px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <X size={20} />
        </button>
      </div>

      {/* Messages Container */}
      <div style={{
        flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px'
      }}>
        {messages.map(msg => (
          <div key={msg.id} style={{
            display: 'flex', alignItems: 'flex-start', gap: '12px',
            flexDirection: msg.type === 'user' ? 'row-reverse' : 'row'
          }}>
            <div style={{
              backgroundColor: msg.type === 'user' ? '#2ecc71' : '#40444b',
              borderRadius: '50%', padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              minWidth: '32px', height: '32px'
            }}>
              {msg.type === 'user' ? <User size={16} color="white" /> : <Bot size={16} color="white" />}
            </div>
            <div style={{
              backgroundColor: msg.type === 'user' ? '#2ecc71' : '#5865f2',
              color: 'white', padding: '12px 16px', borderRadius: '16px',
              maxWidth: '70%', fontSize: '14px', lineHeight: '1.4', wordWrap: 'break-word'
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{
              backgroundColor: '#40444b', borderRadius: '50%', padding: '6px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '32px', height: '32px'
            }}>
              <Bot size={16} color="white" />
            </div>
            <div style={{
              backgroundColor: '#40444b', color: 'white', padding: '12px 16px', borderRadius: '16px', fontSize: '14px'
            }}>
              <span style={{ opacity: 0.7 }}>Typing...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Container */}
      <div style={{ padding: '20px', borderTop: '1px solid #40444b' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            style={{
              flex: 1, padding: '12px 16px', backgroundColor: '#40444b', color: 'white',
              border: 'none', borderRadius: '24px', fontSize: '14px', outline: 'none'
            }}
          />
          <button onClick={handleSendMessage} disabled={!inputValue.trim()} style={{
            backgroundColor: inputValue.trim() ? '#5865f2' : '#72767d', color: 'white', border: 'none',
            borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: inputValue.trim() ? 'pointer' : 'not-allowed',
            transition: 'background-color 0.2s'
          }}>
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Resource Hub Component
const ResourceHub = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [chatbotOpen, setChatbotOpen] = useState(false);

  // Categories and languages (same as your original code)
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

  // Add your resources array here (same as original code)
  const resources = [
    // English Resources
    {
      id: 1,
      title: 'Understanding Anxiety: Complete WHO Guide',
      type: 'article',
      category: 'anxiety',
      language: 'english',
      duration: '10 min read',
      description: 'Comprehensive WHO guide on anxiety symptoms, causes, and evidence-based coping strategies.',
      thumbnail: 'https://images.pexels.com/photos/3807738/pexels-photo-3807738.jpeg?auto=compress&cs=tinysrgb&w=300',
      url: 'https://www.who.int/health-topics/mental-health'
    },
    {
      id: 2,
      title: 'Guided Meditation for Stress Relief',
      type: 'audio',
      category: 'stress',
      language: 'english',
      duration: '15 min',
      description: 'Professional guided meditation sessions to reduce stress and promote mental wellbeing.',
      thumbnail: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=300',
      url: 'https://www.youtube.com/playlist?list=PLV9WJDAawyhbQb_DSKe3rjc9j_dOykynB'
    },
    {
      id: 3,
      title: 'Mental Health and Resilience Techniques',
      type: 'video',
      category: 'anxiety',
      language: 'english',
      duration: '8 min',
      description: 'Learn evidence-based breathing and grounding techniques for panic attacks and anxiety.',
      thumbnail: 'https://images.pexels.com/photos/3771115/pexels-photo-3771115.jpeg?auto=compress&cs=tinysrgb&w=300',
      url: 'https://www.youtube.com/watch?v=YdMCL9_UTE4'
    },
    {
      id: 4,
      title: 'Sleep Hygiene: NHS Self-Help Guide',
      type: 'article',
      category: 'sleep',
      language: 'english',
      duration: '12 min read',
      description: 'NHS-approved guide on sleep hygiene practices for better mental health.',
      thumbnail: 'https://images.pexels.com/photos/3771069/pexels-photo-3771069.jpeg?auto=compress&cs=tinysrgb&w=300',
      url: 'https://www.nhs.uk/mental-health/talking-therapies-medicine-treatments/talking-therapies-and-counselling/self-help-therapies/'
    },
    {
      id: 5,
      title: 'Depression Support and Resources',
      type: 'article',
      category: 'depression',
      language: 'english',
      duration: '8 min read',
      description: 'Comprehensive depression support resources and treatment options from leading mental health experts.',
      thumbnail: 'https://images.pexels.com/photos/3807738/pexels-photo-3807738.jpeg?auto=compress&cs=tinysrgb&w=300',
      url: 'https://www.camh.ca/en/professionals/treating-conditions-and-disorders/depression/depression---resources-and-references'
    },
    {
      id: 6,
      title: 'Mindfulness Exercises for Daily Practice',
      type: 'audio',
      category: 'mindfulness',
      language: 'english',
      duration: '25 min',
      description: 'Professional mindfulness exercises and meditation techniques for stress management.',
      thumbnail: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=300',
      url: 'https://www.youtube.com/playlist?list=PLfw5WkuDE3-5YwYatO-nP8yS10LP3F1XN'
    },
    
    // Hindi Resources
    {
      id: 7,
      title: 'मानसिक स्वास्थ्य और तनाव प्रबंधन',
      type: 'video',
      category: 'stress',
      language: 'hindi',
      duration: '15 min',
      description: 'Hindi में comprehensive mental health awareness और stress management techniques.',
      thumbnail: 'https://images.pexels.com/photos/3771115/pexels-photo-3771115.jpeg?auto=compress&cs=tinysrgb&w=300',
      url: 'https://www.youtube.com/watch?v=DxIDKZHW3-E'
    },
    {
      id: 8,
      title: 'चिंता और पैनिक अटैक से राहत',
      type: 'article',
      category: 'anxiety',
      language: 'hindi',
      duration: '10 min read',
      description: 'Anxiety और panic attacks के लिए प्रभावी breathing techniques और coping strategies.',
      thumbnail: 'https://images.pexels.com/photos/3807738/pexels-photo-3807738.jpeg?auto=compress&cs=tinysrgb&w=300',
      url: 'https://my.clevelandclinic.org/health/diseases/4451-panic-attack-panic-disorder'
    },

    // Tamil Resources
    {
      id: 9,
      title: 'மனநல பராமரிப்பு மற்றும் மன அழுத்த மேலாண்மை',
      type: 'video',
      category: 'academic',
      language: 'tamil',
      duration: '20 min',
      description: 'Tamil மொழியில் academic stress மற்றும் work-life balance பற்றிய comprehensive guide.',
      thumbnail: 'https://images.pexels.com/photos/3807755/pexels-photo-3807755.jpeg?auto=compress&cs=tinysrgb&w=300',
      url: 'https://youtu.be/EYU5QjKvnEI?si=9W91h-RGmE5nJvdW'
    },
    {
      id: 10,
      title: 'தூக்கமின்மை மற்றும் மனநலம்',
      type: 'video',
      category: 'sleep',
      language: 'tamil',
      duration: '12 min read',
      description: 'Tamil மொழியில் sleep hygiene practices மற்றும் mental health connection.',
      thumbnail: 'https://images.pexels.com/photos/3771069/pexels-photo-3771069.jpeg?auto=compress&cs=tinysrgb&w=300',
      url: 'https://youtu.be/XA9t7M87_vs?si=LSfTFDI9mN_KRKHV'
    },
    {
      id: 11,
      title: 'கவலை கோளாறுகளுக்கான தீர்வுகள்',
      type: 'article',
      category: 'anxiety',
      language: 'tamil',
      duration: '18 min',
      description: 'Tamil மொழியில் anxiety disorders க்கான meditation மற்றும் relaxation techniques.',
      thumbnail: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=300',
      url: 'https://www.nimh.nih.gov/health/find-help'
    },

    // Telugu Resources
    {
      id: 12,
      title: 'మానసిక ఆరోగ్యం మరియు ఒత్తిడి నిర్వహణ',
      type: 'video',
      category: 'stress',
      language: 'telugu',
      duration: '18 min',
      description: 'Telugu లో progressive muscle relaxation మరియు stress relief techniques నేర్చుకోండి.',
      thumbnail: 'https://images.pexels.com/photos/3771115/pexels-photo-3771115.jpeg?auto=compress&cs=tinysrgb&w=300',
      url: 'https://youtu.be/pzDKqudxzeg?si=oEDrDJCJT73jDoer'
    },
    {
      id: 13,
      title: 'అవసాదం మరియు మానసిక ఆరోగ్య సహాయం',
      type: 'article',
      category: 'depression',
      language: 'telugu',
      duration: '15 min read',
      description: 'Telugu లో depression symptoms గుర్తింపు మరియు professional help తీసుకోవడం గురించి.',
      thumbnail: 'https://images.pexels.com/photos/3807738/pexels-photo-3807738.jpeg?auto=compress&cs=tinysrgb&w=300',
      url: 'https://www.samhsa.gov/mental-health'
    },
    {
      id: 14,
      title: 'విద్యార్థుల మానసిక ఒత్తిడి',
      type: 'video',
      category: 'academic',
      language: 'telugu',
      duration: '16 min',
      description: 'Telugu లో student mental health మరియు academic pressure manage చేసే methods.',
      thumbnail: 'https://images.pexels.com/photos/3807755/pexels-photo-3807755.jpeg?auto=compress&cs=tinysrgb&w=300',
      url: 'https://youtu.be/WWV_Pejjdls?si=CnbrRaDlrE31oimy'
    },

    // Bengali Resources
    {
      id: 15,
      title: 'বিষণ্নতার লক্ষণ চিহ্নিতকরণ',
      type: 'article',
      category: 'depression',
      language: 'bengali',
      duration: '8 min read',
      description: 'Bengali ভাষায় depression symptoms বোঝা এবং কখন professional help নিতে হবে।',
      thumbnail: 'https://images.pexels.com/photos/3807738/pexels-photo-3807738.jpeg?auto=compress&cs=tinysrgb&w=300',
      url: 'https://www.logintohealth.com/blog/bn/brain-diseases/depression-in-bengali/'
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
      {/* Header, search, filters, resources display */}
      {/* ... same as original ResourceHub JSX ... */}

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

                  <div className="flex">
                    <button 
                      className="btn btn-primary"
                      style={{ flex: 1, padding: '8px 12px', fontSize: '14px' }}
                      onClick={() => window.open(resource.url, '_blank')}
                    >
                      <ExternalLink size={14} />
                      {resource.type === 'video' ? 'Watch' : resource.type === 'audio' ? 'Listen' : 'Read'}
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
      </div>
      

        
      {/* AI Chatbot Section */}
      <div className="card mt-5" style={{
        background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
        color: 'white', border: 'none'
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

      <SimpleChatbot isOpen={chatbotOpen} onClose={() => setChatbotOpen(false)} />

      {!chatbotOpen && (
        <button
          onClick={() => setChatbotOpen(true)}
          style={{
            position: 'fixed', bottom: '30px', right: '30px', backgroundColor: '#5865f2',
            color: 'white', border: 'none', borderRadius: '50%', width: '60px', height: '60px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(88, 101, 242, 0.4)', zIndex: 999,
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}
          onMouseOver={e => { e.target.style.transform = 'scale(1.1)'; e.target.style.boxShadow = '0 6px 16px rgba(88, 101, 242, 0.6)'; }}
          onMouseOut={e => { e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = '0 4px 12px rgba(88, 101, 242, 0.4)'; }}
        >
          <MessageCircle size={24} />
        </button>
      )}
    </div>
  );
};

export default ResourceHub;
