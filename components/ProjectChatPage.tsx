"use client";

import { useEffect, useRef, useState } from 'react';
import BrandKitSelector from '@/components/BrandKitSelector';
import type { BrandKitName } from '@/components/brandData';
import { Icon } from '@/components/ui/Icon';

export interface ProjectDraft {
  id: string;
  title: string;
  brandKit: BrandKitName;
  initialPrompt: string;
  skill: string | null;
  capability: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ProjectChatPageProps {
  project: ProjectDraft;
  activeBrandKit: BrandKitName;
  onBrandKitChange: (brandKit: BrandKitName) => void;
  onBack: () => void;
}

const buildResponse = (prompt: string, brandKit: BrandKitName, capability: string, skill: string | null) => {
  const workflow = skill ? `，并调用「${skill}」工作流` : '';
  return `已收到。我会基于「${brandKit}」品牌套件${workflow}，按「${capability}」方向推进。\n\n本轮需求：${prompt}\n\n我会先梳理目标与受众，再形成核心创意、内容结构和可执行的交付清单。你可以继续补充渠道、时间、预算或输出格式，我会在当前项目中持续完善。`;
};

export default function ProjectChatPage({
  project,
  activeBrandKit,
  onBrandKitChange,
  onBack,
}: ProjectChatPageProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    project.initialPrompt
      ? [{ id: `${project.id}-user-1`, role: 'user', content: project.initialPrompt }]
      : []
  );
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(Boolean(project.initialPrompt));
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!project.initialPrompt) return;

    const timer = window.setTimeout(() => {
      setMessages(current => [
        ...current,
        {
          id: `${project.id}-assistant-1`,
          role: 'assistant',
          content: buildResponse(project.initialPrompt, project.brandKit, project.capability, project.skill),
        },
      ]);
      setIsGenerating(false);
    }, 700);

    return () => window.clearTimeout(timer);
  }, [project]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  const sendMessage = () => {
    const content = input.trim();
    if (!content || isGenerating) return;

    const turn = messages.length + 1;
    setMessages(current => [
      ...current,
      { id: `${project.id}-user-${turn}`, role: 'user', content },
    ]);
    setInput('');
    setIsGenerating(true);

    window.setTimeout(() => {
      setMessages(current => [
        ...current,
        {
          id: `${project.id}-assistant-${turn}`,
          role: 'assistant',
          content: buildResponse(content, activeBrandKit, project.capability, project.skill),
        },
      ]);
      setIsGenerating(false);
    }, 700);
  };

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-transparent">
      <header className="relative z-[300] flex h-20 shrink-0 items-center justify-between border-b border-white/10 bg-[#0d060a]/80 px-6 shadow-glass backdrop-blur-2xl md:px-10">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="返回生成页"
          >
            <Icon name="ArrowLeft" className="h-4 w-4" />
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-base font-bold text-white">{project.title}</h1>
            <p className="mt-0.5 text-[11px] text-white/40">项目对话 · 自动保存</p>
          </div>
        </div>
        <BrandKitSelector activeBrandKit={activeBrandKit} onBrandKitChange={onBrandKitChange} />
      </header>

      <main className="relative flex-1 overflow-y-auto custom-scrollbar">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-[rgb(var(--brand-rgb)/0.08)] blur-[140px]"></div>
        <div className="relative mx-auto flex min-h-full w-full max-w-4xl flex-col px-5 pb-44 pt-10 md:px-10">
          {messages.length === 0 && (
            <div className="flex flex-1 flex-col items-center justify-center py-24 text-center">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                <Icon name="MessageSquare" className="h-5 w-5 text-[var(--brand-primary)]" />
              </div>
              <h2 className="text-xl font-bold text-white">开始一个新项目</h2>
              <p className="mt-2 max-w-md text-sm leading-6 text-white/45">
                输入你的目标，MICHI 会基于当前品牌套件持续与你协作。
              </p>
            </div>
          )}

          <div className="space-y-8">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-secondary)] shadow-glow">
                    <Icon name="Sparkles" className="h-4 w-4 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] whitespace-pre-wrap rounded-2xl px-5 py-4 text-sm leading-7 ${
                    message.role === 'user'
                      ? 'bg-[rgb(var(--brand-rgb)/0.18)] text-white border border-[rgb(var(--brand-rgb)/0.28)]'
                      : 'border border-white/10 bg-[#1a0f14]/90 text-white/80 shadow-glass'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {isGenerating && (
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-secondary)]">
                  <Icon name="Sparkles" className="h-4 w-4 text-white" />
                </div>
                <div className="flex items-center gap-1.5 rounded-2xl border border-white/10 bg-[#1a0f14]/90 px-5 py-4">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/50"></span>
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/50 [animation-delay:150ms]"></span>
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/50 [animation-delay:300ms]"></span>
                </div>
              </div>
            )}
          </div>
          <div ref={bottomRef}></div>
        </div>
      </main>

      <div className="absolute bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-[#0d060a] via-[#0d060a] to-transparent px-5 pb-6 pt-12 md:px-10">
        <div className="mx-auto w-full max-w-3xl rounded-2xl border border-white/10 bg-[#1a0f14]/95 p-2 shadow-[0_24px_70px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          <textarea
            value={input}
            onChange={event => setInput(event.target.value)}
            onKeyDown={event => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                sendMessage();
              }
            }}
            placeholder="继续描述需求，Enter 发送，Shift + Enter 换行"
            className="min-h-[64px] w-full resize-none bg-transparent px-3 py-2 text-sm leading-6 text-white placeholder:text-white/30 focus:outline-none"
          />
          <div className="flex items-center justify-between border-t border-white/5 px-2 pt-2">
            <div className="flex items-center gap-2 text-[11px] text-white/35">
              <Icon name="Palette" className="h-3.5 w-3.5" />
              {activeBrandKit}
              {project.skill && <span>· {project.skill}</span>}
            </div>
            <button
              type="button"
              onClick={sendMessage}
              disabled={!input.trim() || isGenerating}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--brand-primary)] text-white transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-35"
              aria-label="发送消息"
            >
              <Icon name="ArrowUp" className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
