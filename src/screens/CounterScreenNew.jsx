import React, { useEffect } from 'react';
import { Layout } from '../ui/Layout.jsx';
import { Card } from '../ui/Card.jsx';
import { Button } from '../ui/Button.jsx';
import { Message } from '../ui/Message.jsx';
import { isAdjustmentRow, calculateCurrentStitches, calculateTotalRows, calculatePatternRow, MODES } from '../state/projectState';
import { startContinuousSound, stopContinuousSound } from '../utils/continuousSound';

export function CounterScreenNew({ project, counter, onAdvanceRow, onBackToProject }) {
  const isAdjustment = isAdjustmentRow(counter);
  const currentStitches = calculateCurrentStitches(counter);
  const totalRows = calculateTotalRows(counter);
  const patternRow = calculatePatternRow(counter);
  const adjustmentText = counter.mode === MODES.INCREASE ? 'increasing' : 'decreasing';

  // Handle continuous sound for adjustment rows
  useEffect(() => {
    if (isAdjustment && !counter.completed) {
      startContinuousSound();
    } else {
      stopContinuousSound();
    }

    // Cleanup on unmount
    return () => {
      stopContinuousSound();
    };
  }, [isAdjustment, counter.completed]);

  return (
    <Layout>
      <div className="counter-screen-new">
        <div className="counter-screen-new__header">
          <div>
            <h1 className="counter-screen-new__title">{project.name}</h1>
            <p className="counter-screen-new__subtitle">{counter.name}</p>
          </div>
          <Button 
            variant="secondary" 
            size="small"
            onClick={onBackToProject}
            className="counter-screen-new__back"
          >
            ← Project
          </Button>
        </div>

        <Card className="counter-card-main">
          {/* Pattern Row - the cycling row */}
          <div className="counter-info">
            <div className="counter-info__label">Pattern row</div>
            <div className="counter-info__value counter-info__value--large">
              {patternRow}
            </div>
            <div className="counter-info__sublabel">
              of {counter.freq} in cycle
            </div>
          </div>

          {/* Total Row Count */}
          <div className="counter-info">
            <div className="counter-info__label">Total row</div>
            <div className="counter-info__value">
              {counter.currentRow}
            </div>
            <div className="counter-info__sublabel">
              of {totalRows} total
            </div>
          </div>

          {/* Current Stitches */}
          <div className="counter-info">
            <div className="counter-info__label">Current stitches</div>
            <div className="counter-info__value">
              {currentStitches}
            </div>
          </div>

          {/* Adjustment Row Alert */}
          {isAdjustment && counter.mode !== MODES.CONSTANT && !counter.completed && (
            <Message type="warning" className="counter-alert">
              🔔 You're {adjustmentText} on this row
            </Message>
          )}

          {/* Completed Message */}
          {counter.completed && (
            <Message type="info" className="counter-alert">
              ✓ This phase is complete!
            </Message>
          )}

          {/* Progress Bar */}
          <div className="counter-progress">
            <div 
              className="counter-progress__bar" 
              style={{ width: `${(counter.currentRow / totalRows) * 100}%` }}
            />
          </div>

          {/* Main Action Button */}
          {!counter.completed && (
            <Button 
              size="large" 
              onClick={onAdvanceRow}
              className="counter-action"
            >
              Pattern Row {patternRow} Done
            </Button>
          )}

          {counter.completed && (
            <Button 
              size="large" 
              onClick={onBackToProject}
              className="counter-action"
            >
              Back to Project
            </Button>
          )}
        </Card>

        {/* Phase Info Footer */}
        <div className="counter-footer">
          <p className="counter-footer__text">
            {counter.mode === MODES.INCREASE && `Increasing every ${counter.freq} rows`}
            {counter.mode === MODES.DECREASE && `Decreasing every ${counter.freq} rows`}
            {counter.mode === MODES.CONSTANT && `Constant ${counter.startStitches} stitches`}
          </p>
          <p className="counter-footer__text">
            {counter.startStitches} → {counter.endStitches} stitches
          </p>
        </div>
      </div>
    </Layout>
  );
}



