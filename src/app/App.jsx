import React, { useState, useEffect } from 'react';
import { SetupScreen } from '../screens/SetupScreen.jsx';
import { CounterScreen } from '../screens/CounterScreen.jsx';
import { createInitialState, applySetup, advanceRow, resetToSetup } from '../state/counterState';
import { loadState, saveState, clearState } from '../storage/storageClient';
import { VIEWS, getInitialView } from './routes';

export function App() {
  const [state, setState] = useState(() => {
    const stored = loadState();
    return createInitialState(stored);
  });
  
  const [currentView, setCurrentView] = useState(() => getInitialView(state));

  // Save state to localStorage whenever it changes
  useEffect(() => {
    saveState(state);
  }, [state]);

  // Handle setup completion
  const handleSetupComplete = (setupData) => {
    const result = applySetup(setupData.mode, setupData.stitches, setupData.freq);
    
    if (result.valid) {
      setState(result.state);
      setCurrentView(VIEWS.COUNTER);
    }
  };

  // Handle row advancement
  const handleAdvanceRow = () => {
    const newState = advanceRow(state);
    setState(newState);
  };

  // Handle reset
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset and change your setup? This will clear your current progress.')) {
      const newState = resetToSetup();
      setState(newState);
      clearState();
      setCurrentView(VIEWS.SETUP);
    }
  };

  // Render current view
  if (currentView === VIEWS.SETUP) {
    return <SetupScreen onComplete={handleSetupComplete} />;
  }

  return (
    <CounterScreen 
      state={state} 
      onAdvanceRow={handleAdvanceRow}
      onReset={handleReset}
    />
  );
}

