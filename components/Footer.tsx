import React from 'react';
import { FOOTER_TEXT } from '../constants.ts';

interface FooterProps {
  facebookLink: string;
  twitterLink: string;
  youtubeLink: string;
  instagramLink: string;
  contactEmail?: string;
  contactPhone?: string;
}

const Footer: React.FC<FooterProps> = ({ facebookLink, twitterLink, youtubeLink, instagramLink, contactEmail, contactPhone }) => {
  // Helper to ensure valid URL
  const getSafeUrl = (url: string) => {
    if (!url) return '#';
    // If it starts with http:// or https://, return as is.
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    // Otherwise prepend https://
    return `https://${url}`;
  };

  // Default to the specific email requested if no dynamic setting is provided
  const displayEmail = contactEmail || 'info@dristikhabar.com';

  return (
    <footer className="bg-gray-800 text-white py-8 mt-12 border-t-4 border-red-600">
      <div className="container mx-auto px-4">
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            
            {/* Contact Info - Left Aligned on Desktop */}
            <div className="text-center md:text-left order-2 md:order-1 min-w-[200px]">
                 <h4 className="font-bold text-gray-400 uppercase text-xs tracking-widest mb-2">सम्पर्क</h4>
                 <a href={`mailto:${displayEmail}`} className="block text-lg font-bold hover:text-red-400 transition-colors">{displayEmail}</a>
                 {contactPhone && <p className="text-sm text-gray-400 mt-1">{contactPhone}</p>}
            </div>

            {/* Social Icons - Centered */}
            <div className="flex flex-col items-center order-1 md:order-2">
                <span className="text-xs font-bold text-gray-400 uppercase mb-3">हामीलाई पछ्याउनुहोस्</span>
                <div className="flex space-x-5">
                    <a 
                    href={getSafeUrl(facebookLink)} 
                    target={facebookLink ? "_blank" : "_self"} 
                    rel="noopener noreferrer" 
                    aria-label="Facebook" 
                    className={`text-gray-400 hover:text-blue-600 transition-colors transform hover:scale-110 ${!facebookLink ? 'opacity-50' : ''}`}
                    onClick={(e) => !facebookLink && e.preventDefault()}
                    >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    </a>
                    
                    <a 
                    href={getSafeUrl(youtubeLink)} 
                    target={youtubeLink ? "_blank" : "_self"} 
                    rel="noopener noreferrer" 
                    aria-label="YouTube" 
                    className={`text-gray-400 hover:text-red-600 transition-colors transform hover:scale-110 ${!youtubeLink ? 'opacity-50' : ''}`}
                    onClick={(e) => !youtubeLink && e.preventDefault()}
                    >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.018 3.018 0 0 0-2.122-2.136c-1.547-.417-7.734-.417-7.734-.417H9.358s-6.187 0-7.734.417a3.018 3.018 0 0 0-2.122 2.136C-.417 7.734-.417 12 0 12c-.417 4.266 0 7.734.417 7.734a3.018 3.018 0 0 0 2.122 2.136c1.547.417 7.734.417 7.734.417h6.284s6.187 0 7.734-.417a3.018 3.018 0 0 0 2.122-2.136C24 16.266 24 12 23.498 12c0-4.266 0-7.734-.417-5.814zM9.993 15.341V8.659L15.656 12l-5.663 3.341z"/></svg>
                    </a>
                    
                    <a 
                    href={getSafeUrl(twitterLink)} 
                    target={twitterLink ? "_blank" : "_self"} 
                    rel="noopener noreferrer" 
                    aria-label="Twitter" 
                    className={`text-gray-400 hover:text-blue-400 transition-colors transform hover:scale-110 ${!twitterLink ? 'opacity-50' : ''}`}
                    onClick={(e) => !twitterLink && e.preventDefault()}
                    >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.25 2.25h6.634l4.717 6.175 5.643-6.175Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z"/></svg>
                    </a>

                    <a 
                    href={getSafeUrl(instagramLink)} 
                    target={instagramLink ? "_blank" : "_self"} 
                    rel="noopener noreferrer" 
                    aria-label="Instagram" 
                    className={`text-gray-400 hover:text-pink-600 transition-colors transform hover:scale-110 ${!instagramLink ? 'opacity-50' : ''}`}
                    onClick={(e) => !instagramLink && e.preventDefault()}
                    >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                    </a>
                </div>
            </div>

            {/* Copyright - Right Aligned on Desktop */}
            <div className="text-center md:text-right order-3 text-sm text-gray-500 min-w-[200px]">
                <p>{FOOTER_TEXT}</p>
            </div>
            
        </div>
      </div>
    </footer>
  );
};

export default Footer;