import React from 'react';
import { ADVERTISEMENT_TEXT } from '../constants.ts';

interface AdvertisementProps {
  height?: string;
  width?: string;
  className?: string;
  adsenseCode?: string;
}

const Advertisement: React.FC<AdvertisementProps> = ({ height = 'h-24 md:h-32', width = 'w-full', className = '', adsenseCode = '' }) => {
  if (adsenseCode) {
    return (
      <div 
        className={`flex items-center justify-center overflow-hidden ${width} ${className}`}
        dangerouslySetInnerHTML={{ __html: adsenseCode }}
      />
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center bg-gray-50 rounded-lg p-2 md:p-4 text-center text-gray-400 border border-dashed border-gray-300 shadow-sm ${height} ${width} ${className}`}>
      <div className="bg-white border border-gray-200 px-3 py-1 rounded text-[8px] md:text-[10px] font-bold uppercase tracking-widest mb-1 md:mb-2 text-gray-400">
        {ADVERTISEMENT_TEXT}
      </div>
      <div className="text-[10px] md:text-sm font-medium text-gray-300">
        विज्ञापनको लागि स्थान सुरक्षित छ
      </div>
      <p className="hidden md:block text-[9px] text-gray-300 mt-2 italic">९७० x २५० पिक्सेल</p>
    </div>
  );
};

export default Advertisement;