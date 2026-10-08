import React from 'react';
import { Phone, Mail, ShieldAlert, Award, Clock, PackageCheck, Settings } from 'lucide-react';

interface FooterProps {
  onOpenLookup?: () => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLookup, onOpenAdmin }) => {
  return (
    <footer className="bg-[#1C2C20] text-[#D8E2DC] pt-14 pb-28 sm:pb-16 border-t border-[#2A4B37]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Top Disclaimer Notice (Essential compliance: 일반 식품 안내) */}
        <div className="bg-[#24382A] rounded-2xl p-4 sm:p-5 mb-10 border border-[#35523E] flex items-start gap-3 text-xs sm:text-sm text-[#C4D5C9]">
          <ShieldAlert className="w-5 h-5 text-[#E3B873] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-white block mb-0.5">[일반식품 필수 표시사항 안내]</strong>
            본 제품은 질병의 예방 및 치료를 위한 의약품이나 건강기능식품이 아니며, 우리 땅에서 난 국내산 곡류 및 채소류를 위생적으로 가공한 일반식품(생식류/식사대용식품)입니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-[#2A4B37]">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FAF7F2] text-[#1F3D2B] flex items-center justify-center font-black text-xl">
                生
              </div>
              <span className="text-2xl font-black text-white">바른생식</span>
            </div>
            <p className="text-sm text-[#9FB3A5] leading-relaxed">
              우리 땅에서 난 50가지 건강한 원료를 정직하게 담아내는 프리미엄 생식 전문점입니다. 매일 아침 바쁜 당신의 건강한 한 끼를 응원합니다.
            </p>
            <div className="text-xs text-[#829989] space-y-1 pt-2">
              <p>상호명: 바른생식농산 | 대표: 김혜영 | 사업자등록번호: 123-45-67890</p>
              <p>통신판매업신고: 제2026-충북충주-0123호</p>
              <p>소재지: 충북 충주시 행정13길 20 101호</p>
            </div>
          </div>

          {/* Customer Support */}
          <div className="md:col-span-4 space-y-2">
            <h4 className="text-white font-bold text-base mb-3">고객센터 & 주문상담</h4>
            <div className="text-2xl font-black text-[#E8DFC8] flex items-center gap-2">
              <Phone className="w-6 h-6 text-[#73A682]" />
              <a href="tel:010-9478-5349" className="hover:underline">010-9478-5349</a>
            </div>
            <p className="text-xs text-[#9FB3A5]">
              평일 오전 09:00 ~ 오후 18:00 (점심시간 12:00 ~ 13:00)<br />
              주말 및 공휴일 전화상담 가능
            </p>
            <div className="pt-2 flex flex-wrap gap-2">
              {onOpenLookup && (
                <button
                  onClick={onOpenLookup}
                  className="px-3 py-1.5 rounded-lg bg-[#24382A] hover:bg-[#35523E] text-xs font-bold text-white border border-[#35523E] cursor-pointer flex items-center gap-1.5"
                >
                  <PackageCheck className="w-3.5 h-3.5 text-[#73A682]" />
                  <span>내 주문/배송 조회</span>
                </button>
              )}
              {onOpenAdmin && (
                <button
                  onClick={onOpenAdmin}
                  className="px-3 py-1.5 rounded-lg bg-[#2A4B37] hover:bg-[#3B6B4C] text-xs font-bold text-[#E8DFC8] border border-[#4A6D56] cursor-pointer flex items-center gap-1.5"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>사장님 주문관리 대시보드</span>
                </button>
              )}
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="md:col-span-3 space-y-2">
            <h4 className="text-white font-bold text-base mb-3">안심 쇼핑 보장</h4>
            <ul className="text-xs text-[#9FB3A5] space-y-2">
              <li className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#73A682]" /> 100% 국내산 원료 원산지 보증
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#73A682]" /> 오후 2시 이전 결제 시 당일 출고
              </li>
              <li className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#73A682]" /> 파손 시 100% 무료 맞교환
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 text-center text-xs text-[#7A9181]">
          © 2026 바른생식 (Pure Saengsik). All rights reserved.
        </div>
      </div>
    </footer>
  );
};
