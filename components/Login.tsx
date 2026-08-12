"use client";

import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // 模拟网络请求和权限校验
    setTimeout(() => {
      setIsLoading(false);
      if (email === 'admin@example.com' && password === 'password123') {
        onLogin();
      } else {
        setError('账号或密码不正确，请重试');
      }
    }, 1000);
  };

  return (
    <div data-brand-theme="michi" className="min-h-screen bg-[#050505] flex flex-col justify-center items-center p-4 animate-fade-in relative overflow-hidden selection:bg-[var(--brand-primary)] selection:text-white">
      {/* Soft gradient blobs */}
      <div className="absolute left-[4%] top-[8%] h-[420px] w-[420px] rounded-full bg-[var(--brand-primary)] opacity-[0.08] blur-[150px] animate-float"></div>
      <div className="absolute bottom-[2%] right-[3%] h-[360px] w-[360px] rounded-full bg-[var(--brand-secondary)] opacity-[0.06] blur-[145px] animate-float" style={{animationDelay: '3.5s'}}></div>
      
      <div className="max-w-md w-full bg-[linear-gradient(145deg,rgba(18,13,14,0.96),rgba(8,7,7,0.95))] backdrop-blur-2xl rounded-[2rem] shadow-[0_28px_100px_rgba(0,0,0,0.72),0_0_35px_rgba(230,0,0,0.06)] overflow-hidden relative z-10 animate-slide-up border border-[rgb(var(--brand-rgb)/0.2)]">
        <div className="p-8 md:p-10">
          <div className="flex justify-center mb-6">
            <div className="relative h-10 w-32 overflow-hidden">
              <img
                src="/michi-logo.png"
                alt="MICHI"
                className="absolute left-1/2 top-1/2 w-[196px] max-w-none -translate-x-1/2 -translate-y-1/2"
              />
            </div>
          </div>
          
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">欢迎登录系统</h1>
            <p className="text-white/40 text-sm">请输入您的工作邮箱和密码继续</p>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3 animate-fade-in">
              <Icon name="AlertCircle" className="w-5 h-5 text-red-400 shrink-0" />
              <p className="text-sm text-red-400 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/60 ml-1 uppercase tracking-wider">工作账号</label>
              <div className="relative group">
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-4 bg-black/20 border border-[rgb(var(--brand-rgb)/0.18)] rounded-2xl focus:border-[rgb(var(--brand-rgb)/0.7)] focus:bg-[rgb(var(--brand-rgb)/0.06)] focus:shadow-[0_0_20px_rgb(var(--brand-rgb)/0.12)] text-white outline-none transition-all placeholder:text-white/20 hover:border-[rgb(var(--brand-rgb)/0.36)]"
                  placeholder="admin@example.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/60 ml-1 uppercase tracking-wider">密码</label>
              <div className="relative group">
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-4 bg-black/20 border border-[rgb(var(--brand-rgb)/0.18)] rounded-2xl focus:border-[rgb(var(--brand-rgb)/0.7)] focus:bg-[rgb(var(--brand-rgb)/0.06)] focus:shadow-[0_0_20px_rgb(var(--brand-rgb)/0.12)] text-white outline-none transition-all placeholder:text-white/20 hover:border-[rgb(var(--brand-rgb)/0.36)]"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-4 mt-8 rounded-2xl font-bold focus:outline-none flex justify-center items-center gap-2 text-white bg-gradient-to-r from-[#8F0000] via-[#E60000] to-[#FF4A4A] hover:brightness-110 hover:shadow-[0_0_38px_rgba(230,0,0,0.55)] transition-all shadow-[0_0_30px_rgba(230,0,0,0.42)]"
            >
              {isLoading ? <Icon name="Loader2" className="w-5 h-5 animate-spin text-white" /> : <span>登录系统</span>}
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/30 mb-3">测试账号</p>
            <div className="inline-flex items-center gap-4 text-sm font-medium text-white/60 bg-white/5 border border-white/5 px-4 py-2 rounded-xl">
              <span>admin@example.com</span>
              <span className="text-white/20">|</span>
              <span>password123</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
