import React, { useEffect } from 'react';
import { Layout } from '../ui/Layout.jsx';
import { Card } from '../ui/Card.jsx';
import { Button } from '../ui/Button.jsx';
import { Message } from '../ui/Message.jsx';
import { isAdjustmentRow, MODES } from '../state/counterState';
import { playBeep } from '../utils/sound';

export function CounterScreen({ project, onAdvanceRow, onBackToProjects }) {
  const isAdjustment = isAdjustmentRow(project);
  const adjustmentText = project.mode === MODES.INCREASE ? 'increasing' : 'decreasing';

  // Play beep when entering adjustment row
  useEffect(() => {
    if (isAdjustment) {
      playBeep();
    }
  }, [isAdjustment]);

  return (
    <Layout>
      <div className="counter-screen">
        <div className="counter-screen__header">
          <div>
            <h1 className="counter-screen__title">{project.name}</h1>
            <p className="counter-screen__subtitle">
              {project.mode === MODES.INCREASE ? 'Increasing' : 'Decreasing'} every {project.freq} rows
            </p>
          </div>
          <Button 
            variant="secondary" 
            size="small"
            onClick={onBackToProjects}
            className="counter-screen__back"
          >
            ← Projects
          </Button>
        </div>

        <Card className="counter-card">
          {/* Current Row */}
          <div className="counter-info">
            <div className="counter-info__label">You are doing row</div>
            <div className="counter-info__value counter-info__value--large">
              {project.row}
            </div>
          </div>

          {/* Total Stitches */}
          <div className="counter-info">
            <div className="counter-info__label">Total stitches</div>
            <div className="counter-info__value">
              {project.stitches}
            </div>
          </div>

          {/* Adjustment Row Alert */}
          {isAdjustment && (
            <Message type="warning" className="counter-alert">
              🔔 You're {adjustmentText} on this row
            </Message>
          )}

          {/* Main Action Button */}
          <Button 
            size="large" 
            onClick={onAdvanceRow}
            className="counter-action"
          >
            Row {project.row} Done
          </Button>
        </Card>
      </div>
    </Layout>
  );
}

