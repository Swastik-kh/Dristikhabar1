import React, { useState, useEffect } from 'react';
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
            <div className="flex space-x-2">
              {facebookLink && (
                <a href={getSafeUrl(facebookLink)} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
              )}
              {youtubeLink && (
                <a href={getSafeUrl(youtubeLink)} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-red-600 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.018 3.018 0 0 0-2.122-2.136c-1.547-.417-7.734-.417-7.734-.417H9.358s-6.187 0-7.734.417a3.018 3.018 0 0 0-2.122 2.136C-.417 7.734-.417 12 0 12c-.417 4.266 0 7.734.417 7.734a3.018 3.018 0 0 0 2.122 2.136c1.547.417 7.734.417 7.734.417h6.284s6.187 0 7.734-.417a3.018 3.018 0 0 0 2.122-2.136C24 16.266 24 12 23.498 12c0-4.266 0-7.734-.417-5.814zM9.993 15.341V8.659L15.656 12l-5.663 3.341z"/></svg>
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