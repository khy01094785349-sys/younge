import React, { useState } from 'react';
import { User } from '../types/auth';
import { 
  X, Lock, Mail, UserCheck, Eye, EyeOff, AlertCircle, 
  CheckCircle2, Sparkles, ArrowRight, ShieldCheck 
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  initialMode?: 'login' | 'register';
  promptMessage?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'login',
  promptMessage,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Sync mode if initialMode changes
  React.useEffect(() => {
    setMode(initialMode);
    setErrorMessage('');
    setSuccessMessage('');
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const validateInputs = () => {
    // Email check
    if (!email.trim()) {
      setErrorMessage('이메일 주소를 입력해 주세요.');
      return false;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setErrorMessage('올바른 이메일 형식(예: name@example.com)으로 입력해 주세요.');
      return false;
    }

    // Name check for registration
    if (mode === 'register' && !name.trim()) {
      setErrorMessage('받는 분 성함(이름)을 입력해 주세요.');
      return false;
    }

    // Password check (must be at least 6 characters)
    if (!password) {
      setErrorMessage('비밀번호를 입력해 주세요.');
      return false;
    }
    if (password.length < 6) {
      setErrorMessage(
        `비밀번호는 최소 6자 이상이어야 합니다. (현재 입력하신 비밀번호는 ${password.length}자입니다)`
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!validateInputs()) {
      return;
    }

    setLoading(true);
    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const payload =
        mode === 'login'
          ? { email: email.trim(), password }
          : {
              email: email.trim(),
              password,
              name: name.trim(),
              phone: phone.trim(),
              address: address.trim(),
              detailAddress: detailAddress.trim(),
            };

      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            setSuccessMessage(data.message || '인증이 완료되었습니다.');
            setTimeout(() => {
              onLoginSuccess(data.user);
              onClose();
            }, 500);
            return;
          } else if (data.message) {
            setErrorMessage(data.message);
            return;
          }
        }
      } catch (err) {
        console.warn('API 연결 불가, 로컬 스토리지 인증으로 대체 진행', err);
      }

      // Local storage fallback for static deployments (Vercel / GitHub Pages)
      const cleanEmail = email.trim().toLowerCase();
      let localUsers: any[] = [];
      try {
        localUsers = JSON.parse(localStorage.getItem('saengsik_users') || '[]');
      } catch {}

      // Default seeded user if empty
      if (!localUsers.some((u) => u.email.toLowerCase() === 'khy01094785349@gmail.com')) {
        localUsers.push({
          id: 'user_khy',
          email: 'khy01094785349@gmail.com',
          password: 'password123',
          name: '김혜영',
          phone: '01094785349',
          address: '충북 충주시 행정13길20',
          detailAddress: '101호',
        });
      }

      if (mode === 'login') {
        const found = localUsers.find((u) => u.email.toLowerCase() === cleanEmail);
        if (!found) {
          setErrorMessage('가입되지 않은 이메일 주소입니다. 먼저 회원가입을 진행해 주세요.');
          return;
        }
        if (found.password !== password) {
          setErrorMessage('비밀번호가 올바르지 않습니다. 다시 확인해 주세요.');
          return;
        }
        setSuccessMessage(`${found.name} 님, 환영합니다!`);
        setTimeout(() => {
          onLoginSuccess(found);
          onClose();
        }, 500);
      } else {
        // Register mode
        const existing = localUsers.find((u) => u.email.toLowerCase() === cleanEmail);
        if (existing) {
          setErrorMessage('이미 가입되어 있는 이메일 주소입니다. 로그인해 주세요.');
          return;
        }
        const newUser = {
          id: `user_${Date.now()}`,
          email: cleanEmail,
          password,
          name: name.trim(),
          phone: phone.trim(),
          address: address.trim(),
          detailAddress: detailAddress.trim(),
        };
        localUsers.push(newUser);
        try {
          localStorage.setItem('saengsik_users', JSON.stringify(localUsers));
        } catch {}
        setSuccessMessage(`${newUser.name} 님, 회원가입이 완료되었습니다!`);
        setTimeout(() => {
          onLoginSuccess(newUser);
          onClose();
        }, 500);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('처리 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setLoading(false);
    }
  };

  // Quick fill for demo / user convenience
  const handleQuickFillOwner = () => {
    setEmail('khy01094785349@gmail.com');
    setPassword('password123');
    setName('김혜영');
    setPhone('01094785349');
    setAddress('충북 충주시 행정13길20');
    setDetailAddress('101호');
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-[#FAF7F2] w-full max-w-md rounded-3xl shadow-2xl border border-[#E8DFC8] overflow-hidden my-4">
        {/* Header */}
        <div className="bg-[#1F3D2B] text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <UserCheck className="w-6 h-6 text-[#E8DFC8]" />
            <h3 className="text-xl sm:text-2xl font-black">
              {mode === 'login' ? '바른생식 로그인' : '간편 회원가입'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#E8DFC8] hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Notice banner if prompted during checkout */}
        {promptMessage && (
          <div className="bg-[#E3EBE4] border-b border-[#C5D7C9] p-3.5 px-6 text-xs sm:text-sm text-[#1F3D2B] font-bold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#2A4B37] shrink-0" />
            <span>{promptMessage}</span>
          </div>
        )}

        {/* Tab Toggle: 로그인 / 회원가입 */}
        <div className="p-6 pt-5 pb-3">
          <div className="grid grid-cols-2 p-1 bg-[#E8DFC8]/60 rounded-2xl mb-4 border border-[#D4C5A9]">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage('');
              }}
              className={`py-2.5 rounded-xl text-sm font-black transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-[#1F3D2B] shadow-sm'
                  : 'text-[#6C584C] hover:text-[#1F3D2B]'
              }`}
            >
              로그인
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMessage('');
              }}
              className={`py-2.5 rounded-xl text-sm font-black transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-white text-[#1F3D2B] shadow-sm'
                  : 'text-[#6C584C] hover:text-[#1F3D2B]'
              }`}
            >
              회원가입
            </button>
          </div>

          {/* Error Message Alert (Clear Korean explanation) */}
          {errorMessage && (
            <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm font-bold flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="leading-snug">{errorMessage}</div>
            </div>
          )}

          {/* Success Message Alert */}
          {successMessage && (
            <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name field (for Registration only) */}
            {mode === 'register' && (
              <div>
                <label className="block text-xs sm:text-sm font-bold text-[#4A5D4E] mb-1">
                  성함 (이름) *
                </label>
                <input
                  type="text"
                  placeholder="예: 김혜영"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  className="w-full bg-white border border-[#D4C5A9] rounded-xl px-4 py-2.5 text-base text-[#1F3D2B] outline-none focus:ring-2 focus:ring-[#2A4B37]"
                />
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-[#4A5D4E] mb-1">
                이메일 주소 *
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  className="w-full bg-white border border-[#D4C5A9] rounded-xl pl-4 pr-10 py-2.5 text-base text-[#1F3D2B] outline-none focus:ring-2 focus:ring-[#2A4B37]"
                />
                <Mail className="w-4 h-4 text-[#8A755D] absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs sm:text-sm font-bold text-[#4A5D4E]">
                  비밀번호 * <span className="text-xs font-normal text-[#8A755D]">(6자 이상)</span>
                </label>
                {password.length > 0 && password.length < 6 && (
                  <span className="text-xs font-bold text-red-600">
                    현재 {password.length}자 (최소 6자 필요)
                  </span>
                )}
                {password.length >= 6 && (
                  <span className="text-xs font-bold text-emerald-700">
                    ✓ 6자 이상 충족
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="6자 이상 비밀번호 입력"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  className={`w-full bg-white border rounded-xl pl-4 pr-10 py-2.5 text-base text-[#1F3D2B] outline-none focus:ring-2 ${
                    password.length > 0 && password.length < 6
                      ? 'border-red-400 focus:ring-red-400'
                      : 'border-[#D4C5A9] focus:ring-[#2A4B37]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8A755D] hover:text-[#1F3D2B] cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-[#7A6B5D] mt-1">
                💡 비밀번호가 6자 미만이면 주문 진행이 되지 않으니 6자 이상으로 안전하게 입력해 주세요.
              </p>
            </div>

            {/* Extra registration fields (phone & address prefill) */}
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-[#4A5D4E] mb-1">
                    연락처 (휴대폰 번호)
                  </label>
                  <input
                    type="tel"
                    placeholder="예: 01094785349"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white border border-[#D4C5A9] rounded-xl px-4 py-2.5 text-base text-[#1F3D2B] outline-none focus:ring-2 focus:ring-[#2A4B37]"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-[#4A5D4E] mb-1">
                    기본 배송 주소 (선택)
                  </label>
                  <input
                    type="text"
                    placeholder="예: 충북 충주시 행정13길20, 101호"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-white border border-[#D4C5A9] rounded-xl px-4 py-2.5 text-base text-[#1F3D2B] outline-none focus:ring-2 focus:ring-[#2A4B37]"
                  />
                </div>
              </>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2A4B37] hover:bg-[#1F3D2B] active:bg-[#15251C] text-white text-lg font-black py-4 px-6 rounded-2xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{mode === 'login' ? '로그인하기' : '회원가입 완료하고 계속하기'}</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick 1-Click Fill for Kim Hye-young */}
          <div className="mt-5 pt-4 border-t border-[#E8DFC8] text-center">
            <button
              type="button"
              onClick={handleQuickFillOwner}
              className="text-xs text-[#2A4B37] hover:underline font-bold bg-[#E3EBE4] px-3 py-1.5 rounded-lg border border-[#C5D7C9] cursor-pointer inline-flex items-center gap-1.5"
            >
              <span>👤 김혜영 님 계정으로 자동 입력 (테스트용)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
