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
    <div className="min-h-screen bg-[#0d060a] flex flex-col justify-center items-center p-4 animate-fade-in relative overflow-hidden selection:bg-[var(--brand-primary)] selection:text-white">
      {/* Soft gradient blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[var(--brand-primary)] rounded-full blur-[120px] animate-float opacity-20"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[var(--brand-secondary)] rounded-full blur-[120px] animate-float opacity-20" style={{animationDelay: '3s'}}></div>
      
      <div className="max-w-md w-full bg-[#1a0f14]/80 backdrop-blur-2xl rounded-[2rem] shadow-glass overflow-hidden relative z-10 animate-slide-up border border-white/10">
        <div className="p-8 md:p-10">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
              <Icon name="Hexagon" className="w-10 h-10 stroke-gradient drop-shadow-[0_0_15px_rgb(var(--brand-rgb) / 0.5)]" />
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
                  className="w-full px-5 py-4 bg-white/[0.03] border border-white/10 rounded-2xl focus:border-[rgb(var(--brand-rgb)/0.5)] focus:bg-white/[0.05] text-white outline-none transition-all placeholder:text-white/20 hover:border-white/20"
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
                  className="w-full px-5 py-4 bg-white/[0.03] border border-white/10 rounded-2xl focus:border-[rgb(var(--brand-rgb)/0.5)] focus:bg-white/[0.05] text-white outline-none transition-all placeholder:text-white/20 hover:border-white/20"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-4 mt-8 rounded-2xl font-bold focus:outline-none flex justify-center items-center gap-2 text-white bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] hover:opacity-90 transition-opacity shadow-[0_0_20px_rgb(var(--brand-rgb) / 0.3)]"
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
