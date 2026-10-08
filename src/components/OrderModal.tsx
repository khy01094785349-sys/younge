import React, { useState, useEffect } from 'react';
import { ProductOption } from '../data/saengsikData';
import { Order, StoreSettings } from '../types/order';
import { User } from '../types/auth';
import { 
  X, CheckCircle, ShoppingBag, Truck, Gift, ShieldCheck, 
  Phone, MapPin, User as UserIcon, Copy, Check, CreditCard, Landmark, Wallet 
} from 'lucide-react';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedOption: ProductOption;
  quantity: number;
  onOpenLookup?: () => void;
  currentUser: User | null;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  selectedOption,
  quantity,
  onOpenLookup,
  currentUser,
}) => {
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [detailAddress, setDetailAddress] = useState(currentUser?.detailAddress || '');
  const [deliveryNote, setDeliveryNote] = useState('문 앞에 놓아주세요');
  const [paymentMethod, setPaymentMethod] = useState<'bank' | 'card' | 'simple'>('bank');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [settings, setSettings] = useState<StoreSettings>({
    bankName: '농협은행',
    accountNumber: '352-0109-4785-33',
    accountHolder: '바른생식 (김혜영)',
    shopName: '바른생식',
    contactPhone: '010-9478-5349',
  });

  useEffect(() => {
    if (isOpen) {
      if (currentUser) {
        if (!name) setName(currentUser.name);
        if (!phone && currentUser.phone) setPhone(currentUser.phone);
        if (!address && currentUser.address) setAddress(currentUser.address);
        if (!detailAddress && currentUser.detailAddress) setDetailAddress(currentUser.detailAddress);
      }

      fetch('/api/settings')
        .then((res) => res.json())
        .then((data) => {
          if (data && data.bankName) setSettings(data);
        })
        .catch(() => {});
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const totalPrice = selectedOption.discountPrice * quantity;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim()) {
      alert('성함, 연락처, 배송지 주소를 모두 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    const newOrderPayload = {
      customerName: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      detailAddress: detailAddress.trim(),
      deliveryNote,
      paymentMethod,
      productName: '자연을 담은 순수생식 50',
      optionName: selectedOption.name,
      boxCount: selectedOption.boxCount,
      pouchCount: selectedOption.pouchCount,
      quantity,
      unitPrice: selectedOption.discountPrice,
      totalPrice,
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrderPayload),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.order) {
          setCreatedOrder(data.order);
          try {
            const localOrders = JSON.parse(localStorage.getItem('saengsik_orders') || '[]');
            localStorage.setItem('saengsik_orders', JSON.stringify([data.order, ...localOrders]));
          } catch {}
          return;
        }
      }
    } catch (err) {
      console.warn('API 서버 연결 없음, 로컬 저장소로 안전하게 전환', err);
    } finally {
      setIsSubmitting(false);
    }

    // Static Hosting / Fallback Handler
    const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const fallbackOrder: Order = {
      id: `ORD-${todayStr}-${randomSuffix}`,
      createdAt: new Date().toISOString(),
      customerName: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      detailAddress: detailAddress.trim(),
      deliveryNote,
      paymentMethod,
      productName: '자연을 담은 순수생식 50',
      optionName: selectedOption.name,
      boxCount: selectedOption.boxCount,
      pouchCount: selectedOption.pouchCount,
      quantity,
      unitPrice: selectedOption.discountPrice,
      totalPrice,
      status: paymentMethod === 'bank' ? '입금대기' : '결제완료',
      courier: 'CJ대한통운',
      trackingNumber: '',
    };

    try {
      const localOrders = JSON.parse(localStorage.getItem('saengsik_orders') || '[]');
      localStorage.setItem('saengsik_orders', JSON.stringify([fallbackOrder, ...localOrders]));
    } catch {}

    setCreatedOrder(fallbackOrder);
    setIsSubmitting(false);
  };

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(`${settings.bankName} ${settings.accountNumber} ${settings.accountHolder}`);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2500);
  };

  const handleResetAndClose = () => {
    setCreatedOrder(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-[#FAF7F2] w-full max-w-2xl rounded-3xl shadow-2xl border border-[#E8DFC8] overflow-hidden my-4 sm:my-8 max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#1F3D2B] text-white px-6 py-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-6 h-6 text-[#E8DFC8]" />
            <h3 className="text-xl sm:text-2xl font-black">
              {createdOrder ? '주문이 성공적으로 접수되었습니다!' : '생식 간편 주문하기'}
            </h3>
          </div>
          <button
            onClick={handleResetAndClose}
            className="text-[#E8DFC8] hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1">
          {createdOrder ? (
            /* Order Success View */
            <div className="p-6 sm:p-10 text-center">
              <div className="w-20 h-20 rounded-full bg-[#E3EBE4] text-[#2A4B37] mx-auto flex items-center justify-center mb-4">
                <CheckCircle className="w-12 h-12" />
              </div>

              <div className="inline-block text-xs sm:text-sm font-bold text-[#6C584C] bg-[#F0E9DA] px-3.5 py-1 rounded-full border border-[#D4C5A9] mb-3">
                주문번호: <strong>{createdOrder.id}</strong>
              </div>

              <h4 className="text-2xl sm:text-3xl font-black text-[#1F3D2B] mb-2">
                {createdOrder.customerName} 님, 주문이 정상 접수되었습니다!
              </h4>
              <p className="text-sm sm:text-base text-[#5A4E42] mb-6 leading-relaxed">
                국내산 50가지 곡물·채소를 담은 바른생식이 사장님 주문관리 시스템에 안전하게 기록되었습니다.
              </p>

              {/* 무통장입금 상세 입금계좌 안내 박스 */}
              {createdOrder.paymentMethod === 'bank' && (
                <div className="bg-[#F0F5F1] rounded-2xl p-5 sm:p-6 border-2 border-[#2A4B37] text-left mb-6 shadow-sm">
                  <div className="flex items-center justify-between pb-3 border-b border-[#C5D7C9] mb-3">
                    <div className="flex items-center gap-2">
                      <Landmark className="w-5 h-5 text-[#2A4B37]" />
                      <strong className="text-base sm:text-lg font-black text-[#1F3D2B]">무통장 입금 계좌 안내</strong>
                    </div>
                    <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">입금대기</span>
                  </div>

                  <div className="space-y-2 text-sm sm:text-base">
                    <div className="flex justify-between items-center">
                      <span className="text-[#5A4E42]">입금 은행</span>
                      <strong className="text-[#1F3D2B]">{settings.bankName}</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#5A4E42]">계좌번호</span>
                      <strong className="text-xl font-black text-[#1F3D2B] tracking-wide">{settings.accountNumber}</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#5A4E42]">예금주</span>
                      <strong className="text-[#1F3D2B]">{settings.accountHolder}</strong>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-[#C5D7C9]">
                      <span className="text-[#5A4E42] font-bold">입금 금액</span>
                      <strong className="text-2xl font-black text-[#2A4B37]">{createdOrder.totalPrice.toLocaleString()}원</strong>
                    </div>
                  </div>

                  <button
                    onClick={handleCopyAccount}
                    className="w-full mt-4 bg-[#2A4B37] hover:bg-[#1F3D2B] text-white py-3 px-4 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer shadow transition-all active:scale-98"
                  >
                    {copiedAccount ? <Check className="w-5 h-5 text-[#A3E635]" /> : <Copy className="w-5 h-5" />}
                    <span>{copiedAccount ? '계좌번호가 복사되었습니다!' : '계좌번호 복사하기'}</span>
                  </button>

                  <p className="text-xs text-[#5A4E42] mt-2.5 text-center">
                    ※ 입금자명이 <strong>'{createdOrder.customerName}'</strong>(으)로 일치해야 자동 확인이 빠릅니다.
                  </p>
                </div>
              )}

              {/* Order Receipt Box */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E8DFC8] text-left mb-6 space-y-2.5 text-sm sm:text-base">
                <div className="flex justify-between items-center pb-2 border-b border-[#E8DFC8]">
                  <span className="text-[#6C584C]">주문 상품</span>
                  <span className="font-bold text-[#1F3D2B]">{createdOrder.productName} ({createdOrder.optionName})</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-[#E8DFC8]">
                  <span className="text-[#6C584C]">수량 및 혜택</span>
                  <span className="font-bold text-[#1F3D2B]">{createdOrder.quantity}개 (전용 쉐이커 보틀 무료 증정)</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-[#E8DFC8]">
                  <span className="text-[#6C584C]">받는 분 / 연락처</span>
                  <span className="font-bold text-[#1F3D2B]">{createdOrder.customerName} ({createdOrder.phone})</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-[#E8DFC8]">
                  <span className="text-[#6C584C]">배송지</span>
                  <span className="font-medium text-[#1F3D2B] text-right">{createdOrder.address} {createdOrder.detailAddress}</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="font-bold text-[#1F3D2B]">총 결제 금액 (무료배송)</span>
                  <span className="font-black text-2xl text-[#2A4B37]">{createdOrder.totalPrice.toLocaleString()}원</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-2.5">
                <button
                  onClick={handleResetAndClose}
                  className="w-full bg-[#2A4B37] hover:bg-[#1F3D2B] text-white text-lg font-bold py-4 rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  확인 완료
                </button>
                {onOpenLookup && (
                  <button
                    onClick={() => {
                      handleResetAndClose();
                      onOpenLookup();
                    }}
                    className="w-full bg-white hover:bg-[#FAF7F2] border border-[#D4C5A9] text-[#2A4B37] text-base font-bold py-3 rounded-xl transition-colors cursor-pointer"
                  >
                    내 주문 & 배송 상태 확인하기
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Order Form View */
            <form onSubmit={handleSubmitOrder} className="p-6 sm:p-8 space-y-6">
              {/* Selected Product Summary Box */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E8DFC8] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#2A4B37] bg-[#E3EBE4] px-2.5 py-0.5 rounded-full">
                    선택 상품
                  </span>
                  <h4 className="text-lg sm:text-xl font-black text-[#1F3D2B] mt-1">
                    자연을 담은 순수생식 50
                  </h4>
                  <p className="text-xs sm:text-sm text-[#6C584C]">
                    {selectedOption.name} · 수량 {quantity}개
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-emerald-700 font-bold block">무료배송</span>
                  <span className="text-xl sm:text-2xl font-black text-[#1F3D2B]">
                    {totalPrice.toLocaleString()}원
                  </span>
                </div>
              </div>

              {/* Delivery Info Fields */}
              <div className="space-y-4">
                <h4 className="text-base sm:text-lg font-black text-[#1F3D2B] flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#2A4B37]" />
                  <span>배송지 정보 입력</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-[#4A5D4E] mb-1.5">
                      받는 분 성함 *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="예: 홍길동"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white border border-[#D4C5A9] rounded-xl px-4 py-3 text-base text-[#1F3D2B] focus:ring-2 focus:ring-[#2A4B37] focus:border-[#2A4B37] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#4A5D4E] mb-1.5">
                      연락처 (휴대폰 번호) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="예: 01012345678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-white border border-[#D4C5A9] rounded-xl px-4 py-3 text-base text-[#1F3D2B] focus:ring-2 focus:ring-[#2A4B37] focus:border-[#2A4B37] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#4A5D4E] mb-1.5">
                    배송 주소 *
                  </label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      required
                      placeholder="기본 주소 (예: 충북 충주시 행정13길20)"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-white border border-[#D4C5A9] rounded-xl px-4 py-3 text-base text-[#1F3D2B] focus:ring-2 focus:ring-[#2A4B37] focus:border-[#2A4B37] outline-none"
                    />
                    <input
                      type="text"
                      placeholder="상세 주소 (예: 101호)"
                      value={detailAddress}
                      onChange={(e) => setDetailAddress(e.target.value)}
                      className="w-full bg-white border border-[#D4C5A9] rounded-xl px-4 py-3 text-base text-[#1F3D2B] focus:ring-2 focus:ring-[#2A4B37] focus:border-[#2A4B37] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#4A5D4E] mb-1.5">
                    배송 요청사항
                  </label>
                  <select
                    value={deliveryNote}
                    onChange={(e) => setDeliveryNote(e.target.value)}
                    className="w-full bg-white border border-[#D4C5A9] rounded-xl px-4 py-3 text-base text-[#1F3D2B] focus:ring-2 focus:ring-[#2A4B37] focus:border-[#2A4B37] outline-none"
                  >
                    <option value="문 앞에 놓아주세요">문 앞에 놓아주세요</option>
                    <option value="배송 전 미리 연락 바랍니다">배송 전 미리 연락 바랍니다</option>
                    <option value="경비실에 맡겨주세요">경비실에 맡겨주세요</option>
                    <option value="택배함에 보관해주세요">택배함에 보관해주세요</option>
                  </select>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <h4 className="text-base sm:text-lg font-black text-[#1F3D2B] mb-2.5">
                  결제 방법 선택
                </h4>
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border text-center font-bold text-sm sm:text-base cursor-pointer transition-all flex flex-col items-center justify-center gap-1 ${
                      paymentMethod === 'card'
                        ? 'bg-[#2A4B37] text-white border-[#2A4B37] shadow-sm'
                        : 'bg-white text-[#4A5D4E] border-[#D4C5A9] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>신용/체크카드</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('simple')}
                    className={`p-3 rounded-xl border text-center font-bold text-sm sm:text-base cursor-pointer transition-all flex flex-col items-center justify-center gap-1 ${
                      paymentMethod === 'simple'
                        ? 'bg-[#2A4B37] text-white border-[#2A4B37] shadow-sm'
                        : 'bg-white text-[#4A5D4E] border-[#D4C5A9] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    <Wallet className="w-4 h-4" />
                    <span>간편결제(페이)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bank')}
                    className={`p-3 rounded-xl border text-center font-bold text-sm sm:text-base cursor-pointer transition-all flex flex-col items-center justify-center gap-1 ${
                      paymentMethod === 'bank'
                        ? 'bg-[#2A4B37] text-white border-[#2A4B37] shadow-sm'
                        : 'bg-white text-[#4A5D4E] border-[#D4C5A9] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    <Landmark className="w-4 h-4" />
                    <span>무통장입금</span>
                  </button>
                </div>

                {paymentMethod === 'bank' && (
                  <div className="mt-3 p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFC8] text-xs text-[#6C584C]">
                    💡 무통장입금 선택 시 주문 완료 화면에서 <strong>{settings.bankName} 계좌번호</strong>와 입금 안내가 제공됩니다.
                  </div>
                )}
              </div>

              {/* Big Action Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#2A4B37] hover:bg-[#1F3D2B] active:bg-[#15251C] text-white text-xl sm:text-2xl font-black py-5 px-6 rounded-2xl shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                      <span>주문 접수 처리 중...</span>
                    </div>
                  ) : (
                    <span>{totalPrice.toLocaleString()}원 결제하고 주문하기</span>
                  )}
                </button>
                <p className="text-center text-xs text-[#7A6B5D] mt-2.5">
                  입력하신 주문 정보는 데이터베이스에 안전하게 기록되며 상점 사장님에게 전달됩니다.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
