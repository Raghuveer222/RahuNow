import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Compass, 
  MapPin, 
  Clock, 
  Calendar, 
  User, 
  ChevronDown, 
  ChevronUp, 
  Info,
  Sparkles
} from 'lucide-react';
import { generateKundliData } from '../utils/astroUtils';

function KundliPage() {
  const [searchParams] = useSearchParams();
  
  // URL parameters (with fallback values if not provided)
  const paramName = searchParams.get('n') || 'John Doe';
  const paramDate = searchParams.get('d') || '1995-12-05';
  const paramTime = searchParams.get('t') || '12:00';
  const paramLoc = searchParams.get('loc') || 'Mumbai, India';

  const [kundli, setKundli] = useState(null);
  const [activeDashaIndex, setActiveDashaIndex] = useState(null);
  const [hoveredHouse, setHoveredHouse] = useState(null);

  useEffect(() => {
    const data = generateKundliData(paramName, paramDate, paramTime, paramLoc);
    setKundli(data);
  }, [paramName, paramDate, paramTime, paramLoc]);

  if (!kundli) {
    return <div className="page-wrapper flex-center">Recalculating planetary configurations...</div>;
  }

  // Astrological meanings of the 12 houses
  const HOUSE_INFO = {
    1: { name: "1st House (Lagna Bhava)", governs: "Self, health, appearance, physical body, vitality, and life path." },
    2: { name: "2nd House (Dhana Bhava)", governs: "Wealth, family, speech, values, throat, and liquid assets." },
    3: { name: "3rd House (Sahaja Bhava)", governs: "Courage, communication, short travels, siblings, hands, and self-efforts." },
    4: { name: "4th House (Bandhu Bhava)", governs: "Home, mother, emotions, happiness, vehicles, chest, and real estate." },
    5: { name: "5th House (Putra Bhava)", governs: "Children, creativity, intelligence, intellect, past-life merits, and romance." },
    6: { name: "6th House (Ari Bhava)", governs: "Health, debts, enemies, obstacles, daily routine, service, and digestion." },
    7: { name: "7th House (Yuvati Bhava)", governs: "Marriage, partnerships, business relations, public relations, and legal unions." },
    8: { name: "8th House (Randhra Bhava)", governs: "Longevity, transformations, sudden shifts, secrets, occult, research, and inheritances." },
    9: { name: "9th House (Dharma Bhava)", governs: "Luck, father, guru, higher wisdom, long travels, philosophy, and religion." },
    10: { name: "10th House (Karma Bhava)", governs: "Career, public reputation, status, authority, fame, father's profession, and success." },
    11: { name: "11th House (Labha Bhava)", governs: "Gains, desires, elder siblings, social networks, wealth streams, and achievements." },
    12: { name: "12th House (Vyaya Bhava)", governs: "Losses, expenditures, isolation, spiritual liberation (moksha), foreign travels, sleep, and dreams." }
  };

  // Abbreviations for SVG drawing
  const PLANET_ABBREVIATIONS = {
    sun: "Su", mon: "Mo", mar: "Ma", mer: "Me", jup: "Ju", ven: "Ve", sat: "Sa", rah: "Ra", ket: "Ke"
  };

  const getHousePlanetsString = (houseNumber) => {
    const list = kundli.chart[houseNumber].planets;
    return list.map(p => PLANET_ABBREVIATIONS[p.key] || p.label.substring(0,2)).join(', ');
  };

  // SVG Coordinates for the Houses in North Indian Chart
  // Standard 300x300 canvas size.
  // We define the SVG polygons for each of the 12 houses to capture hover events.
  const HOUSE_POLYGONS = {
    1: { // Centered Top Diamond
      points: "150,150 75,75 150,0 225,75",
      textX: 150, textY: 60,
      labelX: 150, labelY: 35
    },
    2: { // Top Left Triangle
      points: "0,0 150,0 75,75",
      textX: 75, textY: 35,
      labelX: 55, labelY: 25
    },
    3: { // Left Top Triangle
      points: "0,0 75,75 0,150",
      textX: 35, textY: 75,
      labelX: 25, labelY: 55
    },
    4: { // Centered Left Diamond
      points: "150,150 75,75 0,150 75,225",
      textX: 60, textY: 150,
      labelX: 35, labelY: 150
    },
    5: { // Left Bottom Triangle
      points: "0,150 75,225 0,300",
      textX: 35, textY: 225,
      labelX: 25, labelY: 245
    },
    6: { // Bottom Left Triangle
      points: "0,300 150,300 75,225",
      textX: 75, textY: 265,
      labelX: 55, labelY: 275
    },
    7: { // Centered Bottom Diamond
      points: "150,150 75,225 150,300 225,225",
      textX: 150, textY: 240,
      labelX: 150, labelY: 265
    },
    8: { // Bottom Right Triangle
      points: "150,300 300,300 225,225",
      textX: 225, textY: 265,
      labelX: 245, labelY: 275
    },
    9: { // Right Bottom Triangle
      points: "300,225 300,300 225,225",
      textX: 265, textY: 225,
      labelX: 275, labelY: 245
    },
    10: { // Centered Right Diamond
      points: "150,150 225,75 300,150 225,225",
      textX: 240, textY: 150,
      labelX: 265, labelY: 150
    },
    11: { // Right Top Triangle
      points: "300,0 225,75 300,150",
      textX: 265, textY: 75,
      labelX: 275, labelY: 55
    },
    12: { // Top Right Triangle
      points: "150,0 300,0 225,75",
      textX: 225, textY: 35,
      labelX: 245, labelY: 25
    }
  };

  // Determine if Dasha is current based on calendar year
  const currentYear = new Date().getFullYear();

  return (
    <div className="page-wrapper">
      {/* Birth Summary */}
      <div className="kundli-header mb-8">
        <h1 className="title-serif section-title">Birth Chart (Lagna Kundli)</h1>
        
        <div className="cosmic-card birth-summary-widget mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="summary-item">
              <span className="summary-label"><User size={12} className="text-glow mr-1 inline" /> Name</span>
              <span className="summary-value">{paramName}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label"><Calendar size={12} className="text-glow mr-1 inline" /> Date of Birth</span>
              <span className="summary-value">{paramDate}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label"><Clock size={12} className="text-glow mr-1 inline" /> Time of Birth</span>
              <span className="summary-value">{paramTime}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label"><MapPin size={12} className="text-glow mr-1 inline" /> Birth Location</span>
              <span className="summary-value text-ellipsis overflow-hidden whitespace-nowrap block" title={paramLoc}>
                {paramLoc}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Kundli Grid */}
      <div className="kundli-main-grid">
        
        {/* Left Side: Interactive SVG Chart */}
        <div className="flex flex-col gap-6">
          <div className="cosmic-card flex-center flex-col p-6">
            <h3 className="title-serif text-md mb-2">North Indian Lagna Chart</h3>
            <p className="text-xs text-secondary mb-6 text-center">Hover over any house to review its Vedic significance & governing characteristics.</p>
            
            <div className="kundli-chart-wrapper relative">
              <svg className="kundli-svg" viewBox="0 0 300 300" width="360" height="360">
                {/* Draw House Polygons to capture hovers */}
                {Object.entries(HOUSE_POLYGONS).map(([houseNumStr, data]) => {
                  const houseNum = parseInt(houseNumStr);
                  const isHovered = hoveredHouse === houseNum;
                  return (
                    <polygon
                      key={houseNum}
                      points={data.points}
                      className={`kundli-house-polygon ${isHovered ? 'hovered' : ''}`}
                      onMouseEnter={() => setHoveredHouse(houseNum)}
                      onMouseLeave={() => setHoveredHouse(null)}
                      fill={isHovered ? 'rgba(138, 43, 226, 0.08)' : 'rgba(255, 255, 255, 0.005)'}
                      stroke={isHovered ? 'var(--accent-purple)' : 'rgba(138, 43, 226, 0.25)'}
                      strokeWidth={isHovered ? '2' : '1'}
                    />
                  );
                })}

                {/* Main Geometric Dividing Lines */}
                {/* Diagonals */}
                <line x1="0" y1="0" x2="300" y2="300" stroke="rgba(138, 43, 226, 0.25)" strokeWidth="1" pointerEvents="none" />
                <line x1="300" y1="0" x2="0" y2="300" stroke="rgba(138, 43, 226, 0.25)" strokeWidth="1" pointerEvents="none" />
                {/* Inner Diamond */}
                <line x1="150" y1="0" x2="300" y2="150" stroke="rgba(138, 43, 226, 0.25)" strokeWidth="1" pointerEvents="none" />
                <line x1="300" y1="150" x2="150" y2="300" stroke="rgba(138, 43, 226, 0.25)" strokeWidth="1" pointerEvents="none" />
                <line x1="150" y1="300" x2="0" y2="150" stroke="rgba(138, 43, 226, 0.25)" strokeWidth="1" pointerEvents="none" />
                <line x1="0" y1="150" x2="150" y2="0" stroke="rgba(138, 43, 226, 0.25)" strokeWidth="1" pointerEvents="none" />
                {/* Outer boundaries */}
                <rect x="0" y="0" width="300" height="300" fill="none" stroke="rgba(138, 43, 226, 0.4)" strokeWidth="2" pointerEvents="none" />

                {/* Text Placement: Sign Numbers and Planets */}
                {Object.entries(HOUSE_POLYGONS).map(([houseNumStr, data]) => {
                  const houseNum = parseInt(houseNumStr);
                  const houseData = kundli.chart[houseNum];
                  const signNumber = houseData.signNumber;
                  const planetsString = getHousePlanetsString(houseNum);

                  return (
                    <g key={houseNum} pointerEvents="none">
                      {/* Sign Number in house */}
                      <text 
                        x={data.labelX} 
                        y={data.labelY} 
                        className="kundli-sign-label"
                        textAnchor="middle"
                        fontSize="10"
                        fill="var(--accent-gold)"
                        fontWeight="bold"
                      >
                        {signNumber}
                      </text>
                      
                      {/* Planets placed in house */}
                      <text 
                        x={data.textX} 
                        y={data.textY} 
                        className="kundli-planet-text"
                        textAnchor="middle"
                        fontSize="12"
                        fill="#fff"
                        fontWeight="500"
                      >
                        {planetsString}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
            
            {/* Live House hover summary */}
            <div className="house-hover-summary mt-6 w-full min-h-20">
              {hoveredHouse ? (
                <div className="summary-glow-container p-4 border border-glow rounded-xl bg-purple-glow">
                  <h4 className="text-sm font-bold text-glow mb-1">
                    {HOUSE_INFO[hoveredHouse].name} - Sign: {kundli.chart[hoveredHouse].sign} ({kundli.chart[hoveredHouse].signNumber})
                  </h4>
                  <p className="text-xs text-secondary leading-relaxed">
                    {HOUSE_INFO[hoveredHouse].governs}
                  </p>
                  {kundli.chart[hoveredHouse].planets.length > 0 && (
                    <div className="mt-2 text-xs">
                      <strong>Planets: </strong>
                      <span className="text-primary">
                        {kundli.chart[hoveredHouse].planets.map(p => `${p.label} (${p.degrees}°)`).join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="placeholder-summary border border-dashed border-muted rounded-xl p-4 text-center text-xs text-muted flex-center">
                  Hover over a sector on the Kundli diagram above to show detailed readings.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Tabular Details & Vimshottari Dashas */}
        <div className="flex flex-col gap-6">
          {/* Vimshottari Dasha Tree */}
          <div className="cosmic-card">
            <h3 className="title-serif text-md mb-4 flex items-center gap-2">
              <Clock size={16} className="text-glow" />
              <span>Vimshottari Dasha timeline</span>
            </h3>
            <p className="text-xs text-secondary mb-4">Click a planetary period below to expand and review sub-periods (Antardasha):</p>
            
            <div className="dasha-timeline-container flex flex-col gap-2">
              {kundli.dashas.map((dasha, idx) => {
                const isActive = currentYear >= dasha.start && currentYear <= dasha.end;
                const isExpanded = activeDashaIndex === idx;

                return (
                  <div 
                    key={idx} 
                    className={`dasha-item-card ${isActive ? 'active-dasha' : ''}`}
                  >
                    <div 
                      className="dasha-header p-3 flex justify-between items-center cursor-pointer hover:bg-white-02 transition-colors"
                      onClick={() => setActiveDashaIndex(isExpanded ? null : idx)}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`circle-indicator ${isActive ? 'active glow-pulse' : ''}`}></span>
                        <span className="font-semibold text-sm">{dasha.planet} Mahadasha</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-muted">{dasha.start} - {dasha.end}</span>
                        {isExpanded ? <ChevronUp size={16} className="text-muted" /> : <ChevronDown size={16} className="text-muted" />}
                      </div>
                    </div>

                    {/* Sub dashas (collapsible antardashas list) */}
                    {isExpanded && (
                      <div className="dasha-sub-list p-3 border-t border-muted bg-white-01 grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {dasha.subDashas.map((sub, sIdx) => (
                          <div key={sIdx} className="sub-dasha-pill">
                            <span className="sub-dasha-name block text-xs font-medium text-secondary">{sub.planet}</span>
                            <span className="sub-dasha-period block text-xxs text-muted">{sub.period}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Planetary Placements Table */}
      <section className="placements-section cosmic-card mt-8 overflow-hidden">
        <h3 className="title-serif text-md mb-6 flex items-center gap-2">
          <Compass size={16} className="text-glow" />
          <span>Planetary Placements coordinates</span>
        </h3>
        
        <div className="table-wrapper overflow-x-auto">
          <table className="placements-table w-full text-left">
            <thead>
              <tr className="border-b border-muted">
                <th className="p-4 text-xs font-bold text-muted uppercase">Planet</th>
                <th className="p-4 text-xs font-bold text-muted uppercase">Zodiac Sign</th>
                <th className="p-4 text-xs font-bold text-muted uppercase text-center">House</th>
                <th className="p-4 text-xs font-bold text-muted uppercase">Degrees</th>
                <th className="p-4 text-xs font-bold text-muted uppercase">Nakshatra (Pada)</th>
                <th className="p-4 text-xs font-bold text-muted uppercase text-center">Retrograde</th>
              </tr>
            </thead>
            <tbody>
              {kundli.placements.map((p, idx) => (
                <tr key={idx} className="border-b border-muted last:border-b-0 hover:bg-white-01 transition-colors">
                  <td className="p-4 font-semibold text-sm flex items-center gap-2">
                    <span className="text-glow font-mono text-xs">{PLANET_ABBREVIATIONS[p.key] || "As"}</span>
                    <span>{p.label}</span>
                  </td>
                  <td className="p-4 text-sm text-secondary">{p.sign}</td>
                  <td className="p-4 text-sm text-secondary text-center font-bold">{p.house}</td>
                  <td className="p-4 text-sm font-mono text-secondary">{p.degrees}°</td>
                  <td className="p-4 text-sm text-secondary">{p.nakshatra} (Pada {p.pada})</td>
                  <td className="p-4 text-sm text-center">
                    {p.retrograde ? (
                      <span className="badge badge-inauspicious">Yes (R)</span>
                    ) : (
                      <span className="text-muted text-xs">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default KundliPage;
