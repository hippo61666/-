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
    <div className="min-h-screen bg-surface-50 flex flex-col justify-center items-center p-4 animate-fade-in relative overflow-hidden">
      {/* Soft gradient blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary-100 rounded-full blur-[100px] animate-float opacity-70"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-secondary-50 rounded-full blur-[100px] animate-float opacity-70" style={{animationDelay: '3s'}}></div>
      
      <div className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-3xl shadow-soft overflow-hidden relative z-10 animate-slide-up border border-white/50">
        <div className="p-8 md:p-10">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
              <Icon name="Hexagon" className="w-8 h-8 stroke-gradient" />
            </div>
          </div>
          
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">欢迎登录系统</h1>
            <p className="text-slate-500 text-sm">请输入您的工作邮箱和密码继续</p>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 rounded-2xl flex items-center gap-3 animate-fade-in">
              <Icon name="AlertCircle" className="w-5 h-5 text-red-500 shrink-0" />
              <p className="text-sm text-red-600 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">工作账号</label>
              <div className="relative">
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-4 bg-surface-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500/50 text-slate-800 outline-none transition-all placeholder:text-slate-400 shadow-inner"
                  placeholder="admin@example.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">密码</label>
              <div className="relative">
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-4 bg-surface-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500/50 text-slate-800 outline-none transition-all placeholder:text-slate-400 shadow-inner"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <button 
              type="submit" 
              disabled={isLoading}
              className="btn-gradient w-full py-4 mt-6 rounded-2xl font-bold focus:outline-none flex justify-center items-center gap-2 text-white"
            >
              {isLoading ? <Icon name="Loader2" className="w-5 h-5 animate-spin text-white" /> : <span>登录系统</span>}
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400 mb-2">测试账号</p>
            <div className="inline-flex gap-4 text-sm font-medium text-slate-600 bg-slate-50 px-4 py-2 rounded-xl">
              <span>admin@example.com</span>
              <span className="text-slate-300">|</span>
              <span>password123</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
