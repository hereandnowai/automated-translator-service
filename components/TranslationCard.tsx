
import React, { useCallback, useState } from 'react';
import { TranslationResponse, AppTheme } from '../types';
import { ClipboardDocumentIcon, CheckIcon } from './Icons';

interface TranslationCardProps {
  result: TranslationResponse;
  theme: AppTheme;
}

const DetailItem: React.FC<{ label: string; value: string | React.ReactNode; className?: string, theme: AppTheme }> = ({ label, value, className = '', theme }) => {
  let labelTextClass = '';
  let valueTextClass = 'text-sm sm:mt-0 sm:col-span-2 whitespace-pre-wrap';

  switch (theme) {
    case 'light':
      labelTextClass = 'text-sm font-medium text-teal-700';
      valueTextClass += ' text-slate-700';
      break;
    case 'dark':
      labelTextClass = 'text-sm font-medium text-teal-300';
      valueTextClass += ' text-slate-200';
      break;
    case 'default':
    default:
      labelTextClass = 'text-sm font-medium text-teal-400';
      valueTextClass += ' text-slate-200';
      break;
  }

  return (
    <div className={`py-3 px-1 ${className}`}>
      <dt className={labelTextClass}>{label}</dt>
      <dd className={`mt-1 ${valueTextClass}`}>{value}</dd>
    </div>
  );
};

const ConfidenceBadge: React.FC<{ level: string, theme: AppTheme }> = ({ level, theme }) => {
  let bgColor = '';
  let textColor = '';

  switch (level?.toLowerCase()) {
    case 'high':
      bgColor = theme === 'light' ? 'bg-green-100' : 'bg-green-600';
      textColor = theme === 'light' ? 'text-green-700' : 'text-green-100';
      break;
    case 'medium':
      bgColor = theme === 'light' ? 'bg-yellow-100' : 'bg-yellow-500';
      textColor = theme === 'light' ? 'text-yellow-700' : 'text-yellow-100';
      break;
    case 'low':
      bgColor = theme === 'light' ? 'bg-red-100' : 'bg-red-600';
      textColor = theme === 'light' ? 'text-red-700' : 'text-red-100';
      break;
    default:
      bgColor = theme === 'light' ? 'bg-slate-200' : 'bg-slate-500';
      textColor = theme === 'light' ? 'text-slate-700' : 'text-slate-100';
      break;
  }
  return <span className={`px-3 py-1 text-xs font-semibold rounded-full ${bgColor} ${textColor}`}>{level}</span>;
};


export const TranslationCard: React.FC<TranslationCardProps> = ({ result, theme }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(result.translation).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  }, [result.translation]);

  let cardThemeClass = "shadow-xl rounded-lg overflow-hidden transition-all duration-300 ease-in-out";
  let innerBgThemeClass = "p-3 rounded-md";
  let titleTextClass = "text-2xl font-semibold mb-1";
  let translationTextClass = "whitespace-pre-wrap text-lg min-h-[100px]";
  let copyButtonBgClass = "";
  let borderColorClass = "";

  switch (theme) {
    case 'light':
      cardThemeClass += ' bg-gray-50 border border-gray-200';
      innerBgThemeClass += ' bg-white';
      titleTextClass += ' text-yellow-600';
      translationTextClass += ' text-slate-800';
      copyButtonBgClass = 'bg-teal-500 hover:bg-teal-600 text-white focus:ring-yellow-500';
      borderColorClass = 'border-gray-200';
      break;
    case 'dark':
      cardThemeClass += ' bg-gray-800 border border-gray-700';
      innerBgThemeClass += ' bg-gray-700';
      titleTextClass += ' text-yellow-400';
      translationTextClass += ' text-slate-50';
      copyButtonBgClass = 'bg-teal-600 hover:bg-teal-500 text-white focus:ring-yellow-400';
      borderColorClass = 'border-gray-700';
      break;
    case 'default':
    default:
      cardThemeClass += ' bg-slate-700 border border-slate-600/50';
      innerBgThemeClass += ' bg-slate-600';
      titleTextClass += ' text-yellow-400';
      translationTextClass += ' text-slate-50';
      copyButtonBgClass = 'bg-teal-600 hover:bg-teal-500 text-white focus:ring-yellow-400';
      borderColorClass = 'border-slate-600';
      break;
  }
  
  const altOptionItemBaseClass = "p-2 rounded-md text-sm";


  return (
    <div className={cardThemeClass}>
      <div className="p-6 space-y-5">
        
        <div className={`border-b ${borderColorClass} pb-4`}>
          <h3 className={titleTextClass}>Translation:</h3>
          <div className="relative group">
            <p className={`${translationTextClass} ${innerBgThemeClass}`}>{result.translation || "No translation provided."}</p>
            <button
              onClick={handleCopyToClipboard}
              title={copied ? "Copied!" : "Copy translation"}
              className={`absolute top-2 right-2 p-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:outline-none focus:ring-2 ${copyButtonBgClass}`}
            >
              {copied ? <CheckIcon className="w-5 h-5" /> : <ClipboardDocumentIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
            <DetailItem label="Source Language" value={`${result.sourceLanguage} (${result.detectedSourceLanguageCode?.toUpperCase()})`} theme={theme} />
            <DetailItem label="Target Language" value={result.targetLanguage} theme={theme} />
            <DetailItem label="Confidence Level" value={<ConfidenceBadge level={result.confidenceLevel} theme={theme} />} theme={theme}/>
        </div>
        
        {result.alternativeOptions && result.alternativeOptions.length > 0 && (
           <div className={`border-t ${borderColorClass} pt-4`}>
            <DetailItem 
              label="Alternative Options" 
              value={
                <ul className="list-disc list-inside space-y-1 pl-1">
                  {result.alternativeOptions.map((alt, index) => (
                    <li key={index} className={`${altOptionItemBaseClass} ${innerBgThemeClass} ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>{alt}</li>
                  ))}
                </ul>
              }
              theme={theme} 
            />
          </div>
        )}
        
        <div className={`border-t ${borderColorClass} pt-4`}>
            <DetailItem label="Context Notes" value={result.contextNotes || "No context notes provided."} theme={theme} />
        </div>

      </div>
    </div>
  );
};