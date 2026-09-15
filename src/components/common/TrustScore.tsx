import React from 'react';
import { ShieldAlert, ShieldCheck } from 'lucide-react';
import type { ClinicalTrustBreakdown } from '../../types/mediq';

interface TrustScoreProps {
  score: number;
  breakdown?: ClinicalTrustBreakdown;
  compact?: boolean;
  onOpenEvidence?: () => void;
}

export const TrustScore: React.FC<TrustScoreProps> = ({
  score,
  breakdown,
  compact = false,
  onOpenEvidence,
}) => {
  const isOptimal = score >= 85;

  if (compact) {
    return (
      <div className="flex items-center gap-2 bg-neutral-50 px-2.5 py-1 rounded-md border border-neutral-200">
        <span className="font-mono text-xs font-bold text-neutral-500">C_clin:</span>
        <span
          className={`font-mono text-sm font-bold ${
            isOptimal ? 'text-neutral-900' : 'text-amber-600'
          }`}
        >
          {score}/100
        </span>
        <span
          className={`w-2 h-2 rounded-full ${
            isOptimal ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
          }`}
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-5 border border-neutral-200/90 shadow-xs">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold tracking-widest text-neutral-500 uppercase">
              C_clin • Clinical Trust Metric
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
              Deterministic Aggregation
            </span>
          </div>
          <h3 className="text-xl font-bold text-[#0A0A0A] mt-1 tracking-tight">
            Clinical Trust Score
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Evaluates source provenance, temporal validity, and cross-hospital consensus.
          </p>
        </div>

        <div className="flex flex-col items-end">
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-4xl font-extrabold text-[#0A0A0A] tracking-tight">
              {score}
            </span>
            <span className="font-mono text-sm font-semibold text-neutral-400">/ 100</span>
          </div>
          <span
            className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded text-[11px] font-mono font-semibold uppercase ${
              isOptimal
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {isOptimal ? (
              <>
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Trusted Record
              </>
            ) : (
              <>
                <ShieldAlert className="w-3 h-3 text-red-600" />
                Disputed (Conflict Active)
              </>
            )}
          </span>
        </div>
      </div>

      {/* Trust Meter Progress Bar */}
      <div className="relative h-2.5 w-full bg-neutral-100 rounded-full overflow-hidden border border-neutral-200 mb-6">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${
            isOptimal ? 'bg-[#FFB800]' : 'bg-gradient-to-r from-amber-400 to-red-400'
          }`}
          style={{ width: `${score}%` }}
        />
      </div>

      {/* Sub-metrics Breakdown Grid */}
      {breakdown && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-3 border-t border-neutral-100">
          <div className="bg-[#F8F9FA] p-2.5 rounded-lg border border-neutral-200/60">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-neutral-500">Source Reliability</span>
              <span className="font-mono font-bold text-neutral-900">
                {breakdown.sourceReliability}%
              </span>
            </div>
            <div className="h-1.5 w-full bg-neutral-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-neutral-800 rounded-full"
                style={{ width: `${breakdown.sourceReliability}%` }}
              />
            </div>
          </div>

          <div className="bg-[#F8F9FA] p-2.5 rounded-lg border border-neutral-200/60">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-neutral-500">Cross Validation</span>
              <span
                className={`font-mono font-bold ${
                  breakdown.crossValidation < 80 ? 'text-red-600' : 'text-neutral-900'
                }`}
              >
                {breakdown.crossValidation}%
              </span>
            </div>
            <div className="h-1.5 w-full bg-neutral-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  breakdown.crossValidation < 80 ? 'bg-red-500' : 'bg-neutral-800'
                }`}
                style={{ width: `${breakdown.crossValidation}%` }}
              />
            </div>
          </div>

          <div className="bg-[#F8F9FA] p-2.5 rounded-lg border border-neutral-200/60">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-neutral-500">Recency</span>
              <span className="font-mono font-bold text-neutral-900">
                {breakdown.recency}%
              </span>
            </div>
            <div className="h-1.5 w-full bg-neutral-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-neutral-800 rounded-full"
                style={{ width: `${breakdown.recency}%` }}
              />
            </div>
          </div>

          <div className="bg-[#F8F9FA] p-2.5 rounded-lg border border-neutral-200/60">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-neutral-500">Consistency</span>
              <span
                className={`font-mono font-bold ${
                  breakdown.consistency < 80 ? 'text-red-600' : 'text-neutral-900'
                }`}
              >
                {breakdown.consistency}%
              </span>
            </div>
            <div className="h-1.5 w-full bg-neutral-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  breakdown.consistency < 80 ? 'bg-red-500' : 'bg-neutral-800'
                }`}
                style={{ width: `${breakdown.consistency}%` }}
              />
            </div>
          </div>

          <div className="bg-[#F8F9FA] p-2.5 rounded-lg border border-neutral-200/60">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-neutral-500">Temporal Validity</span>
              <span className="font-mono font-bold text-neutral-900">
                {breakdown.temporalValidity}%
              </span>
            </div>
            <div className="h-1.5 w-full bg-neutral-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-neutral-800 rounded-full"
                style={{ width: `${breakdown.temporalValidity}%` }}
              />
            </div>
          </div>

          <div className="bg-[#F8F9FA] p-2.5 rounded-lg border border-neutral-200/60">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-neutral-500">Provenance</span>
              <span className="font-mono font-bold text-neutral-900">
                {breakdown.provenance}%
              </span>
            </div>
            <div className="h-1.5 w-full bg-neutral-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-neutral-800 rounded-full"
                style={{ width: `${breakdown.provenance}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {onOpenEvidence && (
        <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
          <span className="text-xs text-neutral-500">
            Deterministic cryptographic audit trail available
          </span>
          <button
            onClick={onOpenEvidence}
            className="text-xs font-semibold text-neutral-900 hover:text-amber-600 underline underline-offset-4 flex items-center gap-1"
          >
            Why can I trust this? →
          </button>
        </div>
      )}
    </div>
  );
};
