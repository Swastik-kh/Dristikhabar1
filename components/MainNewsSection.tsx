import React, { useMemo } from 'react';
import NewsCard from './NewsCard.tsx';
import { MAIN_NEWS_TITLE } from '../constants.ts';

interface MainNewsSectionProps {
  onNewsClick: (news: any) => void;
  activeCategory: string;
  newsItems: any[];
}

const MainNewsSection: React.FC<MainNewsSectionProps> = ({ onNewsClick, activeCategory, newsItems }) => {
  const filteredNews = useMemo(() => {
    if (activeCategory === 'सबै') {
      return newsItems;
    }
    return newsItems.filter(news => news.category === activeCategory);
  }, [activeCategory, newsItems]);

  return (
    <section className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 border-b-2 border-gray-200 pb-2">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 relative">
          {activeCategory === 'सबै' ? MAIN_NEWS_TITLE : activeCategory}
          <span className="absolute bottom-[-10px] left-0 w-24 h-1 bg-red-600"></span>
        </h2>
        <span className="text-sm font-bold text-gray-400 mt-2 sm:mt-0">
          जम्मा {filteredNews.length} समाचार फेला परे
        </span>
      </div>

      {filteredNews.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredNews.map((news) => (
            <div key={news.id} onClick={() => onNewsClick(news)} className="cursor-pointer">
              <NewsCard
                imageUrl={news.imageUrl}
                title={news.title}
                category={news.category}
                description={news.description}
                isMain={true}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-12 text-center border border-dashed border-gray-300">
          <h3 className="text-xl font-bold text-gray-800 mb-2">यो विधामा समाचार उपलब्ध छैन</h3>
          <p className="text-gray-500">अहिलेको लागि सबै विधाका समाचारहरू हेर्नुहोस्।</p>
        </div>
      )}
    </section>
  );
};

export default MainNewsSection;