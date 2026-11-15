import React from 'react';
import { CheckCircle, XCircle, Clock, Cpu, AlertTriangle, Code } from 'lucide-react';

const VERDICT_CONFIG = {
  AC:  { label: 'Accepted',              bg: 'bg-green-500/20',  border: 'border-green-500',  text: 'text-green-400',  icon: CheckCircle },
  WA:  { label: 'Wrong Answer',          bg: 'bg-red-500/20',    border: 'border-red-500',    text: 'text-red-400',    icon: XCircle },
  TLE: { label: 'Time Limit Exceeded',   bg: 'bg-yellow-500/20', border: 'border-yellow-500', text: 'text-yellow-400', icon: Clock },
  MLE: { label: 'Memory Limit Exceeded', bg: 'bg-orange-500/20', border: 'border-orange-500', text: 'text-orange-400', icon: Cpu },
  RE:  { label: 'Runtime Error',         bg: 'bg-purple-500/20', border: 'border-purple-500', text: 'text-purple-400', icon: AlertTriangle },
  CE:  { label: 'Compilation Error',     bg: 'bg-pink-500/20',   border: 'border-pink-500',   text: 'text-pink-400',   icon: Code },
};

const SIZE_CLASSES = {
  sm: { badge: 'px-2 py-0.5 text-xs', icon: 12 },
  md: { badge: 'px-3 py-1 text-sm',   icon: 14 },
  lg: { badge: 'px-4 py-2 text-base', icon: 18 },
};

export default function VerdictBadge({ verdict, size = 'md', showLabel = true }) {
  const cfg = VERDICT_CONFIG[verdict] || {
    label: verdict || 'Unknown',
    bg: 'bg-blue-500/20',
    border: 'border-blue-500',
    text: 'text-blue-400',
    icon: CheckCircle,
  };
  const sz = SIZE_CLASSES[size] || SIZE_CLASSES.md;
  const Icon = cfg.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded border font-semibold ${cfg.bg} ${cfg.border} ${cfg.text} ${sz.badge}`}
    >
      <Icon size={sz.icon} strokeWidth={2} />
      {showLabel && <span>{cfg.label}</span>}
    </span>
  );
}
