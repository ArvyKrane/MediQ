import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  Building2,
  Calendar,
  UserCheck,
  Hash,
  ArrowRight,
  HelpCircle,
  Stethoscope,
} from 'lucide-react';
import { useMediq } from '../../context/MediqContext';
import { TrustScore } from '../common/TrustScore';
import { ConflictAlert } from '../common/ConflictAlert';

export const Screen4ClinicalTrust: React.FC = () => {
  const {
    clinicalTrustScore,
    clinicalTrustBreakdown,
    recordSources,
    isConflictLocked,
    isConflictResolved,
    resolvedBloodGroup,
    lockConflict,
    resolveConflict,
    setCurrentScreen,
    setSelectedEvidenceItem,
  } = useMediq();

  const [showDirectVerifyModal, setShowDirectVerifyModal] = useState(false);
  const [selectedBloodChoice, setSelectedBloodChoice] = useState<'B+' | 'O+'>('B+');

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-wider text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Screen 04 &bull; Clinical Trust Engine
            </span>
            <span className="text-[11px] font-mono text-neutral-400">
              Deterministic Conflict Gate
            </span>
          </div>
          <h2 className="text-2xl font-black text-neutral-950 tracking-tight mt-1">
            VERIFY MEDICAL HISTORY
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5 font-mono">
            Patient: <strong className="text-neutral-950 font-sans">Aarav Mehta</strong> (MED-0192) &bull; Age: 21 &bull; Identity Confirmed
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedEvidenceItem('Blood Group (B+ vs O+)')}
            className="px-3 py-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-xs font-semibold text-neutral-800 flex items-center gap-1.5 shadow-2xs"
          >
            <HelpCircle className="w-3.5 h-3.5 text-neutral-500" />
            <span>Why can I trust this?</span>
          </button>
        </div>
      </div>

      {/* Prominent Clinical Conflict Warning Card */}
      <ConflictAlert
        onVerifyClick={() => setShowDirectVerifyModal(true)}
      />

      {/* Main Clinical Trust Score Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Score & 6 Sub-metrics (7 cols) */}
        <div className="lg:col-span-7">
          <TrustScore
            score={clinicalTrustScore}
            breakdown={clinicalTrustBreakdown}
            onOpenEvidence={() => setSelectedEvidenceItem('Clinical Provenance Vector')}
          />
        </div>

        {/* Right Side: Quick Action & Guidance Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-neutral-200/90 p-5 shadow-xs">
            <h3 className="font-bold text-sm text-neutral-950 flex items-center gap-2 pb-3 border-b border-neutral-100">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <span>CLINICAL GOVERNANCE RULE</span>
            </h3>

            <div className="space-y-3 mt-3 text-xs">
              <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200/80">
                <span className="font-mono text-[10px] text-neutral-400 uppercase font-bold block">
                  ZERO-MERGE INVARIANT
                </span>
                <p className="text-neutral-700 mt-1 leading-relaxed">
                  Unlike traditional EHRs that overwrite data or guess the most recent value, MEDIQ isolates conflicting records into an unmerged state.
                </p>
              </div>

              <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200 text-amber-950">
                <span className="font-mono text-[10px] text-amber-800 uppercase font-bold block">
                  FATAL CONFLICT SAFEGUARD
                </span>
                <p className="mt-1 leading-relaxed text-[11px]">
                  Blood group mismatch (B+ vs O+) carries fatal acute hemolytic transfusion reaction risk. The field remains locked until certified bedside testing or dual-doctor override.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col gap-2">
                {!isConflictResolved ? (
                  <button
                    type="button"
                    onClick={() => setShowDirectVerifyModal(true)}
                    className="w-full py-2.5 px-4 rounded-xl bg-neutral-950 hover:bg-black text-[#FFB800] text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Stethoscope className="w-4 h-4" />
                    <span>OVERRIDE &amp; ATTEST CLINICIAN VERIFICATION</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setCurrentScreen('emergency-contact')}
                    className="w-full py-2.5 px-4 rounded-xl bg-neutral-950 hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span className="text-[#FFB800]">PROCEED TO EMERGENCY CONTACT</span>
                    <ArrowRight className="w-4 h-4 text-[#FFB800]" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Medical Records From Different Sources Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-mono text-xs uppercase font-bold text-neutral-900 tracking-wider">
              MULTIPLE SOURCE RECORDS (INDEPENDENT HEALTH NODES)
            </span>
            <p className="text-xs text-neutral-500 mt-0.5">
              Comparison across 3 distinct accredited medical establishments.
            </p>
          </div>
          <span className="font-mono text-xs text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded">
            Cryptographically Anchored
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Source 1: Hospital A (Apollo) */}
          <div className="bg-white rounded-xl border-2 border-neutral-900 p-4 shadow-xs relative">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-neutral-400 font-bold uppercase">
                  Hospital A
                </span>
                <h4 className="font-bold text-sm text-neutral-950">Apollo Speciality</h4>
              </div>
              <span className="font-mono text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-1.5 py-0.5 rounded">
                High Confidence
              </span>
            </div>

            <div className="my-3 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
              <span className="text-[10px] font-mono text-neutral-400 block uppercase">
                Recorded Blood Group
              </span>
              <div className="text-2xl font-black font-mono text-neutral-950 mt-0.5">
                B+
              </div>
              <span className="text-[10px] font-mono text-emerald-700 font-semibold">
                Verified Cross-Match (2025)
              </span>
            </div>

            <div className="space-y-1 text-[11px] text-neutral-600 font-mono">
              <div>Institution: Tier-1 Trauma</div>
              <div>Attesting: Dr. R. Sengupta</div>
              <div className="text-neutral-400 text-[10px] truncate">Hash: 8f7e2c90a1...b4e</div>
            </div>

            <button
              onClick={() => setSelectedEvidenceItem('Apollo Speciality (B+)')}
              className="mt-3 w-full py-1.5 text-xs text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg font-semibold transition-colors"
            >
              Inspect Proof &bull; SHA-256
            </button>
          </div>

          {/* Source 2: Hospital B (Fortis) — CONFLICTING */}
          <div className="bg-white rounded-xl border-2 border-red-400 p-4 shadow-xs relative bg-red-50/10">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-red-600 font-bold uppercase">
                  Hospital B &bull; CONFLICT
                </span>
                <h4 className="font-bold text-sm text-neutral-950">Fortis Memorial</h4>
              </div>
              <span className="font-mono text-[10px] bg-red-100 text-red-800 border border-red-300 font-bold px-1.5 py-0.5 rounded">
                High Confidence
              </span>
            </div>

            <div className="my-3 p-3 bg-red-50 rounded-lg border border-red-200">
              <span className="text-[10px] font-mono text-red-600 block uppercase">
                Recorded Blood Group
              </span>
              <div className="text-2xl font-black font-mono text-red-600 mt-0.5">
                O+
              </div>
              <span className="text-[10px] font-mono text-red-700 font-semibold">
                Transcribed Intake Record (2023)
              </span>
            </div>

            <div className="space-y-1 text-[11px] text-neutral-600 font-mono">
              <div>Institution: Regional Trauma</div>
              <div>Attesting: Dr. K. Verma</div>
              <div className="text-neutral-400 text-[10px] truncate">Hash: 1a4b88d3e9...07c</div>
            </div>

            <button
              onClick={() => setSelectedEvidenceItem('Fortis Memorial (O+)')}
              className="mt-3 w-full py-1.5 text-xs text-red-700 bg-red-100 hover:bg-red-200 rounded-lg font-semibold transition-colors"
            >
              Inspect Conflict &bull; SHA-256
            </button>
          </div>

          {/* Source 3: Diagnostic Center */}
          <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs relative">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-neutral-400 font-bold uppercase">
                  Diagnostic Center
                </span>
                <h4 className="font-bold text-sm text-neutral-950">Apex Diagnostic Lab</h4>
              </div>
              <span className="font-mono text-[10px] bg-amber-100 text-amber-800 border border-amber-300 font-bold px-1.5 py-0.5 rounded">
                Medium Confidence
              </span>
            </div>

            <div className="my-3 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
              <span className="text-[10px] font-mono text-neutral-400 block uppercase">
                Recorded Blood Group
              </span>
              <div className="text-2xl font-black font-mono text-neutral-950 mt-0.5">
                B+
              </div>
              <span className="text-[10px] font-mono text-neutral-600 font-semibold">
                NABL Serology Panel (2025)
              </span>
            </div>

            <div className="space-y-1 text-[11px] text-neutral-600 font-mono">
              <div>Institution: Accredited Lab</div>
              <div>Attesting: Dr. V. Nambiar</div>
              <div className="text-neutral-400 text-[10px] truncate">Hash: 6e031b28fd...9fa</div>
            </div>

            <button
              onClick={() => setSelectedEvidenceItem('Apex Diagnostic (B+)')}
              className="mt-3 w-full py-1.5 text-xs text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg font-semibold transition-colors"
            >
              Inspect Lab &bull; SHA-256
            </button>
          </div>
        </div>
      </div>

      {/* Direct Clinician Verification Modal */}
      {showDirectVerifyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-neutral-200 shadow-2xl">
            <div className="flex items-center gap-2 text-neutral-900 mb-2">
              <Stethoscope className="w-5 h-5 text-amber-600" />
              <h3 className="text-lg font-bold">
                Attending Clinician Blood Group Attestation
              </h3>
            </div>
            <p className="text-xs text-neutral-600 mb-4">
              Specify the verified blood group based on stat emergency bedside cross-match. This overrides disputed historical entries and updates Clinical Trust (C_clin) to 87%.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                type="button"
                onClick={() => setSelectedBloodChoice('B+')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  selectedBloodChoice === 'B+'
                    ? 'border-[#FFB800] bg-amber-50 ring-2 ring-[#FFB800]'
                    : 'border-neutral-200 bg-white'
                }`}
              >
                <span className="font-mono text-2xl font-black text-neutral-900">B+</span>
                <span className="text-[11px] text-neutral-600 block mt-1">
                  Supported by Apollo Hospital &amp; Apex Labs
                </span>
                <span className="text-[10px] font-mono text-emerald-700 font-bold">
                  Recommended Match
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedBloodChoice('O+')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  selectedBloodChoice === 'O+'
                    ? 'border-[#FFB800] bg-amber-50 ring-2 ring-[#FFB800]'
                    : 'border-neutral-200 bg-white'
                }`}
              >
                <span className="font-mono text-2xl font-black text-neutral-900">O+</span>
                <span className="text-[11px] text-neutral-600 block mt-1">
                  Fortis Memorial ER 2023 transcription
                </span>
                <span className="text-[10px] font-mono text-amber-700 font-bold">
                  Single Source
                </span>
              </button>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setShowDirectVerifyModal(false)}
                className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  resolveConflict(selectedBloodChoice);
                  setShowDirectVerifyModal(false);
                }}
                className="px-4 py-2 text-xs font-bold bg-neutral-950 hover:bg-black text-[#FFB800] rounded-xl shadow-xs"
              >
                CONFIRM {selectedBloodChoice} (Elevate C_clin → 87%)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
