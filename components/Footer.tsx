import React from 'react';
import { Facebook, Youtube, Twitter, Instagram } from 'lucide-react';
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
                      <Facebook className="w-6 h-6" />
                    </a>
                    
                    <a 
                    href={getSafeUrl(youtubeLink)} 
                    target={youtubeLink ? "_blank" : "_self"} 
                    rel="noopener noreferrer" 
                    aria-label="YouTube" 
                    className={`text-gray-400 hover:text-red-600 transition-colors transform hover:scale-110 ${!youtubeLink ? 'opacity-50' : ''}`}
                    onClick={(e) => !youtubeLink && e.preventDefault()}
                    >
                      <Youtube className="w-6 h-6" />
                    </a>
                    
                    <a 
                    href={getSafeUrl(twitterLink)} 
                    target={twitterLink ? "_blank" : "_self"} 
                    rel="noopener noreferrer" 
                    aria-label="Twitter" 
                    className={`text-gray-400 hover:text-sky-400 transition-colors transform hover:scale-110 ${!twitterLink ? 'opacity-50' : ''}`}
                    onClick={(e) => !twitterLink && e.preventDefault()}
                    >
                      <Twitter className="w-6 h-6" />
                    </a>

                    <a 
                    href={getSafeUrl(instagramLink)} 
                    target={instagramLink ? "_blank" : "_self"} 
                    rel="noopener noreferrer" 
                    aria-label="Instagram" 
                    className={`text-gray-400 hover:text-pink-600 transition-colors transform hover:scale-110 ${!instagramLink ? 'opacity-50' : ''}`}
                    onClick={(e) => !instagramLink && e.preventDefault()}
                    >
                      <Instagram className="w-6 h-6" />
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