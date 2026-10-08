import React, { useState } from 'react';
import { PRODUCT_OPTIONS, ProductOption } from '../data/saengsikData';
import { ShoppingBag, Truck, Gift, Check, ShieldCheck, Heart, Sparkles, AlertCircle } from 'lucide-react';

interface ProductOrderSectionProps {
  onSelectOptionAndOrder: (option: ProductOption, quantity: number) => void;
}

export const ProductOrderSection: React.FC<ProductOrderSectionProps> = ({ onSelectOptionAndOrder }) => {
  const [selectedOption, setSelectedOption] = useState<ProductOption>(PRODUCT_OPTIONS[0]);
  const [quantity, setQuantity] = useState<number>(1);

  const totalPrice = selectedOption.discountPrice * quantity;
  const originalTotalPrice = selectedOption.originalPrice * quantity;
  const totalSaved = originalTotalPrice - totalPrice;

  const handleOrder = () => {
    onSelectOptionAndOrder(selectedOption, quantity);
  };

  return (
    <section id="product" className="py-16 sm:py-24 bg-[#F4EFE6] border-b border-[#E8DFC8]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-block text-sm sm:text-base font-bold text-[#2A4B37] bg-[#E3EBE4] px-4 py-1.5 rounded-full mb-3 border border-[#C5D7C9]">
            온라인 단독 특별 구성 & 전용 보틀 증정
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1F3D2B] tracking-tight leading-tight mb-4">
            정직하게 만든 단 하나의 생식
          </h2>
          <p className="text-lg sm:text-xl text-[#5A4E42] leading-relaxed">
            국내산 50가지 원료를 듬뿍 담은 ‘바른생식 순수 50’으로<br className="hidden sm:inline" />
            내일 아침부터 속 편안하고 가벼운 하루를 시작해 보세요.
          </p>
        </div>

        {/* Main Product Order Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-[#E8DFC8] shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10">
            {/* Left: Product Showcase & Visual Info */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                {/* Product Badge & Rating */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs sm:text-sm font-extrabold text-[#2A4B37] bg-[#E3EBE4] px-3 py-1 rounded-full border border-[#C5D7C9]">
                    100% 국내산 원료 50종
                  </span>
                  <div className="flex items-center gap-1 text-sm font-bold text-[#C2A649]">
                    <span>★</span>
                    <span className="text-[#1F3D2B]">4.9</span>
                    <span className="text-[#8A755D] font-normal">(고객 평점)</span>
                  </div>
                </div>

                {/* Main Product Title */}
                <h3 className="text-2xl sm:text-3xl font-black text-[#1F3D2B] leading-snug mb-3">
                  자연을 담은 순수생식 50
                </h3>
                <p className="text-base text-[#6C584C] mb-6 leading-relaxed">
                  바쁜 아침 30초 완성. 통곡물 15종, 두류 8종, 잎채소 14종, 뿌리채소 및 버섯 13종을 담은 간편 분말 생식입니다.
                </p>

                {/* Package Graphic Card */}
                <div className="bg-[#FAF7F2] rounded-2xl p-6 border border-[#E8DFC8] mb-6 text-center">
                  <div className="w-20 h-20 mx-auto rounded-full bg-[#E3EBE4] text-[#2A4B37] flex items-center justify-center font-black text-3xl mb-3 shadow-inner">
                    生
                  </div>
                  <h4 className="text-lg font-bold text-[#1F3D2B]">
                    [자연담은] 순수생식 50 (30포/박스)
                  </h4>
                  <p className="text-xs text-[#7A6B5D] mt-1 font-medium">
                    개별 이지컷 스틱 포장 · 1포당 30g · 넉넉한 1개월분
                  </p>

                  <div className="mt-4 pt-4 border-t border-[#E8DFC8] grid grid-cols-2 gap-2 text-xs font-bold text-[#4A5D4E]">
                    <div className="bg-white p-2 rounded-lg border border-[#E8DFC8]">
                      🎁 쉐이커 보틀 무료
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-[#E8DFC8]">
                      🚚 전국 무료배송
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery notice */}
              <div className="p-4 rounded-xl bg-[#F0F5F1] border border-[#C5D7C9] text-xs sm:text-sm text-[#2A4B37] flex items-start gap-2.5">
                <Truck className="w-5 h-5 shrink-0 text-[#2A4B37] mt-0.5" />
                <div>
                  <strong className="block font-bold">평일 오후 2시 이전 주문 시 당일 발송!</strong>
                  <span className="text-[#4A5D4E]">우체국/CJ대한통운을 통해 신선하고 안전하게 배송됩니다.</span>
                </div>
              </div>
            </div>

            {/* Right: Options, Pricing & Big Action Button */}
            <div className="lg:col-span-7 flex flex-col justify-between pt-4 lg:pt-0 lg:pl-4 lg:border-l lg:border-[#E8DFC8]">
              <div>
                <span className="text-xs font-bold text-[#8A755D] tracking-wider uppercase block mb-2">
                  구성 선택 (원하시는 세트를 선택해주세요)
                </span>

                {/* Options List */}
                <div className="space-y-3 mb-6">
                  {PRODUCT_OPTIONS.map((opt) => {
                    const isSelected = selectedOption.id === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => setSelectedOption(opt)}
                        className={`p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-[#2A4B37] bg-[#F0F5F1] shadow-md ring-1 ring-[#2A4B37]'
                            : 'border-[#E8DFC8] bg-[#FAF7F2] hover:bg-[#F0E9DA]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                isSelected
                                  ? 'border-[#2A4B37] bg-[#2A4B37] text-white'
                                  : 'border-[#A39281] bg-white'
                              }`}
                            >
                              {isSelected && <Check className="w-3.5 h-3.5" />}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-lg sm:text-xl font-bold text-[#1F3D2B]">
                                  {opt.name}
                                </span>
                                {opt.tag && (
                                  <span className="text-xs font-bold bg-[#E8DFC8] text-[#554335] px-2 py-0.5 rounded">
                                    {opt.tag}
                                  </span>
                                )}
                              </div>
                              <span className="text-xs sm:text-sm text-[#736354]">
                                총 {opt.pouchCount}포 + 전용 쉐이커 보틀 포함
                              </span>
                            </div>
                          </div>

                          {/* Price Tag */}
                          <div className="text-right">
                            <div className="text-xs text-[#8A755D] line-through">
                              {opt.originalPrice.toLocaleString()}원
                            </div>
                            <div className="flex items-baseline gap-1.5 justify-end">
                              <span className="text-red-700 font-extrabold text-sm sm:text-base">
                                {opt.discountRate}%
                              </span>
                              <span className="text-xl sm:text-2xl font-black text-[#1F3D2B]">
                                {opt.discountPrice.toLocaleString()}원
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Quantity Control */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-[#FAF7F2] border border-[#E8DFC8] mb-6">
                  <span className="font-bold text-base text-[#1F3D2B]">수량 선택</span>
                  <div className="flex items-center gap-3 bg-white px-2 py-1 rounded-xl border border-[#D4C5A9]">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="w-8 h-8 rounded-lg bg-[#FAF7F2] hover:bg-[#E8DFC8] text-lg font-bold text-[#1F3D2B] disabled:opacity-30 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="font-bold text-lg text-[#1F3D2B] min-w-8 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-8 h-8 rounded-lg bg-[#FAF7F2] hover:bg-[#E8DFC8] text-lg font-bold text-[#1F3D2B] cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Total Price Display */}
                <div className="bg-[#FAF7F2] p-5 sm:p-6 rounded-2xl border border-[#E8DFC8] mb-6">
                  <div className="flex justify-between items-center text-sm text-[#6C584C] mb-2">
                    <span>정상 금액 ({quantity}개)</span>
                    <span className="line-through">{originalTotalPrice.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-semibold text-emerald-800 mb-2">
                    <span>특별 할인 혜택</span>
                    <span>-{totalSaved.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-semibold text-[#2A4B37] mb-3 pb-3 border-b border-[#E8DFC8]">
                    <span>배송비</span>
                    <span className="font-bold">무료 (0원)</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <div>
                      <span className="text-base sm:text-lg font-black text-[#1F3D2B]">최종 결제 금액</span>
                      <p className="text-xs text-[#7A6B5D]">부가세 포함 / 추가 비용 없음</p>
                    </div>
                    <div className="text-right">
                      <span className="text-3xl sm:text-4xl font-black text-[#1F3D2B]">
                        {totalPrice.toLocaleString()}
                      </span>
                      <span className="text-xl sm:text-2xl font-black text-[#1F3D2B] ml-1">원</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Big "주문하기" Button (Required: 글자 크게, 버튼도 크게) */}
              <div>
                <button
                  onClick={handleOrder}
                  className="w-full bg-[#2A4B37] hover:bg-[#1A3023] active:bg-[#15251C] text-white text-xl sm:text-2xl font-black py-5 sm:py-6 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3 cursor-pointer"
                >
                  <ShoppingBag className="w-7 h-7 text-[#E8DFC8]" />
                  <span>주문하기 ({totalPrice.toLocaleString()}원)</span>
                </button>

                <div className="mt-3 text-center text-xs sm:text-sm text-[#736354] flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#2A4B37]" />
                  <span>간편 주문 · 100% 정품 보장 · 안심 교환/반품 보장</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
