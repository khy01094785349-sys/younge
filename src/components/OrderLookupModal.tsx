import React, { useState } from 'react';
import { Order } from '../types/order';
import { X, Search, PackageCheck, Truck, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface OrderLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrderLookupModal: React.FC<OrderLookupModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);
    let matchedOrders: Order[] = [];
    try {
      const res = await fetch(`/api/orders/lookup?query=${encodeURIComponent(query.trim())}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.orders)) {
          matchedOrders = data.orders;
        }
      }
    } catch (err) {
      console.warn('Backend lookup failed, checking local orders', err);
    }

    if (matchedOrders.length === 0) {
      try {
        const cleanQuery = query.replace(/[^0-9a-zA-Z가-힣]/g, '');
        const localOrders: Order[] = JSON.parse(localStorage.getItem('saengsik_orders') || '[]');
        matchedOrders = localOrders.filter((o) => {
          const cleanPhone = (o.phone || '').replace(/[^0-9]/g, '');
          const cleanId = (o.id || '').replace(/[^0-9a-zA-Z]/g, '');
          const cleanName = o.customerName || '';
          return (
            cleanPhone.includes(cleanQuery) ||
            cleanId.toLowerCase().includes(cleanQuery.toLowerCase()) ||
            cleanName.includes(cleanQuery)
          );
        });
      } catch {}
    }

    setOrders(matchedOrders);
    setLoading(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case '입금대기':
        return <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-black">입금대기</span>;
      case '결제완료':
      case '배송준비':
        return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-black">배송준비중</span>;
      case '배송중':
        return <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-black">배송중</span>;
      case '배송완료':
        return <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-black">배송완료</span>;
      default:
        return <span className="bg-slate-100 text-slate-800 px-3 py-1 rounded-full text-xs font-black">{status}</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-[#FAF7F2] w-full max-w-xl rounded-3xl shadow-2xl border border-[#E8DFC8] overflow-hidden my-8">
        {/* Header */}
        <div className="bg-[#1F3D2B] text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <PackageCheck className="w-6 h-6 text-[#E8DFC8]" />
            <h3 className="text-xl sm:text-2xl font-black">내 주문 & 배송 조회</h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#E8DFC8] hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search input form */}
        <div className="p-6">
          <form onSubmit={handleSearch} className="mb-6">
            <label className="block text-sm font-bold text-[#4A5D4E] mb-2">
              주문 시 입력하신 연락처(휴대폰 번호) 또는 성함을 입력해주세요
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="예: 01012345678 또는 홍길동"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-white border border-[#D4C5A9] rounded-xl px-4 py-3 text-base text-[#1F3D2B] outline-none focus:ring-2 focus:ring-[#2A4B37]"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-[#2A4B37] hover:bg-[#1F3D2B] text-white px-6 py-3 rounded-xl font-bold cursor-pointer transition-colors flex items-center gap-2"
              >
                <Search className="w-5 h-5" />
                <span>조회</span>
              </button>
            </div>
          </form>

          {/* Result view */}
          {loading ? (
            <div className="py-12 text-center text-[#7A6B5D]">
              <div className="w-8 h-8 border-3 border-[#2A4B37] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <span>주문 내역 조회 중...</span>
            </div>
          ) : searched && orders && orders.length === 0 ? (
            <div className="py-10 text-center bg-white rounded-2xl border border-[#E8DFC8] p-6">
              <AlertCircle className="w-10 h-10 text-[#A39281] mx-auto mb-2" />
              <p className="font-bold text-[#1F3D2B] text-base">일치하는 주문 내역이 없습니다.</p>
              <p className="text-xs text-[#7A6B5D] mt-1">입력하신 연락처나 성함을 다시 한번 확인해주세요.</p>
            </div>
          ) : orders && orders.length > 0 ? (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {orders.map((o) => (
                <div
                  key={o.id}
                  className="bg-white rounded-2xl p-5 border border-[#E8DFC8] shadow-sm space-y-3"
                >
                  <div className="flex justify-between items-center pb-2.5 border-b border-[#E8DFC8]">
                    <div className="flex items-center gap-2">
                      {getStatusBadge(o.status)}
                      <span className="text-xs text-[#7A6B5D]">{o.id}</span>
                    </div>
                    <span className="text-xs text-[#8A755D]">
                      {new Date(o.createdAt).toLocaleDateString('ko-KR')}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-bold text-base text-[#1F3D2B]">{o.productName}</h4>
                    <p className="text-xs text-[#6C584C]">{o.optionName} · 수량 {o.quantity}개</p>
                    <p className="text-sm font-black text-[#1F3D2B]">
                      결제금액: {o.totalPrice.toLocaleString()}원 ({o.paymentMethod === 'bank' ? '무통장입금' : '카드/간편결제'})
                    </p>
                  </div>

                  <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#E8DFC8] text-xs space-y-1">
                    <div>
                      <strong className="text-[#4A5D4E]">받는 분:</strong> {o.customerName} ({o.phone})
                    </div>
                    <div>
                      <strong className="text-[#4A5D4E]">배송지:</strong> {o.address} {o.detailAddress}
                    </div>
                    {o.trackingNumber ? (
                      <div className="text-blue-700 font-bold flex items-center gap-1 pt-1">
                        <Truck className="w-3.5 h-3.5" />
                        <span>배송정보: {o.courier} (운송장: {o.trackingNumber})</span>
                      </div>
                    ) : (
                      <div className="text-[#7A6B5D] pt-1">
                        택배사: {o.courier || 'CJ대한통운'} (발송 준비 중)
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
