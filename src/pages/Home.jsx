import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Sparkles, 
  MapPin, 
  Clock, 
  User, 
  Calendar,
  Sun,
  AlertTriangle,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { calculateAstrologicalTimings, getDailyPanchang } from '../utils/astroUtils';

// Mock location autocomplete suggestions
const MOCK_CITIES = [
  "Mumbai, Maharashtra, India",
  "Delhi, National Capital Territory, India",
  "Bengaluru, Karnataka, India",
  "Kolkata, West Bengal, India",
  "Chennai, Tamil Nadu, India",
  "London, United Kingdom",
  "New York, NY, United States",
  "San Francisco, CA, United States",
  "Tokyo, Japan",
  "Sydney, Australia"
];

function Home() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('panchang'); // 'panchang', 'kundli', 'numerology'
  
  // Form fields
  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('12:00');
  const [locationInput, setLocationInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  // Astro ticker states
  const [timings, setTimings] = useState(null);
  const [panchang, setPanchang] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Standard coordinates for Mumbai/Delhi (defaults)
    const t = calculateAstrologicalTimings(new Date().toISOString(), "06:12", "18:54");
    const p = getDailyPanchang(new Date().toISOString());
    setTimings(t);
    setPanchang(p);

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Handle location search suggestions
  const handleLocationChange = (e) => {
    const value = e.target.value;
    setLocationInput(value);
    if (value.trim().length > 1) {
      const filtered = MOCK_CITIES.filter(city => 
        city.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectCity = (city) => {
    setLocationInput(city);
    setShowSuggestions(false);
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === 'panchang') {
      navigate(`/panchang?d=${date}&loc=${encodeURIComponent(locationInput || 'Mumbai, India')}`);
    } else if (activeTab === 'kundli') {
      if (!name.trim()) {
        alert("Please enter your name for Kundli generation.");
        return;
      }
      navigate(`/kundli?n=${encodeURIComponent(name)}&d=${date}&t=${time}&loc=${encodeURIComponent(locationInput || 'Mumbai, India')}`);
    } else if (activeTab === 'numerology') {
      if (!name.trim()) {
        alert("Please enter your name for Numerology reading.");
        return;
      }
      navigate(`/numerology?n=${encodeURIComponent(name)}&d=${date}`);
    }
  };

  // Ticker helpers to find active timing status
  const getTickerStatus = () => {
    if (!timings) return null;
    const nowDec = currentTime.getHours() + currentTime.getMinutes() / 60;
    
    // Check Rahu Kaal
    if (nowDec >= timings.rahuKaal.startDec && nowDec <= timings.rahuKaal.endDec) {
      return {
        type: 'inauspicious',
        message: `Rahu Kaal is active now (${timings.rahuKaal.start} - ${timings.rahuKaal.end}). Avoid initiating new tasks.`,
        icon: <AlertTriangle className="animate-pulse-slow" size={20} />
      };
    }
    
    // Check Abhijit Muhurta
    if (nowDec >= timings.abhijit.startDec && nowDec <= timings.abhijit.endDec) {
      return {
        type: 'auspicious',
        message: `Abhijit Muhurta is active now (${timings.abhijit.start} - ${timings.abhijit.end}). Exceptional time for actions!`,
        icon: <Sparkles className="animate-pulse-slow" size={20} />
      };
    }

    return {
      type: 'neutral',
      message: `Next Rahu Kaal today: ${timings.rahuKaal.start} - ${timings.rahuKaal.end}`,
      icon: <Clock size={20} />
    };
  };

  const statusTicker = getTickerStatus();

  return (
    <div className="page-wrapper">
      {/* Immersive Hero Header */}
      <header className="hero-section">
        <div className="hero-text-content">
          <div className="badge badge-auspicious mb-4">
            <Sparkles size={12} />
            <span>Redesigned Astro Experience</span>
          </div>
          <h1 className="title-serif hero-title">
            Decipher the <span className="text-glow">Cosmic Flow</span>
          </h1>
          <p className="hero-subtitle">
            Experience premium, mathematically accurate Vedic astrology. Track local inauspicious hours, review charts, and decipher life timelines.
          </p>
        </div>

        {/* Rotating SVG Celestial Wheel Graphic */}
        <div className="hero-graphic">
          <div className="celestial-wheel-container">
            <svg className="celestial-wheel-svg animate-spin-slow" viewBox="0 0 200 200" width="100%" height="100%">
              {/* Outer constellations boundaries */}
              <circle cx="100" cy="100" r="95" fill="none" stroke="rgba(138, 43, 226, 0.1)" strokeWidth="1" />
              <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="0.5" />
              <circle cx="100" cy="100" r="75" fill="none" stroke="rgba(138, 43, 226, 0.2)" strokeWidth="1" strokeDasharray="3, 3" />
              
              {/* Spokes representing zodiac signs */}
              {[...Array(12)].map((_, i) => {
                const angle = (i * 30 * Math.PI) / 180;
                const x1 = 100 + 75 * Math.cos(angle);
                const y1 = 100 + 75 * Math.sin(angle);
                const x2 = 100 + 95 * Math.cos(angle);
                const y2 = 100 + 95 * Math.sin(angle);
                return (
                  <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(138, 43, 226, 0.15)" strokeWidth="1" />
                );
              })}

              {/* Zodiac glyph symbols simulated inside sectors */}
              {[...Array(12)].map((_, i) => {
                const angle = ((i * 30 + 15) * Math.PI) / 180;
                const x = 100 + 82 * Math.cos(angle);
                const y = 100 + 82 * Math.sin(angle);
                return (
                  <circle key={i} cx={x} cy={y} r="2" fill="var(--accent-gold)" opacity="0.6" />
                );
              })}
              
              {/* Sun center */}
              <circle cx="100" cy="100" r="10" fill="url(#sun-gradient)" />
              <defs>
                <radialGradient id="sun-gradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#d97706" />
                </radialGradient>
              </defs>
            </svg>
            <div className="wheel-glow-overlay"></div>
          </div>
        </div>
      </header>

      {/* Astro Indicators Row */}
      {statusTicker && (
        <div className="ticker-bar mb-6">
          <div className={`ticker-wrapper ${statusTicker.type === 'auspicious' ? 'ticker-auspicious' : statusTicker.type === 'inauspicious' ? 'ticker-inauspicious' : 'ticker-neutral'}`}>
            <span className="ticker-icon">{statusTicker.icon}</span>
            <span className="ticker-text">{statusTicker.message}</span>
            <span className="ticker-time">Local: {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      )}

      {/* Main Grid: Form Hub & Mini Stats */}
      <div className="home-grid">
        {/* Unified Form Widget */}
        <div className="cosmic-card form-widget-card">
          <h2 className="title-serif card-header-title mb-4">Calculate Personal Alignment</h2>
          
          {/* Tab Selection */}
          <div className="cosmic-tabs mb-6">
            <button 
              className={`cosmic-tab ${activeTab === 'panchang' ? 'active' : ''}`}
              onClick={() => setActiveTab('panchang')}
            >
              Panchang & timings
            </button>
            <button 
              className={`cosmic-tab ${activeTab === 'kundli' ? 'active' : ''}`}
              onClick={() => setActiveTab('kundli')}
            >
              Lagna & Kundli Chart
            </button>
            <button 
              className={`cosmic-tab ${activeTab === 'numerology' ? 'active' : ''}`}
              onClick={() => setActiveTab('numerology')}
            >
              Numerology parameters
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="astro-hub-form">
            {(activeTab === 'kundli' || activeTab === 'numerology') && (
              <div className="form-group mb-4">
                <label className="cosmic-label" htmlFor="name-input">
                  <User size={12} className="mr-1 inline" /> Full Name
                </label>
                <input 
                  type="text" 
                  id="name-input"
                  placeholder="Enter full name..."
                  className="cosmic-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="form-row-2 mb-4">
              <div className="form-group">
                <label className="cosmic-label" htmlFor="date-input">
                  <Calendar size={12} className="mr-1 inline" /> Date of Birth
                </label>
                <input 
                  type="date" 
                  id="date-input"
                  className="cosmic-input"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              {activeTab === 'kundli' && (
                <div className="form-group">
                  <label className="cosmic-label" htmlFor="time-input">
                    <Clock size={12} className="mr-1 inline" /> Time of Birth
                  </label>
                  <input 
                    type="time" 
                    id="time-input"
                    className="cosmic-input"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                  />
                </div>
              )}
            </div>

            {activeTab !== 'numerology' && (
              <div className="form-group mb-6 relative">
                <label className="cosmic-label" htmlFor="location-input">
                  <MapPin size={12} className="mr-1 inline" /> Birth Location / City
                </label>
                <input 
                  type="text" 
                  id="location-input"
                  placeholder="Search city (e.g. Mumbai, New York)..."
                  className="cosmic-input"
                  value={locationInput}
                  onChange={handleLocationChange}
                  onFocus={() => locationInput.length > 1 && setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                />
                
                {/* Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <ul className="suggestions-list">
                    {suggestions.map((city, idx) => (
                      <li 
                        key={idx} 
                        onClick={() => selectCity(city)}
                        className="suggestion-item"
                      >
                        <MapPin size={12} className="text-muted mr-2" />
                        <span>{city}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <button type="submit" className="cosmic-btn w-full">
              <span>Generate Astro Dashboard</span>
              <ArrowRight size={16} />
            </button>
          </form>
        </div>

        {/* Live Daily Energetic Summary Card */}
        <div className="dashboard-stats-card">
          {panchang && (
            <div className="cosmic-card h-full flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-sm font-semibold tracking-wider text-muted uppercase">Today's Cosmic Pulse</span>
                  <div className="badge badge-auspicious">
                    <TrendingUp size={12} />
                    <span>{panchang.auspiciousScore}% Auspicious</span>
                  </div>
                </div>

                <div className="today-rating-circle mb-6">
                  <svg viewBox="0 0 100 100" width="120" height="120">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="6" />
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="45" 
                      fill="none" 
                      stroke="url(#purple-gradient)" 
                      strokeWidth="6" 
                      strokeDasharray="283"
                      strokeDashoffset={283 - (283 * panchang.auspiciousScore) / 100}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="purple-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="var(--accent-purple)" />
                        <stop offset="100%" stopColor="var(--accent-gold)" />
                      </linearGradient>
                    </defs>
                    <text x="50" y="55" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="bold">
                      {panchang.auspiciousScore}%
                    </text>
                  </svg>
                </div>

                <h3 className="title-serif text-lg mb-2">{panchang.tithi}</h3>
                <p className="text-sm text-secondary mb-4">{panchang.tone}</p>

                <div className="small-limbs-grid">
                  <div className="small-limb-item">
                    <span className="limb-label">Nakshatra</span>
                    <span className="limb-val">{panchang.nakshatra}</span>
                  </div>
                  <div className="small-limb-item">
                    <span className="limb-label">Yoga</span>
                    <span className="limb-val">{panchang.yoga}</span>
                  </div>
                  <div className="small-limb-item">
                    <span className="limb-label">Moon Sign</span>
                    <span className="limb-val">{panchang.moonSign}</span>
                  </div>
                  <div className="small-limb-item">
                    <span className="limb-label">Vara (Day)</span>
                    <span className="limb-val">{panchang.var}</span>
                  </div>
                </div>
              </div>

              <div className="footer-links-quick mt-6">
                <Link to="/panchang" className="text-link flex-center gap-1">
                  <span>View Full Panchang Details</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
