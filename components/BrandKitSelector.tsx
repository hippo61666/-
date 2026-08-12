"use client";

import { useState } from 'react';
import { brandKits, brandLogoBackgrounds, brandLogos, type BrandKitName } from '@/components/brandData';
import { Icon } from '@/components/ui/Icon';

interface BrandKitSelectorProps {
  activeBrandKit: BrandKitName;
  onBrandKitChange: (brandKit: BrandKitName) => void;
  className?: string;
}

export default function BrandKitSelector({
  activeBrandKit,
  onBrandKitChange,
  className = '',
}: BrandKitSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative z-[400] ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-[rgb(var(--brand-rgb)/0.1)] border border-[rgb(var(--brand-rgb)/0.3)] rounded-full text-xs font-bold text-[var(--brand-primary)] shadow-[0_0_15px_rgb(var(--brand-rgb)/0.15)] hover:bg-[rgb(var(--brand-rgb)/0.2)] transition-all focus:outline-none backdrop-blur-md"
      >
        <Icon name="Palette" className="w-3 h-3" />
        <span className="whitespace-nowrap">当前关联套件：</span>
        <span
          className="flex h-[18px] w-[18px] shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/60 p-0.5"
          style={{ backgroundColor: brandLogoBackgrounds[activeBrandKit] }}
        >
          <img
            src={brandLogos[activeBrandKit]}
            alt={`${activeBrandKit} Logo`}
            className="h-full w-full object-contain"
          />
        </span>
        <span className="whitespace-nowrap">{activeBrandKit}</span>
        <Icon name={isOpen ? 'ChevronUp' : 'ChevronDown'} className="w-3 h-3 ml-1" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-[#120910] border border-white/15 rounded-xl shadow-[0_24px_80px_rgba(0,0,0,0.75)] overflow-hidden z-[9999] animate-fade-in origin-top-right">
          {brandKits.map((kit) => (
            <button
              key={kit}
              onClick={() => {
                onBrandKitChange(kit);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center gap-2 ${
                activeBrandKit === kit
                  ? 'bg-[rgb(var(--brand-rgb)/0.1)] text-[var(--brand-primary)] font-bold'
                  : 'text-white/80 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span
                className="flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/60 p-0.5"
                style={{ backgroundColor: brandLogoBackgrounds[kit] }}
              >
                <img
                  src={brandLogos[kit]}
                  alt={`${kit} Logo`}
                  className="h-full w-full object-contain"
                />
              </span>
              <span className="flex-1">{kit}</span>
              {activeBrandKit === kit && <Icon name="Check" className="w-4 h-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
