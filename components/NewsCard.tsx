import React from 'react';

interface NewsCardProps {
  imageUrl: string;
  title: string;
  category: string;
  description?: string;
  isMain?: boolean; // To differentiate styling for main news vs popular news
}

const NewsCard: React.FC<NewsCardProps> = ({ imageUrl, title, category, description, isMain = false }) => {
  if (isMain) {
    return (
      <div className="group block bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-100">
        <div className="relative overflow-hidden aspect-video sm:aspect-auto sm:h-48">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-contain object-center group-hover:scale-110 transition-transform duration-500" 
          />
          <div className="absolute top-3 left-3">
             <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg uppercase">
              {category}
            </span>
          </div>
        </div>
        <div className="p-4 md:p-5">
          <h3 className="text-lg md:text-xl font-bold text-gray-900 leading-tight mb-2 group-hover:text-red-600 transition-colors duration-200 line-clamp-2">
            {title}
          </h3>
          {description && (
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
              {description}
            </p>
          )}
          <div className="mt-4 flex items-center text-xs font-bold text-red-600 uppercase tracking-wider group-hover:translate-x-1 transition-transform">
             थप पढ्नुहोस् <span className="ml-1">→</span>
          </div>
        </div>
      </div>
    );
  } else {
    // For sidebar items, more compact but clear on mobile
    return (
      <div className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-red-50 transition-all duration-200 border border-transparent hover:border-red-100 group">
        <div className="relative flex-shrink-0 w-24 h-18 sm:w-20 sm:h-16 overflow-hidden rounded-md">
          <img src={imageUrl} alt={title} className="w-full h-full object-contain object-center group-hover:scale-110 transition-transform duration-500" />
        </div>
        <div className="flex-grow min-w-0">
          <h4 className="text-sm md:text-base font-bold text-gray-900 leading-tight group-hover:text-red-600 transition-colors duration-200 line-clamp-2">
            {title}
          </h4>
          <span className="text-[10px] font-bold text-gray-400 uppercase mt-1 block">{category}</span>
        </div>
      </div>
    );
  }
};

export default NewsCard;