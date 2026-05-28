import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import styles from './Navbar.module.css';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className={styles.navbar}>
      <div className={`container ${styles.navContainer}`}>
        <Link to="/" className={styles.logo} onClick={() => window.scrollTo(0, 0)}>Campus<span style={{color: 'var(--text-primary)'}}>Atlas</span></Link>
        
        <div className={styles.navDesktop}>
          <div className={`${styles.links} ${isMobileMenuOpen ? styles.linksOpen : ''}`}>
            <Link to="/" onClick={() => { closeMenu(); window.scrollTo(0, 0); }}>Explore</Link>
            <Link to="/compare" onClick={closeMenu}>Compare</Link>
            <Link to="/predictor" onClick={closeMenu}>Predictor</Link>
            <Link to="/forum" onClick={closeMenu}>Community Hub</Link>

            {user ? (
              <>
                <Link to="/profile" onClick={closeMenu}>Profile</Link>
                <button onClick={handleLogout} className="btn btn-outline" style={{width: isMobileMenuOpen ? '100%' : 'auto'}}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline" onClick={closeMenu}>Login</Link>
                <Link to="/signup" className="btn btn-primary" onClick={closeMenu}>Sign Up</Link>
              </>
            )}
          </div>
          
          <div className={styles.navRight}>
            <button onClick={toggleTheme} className={styles.themeToggle} aria-label="Toggle Theme">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            
            <button 
              className={styles.hamburger} 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
