
import React from 'react';
import { AppTheme } from '../types';

interface FooterProps {
  companyName: string;
  theme: AppTheme;
}

export const Footer: React.FC<FooterProps> = ({ companyName, theme }) => {
  let footerClasses = "py-6 text-center shadow-top mt-auto";
  let textClasses = "";

  switch (theme) {
    case 'light':
      footerClasses += " bg-gray-100";
      textClasses = "text-slate-500";
      break;
    case 'dark':
      footerClasses += " bg-black";
      textClasses = "text-slate-400";
      break;
    case 'default':
    default:
      footerClasses += " bg-slate-800";
      textClasses = "text-slate-400";
      break;
  }

  return (
    <footer className={footerClasses}>
      <div className={`container mx-auto px-4 ${textClasses}`}>
        <p>&copy; {new Date().getFullYear()} {companyName}. All rights reserved.</p>
        <p className="text-xs mt-1">Powered by Advanced AI Technology</p>
      </div>
    </footer>
  );
};