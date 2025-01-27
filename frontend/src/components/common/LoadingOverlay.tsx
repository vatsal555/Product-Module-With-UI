import React from 'react';
import { Spinner } from './Spinner';

interface LoadingOverlayProps {
  message?: string;
}

export const LoadingOverlay = ({ message = 'Loading...' }: LoadingOverlayProps) => {
  return (
    <div className="fixed inset-0 bg-gray-900 dark:bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 transition-colors duration-300">
      <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-xl flex flex-col items-center transition-colors duration-300">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-700 dark:text-gray-300">{message}</p>
      </div>
    </div>
  );
}; 