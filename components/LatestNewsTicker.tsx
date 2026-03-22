import React from 'react';
import { LATEST_UPDATE_TEXT } from '../constants.ts';

interface LatestNewsTickerProps {
  onNewsClick: (news: any) => void;
  newsItems: any[];
}

const LatestNewsTicker: React.FC<LatestNewsTickerProps> = ({ onNewsClick, newsItems }) => {
  return (
    <div className="bg-white mt-6 mb-8 rounded-lg shadow-md overflow-hidden border border-gray-100">
      <div className="flex items-center">
        <div className="flex-shrink-0 bg-red-600 text-white text-sm md:text-base font-bold px-4 py-3 z-10 shadow-lg relative">
          {LATEST_UPDATE_TEXT}
          <div className="absolute top-0 right-[-10px] w-0 h-0 border-t-[40px] border-t-red-600 border-r-[10px] border-r-transparent"></div>
        </div>
        <div className="flex-1 overflow-hidden bg-gray-50 py-3 relative">
          <div className="inline-block animate-marquee whitespace-nowrap text-gray-800 text-base md:text-lg font-medium pl-[100%]">
            {newsItems.map((news) => (
              <button 
                key={news.id} 
                onClick={() => onNewsClick(news)}
                className="hover:text-red-600 transition-colors duration-200 mx-8 inline-flex items-center"
              >
                <span className="w-2 h-2 bg-red-600 rounded-full mr-2"></span>
                {news.title}
              </button>
            ))}
            {newsItems.length === 0 && <span className="mx-8">नयाँ समाचारहरू छिट्टै अपडेट हुनेछन्...</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LatestNewsTicker;