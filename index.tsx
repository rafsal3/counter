import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom/client';

// --- From types.ts ---
interface CounterSettings {
  step: number;
  maxValue: number;
  digits: number;
  sound: boolean;
  vibration: boolean;
}

interface Counter {
  id: string;
  name: string;
  value: number;
  settings: CounterSettings;
}

// --- From hooks/useLocalStorage.ts ---
function useLocalStorage<T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      const valueToStore = storedValue;
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error)      {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

// --- From hooks/useSound.ts ---
const useSound = () => {
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
    playSound(440, 'sine');
  }, [playSound]);

  const playDownSound = useCallback(() => {
    playSound(330, 'sine');
  }, [playSound]);

  return { playUpSound, playDownSound };
};


// --- From components/icons.tsx ---
const PlusIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);
const MinusIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
  </svg>
);
const SettingsIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const TrashIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);
const AddIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
  </svg>
);
const CloseIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const SunIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);
const MoonIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
);
const BackIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7 7-7" />
  </svg>
);

// --- From components/OdometerDisplay.tsx ---
interface OdometerDigitProps {
  digit: number;
}
const OdometerDigit: React.FC<OdometerDigitProps> = ({ digit }) => {
  const yOffset = -digit * 1;
  return (
    <div className="h-[1em] overflow-hidden leading-[1em]">
      <div
        className="transition-transform duration-500 ease-in-out"
        style={{ transform: `translateY(${yOffset}em)` }}
      >
        <span>0</span><br />
        <span>1</span><br />
        <span>2</span><br />
        <span>3</span><br />
        <span>4</span><br />
        <span>5</span><br />
        <span>6</span><br />
        <span>7</span><br />
        <span>8</span><br />
        <span>9</span><br />
      </div>
    </div>
  );
};
interface OdometerDisplayProps {
  value: number;
  digits: number;
}
const OdometerDisplay: React.FC<OdometerDisplayProps> = ({ value, digits }) => {
  const formattedValue = String(value).padStart(digits, '0');
  return (
    <div className="flex font-mono text-6xl sm:text-7xl md:text-8xl font-bold text-gray-900 dark:text-gray-100 tracking-wider">
      {formattedValue.split('').map((char, index) => (
        <OdometerDigit key={index} digit={parseInt(char, 10)} />
      ))}
    </div>
  );
};

// --- From components/SettingsModal.tsx ---
interface SettingsModalProps {
  counter: Counter;
  onSave: (counter: Counter) => void;
  onClose: () => void;
}
const SettingsModal: React.FC<SettingsModalProps> = ({ counter, onSave, onClose }) => {
  const [formData, setFormData] = useState(counter);
  useEffect(() => {
    setFormData(counter);
  }, [counter]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          // FIX: The type of `prev[parent]` can be a primitive (e.g., string or number), which cannot be spread.
          // Casting to 'any' here is a pragmatic solution to bypass the type check, as we know from the
          // form's input names that `parent` will always be 'settings', which corresponds to an object.
          ...(prev[parent as keyof typeof prev] as any),
          [child]: type === 'checkbox' ? checked : (type === 'number' ? parseInt(value, 10) || 0 : value)
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : (type === 'number' ? parseInt(value, 10) || 0 : value)
      }));
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6 sm:p-8 transform transition-all"
           onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
          <button onClick={onClose} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">
            <CloseIcon />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Counter Name</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="settings.step" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Step</label>
              <input type="number" id="settings.step" name="settings.step" value={formData.settings.step} onChange={handleChange} min="1" className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2" />
            </div>
            <div>
              <label htmlFor="settings.maxValue" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Max Value</label>
              <input type="number" id="settings.maxValue" name="settings.maxValue" value={formData.settings.maxValue} onChange={handleChange} min="1" className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2" />
            </div>
            <div>
              <label htmlFor="settings.digits" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Digits</label>
              <input type="number" id="settings.digits" name="settings.digits" value={formData.settings.digits} onChange={handleChange} min="3" max="8" className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2" />
            </div>
          </div>
          <div className="flex items-center justify-around pt-2">
              <div className="flex items-center">
                  <input id="settings.sound" name="settings.sound" type="checkbox" checked={formData.settings.sound} onChange={handleChange} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                  <label htmlFor="settings.sound" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">Sound Effects</label>
              </div>
              <div className="flex items-center">
                  <input id="settings.vibration" name="settings.vibration" type="checkbox" checked={formData.settings.vibration} onChange={handleChange} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                  <label htmlFor="settings.vibration" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">Vibration</label>
              </div>
          </div>
          <div className="flex justify-end pt-4 space-x-3">
            <button type="button" onClick={onClose} className="py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Cancel</button>
            <button type="submit" className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- From components/Counter.tsx ---
