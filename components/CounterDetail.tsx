
import React, { useCallback } from 'react';
import { Counter as CounterType } from '../types.ts';
import OdometerDisplay from './OdometerDisplay.tsx';
import { MinusIcon, PlusIcon, SettingsIcon, TrashIcon, BackIcon } from './icons.tsx';
import { useSound } from '../hooks/useSound.ts';

interface CounterDetailProps {
  counter: CounterType;
  onUpdate: (id: string, data: Partial<CounterType>) => void;
  onDelete: (id: string) => void;
  onOpenSettings: (counter: CounterType) => void;
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

export default CounterDetail;