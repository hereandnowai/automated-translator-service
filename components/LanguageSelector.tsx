
import React from 'react';
import { Language, AppTheme } from '../types';

interface LanguageSelectorProps {
  id: string;
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  languages: Language[];
  disabled?: boolean;
  theme: AppTheme;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ id, label, value, onChange, languages, disabled, theme }) => {
  let selectBaseClass = "w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:border-transparent transition duration-150 ease-in-out disabled:opacity-50";
  let selectThemeClass = "";
  let labelClass = "block text-sm font-medium mb-1";
  let optionClass = "";


  switch (theme) {
    case 'light':
      selectThemeClass = 'bg-gray-50 border-gray-300 text-slate-800 focus:ring-yellow-500 placeholder-slate-400';
      labelClass += ' text-teal-700';
      optionClass = 'bg-white text-slate-900';
      break;
    case 'dark':
      selectThemeClass = 'bg-gray-800 border-gray-700 text-slate-100 focus:ring-yellow-400 placeholder-slate-500';
      labelClass += ' text-teal-300';
      optionClass = 'bg-gray-800 text-slate-100';
      break;
    case 'default':
    default:
      selectThemeClass = 'bg-slate-700 border-slate-600 text-slate-100 focus:ring-yellow-400 placeholder-slate-400';
      labelClass += ' text-teal-300';
      optionClass = 'bg-slate-700 text-slate-100'; // Or bg-slate-800 if preferred
      break;
  }
  
  return (
    <div className="flex-1">
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`${selectBaseClass} ${selectThemeClass}`}
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code} className={optionClass}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};