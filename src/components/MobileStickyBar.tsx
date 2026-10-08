import React from 'react';
import { ShoppingBag, Phone } from 'lucide-react';

interface MobileStickyBarProps {
  onOrderClick: () => void;
}

export const MobileStickyBar: React.FC<MobileStickyBarProps> = ({ onOrderClick }) => {
  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-t-2 border-[#D4C5A9] px-4 py-3 shadow-2xl">
      <div className="flex items-center gap-2">
        <a
          href="tel:1588-0000"
          className="flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-white border border-[#D4C5A9] text-[#1F3D2B] text-xs font-bold shrink-0"
        >
          <Phone className="w-5 h-5 text-[#2A4B37] mb-0.5" />
          <span>전화</span>
        </a>

        <button
          onClick={onOrderClick}
          className="flex-1 h-14 bg-[#2A4B37] active:bg-[#1A3023] text-white rounded-2xl flex items-center justify-between px-5 font-black text-lg shadow-lg cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-[#E8DFC8]" />
            <span>생식 주문하기</span>
          </div>
          <div className="text-right">
            <span className="text-sm font-normal text-[#E8DFC8] block -mb-1">무료배송</span>
            <span className="text-base text-white font-bold">38,000원~</span>
          </div>
        </button>
      </div>
    </div>
  );
};
