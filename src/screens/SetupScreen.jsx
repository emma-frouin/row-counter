import React, { useState } from 'react';
import { Layout } from '../ui/Layout.jsx';
import { Card } from '../ui/Card.jsx';
import { Button } from '../ui/Button.jsx';
import { Message } from '../ui/Message.jsx';
import { MODES } from '../state/counterState';

export function SetupScreen({ onComplete, onCancel }) {
  const [projectName, setProjectName] = useState('');
  const [mode, setMode] = useState('');
  const [stitches, setStitches] = useState('');
  const [freq, setFreq] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors({});
    
    // Basic validation
    const newErrors = {};
    
    if (!projectName || projectName.trim() === '') {
      newErrors.projectName = 'Please enter a project name';
    }
    
    if (!mode) {
      newErrors.mode = 'Please select increase or decrease';
    }
    
    if (!stitches || isNaN(parseInt(stitches, 10)) || parseInt(stitches, 10) < 1) {
      newErrors.stitches = 'Please enter a valid number of stitches';
    }
    
    if (!freq || isNaN(parseInt(freq, 10)) || parseInt(freq, 10) < 1) {
      newErrors.freq = 'Please enter a valid frequency';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Submit valid data
    onComplete({
      name: projectName.trim(),
      mode,
      stitches: parseInt(stitches, 10),
      freq: parseInt(freq, 10)
    });
  };

  return (
    <Layout>
      <div className="setup-screen">
        <h1 className="setup-screen__title">Row Counter</h1>
        <p className="setup-screen__subtitle">Let's set up your knitting pattern</p>
        
        <Card>
          <form onSubmit={handleSubmit} className="setup-form">
            {/* Project Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="projectName">
                Project Name
              </label>
              <input
                id="projectName"
                type="text"
                className="form-input"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g., Sophie Hood, Baby Blanket"
              />
              {errors.projectName && <div className="form-error">{errors.projectName}</div>}
            </div>

            {/* Mode Selection */}
            <div className="form-group">
              <label className="form-label">Are you increasing or decreasing?</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="mode"
                    value={MODES.INCREASE}
                    checked={mode === MODES.INCREASE}
                    onChange={(e) => setMode(e.target.value)}
                  />
                  <span>Increasing</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="mode"
                    value={MODES.DECREASE}
                    checked={mode === MODES.DECREASE}
                    onChange={(e) => setMode(e.target.value)}
                  />
                  <span>Decreasing</span>
                </label>
              </div>
              {errors.mode && <div className="form-error">{errors.mode}</div>}
            </div>

            {/* Current Stitches */}
            <div className="form-group">
              <label className="form-label" htmlFor="stitches">
                How many stitches do you currently have?
              </label>
              <input
                id="stitches"
                type="number"
                min="1"
                className="form-input"
                value={stitches}
                onChange={(e) => setStitches(e.target.value)}
                placeholder="e.g., 60"
              />
              {errors.stitches && <div className="form-error">{errors.stitches}</div>}
            </div>

            {/* Frequency */}
            <div className="form-group">
              <label className="form-label" htmlFor="freq">
                {mode === MODES.INCREASE 
                  ? 'Every how many rows do you increase?' 
                  : mode === MODES.DECREASE 
                  ? 'Every how many rows do you decrease?'
                  : 'Every how many rows before adjusting stitches?'}
              </label>
              <input
                id="freq"
                type="number"
                min="1"
                className="form-input"
                value={freq}
                onChange={(e) => setFreq(e.target.value)}
                placeholder="e.g., 8"
              />
              {errors.freq && <div className="form-error">{errors.freq}</div>}
            </div>

            <div className="setup-form__actions">
              {onCancel && (
                <Button 
                  type="button" 
                  variant="secondary"
                  size="large"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              )}
              <Button type="submit" size="large" className="setup-form__submit">
                Start Counting
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
}

