
import React from 'react';
import { AppTheme } from '../types';

interface LoadingSpinnerProps {
  simple?: boolean; // For a smaller, inline spinner
  className?: string;
  theme?: AppTheme; // Optional theme prop
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ simple = false, className = '', theme = 'default' }) => {
  let spinnerColor = 'text-yellow-400'; // Default
  let textColor = 'text-teal-300'; // Default

  if (simple) {
      switch (theme) {
          case 'light':
              spinnerColor = 'text-yellow-500'; // Or a darker teal/yellow
              break;
          case 'dark':
          case 'default':
              spinnerColor = 'text-yellow-400';
              break;
      }
       return (
        <svg 
            className={`animate-spin h-5 w-5 ${spinnerColor} ${className}`} 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
        >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        );
  }


  // Full spinner
  switch (theme) {
    case 'light':
      spinnerColor = 'text-yellow-500';
      textColor = 'text-teal-700';
      break;
    case 'dark':
      spinnerColor = 'text-yellow-400';
      textColor = 'text-teal-300';
      break;
    case 'default':
    default:
      spinnerColor = 'text-yellow-400';
      textColor = 'text-teal-300';
      break;
  }


  return (
    <div className={`flex flex-col items-center justify-center space-y-2 ${className}`}>
      <svg 
        className={`animate-spin h-12 w-12 ${spinnerColor}`} 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p className={`${textColor} text-sm`}>Processing your request...</p>
    </div>
  );
};