import React from 'react';

export const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 p-4 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
      Vadaliya Kishan © {new Date().getFullYear()}
    </footer>
  );
}; 