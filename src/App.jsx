// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { ThemeProvider } from './contexts/ThemeContext';
// import { AuthProvider } from './contexts/AuthContext';
// import Header from './components/Header';
// import LandingPage from './pages/LandingPage';
// import LoginPage from './pages/LoginPage';
// import StudentDetailsPage from './pages/StudentDetailsPage';
// import StudentDashboard from './pages/StudentDashboard';
// import ScreeningTest from './pages/ScreeningTest';
// import ResourceHub from './pages/ResourceHub';
// import PeerSupport from './pages/PeerSupport';
// import BookAppointment from './pages/BookAppointment';
// import AdminDashboard from './pages/AdminDashboard';
// import ProtectedRoute from './components/ProtectedRoute';
// import './App.css';

// function App() {
//   return (
//     <ThemeProvider>
//       <AuthProvider>
//         <Router>
//           <div className="App">
//             <Header />
//             <main className="main-content">
//               <Routes>
//                 <Route path="/" element={<LandingPage />} />
//                 <Route path="/login" element={<LoginPage />} />
//                 <Route 
//                   path="/student-details" 
//                   element={
//                     <ProtectedRoute>
//                       <StudentDetailsPage />
//                     </ProtectedRoute>
//                   } 
//                 />
//                 <Route 
//                   path="/dashboard" 
//                   element={
//                     <ProtectedRoute>
//                       <StudentDashboard />
//                     </ProtectedRoute>
//                   } 
//                 />
//                 <Route 
//                   path="/screening" 
//                   element={
//                     <ProtectedRoute>
//                       <ScreeningTest />
//                     </ProtectedRoute>
//                   } 
//                 />
//                 <Route 
//                   path="/resources" 
//                   element={
//                     <ProtectedRoute>
//                       <ResourceHub />
//                     </ProtectedRoute>
//                   } 
//                 />
//                 <Route 
//                   path="/peer-support" 
//                   element={
//                     <ProtectedRoute>
//                       <PeerSupport />
//                     </ProtectedRoute>
//                   } 
//                 />
//                 <Route 
//                   path="/book-appointment" 
//                   element={
//                     <ProtectedRoute>
//                       <BookAppointment />
//                     </ProtectedRoute>
//                   } 
//                 />
//                 <Route 
//                   path="/admin" 
//                   element={
//                     <ProtectedRoute adminOnly>
//                       <AdminDashboard />
//                     </ProtectedRoute>
//                   } 
//                 />
//               </Routes>
//             </main>
//           </div>
//         </Router>
//       </AuthProvider>
//     </ThemeProvider>
//   );
// }

// export default App;


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import StudentDetailsPage from './pages/StudentDetailsPage';
import StudentDashboard from './pages/StudentDashboard';
import ScreeningTest from './pages/ScreeningTest';
import ResourceHub from './pages/ResourceHub';

import PeerSupport from './pages/PeerSupport';
import BookAppointment from './pages/BookAppointment';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
// import Chatbot from './pages/chatbot';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Header />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route 
                  path="/student-details" 
                  element={
                    <ProtectedRoute>
                      <StudentDetailsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <StudentDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/chatbot" 
                  element={
                    <ProtectedRoute>
                      {/* <Chatbot/> */}
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/screening" 
                  element={
                    <ProtectedRoute>
                      <ScreeningTest />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/resources" 
                  element={
                    <ProtectedRoute>
                      <ResourceHub />
                      
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/peer-support" 
                  element={
                    <ProtectedRoute>
                      <PeerSupport />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/book-appointment" 
                  element={
                    <ProtectedRoute>
                      <BookAppointment />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;