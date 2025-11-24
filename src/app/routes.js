/**
 * Simple view routing/mapping.
 */

export const VIEWS = {
  SETUP: 'setup',
  COUNTER: 'counter'
};

export function getInitialView(state) {
  return state.setupNeeded ? VIEWS.SETUP : VIEWS.COUNTER;
}

