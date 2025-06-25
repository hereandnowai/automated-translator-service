
import React from 'react';
import { COMPANY_LOGO_URL, COMPANY_NAME } from '../constants';
import { AppMode, AppTheme } from '../types';
import { ArrowRightIcon, LanguageIcon, ChatBubbleLeftRightIcon, CogIcon, MicrophoneIcon, SparklesIcon, PaintBrushIcon } from './Icons';

interface HomepageProps {
  onEnterApp: (initialMode?: AppMode) => void;
  currentTheme: AppTheme;
  onToggleTheme: () => void;
}

export const Homepage: React.FC<HomepageProps> = ({ onEnterApp, currentTheme, onToggleTheme }) => {
  const getNextThemeName = () => {
    if (currentTheme === 'default') return 'Light Theme';
    if (currentTheme === 'light') return 'Dark Theme';
    return 'Default Blue Theme';
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100 p-6 fade-in-content overflow-y-auto">
      <div className="text-center max-w-4xl mx-auto w-full py-10">
        <div className="slide-up-content" style={{ animationDelay: '0.1s' }}>
          <img 
            src={COMPANY_LOGO_URL} 
            alt={`${COMPANY_NAME} Logo`} 
            className="w-28 h-28 md:w-36 md:h-36 mx-auto mb-6 rounded-full shadow-2xl border-2 border-yellow-400 hover:scale-105 transition-transform duration-300" 
          />
        </div>
        <h1 
            className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-yellow-400 mb-4 slide-up-content"
            style={{ animationDelay: '0.2s', textShadow: '0 2px 8px rgba(250, 204, 21, 0.4)' }} /* yellow-400 equivalent */
        >
          {COMPANY_NAME}
        </h1>
        <p 
            className="text-3xl sm:text-4xl text-teal-300 mb-10 slide-up-content"
            style={{ animationDelay: '0.3s' }}
        >
          AI Services Suite
        </p>
        
        <p 
            className="text-slate-200 text-lg sm:text-xl mb-12 leading-relaxed max-w-2xl mx-auto slide-up-content" 
            style={{ animationDelay: '0.4s' }}
        >
            Step into the future of digital interaction with HEREANDNOW AI. Explore our advanced Translator and intelligent AI Assistant, designed to empower your communication and creativity.
        </p>

        <div 
            className="grid md:grid-cols-2 gap-8 mb-12 slide-up-content"
            style={{ animationDelay: '0.5s' }}
        >
            <div className="bg-slate-800/70 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-slate-700 hover:border-teal-500/70 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-teal-500/30">
                <h3 className="text-2xl font-semibold text-teal-400 mb-3 flex items-center">
                    <LanguageIcon className="w-7 h-7 mr-3 text-yellow-400 flex-shrink-0" /> Automated Translator
                </h3>
                <p className="text-slate-300 text-sm">
                    Break language barriers instantly. Our AI delivers nuanced translations across diverse languages, ensuring your message is always understood.
                </p>
            </div>
            <div className="bg-slate-800/70 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-slate-700 hover:border-teal-500/70 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-teal-500/30">
                <h3 className="text-2xl font-semibold text-teal-400 mb-3 flex items-center">
                    <ChatBubbleLeftRightIcon className="w-7 h-7 mr-3 text-yellow-400 flex-shrink-0" /> Intelligent AI Assistant
                </h3>
                <p className="text-slate-300 text-sm">
                    Unlock your potential. From complex queries to creative brainstorming, our AI Assistant is your partner in innovation and productivity.
                </p>
            </div>
        </div>

        {/* How to Use Section */}
        <div className="my-16 slide-up-content" style={{ animationDelay: '0.6s' }}>
          <h2 className="text-3xl sm:text-4xl font-semibold text-teal-300 mb-10 text-shadow-md">
            How to Use Our AI Suite
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {/* Step 1 */}
            <div className="bg-slate-800/60 backdrop-blur-sm p-5 rounded-lg shadow-md border border-slate-700/80 hover:border-yellow-400/60 transition-colors duration-300">
              <div className="flex items-center mb-3">
                <div className="bg-yellow-400 text-slate-900 rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg mr-3 flex-shrink-0">1</div>
                <h3 className="text-xl font-medium text-yellow-400">Launch the Suite</h3>
              </div>
              <p className="text-slate-300 text-sm">Click the "Enter Suite" button below to begin your AI journey.</p>
            </div>
            {/* Step 2 */}
            <div className="bg-slate-800/60 backdrop-blur-sm p-5 rounded-lg shadow-md border border-slate-700/80 hover:border-yellow-400/60 transition-colors duration-300">
              <div className="flex items-center mb-3">
                <div className="bg-yellow-400 text-slate-900 rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg mr-3 flex-shrink-0">2</div>
                <h3 className="text-xl font-medium text-yellow-400">Select a Service</h3>
              </div>
              <p className="text-slate-300 text-sm">
                Choose <LanguageIcon className="inline w-4 h-4 mx-1"/>Translator, <ChatBubbleLeftRightIcon className="inline w-4 h-4 mx-1"/>AI Assistant, or 
                from <CogIcon className="inline w-4 h-4 mx-1"/> Settings.
              </p>
            </div>
            {/* Step 3 */}
            <div className="bg-slate-800/60 backdrop-blur-sm p-5 rounded-lg shadow-md border border-slate-700/80 hover:border-yellow-400/60 transition-colors duration-300">
              <div className="flex items-center mb-3">
                <div className="bg-yellow-400 text-slate-900 rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg mr-3 flex-shrink-0">3</div>
                <h3 className="text-xl font-medium text-yellow-400">Provide Your Input</h3>
              </div>
              <p className="text-slate-300 text-sm">
                Type your text or use the <MicrophoneIcon className="inline w-4 h-4 mx-1"/>microphone for voice input.
              </p>
            </div>
            {/* Step 4 */}
            <div className="bg-slate-800/60 backdrop-blur-sm p-5 rounded-lg shadow-md border border-slate-700/80 hover:border-yellow-400/60 transition-colors duration-300">
              <div className="flex items-center mb-3">
                <div className="bg-yellow-400 text-slate-900 rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg mr-3 flex-shrink-0">4</div>
                <h3 className="text-xl font-medium text-yellow-400">Explore & Customize</h3>
              </div>
              <p className="text-slate-300 text-sm">
                Click "Translate" / "Ask" <SparklesIcon className="inline w-4 h-4 mx-1"/>. Change views with <PaintBrushIcon className="inline w-4 h-4 mx-1"/> Theme button.
              </p>
            </div>
          </div>
        </div>


        <div className="slide-up-content mb-10" style={{ animationDelay: '0.7s' }}>
            <button
              onClick={() => onEnterApp()}
              className="pulse-cta group inline-flex items-center justify-center px-10 py-5 bg-teal-600 hover:bg-teal-500 text-white text-xl md:text-2xl font-semibold rounded-lg shadow-xl hover:shadow-yellow-400/50 transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:ring-opacity-75"
              aria-label="Enter the AI Services Suite"
            >
              Enter Suite
              <ArrowRightIcon className="w-6 h-6 ml-3 transition-transform duration-300 ease-in-out group-hover:translate-x-1.5" />
            </button>
        </div>

        {/* Homepage Quick Actions: Theme & Settings */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 slide-up-content" style={{ animationDelay: '0.75s' }}>
            <button
                onClick={onToggleTheme}
                className="group inline-flex items-center justify-center px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 text-md font-medium rounded-lg shadow-md hover:shadow-yellow-500/30 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-75"
                title={`Switch to ${getNextThemeName()}`}
            >
                <PaintBrushIcon className="w-5 h-5 mr-2 text-teal-400 group-hover:text-yellow-400 transition-colors" />
                Cycle Theme ({currentTheme})
            </button>
            <button
                onClick={() => onEnterApp('settings')}
                className="group inline-flex items-center justify-center px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 text-md font-medium rounded-lg shadow-md hover:shadow-yellow-500/30 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-75"
                title="Go to Application Settings"
            >
                <CogIcon className="w-5 h-5 mr-2 text-teal-400 group-hover:text-yellow-400 transition-colors" />
                Go to Settings
            </button>
        </div>


      </div>
       <footer 
        className="text-center text-slate-400 text-sm py-6 slide-up-content"
        style={{ animationDelay: '0.8s' }}
      >
        <p>&copy; {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.</p>
        <p>Discover the Future with {COMPANY_NAME}.</p>
      </footer>
    </div>
  );
};
