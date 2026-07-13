import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Infinity as InfinityIcon, 
  User, 
  Calendar, 
  HelpCircle, 
  FileText,
  Sparkles
} from 'lucide-react';
import { calculateNumerology, NUMEROLOGY_DESCRIPTIONS } from '../utils/astroUtils';

function NumerologyPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Url parameters (with fallbacks)
  const paramName = searchParams.get('n') || 'John Doe';
  const paramDate = searchParams.get('d') || '1990-01-01';

  // State hooks
  const [name, setName] = useState(paramName);
  const [dob, setDob] = useState(paramDate);
  const [numbers, setNumbers] = useState({ lifePath: 0, destiny: 0, soulUrge: 0, personality: 0 });
  const [selectedReportNum, setSelectedReportNum] = useState(null);

  useEffect(() => {
    // Calculate values
    const result = calculateNumerology(name, dob);
    setNumbers(result);
    
    // Default the active reading to Life Path if not set
    if (!selectedReportNum) {
      setSelectedReportNum(result.lifePath);
    }

    // Sync parameters
    setSearchParams({ n: name, d: dob });
  }, [name, dob]);

  const reportData = NUMEROLOGY_DESCRIPTIONS[selectedReportNum] || null;

  return (
    <div className="page-wrapper">
      {/* Page Title */}
      <div className="numerology-header mb-8">
        <h1 className="title-serif section-title">Numerology calculator</h1>
        <p className="text-secondary mt-2">Decipher your personal frequency from name vibrations and natal alignments.</p>
      </div>

      {/* Inputs Hub */}
      <div className="cosmic-card mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label className="cosmic-label" htmlFor="num-name">
              <User size={12} className="text-glow mr-1 inline" /> Full Birth Name
            </label>
            <input 
              type="text" 
              id="num-name"
              className="cosmic-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter full birth name (e.g. John Doe)..."
            />
            <span className="text-xxs text-muted block mt-1">Calculates Destiny, Soul Urge, and Personality parameters.</span>
          </div>

          <div className="form-group">
            <label className="cosmic-label" htmlFor="num-dob">
              <Calendar size={12} className="text-glow mr-1 inline" /> Date of Birth
            </label>
            <input 
              type="date" 
              id="num-dob"
              className="cosmic-input"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
            <span className="text-xxs text-muted block mt-1">Calculates Life Path parameters.</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Dashboards & Readings */}
      <div className="numerology-main-grid">
        
        {/* Core Numbers Dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Card 1: Life Path */}
          <div 
            className={`cosmic-card num-card flex flex-col justify-between cursor-pointer ${selectedReportNum === numbers.lifePath ? 'selected-num' : ''}`}
            onClick={() => setSelectedReportNum(numbers.lifePath)}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xxs uppercase tracking-wider text-muted block">Vibration 1</span>
                <h4 className="font-bold text-sm">Life Path Number</h4>
              </div>
              <HelpCircle size={16} className="text-muted" title="Your life path, core traits, and destiny journey." />
            </div>

            <div className="flex items-center gap-4">
              <div className="radial-number-circle">
                <span className="radial-val">{numbers.lifePath || "-"}</span>
              </div>
              <div>
                <span className="text-xs text-glow font-semibold block">Natal alignment</span>
                <span className="text-xxs text-secondary">Based on Birth Date</span>
              </div>
            </div>
          </div>

          {/* Card 2: Destiny */}
          <div 
            className={`cosmic-card num-card flex flex-col justify-between cursor-pointer ${selectedReportNum === numbers.destiny ? 'selected-num' : ''}`}
            onClick={() => setSelectedReportNum(numbers.destiny)}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xxs uppercase tracking-wider text-muted block">Vibration 2</span>
                <h4 className="font-bold text-sm">Destiny Number</h4>
              </div>
              <HelpCircle size={16} className="text-muted" title="Your core talents, traits, and lifelong goals." />
            </div>

            <div className="flex items-center gap-4">
              <div className="radial-number-circle ring-gold">
                <span className="radial-val text-gold">{numbers.destiny || "-"}</span>
              </div>
              <div>
                <span className="text-xs text-glow font-semibold block">Expression force</span>
                <span className="text-xxs text-secondary">Based on Full Name letters</span>
              </div>
            </div>
          </div>

          {/* Card 3: Soul Urge */}
          <div 
            className={`cosmic-card num-card flex flex-col justify-between cursor-pointer ${selectedReportNum === numbers.soulUrge ? 'selected-num' : ''}`}
            onClick={() => setSelectedReportNum(numbers.soulUrge)}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xxs uppercase tracking-wider text-muted block">Vibration 3</span>
                <h4 className="font-bold text-sm">Soul Urge Number</h4>
              </div>
              <HelpCircle size={16} className="text-muted" title="Your deep subconscious desires, likes, and drives." />
            </div>

            <div className="flex items-center gap-4">
              <div className="radial-number-circle ring-purple">
                <span className="radial-val text-purple">{numbers.soulUrge || "-"}</span>
              </div>
              <div>
                <span className="text-xs text-glow font-semibold block">Internal frequency</span>
                <span className="text-xxs text-secondary">Based on Name Vowels</span>
              </div>
            </div>
          </div>

          {/* Card 4: Personality */}
          <div 
            className={`cosmic-card num-card flex flex-col justify-between cursor-pointer ${selectedReportNum === numbers.personality ? 'selected-num' : ''}`}
            onClick={() => setSelectedReportNum(numbers.personality)}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xxs uppercase tracking-wider text-muted block">Vibration 4</span>
                <h4 className="font-bold text-sm">Personality Number</h4>
              </div>
              <HelpCircle size={16} className="text-muted" title="The outer impression, how others see you first." />
            </div>

            <div className="flex items-center gap-4">
              <div className="radial-number-circle ring-grey">
                <span className="radial-val text-secondary">{numbers.personality || "-"}</span>
              </div>
              <div>
                <span className="text-xs text-glow font-semibold block">Outer refraction</span>
                <span className="text-xxs text-secondary">Based on Name Consonants</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Interpretive Report */}
        <div className="report-panel-wrapper">
          {reportData ? (
            <div className="cosmic-card h-full flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <InfinityIcon size={120} />
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="text-glow" size={20} />
                  <span className="text-xs uppercase tracking-wider text-muted font-bold">Personal vibration reading</span>
                </div>

                <div className="badge badge-auspicious mb-4">
                  <Sparkles size={12} />
                  <span>Number {selectedReportNum} Active</span>
                </div>

                <h3 className="title-serif text-xl mb-2">{reportData.title}</h3>
                <p className="text-xs font-semibold text-secondary italic mb-4">"Key characteristics: {reportData.traits}"</p>
                <div className="text-sm text-secondary leading-relaxed border-t border-muted pt-4 mt-4">
                  {reportData.desc}
                </div>
              </div>

              <div className="alert-box-info mt-6 text-xxs text-muted leading-normal">
                Note: Standard Pythagorean Numerology parameters. Every letter carries a numerical vibration code which sums together to form a unique personal profile.
              </div>
            </div>
          ) : (
            <div className="cosmic-card flex-center h-full text-center text-muted p-6 border-dashed">
              Select one of the vibration metrics on the left to reveal your personalized astrological reading details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NumerologyPage;
