/**
 * Data models and logic for projects and counters
 */

export const MODES = {
  INCREASE: 'increase',
  DECREASE: 'decrease',
  CONSTANT: 'constant'
};

/**
 * Calculate total rows needed for a counter phase
 */
export function calculateTotalRows(counter) {
  const { mode, startStitches, endStitches, freq } = counter;
  
  if (mode === MODES.CONSTANT) {
    // For constant mode, user specifies total rows directly
    return counter.totalRows || 0;
  }
  
  const stitchDiff = Math.abs(endStitches - startStitches);
  return stitchDiff * freq;
}

/**
 * Calculate current stitches based on row progress
 */
export function calculateCurrentStitches(counter) {
  const { mode, startStitches, endStitches, currentRow, freq } = counter;
  
  if (mode === MODES.CONSTANT) {
    return startStitches;
  }
  
  const cyclesCompleted = Math.floor((currentRow - 1) / freq);
  const change = mode === MODES.INCREASE ? cyclesCompleted : -cyclesCompleted;
  
  return startStitches + change;
}

/**
 * Check if current row is an adjustment row
 */
export function isAdjustmentRow(counter) {
  const { mode, currentRow, freq } = counter;
  
  if (mode === MODES.CONSTANT) {
    return false;
  }
  
  return currentRow % freq === 0;
}

/**
 * Advance the counter by one row
 */
export function advanceCounter(counter) {
  const totalRows = calculateTotalRows(counter);
  const newRow = counter.currentRow + 1;
  
  // Check if counter is complete
  if (newRow > totalRows) {
    return {
      ...counter,
      currentRow: totalRows,
      completed: true
    };
  }
  
  return {
    ...counter,
    currentRow: newRow,
    completed: newRow === totalRows
  };
}

/**
 * Validate counter data
 */
export function validateCounter(counter) {
  const errors = {};
  
  if (!counter.name || counter.name.trim() === '') {
    errors.name = 'Counter name is required';
  }
  
  if (!counter.mode) {
    errors.mode = 'Please select a mode';
  }
  
  if (!counter.startStitches || counter.startStitches < 1) {
    errors.startStitches = 'Start stitches must be at least 1';
  }
  
  if (counter.mode === MODES.CONSTANT) {
    if (!counter.totalRows || counter.totalRows < 1) {
      errors.totalRows = 'Total rows must be at least 1';
    }
  } else {
    if (!counter.endStitches || counter.endStitches < 1) {
      errors.endStitches = 'End stitches must be at least 1';
    }
    
    if (!counter.freq || counter.freq < 1) {
      errors.freq = 'Frequency must be at least 1';
    }
    
    if (counter.mode === MODES.INCREASE && counter.endStitches <= counter.startStitches) {
      errors.endStitches = 'End stitches must be greater than start stitches for increasing';
    }
    
    if (counter.mode === MODES.DECREASE && counter.endStitches >= counter.startStitches) {
      errors.endStitches = 'End stitches must be less than start stitches for decreasing';
    }
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Create a new counter
 */
export function createCounter(data) {
  return {
    id: Date.now().toString(),
    name: data.name,
    mode: data.mode,
    startStitches: parseInt(data.startStitches, 10),
    endStitches: data.mode === MODES.CONSTANT ? parseInt(data.startStitches, 10) : parseInt(data.endStitches, 10),
    freq: data.mode === MODES.CONSTANT ? 1 : parseInt(data.freq, 10),
    totalRows: data.mode === MODES.CONSTANT ? parseInt(data.totalRows, 10) : null,
    currentRow: 1,
    completed: false
  };
}

