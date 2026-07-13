import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Filter, 
  Clock, 
  Sparkles, 
  HelpCircle, 
  AlertCircle,
  Heart,
  Home,
  TrendingUp,
  Compass,
  ShoppingBag,
  Info,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { generateMonthMuhuratData } from '../utils/astroUtils';

function MuhuratPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 13)); // Default July 13, 2026
  const [selectedEvent, setSelectedEvent] = useState('all'); // 'all', 'marriage', 'house', 'business', 'travel', 'purchase'
  const [selectedDayNum, setSelectedDayNum] = useState(13); // Selected day of month
  const [monthData, setMonthData] = useState([]);

  const eventTypes = [
    { id: "marriage", label: "Marriage", icon: <Heart size={16} /> },
    { id: "house", label: "House Warming", icon: <Home size={16} /> },
    { id: "business", label: "Business Launch", icon: <TrendingUp size={16} /> },
    { id: "travel", label: "Travel", icon: <Compass size={16} /> },
    { id: "purchase", label: "Asset Purchase", icon: <ShoppingBag size={16} /> }
  ];

  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const data = generateMonthMuhuratData(year, month);
    setMonthData(data);
  }, [currentDate]);

  const changeMonth = (offset) => {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() + offset);
    setCurrentDate(d);
    setSelectedDayNum(1); // Reset selected day to 1st when month changes
  };

  const getMonthName = () => {
    return currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  // Build grid of days
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sunday, etc.
  const totalDays = new Date(year, month + 1, 0).getDate();

  // Create empty slots for calendar offsets
  const calendarSlots = [];
  for (let i = 0; i < firstDayIndex; i++) {
    calendarSlots.push(null);
  }
  for (let i = 1; i <= totalDays; i++) {
    calendarSlots.push(i);
  }

  // Find data for currently selected day
  const selectedDayData = monthData.find(d => d.day === selectedDayNum) || null;

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="muhurat-header mb-8">
        <h1 className="title-serif section-title">Muhurat finder</h1>
        <p className="text-secondary mt-2">Identify auspicious windows for initiating assets, operations, or ceremonies.</p>
      </div>

      {/* Event Filter Grid */}
      <section className="event-filters-section mb-8">
        <h3 className="cosmic-label mb-3 flex items-center gap-1">
          <Filter size={12} className="text-glow" /> Filter by Activity
        </h3>
        <div className="flex flex-wrap gap-2">
          <button 
            className={`cosmic-tab flex-grow sm:flex-grow-0 ${selectedEvent === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedEvent('all')}
          >
            All Activities
          </button>
          {eventTypes.map(event => (
            <button 
              key={event.id}
              className={`cosmic-tab flex items-center gap-1.5 flex-grow sm:flex-grow-0 ${selectedEvent === event.id ? 'active' : ''}`}
              onClick={() => setSelectedEvent(event.id)}
            >
              {event.icon}
              <span>{event.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Main Calendar + Detail Panel grid */}
      <div className="muhurat-main-grid">
        
        {/* Left Side: Calendar Grid widget */}
        <div className="cosmic-card flex flex-col justify-between">
          
          {/* Calendar Header navigation */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-md flex items-center gap-2">
              <CalendarIcon size={16} className="text-glow" />
              <span>{getMonthName()}</span>
            </h3>
            <div className="flex gap-2">
              <button onClick={() => changeMonth(-1)} className="cosmic-btn-secondary p-1.5 flex-center" aria-label="Previous month">
                <ChevronLeft size={16} />
              </button>
              <button onClick={() => changeMonth(1)} className="cosmic-btn-secondary p-1.5 flex-center" aria-label="Next month">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Calendar Days grid */}
          <div className="calendar-grid-wrapper">
            {/* Weekday headers */}
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
              <span key={day} className="calendar-weekday text-center font-semibold text-xs text-muted py-2">
                {day}
              </span>
            ))}

            {/* Calendar Slots */}
            {calendarSlots.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} className="calendar-day-empty"></div>;
              }

              const dayData = monthData.find(d => d.day === day);
              if (!dayData) return <div key={day} className="calendar-day-empty">{day}</div>;

              // Filter check: is this day compatible with selected event?
              const isCompatible = selectedEvent === 'all' || dayData.activeMuhurats.includes(selectedEvent);

              // Efficacy status style classes
              let statusClass = "day-neutral";
              if (dayData.status === "auspicious" && isCompatible) statusClass = "day-auspicious border-glow-green";
              else if (dayData.status === "inauspicious" || !isCompatible) statusClass = "day-inauspicious border-glow-red";

              const isSelected = selectedDayNum === day;

              return (
                <div 
                  key={day}
                  className={`calendar-day-box flex-center flex-col cursor-pointer transition-all ${statusClass} ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedDayNum(day)}
                >
                  <span className="day-number text-sm font-bold">{day}</span>
                  {isCompatible && dayData.status === "auspicious" && (
                    <span className="dot-indicator dot-green"></span>
                  )}
                  {(!isCompatible || dayData.status === "inauspicious") && (
                    <span className="dot-indicator dot-red"></span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Auspicious Details Panel */}
        <div className="detail-panel-wrapper">
          {selectedDayData ? (
            <div className="cosmic-card h-full flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs uppercase tracking-wider text-muted font-bold">Daily Auspicious schedule</span>
                  <div className={`badge ${selectedDayData.status === 'auspicious' ? 'badge-auspicious' : selectedDayData.status === 'inauspicious' ? 'badge-inauspicious' : 'badge-neutral'}`}>
                    <span>{selectedDayData.score}% Score</span>
                  </div>
                </div>

                <h3 className="title-serif text-lg mb-2">
                  {selectedDayNum} {currentDate.toLocaleString('default', { month: 'short' })}, {currentDate.getFullYear()}
                </h3>
                
                {selectedDayData.status === 'auspicious' ? (
                  <div className="flex items-center gap-2 text-xs text-glow mb-6 text-auspicious">
                    <Sparkles size={14} className="animate-pulse-slow" />
                    <span>Auspicious energies dominant today. Good for action.</span>
                  </div>
                ) : selectedDayData.status === 'inauspicious' ? (
                  <div className="flex items-center gap-2 text-xs mb-6 text-inauspicious">
                    <AlertCircle size={14} className="animate-pulse-slow" />
                    <span>Heavy alignment coordinates. Avoid major initiations.</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-secondary mb-6">
                    <Info size={14} />
                    <span>Balanced/Neutral alignments. Suitable for routine tasks.</span>
                  </div>
                )}

                {/* Best timing listing */}
                <div className="best-timing-panel mb-6 border border-glow p-4 rounded-xl bg-purple-glow flex items-center gap-3">
                  <Clock size={20} className="text-glow" />
                  <div>
                    <span className="text-xxs text-muted block uppercase font-bold">Best Muhurat Window</span>
                    <span className="text-sm font-semibold text-primary">{selectedDayData.bestHour}</span>
                  </div>
                </div>

                {/* Event compatibility grid list */}
                <div className="event-compatibility-list mt-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-3">Activity Suitability</h4>
                  <div className="flex flex-col gap-2">
                    {eventTypes.map(event => {
                      const isGood = selectedDayData.activeMuhurats.includes(event.id);
                      return (
                        <div key={event.id} className="flex justify-between items-center p-2.5 rounded-lg border border-muted bg-white-005 text-sm">
                          <div className="flex items-center gap-2 text-secondary">
                            {event.icon}
                            <span>{event.label}</span>
                          </div>
                          <div>
                            {isGood ? (
                              <span className="badge badge-auspicious text-xxs">Highly Suitable</span>
                            ) : (
                              <span className="badge badge-neutral text-xxs">Not Recommended</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="alert-box-info mt-6 text-xxs text-muted leading-normal">
                Muhurat values reflect alignment ratios calculated for regional coordinates and local standard timezone offsets.
              </div>
            </div>
          ) : (
            <div className="cosmic-card flex-center h-full text-center text-muted p-6 border-dashed">
              Select a date on the calendar grid to show Muhurat time breaks and suitability logs.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MuhuratPage;
