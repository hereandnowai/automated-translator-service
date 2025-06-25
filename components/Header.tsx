
import React from 'react';
import { COMPANY_NAME } from '../constants'; 
import { ArrowLeftIcon, PaintBrushIcon } from './Icons'; 
import { AppTheme } from '../types';

interface HeaderProps {
  logoUrl: string;
  titleImageUrl: string;
  appName: string;
  onGoHome?: () => void; 
  showBackButton?: boolean; 
  currentTheme: AppTheme;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  logoUrl, 
  titleImageUrl, 
  appName, 
  onGoHome, 
  showBackButton,
  currentTheme,
  onToggleTheme
}) => {
  const handleLogoKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (onGoHome && (event.key === 'Enter' || event.key === ' ')) {
      onGoHome();
    }
  };

  const handleBackKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (onGoHome && (event.key === 'Enter' || event.key === ' ')) {
      onGoHome(); // For back button, ensure it uses onGoHome if available for consistency
    }
  };

  const handleThemeToggleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      onToggleTheme();
    }
  };

  let headerClasses = "shadow-lg py-4";
  let titleTextClass = "";
  let appNameTextClass = "";
  let iconButtonClasses = "";
  let companyTitleTextClass = ""; // For "HEREANDNOW AI" on small screens

  switch (currentTheme) {
    case 'light':
      headerClasses += " bg-gray-100";
      titleTextClass = "text-yellow-600"; // Main company title (image or text)
      appNameTextClass = "text-teal-700"; // "AI Services Suite"
      iconButtonClasses = "text-teal-600 hover:text-yellow-600 border-teal-500 hover:border-yellow-500 focus:ring-yellow-500";
      companyTitleTextClass = "text-yellow-600";
      break;
    case 'dark':
      headerClasses += " bg-black";
      titleTextClass = "text-yellow-400";
      appNameTextClass = "text-teal-400";
      iconButtonClasses = "text-teal-300 hover:text-yellow-400 border-teal-500 hover:border-yellow-400 focus:ring-yellow-400";
      companyTitleTextClass = "text-yellow-400";
      break;
    case 'default':
    default:
      headerClasses += " bg-slate-800";
      titleTextClass = "text-yellow-400";
      appNameTextClass = "text-teal-400";
      iconButtonClasses = "text-teal-300 hover:text-yellow-400 border-teal-500 hover:border-yellow-400 focus:ring-yellow-400";
      companyTitleTextClass = "text-yellow-400";
      break;
  }
  
  const getNextThemeName = () => {
    if (currentTheme === 'default') return 'Light';
    if (currentTheme === 'light') return 'Dark';
    return 'Default Blue';
  };

  return (
    <header className={headerClasses}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center">
          {showBackButton && onGoHome && (
            <button
              onClick={onGoHome}
              onKeyDown={handleBackKeyDown}
              className={`mr-2 sm:mr-3 font-semibold py-2 px-2 sm:px-3 rounded-md border transition-colors duration-150 flex items-center focus:outline-none focus:ring-2 ${iconButtonClasses}`}
              aria-label="Go to Homepage"
            >
              <ArrowLeftIcon className="w-5 h-5 sm:mr-1" />
              <span className="hidden sm:inline">Back</span>
            </button>
          )}
          <div 
            className={`flex items-center ${onGoHome ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
            onClick={onGoHome}
            onKeyDown={onGoHome ? handleLogoKeyDown : undefined}
            role={onGoHome ? "button" : undefined}
            tabIndex={onGoHome ? 0 : undefined}
            aria-label={onGoHome ? `Go to ${COMPANY_NAME} Homepage` : `${COMPANY_NAME} Logo and Title`}
          >
            {!showBackButton && ( // Only show the small logo on the homepage (when back button is not shown)
              <img src={logoUrl} alt="Company Logo" className="h-10 w-10 mr-3" />
            )}
            <img 
              src={titleImageUrl} 
              alt={`${COMPANY_NAME} Title`} 
              className={`h-10 hidden md:block ${!showBackButton && !logoUrl ? 'ml-0' : ''} ${currentTheme === 'light' ? 'filter_brightness-50' : ''}`} 
            />
            <span 
              className={`text-xl font-bold md:hidden ${companyTitleTextClass} ${!showBackButton && !logoUrl ? 'ml-0' : ''}`}
            >
              HEREANDNOW AI
            </span>
          </div>
        </div>
        
        <div className="flex items-center">
          <button
            onClick={onToggleTheme}
            onKeyDown={handleThemeToggleKeyDown}
            className={`mr-3 sm:mr-4 font-semibold py-2 px-3 rounded-md border transition-colors duration-150 flex items-center focus:outline-none focus:ring-2 ${iconButtonClasses}`}
            aria-label={`Switch to ${getNextThemeName()} Theme`}
            title={`Switch to ${getNextThemeName()} Theme`}
          >
            <PaintBrushIcon className="w-5 h-5 sm:mr-1" />
            <span className="hidden sm:inline">Theme</span>
          </button>
          <h1 className={`text-xl sm:text-2xl font-semibold ${appNameTextClass}`}>{appName}</h1>
        </div>
      </div>
    </header>
  );
};
