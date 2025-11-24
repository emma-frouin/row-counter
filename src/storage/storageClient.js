/**
 * localStorage abstraction for counter state persistence.
 */

const STORAGE_KEY = 'row_counter_state';

/**
 * Loads state from localStorage.
 * Returns stored object or null if not found/invalid.
 */
export function loadState() {
  try {
    const item = window.localStorage.getItem(STORAGE_KEY);
    if (!item) {
      return null;
    }
    return JSON.parse(item);
  } catch (error) {
    console.error('Error loading state from localStorage:', error);
    return null;
  }
}

/**
 * Saves state to localStorage.
 */
export function saveState(state) {
  try {
    const serialized = JSON.stringify(state);
    window.localStorage.setItem(STORAGE_KEY, serialized);
    return true;
  } catch (error) {
    console.error('Error saving state to localStorage:', error);
    return false;
  }
}

/**
 * Clears state from localStorage.
 */
export function clearState() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing state from localStorage:', error);
    return false;
  }
}

