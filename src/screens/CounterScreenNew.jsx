import React, { useEffect } from 'react';
import { Layout } from '../ui/Layout.jsx';
import { Card } from '../ui/Card.jsx';
import { Button } from '../ui/Button.jsx';
import { Message } from '../ui/Message.jsx';
import { Timer } from '../ui/Timer.jsx';
import { isAdjustmentRow, calculateCurrentStitches, calculateTotalRows, calculatePatternRow, hasTarget, MODES } from '../state/projectState';
import { startContinuousSound, stopContinuousSound } from '../utils/continuousSound';

export function CounterScreenNew({ project, counter, onAdvanceRow, onMarkComplete, onResetCounter, onBackToProject, onToggleTimer }) {
  const isAdjustment = isAdjustmentRow(counter);
  const currentStitches = calculateCurrentStitches(counter);
  const totalRows = calculateTotalRows(counter);
  const patternRow = calculatePatternRow(counter);
  const adjustmentText = counter.mode === MODES.INCREASE ? 'increasing' : 'decreasing';
  const isOpenEnded = !hasTarget(counter);

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
          <h1 className="counter-screen-new__title">{project.name}</h1>
          <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
            <Timer 
              totalTimeMs={project.totalTimeMs || 0}
              timerStartedAt={project.timerStartedAt}
              onToggle={onToggleTimer}
              compact
            />
            <Button 
              variant="secondary" 
              size="small"
              onClick={onBackToProject}
              className="counter-screen-new__back"
            >
              ←
            </Button>
          </div>
        </div>

        <Card className="counter-card-main">
          {/* For CONSTANT mode: only show total row */}
          {counter.mode === MODES.CONSTANT ? (
            <div className="counter-info">
              <div className="counter-info__label">Row</div>
              <div className="counter-info__value counter-info__value--large">
                {counter.currentRow}
              </div>
              {!isOpenEnded && (
                <div className="counter-info__sublabel">
                  of {totalRows}
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Pattern Row - the main display */}
              <div className="counter-info">
                <div className="counter-info__label">Pattern row</div>
                <div className="counter-info__value counter-info__value--large">
                  {patternRow} <span style={{ fontSize: '1rem', fontWeight: 'normal', color: 'var(--color-text-light)' }}>/ {counter.freq}</span>
                </div>
              </div>

              {/* Total Row & Stitches - inline */}
              <div className="counter-row-info">
                <div className="counter-info">
                  <div className="counter-info__label">Total row</div>
                  <div className="counter-info__value">
                    {counter.currentRow}{!isOpenEnded && <span style={{ fontSize: '0.875rem', fontWeight: 'normal', color: 'var(--color-text-light)' }}> / {totalRows}</span>}
                  </div>
                </div>
                <div className="counter-info">
                  <div className="counter-info__label">Stitches</div>
                  <div className="counter-info__value">
                    {currentStitches}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* For constant mode, show stitches separately */}
          {counter.mode === MODES.CONSTANT && (
            <div className="counter-info">
              <div className="counter-info__label">Stitches</div>
              <div className="counter-info__value">{currentStitches}</div>
            </div>
          )}

          {/* Progress Bar - only show if there's a target */}
          {!isOpenEnded && !counter.completed && (
            <div className="counter-progress">
              <div 
                className="counter-progress__bar" 
                style={{ width: `${(counter.currentRow / totalRows) * 100}%` }}
              />
            </div>
          )}

          {/* Main Action Button - ALWAYS at the same position */}
          {!counter.completed && (
            <Button 
              size="large" 
              onClick={onAdvanceRow}
              className="counter-action"
            >
              {counter.mode === MODES.CONSTANT 
                ? `Row ${counter.currentRow} Done`
                : `Row ${patternRow} Done`
              }
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

          {/* Alert container - BELOW the button with fixed height */}
          {counter.mode !== MODES.CONSTANT && !counter.completed && (
            <div className="counter-alert-container">
              {isAdjustment ? (
                <Message type="warning" className="counter-alert">
                  🔔 {counter.mode === MODES.INCREASE ? 'Increase' : 'Decrease'} on this row!
                </Message>
              ) : null}
            </div>
          )}

          {/* Completed Message */}
          {counter.completed && (
            <Message type="info" className="counter-alert">
              ✓ Phase complete!
            </Message>
          )}

          {/* Action buttons for open-ended counters or reset */}
          {!counter.completed && (
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
              {counter.currentRow > 1 && (
                <Button 
                  size="small" 
                  variant="secondary"
                  onClick={() => {
                    if (window.confirm('Reset counter to row 1?')) {
                      onResetCounter();
                    }
                  }}
                >
                  ↺ Reset
                </Button>
              )}
              {isOpenEnded && (
                <Button 
                  size="small" 
                  variant="secondary"
                  onClick={onMarkComplete}
                >
                  ✓ Finish
                </Button>
              )}
            </div>
          )}
        </Card>

        {/* Phase Info Footer */}
        <div className="counter-footer">
          <p className="counter-footer__text">
            {counter.mode === MODES.INCREASE && `↗ Every ${counter.freq} rows`}
            {counter.mode === MODES.DECREASE && `↘ Every ${counter.freq} rows`}
            {counter.mode === MODES.CONSTANT && `Constant`}
            {!isOpenEnded && counter.endStitches && ` · ${counter.startStitches}→${counter.endStitches}`}
            {isOpenEnded && ` · Open-ended`}
          </p>
        </div>
      </div>
    </Layout>
  );
}



