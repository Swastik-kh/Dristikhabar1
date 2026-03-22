import React, { useState, useEffect } from 'react';
import { CATEGORIES } from '../constants.ts';

interface NavbarProps {
  logoUrl?: string | null;
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  isSettingsLoaded: boolean; // New prop for loading state
  siteTitle: string; // Add siteTitle prop for sticky header
}

const Navbar: React.FC<NavbarProps> = ({ logoUrl, activeCategory, onCategoryChange, isSettingsLoaded, siteTitle }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 180) { // Adjust scroll threshold as needed
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const handleItemClick = (category: string) => {
    onCategoryChange(category);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className={`bg-white border-b border-gray-200 shadow-md sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'py-1' : 'py-2 md:py-3'}`}>
        <div className="container mx-auto px-4 flex items-center justify-between">
          
          <div className="flex items-center">
            {/* Mobile Hamburger Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-gray-700 hover:text-red-600 focus:outline-none"
              aria-label="Open Menu"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
            </button>

            {/* Sticky Mini Logo */}
            <div 
              className={`flex-shrink-0 mr-4 overflow-hidden transition-all duration-500 ease-in-out flex items-center ${
                isScrolled ? 'max-w-[150px] opacity-100 scale-100' : 'max-w-0 opacity-0 scale-90 invisible'
              }`}
            >
              {!isSettingsLoaded ? (
                <div className="flex items-center space-x-2 animate-pulse w-full">
                  <div className="w-7 h-7 md:w-8 md:h-8 bg-gray-200 rounded-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
              ) : logoUrl ? (
                <img src={logoUrl} alt="Logo" className="h-8 md:h-10 w-auto object-contain" />
              ) : (
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 md:w-8 md:h-8 bg-red-600 rounded-full flex items-center justify-center shadow-sm">
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  </div>
                  <span className="font-black text-gray-900 text-base md:text-lg italic whitespace-nowrap">{siteTitle || 'दृष्टि खबर'}</span>
                </div>
              )}
            </div>

            {/* Desktop Menu Items */}
            <div className="hidden lg:flex overflow-x-auto whitespace-nowrap scrollbar-hide">
              <ul className="flex space-x-6 md:space-x-8 lg:space-x-10 text-base md:text-lg font-semibold">
                {CATEGORIES.map((category) => (
                  <li key={category}>
                    <button
                      onClick={() => handleItemClick(category)}
                      className={`transition-colors duration-200 block py-1 border-b-2 ${
                        activeCategory === category 
                          ? 'text-red-600 border-red-600' 
                          : 'text-gray-800 border-transparent hover:text-red-600'
                      }`}
                    >
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Search Icon & Secondary Action */}
          <div className="flex items-center space-x-2">
             {!isScrolled && (
               <div className="lg:hidden text-[10px] font-bold text-gray-400 uppercase tracking-tighter mr-2">
                 Categories
               </div>
             )}
            <div className="p-2 text-gray-600 hover:text-red-600 cursor-pointer">
              <svg
                className="w-6 h-6 md:w-7 md:h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round" strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
          </div>
        </div>

        {/* Horizontal scroll for mobile when not using drawer */}
        <div className="lg:hidden border-t border-gray-100 bg-gray-50/50 py-2">
           <div className="container mx-auto px-4 overflow-x-auto whitespace-nowrap scrollbar-hide flex space-x-4 text-sm font-bold text-gray-600">
             {CATEGORIES.slice(0, 6).map(cat => (
               <button 
                 key={cat} 
                 onClick={() => handleItemClick(cat)} 
                 className={`transition-colors ${activeCategory === cat ? 'text-red-600 underline underline-offset-4 decoration-2' : 'hover:text-red-600'}`}
               >
                 {cat}
               </button>
             ))}
             <button onClick={() => setIsMobileMenuOpen(true)} className="text-red-600 font-black">थप +</button>
           </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <div className={`fixed inset-0 z-[60] transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
        
        {/* Drawer Content */}
        <div className={`absolute left-0 top-0 bottom-0 w-4/5 max-w-sm bg-white shadow-2xl transition-transform duration-300 ease-out transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  </div>
                  <span className="font-black text-xl italic text-gray-900">{siteTitle || 'दृष्टि खबर'}</span>
               </div>
               <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-400 hover:text-red-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
               </button>
            </div>

            <nav className="flex-grow overflow-y-auto">
              <ul className="space-y-1">
                {CATEGORIES.map((category) => (
                  <li key={category}>
                    <button 
                      onClick={() => handleItemClick(category)}
                      className={`flex items-center justify-between w-full px-4 py-3 rounded-lg text-lg font-bold transition-all ${
                        activeCategory === category 
                          ? 'bg-red-600 text-white' 
                          : 'text-gray-800 hover:bg-red-50 hover:text-red-600'
                      }`}
                    >
                      <span>{category}</span>
                      <svg className={`w-4 h-4 ${activeCategory === category ? 'opacity-100' : 'opacity-30'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-auto pt-6 border-t border-gray-100">
              <p className="text-xs text-center text-gray-400 font-medium">© २०२४ दृष्टि खबर</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;