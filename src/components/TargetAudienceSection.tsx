import React from 'react';
import { TARGET_CASES } from '../data/saengsikData';
import { Clock, Utensils, HeartHandshake, CheckCircle } from 'lucide-react';

interface TargetAudienceSectionProps {
  onOrderClick: () => void;
}

export const TargetAudienceSection: React.FC<TargetAudienceSectionProps> = ({ onOrderClick }) => {
  const getIcon = (idx: number) => {
    switch (idx) {
      case 0:
        return <Clock className="w-8 h-8 text-[#2A4B37]" />;
      case 1:
        return <Utensils className="w-8 h-8 text-[#2A4B37]" />;
      default:
        return <HeartHandshake className="w-8 h-8 text-[#2A4B37]" />;
    }
  };

  return (
    <section id="target" className="py-16 sm:py-24 bg-[#F4EFE6] border-b border-[#E8DFC8]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-block text-sm sm:text-base font-bold text-[#2A4B37] bg-[#E3EBE4] px-4 py-1.5 rounded-full mb-3 border border-[#C5D7C9]">
            바쁜 일상을 위한 간편한 식사 제안
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1F3D2B] tracking-tight leading-tight mb-4">
            이런 분께 참 좋습니다
          </h2>
          <p className="text-lg sm:text-xl text-[#5A4E42] leading-relaxed">
            복잡한 요리나 준비 없이, 간편하게 자연의 온전한 영양을 챙기고 싶은 현대인을 위해 만들었습니다.
          </p>
        </div>

        {/* 3 Cases Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {TARGET_CASES.map((item, idx) => (
            <div
              key={item.number}
              className="bg-white rounded-3xl p-7 sm:p-8 border border-[#E8DFC8] shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Card Top: Number & Category */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-[#FAF7F2] border border-[#E8DFC8] flex items-center justify-center">
                    {getIcon(idx)}
                  </div>
                  <span className="text-sm font-extrabold text-[#2A4B37] bg-[#E3EBE4] px-3 py-1 rounded-full border border-[#C5D7C9]">
                    {item.badgeText}
                  </span>
                </div>

                <div className="text-xs font-bold text-[#8A755D] tracking-widest uppercase mb-1">
                  CASE {item.number}
                </div>

                {/* Big Title */}
                <h3 className="text-2xl sm:text-3xl font-black text-[#1F3D2B] mb-2 leading-tight">
                  {item.title}
                </h3>
                <h4 className="text-base font-bold text-[#5B7563] mb-4">
                  {item.sub}
                </h4>

                {/* Detailed Description */}
                <p className="text-base sm:text-lg text-[#5A4E42] leading-relaxed mb-6">
                  {item.desc}
                </p>
              </div>

              {/* Bottom Feature Pill */}
              <div className="pt-4 border-t border-[#E8DFC8] flex items-center gap-2 text-sm sm:text-base font-bold text-[#2A4B37]">
                <CheckCircle className="w-5 h-5 text-[#2A4B37] shrink-0" />
                <span>{item.highlight}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA within Target section */}
        <div className="mt-12 sm:mt-16 text-center bg-[#FAF7F2] p-8 sm:p-10 rounded-3xl border border-[#E8DFC8] max-w-3xl mx-auto shadow-sm">
          <h3 className="text-2xl sm:text-3xl font-black text-[#1F3D2B] mb-3">
            더 이상 빈속으로 하루를 시작하지 마세요
          </h3>
          <p className="text-base sm:text-lg text-[#6C584C] mb-6">
            아침 30초 흔들어 마시면 속은 편안하고, 점심시간까지 든든하게 유지됩니다.
          </p>
          <button
            onClick={onOrderClick}
            className="w-full sm:w-auto bg-[#2A4B37] hover:bg-[#1F3D2B] text-white text-lg sm:text-xl font-bold py-4 px-10 rounded-2xl shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            하루한잔 생식 주문하기
          </button>
        </div>
      </div>
    </section>
  );
};
