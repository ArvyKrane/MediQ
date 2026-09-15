import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Fingerprint,
  Camera,
  FileText,
  GitMerge,
  ArrowRight,
  Sparkles,
  Building,
  CreditCard,
  History,
  Ambulance,
} from 'lucide-react';
import { useMediq } from '../../context/MediqContext';
import { ConfidenceMeter } from '../common/ConfidenceMeter';

export const Screen3IdentityVerification: React.FC = () => {
  const {
    identityConfidence,
    identityStatus,
    confirmIdentity,
    setCurrentScreen,
  } = useMediq();

  const [hasConfirmedLocal, setHasConfirmedLocal] = useState(
    identityStatus === 'VERIFIED'
  );

  const handleConfirm = () => {
    confirmIdentity();
    setHasConfirmedLocal(true);
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-wider text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Screen 03 &bull; Identity Attestation
            </span>
            <span className="text-[11px] font-mono text-neutral-400">
              C_id Deterministic Gate
            </span>
          </div>
          <h2 className="text-2xl font-black text-neutral-950 tracking-tight mt-1">
            Patient Identity Verification Flow
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Cross-verifying candidate face vectors against registered biometrics, national identifiers, and clinical anchors.
          </p>
        </div>

        {hasConfirmedLocal && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-mono font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>IDENTITY VERIFIED ✓</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Identity Snapshot & Verification Sources (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Main Patient Identity Card */}
          <div className="bg-white rounded-2xl border border-neutral-200/90 p-6 shadow-xs relative overflow-hidden">
            <div className="flex items-start justify-between pb-4 border-b border-neutral-100">
              <div>
                <span className="font-mono text-xs text-neutral-400 uppercase font-semibold">
                  PATIENT IDENTITY
                </span>
                <h3 className="text-2xl font-black text-neutral-950 mt-0.5">
                  Aarav Mehta
                </h3>
                <div className="flex items-center gap-2 mt-1 text-xs font-mono text-neutral-500">
                  <span>Candidate ID: <strong className="text-neutral-800">MED-0192</strong></span>
                  <span>&bull;</span>
                  <span>DOB: 14 Aug 2005 (21y)</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono font-bold uppercase bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded">
                  {hasConfirmedLocal ? 'Confirmed Target' : 'Candidate Match'}
                </span>
              </div>
            </div>

            {/* Confidence Meter C_id */}
            <div className="my-5 bg-[#F8F9FA] p-4 rounded-xl border border-neutral-200/80">
              <ConfidenceMeter score={identityConfidence} showFormula={true} />
            </div>

            {/* Verification Sources Checklist */}
            <div className="space-y-2.5">
              <span className="font-mono text-xs uppercase font-bold text-neutral-500 tracking-wider block">
                VERIFICATION SOURCES &amp; SIGNALS
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* FaceScan */}
                <div className="p-3 rounded-xl border border-neutral-200/80 bg-white flex items-center justify-between shadow-2xs">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                      <Camera className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-neutral-900">FaceScan</div>
                      <div className="text-[11px] font-mono text-neutral-500">94.2% Geometric Fit</div>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    ✓ Match
                  </span>
                </div>

                {/* Fingerprint */}
                <div className="p-3 rounded-xl border border-neutral-200/80 bg-white flex items-center justify-between shadow-2xs">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                      <Fingerprint className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-neutral-900">Fingerprint</div>
                      <div className="text-[11px] font-mono text-neutral-500">Capacitive Minutiae</div>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    ✓ Strong Match
                  </span>
                </div>

                {/* OCR / Document */}
                <div className="p-3 rounded-xl border border-neutral-200/80 bg-white flex items-center justify-between shadow-2xs">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-neutral-900">OCR / Document</div>
                      <div className="text-[11px] font-mono text-neutral-500">Driver License Record</div>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    ✓ Supporting
                  </span>
                </div>

                {/* Cross-source consistency */}
                <div className="p-3 rounded-xl border border-neutral-200/80 bg-white flex items-center justify-between shadow-2xs">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                      <GitMerge className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-neutral-900">Consistency</div>
                      <div className="text-[11px] font-mono text-neutral-500">4 External Anchor Nodes</div>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    ✓ Consistent
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 pt-5 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              {!hasConfirmedLocal ? (
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="w-full py-3 px-6 rounded-xl bg-neutral-950 hover:bg-black text-[#FFB800] font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-all"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>CONFIRM IDENTITY (BIND PATIENT)</span>
                </button>
              ) : (
                <div className="w-full space-y-2">
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      IDENTITY VERIFIED &bull; AARAV MEHTA (MED-0192)
                    </span>
                    <span className="font-mono text-[10px] text-emerald-700">LOCK ENGAGED</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setCurrentScreen('clinical-trust')}
                    className="w-full py-3 px-6 rounded-xl bg-neutral-950 hover:bg-black text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all group"
                  >
                    <span className="text-[#FFB800]">VERIFY MEDICAL RECORD</span>
                    <ArrowRight className="w-4 h-4 text-[#FFB800] group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Identity Evidence Timeline (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-neutral-200/90 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <span className="font-mono text-xs uppercase font-bold text-neutral-900 tracking-wider">
                IDENTITY EVIDENCE TIMELINE
              </span>
              <span className="text-[11px] font-mono text-neutral-400">
                Audited Anchors
              </span>
            </div>

            <div className="relative pl-6 space-y-6 mt-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-200">
              {/* Event 1: Hospital Registration */}
              <div className="relative">
                <div className="absolute -left-6 top-0 w-4 h-4 rounded-full bg-neutral-900 border-2 border-white flex items-center justify-center" />
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-neutral-900 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-neutral-500" />
                    Hospital Registration
                  </span>
                  <span className="text-neutral-400">12 Jan 2024</span>
                </div>
                <p className="text-xs text-neutral-600 mt-1">
                  Apollo Speciality Hospital (Delhi). Inpatient intake biometric registration token logged.
                </p>
                <div className="text-[10px] font-mono text-neutral-400 mt-0.5">
                  Anchor: APOLLO_REG_#99201
                </div>
              </div>

              {/* Event 2: Government ID */}
              <div className="relative">
                <div className="absolute -left-6 top-0 w-4 h-4 rounded-full bg-neutral-900 border-2 border-white flex items-center justify-center" />
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-neutral-900 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-neutral-500" />
                    Government ID (UIDAI)
                  </span>
                  <span className="text-neutral-400">08 Aug 2022</span>
                </div>
                <p className="text-xs text-neutral-600 mt-1">
                  Biometric deduplication hash match. Photo and fingerprint iris hash consistency: 99.8%.
                </p>
                <div className="text-[10px] font-mono text-neutral-400 mt-0.5">
                  National Vault Token: UID-IND-8924
                </div>
              </div>

              {/* Event 3: Previous Medical Record */}
              <div className="relative">
                <div className="absolute -left-6 top-0 w-4 h-4 rounded-full bg-neutral-900 border-2 border-white flex items-center justify-center" />
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-neutral-900 flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-neutral-500" />
                    Previous Medical Record
                  </span>
                  <span className="text-neutral-400">19 Oct 2023</span>
                </div>
                <p className="text-xs text-neutral-600 mt-1">
                  Fortis Memorial ER admission. Pediatric allergy flag (Penicillin) attached to record.
                </p>
                <div className="text-[10px] font-mono text-neutral-400 mt-0.5">
                  Record ID: FTM-EMERG-4402
                </div>
              </div>

              {/* Event 4: Emergency Registration */}
              <div className="relative">
                <div className="absolute -left-6 top-0 w-4 h-4 rounded-full bg-[#FFB800] border-2 border-neutral-900 flex items-center justify-center" />
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-neutral-900 flex items-center gap-1.5">
                    <Ambulance className="w-3.5 h-3.5 text-amber-600" />
                    Emergency Scene Intake
                  </span>
                  <span className="text-amber-700 font-bold">23:32 IST (Live)</span>
                </div>
                <p className="text-xs text-neutral-600 mt-1">
                  Ambulance Unit #04 camera vector stream automatically bound to candidate CAND-0192.
                </p>
                <div className="text-[10px] font-mono text-amber-700 font-bold mt-0.5">
                  Session Token: EMS-RIG12-9901
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
