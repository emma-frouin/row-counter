/**
 * Pure logic for the knitting row counter state.
 */

export const MODES = {
  INCREASE: 'increase',
  DECREASE: 'decrease'
};

/**
 * Creates initial state from stored values or defaults.
 */
export function createInitialState(stored) {
  // Handle null or undefined stored data
  const data = stored || {};
  
  return {
    mode: data.mode || null,
    stitches: data.stitches || null,
    freq: data.freq || null,
    row: data.row || 1,
    setupNeeded: !data.mode || !data.stitches || !data.freq
  };
}

/**
 * Validates and applies setup values.
 * Returns { valid: boolean, state?: object, errors?: object }
 */
export function applySetup(mode, stitches, freq) {
  const errors = {};

  if (!mode || (mode !== MODES.INCREASE && mode !== MODES.DECREASE)) {
    errors.mode = 'Please select increase or decrease';
  }

  const stitchesNum = parseInt(stitches, 10);
  if (!stitches || isNaN(stitchesNum) || stitchesNum < 1) {
    errors.stitches = 'Please enter a valid number of stitches (1 or more)';
  }

  const freqNum = parseInt(freq, 10);
  if (!freq || isNaN(freqNum) || freqNum < 1) {
    errors.freq = 'Please enter a valid frequency (1 or more rows)';
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    state: {
      mode,
      stitches: stitchesNum,
      freq: freqNum,
      row: 1,
      setupNeeded: false
    }
  };
}

/**
 * Advances the row counter and adjusts stitches when needed.
 * Returns new state.
 */
export function advanceRow(state) {
  const { row, freq, stitches, mode } = state;

  // If we're on the last row of the cycle
  if (row === freq) {
    const stitchChange = mode === MODES.INCREASE ? 1 : -1;
    return {
      ...state,
      row: 1,
      stitches: stitches + stitchChange
    };
  }

  // Otherwise just increment the row
  return {
    ...state,
    row: row + 1
  };
}

/**
 * Checks if current row is an increase/decrease row.
 */
export function isAdjustmentRow(state) {
  return state.row === state.freq;
}

/**
 * Resets state back to setup mode.
 */
export function resetToSetup() {
  return {
    mode: null,
    stitches: null,
    freq: null,
    row: 1,
    setupNeeded: true
  };
}