interface CounterProps {
  counter: Counter;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onOpenSettings: (counter: Counter) => void;
}
const Counter: React.FC<CounterProps> = ({ counter, onSelect, onDelete, onOpenSettings }) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${counter.name}"?`)) {
      onDelete(counter.id);
    }
  };
  const handleOpenSettings = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenSettings(counter);
  };
  return (
    <div
      className="group relative bg-gray-200/50 dark:bg-gray-800/70 rounded-2xl shadow-md p-4 sm:p-6 flex flex-col items-center justify-between cursor-pointer transition-all duration-300 ring-2 ring-transparent hover:ring-blue-400 dark:hover:ring-blue-500"
      onClick={() => onSelect(counter.id)}
      role="button"
      tabIndex={0}
      aria-label={`Select counter ${counter.name}`}
    >
      <div className="absolute top-2 right-2 flex items-center space-x-1 opacity-20 group-hover:opacity-100 transition-opacity">
        <button onClick={handleOpenSettings} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10" aria-label="Settings">
          <SettingsIcon className="w-5 h-5" />
        </button>
        <button onClick={handleDelete} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10" aria-label="Delete">
          <TrashIcon className="w-5 h-5 text-red-500" />
        </button>
      </div>
      <h2 className="font-semibold text-xl text-center text-gray-700 dark:text-gray-300 mb-4 truncate w-full px-12">{counter.name}</h2>
      <div className="w-full flex items-center justify-center my-4">
        <OdometerDisplay value={counter.value} digits={counter.settings.digits} />
      </div>
    </div>
  );
};

