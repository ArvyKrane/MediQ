import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  EyeOff,
  CheckCircle2,
  XCircle,
  X,
  FileText,
  AlertTriangle,
  Building2,
  ArrowRight,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { useMediq } from '../../context/MediqContext';

export const InsuranceShieldModal: React.FC = () => {
  const { isInsuranceModalOpen, setIsInsuranceModalOpen, currentPatient, insuranceShield } = useMediq();
  const [simulationMode, setSimulationMode] = useState<'without-mediq' | 'with-mediq'>('with-mediq');

  if (!isInsuranceModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-neutral-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-neutral-950 text-white p-5 flex items-start justify-between border-b border-neutral-800">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-[#FFB800] text-black rounded-2xl mt-0.5 shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-wider uppercase font-bold bg-neutral-800 text-[#FFB800] px-2 py-0.5 rounded border border-neutral-700">
                  ABDM PURPOSE LOCK ENCLAVE
                </span>
                <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded font-bold">
                  DPDP ACT 2023 COMPLIANT
                </span>
              </div>
              <h2 className="text-xl font-black mt-1 text-white tracking-tight">
                Insurance Privacy Shield &amp; Pre-Existing Condition Protection
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Why emergency scans in MEDIQ will <strong className="text-white underline">NEVER</strong> allow insurance companies to reject your health claim.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsInsuranceModalOpen(false)}
            className="text-neutral-400 hover:text-white p-1.5 rounded-full hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-neutral-800 text-xs">

          {/* Interactive Live TPA Comparison Toggle */}
          <div className="bg-neutral-100 p-1 rounded-2xl flex gap-1">
            <button
              type="button"
              onClick={() => setSimulationMode('without-mediq')}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                simulationMode === 'without-mediq'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <XCircle className="w-4 h-4" />
              <span>WITHOUT MEDIQ (Traditional ABDM)</span>
            </button>

            <button
              type="button"
              onClick={() => setSimulationMode('with-mediq')}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                simulationMode === 'with-mediq'
                  ? 'bg-neutral-950 text-[#FFB800] shadow-md'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-[#FFB800]" />
              <span>WITH MEDIQ ENCLAVE (Protected)</span>
            </button>
          </div>

          {/* SIMULATION 1: Without MEDIQ (The Nightmare Scenario) */}
          {simulationMode === 'without-mediq' && (
            <div className="rounded-3xl border-2 border-red-300 bg-red-50/60 p-5 space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-red-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold text-xs">
                    TPA
                  </div>
                  <div>
                    <span className="font-bold text-red-950 text-sm block">Simulated Commercial TPA Claims Desk</span>
                    <span className="text-[10px] font-mono text-red-700">Star / HDFC ERGO / Care TPA Claim Auditor</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-red-600 text-white font-mono font-black text-xs">
                  ❌ CLAIM REJECTED
                </span>
              </div>

              <div className="space-y-2 text-xs text-red-900">
                <div className="p-3 rounded-xl bg-white border border-red-200 font-mono text-[11px] leading-relaxed">
                  <strong className="text-red-700 block mb-1">AUDITOR INVESTIGATION FINDING:</strong>
                  "During hospital intake, patient's full ABHA archive was retrieved without purpose scoping. Our crawler indexed a March 2021 OPD prescription from Apollo Clinic noting mild asthma/allergies which was <strong>NOT disclosed</strong> during insurance policy inception in 2023."
                </div>

                <div className="p-3 rounded-xl bg-red-100/80 border border-red-300 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-red-950">Result: ₹4,80,000 Emergency Claim Denied &amp; Policy Cancelled</strong>
                    <p className="text-[11px] text-red-800 mt-0.5 leading-relaxed">
                      Because conventional systems lack purpose-based encryption, all past history leaks to commercial underwriters during hospitalization.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SIMULATION 2: With MEDIQ (The Zero-Leakage Guarantee) */}
          {simulationMode === 'with-mediq' && (
            <div className="rounded-3xl border-2 border-emerald-400 bg-emerald-50/50 p-5 space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-emerald-950 text-sm block">MEDIQ Zero-Leakage Emergency Enclave</span>
                    <span className="text-[10px] font-mono text-emerald-800">DPDP Act Section 8(4) &bull; Purpose: EMERGENCY_CARE</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-700 text-white font-mono font-black text-xs">
                  ✅ CLAIM HONORED (₹4.8L)
                </span>
              </div>

              <div className="space-y-2 text-xs text-emerald-950">
                <div className="p-3 rounded-xl bg-white border border-emerald-200 font-mono text-[11px] leading-relaxed">
                  <strong className="text-emerald-800 block mb-1">CRYPTOGRAPHIC PURPOSE LOCK ACTIVE:</strong>
                  "Emergency token restricted to immediate trauma vitals, blood group conflict resolution, and acute drug allergies. Routine past OPD visits ({currentPatient.shieldedRecordsCount} records) are encrypted using ephemeral session keys. TPA background crawler received <strong>HTTP 403 FORBIDDEN: Access restricted to authorized attending clinician</strong>."
                </div>

                <div className="p-3 rounded-xl bg-emerald-100/80 border border-emerald-300 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-emerald-950">Result: 100% Emergency Coverage Preserved</strong>
                    <p className="text-[11px] text-emerald-800 mt-0.5 leading-relaxed">
                      Citizens can fearlessly use their ABHA ID in road accidents knowing their family's health insurance policy will remain intact.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3 Pillars of the MEDIQ Shield */}
          <div>
            <h3 className="font-bold text-xs text-neutral-900 uppercase tracking-wider mb-2.5 font-mono">
              The 3 Architectural Guarantees:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="p-3 rounded-2xl border border-neutral-200 bg-neutral-50/70">
                <div className="font-bold text-neutral-900 flex items-center gap-1.5 mb-1">
                  <Lock className="w-3.5 h-3.5 text-emerald-700" />
                  <span>1. Life-Saving Only</span>
                </div>
                <p className="text-[11px] text-neutral-600 leading-relaxed">
                  Pulls only blood group, severe allergies, and emergency contacts. Routine past clinic visits are strictly excluded.
                </p>
              </div>

              <div className="p-3 rounded-2xl border border-neutral-200 bg-neutral-50/70">
                <div className="font-bold text-neutral-900 flex items-center gap-1.5 mb-1">
                  <EyeOff className="w-3.5 h-3.5 text-emerald-700" />
                  <span>2. TPA Blindspot</span>
                </div>
                <p className="text-[11px] text-neutral-600 leading-relaxed">
                  Commercial insurance TPAs are legally and cryptographically air-gapped from emergency trauma access.
                </p>
              </div>

              <div className="p-3 rounded-2xl border border-neutral-200 bg-neutral-50/70">
                <div className="font-bold text-neutral-900 flex items-center gap-1.5 mb-1">
                  <Building2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>3. DPDP Act Backed</span>
                </div>
                <p className="text-[11px] text-neutral-600 leading-relaxed">
                  Backed by Section 8 of Digital Personal Data Protection Act: data gathered for emergency medical care cannot be subpoenaed by insurers.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-100 border-t border-neutral-200 flex items-center justify-between">
          <span className="text-[11px] text-neutral-500 font-mono">
            Protected under ABDM Health Information Exchange (HIE-CM)
          </span>
          <button
            type="button"
            onClick={() => setIsInsuranceModalOpen(false)}
            className="px-5 py-2 rounded-xl bg-neutral-950 text-[#FFB800] hover:bg-neutral-800 font-bold text-xs shadow-xs"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
