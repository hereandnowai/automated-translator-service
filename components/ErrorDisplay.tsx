
import React from 'react';
import { ExclamationTriangleIcon } from './Icons';
import { AppTheme } from '../types';


interface ErrorDisplayProps {
  message: string;
  theme?: AppTheme;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, theme = 'default' }) => {
  if (!message) return null;

  let containerClass = "border-l-4 p-4 rounded-md shadow-md";
  let iconClass = "w-6 h-6 mr-3";
  let titleClass = "font-bold";
  let messageTextClass = "";

  switch (theme) {
    case 'light':
      containerClass += " bg-red-100 border-red-500 text-red-700";
      iconClass += " text-red-500";
      // titleClass and messageTextClass can inherit from containerClass's text-red-700
      break;
    case 'dark':
      containerClass += " bg-red-800 border-red-600 text-red-200"; // Slightly darker red bg
      iconClass += " text-red-400";
      // titleClass and messageTextClass can inherit from containerClass's text-red-200
      break;
    case 'default':
    default:
      containerClass += " bg-red-700 border-red-500 text-red-100";
      iconClass += " text-red-300";
      // titleClass and messageTextClass can inherit from containerClass's text-red-100
      break;
  }


  return (
    <div className={containerClass} role="alert">
      <div className="flex items-center">
        <ExclamationTriangleIcon className={iconClass} />
        <div>
          <p className={titleClass}>Error</p>
          <p className={messageTextClass}>{message}</p>
        </div>
      </div>
    </div>
  );
};