// --- From components/CounterDetail.tsx ---
interface CounterDetailProps {
  counter: Counter;
  onUpdate: (id: string, data: Partial<Counter>) => void;
  onDelete: (id: string) => void;
  onOpenSettings: (counter: Counter) => void;
  onBack: () => void;
}
const CounterDetail: React.FC<CounterDetailProps> = ({ counter, onUpdate, onDelete, onOpenSettings, onBack }) => {
  const { playUpSound, playDownSound } = useSound();
  const handleInteraction = (newValue: number, isIncrement: boolean) => {
    if (counter.settings.sound) {
      isIncrement ? playUpSound() : playDownSound();
    }
    if (counter.settings.vibration && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }
    onUpdate(counter.id, { value: newValue });
  };
  const handleIncrement = useCallback(() => {
    const newValue = Math.min(counter.value + counter.settings.step, counter.settings.maxValue);
    if (newValue !== counter.value) {
        handleInteraction(newValue, true);
    }
  }, [counter.value, counter.settings, counter.id, onUpdate]);
  const handleDecrement = useCallback(() => {
    const newValue = Math.max(counter.value - counter.settings.step, 0);
    if (newValue !== counter.value) {
        handleInteraction(newValue, false);
    }
  }, [counter.value, counter.settings, counter.id, onUpdate]);
  const handleDelete = () => {
     if (window.confirm(`Are you sure you want to delete "${counter.name}"?`)) {
        onDelete(counter.id);
     }
  }
  return (
    <div className="w-full max-w-2xl mx-auto h-full flex flex-col p-4 animate-fade-in">
      <header className="flex justify-between items-center w-full mb-4">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="Go back">
          <BackIcon />
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 dark:text-white truncate mx-4 flex-1">{counter.name}</h1>
        <div className="flex items-center space-x-1">
          <button onClick={() => onOpenSettings(counter)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="Settings">
            <SettingsIcon className="w-5 h-5" />
          </button>
          <button onClick={handleDelete} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="Delete">
            <TrashIcon className="w-5 h-5 text-red-500" />
          </button>
        </div>
      </header>
      <main className="flex-grow flex flex-col items-center justify-center w-full my-8">
        <OdometerDisplay value={counter.value} digits={counter.settings.digits} />
      </main>
      <footer className="w-full grid grid-cols-2 gap-4 sm:gap-6">
        <button 
          onClick={handleDecrement}
          className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-2xl py-8 sm:py-12 flex justify-center items-center transition-transform transform active:scale-95 hover:bg-gray-400 dark:hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-500/50"
          aria-label="Decrement"
        >
          <MinusIcon className="h-10 w-10 sm:h-12 sm:w-12" />
        </button>
        <button 
          onClick={handleIncrement}
          className="bg-blue-500 dark:bg-blue-600 text-white rounded-2xl py-8 sm:py-12 flex justify-center items-center transition-transform transform active:scale-95 hover:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
          aria-label="Increment"
        >
          <PlusIcon className="h-10 w-10 sm:h-12 sm:w-12"/>
        </button>
      </footer>
    </div>
  );
};

// --- From App.tsx ---
const App: React.FC = () => {
  const [counters, setCounters] = useLocalStorage<Counter[]>('counters', []);
  const [selectedCounterId, setSelectedCounterId] = useLocalStorage<string | null>('selectedCounterId', null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [editingCounter, setEditingCounter] = useState<Counter | null>(null);
  const [isDarkMode, setIsDarkMode] = useLocalStorage('darkMode', true);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (selectedCounterId && !counters.some(c => c.id === selectedCounterId)) {
        setSelectedCounterId(null);
    }
  }, [counters, selectedCounterId, setSelectedCounterId]);

  const handleAddCounter = () => {
    const newCounter: Counter = {
      id: Date.now().toString(),
      name: `Counter ${counters.length + 1}`,
      value: 0,
      settings: {
        step: 1,
        maxValue: 999,
        digits: 3,
        sound: true,
        vibration: true,
      },
    };
    const newCounters = [...counters, newCounter];
    setCounters(newCounters);
    setSelectedCounterId(newCounter.id);
  };

  const updateCounter = useCallback((id: string, updatedValues: Partial<Counter>) => {
    setCounters(prev => prev.map(c => c.id === id ? { ...c, ...updatedValues } : c));
  }, [setCounters]);

  const deleteCounter = useCallback((id: string) => {
    setCounters(prev => prev.filter(c => c.id !== id));
  }, [setCounters]);
  
  const deleteCounterFromDetail = useCallback((id: string) => {
    setCounters(prev => prev.filter(c => c.id !== id));
    setSelectedCounterId(null);
  }, [setCounters, setSelectedCounterId]);

  const openSettings = useCallback((counter: Counter) => {
    setEditingCounter(counter);
    setIsSettingsModalOpen(true);
  }, []);

  const handleSaveSettings = (updatedCounter: Counter) => {
    updateCounter(updatedCounter.id, updatedCounter);
    setIsSettingsModalOpen(false);
    setEditingCounter(null);
  };

  const handleKeydown = useCallback((e: KeyboardEvent) => {
    if (isSettingsModalOpen || !selectedCounterId) return;
    const selectedCounter = counters.find(c => c.id === selectedCounterId);
    if (!selectedCounter) return;
    let handled = false;
    if (e.key === 'ArrowUp' || e.key === '+') {
      const newValue = Math.min(selectedCounter.value + selectedCounter.settings.step, selectedCounter.settings.maxValue);
      updateCounter(selectedCounter.id, { value: newValue });
      handled = true;
    } else if (e.key === 'ArrowDown' || e.key === '-') {
      const newValue = Math.max(selectedCounter.value - selectedCounter.settings.step, 0);
      updateCounter(selectedCounter.id, { value: newValue });
      handled = true;
    }
    if (handled) {
      e.preventDefault();
      if (selectedCounter.settings.sound) {
        const audioContext = new (window.AudioContext)();
        const oscillator = audioContext.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(e.key === 'ArrowUp' || e.key === '+' ? 440 : 330, audioContext.currentTime);
        oscillator.connect(audioContext.destination);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
      }
      if (selectedCounter.settings.vibration && 'vibrate' in navigator) {
        navigator.vibrate(50);
      }
    }
  }, [counters, selectedCounterId, isSettingsModalOpen, updateCounter]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeydown);
    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [handleKeydown]);
  
  const selectedCounter = counters.find(c => c.id === selectedCounterId);

  return (
    <div className="min-h-screen text-gray-800 dark:text-gray-200 p-4 sm:p-6 lg:p-8 flex flex-col items-center">
      <header className="w-full max-w-5xl flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Minimal Counter</h1>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle theme"
        >
          {isDarkMode ? <SunIcon /> : <MoonIcon />}
        </button>
      </header>
      <main className="w-full flex-grow flex flex-col items-center">
        {selectedCounterId && selectedCounter ? (
          <CounterDetail
            counter={selectedCounter}
            onUpdate={updateCounter}
            onDelete={deleteCounterFromDetail}
            onOpenSettings={openSettings}
            onBack={() => setSelectedCounterId(null)}
          />
        ) : (
          <>
            {counters.length === 0 ? (
              <div className="flex-grow flex flex-col justify-center items-center text-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl animate-pulse-bg">
                <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-400">No counters yet!</h2>
                <p className="mt-2 text-gray-500 dark:text-gray-500">Click the '+' button to add your first counter.</p>
              </div>
            ) : (
              <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {counters.map(counter => (
                  <Counter
                    key={counter.id}
                    counter={counter}
                    onSelect={() => setSelectedCounterId(counter.id)}
                    onDelete={deleteCounter}
                    onOpenSettings={openSettings}
                  />
                ))}
              </div>
            )}
             <div className="fixed bottom-6 right-6">
              <button
                onClick={handleAddCounter}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transform transition-transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
                aria-label="Add new counter"
              >
                <AddIcon />
              </button>
            </div>
          </>
        )}
      </main>
      {isSettingsModalOpen && editingCounter && (
        <SettingsModal
          counter={editingCounter}
          onSave={handleSaveSettings}
          onClose={() => setIsSettingsModalOpen(false)}
        />
      )}
    </div>
  );
};


// --- Render logic from original index.tsx ---
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);