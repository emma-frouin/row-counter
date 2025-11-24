import { describe, it, expect } from 'vitest';
import {
  MODES,
  createInitialState,
  applySetup,
  advanceRow,
  isAdjustmentRow,
  resetToSetup
} from '../src/state/counterState';

describe('counterState', () => {
  describe('createInitialState', () => {
    it('creates default state when no stored data', () => {
      const state = createInitialState();
      expect(state.setupNeeded).toBe(true);
      expect(state.row).toBe(1);
    });

    it('restores from stored data', () => {
      const stored = {
        mode: MODES.INCREASE,
        stitches: 60,
        freq: 8,
        row: 5
      };
      const state = createInitialState(stored);
      expect(state.mode).toBe(MODES.INCREASE);
      expect(state.stitches).toBe(60);
      expect(state.freq).toBe(8);
      expect(state.row).toBe(5);
      expect(state.setupNeeded).toBe(false);
    });
  });

  describe('applySetup', () => {
    it('validates and accepts valid setup', () => {
      const result = applySetup(MODES.INCREASE, 60, 8);
      expect(result.valid).toBe(true);
      expect(result.state.mode).toBe(MODES.INCREASE);
      expect(result.state.stitches).toBe(60);
      expect(result.state.freq).toBe(8);
      expect(result.state.row).toBe(1);
      expect(result.state.setupNeeded).toBe(false);
    });

    it('rejects invalid mode', () => {
      const result = applySetup('invalid', 60, 8);
      expect(result.valid).toBe(false);
      expect(result.errors.mode).toBeDefined();
    });

    it('rejects invalid stitches', () => {
      const result = applySetup(MODES.INCREASE, -5, 8);
      expect(result.valid).toBe(false);
      expect(result.errors.stitches).toBeDefined();
    });

    it('rejects invalid frequency', () => {
      const result = applySetup(MODES.INCREASE, 60, 0);
      expect(result.valid).toBe(false);
      expect(result.errors.freq).toBeDefined();
    });
  });

  describe('advanceRow', () => {
    it('increments row normally', () => {
      const state = {
        mode: MODES.INCREASE,
        stitches: 60,
        freq: 8,
        row: 3,
        setupNeeded: false
      };
      const newState = advanceRow(state);
      expect(newState.row).toBe(4);
      expect(newState.stitches).toBe(60);
    });

    it('cycles back to 1 and increases stitches on adjustment row', () => {
      const state = {
        mode: MODES.INCREASE,
        stitches: 60,
        freq: 8,
        row: 8,
        setupNeeded: false
      };
      const newState = advanceRow(state);
      expect(newState.row).toBe(1);
      expect(newState.stitches).toBe(61);
    });

    it('cycles back to 1 and decreases stitches on adjustment row', () => {
      const state = {
        mode: MODES.DECREASE,
        stitches: 60,
        freq: 8,
        row: 8,
        setupNeeded: false
      };
      const newState = advanceRow(state);
      expect(newState.row).toBe(1);
      expect(newState.stitches).toBe(59);
    });
  });

  describe('isAdjustmentRow', () => {
    it('returns true on adjustment row', () => {
      const state = {
        mode: MODES.INCREASE,
        stitches: 60,
        freq: 8,
        row: 8,
        setupNeeded: false
      };
      expect(isAdjustmentRow(state)).toBe(true);
    });

    it('returns false on normal row', () => {
      const state = {
        mode: MODES.INCREASE,
        stitches: 60,
        freq: 8,
        row: 5,
        setupNeeded: false
      };
      expect(isAdjustmentRow(state)).toBe(false);
    });
  });

  describe('resetToSetup', () => {
    it('clears all state', () => {
      const state = resetToSetup();
      expect(state.mode).toBe(null);
      expect(state.stitches).toBe(null);
      expect(state.freq).toBe(null);
      expect(state.row).toBe(1);
      expect(state.setupNeeded).toBe(true);
    });
  });
});

