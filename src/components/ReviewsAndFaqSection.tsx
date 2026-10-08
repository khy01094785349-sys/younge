import React, { useState } from 'react';
import { REVIEWS, FAQ_LIST } from '../data/saengsikData';
import { ChevronDown, Star, MessageSquareQuote, HelpCircle, CheckCircle2 } from 'lucide-react';

export const ReviewsAndFaqSection: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  return (
    <div className="bg-[#FAF7F2]">
      {/* Customer Reviews Section */}
      <section className="py-16 sm:py-24 border-b border-[#E8DFC8]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <div className="inline-block text-sm sm:text-base font-bold text-[#2A4B37] bg-[#E3EBE4] px-4 py-1.5 rounded-full mb-3 border border-[#C5D7C9]">
              생생한 실제 고객 구매 후기
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1F3D2B] tracking-tight leading-tight mb-4">
              “아침 시간이 여유로워졌어요”
            </h2>
            <p className="text-lg sm:text-xl text-[#5A4E42]">
              정직한 국내산 원료와 담백한 맛으로 고객님들이 직접 전해주신 솔직한 이야기입니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REVIEWS.map((rev) => (
              <div
                key={rev.id}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E8DFC8] shadow-md flex flex-col justify-between"
              >
                <div>
                  {/* Rating Stars & Option */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-0.5 text-amber-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-[#8A755D] bg-[#F4EFE6] px-2.5 py-1 rounded-md">
                      {rev.option}
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="text-lg font-bold text-[#1F3D2B] mb-2 leading-snug">
                    {rev.title}
                  </h4>

                  {/* Comment */}
                  <p className="text-base text-[#5A4E42] leading-relaxed mb-6">
                    "{rev.comment}"
                  </p>
                </div>

                {/* Author Info */}
                <div className="pt-4 border-t border-[#E8DFC8] flex items-center justify-between text-xs sm:text-sm text-[#7A6B5D]">
                  <span className="font-semibold text-[#2C332D]">{rev.author}</span>
                  <span className="flex items-center gap-1 text-[#2A4B37] font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 구매 인증
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 sm:py-24 border-b border-[#E8DFC8]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-14">
            <div className="inline-block text-sm sm:text-base font-bold text-[#2A4B37] bg-[#E3EBE4] px-4 py-1.5 rounded-full mb-3 border border-[#C5D7C9]">
              궁금한 점을 풀어드립니다
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1F3D2B] tracking-tight leading-tight mb-4">
              자주 묻는 질문
            </h2>
            <p className="text-lg text-[#5A4E42]">
              생식 선택과 섭취에 대해 가장 많이 주시는 질문들을 모았습니다.
            </p>
          </div>

          <div className="space-y-4">
            {FAQ_LIST.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-[#E8DFC8] shadow-xs overflow-hidden transition-all"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer hover:bg-[#FAF7F2] transition-colors"
                  >
                    <span className="font-bold text-lg sm:text-xl text-[#1F3D2B] flex items-center gap-3">
                      <span className="text-[#2A4B37] font-black text-xl">Q.</span>
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-6 h-6 text-[#2A4B37] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-2 text-base sm:text-lg text-[#5A4E42] leading-relaxed border-t border-[#F0E9DA] bg-[#FAF7F2]/50">
                      <div className="flex gap-3">
                        <span className="text-[#7A6B5D] font-black text-lg">A.</span>
                        <p>{faq.a}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
