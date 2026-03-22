import React from 'react';
import NewsCard from './NewsCard.tsx';
import { POPULAR_NEWS_TITLE } from '../constants.ts';

interface PopularNewsSidebarProps {
  onNewsClick: (news: any) => void;
  newsItems: any[];
}

const PopularNewsSidebar: React.FC<PopularNewsSidebarProps> = ({ onNewsClick, newsItems }) => {
  return (
    <aside className="bg-white rounded-xl shadow-sm p-5 md:p-6 lg:sticky lg:top-24 border border-gray-100">
      <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-6 pb-2 border-b-2 border-red-600 inline-block">
        {POPULAR_NEWS_TITLE}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-1">
        {newsItems.map((news) => (
          <div key={news.id} onClick={() => onNewsClick(news)} className="cursor-pointer">
            <NewsCard
              imageUrl={news.imageUrl}
              title={news.title}
              category={news.category}
              isMain={false}
            />
          </div>
        ))}
        {newsItems.length === 0 && <p className="text-gray-400 text-sm">अहिले कुनै लोकप्रिय समाचार छैनन्।</p>}
      </div>
    </aside>
  );
};

export default PopularNewsSidebar;