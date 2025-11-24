import { describe, it, expect, beforeEach, vi } from 'vitest';
import { loadState, saveState, clearState } from '../src/storage/storageClient';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

global.window = {
  localStorage: localStorageMock
};

describe('storageClient', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  describe('saveState', () => {
    it('saves state to localStorage', () => {
      const state = {
        mode: 'increase',
        stitches: 60,
        freq: 8,
        row: 3
      };
      const result = saveState(state);
      expect(result).toBe(true);
      expect(localStorageMock.getItem('row_counter_state')).toBeTruthy();
    });
  });

  describe('loadState', () => {
    it('loads state from localStorage', () => {
      const state = {
        mode: 'increase',
        stitches: 60,
        freq: 8,
        row: 3
      };
      saveState(state);
      const loaded = loadState();
      expect(loaded).toEqual(state);
    });

    it('returns null when no state exists', () => {
      const loaded = loadState();
      expect(loaded).toBe(null);
    });
  });

  describe('clearState', () => {
    it('clears state from localStorage', () => {
      const state = {
        mode: 'increase',
        stitches: 60,
        freq: 8,
        row: 3
      };
      saveState(state);
      const result = clearState();
      expect(result).toBe(true);
      const loaded = loadState();
      expect(loaded).toBe(null);
    });
  });
});

