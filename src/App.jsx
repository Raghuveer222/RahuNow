import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Sparkles, 
  Compass, 
  Sun, 
  Moon, 
  Infinity as InfinityIcon, 
  Calendar,
  Activity,
  Menu,
  X
} from 'lucide-react';
import Home from './pages/Home';
import PanchangPage from './pages/PanchangPage';
import KundliPage from './pages/KundliPage';
import NumerologyPage from './pages/NumerologyPage';
import MuhuratPage from './pages/MuhuratPage';
import './App.css';

// Layout wrapper to inject active state styles to navigation
function Navigation() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/', label: 'Home', icon: <Sparkles size={18} /> },
    { path: '/panchang', label: 'Rahu & Panchang', icon: <Sun size={18} /> },
    { path: '/kundli', label: 'Kundli Chart', icon: <Compass size={18} /> },
    { path: '/numerology', label: 'Numerology', icon: <InfinityIcon size={18} /> },
    { path: '/muhurat', label: 'Muhurat Finder', icon: <Calendar size={18} /> },
  ];

  return (
    <nav className="nav-container">
      <div className="nav-content">
        <Link to="/" className="nav-logo" onClick={() => setMobileMenuOpen(false)}>
          <div className="logo-icon">
            <Activity className="glow-icon" size={24} />
          </div>
          <span className="logo-text">Rahu<span className="text-glow">Now</span></span>
        </Link>

        {/* Desktop Nav */}
        <div className="nav-links-desktop">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${isActive ? 'active' : ''}`}
              >
                {link.icon}
                <span>{link.label}</span>
                {isActive && <span className="active-dot"></span>}
              </Link>
            );
          })}
        </div>

        {/* Mobile Toggle Button */}
        <button 
          className="mobile-menu-toggle" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="nav-drawer-mobile">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`mobile-nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <div className="footer-logo">
            <Activity size={20} />
            <span>RahuNow</span>
          </div>
          <p className="footer-tagline">Real-time cosmic calculations & premium Vedic insights.</p>
        </div>
        <div className="footer-divider"></div>
        <p className="footer-copy">&copy; {new Date().getFullYear()} RahuNow Redesign. Crafted for visual excellence & intuitive exploration.</p>
      </div>
    </footer>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navigation />
        <main className="main-content-area">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/panchang" element={<PanchangPage />} />
            <Route path="/kundli" element={<KundliPage />} />
            <Route path="/numerology" element={<NumerologyPage />} />
            <Route path="/muhurat" element={<MuhuratPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
