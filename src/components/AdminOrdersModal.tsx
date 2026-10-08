import React, { useState, useEffect } from 'react';
import { Order, StoreSettings } from '../types/order';
import { 
  X, RefreshCw, Phone, MapPin, Truck, CheckCircle2, Clock, 
  Search, Download, Copy, Settings, AlertCircle, Trash2, Edit3 
} from 'lucide-react';

interface AdminOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminOrdersModal: React.FC<AdminOrdersModalProps> = ({ isOpen, onClose }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<string>('');
  const [editCourier, setEditCourier] = useState<string>('CJ대한통운');
  const [editTracking, setEditTracking] = useState<string>('');
  
  // Settings Tab
  const [activeTab, setActiveTab] = useState<'orders' | 'settings'>('orders');
  const [settings, setSettings] = useState<StoreSettings>({
    bankName: '농협은행',
    accountNumber: '352-0109-4785-33',
    accountHolder: '바른생식 (김혜영)',
    shopName: '바른생식',
    contactPhone: '010-9478-5349',
  });
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [copyToast, setCopyToast] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    let combinedOrders: Order[] = [];
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.orders)) {
          combinedOrders = data.orders;
        }
      }
    } catch (err) {
      console.warn('Backend orders fetch failed, reading local orders', err);
    }

    try {
      const localOrders: Order[] = JSON.parse(localStorage.getItem('saengsik_orders') || '[]');
      // Merge unique by id
      const existingIds = new Set(combinedOrders.map((o) => o.id));
      for (const lo of localOrders) {
        if (!existingIds.has(lo.id)) {
          combinedOrders.push(lo);
        }
      }
    } catch {}

    setOrders(combinedOrders);
    setLoading(false);
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data) {
        setSettings(data);
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchOrders();
      fetchSettings();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setCopyToast(msg);
    setTimeout(() => setCopyToast(''), 2500);
  };

  const handleUpdateStatus = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: editStatus,
          courier: editCourier,
          trackingNumber: editTracking,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEditingOrderId(null);
        fetchOrders();
        showToast('주문 정보가 업데이트되었습니다.');
      }
    } catch (err) {
      alert('상태 변경 실패');
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('정말 이 주문을 삭제하시겠습니까?')) return;
    try {
      const res = await fetch(`/api/orders/${orderId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchOrders();
        showToast('주문이 삭제되었습니다.');
      }
    } catch (err) {
      alert('삭제 실패');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        setSettingsSaved(true);
        setTimeout(() => setSettingsSaved(false), 2000);
      }
    } catch (err) {
      alert('설정 저장 실패');
    }
  };

  const handleCopyAddresses = () => {
    const text = filteredOrders
      .map((o) => `[${o.customerName}] ${o.phone} | ${o.address} ${o.detailAddress} | ${o.productName}(${o.quantity}개) | 요청: ${o.deliveryNote}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    showToast('배송 목록이 클립보드에 복사되었습니다.');
  };

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.customerName.includes(searchTerm) ||
      o.phone.includes(searchTerm) ||
      o.id.includes(searchTerm) ||
      o.address.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = orders.reduce((acc, o) => acc + (o.totalPrice || 0), 0);
  const waitingDepositCount = orders.filter((o) => o.status === '입금대기').length;
  const preparingCount = orders.filter((o) => o.status === '배송준비' || o.status === '결제완료').length;
  const shippingCount = orders.filter((o) => o.status === '배송중').length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-[#D4C5A9] overflow-hidden my-4 max-h-[92vh] flex flex-col">
        {/* Toast */}
        {copyToast && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-[#1F3D2B] text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-xl border border-[#D4C5A9] animate-bounce">
            {copyToast}
          </div>
        )}

        {/* Modal Top Header */}
        <div className="bg-[#1F3D2B] text-white px-6 py-4.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#2A4B37] text-white flex items-center justify-center font-black text-sm">
              管
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black">사장님 실시간 주문관리</h3>
              <p className="text-xs text-[#C4D5C9]">외부 고객이 주문한 내역이 실시간으로 여기에 기록됩니다.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchOrders}
              className="p-2 rounded-xl bg-[#2A4B37] hover:bg-[#3B6B4C] text-[#E8DFC8] hover:text-white transition-colors cursor-pointer"
              title="새로고침"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#E8DFC8] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Top Summary Stat Cards */}
        <div className="bg-[#FAF7F2] p-4 sm:p-5 border-b border-[#E8DFC8] grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
          <div className="bg-white p-3.5 rounded-xl border border-[#E8DFC8] shadow-xs">
            <span className="text-xs font-bold text-[#7A6B5D] block">총 접수 주문</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-[#1F3D2B]">{orders.length}건</span>
              <span className="text-xs text-[#2A4B37] font-semibold">{totalRevenue.toLocaleString()}원</span>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-[#E8DFC8] shadow-xs">
            <span className="text-xs font-bold text-amber-700 block">입금 대기 (무통장)</span>
            <div className="text-2xl font-black text-amber-800 mt-1">{waitingDepositCount}건</div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-[#E8DFC8] shadow-xs">
            <span className="text-xs font-bold text-blue-700 block">배송 준비중</span>
            <div className="text-2xl font-black text-blue-800 mt-1">{preparingCount}건</div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-[#E8DFC8] shadow-xs">
            <span className="text-xs font-bold text-emerald-700 block">배송중 (발송완료)</span>
            <div className="text-2xl font-black text-emerald-800 mt-1">{shippingCount}건</div>
          </div>
        </div>

        {/* Tab Controls & Search Bar */}
        <div className="px-5 py-3 border-b border-[#E8DFC8] flex flex-wrap items-center justify-between gap-3 shrink-0 bg-white">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-xl text-sm font-black transition-colors cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-[#2A4B37] text-white shadow-sm'
                  : 'bg-[#FAF7F2] text-[#4A5D4E] hover:bg-[#F0E9DA]'
              }`}
            >
              주문 목록 ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 rounded-xl text-sm font-black transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'settings'
                  ? 'bg-[#2A4B37] text-white shadow-sm'
                  : 'bg-[#FAF7F2] text-[#4A5D4E] hover:bg-[#F0E9DA]'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>입금계좌 & 상점설정</span>
            </button>
          </div>

          {activeTab === 'orders' && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#FAF7F2] border border-[#D4C5A9] rounded-xl px-3 py-1.5 text-xs sm:text-sm font-bold text-[#1F3D2B] outline-none"
              >
                <option value="all">전체 상태</option>
                <option value="입금대기">입금대기</option>
                <option value="결제완료">결제완료</option>
                <option value="배송준비">배송준비</option>
                <option value="배송중">배송중</option>
                <option value="배송완료">배송완료</option>
              </select>

              {/* Search */}
              <div className="relative flex-1 sm:w-56">
                <Search className="w-4 h-4 text-[#8A755D] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="이름, 전화번호, 주소"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#D4C5A9] rounded-xl pl-9 pr-3 py-1.5 text-xs sm:text-sm text-[#1F3D2B] outline-none"
                />
              </div>

              <button
                onClick={handleCopyAddresses}
                className="bg-[#FAF7F2] hover:bg-[#E8DFC8] border border-[#D4C5A9] text-[#1F3D2B] px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
                title="택배 배송용 주소 일괄 복사"
              >
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">주소 일괄복사</span>
              </button>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 bg-[#FAF7F2]/60">
          {activeTab === 'settings' ? (
            /* Settings Tab: 입금 계좌 및 상점 정보 */
            <form onSubmit={handleSaveSettings} className="max-w-xl mx-auto bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DFC8] shadow-md space-y-5">
              <div>
                <h4 className="text-xl font-black text-[#1F3D2B] mb-1">무통장 입금 계좌 안내 설정</h4>
                <p className="text-xs text-[#7A6B5D]">고객이 무통장입금을 선택했을 때 안내되는 입금 계좌 정보입니다.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-[#4A5D4E] mb-1">은행명</label>
                  <input
                    type="text"
                    required
                    value={settings.bankName}
                    onChange={(e) => setSettings({ ...settings, bankName: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#D4C5A9] rounded-xl px-4 py-2.5 text-base text-[#1F3D2B] outline-none"
                    placeholder="예: 농협은행, 국민은행, 카카오뱅크"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#4A5D4E] mb-1">계좌번호</label>
                  <input
                    type="text"
                    required
                    value={settings.accountNumber}
                    onChange={(e) => setSettings({ ...settings, accountNumber: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#D4C5A9] rounded-xl px-4 py-2.5 text-base text-[#1F3D2B] outline-none"
                    placeholder="예: 352-0109-4785-33"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#4A5D4E] mb-1">예금주 성함</label>
                  <input
                    type="text"
                    required
                    value={settings.accountHolder}
                    onChange={(e) => setSettings({ ...settings, accountHolder: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#D4C5A9] rounded-xl px-4 py-2.5 text-base text-[#1F3D2B] outline-none"
                    placeholder="예: 바른생식 (김혜영)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#4A5D4E] mb-1">사장님 대표 연락처</label>
                  <input
                    type="text"
                    required
                    value={settings.contactPhone}
                    onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#D4C5A9] rounded-xl px-4 py-2.5 text-base text-[#1F3D2B] outline-none"
                    placeholder="예: 010-9478-5349"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#2A4B37] hover:bg-[#1F3D2B] text-white font-bold py-3.5 rounded-xl shadow-md cursor-pointer transition-colors"
                >
                  {settingsSaved ? '✓ 저장되었습니다!' : '계좌 정보 저장하기'}
                </button>
              </div>
            </form>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-16 text-[#8A755D]">
              <AlertCircle className="w-12 h-12 mx-auto text-[#B5A492] mb-3" />
              <p className="text-lg font-bold">등록된 주문이 없습니다.</p>
              <p className="text-xs text-[#A39281] mt-1">외부 고객이 '주문하기'를 완료하면 여기에 자동으로 표시됩니다.</p>
            </div>
          ) : (
            /* Orders List */
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const isEditing = editingOrderId === order.id;

                const getStatusBadge = (status: string) => {
                  switch (status) {
                    case '입금대기':
                      return <span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full text-xs font-black">입금대기</span>;
                    case '결제완료':
                    case '배송준비':
                      return <span className="bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full text-xs font-black">배송준비중</span>;
                    case '배송중':
                      return <span className="bg-purple-100 text-purple-800 px-2.5 py-1 rounded-full text-xs font-black">배송중</span>;
                    case '배송완료':
                      return <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full text-xs font-black">배송완료</span>;
                    default:
                      return <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-full text-xs font-black">{status}</span>;
                  }
                };

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl p-5 border border-[#E8DFC8] shadow-sm hover:shadow-md transition-shadow"
                  >
                    {/* Header info */}
                    <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#E8DFC8] gap-2">
                      <div className="flex items-center gap-2.5">
                        {getStatusBadge(order.status)}
                        <span className="text-sm font-black text-[#1F3D2B]">{order.id}</span>
                        <span className="text-xs text-[#7A6B5D]">
                          {new Date(order.createdAt).toLocaleString('ko-KR')}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (isEditing) {
                              setEditingOrderId(null);
                            } else {
                              setEditingOrderId(order.id);
                              setEditStatus(order.status);
                              setEditCourier(order.courier || 'CJ대한통운');
                              setEditTracking(order.trackingNumber || '');
                            }
                          }}
                          className="px-3 py-1 rounded-lg bg-[#FAF7F2] hover:bg-[#E8DFC8] text-[#2A4B37] text-xs font-bold border border-[#D4C5A9] flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>{isEditing ? '닫기' : '상태/송장 변경'}</span>
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer"
                          title="주문 삭제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Order Details Body */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 py-4 items-center">
                      {/* Customer Info */}
                      <div className="md:col-span-4 space-y-1">
                        <div className="flex items-center gap-2">
                          <strong className="text-lg font-black text-[#1F3D2B]">{order.customerName}</strong>
                          <a
                            href={`tel:${order.phone}`}
                            className="inline-flex items-center gap-1 text-xs text-[#2A4B37] font-bold bg-[#E3EBE4] px-2 py-0.5 rounded hover:bg-[#C5D7C9]"
                          >
                            <Phone className="w-3 h-3" />
                            <span>{order.phone}</span>
                          </a>
                        </div>
                        <div className="text-xs text-[#5A4E42] flex items-start gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#8A755D] shrink-0 mt-0.5" />
                          <span>{order.address} {order.detailAddress}</span>
                        </div>
                        <div className="text-xs text-[#7A6B5D] bg-[#FAF7F2] p-1.5 rounded-lg border border-[#E8DFC8]">
                          요청사항: {order.deliveryNote || '없음'}
                        </div>
                      </div>

                      {/* Product & Payment Info */}
                      <div className="md:col-span-5 space-y-1">
                        <div className="text-sm font-bold text-[#1F3D2B]">
                          {order.productName} ({order.optionName})
                        </div>
                        <div className="text-xs text-[#6C584C]">
                          수량: <strong>{order.quantity}개</strong> | 결제방식: {' '}
                          <strong className="text-[#2A4B37]">
                            {order.paymentMethod === 'bank' ? '무통장입금' : order.paymentMethod === 'card' ? '신용카드' : '간편결제'}
                          </strong>
                        </div>
                        {order.trackingNumber && (
                          <div className="text-xs text-blue-700 font-semibold flex items-center gap-1">
                            <Truck className="w-3.5 h-3.5" />
                            <span>{order.courier}: {order.trackingNumber}</span>
                          </div>
                        )}
                      </div>

                      {/* Total Price */}
                      <div className="md:col-span-3 text-right">
                        <span className="text-xs text-[#7A6B5D] block">결제 금액</span>
                        <span className="text-xl font-black text-[#1F3D2B]">
                          {order.totalPrice.toLocaleString()}원
                        </span>
                        <span className="text-xs text-emerald-700 font-bold block">무료배송</span>
                      </div>
                    </div>

                    {/* Inline Edit Form for Status & Tracking */}
                    {isEditing && (
                      <div className="mt-3 pt-3 border-t border-[#E8DFC8] bg-[#FAF7F2] p-3.5 rounded-xl space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-[#4A5D4E] mb-1">주문 상태</label>
                            <select
                              value={editStatus}
                              onChange={(e) => setEditStatus(e.target.value)}
                              className="w-full bg-white border border-[#D4C5A9] rounded-lg p-2 text-xs font-bold"
                            >
                              <option value="입금대기">입금대기</option>
                              <option value="결제완료">결제완료</option>
                              <option value="배송준비">배송준비</option>
                              <option value="배송중">배송중</option>
                              <option value="배송완료">배송완료</option>
                              <option value="주문취소">주문취소</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-[#4A5D4E] mb-1">택배사</label>
                            <select
                              value={editCourier}
                              onChange={(e) => setEditCourier(e.target.value)}
                              className="w-full bg-white border border-[#D4C5A9] rounded-lg p-2 text-xs font-bold"
                            >
                              <option value="CJ대한통운">CJ대한통운</option>
                              <option value="우체국택배">우체국택배</option>
                              <option value="한진택배">한진택배</option>
                              <option value="로젠택배">로젠택배</option>
                              <option value="롯데택배">롯데택배</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-[#4A5D4E] mb-1">운송장 번호</label>
                            <input
                              type="text"
                              value={editTracking}
                              onChange={(e) => setEditTracking(e.target.value)}
                              placeholder="숫자만 입력"
                              className="w-full bg-white border border-[#D4C5A9] rounded-lg p-2 text-xs"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setEditingOrderId(null)}
                            className="px-3 py-1.5 rounded-lg bg-white border border-[#D4C5A9] text-xs font-bold text-[#5A4E42] cursor-pointer"
                          >
                            취소
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(order.id)}
                            className="px-4 py-1.5 rounded-lg bg-[#2A4B37] text-white text-xs font-bold cursor-pointer hover:bg-[#1F3D2B]"
                          >
                            변경내용 저장
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
