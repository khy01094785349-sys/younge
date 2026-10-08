import React, { useState } from 'react';
import { INGREDIENT_CATEGORIES } from '../data/saengsikData';
import { ShieldCheck, Snowflake, Check, Layers, Sparkles } from 'lucide-react';

export const IngredientsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <section id="ingredients" className="py-16 sm:py-24 bg-[#FAF7F2] border-b border-[#E8DFC8]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-block text-sm sm:text-base font-bold text-[#2A4B37] bg-[#E3EBE4] px-4 py-1.5 rounded-full mb-3 border border-[#C5D7C9]">
            우리 땅에서 자란 100% 국내산 원료
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1F3D2B] tracking-tight leading-tight mb-4">
            국내산 50가지 곡물과 채소,<br className="hidden sm:inline" /> 자연 그대로 담았습니다
          </h2>
          <p className="text-lg sm:text-xl text-[#5A4E42] leading-relaxed">
            원산지가 불분명한 재료는 단 하나도 넣지 않았습니다.<br className="hidden sm:inline" />
            통곡물부터 잎채소, 뿌리채소, 버섯까지 우리 농가에서 건강하게 자란 자연 식품 50종을 골고루 담았습니다.
          </p>
        </div>

        {/* 3 Core Principles Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-14">
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E8DFC8] shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-[#E3EBE4] text-[#2A4B37] flex items-center justify-center font-black text-2xl mb-4">
              50
            </div>
            <h3 className="text-xl font-bold text-[#1F3D2B] mb-2">100% 국내산 50가지 원료</h3>
            <p className="text-base text-[#6C584C] leading-relaxed">
              사계절의 기운을 받고 자란 우리 농산물 50종을 까다로운 품질 검수를 거쳐 정성껏 선별했습니다.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E8DFC8] shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-[#E3EBE4] text-[#2A4B37] flex items-center justify-center mb-4">
              <Snowflake className="w-6 h-6 text-[#2A4B37]" />
            </div>
            <h3 className="text-xl font-bold text-[#1F3D2B] mb-2">동결건조 영양소 보존 공법</h3>
            <p className="text-base text-[#6C584C] leading-relaxed">
              열을 가하지 않고 영하 35℃ 이하에서 급속 동결 건조하여 원재료의 색과 향, 자연 고유의 영양을 지켰습니다.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E8DFC8] shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-[#E3EBE4] text-[#2A4B37] flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6 text-[#2A4B37]" />
            </div>
            <h3 className="text-xl font-bold text-[#1F3D2B] mb-2">무첨가 원칙 (합성첨가물 0%)</h3>
            <p className="text-base text-[#6C584C] leading-relaxed">
              합성 보존료, 합성 착향료, 인공 감미료, 착색료를 일체 넣지 않아 속이 편안하고 담백합니다.
            </p>
          </div>
        </div>

        {/* 50 Ingredients Interactive Category Explorer */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8DFC8] shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E8DFC8] gap-4">
            <div>
              <span className="text-xs font-bold text-[#7A6B5D] tracking-wider uppercase">Ingredient Details</span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#1F3D2B]">
                50가지 엄선 원재료 전체 목록
              </h3>
            </div>
            <span className="text-sm font-semibold text-[#2A4B37] bg-[#F0F5F1] px-3.5 py-1.5 rounded-full self-start sm:self-auto">
              전 원료 국내산 표기 완료
            </span>
          </div>

          {/* Interactive Category Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-6">
            {INGREDIENT_CATEGORIES.map((cat, idx) => {
              const isActive = activeTab === idx;
              return (
                <button
                  key={cat.title}
                  onClick={() => setActiveTab(idx)}
                  className={`p-3.5 rounded-xl text-left transition-all border cursor-pointer ${
                    isActive
                      ? 'bg-[#2A4B37] text-white border-[#2A4B37] shadow-sm'
                      : 'bg-[#FAF7F2] text-[#4A5D4E] border-[#E8DFC8] hover:bg-[#F0E9DA]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-medium opacity-90 mb-1">
                    <span>{cat.icon}</span>
                    <span>{cat.count}종</span>
                  </div>
                  <div className="font-bold text-base sm:text-lg leading-tight">{cat.title}</div>
                </button>
              );
            })}
          </div>

          {/* Selected Category Content */}
          <div className="bg-[#FAF7F2] rounded-2xl p-6 sm:p-8 border border-[#E8DFC8]">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-4 pb-3 border-b border-[#E8DFC8]">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{INGREDIENT_CATEGORIES[activeTab].icon}</span>
                <h4 className="text-xl sm:text-2xl font-black text-[#1F3D2B]">
                  {INGREDIENT_CATEGORIES[activeTab].title} ({INGREDIENT_CATEGORIES[activeTab].count}종)
                </h4>
              </div>
              <p className="text-sm sm:text-base text-[#6C584C] mt-1 sm:mt-0 font-medium">
                {INGREDIENT_CATEGORIES[activeTab].desc}
              </p>
            </div>

            {/* List of Ingredients */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-3.5">
              {INGREDIENT_CATEGORIES[activeTab].items.map((item) => (
                <div
                  key={item}
                  className="bg-white px-3.5 py-2.5 rounded-xl border border-[#E8DFC8] flex items-center gap-2 text-sm sm:text-base font-semibold text-[#2C332D] shadow-xs"
                >
                  <Check className="w-4 h-4 text-[#2A4B37] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sourcing notice */}
          <div className="mt-6 p-4 rounded-xl bg-[#F4EFE6] text-xs sm:text-sm text-[#736354] flex items-center gap-2 justify-center text-center">
            <Sparkles className="w-4 h-4 text-[#C2A649] shrink-0" />
            <span>원재료는 수확 시기 및 계절적 수급 상황에 따라 최상급의 국내산 농산물로 철저하게 관리됩니다.</span>
          </div>
        </div>
      </div>
    </section>
  );
};
