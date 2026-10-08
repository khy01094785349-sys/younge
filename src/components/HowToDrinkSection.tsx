import React, { useState } from 'react';
import { HOW_TO_DRINK_STEPS } from '../data/saengsikData';
import { GlassWater, Milk, Check, ArrowRight, Droplets, Sparkles } from 'lucide-react';

export const HowToDrinkSection: React.FC = () => {
  const [preferredLiquid, setPreferredLiquid] = useState<'water' | 'milk'>('milk');

  return (
    <section id="how-to" className="py-16 sm:py-24 bg-[#FAF7F2] border-b border-[#E8DFC8]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-block text-sm sm:text-base font-bold text-[#2A4B37] bg-[#E3EBE4] px-4 py-1.5 rounded-full mb-3 border border-[#C5D7C9]">
            30초면 완성되는 간편 레시피
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1F3D2B] tracking-tight leading-tight mb-4">
            물이나 우유에 타서 드세요
          </h2>
          <p className="text-lg sm:text-xl text-[#5A4E42] leading-relaxed">
            특별한 조리도구 없이 전용 쉐이커에 넣고 가볍게 흔들면 끝납니다.<br className="hidden sm:inline" />
            <strong className="text-[#1F3D2B] font-bold">1 → 2 → 3</strong> 순서대로 따라 하시면 뭉침 없이 부드럽게 풀립니다.
          </p>
        </div>

        {/* 1 -> 2 -> 3 Step Cards Sequence */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative mb-14">
          {HOW_TO_DRINK_STEPS.map((step, idx) => (
            <div
              key={step.step}
              className="relative bg-white rounded-3xl p-7 sm:p-8 border-2 border-[#E8DFC8] shadow-md hover:border-[#2A4B37] transition-all flex flex-col justify-between"
            >
              {/* Step indicator arrow for desktop */}
              {idx < 2 && (
                <div className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-[#2A4B37] text-white items-center justify-center shadow-md">
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}

              <div>
                {/* Step Badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#2A4B37] text-white flex items-center justify-center font-black text-2xl shadow-sm">
                    {step.step}
                  </div>
                  <span className="text-sm font-bold text-[#6C584C] bg-[#F4EFE6] px-3.5 py-1.5 rounded-full border border-[#D4C5A9]">
                    STEP {step.step}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-2xl sm:text-3xl font-black text-[#1F3D2B] mb-3 leading-snug">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-base sm:text-lg text-[#5A4E42] leading-relaxed mb-6">
                  {step.desc}
                </p>
              </div>

              {/* Tip Box */}
              <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8DFC8] text-sm sm:text-base text-[#6C584C] font-medium">
                {step.tip}
              </div>
            </div>
          ))}
        </div>

        {/* Liquid Comparison Box: Water vs Milk/Soy Milk */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8DFC8] shadow-md max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h3 className="text-2xl sm:text-3xl font-black text-[#1F3D2B] mb-2">
              어디에 타 마실지 고민되시나요?
            </h3>
            <p className="text-base sm:text-lg text-[#6C584C]">
              취향과 기호에 따라 골라 마실 수 있습니다
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Water Option */}
            <div
              onClick={() => setPreferredLiquid('water')}
              className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                preferredLiquid === 'water'
                  ? 'border-[#2A4B37] bg-[#F0F5F1] shadow-md'
                  : 'border-[#E8DFC8] bg-[#FAF7F2] hover:bg-[#F4EFE6]'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Droplets className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-[#1F3D2B]">물 200ml</h4>
                    <span className="text-xs text-[#736354] font-semibold">자연 본연의 깔끔함</span>
                  </div>
                </div>
                {preferredLiquid === 'water' && (
                  <span className="w-6 h-6 rounded-full bg-[#2A4B37] text-white flex items-center justify-center">
                    <Check className="w-4 h-4" />
                  </span>
                )}
              </div>
              <p className="text-base text-[#5A4E42] leading-relaxed">
                곡물과 채소 본래의 은은하고 담백한 풍미를 깔끔하게 즐기고 싶을 때 추천합니다. 마신 후 속이 아주 가볍습니다.
              </p>
            </div>

            {/* Milk Option */}
            <div
              onClick={() => setPreferredLiquid('milk')}
              className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                preferredLiquid === 'milk'
                  ? 'border-[#2A4B37] bg-[#F0F5F1] shadow-md'
                  : 'border-[#E8DFC8] bg-[#FAF7F2] hover:bg-[#F4EFE6]'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                    <Milk className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-[#1F3D2B]">우유 / 두유 200ml</h4>
                    <span className="text-xs text-[#736354] font-semibold">고소하고 든든한 포만감</span>
                  </div>
                </div>
                {preferredLiquid === 'milk' && (
                  <span className="w-6 h-6 rounded-full bg-[#2A4B37] text-white flex items-center justify-center">
                    <Check className="w-4 h-4" />
                  </span>
                )}
              </div>
              <p className="text-base text-[#5A4E42] leading-relaxed">
                미숫가루보다 훨씬 고소하고 크리미한 맛! 아침 식사 대용으로 긴 시간 든든한 포만감을 원하시는 분들께 가장 인기가 높습니다.
              </p>
            </div>
          </div>

          {/* Sweet tip */}
          <div className="mt-6 text-center text-sm sm:text-base text-[#6C584C] font-semibold bg-[#FAF7F2] p-4 rounded-xl border border-[#E8DFC8] flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C2A649]" />
            <span>꿀 한 숟가락이나 조청을 곁들이시면 아이들도 좋아하는 달콤한 건강 영양식이 됩니다.</span>
          </div>
        </div>
      </div>
    </section>
  );
};
