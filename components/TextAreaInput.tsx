
import React from 'react';
import { MicrophoneIcon, StopCircleIcon } from './Icons';
import { AppTheme } from '../types';

interface TextAreaInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  showMicButton?: boolean;
  onMicClick?: () => void;
  isRecording?: boolean;
  micButtonDisabled?: boolean;
  theme: AppTheme;
}

export const TextAreaInput: React.FC<TextAreaInputProps> = ({ 
  id, 
  label, 
  value, 
  onChange, 
  placeholder, 
  rows = 6, 
  disabled,
  showMicButton = false,
  onMicClick,
  isRecording = false,
  micButtonDisabled = false,
  theme
}) => {
  let textareaBaseClass = `w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:border-transparent transition duration-150 ease-in-out disabled:opacity-50 resize-y`;
  let textareaThemeClass = "";
  let labelClass = "block text-sm font-medium mb-1";
  let micButtonRecordingClass = "";
  let micButtonDefaultClass = "";

  switch (theme) {
    case 'light':
      textareaThemeClass = 'bg-gray-50 border-gray-300 text-slate-800 focus:ring-yellow-500 placeholder-slate-400';
      labelClass += ' text-teal-700';
      micButtonRecordingClass = 'text-red-500 hover:text-red-600';
      micButtonDefaultClass = 'text-teal-600 hover:text-teal-500';
      break;
    case 'dark':
      textareaThemeClass = 'bg-gray-800 border-gray-700 text-slate-100 focus:ring-yellow-400 placeholder-slate-500';
      labelClass += ' text-teal-300';
      micButtonRecordingClass = 'text-red-400 hover:text-red-300';
      micButtonDefaultClass = 'text-teal-400 hover:text-teal-300';
      break;
    case 'default':
    default:
      textareaThemeClass = 'bg-slate-700 border-slate-600 text-slate-100 focus:ring-yellow-400 placeholder-slate-400';
      labelClass += ' text-teal-300';
      micButtonRecordingClass = 'text-red-400 hover:text-red-300';
      micButtonDefaultClass = 'text-teal-400 hover:text-teal-300';
      break;
  }
  
  const micButtonPaddingClass = showMicButton ? 'pr-12' : '';

  return (
    <div className="relative">
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className={`${textareaBaseClass} ${textareaThemeClass} ${micButtonPaddingClass}`}
      />
      {showMicButton && onMicClick && (
        <button
          type="button"
          onClick={onMicClick}
          disabled={disabled || micButtonDisabled}
          className={`absolute right-2 bottom-3 p-2 rounded-full transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 ${ isRecording ? micButtonRecordingClass + ' focus:ring-red-400' : micButtonDefaultClass + ' focus:ring-yellow-400' } disabled:opacity-50 disabled:cursor-not-allowed`}
          title={isRecording ? "Stop recording" : "Start voice input"}
          aria-label={isRecording ? "Stop voice input" : "Start voice input"}
        >
          {isRecording ? <StopCircleIcon className="w-6 h-6" /> : <MicrophoneIcon className="w-6 h-6" />}
        </button>
      )}
    </div>
  );
};