// Web Audio API Synthesizer - 100% native, zero dependencies, works offline!

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * High-tech scanner sweep chime (played when Face / Biometric Scan starts)
 */
export function playScanSweepSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const now = ctx.currentTime;

    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(1320, now + 0.35);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.36);
  } catch (e) {
    // Ignore audio autoplay restrictions gracefully
  }
}

/**
 * Harmonic success chord (played when Patient Identity is confirmed & decrypted)
 */
export function playSuccessChime() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.07, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.5);
    });
  } catch (e) {}
}

/**
 * Emergency alert pulse (played when Fatal Blood Group conflict is flagged)
 */
export function playConflictAlertTone() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    [0, 0.22].forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now + offset);
      osc.frequency.setValueAtTime(196, now + offset + 0.08);

      gain.gain.setValueAtTime(0.09, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + offset);
      osc.stop(now + offset + 0.19);
    });
  } catch (e) {}
}

/**
 * Realistic Indian Telecom Phone Ring (400Hz + 450Hz cadence)
 */
export function playPhoneRingCadence(): () => void {
  const ctx = getAudioContext();
  if (!ctx) return () => {};

  let isPlaying = true;
  let intervalId: any = null;

  const playOneBurst = () => {
    if (!isPlaying || !ctx) return;
    try {
      const now = ctx.currentTime;
      const duration = 0.8;

      [400, 450].forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.05, now);
        gain.gain.setValueAtTime(0.05, now + duration - 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + duration);
      });
    } catch (e) {}
  };

  playOneBurst();
  intervalId = setInterval(playOneBurst, 2500);

  return () => {
    isPlaying = false;
    if (intervalId) clearInterval(intervalId);
  };
}

/**
 * Speech synthesis audio playback (Mother's live voice in call)
 */
export function speakMotherVoice(text: string, onEnd?: () => void) {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    if (onEnd) onEnd();
    return;
  }

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.25; // Higher, urgent voice
    utterance.lang = 'en-IN';

    // Try finding an Indian English voice if available
    const voices = window.speechSynthesis.getVoices();
    const inVoice = voices.find((v) => v.lang.includes('IN') || v.name.includes('India'));
    if (inVoice) {
      utterance.voice = inVoice;
    }

    if (onEnd) {
      utterance.onend = onEnd;
    }

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    if (onEnd) onEnd();
  }
}
