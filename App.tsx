
import React, { useState, useEffect, useCallback } from 'react';
import { Counter as CounterType } from './types.ts';
import { useLocalStorage } from './hooks/useLocalStorage.ts';
import Counter from './components/Counter.tsx';
import CounterDetail from './components/CounterDetail.tsx';
import SettingsModal from './components/SettingsModal.tsx';
import { AddIcon, MoonIcon, SunIcon } from './components/icons.tsx';

const App: React.FC = () => {
  const [counters, setCounters] = useLocalStorage<CounterType[]>('counters', []);
  const [selectedCounterId, setSelectedCounterId] = useLocalStorage<string | null>('selectedCounterId', null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [editingCounter, setEditingCounter] = useState<CounterType | null>(null);
  const [isDarkMode, setIsDarkMode] = useLocalStorage('darkMode', true);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    // If the selected counter is deleted from the list, go back to the dashboard.
    if (selectedCounterId && !counters.some(c => c.id === selectedCounterId)) {
        setSelectedCounterId(null);
    }
  }, [counters, selectedCounterId, setSelectedCounterId]);

  const handleAddCounter = () => {
    const newCounter: CounterType = {
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

  const updateCounter = useCallback((id: string, updatedValues: Partial<CounterType>) => {
    setCounters(prev => prev.map(c => c.id === id ? { ...c, ...updatedValues } : c));
  }, [setCounters]);

  const deleteCounter = useCallback((id: string) => {
    setCounters(prev => prev.filter(c => c.id !== id));
  }, [setCounters]);
  
  const deleteCounterFromDetail = useCallback((id: string) => {
    setCounters(prev => prev.filter(c => c.id !== id));
    setSelectedCounterId(null);
  }, [setCounters, setSelectedCounterId]);


  const openSettings = useCallback((counter: CounterType) => {
    setEditingCounter(counter);
    setIsSettingsModalOpen(true);
  }, []);

  const handleSaveSettings = (updatedCounter: CounterType) => {
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
      // Optionally trigger sound/vibration for keyboard events
      if (selectedCounter.settings.sound) {
        // This is a simplified approach. A more robust solution might use a shared sound hook.
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

export default App;