

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import axios from 'axios';

const ScreeningTest = () => {
  const [currentTest, setCurrentTest] = useState('phq9');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({ phq9: {}, gad7: {} });
  const [completed, setCompleted] = useState(false);
  const [results, setResults] = useState(null);
  const [user, setUser] = useState(null); // logged-in user info

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      console.log('Loaded user from localStorage:', storedUser); // Debug
      setUser(storedUser);
    } else {
      console.warn('⚠️ No user found in localStorage!');
    }
  }, []);

  // Questions
  const phq9Questions = [
    "Little interest or pleasure in doing things",
    "Feeling down, depressed, or hopeless",
    "Trouble falling or staying asleep, or sleeping too much",
    "Feeling tired or having little energy",
    "Poor appetite or overeating",
    "Feeling bad about yourself or that you are a failure or have let yourself or your family down",
    "Trouble concentrating on things, such as reading the newspaper or watching television",
    "Moving or speaking so slowly that other people could have noticed. Or the opposite being so fidgety or restless that you have been moving around a lot more than usual",
    "Thoughts that you would be better off dead, or of hurting yourself"
  ];

  const gad7Questions = [
    "Feeling nervous, anxious, or on edge",
    "Not being able to stop or control worrying",
    "Worrying too much about different things",
    "Trouble relaxing",
    "Being so restless that it is hard to sit still",
    "Becoming easily annoyed or irritable",
    "Feeling afraid, as if something awful might happen"
  ];

  const answerOptions = [
    { value: 0, label: "Not at all" },
    { value: 1, label: "Several days" },
    { value: 2, label: "More than half the days" },
    { value: 3, label: "Nearly every day" }
  ];

  const getCurrentQuestions = () => currentTest === 'phq9' ? phq9Questions : gad7Questions;

  const handleAnswerSelect = (value) => {
    setAnswers(prev => ({
      ...prev,
      [currentTest]: { ...prev[currentTest], [currentQuestion]: value }
    }));
  };

  const handleNext = () => {
    const questions = getCurrentQuestions();
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (currentTest === 'phq9') {
      setCurrentTest('gad7');
      setCurrentQuestion(0);
    } else {
      calculateResults();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
    else if (currentTest === 'gad7') {
      setCurrentTest('phq9');
      setCurrentQuestion(phq9Questions.length - 1);
    }
  };

  const isCurrentAnswered = () => answers[currentTest][currentQuestion] !== undefined;

  const getProgress = () => {
    const totalQuestions = phq9Questions.length + gad7Questions.length;
    const completedQuestions = Object.keys(answers.phq9).length + Object.keys(answers.gad7).length;
    return (completedQuestions / totalQuestions) * 100;
  };

  // Calculate results
  const calculateResults = () => {
    const phq9Score = Object.values(answers.phq9).reduce((sum, score) => sum + score, 0);
    const gad7Score = Object.values(answers.gad7).reduce((sum, score) => sum + score, 0);

    const getPhq9Interpretation = (score) => {
      if (score <= 4) return { level: 'Minimal', color: 'var(--accent-secondary)', recommendation: 'Your depression symptoms appear to be minimal. Continue with self-care practices and healthy lifestyle habits.' };
      if (score <= 9) return { level: 'Mild', color: 'var(--accent-warning)', recommendation: 'You may be experiencing mild depression. Consider exploring our resources or speaking with a counselor.' };
      if (score <= 14) return { level: 'Moderate', color: 'var(--accent-danger)', recommendation: 'You may be experiencing moderate depression. We recommend speaking with a mental health professional.' };
      if (score <= 19) return { level: 'Moderately Severe', color: 'var(--accent-danger)', recommendation: 'Moderately severe depression. Please consider booking an appointment soon.' };
      return { level: 'Severe', color: 'var(--accent-danger)', recommendation: 'Severe depression. Immediate professional help is strongly recommended.' };
    };

    const getGad7Interpretation = (score) => {
      if (score <= 4) return { level: 'Minimal', color: 'var(--accent-secondary)', recommendation: 'Your anxiety symptoms appear minimal. Continue stress management practices.' };
      if (score <= 9) return { level: 'Mild', color: 'var(--accent-warning)', recommendation: 'Mild anxiety detected. Explore relaxation resources or speak to a counselor.' };
      if (score <= 14) return { level: 'Moderate', color: 'var(--accent-danger)', recommendation: 'Moderate anxiety. We recommend consulting a mental health professional.' };
      return { level: 'Severe', color: 'var(--accent-danger)', recommendation: 'Severe anxiety. Immediate professional support is advised.' };
    };

    const phq9Result = getPhq9Interpretation(phq9Score);
    const gad7Result = getGad7Interpretation(gad7Score);

    const finalResults = { phq9Score, gad7Score, phq9Result, gad7Result, completedAt: new Date().toISOString() };

    setResults(finalResults);
    setCompleted(true);
    localStorage.setItem('mindtech-screening-results', JSON.stringify(finalResults));

    handleSubmitTest(finalResults); // store in DB
  };

  // Store results in DB with debug logs
  const handleSubmitTest = async (finalResults) => {
    if (!user) {
      console.warn("⚠️ User not found. Cannot save results.");
      return;
    }

    const studentId = user.studentId || user.id || null;
    const studentName = user.name || user.username || "Unknown";

    const resultData = {
      studentId,
      name: studentName,
      phq9: finalResults.phq9Score,
      gad7: finalResults.gad7Score
    };

    console.log("📤 Sending resultData to backend:", resultData); // Debug log

    try {
      const res = await axios.post("http://localhost:5000/api/screening/save", resultData);
      console.log("✅ Scores saved to DB:", res.data);
    } catch (err) {
      console.error("❌ Error saving scores:", err.response?.data || err.message);
    }
  };

  const totalQuestions = phq9Questions.length + gad7Questions.length;
  const currentQuestionNumber = currentTest === 'phq9'
    ? currentQuestion + 1
    : phq9Questions.length + currentQuestion + 1;

  if (completed && results) {
    return (
      <div className="container" style={{ padding: '40px 20px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="card fade-in text-center">
            <div style={{ color: 'var(--accent-secondary)', marginBottom: '16px' }}>
              <CheckCircle size={48} />
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '16px' }}>Assessment Complete</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
              Thank you for completing the mental health screening. Here are your results:
            </p>

            <div className="grid grid-2 mb-4">
              <div className="card" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <h3>PHQ-9 (Depression)</h3>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: results.phq9Result.color }}>
                  {results.phq9Score}/27
                </div>
                <div style={{ color: results.phq9Result.color }}>{results.phq9Result.level}</div>
                <p>{results.phq9Result.recommendation}</p>
              </div>

              <div className="card" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <h3>GAD-7 (Anxiety)</h3>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: results.gad7Result.color }}>
                  {results.gad7Score}/21
                </div>
                <div style={{ color: results.gad7Result.color }}>{results.gad7Result.level}</div>
                <p>{results.gad7Result.recommendation}</p>
              </div>
            </div>

            <div className="flex-center gap-3">
              <button onClick={() => navigate('/dashboard')} className="btn btn-primary">Back to Dashboard</button>
              <button onClick={() => navigate('/resources')} className="btn btn-secondary">Explore Resources</button>
              <button onClick={() => navigate('/book-appointment')} className="btn btn-outline">Book Appointment</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render questions
  const questions = getCurrentQuestions();

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <div className="card fade-in">
          {/* Header */}
          <div className="text-center mb-4">
            <div style={{ color: 'var(--accent-primary)', marginBottom: '16px' }}>
              <Brain size={48} />
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '8px' }}>
              Mental Health Screening
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              {currentTest === 'phq9' ? 'PHQ-9 Depression Assessment' : 'GAD-7 Anxiety Assessment'}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="progress-bar" style={{
            width: '100%',
            height: '8px',
            backgroundColor: 'var(--bg-tertiary)',
            borderRadius: '4px',
            overflow: 'hidden',
            marginBottom: '8px'
          }}>
            <div
              className="progress-fill"
              style={{
                width: `${getProgress()}%`,
                height: '100%',
                backgroundColor: 'var(--accent-primary)',
                transition: 'width 0.3s ease'
              }}
            ></div>
          </div>
          <p style={{
            textAlign: 'center',
            fontSize: '14px',
            color: 'var(--text-secondary)',
            marginBottom: '32px'
          }}>
            Question {currentQuestionNumber} of {totalQuestions}
          </p>

          {/* Question */}
          <div className="mb-4">
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '16px',
              lineHeight: '1.4'
            }}>
              Over the last 2 weeks, how often have you been bothered by:
            </h2>
            <p style={{
              fontSize: '1.1rem',
              color: 'var(--text-primary)',
              marginBottom: '24px',
              fontWeight: '500'
            }}>
              "{questions[currentQuestion]}"
            </p>
          </div>

          {/* Options as cards */}
          <div style={{ marginBottom: '32px' }}>
            {answerOptions.map(option => (
              <label
                key={option.value}
                className="card"
                style={{
                  display: 'block',
                  marginBottom: '12px',
                  cursor: 'pointer',
                  padding: '16px',
                  backgroundColor: answers[currentTest][currentQuestion] === option.value
                    ? 'var(--accent-primary)'
                    : 'var(--bg-tertiary)',
                  color: answers[currentTest][currentQuestion] === option.value
                    ? 'white'
                    : 'var(--text-primary)',
                  border: `2px solid ${answers[currentTest][currentQuestion] === option.value
                    ? 'var(--accent-primary)'
                    : 'var(--border-color)'}`,
                  borderRadius: '8px',
                  fontWeight: '500',
                  fontSize: '1rem',
                  boxShadow: answers[currentTest][currentQuestion] === option.value
                    ? '0 2px 8px rgba(0,0,0,0.08)'
                    : 'none',
                  transition: 'all 0.2s'
                }}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion}`}
                  value={option.value}
                  checked={answers[currentTest][currentQuestion] === option.value}
                  onChange={() => handleAnswerSelect(option.value)}
                  style={{ display: 'none' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{option.label}</span>
                  {/* <span style={{
                    fontSize: '14px',
                    opacity: 0.8,
                    fontWeight: '600'
                  }}>
                    {option.value} point{option.value !== 1 ? 's' : ''}
                  </span> */}
                </div>
              </label>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex-between">
            <button
              onClick={handlePrevious}
              className="btn btn-outline"
              disabled={currentTest === 'phq9' && currentQuestion === 0}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                opacity: currentTest === 'phq9' && currentQuestion === 0 ? 0.5 : 1,
                cursor: currentTest === 'phq9' && currentQuestion === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              <ArrowLeft size={16} />
              Previous
            </button>
            <button
              onClick={handleNext}
              className="btn btn-primary"
              disabled={!isCurrentAnswered()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                opacity: !isCurrentAnswered() ? 0.5 : 1,
                cursor: !isCurrentAnswered() ? 'not-allowed' : 'pointer'
              }}
            >
              {currentTest === 'gad7' && currentQuestion === gad7Questions.length - 1
                ? 'Complete Assessment'
                : 'Next'}
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScreeningTest;
