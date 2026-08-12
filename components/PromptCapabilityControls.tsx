"use client";

import { useState } from 'react';
import type { BrandSkill, BrandWorkflow } from '@/components/brandData';
import { Icon } from '@/components/ui/Icon';

interface PromptCapabilityControlsProps {
  availableSkills: BrandSkill[];
  availableWorkflows: BrandWorkflow[];
  selectedSkills: string[];
  selectedWorkflow: string | null;
  onSkillsChange: (skills: string[]) => void;
  onWorkflowChange: (workflow: string | null) => void;
  dropdownDirection?: 'up' | 'down';
}

interface SelectedSkillChipsProps {
  selectedSkills: string[];
  onRemove: (skill: string) => void;
}

export function SelectedSkillChips({ selectedSkills, onRemove }: SelectedSkillChipsProps) {
  if (selectedSkills.length === 0) return null;

  return (
    <div className="mb-3 flex flex-wrap items-center gap-2">
      {selectedSkills.map(skill => (
        <div
          key={skill}
          className="group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-xs font-medium text-white/85 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] transition-colors hover:bg-white/10"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[rgb(var(--brand-rgb)/0.15)]">
            <Icon name="Zap" className="h-3.5 w-3.5 text-[var(--brand-primary)]" />
          </span>
          <span>{skill}</span>
          <button
            type="button"
            onClick={() => onRemove(skill)}
            className="-mr-1 flex h-5 w-5 items-center justify-center rounded-md text-white/45 opacity-0 transition-all hover:bg-white/10 hover:text-white group-hover:opacity-100 focus:opacity-100"
            aria-label={`取消 Skill ${skill}`}
          >
            <Icon name="X" className="h-3 w-3" />
          </button>
        </div>
      ))}
    </div>
  );
}

export default function PromptCapabilityControls({
  availableSkills,
  availableWorkflows,
  selectedSkills,
  selectedWorkflow,
  onSkillsChange,
  onWorkflowChange,
  dropdownDirection = 'down',
}: PromptCapabilityControlsProps) {
  const [isSkillOpen, setIsSkillOpen] = useState(false);
  const [isWorkflowOpen, setIsWorkflowOpen] = useState(false);
  const dropdownPosition = dropdownDirection === 'up' ? 'bottom-full mb-2' : 'top-full mt-2';

  const toggleSkill = (skill: string) => {
    onSkillsChange(
      selectedSkills.includes(skill)
        ? selectedSkills.filter(item => item !== skill)
        : [...selectedSkills, skill]
    );
    setIsSkillOpen(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-xl bg-white/5 px-3 py-1.5 text-[11px] font-medium text-white/70 transition-colors hover:bg-white/10"
        >
          <Icon name="Plus" className="h-3.5 w-3.5" />
          添加参考
        </button>

        <div className="relative z-[220]">
          <button
            type="button"
            onClick={() => {
              setIsSkillOpen(current => !current);
              setIsWorkflowOpen(false);
            }}
            className="flex items-center gap-1.5 rounded-xl bg-white/5 px-3 py-1.5 text-[11px] font-medium text-white/70 transition-colors hover:bg-white/10"
          >
            <Icon name="Zap" className="h-3.5 w-3.5" />
            <span>调用 Skill{selectedSkills.length > 0 ? ` (${selectedSkills.length})` : ''}</span>
            <Icon name={isSkillOpen ? 'ChevronUp' : 'ChevronDown'} className="h-3 w-3 opacity-50" />
          </button>

          {isSkillOpen && (
            <div className={`absolute left-0 z-[9999] max-h-72 w-72 overflow-y-auto rounded-xl border border-white/15 bg-[#120910] shadow-[0_24px_80px_rgba(0,0,0,0.75)] custom-scrollbar animate-fade-in ${dropdownPosition}`}>
              {availableSkills.map(skill => {
                const isSelected = selectedSkills.includes(skill.name);
                return (
                  <button
                    key={skill.name}
                    type="button"
                    onClick={() => toggleSkill(skill.name)}
                    className={`flex w-full items-start gap-2 px-4 py-3 text-left text-sm transition-colors ${
                      isSelected
                        ? 'bg-[rgb(var(--brand-rgb)/0.1)] text-[var(--brand-primary)]'
                        : 'text-white/80 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center">
                      {isSelected && <Icon name="Check" className="h-4 w-4" />}
                    </span>
                    <span className="flex flex-col gap-1">
                      <span className="font-bold">{skill.name}</span>
                      <span className="text-[11px] font-normal leading-relaxed text-white/40">{skill.description}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="relative z-[210]">
          <div className={`group flex items-center rounded-xl transition-colors ${
            selectedWorkflow
              ? 'border border-[rgb(var(--brand-rgb)/0.3)] bg-[rgb(var(--brand-rgb)/0.12)] text-[var(--brand-primary)]'
              : 'bg-white/5 text-white/70 hover:bg-white/10'
          }`}>
            <button
              type="button"
              onClick={() => {
                setIsWorkflowOpen(current => !current);
                setIsSkillOpen(false);
              }}
              className="flex items-center gap-1.5 py-1.5 pl-3 pr-2 text-[11px] font-medium"
            >
              <Icon name="Workflow" className="h-3.5 w-3.5" />
              <span>{selectedWorkflow ? `工作流：${selectedWorkflow}` : '调用工作流'}</span>
            </button>
            {selectedWorkflow ? (
              <button
                type="button"
                onClick={() => onWorkflowChange(null)}
                className="relative mr-1 flex h-6 w-6 items-center justify-center rounded-lg transition-colors hover:bg-white/10 focus:bg-white/10"
                aria-label={`取消工作流 ${selectedWorkflow}`}
              >
                <Icon
                  name={isWorkflowOpen ? 'ChevronUp' : 'ChevronDown'}
                  className="absolute h-3 w-3 opacity-50 transition-opacity group-hover:opacity-0 group-focus-within:opacity-0"
                />
                <Icon
                  name="X"
                  className="absolute h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
                />
              </button>
            ) : (
              <Icon name={isWorkflowOpen ? 'ChevronUp' : 'ChevronDown'} className="mr-2 h-3 w-3 opacity-50" />
            )}
          </div>

          {isWorkflowOpen && (
            <div className={`absolute left-0 z-[9999] max-h-72 w-72 overflow-y-auto rounded-xl border border-white/15 bg-[#120910] shadow-[0_24px_80px_rgba(0,0,0,0.75)] custom-scrollbar animate-fade-in ${dropdownPosition}`}>
              {availableWorkflows.map(workflow => {
                const isSelected = selectedWorkflow === workflow.name;
                return (
                  <button
                    key={workflow.name}
                    type="button"
                    onClick={() => {
                      onWorkflowChange(workflow.name);
                      setIsWorkflowOpen(false);
                    }}
                    className={`flex w-full items-start gap-2 px-4 py-3 text-left text-sm transition-colors ${
                      isSelected
                        ? 'bg-[rgb(var(--brand-rgb)/0.1)] text-[var(--brand-primary)]'
                        : 'text-white/80 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center">
                      {isSelected && <Icon name="Check" className="h-4 w-4" />}
                    </span>
                    <span className="flex flex-col gap-1">
                      <span className="font-bold">{workflow.name}</span>
                      <span className="text-[11px] font-normal leading-relaxed text-white/40">{workflow.description}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
    </div>
  );
}
