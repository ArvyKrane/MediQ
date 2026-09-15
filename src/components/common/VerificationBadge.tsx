import React from 'react';
import { ShieldCheck, ShieldAlert, Clock, AlertCircle } from 'lucide-react';

interface VerificationBadgeProps {
  level: 'High' | 'Medium' | 'Low' | 'Disputed' | 'Pending';
  text?: string;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({ level, text }) => {
  switch (level) {
    case 'High':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          {text || 'Trust: HIGH'}
        </span>
      );
    case 'Medium':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-amber-50 text-amber-800 border border-amber-200">
          <Clock className="w-3 h-3 text-amber-600" />
          {text || 'Trust: MEDIUM'}
        </span>
      );
    case 'Low':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-neutral-100 text-neutral-700 border border-neutral-200">
          <AlertCircle className="w-3 h-3 text-neutral-500" />
          {text || 'Trust: LOW'}
        </span>
      );
    case 'Disputed':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-red-50 text-red-700 border border-red-200 animate-pulse">
          <ShieldAlert className="w-3 h-3 text-red-600" />
          {text || 'DISPUTED'}
        </span>
      );
    case 'Pending':
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-neutral-100 text-neutral-600 border border-neutral-200">
          <Clock className="w-3 h-3 text-neutral-400" />
          {text || 'PENDING'}
        </span>
      );
  }
};

interface AccessBadgeProps {
  status: 'allowed' | 'restricted' | 'break-glass';
  compact?: boolean;
}

export const AccessBadge: React.FC<AccessBadgeProps> = ({ status, compact = false }) => {
  if (status === 'allowed') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
        <span>✓</span> {!compact && 'Allowed'}
      </span>
    );
  }
  if (status === 'break-glass') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 text-amber-900 border border-amber-300">
        <span>⚠</span> {!compact && 'Break-Glass'}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-neutral-100 text-neutral-600 border border-neutral-200">
      <span>🔒</span> {!compact && 'Restricted'}
    </span>
  );
};
