/**
 * Continuous subtle sound for adjustment rows using Web Audio API
 */

let audioContext = null;
let oscillator = null;
let gainNode = null;
let isPlaying = false;

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
}

/**
 * Start playing a continuous subtle tone
 */
export function startContinuousSound() {
  if (isPlaying) return;
  
  try {
    const ctx = getAudioContext();
    
    // Create oscillator for the tone
    oscillator = ctx.createOscillator();
    gainNode = ctx.createGain();
    
    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    // Set a gentle, non-intrusive frequency (lower is subtler)
    oscillator.frequency.value = 440; // A4 note
    oscillator.type = 'sine'; // Smoothest wave type
    
    // Very low volume - subtle reminder
    gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
    
    // Create a gentle pulsing effect
    const pulseInterval = 2; // seconds between pulses
    const now = ctx.currentTime;
    
    function schedulePulse(time) {
      gainNode.gain.setValueAtTime(0.08, time);
      gainNode.gain.exponentialRampToValueAtTime(0.03, time + 0.5);
      gainNode.gain.exponentialRampToValueAtTime(0.08, time + 1);
    }
    
    // Schedule multiple pulses
    for (let i = 0; i < 60; i++) { // Schedule for next 2 minutes
      schedulePulse(now + (i * pulseInterval));
    }
    
    oscillator.start(ctx.currentTime);
    isPlaying = true;
  } catch (error) {
    console.error('Error starting continuous sound:', error);
  }
}

/**
 * Stop the continuous sound
 */
export function stopContinuousSound() {
  if (!isPlaying || !oscillator) return;
  
  try {
    oscillator.stop();
    oscillator.disconnect();
    gainNode.disconnect();
    oscillator = null;
    gainNode = null;
    isPlaying = false;
  } catch (error) {
    console.error('Error stopping continuous sound:', error);
  }
}

/**
 * Check if sound is currently playing
 */
export function isSoundPlaying() {
  return isPlaying;
}

