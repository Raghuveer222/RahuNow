import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  ChevronRight, 
  Compass, 
  Activity, 
  Sun, 
  Moon, 
  Info,
  ChevronLeft
} from 'lucide-react';
import { calculateAstrologicalTimings, calculateChoghadiya, getDailyPanchang } from '../utils/astroUtils';

function PanchangPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // URL params
  const paramDate = searchParams.get('d') || new Date().toISOString().split('T')[0];
  const paramLoc = searchParams.get('loc') || 'Mumbai, Maharashtra, India';

  // Date selection states
  const [selectedDate, setSelectedDate] = useState(paramDate);
  const [selectedLoc, setSelectedLoc] = useState(paramLoc);

  // Astro data states
  const [timings, setTimings] = useState(null);
  const [choghadiya, setChoghadiya] = useState(null);
  const [panchang, setPanchang] = useState(null);
  const [choghadiyaTab, setChoghadiyaTab] = useState('day'); // 'day' or 'night'

  useEffect(() => {
    // Re-calculate when parameters change
    const newTimings = calculateAstrologicalTimings(selectedDate, "06:12", "18:54");
    const newChoghadiya = calculateChoghadiya(selectedDate, "06:12", "18:54");
    const newPanchang = getDailyPanchang(selectedDate);
    
    setTimings(newTimings);
    setChoghadiya(newChoghadiya);
    setPanchang(newPanchang);

    // Sync URL params
    setSearchParams({ d: selectedDate, loc: selectedLoc });
  }, [selectedDate, selectedLoc]);

  // Handle changing dates (next/prev day)
  const adjustDate = (days) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  if (!timings || !choghadiya || !panchang) {
    return <div className="page-wrapper flex-center">Loading cosmic coordinates...</div>;
  }

  // Generate visual blocks for the daylight hour timeline (Sunrise to Sunset: ~12.7 hours, e.g. 06:12 to 18:54)
  // Let's divide the timeline into 8 equal parts representing Choghadiyas and map Rahu Kaal, etc.
  const daylightHours = [
    { label: 'Rahu Kaal', start: timings.rahuKaal.start, end: timings.rahuKaal.end, type: 'inauspicious', desc: 'Inauspicious: Period of Rahu. Avoid initiating important works, contracts, or starting journeys.' },
    { label: 'Abhijit Muhurta', start: timings.abhijit.start, end: timings.abhijit.end, type: 'auspicious', desc: 'Highly Auspicious: Mid-day auspicious period. Best for buying assets, signing documents, or initiating business.' },
    { label: 'Yamaganda', start: timings.yamaganda.start, end: timings.yamaganda.end, type: 'neutral', desc: 'Inauspicious: Period of Yama (death god). Best for death-related rituals or endings. Avoid auspicious starts.' },
    { label: 'Gulika Kaal', start: timings.gulika.start, end: timings.gulika.end, type: 'neutral', desc: 'Neutral/Semi-auspicious: Period of Saturn\'s son, Gulika. Good for buying assets or repeating works. Avoid starting journeys.' }
  ];

  return (
    <div className="page-wrapper">
      {/* Page Header */}
      <div className="panchang-header flex justify-between items-center mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="title-serif section-title">Panchang & timings</h1>
          <p className="text-secondary flex items-center gap-1 mt-2">
            <MapPin size={14} className="text-glow" />
            <span>{selectedLoc}</span>
          </p>
        </div>
        
        {/* Date Selector Navigation Bar */}
        <div className="date-nav-controls">
          <button onClick={() => adjustDate(-1)} className="cosmic-btn-secondary p-2 flex-center" aria-label="Previous day">
            <ChevronLeft size={16} />
          </button>
          <div className="date-display-card">
            <Calendar size={16} className="text-glow" />
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="date-input-clean"
            />
          </div>
          <button onClick={() => adjustDate(1)} className="cosmic-btn-secondary p-2 flex-center" aria-label="Next day">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Astro Pulse / Auspicious score card */}
      <div className="grid-container grid-cols-1 md:grid-cols-3 mb-8">
        <div className="cosmic-card md:col-span-2 flex flex-col justify-between">
          <div>
            <h2 className="title-serif text-lg mb-2">Daily Energy tone</h2>
            <p className="text-secondary text-sm mb-4">Auspiciousness rating: <strong>{panchang.auspiciousScore}%</strong>. {panchang.tone}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="mini-timing-box">
              <span className="timing-box-label text-inauspicious">Rahu Kaal</span>
              <span className="timing-box-val">{timings.rahuKaal.start} - {timings.rahuKaal.end}</span>
            </div>
            <div className="mini-timing-box">
              <span className="timing-box-label text-auspicious">Abhijit Muhurta</span>
              <span className="timing-box-val">{timings.abhijit.start} - {timings.abhijit.end}</span>
            </div>
            <div className="mini-timing-box">
              <span className="timing-box-label text-muted">Yamaganda</span>
              <span className="timing-box-val">{timings.yamaganda.start} - {timings.yamaganda.end}</span>
            </div>
            <div className="mini-timing-box">
              <span className="timing-box-label text-muted">Gulika Kaal</span>
              <span className="timing-box-val">{timings.gulika.start} - {timings.gulika.end}</span>
            </div>
          </div>
        </div>

        {/* Sunrise/Sunset widgets */}
        <div className="cosmic-card flex flex-col justify-center gap-6">
          <div className="flex items-center gap-4">
            <div className="sun-pulse-icon">
              <Sun size={24} className="text-amber-500 animate-pulse-slow" />
            </div>
            <div>
              <span className="text-xs text-muted block uppercase">Sunrise (Arunodaya)</span>
              <span className="text-lg font-bold">06:12 AM</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="moon-pulse-icon">
              <Moon size={24} className="text-blue-400 animate-pulse-slow" />
            </div>
            <div>
              <span className="text-xs text-muted block uppercase">Sunset (Astachal)</span>
              <span className="text-lg font-bold">06:54 PM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Daylight Timeline Section */}
      <section className="timeline-section cosmic-card mb-8">
        <h3 className="title-serif text-md mb-4 flex items-center gap-2">
          <Clock size={16} className="text-glow" />
          <span>Daylight Timings timeline</span>
        </h3>
        <p className="text-sm text-secondary mb-6">Hover over any time block to review astrological warnings and guidance:</p>
        
        {/* Timeline Bar */}
        <div className="visual-timeline-bar">
          {daylightHours.map((block, idx) => {
            // Find positions on 12-hour grid (06:00 to 18:00)
            const getPosPercent = (timeStr) => {
              const timeDec = parseTimeToDecimal(timeStr);
              const startDec = 6.2; // 06:12 sunrise
              const endDec = 18.9;  // 18:54 sunset
              const val = ((timeDec - startDec) / (endDec - startDec)) * 100;
              return Math.max(0, Math.min(100, val));
            };

            const left = getPosPercent(block.start);
            const right = getPosPercent(block.end);
            const width = right - left;

            return (
              <div 
                key={idx} 
                className={`timeline-block ${block.type}`}
                style={{ left: `${left}%`, width: `${width}%` }}
              >
                <span className="timeline-block-label">{block.label}</span>
                <span className="timeline-block-time">{block.start} - {block.end}</span>
                <div className="timeline-tooltip">
                  <div className="tooltip-header font-bold flex items-center gap-1 mb-1">
                    <Info size={12} />
                    <span>{block.label}</span>
                  </div>
                  <div className="tooltip-time text-xs text-glow mb-2">{block.start} - {block.end}</div>
                  <p className="tooltip-desc text-xs text-secondary leading-relaxed">{block.desc}</p>
                </div>
              </div>
            );
          })}
          
          {/* Timeline axis labels */}
          <div className="timeline-axis-label" style={{ left: '0%' }}>06:12 AM</div>
          <div className="timeline-axis-label" style={{ left: '25%' }}>09:20 AM</div>
          <div className="timeline-axis-label" style={{ left: '50%' }}>12:33 PM</div>
          <div className="timeline-axis-label" style={{ left: '75%' }}>03:45 PM</div>
          <div className="timeline-axis-label" style={{ left: '100%' }}>06:54 PM</div>
        </div>
      </section>

      {/* Grid: Panchang 5 Limbs & Choghadiya */}
      <div className="panchang-grid">
        {/* Five Limbs Column */}
        <div className="flex flex-col gap-6">
          <h3 className="title-serif text-lg">Five Limbs (Panchang)</h3>
          
          <div className="limbs-list">
            <div className="limb-card cosmic-card flex justify-between items-center">
              <div>
                <span className="limb-card-num text-glow">1</span>
                <h4 className="font-semibold text-md inline-block ml-2">Tithi (Lunar Day)</h4>
                <p className="text-secondary text-sm mt-1">{panchang.tithi}</p>
              </div>
              <div className="tooltip-helper relative">
                <Info size={16} className="text-muted cursor-pointer" />
                <div className="hover-tip-card">Tithi represents the lunar day of birth or transit, calculating the distance between Sun & Moon. Influences emotional nature and destiny.</div>
              </div>
            </div>

            <div className="limb-card cosmic-card flex justify-between items-center">
              <div>
                <span className="limb-card-num text-glow">2</span>
                <h4 className="font-semibold text-md inline-block ml-2">Nakshatra (Moon Constellation)</h4>
                <p className="text-secondary text-sm mt-1">{panchang.nakshatra}</p>
              </div>
              <div className="tooltip-helper relative">
                <Info size={16} className="text-muted cursor-pointer" />
                <div className="hover-tip-card">Nakshatra is the mansion where the Moon resides. It represents subconscious mindsets, mental traits, and general life tendencies.</div>
              </div>
            </div>

            <div className="limb-card cosmic-card flex justify-between items-center">
              <div>
                <span className="limb-card-num text-glow">3</span>
                <h4 className="font-semibold text-md inline-block ml-2">Yoga (Planetary Relationship)</h4>
                <p className="text-secondary text-sm mt-1">{panchang.yoga}</p>
              </div>
              <div className="tooltip-helper relative">
                <Info size={16} className="text-muted cursor-pointer" />
                <div className="hover-tip-card">Yoga is computed by adding longitude coordinates of Sun & Moon. Refers to dominant health and structural capabilities of the individual.</div>
              </div>
            </div>

            <div className="limb-card cosmic-card flex justify-between items-center">
              <div>
                <span className="limb-card-num text-glow">4</span>
                <h4 className="font-semibold text-md inline-block ml-2">Karana (Half Tithi)</h4>
                <p className="text-secondary text-sm mt-1">{panchang.karana}</p>
              </div>
              <div className="tooltip-helper relative">
                <Info size={16} className="text-muted cursor-pointer" />
                <div className="hover-tip-card">Karana represents half a Tithi. It represents actions, professional skills, and work capability.</div>
              </div>
            </div>

            <div className="limb-card cosmic-card flex justify-between items-center">
              <div>
                <span className="limb-card-num text-glow">5</span>
                <h4 className="font-semibold text-md inline-block ml-2">Vara (Solar Day)</h4>
                <p className="text-secondary text-sm mt-1">{panchang.var}</p>
              </div>
              <div className="tooltip-helper relative">
                <Info size={16} className="text-muted cursor-pointer" />
                <div className="hover-tip-card">Vara represents the day of the week ruled by a specific planet. Focuses on physical health, day energy, and vital life forces.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Choghadiya Column */}
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h3 className="title-serif text-lg">Choghadiya</h3>
            <div className="cosmic-tabs">
              <button 
                className={`cosmic-tab ${choghadiyaTab === 'day' ? 'active' : ''}`}
                onClick={() => setChoghadiyaTab('day')}
              >
                Day
              </button>
              <button 
                className={`cosmic-tab ${choghadiyaTab === 'night' ? 'active' : ''}`}
                onClick={() => setChoghadiyaTab('night')}
              >
                Night
              </button>
            </div>
          </div>

          <div className="choghadiya-list-card cosmic-card p-0">
            <div className="choghadiya-table-header grid grid-cols-3 p-4 border-b border-muted">
              <span className="text-xs uppercase tracking-wider text-muted font-bold">Timing</span>
              <span className="text-xs uppercase tracking-wider text-muted font-bold text-center">Choghadiya</span>
              <span className="text-xs uppercase tracking-wider text-muted font-bold text-right">Efficacy</span>
            </div>
            
            <div className="choghadiya-rows">
              {choghadiya[choghadiyaTab].map((row, idx) => (
                <div 
                  key={idx} 
                  className={`choghadiya-row grid grid-cols-3 p-4 items-center border-b border-muted last:border-b-0 hover:bg-white-02`}
                >
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-muted" />
                    <span className="text-sm font-medium">{row.start} - {row.end}</span>
                  </div>
                  <div className="text-center">
                    <span className="choghadiya-name font-bold" style={{ color: row.color }}>
                      {row.name}
                    </span>
                    <span className="text-xs text-muted block">{row.energy}</span>
                  </div>
                  <div className="text-right">
                    <span className={`badge ${row.quality === 'auspicious' ? 'badge-auspicious' : row.quality === 'inauspicious' ? 'badge-inauspicious' : 'badge-neutral'}`}>
                      {row.quality}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Utility: parse HH:MM to decimal
function parseTimeToDecimal(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  return h + m / 60;
}

export default PanchangPage;
