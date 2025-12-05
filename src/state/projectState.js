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
 * Returns null if no target is set (open-ended counter)
 */
export function calculateTotalRows(counter) {
  const { mode, startStitches, endStitches, freq } = counter;
  
  if (mode === MODES.CONSTANT) {
    // For constant mode, user specifies total rows directly (or null if open-ended)
    return counter.totalRows || null;
  }
  
  // If no end stitches set, it's open-ended
  if (!endStitches || endStitches === startStitches) {
    return null;
  }
  
  const stitchDiff = Math.abs(endStitches - startStitches);
  return stitchDiff * freq;
}

/**
 * Check if counter has a target (not open-ended)
 */
export function hasTarget(counter) {
  return calculateTotalRows(counter) !== null;
}

/**
 * Calculate current stitches based on row progress
 * INCREASE: Increase happens on last row (row 6) of cycle
 * DECREASE: Decrease happens on first row (row 1) of cycle
 */
export function calculateCurrentStitches(counter) {
  const { mode, startStitches, endStitches, currentRow, freq } = counter;
  
  if (mode === MODES.CONSTANT) {
    return startStitches;
  }
  
  const patternRow = calculatePatternRow(counter);
  const currentCycle = Math.floor((currentRow - 1) / freq);
  
  if (mode === MODES.INCREASE) {
    // For increase: changes happen after completing the last row (row freq)
    // So all rows in a cycle have the same stitch count
    return startStitches + currentCycle;
  } else {
    // For decrease: decrease happens on row 1, then rows 2-freq have the new count
    // Row 1: no decrease yet (current cycle count)
    // Rows 2-freq: one more decrease completed
    const decreasesCompleted = patternRow === 1 ? currentCycle : currentCycle + 1;
    return startStitches - decreasesCompleted;
  }
}

/**
 * Calculate pattern row (position in the cycle, 1 to freq)
 */
export function calculatePatternRow(counter) {
  const { currentRow, freq } = counter;
  const patternRow = ((currentRow - 1) % freq) + 1;
  return patternRow;
}

/**
 * Check if current row is an adjustment row
 * INCREASE: adjustment happens on last row (row freq) - e.g., row 6
 * DECREASE: adjustment happens on first row (row 1)
 */
export function isAdjustmentRow(counter) {
  const { mode, freq } = counter;
  
  if (mode === MODES.CONSTANT) {
    return false;
  }
  
  const patternRow = calculatePatternRow(counter);
  
  if (mode === MODES.INCREASE) {
    return patternRow === freq; // Last row of cycle
  } else {
    return patternRow === 1; // First row of cycle
  }
}

/**
 * Advance the counter by one row
 * Completion happens AFTER you click "Done" on the last row
 */
export function advanceCounter(counter) {
  const totalRows = calculateTotalRows(counter);
  
  // If open-ended (no target), just keep counting
  if (totalRows === null) {
    return {
      ...counter,
      currentRow: counter.currentRow + 1
    };
  }
  
  // If we're ON the last row and clicking "Done", we've completed it
  if (counter.currentRow === totalRows) {
    return {
      ...counter,
      completed: true
    };
  }
  
  // Otherwise just increment
  return {
    ...counter,
    currentRow: counter.currentRow + 1
  };
}

/**
 * Manually mark a counter as complete (for open-ended counters)
 */
export function markCounterComplete(counter) {
  return {
    ...counter,
    completed: true
  };
}

/**
 * Validate counter data
 * - Name is optional (auto-generated from mode)
 * - End stitches is optional (makes counter open-ended)
 * - Total rows is optional for constant mode (makes it open-ended)
 */
export function validateCounter(counter) {
  const errors = {};
  
  // Name is now optional - will be auto-generated
  
  if (!counter.mode) {
    errors.mode = 'Please select a mode';
  }
  
  const startStitches = parseInt(counter.startStitches, 10);
  const endStitches = parseInt(counter.endStitches, 10);
  const freq = parseInt(counter.freq, 10);
  const totalRows = parseInt(counter.totalRows, 10);
  
  if (!counter.startStitches || isNaN(startStitches) || startStitches < 1) {
    errors.startStitches = 'Start stitches must be at least 1';
  }
  
  if (counter.mode === MODES.CONSTANT) {
    // Total rows is optional for constant mode (open-ended if not set)
  } else {
    // End stitches is optional (open-ended if not set)
    // But if provided, must be valid
    if (counter.endStitches && !isNaN(endStitches)) {
      if (counter.mode === MODES.INCREASE && endStitches <= startStitches) {
        errors.endStitches = 'End stitches must be greater than start stitches for increasing';
      }
      
      if (counter.mode === MODES.DECREASE && endStitches >= startStitches) {
        errors.endStitches = 'End stitches must be less than start stitches for decreasing';
      }
    }
    
    if (!counter.freq || isNaN(freq) || freq < 1) {
      errors.freq = 'Frequency must be at least 1';
    }
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Generate auto name from mode
 */
function generateCounterName(mode) {
  switch (mode) {
    case MODES.INCREASE: return 'Increasing';
    case MODES.DECREASE: return 'Decreasing';
    case MODES.CONSTANT: return 'Constant';
    default: return 'Counter';
  }
}

/**
 * Create a new counter
 * - Name auto-generated if not provided
 * - End stitches optional (null if not provided)
 * - Total rows optional for constant mode (null if not provided)
 */
export function createCounter(data) {
  const startStitches = parseInt(data.startStitches, 10);
  const endStitches = data.endStitches ? parseInt(data.endStitches, 10) : null;
  const freq = data.freq ? parseInt(data.freq, 10) : 1;
  const totalRows = data.totalRows ? parseInt(data.totalRows, 10) : null;
  
  return {
    id: Date.now().toString(),
    name: data.name?.trim() || generateCounterName(data.mode),
    mode: data.mode,
    startStitches: startStitches,
    endStitches: data.mode === MODES.CONSTANT ? startStitches : endStitches,
    freq: data.mode === MODES.CONSTANT ? 1 : freq,
    totalRows: data.mode === MODES.CONSTANT ? totalRows : null,
    currentRow: 1,
    completed: false
  };
}

