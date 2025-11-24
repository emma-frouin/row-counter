import React, { useEffect } from 'react';
import { Layout } from '../ui/Layout.jsx';
import { Card } from '../ui/Card.jsx';
import { Button } from '../ui/Button.jsx';
import { Message } from '../ui/Message.jsx';
import { isAdjustmentRow, MODES } from '../state/counterState';
import { playBeep } from '../utils/sound';

export function CounterScreen({ state, onAdvanceRow, onReset }) {
  const isAdjustment = isAdjustmentRow(state);
  const adjustmentText = state.mode === MODES.INCREASE ? 'increasing' : 'decreasing';

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
          <h1 className="counter-screen__title">Sophie Hood Counter</h1>
          <Button 
            variant="secondary" 
            size="small"
            onClick={onReset}
            className="counter-screen__reset"
          >
            Reset & Change Setup
          </Button>
        </div>

        <Card className="counter-card">
          {/* Current Row */}
          <div className="counter-info">
            <div className="counter-info__label">You are doing row</div>
            <div className="counter-info__value counter-info__value--large">
              {state.row}
            </div>
          </div>

          {/* Total Stitches */}
          <div className="counter-info">
            <div className="counter-info__label">Total stitches</div>
            <div className="counter-info__value">
              {state.stitches}
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
            Row {state.row} Done
          </Button>
        </Card>

        {/* Info Footer */}
        <div className="counter-footer">
          <p className="counter-footer__text">
            {state.mode === MODES.INCREASE ? 'Increasing' : 'Decreasing'} every {state.freq} rows
          </p>
        </div>
      </div>
    </Layout>
  );
}

