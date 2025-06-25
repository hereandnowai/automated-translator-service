
import React, { useState, useCallback } from 'react';
import { TextAreaInput } from './TextAreaInput';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorDisplay } from './ErrorDisplay';
import { askAssistant } from '../services/geminiService';
import { SparklesIcon } from './Icons';
import { AppTheme } from '../types';

interface AiAssistantViewProps {
  isRecording: boolean;
  onMicClick: () => void;
  micButtonDisabled: boolean;
  currentAssistantQuery: string;
  onAssistantQueryChange: (value: string) => void;
  apiKeyMissing: boolean; 
  theme: AppTheme;
  askButtonClass: string;
}

export const AiAssistantView: React.FC<AiAssistantViewProps> = ({
  isRecording,
  onMicClick,
  micButtonDisabled,
  currentAssistantQuery,
  onAssistantQueryChange,
  apiKeyMissing,
  theme,
  askButtonClass,
}) => {
  const [assistantResponse, setAssistantResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAskAssistant = useCallback(async () => {
    if (apiKeyMissing) {
      setError('AI Assistant is unavailable due to a missing API key configuration.');
      return;
    }
    if (!currentAssistantQuery.trim()) {
      setError('Query cannot be empty.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAssistantResponse('');

    try {
      const result = await askAssistant(currentAssistantQuery);
      setAssistantResponse(result);
    } catch (err) {
      console.error('AI Assistant error:', err);
      if (err instanceof Error) {
        setError(`Assistant failed: ${err.message}.`);
      } else {
        setError('An unknown error occurred with the AI assistant.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [currentAssistantQuery, apiKeyMissing]);

  if (apiKeyMissing) {
    return (
        <ErrorDisplay message="AI Assistant functionality is disabled because the API_KEY is not configured. Please contact support or check your environment configuration." theme={theme} />
    );
  }

  let responseCardBaseClass = "mt-8 p-6 shadow-xl rounded-lg";
  let responseCardThemeClass = "";
  let responseTitleClass = "text-xl font-semibold mb-3";
  let responseTextClass = "whitespace-pre-wrap";
  let spinnerColorClass = "";

  switch (theme) {
    case 'light':
      responseCardThemeClass = 'bg-gray-50 border border-gray-200';
      responseTitleClass += ' text-yellow-600';
      responseTextClass += ' text-slate-800';
      spinnerColorClass = 'text-slate-800';
      break;
    case 'dark':
      responseCardThemeClass = 'bg-gray-800 border border-gray-700';
      responseTitleClass += ' text-yellow-400';
      responseTextClass += ' text-slate-100';
      spinnerColorClass = 'text-slate-100';
      break;
    case 'default':
    default:
      responseCardThemeClass = 'bg-slate-700 border border-slate-600/50';
      responseTitleClass += ' text-yellow-400';
      responseTextClass += ' text-slate-100';
      spinnerColorClass = 'text-slate-100'; // Default spinner color is yellow, but for simple one this might be better.
      break;
  }


  return (
    <div className="space-y-6">
      <TextAreaInput
        id="assistant-query"
        label="Ask the AI Assistant:"
        value={currentAssistantQuery}
        onChange={(e) => onAssistantQueryChange(e.target.value)}
        placeholder="Type your question or request here..."
        rows={4}
        disabled={isLoading || apiKeyMissing}
        showMicButton={true}
        onMicClick={onMicClick}
        isRecording={isRecording}
        micButtonDisabled={micButtonDisabled || isLoading || apiKeyMissing}
        theme={theme}
      />

      <div className="text-center">
        <button
          onClick={handleAskAssistant}
          disabled={isLoading || !currentAssistantQuery.trim() || apiKeyMissing}
          className={`w-full md:w-auto px-8 py-3 font-bold rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-opacity-75 transition-transform transform hover:scale-105 duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ${askButtonClass}`}
        >
          {isLoading ? (
            <>
              <LoadingSpinner simple={true} className={`w-5 h-5 mr-2 ${theme === 'light' ? 'text-slate-800' : 'text-slate-100'}`} />
              Thinking...
            </>
          ) : (
            <>
              <SparklesIcon className="w-5 h-5 mr-2"/>
              Ask Assistant
            </>
          )}
        </button>
      </div>

      {error && <ErrorDisplay message={error} theme={theme} />}

      {isLoading && !assistantResponse && (
        <div className="mt-6 flex justify-center">
          <LoadingSpinner theme={theme} />
        </div>
      )}

      {assistantResponse && !isLoading && (
        <div className={`${responseCardBaseClass} ${responseCardThemeClass}`}>
          <h3 className={responseTitleClass}>Assistant's Response:</h3>
          <p className={responseTextClass}>{assistantResponse}</p>
        </div>
      )}
    </div>
  );
};