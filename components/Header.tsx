import React, { useState, useEffect } from 'react';
import { Facebook, Youtube, Twitter, Instagram } from 'lucide-react';
import { LIVE_TEXT, LOGIN_TEXT, LOGOUT_TEXT } from '../constants.ts';
import { getExactNepaliDate } from '../utils/nepaliDate.ts';

interface HeaderProps {
  user: any | null;
  onLoginClick: () => void;
  onLogout: () => void;
  logoUrl?: string | null;
  adsenseCode?: string;
  headerAdImage?: string | null;
  headerAdType?: 'code' | 'image';
  siteTitle: string; 
  siteSlogan: string; 
  facebookLink: string;
  twitterLink: string;
  youtubeLink: string;
  instagramLink: string;
  isSettingsLoaded: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  user, onLoginClick, onLogout, logoUrl, adsenseCode, headerAdImage, headerAdType, siteTitle, siteSlogan,
  facebookLink, twitterLink, youtubeLink, instagramLink, isSettingsLoaded 
}) => {
  const [nepaliDate, setNepaliDate] = useState(getExactNepaliDate());

  // Update date every minute to keep the time precise
  useEffect(() => {
    const timer = setInterval(() => {
      setNepaliDate(getExactNepaliDate());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const getSafeUrl = (url: string) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `https://${url}`;
  };

  return (
    <header className="bg-white shadow-sm z-30">
      <div className="container mx-auto px-4 py-2">
        <div className="flex flex-wrap items-center justify-between text-[10px] md:text-sm text-gray-600 pb-2 border-b border-gray-200">
          <div className="flex items-center space-x-2 overflow-hidden mb-2 sm:mb-0 w-full sm:w-auto">
            <span className="bg-red-600 text-white px-1.5 py-0.5 md:py-1 rounded-sm font-bold text-[9px] md:text-xs animate-pulse shrink-0">{LIVE_TEXT}</span>
            <span className="font-bold text-gray-800 whitespace-nowrap truncate">{nepaliDate}</span>
          </div>
          
          <div className="flex items-center space-x-4 mb-2 sm:mb-0">
            <span className="text-xs font-bold text-gray-400 uppercase">हामीलाई पछ्याउनुहोस्:</span>
            <div className="flex space-x-3">
              {facebookLink && (
                <a href={getSafeUrl(facebookLink)} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 transition-colors">
                  <Facebook className="w-4 h-4 md:w-5 md:h-5" />
                </a>
              )}
              {twitterLink && (
                <a href={getSafeUrl(twitterLink)} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-sky-500 transition-colors">
                  <Twitter className="w-4 h-4 md:w-5 md:h-5" />
                </a>
              )}
              {youtubeLink && (
                <a href={getSafeUrl(youtubeLink)} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-red-600 transition-colors">
                  <Youtube className="w-4 h-4 md:w-5 md:h-5" />
                </a>
              )}
              {instagramLink && (
                <a href={getSafeUrl(instagramLink)} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-pink-600 transition-colors">
                  <Instagram className="w-4 h-4 md:w-5 md:h-5" />
                </a>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4 shrink-0 w-full sm:w-auto justify-end">
            {user ? (
              <div className="flex items-center space-x-2 md:space-x-3">
                <div className="text-right hidden sm:block">
                  <p className="font-bold text-gray-900 leading-none text-xs md:text-sm">{user.name}</p>
                  <p className="text-[8px] md:text-[10px] text-red-600 font-bold uppercase">{user.role}</p>
                </div>
                <button onClick={onLogout} className="bg-gray-200 text-gray-700 px-2 py-0.5 md:px-3 md:py-1 rounded-sm font-bold text-xs">{LOGOUT_TEXT}</button>
              </div>
            ) : (
              <button onClick={onLoginClick} className="bg-blue-700 text-white px-2 py-0.5 md:px-3 md:py-1 rounded-sm font-bold text-xs">{LOGIN_TEXT}</button>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between py-4 md:py-6 gap-4">
          <div className="flex items-center w-full lg:w-auto">
            <div className="w-full h-16 sm:h-24 md:h-32 flex items-center justify-start">
              {!isSettingsLoaded ? (
                <div className="flex items-center space-x-3 w-48 animate-pulse">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 bg-gray-200 rounded-full shrink-0"></div>
                    <div className="space-y-2 flex-grow"><div className="h-6 bg-gray-200 rounded w-3/4"></div></div>
                </div>
              ) : logoUrl ? (
                <img src={logoUrl} alt={siteTitle} className="max-w-full h-full object-contain" />
              ) : (
                <div className="flex items-center">
                   <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center shadow-lg shrink-0">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-16 md:h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                  </div>
                  <div className="ml-3 md:ml-4">
                    <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-gray-900 italic tracking-tighter leading-none">{siteTitle}</h1>
                    <p className="text-[10px] sm:text-xs md:text-sm text-gray-500 font-bold tracking-widest uppercase mt-1">{siteSlogan}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="w-full lg:w-auto flex justify-center">
             {headerAdType === 'image' && headerAdImage ? (
                <div className="w-full max-w-full lg:max-w-5xl h-20 md:h-28 rounded-lg overflow-hidden border border-gray-100 shadow-sm bg-white">
                   <img src={headerAdImage} alt="Advertisement" className="w-full h-full object-contain" />
                </div>
             ) : (
                adsenseCode ? (
                  <div className="w-full max-w-full lg:w-[970px] h-20 md:h-24 overflow-hidden flex items-center justify-center" dangerouslySetInnerHTML={{ __html: adsenseCode }} />
               ) : (
                  <div className="w-full max-w-full lg:w-[728px] xl:w-[970px] h-20 md:h-24 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 text-[10px] md:text-xs border border-dashed border-gray-300">क्षेत्र विज्ञापनको लागि सुरक्षित छ (९७०x९०)</div>
               )
             )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;