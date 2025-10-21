import React, { useState } from 'react';
import { Send, Heart, MessageCircle, Users, Plus, Search, Filter } from 'lucide-react';

const PeerSupport = () => {
  const [newPost, setNewPost] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewPostForm, setShowNewPostForm] = useState(false);

  const categories = [
    { id: 'all', name: 'All Posts', color: 'var(--accent-primary)' },
    { id: 'anxiety', name: 'Anxiety Support', color: 'var(--accent-warning)' },
    { id: 'depression', name: 'Depression Support', color: 'var(--accent-danger)' },
    { id: 'academic', name: 'Academic Stress', color: 'var(--accent-secondary)' },
    { id: 'general', name: 'General Support', color: 'var(--accent-primary)' },
    { id: 'success', name: 'Success Stories', color: 'var(--accent-secondary)' }
  ];

  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'Anonymous Student',
      category: 'anxiety',
      title: 'Dealing with exam anxiety',
      content: 'I\'ve been struggling with severe anxiety before exams. My heart races and I can\'t focus. Has anyone found effective techniques to manage this?',
      timestamp: '2 hours ago',
      likes: 12,
      replies: 8,
      isLiked: false
    },
    {
      id: 2,
      author: 'Peer Volunteer',
      category: 'success',
      title: 'Small victories matter',
      content: 'Just wanted to share that I managed to attend all my classes this week after struggling with depression. It might seem small, but it feels huge to me. Keep going everyone! 💪',
      timestamp: '5 hours ago',
      likes: 24,
      replies: 15,
      isLiked: true,
      isPeerVolunteer: true
    },
    {
      id: 3,
      author: 'Anonymous Student',
      category: 'academic',
      title: 'Overwhelmed with coursework',
      content: 'I have 3 assignments due next week and I haven\'t started any of them. I keep procrastinating and then feeling guilty about it. Any advice on breaking this cycle?',
      timestamp: '1 day ago',
      likes: 18,
      replies: 22,
      isLiked: false
    },
    {
      id: 4,
      author: 'Anonymous Student',
      category: 'depression',
      title: 'Feeling isolated in college',
      content: 'I\'ve been in college for 6 months now but still feel like I don\'t belong anywhere. It\'s hard to make friends and I spend most of my time alone. Anyone else feeling this way?',
      timestamp: '2 days ago',
      likes: 31,
      replies: 19,
      isLiked: false
    }
  ]);

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleLike = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  const handleNewPost = (e) => {
    e.preventDefault();
    if (newPost.trim()) {
      const post = {
        id: Date.now(),
        author: 'Anonymous Student',
        category: 'general',
        title: newPost.substring(0, 50) + (newPost.length > 50 ? '...' : ''),
        content: newPost,
        timestamp: 'Just now',
        likes: 0,
        replies: 0,
        isLiked: false
      };
      setPosts([post, ...posts]);
      setNewPost('');
      setShowNewPostForm(false);
    }
  };

  const getCategoryColor = (categoryId) => {
    return categories.find(cat => cat.id === categoryId)?.color || 'var(--accent-primary)';
  };

  const getCategoryName = (categoryId) => {
    return categories.find(cat => cat.id === categoryId)?.name || 'General';
  };

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div className="fade-in">
        {/* Header */}
        <div className="text-center mb-5">
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '16px' }}>
            Peer Support Community
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            Connect with fellow students, share your experiences, and support each other through challenges. 
            All posts are anonymous and moderated by trained volunteers.
          </p>
        </div>

        {/* Community Guidelines */}
        <div className="card mb-4" style={{ backgroundColor: 'var(--accent-secondary)', color: 'white', border: 'none' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '12px' }}>
            🤝 Community Guidelines
          </h3>
          <ul style={{ margin: 0, paddingLeft: '20px', opacity: 0.9 }}>
            <li>Be respectful and supportive to all community members</li>
            <li>Share experiences, not advice unless you're a trained volunteer</li>
            <li>Keep posts anonymous - don't share personal identifying information</li>
            <li>If you're in crisis, please contact emergency services or our crisis helpline</li>
          </ul>
        </div>

        {/* Search and Filters */}
        <div className="card mb-4">
          <div className="flex-between mb-3" style={{ alignItems: 'flex-start', gap: '16px' }}>
            <div style={{ flex: 1 }}>
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
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ paddingLeft: '44px' }}
                />
              </div>
            </div>
            <button
              onClick={() => setShowNewPostForm(!showNewPostForm)}
              className="btn btn-primary"
            >
              <Plus size={16} />
              New Post
            </button>
          </div>

          <div className="flex" style={{ gap: '8px', flexWrap: 'wrap' }}>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`btn ${selectedCategory === category.id ? 'btn-primary' : 'btn-outline'}`}
                style={{ 
                  padding: '6px 12px', 
                  fontSize: '14px',
                  backgroundColor: selectedCategory === category.id ? category.color : 'transparent',
                  borderColor: category.color,
                  color: selectedCategory === category.id ? 'white' : category.color
                }}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* New Post Form */}
        {showNewPostForm && (
          <div className="card mb-4">
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '16px' }}>
              Share Your Thoughts
            </h3>
            <form onSubmit={handleNewPost}>
              <div className="form-group">
                <textarea
                  className="form-input form-textarea"
                  placeholder="What's on your mind? Share your experience, ask for support, or offer encouragement to others..."
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  required
                  style={{ minHeight: '120px' }}
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="btn btn-primary">
                  <Send size={16} />
                  Post Anonymously
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowNewPostForm(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Posts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filteredPosts.length > 0 ? (
            filteredPosts.map(post => (
              <div key={post.id} className="card">
                <div className="flex-between mb-3" style={{ alignItems: 'flex-start' }}>
                  <div className="flex" style={{ alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: post.isPeerVolunteer ? 'var(--accent-secondary)' : 'var(--accent-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold'
                    }}>
                      {post.isPeerVolunteer ? '🎓' : '👤'}
                    </div>
                    <div>
                      <div className="flex" style={{ alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: '600' }}>{post.author}</span>
                        {post.isPeerVolunteer && (
                          <span style={{
                            backgroundColor: 'var(--accent-secondary)',
                            color: 'white',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}>
                            Peer Volunteer
                          </span>
                        )}
                      </div>
                      <div className="flex" style={{ alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                        <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                          {post.timestamp}
                        </span>
                        <span style={{
                          backgroundColor: getCategoryColor(post.category),
                          color: 'white',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          {getCategoryName(post.category)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '12px' }}>
                  {post.title}
                </h3>
                
                <p style={{ 
                  color: 'var(--text-primary)', 
                  lineHeight: '1.6',
                  marginBottom: '20px'
                }}>
                  {post.content}
                </p>

                <div className="flex-between" style={{ alignItems: 'center' }}>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleLike(post.id)}
                      className="btn"
                      style={{
                        backgroundColor: 'transparent',
                        color: post.isLiked ? 'var(--accent-danger)' : 'var(--text-secondary)',
                        padding: '6px 12px',
                        fontSize: '14px',
                        border: 'none'
                      }}
                    >
                      <Heart size={16} fill={post.isLiked ? 'currentColor' : 'none'} />
                      {post.likes}
                    </button>
                    <button
                      className="btn"
                      style={{
                        backgroundColor: 'transparent',
                        color: 'var(--text-secondary)',
                        padding: '6px 12px',
                        fontSize: '14px',
                        border: 'none'
                      }}
                    >
                      <MessageCircle size={16} />
                      {post.replies} replies
                    </button>
                  </div>
                  <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '14px' }}>
                    Reply
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="card text-center" style={{ padding: '60px 20px' }}>
              <div style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                <Users size={48} />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '8px' }}>
                No Posts Found
              </h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
                {searchTerm || selectedCategory !== 'all' 
                  ? 'Try adjusting your search or filter to find relevant posts.'
                  : 'Be the first to start a conversation in our community!'
                }
              </p>
              {!showNewPostForm && (
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowNewPostForm(true)}
                >
                  <Plus size={16} />
                  Create First Post
                </button>
              )}
            </div>
          )}
        </div>

        {/* Crisis Support */}
        <div className="card mt-5" style={{
          backgroundColor: 'var(--accent-danger)',
          color: 'white',
          border: 'none'
        }}>
          <div className="text-center">
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '16px' }}>
              🚨 Need Immediate Help?
            </h3>
            <p style={{ marginBottom: '20px', opacity: 0.9 }}>
              If you're experiencing thoughts of self-harm or suicide, please reach out for immediate professional help.
            </p>
            <div className="flex-center gap-3" style={{ flexWrap: 'wrap' }}>
              <button 
                className="btn"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }}
                onClick={() => window.open('tel:+911234567890')}
              >
                Crisis Helpline: 123-456-7890
              </button>
              <button 
                className="btn"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }}
              >
                Chat with Counselor
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeerSupport;