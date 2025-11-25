import React, { useState } from 'react';
import { Layout } from '../ui/Layout.jsx';
import { Card } from '../ui/Card.jsx';
import { Button } from '../ui/Button.jsx';
import { MODES, validateCounter, createCounter } from '../state/projectState';

export function CreateCounterScreen({ onComplete, onCancel }) {
  const [name, setName] = useState('');
  const [mode, setMode] = useState('');
  const [startStitches, setStartStitches] = useState('');
  const [endStitches, setEndStitches] = useState('');
  const [freq, setFreq] = useState('');
  const [totalRows, setTotalRows] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    const counterData = {
      name,
      mode,
      startStitches,
      endStitches,
      freq,
      totalRows
    };

    const validation = validateCounter(counterData);

    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    const counter = createCounter(counterData);
    onComplete(counter);
  };

  return (
    <Layout>
      <div className="create-counter-screen">
        <h1 className="create-counter-screen__title">Add Counter / Phase</h1>
        <p className="create-counter-screen__subtitle">
          Add a new counting phase to your project
        </p>
        
        <Card>
          <form onSubmit={handleSubmit} className="counter-form">
            <div className="form-group">
              <label className="form-label" htmlFor="name">
                Phase Name
              </label>
              <input
                id="name"
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Increasing, Body, Decreasing"
              />
              {errors.name && <div className="form-error">{errors.name}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Mode</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="mode"
                    value={MODES.INCREASE}
                    checked={mode === MODES.INCREASE}
                    onChange={(e) => setMode(e.target.value)}
                  />
                  <span>↗️ Increasing</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="mode"
                    value={MODES.DECREASE}
                    checked={mode === MODES.DECREASE}
                    onChange={(e) => setMode(e.target.value)}
                  />
                  <span>↘️ Decreasing</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="mode"
                    value={MODES.CONSTANT}
                    checked={mode === MODES.CONSTANT}
                    onChange={(e) => setMode(e.target.value)}
                  />
                  <span>→ Constant</span>
                </label>
              </div>
              {errors.mode && <div className="form-error">{errors.mode}</div>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="startStitches">
                {mode === MODES.CONSTANT ? 'Number of Stitches' : 'Starting Stitches'}
              </label>
              <input
                id="startStitches"
                type="number"
                min="1"
                className="form-input"
                value={startStitches}
                onChange={(e) => setStartStitches(e.target.value)}
                placeholder="e.g., 20"
              />
              {errors.startStitches && <div className="form-error">{errors.startStitches}</div>}
            </div>

            {mode !== MODES.CONSTANT && (
              <>
                <div className="form-group">
                  <label className="form-label" htmlFor="endStitches">
                    Ending Stitches
                  </label>
                  <input
                    id="endStitches"
                    type="number"
                    min="1"
                    className="form-input"
                    value={endStitches}
                    onChange={(e) => setEndStitches(e.target.value)}
                    placeholder="e.g., 80"
                  />
                  {errors.endStitches && <div className="form-error">{errors.endStitches}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="freq">
                    Every how many rows do you {mode === MODES.INCREASE ? 'increase' : 'decrease'}?
                  </label>
                  <input
                    id="freq"
                    type="number"
                    min="1"
                    className="form-input"
                    value={freq}
                    onChange={(e) => setFreq(e.target.value)}
                    placeholder="e.g., 6"
                  />
                  {errors.freq && <div className="form-error">{errors.freq}</div>}
                </div>

                {startStitches && endStitches && freq && (
                  <div className="counter-calc">
                    <p>This phase will be <strong>{Math.abs(parseInt(endStitches) - parseInt(startStitches)) * parseInt(freq)}</strong> rows</p>
                  </div>
                )}
              </>
            )}

            {mode === MODES.CONSTANT && (
              <div className="form-group">
                <label className="form-label" htmlFor="totalRows">
                  How many rows for this phase?
                </label>
                <input
                  id="totalRows"
                  type="number"
                  min="1"
                  className="form-input"
                  value={totalRows}
                  onChange={(e) => setTotalRows(e.target.value)}
                  placeholder="e.g., 40"
                />
                {errors.totalRows && <div className="form-error">{errors.totalRows}</div>}
              </div>
            )}

            <div className="form-actions">
              <Button 
                type="button" 
                variant="secondary"
                size="large"
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button type="submit" size="large">
                Add Counter
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
}

