import React from 'react';
import {
  ShieldCheck,
  HeartPulse,
  AlertOctagon,
  Pill,
  FileText,
  Activity,
  UserCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  HelpCircle,
  ExternalLink,
  Building,
} from 'lucide-react';
import { useMediq } from '../../context/MediqContext';
import { VerificationBadge } from '../common/VerificationBadge';

export const Screen6PatientProfile: React.FC = () => {
  const {
    resolvedBloodGroup,
    isConflictResolved,
    clinicalTrustScore,
    identityConfidence,
    setSelectedEvidenceItem,
    setCurrentScreen,
  } = useMediq();

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      {/* Patient Header Card */}
      <div className="bg-white rounded-2xl border border-neutral-200/90 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-neutral-100">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-neutral-950 text-[#FFB800] flex items-center justify-center font-black text-xl shadow-xs shrink-0">
              AM
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-black text-neutral-950 tracking-tight">
                  Aarav Mehta
                </h1>
                <span className="font-mono text-xs bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded font-bold">
                  MED-0192
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500 font-mono mt-1">
                <span>DOB: 14 Aug 2005 (21y)</span>
                <span>&bull;</span>
                <span>Male</span>
                <span>&bull;</span>
                <span>National ID: IND-••••-8924</span>
              </div>
            </div>
          </div>

          {/* 4 Critical Status Pillars */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
            {/* Identity */}
            <div className="bg-[#F8F9FA] p-3 rounded-xl border border-neutral-200/80">
              <span className="text-[10px] text-neutral-400 block uppercase font-bold">
                IDENTITY
              </span>
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                VERIFIED
              </span>
            </div>

            {/* Identity Confidence */}
            <div className="bg-[#F8F9FA] p-3 rounded-xl border border-neutral-200/80">
              <span className="text-[10px] text-neutral-400 block uppercase font-bold">
                C_ID CONFIDENCE
              </span>
              <span className="text-xs font-bold text-neutral-900 mt-0.5 block">
                {identityConfidence.toFixed(1)}%
              </span>
            </div>

            {/* Clinical Trust */}
            <div className="bg-[#F8F9FA] p-3 rounded-xl border border-neutral-200/80">
              <span className="text-[10px] text-neutral-400 block uppercase font-bold">
                C_CLIN TRUST
              </span>
              <span className="text-xs font-bold text-emerald-700 mt-0.5 block">
                {clinicalTrustScore}%
              </span>
            </div>

            {/* Access */}
            <div className="bg-neutral-950 text-[#FFB800] p-3 rounded-xl border border-neutral-800">
              <span className="text-[10px] text-neutral-400 block uppercase font-bold">
                ACCESS STATUS
              </span>
              <span className="text-xs font-bold flex items-center gap-1 mt-0.5">
                <UserCheck className="w-3.5 h-3.5" />
                AUTHORIZED
              </span>
            </div>
          </div>
        </div>

        {/* Sub-header notification */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Zero-knowledge medical record reconstructed from 3 multi-hospital source nodes.
            </span>
          </div>
          <button
            onClick={() => setSelectedEvidenceItem('Complete Dossier Merkle Proof')}
            className="text-neutral-900 font-bold hover:text-amber-600 underline underline-offset-4 flex items-center gap-1"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Why can I trust this?</span>
          </button>
        </div>
      </div>

      {/* Critical Medical Information Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-mono text-xs uppercase font-bold text-neutral-900 tracking-wider">
              CRITICAL MEDICAL INFORMATION (TRUST-ATTRIBUTED)
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Every data atom carries independent cryptographic verification and confidence weighting.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Blood Group */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] text-neutral-400 font-bold uppercase">
                  Blood Group
                </span>
                <VerificationBadge level={isConflictResolved ? 'High' : 'Disputed'} />
              </div>
              <div className="text-3xl font-black font-mono text-neutral-950">
                {isConflictResolved ? resolvedBloodGroup : 'B+ / O+ [DISPUTED]'}
              </div>
              <p className="text-xs text-neutral-600 mt-2">
                {isConflictResolved
                  ? 'Verified across 2 independent sources (Apollo & Apex Lab)'
                  : 'Conflict detected between Apollo (B+) and Fortis (O+)'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
              <span className="text-[11px] font-mono text-neutral-500">
                {isConflictResolved ? 'Dual Signed' : 'Dispute Active'}
              </span>
              <button
                onClick={() => setSelectedEvidenceItem('Blood Group')}
                className="text-xs font-semibold text-neutral-900 hover:text-amber-600 underline underline-offset-4"
              >
                Inspect Proof →
              </button>
            </div>
          </div>

          {/* Allergies */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] text-neutral-400 font-bold uppercase">
                  Allergies
                </span>
                <VerificationBadge level="High" text="Trust: HIGH" />
              </div>
              <div className="text-2xl font-black text-red-600">
                Penicillin
              </div>
              <p className="text-xs text-neutral-600 mt-2">
                Severe anaphylactoid reaction recorded during pediatric treatment at Fortis Memorial (2023).
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
              <span className="text-[11px] font-mono text-neutral-500">
                Verified
              </span>
              <button
                onClick={() => setSelectedEvidenceItem('Penicillin Allergy')}
                className="text-xs font-semibold text-neutral-900 hover:text-amber-600 underline underline-offset-4"
              >
                Inspect Proof →
              </button>
            </div>
          </div>

          {/* Medication */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] text-neutral-400 font-bold uppercase">
                  Current Medication
                </span>
                <VerificationBadge level="Low" text="Trust: LOW" />
              </div>
              <div className="text-lg font-bold text-neutral-900">
                Unknown / Incomplete Log
              </div>
              <p className="text-xs text-neutral-500 mt-2">
                Partial mention of Salbutamol inhaler PRN; no active outpatient pharmacy confirmation.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
              <span className="text-[11px] font-mono text-neutral-400">
                Single Outpatient Ref
              </span>
              <button
                onClick={() => setSelectedEvidenceItem('Medication Registry')}
                className="text-xs font-semibold text-neutral-900 hover:text-amber-600 underline underline-offset-4"
              >
                Inspect Proof →
              </button>
            </div>
          </div>

          {/* Known Conditions */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] text-neutral-400 font-bold uppercase">
                  Known Conditions
                </span>
                <VerificationBadge level="High" text="Trust: HIGH" />
              </div>
              <div className="text-xl font-bold text-neutral-900">
                Bronchial Asthma (Mild)
              </div>
              <p className="text-xs text-neutral-600 mt-2">
                Diagnosed 2021. Peak expiratory flow rate documented at Apollo Pulmonology Clinic.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
              <span className="text-[11px] font-mono text-neutral-500">
                Doctor Attested
              </span>
              <button
                onClick={() => setSelectedEvidenceItem('Asthma Pulmonary History')}
                className="text-xs font-semibold text-neutral-900 hover:text-amber-600 underline underline-offset-4"
              >
                Inspect Proof →
              </button>
            </div>
          </div>

          {/* Previous Procedures */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] text-neutral-400 font-bold uppercase">
                  Previous Procedures
                </span>
                <VerificationBadge level="Medium" text="Trust: MEDIUM" />
              </div>
              <div className="text-base font-bold text-neutral-900">
                Appendectomy (Laparoscopic)
              </div>
              <p className="text-xs text-neutral-600 mt-2">
                Performed June 2022. No surgical complications noted. Surgical scar present on lower right quadrant.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
              <span className="text-[11px] font-mono text-neutral-500">
                OP Summary Log
              </span>
              <button
                onClick={() => setSelectedEvidenceItem('Appendectomy Surgical Note')}
                className="text-xs font-semibold text-neutral-900 hover:text-amber-600 underline underline-offset-4"
              >
                Inspect Proof →
              </button>
            </div>
          </div>

          {/* Emergency Guardian */}
          <div className="bg-[#F8F9FA] rounded-xl border border-neutral-200 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] text-neutral-400 font-bold uppercase">
                  Emergency Guardian
                </span>
                <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                  Masked Proxy
                </span>
              </div>
              <div className="text-lg font-bold text-neutral-900">
                Priya Mehta (Mother)
              </div>
              <p className="text-xs text-neutral-600 mt-2 font-mono">
                +91 &bull;&bull;&bull;&bull;&bull;&bull; 4821
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-neutral-200 flex items-center justify-between">
              <button
                onClick={() => setCurrentScreen('emergency-contact')}
                className="text-xs font-bold text-neutral-950 hover:text-amber-600 underline underline-offset-4"
              >
                Open Private Call Console →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Next Step CTA */}
      <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
        <span className="text-xs text-neutral-500 font-mono">
          Ready for ER Trauma Dashboard integration
        </span>
        <button
          type="button"
          onClick={() => setCurrentScreen('doctor-dashboard')}
          className="py-3 px-6 rounded-xl bg-neutral-950 hover:bg-black text-[#FFB800] text-xs font-bold flex items-center gap-2 shadow-xs transition-all"
        >
          <span>OPEN DOCTOR / HOSPITAL ER DASHBOARD</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
