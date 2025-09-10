
import { useCallback, useRef } from 'react';

export const useSound = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current && typeof window !== 'undefined') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playSound = useCallback((frequency: number, type: OscillatorType) => {
    const audioContext = getAudioContext();
    if (!audioContext) return;
    
    // Resume context if it's suspended (e.g., due to browser policy)
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.2);
  }, [getAudioContext]);

  const playUpSound = useCallback(() => {
    playSound(440, 'sine'); // A4 note
  }, [playSound]);

  const playDownSound = useCallback(() => {
    playSound(330, 'sine'); // E4 note
  }, [playSound]);

  return { playUpSound, playDownSound };
};
