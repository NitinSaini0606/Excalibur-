// import React from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { Sun, Moon, LogOut, User, Shield } from 'lucide-react';
// import { useTheme } from '../contexts/ThemeContext';
// import { useAuth } from '../contexts/AuthContext';

// const Header = () => {
//   const { theme, toggleTheme } = useTheme();
//   const { user, logout, isAuthenticated, isAdmin } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const handleLogout = () => {
//     logout();
//     navigate('/');
//   };

//   const isActive = (path) => location.pathname === path;

//   return (
//     <header style={{
//       backgroundColor: 'var(--bg-secondary)',
//       borderBottom: '1px solid var(--border-color)',
//       padding: '16px 0',
//       position: 'sticky',
//       top: 0,
//       zIndex: 100,
//       boxShadow: 'var(--shadow)'
//     }}>
//       <div className="container">
//         <nav className="flex-between">
//           <Link 
//             to="/" 
//             style={{
//               fontSize: '24px',
//               fontWeight: 'bold',
//               color: 'var(--accent-primary)',
//               textDecoration: 'none',
//               display: 'flex',
//               alignItems: 'center',
//               gap: '8px'
//             }}
//           >
//              MindTech
//           </Link>

//           <div className="flex" style={{ alignItems: 'center', gap: '16px' }}>
//             {isAuthenticated && (
//               <div className="flex" style={{ alignItems: 'center', gap: '16px' }}>
//                 <Link 
//                   to="/dashboard" 
//                   className={`btn ${isActive('/dashboard') ? 'btn-primary' : 'btn-outline'}`}
//                   style={{ padding: '8px 16px', fontSize: '14px' }}
//                 >
//                   Dashboard
//                 </Link>
//                 <Link 
//                   to="/resources" 
//                   className={`btn ${isActive('/resources') ? 'btn-primary' : 'btn-outline'}`}
//                   style={{ padding: '8px 16px', fontSize: '14px' }}
//                 >
//                   Resources
//                 </Link>
//                 <Link 
//                   to="/peer-support" 
//                   className={`btn ${isActive('/peer-support') ? 'btn-primary' : 'btn-outline'}`}
//                   style={{ padding: '8px 16px', fontSize: '14px' }}
//                 >
//                   Peer Support
//                 </Link>
//                 {isAdmin && (
//                   <Link 
//                     to="/admin" 
//                     className={`btn ${isActive('/admin') ? 'btn-primary' : 'btn-outline'}`}
//                     style={{ padding: '8px 16px', fontSize: '14px' }}
//                   >
//                     <Shield size={16} />
//                     Admin
//                   </Link>
//                 )}
//               </div>
//             )}

//             <button
//               onClick={toggleTheme}
//               className="btn btn-outline"
//               style={{ padding: '8px 12px' }}
//               title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
//             >
//               {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
//             </button>

//             {isAuthenticated ? (
//               <div className="flex" style={{ alignItems: 'center', gap: '12px' }}>
//                 <div className="flex" style={{ alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
//                   <User size={16} />
//                   <span style={{ fontSize: '14px' }}>{user.name}</span>
//                 </div>
//                 <button
//                   onClick={handleLogout}
//                   className="btn btn-danger"
//                   style={{ padding: '8px 12px' }}
//                   title="Logout"
//                 >
//                   <LogOut size={16} />
//                 </button>
//               </div>
//             ) : (
//               <Link to="/login" className="btn btn-primary">
//                 Login
//               </Link>
//             )}
//           </div>
//         </nav>
//       </div>
//     </header>
//   );
// };

// export default Header;

import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sun, Moon, LogOut, User, Shield } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header style={{
      backgroundColor: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border-color)',
      padding: '16px 0',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: 'var(--shadow)'
    }}>
      <div className="container">
        <nav className="flex-between">
          <Link 
            to="/" 
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: 'var(--accent-primary)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
             MindTech
          </Link>

          <div className="flex" style={{ alignItems: 'center', gap: '16px' }}>
            {isAuthenticated && (
              <>
                {isAdmin ? (
                  
                  <Link 
                    to="/admin" 
                    className={`btn ${isActive('/admin') ? 'btn-primary' : 'btn-outline'}`}
                    style={{ padding: '8px 16px', fontSize: '14px' }}
                  >
                    <Shield size={16} />
                    Admin Dashboard
                  </Link>
                ) : (
                  
                  <>
                    <Link 
                      to="/dashboard" 
                      className={`btn ${isActive('/dashboard') ? 'btn-primary' : 'btn-outline'}`}
                      style={{ padding: '8px 16px', fontSize: '14px' }}
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/resources" 
                      className={`btn ${isActive('/resources') ? 'btn-primary' : 'btn-outline'}`}
                      style={{ padding: '8px 16px', fontSize: '14px' }}
                    >
                      Resources
                    </Link>
                    <Link 
                      to="/peer-support" 
                      className={`btn ${isActive('/peer-support') ? 'btn-primary' : 'btn-outline'}`}
                      style={{ padding: '8px 16px', fontSize: '14px' }}
                    >
                      Peer Support
                    </Link>
                  </>
                )}
              </>
            )}

            <button
              onClick={toggleTheme}
              className="btn btn-outline"
              style={{ padding: '8px 12px' }}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {isAuthenticated ? (
              <div className="flex" style={{ alignItems: 'center', gap: '12px' }}>
                <div className="flex" style={{ alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                  <User size={16} />
                  <span style={{ fontSize: '14px' }}>{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn btn-danger"
                  style={{ padding: '8px 12px' }}
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary">
                Login
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
