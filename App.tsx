
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LanguageSelector } from './components/LanguageSelector';
import { TextAreaInput } from './components/TextAreaInput';
import { TranslationCard } from './components/TranslationCard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorDisplay } from './components/ErrorDisplay';
import { AiAssistantView } from './components/AiAssistantView';
import { Homepage } from './components/Homepage';
import { SettingsView } from './components/SettingsView';
import { translateText } from './services/geminiService';
import { TranslationResponse, AppMode, RecordingFor, AppTheme } from './types';
import { SUPPORTED_LANGUAGES, COMPANY_NAME, COMPANY_LOGO_URL, COMPANY_TITLE_IMAGE_URL, THEME_STORAGE_KEY } from './constants';
import { SparklesIcon, ArrowPathIcon, LanguageIcon, ChatBubbleLeftRightIcon, ExclamationTriangleIcon, CogIcon } from './components/Icons';

const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

const APP_TITLE_BASE = "HEREANDNOW AI";

const getInitialShowHomepage = (): boolean => {
  if (typeof window !== 'undefined') {
    return window.location.hash !== '#main';
  }
  return true; 
};

const updateDocumentTitle = (isHomepage: boolean, appMode?: AppMode) => {
  if (typeof document !== 'undefined') {
    let title = APP_TITLE_BASE;
    if (isHomepage) {
      title += " | Home";
    } else {
      title += " | Services Suite";
      if (appMode === 'translator') title += " - Translator";
      else if (appMode === 'assistant') title += " - AI Assistant";
      else if (appMode === 'settings') title += " - Settings";
    }
    document.title = title;
  }
};

const getApiKeySafely = (): string | undefined => {
  if (typeof process !== 'undefined' && process.env) {
    return process.env.API_KEY;
  }
  return undefined;
};

const safeHistoryUpdate = (
  method: 'pushState' | 'replaceState',
  state: any,
  url?: string | null
) => {
  try {
    history[method](state, '', url);
  } catch (e) {
    if (e instanceof Error) {
        console.warn(`Could not execute history.${method} with URL "${url}". App navigation will rely on internal state. Error: ${e.message}`);
    } else {
        console.warn(`Could not execute history.${method} with URL "${url}". App navigation will rely on internal state. Unknown error.`);
    }
  }
};


