import React from 'react';
import { Phone, ShoppingBag, Sparkles, PackageSearch, ShieldCheck, User as UserIcon, LogOut, LogIn } from 'lucide-react';
import { User } from '../types/auth';

interface HeaderProps {
  onOrderClick: () => void;
  onOpenLookup: () => void;
  onOpenAdmin: () => void;
  currentUser: User | null;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOrderClick,
  onOpenLookup,
  onOpenAdmin,
  currentUser,
  onOpenAuth,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8DFC8]/80 transition-all">
      {/* Top Banner Notice with Welcome text */}
      <div className="bg-[#1F3D2B] text-[#E8DFC8] py-2 px-3 sm:px-4 text-xs sm:text-sm font-medium flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 truncate">
          {currentUser ? (
            <div className="flex items-center gap-1.5 bg-[#2A4B37] text-white px-2.5 py-0.5 rounded-full border border-[#4A6D56]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <strong className="text-sm sm:text-base font-extrabold text-[#FFF7ED]">
                {currentUser.name} 님 환영합니다!
              </strong>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 truncate">
              <Sparkles className="w-4 h-4 text-[#C2A649] shrink-0" />
              <span className="truncate">
                지금 주문 시 <strong className="text-white font-bold">전용 에코 쉐이커 증정</strong> + <strong className="text-white font-bold">전국 무료배송</strong>
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {currentUser ? (
            <button
              onClick={onLogout}
              className="text-xs bg-[#2A4B37] hover:bg-[#3B6B4C] text-[#E8DFC8] hover:text-white px-2.5 py-1 rounded-md font-bold cursor-pointer transition-colors flex items-center gap-1 border border-[#4A6D56]"
            >
              <LogOut className="w-3 h-3" />
              <span>로그아웃</span>
            </button>
          ) : (
            <button
              onClick={() => onOpenAuth('login')}
              className="text-xs bg-[#2A4B37] hover:bg-[#3B6B4C] text-[#E8DFC8] hover:text-white px-2.5 py-1 rounded-md font-bold cursor-pointer transition-colors flex items-center gap-1 border border-[#4A6D56]"
            >
              <LogIn className="w-3 h-3" />
              <span>로그인 / 회원가입</span>
            </button>
          )}

          <button
            onClick={onOpenAdmin}
            className="text-xs bg-[#2A4B37] hover:bg-[#3B6B4C] text-[#E8DFC8] px-2 py-1 rounded-md font-bold cursor-pointer border border-[#4A6D56]"
            title="상점 사장님 실시간 주문관리 대시보드"
          >
            사장님 관리
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 md:h-20 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#2A4B37] text-white flex items-center justify-center font-black text-xl md:text-2xl shadow-sm tracking-tight">
            生
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl md:text-3xl font-black text-[#1F3D2B] tracking-tight">바른생식</span>
              <span className="text-xs md:text-sm font-semibold text-[#6C584C] hidden sm:inline">純粹生食 50</span>
            </div>
            <p className="text-xs text-[#7A6B5D] hidden xs:block font-medium">국내산 50곡·채소 그대로</p>
          </div>
        </a>

        {/* Desktop Quick Nav */}
        <nav className="hidden lg:flex items-center gap-7 text-base font-semibold text-[#4A5D4E]">
          <a href="#ingredients" className="hover:text-[#1F3D2B] transition-colors">국내산 50종 원료</a>
          <a href="#target" className="hover:text-[#1F3D2B] transition-colors">이런 분께 추천</a>
          <a href="#how-to" className="hover:text-[#1F3D2B] transition-colors">섭취 방법 (1·2·3)</a>
          <a href="#product" className="hover:text-[#1F3D2B] transition-colors">상품 및 가격</a>
          <a href="#faq" className="hover:text-[#1F3D2B] transition-colors">자주 묻는 질문</a>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Welcome User Badge (Desktop view) */}
          {currentUser ? (
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-[#E3EBE4] border border-[#C5D7C9] text-xs sm:text-sm">
              <UserIcon className="w-4 h-4 text-[#2A4B37]" />
              <span className="font-extrabold text-[#1F3D2B]">{currentUser.name} 님</span>
            </div>
          ) : (
            <button
              onClick={() => onOpenAuth('login')}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-[#D4C5A9] text-[#4A5D4E] hover:bg-[#F4EFE6] text-xs sm:text-sm font-bold transition-colors cursor-pointer"
            >
              <UserIcon className="w-4 h-4 text-[#2A4B37]" />
              <span>로그인</span>
            </button>
          )}

          <button
            onClick={onOpenLookup}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-[#D4C5A9] text-[#4A5D4E] hover:bg-[#F4EFE6] text-xs sm:text-sm font-bold transition-colors cursor-pointer"
            title="내 주문 배송 조회"
          >
            <PackageSearch className="w-4 h-4 text-[#2A4B37]" />
            <span>주문조회</span>
          </button>

          <button
            onClick={onOrderClick}
            className="flex items-center gap-2 bg-[#2A4B37] hover:bg-[#1F3D2B] text-white font-bold px-4 py-2.5 sm:px-6 sm:py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all text-sm sm:text-lg active:scale-95 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-[#E8DFC8]" />
            <span>주문하기</span>
          </button>
        </div>
      </div>
    </header>
  );
};
