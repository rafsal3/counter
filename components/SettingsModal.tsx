
import React, { useState, useEffect } from 'react';
import { Counter } from '../types';
import { CloseIcon } from './icons';

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
          // @ts-ignore
          ...prev[parent],
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

export default SettingsModal;
