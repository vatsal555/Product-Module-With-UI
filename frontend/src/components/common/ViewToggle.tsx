import React from 'react';
import { 
  Squares2X2Icon,
  ListBulletIcon, 
  TableCellsIcon 
} from '@heroicons/react/24/outline';

export type ViewType = 'grid' | 'list' | 'detailed';

interface ViewToggleProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ currentView, onViewChange }) => {
  return (
    <div className="flex items-center space-x-2 bg-white dark:bg-dark-card rounded-lg p-1 shadow-sm">
      <button
        onClick={() => onViewChange('grid')}
        className={`p-2 rounded-md transition-colors ${
          currentView === 'grid'
            ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300'
            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
        title="Grid View"
      >
        <Squares2X2Icon className="w-5 h-5" />
      </button>
      <button
        onClick={() => onViewChange('list')}
        className={`p-2 rounded-md transition-colors ${
          currentView === 'list'
            ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300'
            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
        title="List View"
      >
        <ListBulletIcon className="w-5 h-5" />
      </button>
      <button
        onClick={() => onViewChange('detailed')}
        className={`p-2 rounded-md transition-colors ${
          currentView === 'detailed'
            ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300'
            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
        title="Detailed View"
      >
        <TableCellsIcon className="w-5 h-5" />
      </button>
    </div>
  );
}; 