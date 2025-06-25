
import React from 'react';
import { AppTheme } from '../types';
import { COMPANY_NAME, APP_VERSION, FEEDBACK_EMAIL, SUPPORTED_LANGUAGES } from '../constants';
import { InformationCircleIcon, PaintBrushIcon, ArrowUturnLeftIcon, DocumentTextIcon, ChatBubbleOvalLeftEllipsisIcon, LanguageIcon } from './Icons';

interface SettingsViewProps {
  currentTheme: AppTheme;
  onToggleTheme: () => void;
  onResetTheme: () => void;
}

const SettingsCard: React.FC<{ title: string; icon?: React.ReactNode; children: React.ReactNode; theme: AppTheme; className?: string }> = ({ title, icon, children, theme, className }) => {
  let cardClasses = "rounded-lg shadow-lg p-6 transition-all duration-300";
  let titleClasses = "text-xl font-semibold mb-4 flex items-center";

  switch (theme) {
    case 'light':
      cardClasses += " bg-white border border-gray-200";
      titleClasses += " text-teal-700";
      break;
    case 'dark':
      cardClasses += " bg-gray-800 border border-gray-700";
      titleClasses += " text-teal-300";
      break;
    case 'default':
    default:
      cardClasses += " bg-slate-700 border border-slate-600";
      titleClasses += " text-teal-400";
      break;
  }

  return (
    <div className={`${cardClasses} ${className || ''}`}>
      <h3 className={titleClasses}>
        {icon && <span className="mr-3">{icon}</span>}
        {title}
      </h3>
      <div className={`space-y-4 ${theme === 'light' ? 'text-slate-600' : 'text-slate-300'}`}>
        {children}
      </div>
    </div>
  );
};


export const SettingsView: React.FC<SettingsViewProps> = ({ currentTheme, onToggleTheme, onResetTheme }) => {
  const getNextThemeName = () => {
    if (currentTheme === 'default') return 'Light Theme';
    if (currentTheme === 'light') return 'Dark Theme';
    return 'Default Blue Theme';
  };

  const getCurrentThemeName = () => {
    if (currentTheme === 'default') return 'Default Blue';
    if (currentTheme === 'light') return 'Light';
    return 'Dark';
  };
  
  let buttonBaseClass = "px-5 py-2.5 font-medium rounded-lg text-sm focus:outline-none focus:ring-4 transition-colors duration-150 flex items-center justify-center shadow-md hover:shadow-lg";
  let primaryButtonThemeClass = "";
  let secondaryButtonThemeClass = "";

  switch (currentTheme) {
    case 'light':
      primaryButtonThemeClass = "bg-teal-500 hover:bg-teal-600 text-white focus:ring-teal-300";
      secondaryButtonThemeClass = "bg-slate-200 hover:bg-slate-300 text-slate-700 focus:ring-slate-400";
      break;
    case 'dark':
      primaryButtonThemeClass = "bg-teal-600 hover:bg-teal-500 text-white focus:ring-teal-800";
      secondaryButtonThemeClass = "bg-slate-700 hover:bg-slate-600 text-slate-100 focus:ring-slate-500";
      break;
    case 'default':
    default:
      primaryButtonThemeClass = "bg-teal-600 hover:bg-teal-500 text-white focus:ring-yellow-400";
      secondaryButtonThemeClass = "bg-slate-600 hover:bg-slate-500 text-slate-100 focus:ring-slate-400";
      break;
  }
  
  const linkClasses = `hover:underline ${currentTheme === 'light' ? 'text-teal-600 hover:text-teal-700' : 'text-teal-400 hover:text-teal-300'}`;


  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <h2 className={`text-3xl font-bold text-center mb-10 ${currentTheme === 'light' ? 'text-slate-800' : 'text-slate-100'}`}>
        Application Settings
      </h2>

      <SettingsCard title="About This Application" icon={<InformationCircleIcon className="w-6 h-6" />} theme={currentTheme}>
        <p><strong className={currentTheme === 'light' ? 'text-slate-700' : 'text-slate-200'}>Application Name:</strong> {COMPANY_NAME} - AI Services Suite</p>
        <p><strong className={currentTheme === 'light' ? 'text-slate-700' : 'text-slate-200'}>Version:</strong> {APP_VERSION}</p>
        <p>
          This suite offers advanced AI-powered translation and an intelligent assistant to enhance your productivity and communication.
        </p>
      </SettingsCard>

      <SettingsCard title="Appearance" icon={<PaintBrushIcon className="w-6 h-6" />} theme={currentTheme}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p>Current Theme: <strong className={currentTheme === 'light' ? 'text-slate-700' : 'text-slate-200'}>{getCurrentThemeName()}</strong></p>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={onToggleTheme}
              className={`${buttonBaseClass} ${primaryButtonThemeClass}`}
              title={`Switch to ${getNextThemeName()}`}
            >
              <PaintBrushIcon className="w-5 h-5 mr-2" /> Cycle to {getNextThemeName()}
            </button>
            <button
              onClick={onResetTheme}
              className={`${buttonBaseClass} ${secondaryButtonThemeClass}`}
              title="Reset theme to default"
            >
              <ArrowUturnLeftIcon className="w-5 h-5 mr-2" /> Reset Theme
            </button>
          </div>
        </div>
      </SettingsCard>
      
      <SettingsCard title="Language Support" icon={<LanguageIcon className="w-6 h-6" />} theme={currentTheme}>
        <p>
          Our translation service supports a wide range of languages, including major world languages and several regional ones. 
          Currently, we offer translation for {SUPPORTED_LANGUAGES.length} language pairs.
        </p>
        <p>The AI Assistant can understand and respond in multiple languages, primarily English.</p>
      </SettingsCard>

      <SettingsCard title="Resources & Legal" icon={<DocumentTextIcon className="w-6 h-6" />} theme={currentTheme}>
        <ul className="space-y-2 list-inside">
          <li><a href="#" className={linkClasses}>Terms of Service</a> (Placeholder)</li>
          <li><a href="#" className={linkClasses}>Privacy Policy</a> (Placeholder)</li>
          <li>
            <a href={`mailto:${FEEDBACK_EMAIL}`} className={`${linkClasses} flex items-center`}>
              <ChatBubbleOvalLeftEllipsisIcon className="w-5 h-5 mr-2" /> Provide Feedback
            </a>
          </li>
        </ul>
      </SettingsCard>

    </div>
  );
};
