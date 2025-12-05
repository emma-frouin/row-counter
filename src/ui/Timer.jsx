import React, { useState, useEffect } from 'react';

/**
 * Format milliseconds to HH:MM:SS
 */
function formatTime(ms) {
  if (!ms || ms < 0) ms = 0;
  
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Timer component for tracking project time
 */
export function Timer({ totalTimeMs = 0, timerStartedAt, onToggle, compact = false }) {
  const [displayTime, setDisplayTime] = useState(totalTimeMs);
  const isRunning = !!timerStartedAt;

  // Update display time every second when running
  useEffect(() => {
    if (!isRunning) {
      setDisplayTime(totalTimeMs);
      return;
    }

    // Calculate current elapsed time
    const updateTime = () => {
      const elapsed = Date.now() - timerStartedAt;
      setDisplayTime(totalTimeMs + elapsed);
    };

    updateTime(); // Initial update
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timerStartedAt, totalTimeMs]);

  if (compact) {
    return (
      <button 
        className={`timer-compact ${isRunning ? 'timer-compact--running' : ''}`}
        onClick={onToggle}
        title={isRunning ? 'Stop timer' : 'Start timer'}
      >
        <span className="timer-compact__icon">{isRunning ? '⏸' : '▶'}</span>
        <span className="timer-compact__time">{formatTime(displayTime)}</span>
      </button>
    );
  }

  return (
    <div className={`timer ${isRunning ? 'timer--running' : ''}`}>
      <div className="timer__display">
        <span className="timer__time">{formatTime(displayTime)}</span>
      </div>
      <button 
        className={`timer__button ${isRunning ? 'timer__button--stop' : 'timer__button--start'}`}
        onClick={onToggle}
      >
        {isRunning ? '⏸ Pause' : '▶ Start'}
      </button>
    </div>
  );
}

