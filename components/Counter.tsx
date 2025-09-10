import React from 'react';
import { Counter as CounterType } from '../types';
import OdometerDisplay from './OdometerDisplay';
import { SettingsIcon, TrashIcon } from './icons';

interface CounterProps {
  counter: CounterType;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onOpenSettings: (counter: CounterType) => void;
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

export default Counter;