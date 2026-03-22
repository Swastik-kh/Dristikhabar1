import React, { useState, useEffect, useMemo } from 'react';
import { NEWS_STATUS } from '../constants.ts';
import { getExactNepaliDate } from '../utils/nepaliDate.ts';

interface NewsDetailModalProps {
  news: any | null;
  onClose: () => void;
}

const NewsDetailModal: React.FC<NewsDetailModalProps> = ({ news, onClose }) => {
  const [copied, setCopied] = useState(false);
  
  // Precise Display Date Logic:
  // Shows stored fixed date if published, or live precise date if pending.
  const displayDate = useMemo(() => {
      if (!news) return '';
      if (news.status === NEWS_STATUS.PUBLISHED && news.date) {
          return news.date;
      }
      return getExactNepaliDate();
  }, [news]);

  useEffect(() => {
    if (!news) return;
    const prevTitle = document.title;
    const currentUrl = `${window.location.origin}${window.location.pathname}?news=${news.id}`;
    document.title = `${news.title} | दृष्टि खबर`;

    const setMeta = (selector: string, content: string) => {
        let element = document.querySelector(selector);
        if (!element) {
            element = document.createElement('meta');
            const parts = selector.match(/\[(.*?)=["'](.*?)["']\]/);
            if (parts) element.setAttribute(parts[1], parts[2]);
            document.head.appendChild(element);
        }
        element.setAttribute('content', content);
    };

    setMeta('meta[property="og:type"]', 'article');
    setMeta('meta[property="og:title"]', news.title);
    setMeta('meta[property="og:description"]', news.description ? news.description.substring(0, 150) + '...' : '');
    setMeta('meta[property="og:image"]', news.imageUrl);
    setMeta('meta[property="og:url"]', currentUrl);
    setMeta('meta[name="twitter:title"]', news.title);

    window.scrollTo(0, 0);
    return () => { document.title = prevTitle; };
  }, [news]);

  if (!news) return null;

  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?news=${news.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const shareText = encodeURIComponent(news.title);
  const shareUrl = encodeURIComponent(`${window.location.origin}${window.location.pathname}?news=${news.id}`);

  const handleCloseClick = () => {
    onClose();
    const newUrl = `${window.location.origin}${window.location.pathname}`;
    try {
      window.history.pushState({ path: newUrl }, '', newUrl);
    } catch (error) {
      console.warn("URL update warning", error);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 flex items-center justify-between">
         <button onClick={handleCloseClick} className="flex items-center space-x-2 text-gray-600 hover:text-red-600 font-bold transition-colors group">
            <div className="p-2 bg-white border border-gray-200 rounded-full group-hover:border-red-200 group-hover:bg-red-50 shadow-sm">
                <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            </div>
            <span>मुख्य पृष्ठमा फर्कनुहोस्</span>
         </button>
      </div>

      <div className="bg-white w-full rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">
        {news.imageUrl && (
            <div className="w-full relative">
                <img src={news.imageUrl} alt={news.title} className="w-full h-auto max-h-[70vh] object-contain bg-gray-50" />
            </div>
        )}

        <div className="p-6 md:p-10 space-y-8 max-w-4xl mx-auto">
            <div className="border-b border-gray-100 pb-8 text-center md:text-left">
                <div className="flex flex-wrap gap-3 mb-4 justify-center md:justify-start">
                    <span className="bg-red-600 text-white text-sm font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">{news.category}</span>
                    {news.status === 'प्रकाशित' && <span className="bg-green-100 text-green-800 text-sm font-bold px-3 py-1.5 rounded-full border border-green-200">प्रकाशित</span>}
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-6">{news.title}</h1>
                
                <div className="flex flex-col md:flex-row items-center md:justify-between text-gray-500 font-medium text-sm md:text-base gap-4">
                     <div className="flex items-center space-x-6">
                        <span className="flex items-center">
                            <svg className="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                            {news.showAuthor ? news.author : 'दृष्टि खबर ब्युरो'}
                        </span>
                        <span className="flex items-center">
                            <svg className="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            {displayDate}
                        </span>
                     </div>
                </div>
            </div>
            
            <div className="prose prose-lg md:prose-xl max-w-none text-gray-800 leading-relaxed font-serif">
                <p className="whitespace-pre-wrap">{news.description || 'यो समाचारको थप विवरण उपलब्ध छैन।'}</p>
                <div className="mt-8 p-6 bg-gray-50 rounded-xl border-l-4 border-red-600">
                    <p className="italic text-gray-600 font-sans text-base m-0">दृष्टि खबर सधैं सत्य, तथ्य र निष्पक्ष समाचारको संवाहकका रूपमा रहँदै आएको छ ।</p>
                </div>
            </div>

            <div className="pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-6">
                <div className="flex items-center space-x-2 text-gray-500 font-bold"><span>शेयर गर्नुहोस्:</span></div>
                <div className="flex items-center space-x-3">
                    <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    </a>
                    <button onClick={handleCopyLink} className={`flex items-center space-x-2 px-5 py-3 rounded-lg font-bold transition-all shadow-sm ${copied ? 'bg-green-600 text-white' : 'bg-gray-800 text-white hover:bg-gray-900'}`}>
                        {copied ? <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg><span>कपि भयो</span></> : <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg><span>लिंक कपि</span></>}
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetailModal;