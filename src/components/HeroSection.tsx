import React from 'react';
import { ArrowDown, CheckCircle2, ShoppingBag, ShieldCheck, Sparkles, Sprout, Wheat, Leaf } from 'lucide-react';

interface HeroSectionProps {
  onOrderClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOrderClick }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F4EFE6] via-[#FAF7F2] to-[#FAF7F2] pt-8 pb-16 sm:pt-14 sm:pb-24 border-b border-[#E8DFC8]">
      {/* Subtle organic background patterns */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#E5ECE6]/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-[#EFE8D6]/60 blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative">
        {/* Top Tagline */}
        <div className="text-center mb-4 sm:mb-6">
          <div className="inline-flex items-center gap-2 text-sm sm:text-base font-bold text-[#2A4B37] bg-[#E3EBE4] px-4 py-1.5 rounded-full border border-[#C5D7C9]">
            <Sprout className="w-4 h-4 text-[#2A4B37]" />
            <span>100% 국내산 50가지 곡물과 채소의 온전한 자연 식사</span>
          </div>
        </div>

        {/* Main Big Headline Required: "하루한잔, 간편한 한끼" */}
        <div className="text-center max-w-4xl mx-auto mb-6 sm:mb-8">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-[#1F3D2B] tracking-tight leading-[1.15] mb-4">
            하루한잔, 간편한 한끼
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#4A5D4E] leading-relaxed">
            바쁜 일상, 물이나 우유에 흔들어 마시는 든든한 국내산 생식
          </p>
          <p className="mt-3 text-base sm:text-lg text-[#736354] max-w-2xl mx-auto leading-relaxed">
            인공 첨가물 없이, 우리 땅에서 자란 50가지 곡물·두류·채소·버섯을 열을 가하지 않고 동결건조해 담았습니다. 속은 편안하고 몸은 가볍게 채워보세요.
          </p>
        </div>

        {/* Big "주문하기" Button (Prominently requested) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16">
          <button
            onClick={onOrderClick}
            className="w-full sm:w-auto min-w-[280px] sm:min-w-[320px] bg-[#2A4B37] hover:bg-[#1C3325] text-white text-xl sm:text-2xl font-black py-4 sm:py-5 px-8 sm:px-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3 cursor-pointer group"
          >
            <ShoppingBag className="w-7 h-7 text-[#E8DFC8] group-hover:scale-110 transition-transform" />
            <span>지금 주문하기</span>
            <span className="text-sm font-semibold bg-[#3B6B4C] text-[#E8DFC8] px-2.5 py-1 rounded-lg">
              무료배송
            </span>
          </button>

          <a
            href="#ingredients"
            className="w-full sm:w-auto text-center px-6 py-4 rounded-2xl border-2 border-[#D4C5A9] text-[#4A5D4E] hover:text-[#1F3D2B] hover:bg-[#F0E9DA] text-lg font-bold transition-all flex items-center justify-center gap-2"
          >
            <span>50가지 원료 둘러보기</span>
            <ArrowDown className="w-5 h-5 text-[#2A4B37]" />
          </a>
        </div>

        {/* Hero Visual Card / Product Showcase */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-[#E8DFC8] relative">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Visual Graphic Representation */}
            <div className="md:col-span-5 flex flex-col items-center">
              <div className="relative w-full max-w-[290px] aspect-[4/5] bg-gradient-to-b from-[#FAF7F2] to-[#F1E9DA] rounded-2xl p-6 border border-[#E8DFC8] flex flex-col items-center justify-between shadow-inner">
                {/* Eco Tag */}
                <div className="w-full flex justify-between items-center text-xs font-bold text-[#2A4B37]">
                  <span className="flex items-center gap-1">
                    <Leaf className="w-3.5 h-3.5 text-[#2A4B37]" /> 국내산 100%
                  </span>
                  <span className="bg-[#2A4B37] text-white px-2 py-0.5 rounded">30포 / 1박스</span>
                </div>

                {/* Shaker / Bottle Illustration Graphic */}
                <div className="my-auto flex flex-col items-center">
                  <div className="relative w-28 h-48 bg-white/90 rounded-2xl border-4 border-[#2A4B37] p-2 shadow-md flex flex-col items-center justify-between">
                    {/* Bottle Cap */}
                    <div className="w-16 h-4 bg-[#2A4B37] rounded-t -mt-5" />
                    {/* Measurement lines */}
                    <div className="w-full flex flex-col gap-2.5 px-2 py-3 opacity-60">
                      <div className="w-6 h-0.5 bg-[#4A5D4E]" />
                      <div className="w-10 h-0.5 bg-[#4A5D4E]" />
                      <div className="w-6 h-0.5 bg-[#4A5D4E]" />
                      <div className="w-12 h-0.5 bg-[#2A4B37]" />
                    </div>
                    {/* Liquid fill */}
                    <div className="w-full h-24 bg-gradient-to-t from-[#B5C9A4] to-[#C9DAC0] rounded-xl flex items-center justify-center text-center p-1">
                      <span className="text-[11px] font-black text-[#1F3D2B] leading-tight">
                        자연을 담은<br />순수생식 50
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 text-center">
                    <p className="text-xs font-bold text-[#6C584C]">전용 쉐이커 보틀 무료 증정</p>
                  </div>
                </div>

                {/* Bottom Spec */}
                <div className="w-full text-center pt-2 border-t border-[#E8DFC8]/80">
                  <span className="text-xs font-semibold text-[#736354]">1포당 30g · 든든한 식사대용</span>
                </div>
              </div>
            </div>

            {/* Core Features Description */}
            <div className="md:col-span-7 space-y-5">
              <div>
                <span className="text-xs font-bold tracking-wider text-[#8A755D] uppercase">Pure Natural Whole Food</span>
                <h3 className="text-2xl sm:text-3xl font-black text-[#1F3D2B] mt-1 mb-2">
                  왜 ‘바른생식’ 이어야 할까요?
                </h3>
                <p className="text-[#5A4E42] text-base sm:text-lg leading-relaxed">
                  자연 본래의 영양을 훼손하지 않기 위해 볶거나 튀기지 않았습니다. 깨끗한 국내산 통곡물과 채소를 골라 동결건조 방식으로 갈아내어 자연 그대로의 담백함과 영양을 지켰습니다.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFC8]">
                  <CheckCircle2 className="w-5 h-5 text-[#2A4B37] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-base font-bold text-[#1F3D2B] block">국내산 원료 50종</strong>
                    <span className="text-xs sm:text-sm text-[#736354]">현미·귀리·서리태·케일 등 엄선</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFC8]">
                  <CheckCircle2 className="w-5 h-5 text-[#2A4B37] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-base font-bold text-[#1F3D2B] block">열 가함 없는 동결건조</strong>
                    <span className="text-xs sm:text-sm text-[#736354]">영하 35℃ 급속 동결 건조 공법</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFC8]">
                  <CheckCircle2 className="w-5 h-5 text-[#2A4B37] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-base font-bold text-[#1F3D2B] block">첨가물 0% 무첨가</strong>
                    <span className="text-xs sm:text-sm text-[#736354]">착향료·인공감미료·보존료 배제</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFC8]">
                  <CheckCircle2 className="w-5 h-5 text-[#2A4B37] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-base font-bold text-[#1F3D2B] block">물/우유 30초 완성</strong>
                    <span className="text-xs sm:text-sm text-[#736354]">흔들기만 하면 든든한 식사 완료</span>
                  </div>
                </div>
              </div>

              {/* Price Preview in Hero */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-[#E8DFC8]">
                <div>
                  <span className="text-xs text-[#8A755D] line-through block">정가 48,000원</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-red-700 font-black text-xl sm:text-2xl">20% 할인</span>
                    <span className="text-2xl sm:text-3xl font-black text-[#1F3D2B]">38,000원</span>
                    <span className="text-xs sm:text-sm text-[#736354]">(1박스 30포 / 무료배송)</span>
                  </div>
                </div>
                <button
                  onClick={onOrderClick}
                  className="bg-[#2A4B37] hover:bg-[#1F3D2B] text-white px-5 py-2.5 rounded-xl font-bold text-base cursor-pointer shadow"
                >
                  구매하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
