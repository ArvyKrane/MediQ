import React from 'react';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

interface ConfidenceMeterProps {
  score: number; // e.g. 94.2
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showFormula?: boolean;
}

export const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({
  score,
  label = 'Identity Confidence',
  size = 'md',
  showFormula = false,
}) => {
  const isAboveThreshold = score >= 90;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-mono text-neutral-600 uppercase tracking-wider">
          <span className="font-bold text-[#0A0A0A]">C_id</span>
          <span>•</span>
          <span>{label}</span>
          {showFormula && (
            <span className="text-[10px] text-neutral-400 font-normal">
              (f(Face, Fingerprint, OCR))
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-bold text-[#0A0A0A] bg-amber-50 px-2 py-0.5 rounded border border-amber-200/80">
            {score.toFixed(1)}%
          </span>
          <span
            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold uppercase ${
              isAboveThreshold
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}
          >
            {isAboveThreshold ? (
              <>
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Verified (&gt;90%)
              </>
            ) : (
              <>
                <AlertTriangle className="w-3 h-3 text-amber-600" />
                Candidate
              </>
            )}
          </span>
        </div>
      </div>

      {/* Precision Track */}
      <div className="relative h-2 w-full bg-neutral-100 rounded-full overflow-hidden border border-neutral-200/80">
        <div
          className="h-full bg-gradient-to-r from-amber-400 via-[#FFB800] to-amber-500 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
        />
        {/* Threshold marker at 90% */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-neutral-900/60 z-10"
          style={{ left: '90%' }}
          title="Verification Threshold (90%)"
        />
      </div>

      <div className="flex justify-between text-[10px] text-neutral-400 font-mono">
        <span>0% UNCERTAIN</span>
        <span className="text-neutral-500 font-medium">90% THRESHOLD</span>
        <span>100% SECURE</span>
      </div>
    </div>
  );
};