const App: React.FC = () => {
  const [apiKeyMissingError, setApiKeyMissingError] = useState<string | null>(null);
  
  const [showHomepage, setShowHomepage] = useState<boolean>(getInitialShowHomepage());
  const [appMode, setAppMode] = useState<AppMode>('translator');
  const [theme, setTheme] = useState<AppTheme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem(THEME_STORAGE_KEY) as AppTheme) || 'default';
    }
    return 'default';
  });
  
  const [sourceText, setSourceText] = useState<string>('');
  const [targetLanguage, setTargetLanguage] = useState<string>(SUPPORTED_LANGUAGES[0]?.code || 'es');
  const [translationResult, setTranslationResult] = useState<TranslationResponse | null>(null);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [translatorError, setTranslatorError] = useState<string | null>(null);

  const [assistantQuery, setAssistantQuery] = useState<string>('');

  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingFor, setRecordingFor] = useState<RecordingFor>(null);
  const [micError, setMicError] = useState<string | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const recordingForRef = useRef<RecordingFor>(null);

  useEffect(() => {
    recordingForRef.current = recordingFor;
  }, [recordingFor]);

  useEffect(() => {
    const apiKey = getApiKeySafely();
    if (!apiKey) {
      const errorMsg = "CRITICAL: API_KEY environment variable is not set or process.env is not available. The application requires this key to function. Please ensure it is configured in your environment.";
      console.error(errorMsg);
      setApiKeyMissingError(errorMsg);
    } else {
      setApiKeyMissingError(null);
    }
  }, []);

  useEffect(() => {
    const currentIsHomepageOnMount = getInitialShowHomepage();
    setShowHomepage(currentIsHomepageOnMount); 
    updateDocumentTitle(currentIsHomepageOnMount, appMode);
    
    const currentAppViewOnMount = currentIsHomepageOnMount ? 'home' : 'main';
    const currentHashOnMount = currentIsHomepageOnMount ? '#home' : '#main';
    
    if (window.location.hash !== currentHashOnMount) {
        safeHistoryUpdate('replaceState', { appView: currentAppViewOnMount }, currentHashOnMount);
    } else if (!history.state || history.state.appView !== currentAppViewOnMount) {
        safeHistoryUpdate('replaceState', { appView: currentAppViewOnMount }, currentHashOnMount);
    }

    const handlePopState = (event: PopStateEvent) => {
      const isHomepageView = (event.state && event.state.appView === 'home') || (!event.state && window.location.hash !== '#main');
      setShowHomepage(isHomepageView);
      updateDocumentTitle(isHomepageView, appMode);
      
      const expectedAppView = isHomepageView ? 'home' : 'main';
      const expectedHash = isHomepageView ? '#home' : '#main';

      if (!event.state || event.state.appView !== expectedAppView || window.location.hash !== expectedHash) {
        safeHistoryUpdate('replaceState', { appView: expectedAppView }, expectedHash);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [appMode]); // Add appMode to dependencies to update title correctly when mode changes

  useEffect(() => {
    updateDocumentTitle(showHomepage, appMode);
  }, [showHomepage, appMode]);

  const handleToggleTheme = () => {
    let newTheme: AppTheme;
    if (theme === 'default') {
      newTheme = 'light';
    } else if (theme === 'light') {
      newTheme = 'dark';
    } else {
      newTheme = 'default';
    }
    setTheme(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    }
  };
  
  const handleResetTheme = () => {
    setTheme('default');
    if (typeof window !== 'undefined') {
      localStorage.removeItem(THEME_STORAGE_KEY);
    }
  };

  const handleSpeechResult = useCallback((event: any) => {
    let interimTranscript = '';
    let finalTranscript = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
      } else {
        interimTranscript += event.results[i][0].transcript;
      }
    }
    const currentTranscript = finalTranscript || interimTranscript;

    if (recordingForRef.current === 'translator') {
      setSourceText(currentTranscript);
    } else if (recordingForRef.current === 'assistant') {
      setAssistantQuery(currentTranscript);
    }
  }, [setSourceText, setAssistantQuery]);

  const handleSpeechError = useCallback((event: any) => {
    console.error('Speech recognition error:', event.error, event);
    setMicError(`Speech recognition error: ${event.error}. Please ensure microphone access is granted.`);
    setIsRecording(false);
  }, [setMicError, setIsRecording]);

  const handleSpeechEnd = useCallback(() => {
    setIsRecording(false);
  }, [setIsRecording]);

  useEffect(() => {
    if (apiKeyMissingError) {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current = null;
      }
      return; 
    }

    if (!SpeechRecognitionAPI) {
      setMicError("Speech recognition is not supported in your browser.");
      return;
    }

    try {
      const recognitionInstance = new SpeechRecognitionAPI();
      recognitionInstance.continuous = false; 
      recognitionInstance.interimResults = true;

      recognitionInstance.onresult = handleSpeechResult;
      recognitionInstance.onerror = handleSpeechError;
      recognitionInstance.onend = handleSpeechEnd;
      
      recognitionRef.current = recognitionInstance;
    } catch (e) {
      console.error("Failed to initialize SpeechRecognition:", e);
      setMicError("Speech recognition could not be initialized. Your browser might have restrictions or the API is unavailable.");
      if (recognitionRef.current) {
          recognitionRef.current = null;
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current = null;
      }
    };
  }, [apiKeyMissingError, handleSpeechResult, handleSpeechError, handleSpeechEnd, setMicError]);


  const handleMicClick = useCallback((inputType: 'translator' | 'assistant') => {
    if (apiKeyMissingError) {
      setMicError("Cannot start microphone: API Key is missing.");
      return;
    }
    if (!recognitionRef.current) {
      setMicError("Speech recognition is not initialized. Please refresh or check browser permissions.");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      setMicError(null); 
      setRecordingFor(inputType);
      try {
        recognitionRef.current.lang = navigator.language || 'en-US'; 
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (e) {
        console.error("Error starting recognition: ", e);
        setMicError("Could not start voice input. Check microphone permissions and browser support. You might need to grant access.");
        setIsRecording(false);
      }
    }
  }, [isRecording, apiKeyMissingError, setMicError, setRecordingFor, setIsRecording]);


  const handleTranslate = useCallback(async () => {
    if (apiKeyMissingError) {
      setTranslatorError("Translation service unavailable: API Key is missing.");
      return;
    }
    if (!sourceText.trim()) {
      setTranslatorError('Source text cannot be empty.');
      return;
    }
    
    setIsTranslating(true);
    setTranslatorError(null);
    setTranslationResult(null);

    try {
      const result = await translateText(sourceText, targetLanguage);
      setTranslationResult(result);
    } catch (err) {
      console.error('Translation error:', err);
      if (err instanceof Error) {
        setTranslatorError(`Translation failed: ${err.message}. Ensure API_KEY is valid and the service is reachable.`);
      } else {
        setTranslatorError('An unknown error occurred during translation.');
      }
    } finally {
      setIsTranslating(false);
    }
  }, [sourceText, targetLanguage, apiKeyMissingError]);

  const handleClearTranslatorText = useCallback(() => {
    setSourceText('');
    setTranslationResult(null);
    setTranslatorError(null);
  }, []);

  const handleEnterApp = (initialMode?: AppMode) => {
    if (apiKeyMissingError && !showHomepage) return; 
    setShowHomepage(false);
    if (initialMode) {
      setAppMode(initialMode);
      updateDocumentTitle(false, initialMode);
    } else {
      updateDocumentTitle(false, appMode); // Use current appMode if no initialMode is specified
    }
    safeHistoryUpdate('pushState', { appView: 'main' }, '#main');
  };

  const handleGoHome = () => {
    setShowHomepage(true);
    updateDocumentTitle(true);
    safeHistoryUpdate('pushState', { appView: 'home' }, '#home');
  };

  const getAppRootClasses = () => {
    switch (theme) {
      case 'light':
        return 'bg-white text-slate-900';
      case 'dark':
        return 'bg-black text-slate-100';
      case 'default':
      default:
        return 'bg-slate-900 text-slate-100';
    }
  };

  if (apiKeyMissingError && !showHomepage) {
     const errorContainerClasses = theme === 'light' ? 'bg-white text-red-600' : theme === 'dark' ? 'bg-black text-red-400' : 'bg-slate-900 text-red-400';
     const errorMessageClasses = theme === 'light' ? 'bg-gray-100 text-yellow-700' : theme === 'dark' ? 'bg-gray-800 text-yellow-300' : 'bg-slate-800 text-yellow-300';
     const buttonClasses = theme === 'light' ? 'bg-teal-500 hover:bg-teal-600 text-white' : 'bg-teal-600 hover:bg-teal-500 text-white';


    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-8 text-center ${errorContainerClasses}`}>
        <ExclamationTriangleIcon className="w-20 h-20 mb-6 text-red-500" />
        <h1 className="text-4xl font-bold mb-4">Application Error</h1>
        <p className="text-xl mb-3">A critical configuration is missing:</p>
        <p className={`text-lg p-4 rounded-md font-mono max-w-2xl w-full break-words ${errorMessageClasses}`}>{apiKeyMissingError}</p>
        <p className={`text-md mt-6 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
          Please ensure the <code>API_KEY</code> environment variable is correctly set and then reload the application. Some features might be available on the homepage.
        </p>
         <button onClick={handleGoHome} className={`mt-8 px-6 py-2 font-semibold rounded-lg ${buttonClasses}`}>Go to Homepage</button>
      </div>
    );
  }
  
  if (showHomepage) {
    return <Homepage onEnterApp={handleEnterApp} currentTheme={theme} onToggleTheme={handleToggleTheme} />;
  }

  const commonLoading = isTranslating || (isRecording && recordingFor === (appMode === 'translator' ? 'translator' : 'assistant'));
  
  const mainContentBaseClass = "shadow-2xl rounded-lg p-6 md:p-8 space-y-6 transform transition-all duration-500 hover:scale-[1.005]";
  let mainContentThemeClass = '';
  let tabBorderClass = '';
  let activeTabClass = '';
  let inactiveTabClass = '';
  let clearButtonClass = '';


  switch (theme) {
    case 'light':
      mainContentThemeClass = 'bg-gray-50 border border-gray-200';
      tabBorderClass = 'border-gray-300';
      activeTabClass = 'border-b-2 border-yellow-500 text-yellow-600';
      inactiveTabClass = 'text-slate-500 hover:text-teal-600';
      clearButtonClass = 'bg-slate-200 hover:bg-slate-300 text-slate-700 focus:ring-yellow-500';
      break;
    case 'dark':
      mainContentThemeClass = 'bg-gray-900 border border-gray-700';
      tabBorderClass = 'border-gray-700';
      activeTabClass = 'border-b-2 border-yellow-400 text-yellow-400';
      inactiveTabClass = 'text-slate-400 hover:text-teal-300';
      clearButtonClass = 'bg-slate-700 hover:bg-slate-600 text-white focus:ring-yellow-400';
      break;
    case 'default':
    default:
      mainContentThemeClass = 'bg-slate-800 border border-slate-700/50';
      tabBorderClass = 'border-slate-700';
      activeTabClass = 'border-b-2 border-yellow-400 text-yellow-400';
      inactiveTabClass = 'text-slate-400 hover:text-teal-300';
      clearButtonClass = 'bg-slate-600 hover:bg-slate-500 text-white focus:ring-yellow-400';
      break;
  }
  
  let primaryButtonClass = ''; // For Translate button
  let secondaryButtonClass = ''; // For Ask Assistant button

  switch (theme) {
      case 'light':
          primaryButtonClass = 'bg-teal-500 hover:bg-teal-600 text-white focus:ring-yellow-500';
          secondaryButtonClass = 'bg-yellow-400 hover:bg-yellow-500 text-slate-900 focus:ring-teal-500';
          break;
      case 'dark':
      case 'default':
      default:
          primaryButtonClass = 'bg-teal-600 hover:bg-teal-500 text-white focus:ring-yellow-400';
          secondaryButtonClass = 'bg-yellow-500 hover:bg-yellow-400 text-slate-900 focus:ring-teal-400';
          break;
  }


  return (
    <div className={`min-h-screen flex flex-col ${getAppRootClasses()}`}>
      <Header 
        logoUrl={COMPANY_LOGO_URL} 
        titleImageUrl={COMPANY_TITLE_IMAGE_URL} 
        appName="AI Services Suite"
        onGoHome={handleGoHome} 
        showBackButton={!showHomepage}
        currentTheme={theme}
        onToggleTheme={handleToggleTheme}
      />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl w-full">
        <div className={`mb-6 flex border-b ${tabBorderClass}`}>
          <button
            onClick={() => setAppMode('translator')}
            className={`py-3 px-6 font-semibold flex items-center transition-colors duration-150 ease-in-out
                        ${appMode === 'translator' ? activeTabClass : inactiveTabClass}`}
            aria-pressed={appMode === 'translator'}
          >
            <LanguageIcon className="w-5 h-5 mr-2" /> Translator
          </button>
          <button
            onClick={() => setAppMode('assistant')}
            className={`py-3 px-6 font-semibold flex items-center transition-colors duration-150 ease-in-out
                        ${appMode === 'assistant' ? activeTabClass : inactiveTabClass}`}
            aria-pressed={appMode === 'assistant'}
          >
            <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2" /> AI Assistant
          </button>
          <button
            onClick={() => setAppMode('settings')}
            className={`py-3 px-6 font-semibold flex items-center transition-colors duration-150 ease-in-out
                        ${appMode === 'settings' ? activeTabClass : inactiveTabClass}`}
            aria-pressed={appMode === 'settings'}
          >
            <CogIcon className="w-5 h-5 mr-2" /> Settings
          </button>
        </div>

        {micError && <div className="mb-4"><ErrorDisplay message={micError} theme={theme} /></div>}

        <div className={`${mainContentBaseClass} ${mainContentThemeClass}`}>
          {appMode === 'translator' && (
            <>
              <TextAreaInput
                id="source-text"
                label="Enter text to translate:"
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                placeholder="Type or paste text, or use the microphone..."
                disabled={isTranslating || !!apiKeyMissingError}
                showMicButton={!!SpeechRecognitionAPI}
                onMicClick={() => handleMicClick('translator')}
                isRecording={isRecording && recordingFor === 'translator'}
                micButtonDisabled={isTranslating || (isRecording && recordingFor !== 'translator') || !!apiKeyMissingError}
                theme={theme}
              />
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <LanguageSelector
                  id="target-language"
                  label="Translate to:"
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  languages={SUPPORTED_LANGUAGES}
                  disabled={isTranslating || !!apiKeyMissingError}
                  theme={theme}
                />
                <button
                  onClick={handleClearTranslatorText}
                  disabled={commonLoading || !sourceText || !!apiKeyMissingError}
                  className={`px-4 py-2 font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-75 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center self-end sm:self-center ${clearButtonClass}`}
                  title="Clear input text"
                >
                  <ArrowPathIcon className="w-5 h-5 mr-2"/>
                  Clear
                </button>
              </div>
              <div className="text-center">
                <button
                  onClick={handleTranslate}
                  disabled={commonLoading || !sourceText.trim() || !!apiKeyMissingError}
                  className={`w-full md:w-auto px-8 py-3 font-bold rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-opacity-75 transition-transform transform hover:scale-105 duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ${primaryButtonClass}`}
                >
                  {isTranslating ? (
                    <>
                      <LoadingSpinner simple={true} className="w-5 h-5 mr-2" />
                      Translating...
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="w-5 h-5 mr-2"/>
                      Translate
                    </>
                  )}
                </button>
              </div>

              {translatorError && <ErrorDisplay message={translatorError} theme={theme} />}
              
              {isTranslating && !translationResult && (
                 <div className="mt-6 flex justify-center">
                    <LoadingSpinner theme={theme} />
                 </div>
              )}

              {translationResult && !isTranslating && (
                <div className="mt-8">
                  <TranslationCard result={translationResult} theme={theme} />
                </div>
              )}
            </>
          )}

          {appMode === 'assistant' && (
            <AiAssistantView
              isRecording={isRecording && recordingFor === 'assistant'}
              onMicClick={() => handleMicClick('assistant')}
              micButtonDisabled={(isRecording && recordingFor !== 'assistant') || !!apiKeyMissingError}
              currentAssistantQuery={assistantQuery}
              onAssistantQueryChange={setAssistantQuery}
              apiKeyMissing={!!apiKeyMissingError}
              theme={theme}
              askButtonClass={secondaryButtonClass}
            />
          )}
          {appMode === 'settings' && (
             <SettingsView 
                currentTheme={theme}
                onToggleTheme={handleToggleTheme}
                onResetTheme={handleResetTheme}
             />
          )}
        </div>
      </main>
      
      <Footer companyName={COMPANY_NAME} theme={theme} />
    </div>
  );
};

export default App;