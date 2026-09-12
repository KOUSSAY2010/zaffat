import React, { useState } from 'react';
import { api } from '../../api/client';
import { Lock, User, Music2, ArrowRight, Loader2, ShieldCheck, AlertCircle } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBackToHome: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToHome }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMessage('يرجى إدخال اسم المستخدم وكلمة المرور.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const res = await api.login(username.trim(), password.trim());
    setIsLoading(false);

    if (res.success) {
      onLoginSuccess();
    } else {
      setErrorMessage(res.message || 'بيانات الدخول غير صحيحة.');
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg bg-music-pattern flex items-center justify-center p-4 relative">
      
      {/* Return to website link */}
      <button
        onClick={onBackToHome}
        className="absolute top-6 right-6 inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-brand-gold-dark hover:text-brand-text-primary transition-colors bg-white/80 px-4 py-2 rounded-xl border border-brand-borderSoft shadow-sm"
      >
        <ArrowRight className="w-4 h-4" />
        <span>العودة إلى الواجهة الرئيسية</span>
      </button>

      {/* Login Card */}
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-brand-border shadow-soft relative overflow-hidden">
        
        {/* Decorative glow */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-brand-gold/10 rounded-full blur-2xl pointer-events-none" />

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-brand-ivory border border-brand-border flex items-center justify-center mb-3 shadow-sm">
            <Music2 className="w-8 h-8 text-brand-gold-dark" />
          </div>
          <h2 className="text-3xl font-normal font-rakkas text-brand-text-primary">
            لوحة تحكم زفات أطياف
          </h2>
          <p className="text-sm font-amiri text-brand-text-muted mt-1">
            تسجيل الدخول الآمن لإدارة الزفات والأسعار
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Username */}
          <div>
            <label className="block text-xs font-bold text-brand-text-secondary mb-1.5 font-cairo">
              اسم المستخدم
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-brand-text-light">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="أدخل اسم المستخدم..."
                className="w-full pr-10 pl-4 py-3 rounded-xl bg-brand-ivory/50 border border-brand-borderSoft text-sm font-tajawal text-brand-text-primary focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/40 transition-all"
                dir="ltr"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-brand-text-secondary mb-1.5 font-cairo">
              كلمة المرور
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-brand-text-light">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pr-10 pl-4 py-3 rounded-xl bg-brand-ivory/50 border border-brand-borderSoft text-sm font-tajawal text-brand-text-primary focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/40 transition-all"
                dir="ltr"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3.5 px-4 rounded-xl font-cairo font-bold text-sm text-white bg-gradient-to-r from-brand-gold via-amber-500 to-brand-gold hover:from-amber-500 hover:to-brand-gold shadow-md hover:shadow-gold-glow transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جارٍ التحقق...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>دخول لوحة التحكم</span>
              </>
            )}
          </button>

        </form>

        {/* Credentials reminder for staging */}
        <div className="mt-6 pt-4 border-t border-brand-borderSoft text-center">
          <span className="text-[11px] text-brand-text-light font-mono block" dir="ltr">
            Staging Default: admin / atyaf_admin_2026
          </span>
        </div>

      </div>

    </div>
  );
};
