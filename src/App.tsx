/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { IngredientsSection } from './components/IngredientsSection';
import { TargetAudienceSection } from './components/TargetAudienceSection';
import { HowToDrinkSection } from './components/HowToDrinkSection';
import { ProductOrderSection } from './components/ProductOrderSection';
import { ReviewsAndFaqSection } from './components/ReviewsAndFaqSection';
import { Footer } from './components/Footer';
import { MobileStickyBar } from './components/MobileStickyBar';
import { OrderModal } from './components/OrderModal';
import { AdminOrdersModal } from './components/AdminOrdersModal';
import { OrderLookupModal } from './components/OrderLookupModal';
import { AuthModal } from './components/AuthModal';
import { PRODUCT_OPTIONS, ProductOption } from './data/saengsikData';
import { User } from './types/auth';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('saengsik_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authPromptMessage, setAuthPromptMessage] = useState('');
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isLookupModalOpen, setIsLookupModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<ProductOption>(PRODUCT_OPTIONS[0]);
  const [quantity, setQuantity] = useState(1);

  // Sync user state with localStorage
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('saengsik_user', JSON.stringify(user));
    } catch {}

    // Execute pending action (e.g. open order modal)
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('saengsik_user');
    } catch {}
  };

  const handleOpenAuth = (mode: 'login' | 'register' = 'login', prompt = '') => {
    setAuthMode(mode);
    setAuthPromptMessage(prompt);
    setIsAuthModalOpen(true);
  };

  // When ordering: Check if logged in first!
  const handleSelectOptionAndOrder = (option: ProductOption, qty: number) => {
    setSelectedOption(option);
    setQuantity(qty);

    if (!currentUser) {
      setPendingAction(() => () => {
        setIsOrderModalOpen(true);
      });
      handleOpenAuth(
        'login',
        '주문하시려면 먼저 회원가입 또는 로그인을 해주세요. (비밀번호는 6자 이상)'
      );
      return;
    }

    setIsOrderModalOpen(true);
  };

  const handleScrollToProductOrOrder = () => {
    if (!currentUser) {
      setPendingAction(() => () => {
        const productEl = document.getElementById('product');
        if (productEl) {
          productEl.scrollIntoView({ behavior: 'smooth' });
        } else {
          setIsOrderModalOpen(true);
        }
      });
      handleOpenAuth(
        'login',
        '주문하시려면 먼저 로그인 또는 회원가입을 해주세요.'
      );
      return;
    }

    const productEl = document.getElementById('product');
    if (productEl) {
      productEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      setIsOrderModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C332D] flex flex-col font-sans selection:bg-[#2A4B37] selection:text-white">
      {/* Top Navigation with Order, Lookup, Admin, Auth triggers */}
      <Header
        onOrderClick={handleScrollToProductOrOrder}
        onOpenLookup={() => setIsLookupModalOpen(true)}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        currentUser={currentUser}
        onOpenAuth={(mode) => handleOpenAuth(mode || 'login')}
        onLogout={handleLogout}
      />

      {/* Prominent Welcome Banner when Logged In */}
      {currentUser && (
        <div className="bg-[#E3EBE4] border-b border-[#C5D7C9] py-2.5 px-4 text-center">
          <div className="max-w-5xl mx-auto flex items-center justify-center gap-2 text-sm sm:text-base font-extrabold text-[#1F3D2B]">
            <CheckCircle2 className="w-5 h-5 text-[#2A4B37] shrink-0" />
            <span>
              <strong className="underline underline-offset-4 decoration-[#2A4B37] text-lg">
                {currentUser.name} 님 환영합니다!
              </strong>{' '}
              오늘도 속 편하고 든든한 하루한잔 생식을 전해드립니다.
            </span>
          </div>
        </div>
      )}

      {/* Hero Section: 하루한잔, 간편한 한끼 + 큰 주문하기 버튼 */}
      <main className="flex-1">
        <HeroSection onOrderClick={handleScrollToProductOrOrder} />

        {/* 50 Domestic Ingredients Section */}
        <IngredientsSection />

        {/* 이런 분께 좋아요 (3가지) */}
        <TargetAudienceSection onOrderClick={handleScrollToProductOrOrder} />

        {/* 물이나 우유에 타서 드세요 (1 -> 2 -> 3 순서) */}
        <HowToDrinkSection />

        {/* 상품 1개와 가격, 큰 "주문하기" 버튼 */}
        <ProductOrderSection onSelectOptionAndOrder={handleSelectOptionAndOrder} />

        {/* 고객 후기 & 자주 묻는 질문 */}
        <ReviewsAndFaqSection />
      </main>

      {/* Footer & 식품위생법 일반식품 안내 */}
      <Footer
        onOpenLookup={() => setIsLookupModalOpen(true)}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
      />

      {/* 모바일 화면 하단 고정 주문 바 */}
      <MobileStickyBar onOrderClick={handleScrollToProductOrOrder} />

      {/* 회원가입 / 로그인 모달 (이메일 & 6자이상 비밀번호 검증) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setPendingAction(null);
        }}
        onLoginSuccess={handleLoginSuccess}
        initialMode={authMode}
        promptMessage={authPromptMessage}
      />

      {/* 실시간 고객 주문 모달 (로그인 회원 정보 자동 입력) */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        selectedOption={selectedOption}
        quantity={quantity}
        onOpenLookup={() => setIsLookupModalOpen(true)}
        currentUser={currentUser}
      />

      {/* 사장님 실시간 주문관리 대시보드 */}
      <AdminOrdersModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />

      {/* 고객용 실시간 주문/배송 조회 모달 */}
      <OrderLookupModal
        isOpen={isLookupModalOpen}
        onClose={() => setIsLookupModalOpen(false)}
      />
    </div>
  );
}
