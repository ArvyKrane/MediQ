import React from 'react';
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
  HelpCircle,
} from 'lucide-react';
import { useMediq } from '../../context/MediqContext';

export const InsuranceShieldModal: React.FC = () => {
  const { isInsuranceModalOpen, setIsInsuranceModalOpen, currentPatient, insuranceShield } = useMediq();

  if (!isInsuranceModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full border-2 border-emerald-500 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-white/10 rounded-xl mt-0.5">
              <ShieldCheck className="w-7 h-7 text-[#FFB800]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-wider uppercase font-bold bg-white/20 px-2 py-0.5 rounded text-white">
                  ABHA ZERO-LEAKAGE PRIVACY GUARANTEE
                </span>
                <span className="text-[10px] font-mono bg-emerald-950/60 text-emerald-300 px-2 py-0.5 rounded font-bold">
                  DPDP ACT COMPLIANT
                </span>
              </div>
              <h2 className="text-xl font-bold mt-1 text-white tracking-tight">
                Patient Insurance Protection Shield
              </h2>
              <p className="text-xs text-emerald-100 mt-0.5">
                Why using your ABHA ID in an emergency will <strong className="underline decoration-[#FFB800]">NEVER</strong> allow insurance companies to cancel your policy.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsInsuranceModalOpen(false)}
            className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-neutral-800 text-xs">
          {/* Plain English Core Assurance Card */}
          <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-950">
            <div className="flex items-center gap-2 font-bold text-sm text-neutral-900 mb-1">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>The Big Concern: "Will my insurance company find my hidden past history?"</span>
            </div>
            <p className="text-xs text-neutral-700 leading-relaxed">
              When people buy private health insurance in India, they often worry: <em>"If my hospital records are linked to my ABHA ID, will the insurance company dig into past consultations (like childhood issues, minor surgeries, or stress visits) to reject my claim for pre-existing disease non-disclosure?"</em>
            </p>
            <div className="mt-2.5 pt-2 border-t border-amber-200/80 font-bold text-emerald-800 flex items-center gap-2 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Answer: NO. MEDIQ strictly blocks insurance crawlers through legal &amp; technical firewalls.</span>
            </div>
          </div>

          {/* How MEDIQ Protects You - 3 Pillars */}
          <div>
            <h3 className="font-bold text-sm text-neutral-900 mb-3">
              How the MEDIQ Insurance Firewall Works
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl border border-neutral-200 bg-[#F8F9FA]">
                <div className="font-bold text-neutral-900 flex items-center gap-1.5 mb-1">
                  <Lock className="w-4 h-4 text-emerald-600" />
                  <span>1. Emergency-Only Data</span>
                </div>
                <p className="text-[11px] text-neutral-600 leading-relaxed">
                  In an ambulance or ER, MEDIQ only pulls life-saving data: blood type, severe allergies, and emergency contacts. Routine past doctor visits are never requested.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-neutral-200 bg-[#F8F9FA]">
                <div className="font-bold text-neutral-900 flex items-center gap-1.5 mb-1">
                  <EyeOff className="w-4 h-4 text-emerald-600" />
                  <span>2. Insurance Blindspot</span>
                </div>
                <p className="text-[11px] text-neutral-600 leading-relaxed">
                  Commercial insurance TPAs and claim investigators are technically locked out of MEDIQ emergency sessions. They cannot scrape this data.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-neutral-200 bg-[#F8F9FA]">
                <div className="font-bold text-neutral-900 flex items-center gap-1.5 mb-1">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>3. Legal Guarantee</span>
                </div>
                <p className="text-[11px] text-neutral-600 leading-relaxed">
                  Under India's DPDP Act &amp; ABDM protocol, accessing emergency medical data for commercial underwriting is an illegal criminal offense.
                </p>
              </div>
            </div>
          </div>

          {/* Direct Comparison Table */}
          <div className="border border-neutral-200 rounded-xl overflow-hidden">
            <div className="bg-[#F8F9FA] px-4 py-2.5 border-b border-neutral-200 flex items-center justify-between font-mono text-[11px] font-bold text-neutral-700">
              <span>DATA VISIBILITY IN EMERGENCY FOR {currentPatient.name.toUpperCase()}</span>
              <span className="text-emerald-700">ABHA: {currentPatient.abhaId}</span>
            </div>
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-100/70 border-b border-neutral-200 text-neutral-600 text-[11px] font-mono">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Medical Record Type</th>
                  <th className="py-2.5 px-3 font-semibold">Emergency Doctors (ER)</th>
                  <th className="py-2.5 px-3 font-semibold">Insurance Companies (TPAs)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-[11px]">
                <tr>
                  <td className="py-2.5 px-3 font-medium">Blood Group &amp; Conflict Warning</td>
                  <td className="py-2.5 px-3 text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Visible for Transfusion
                  </td>
                  <td className="py-2.5 px-3 text-red-600 font-semibold">
                    <XCircle className="w-3.5 h-3.5 inline mr-1 text-red-500" /> BLOCKED (Not shared)
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium">Penicillin Allergy Alert</td>
                  <td className="py-2.5 px-3 text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Visible to prevent shock
                  </td>
                  <td className="py-2.5 px-3 text-red-600 font-semibold">
                    <XCircle className="w-3.5 h-3.5 inline mr-1 text-red-500" /> BLOCKED (Not shared)
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium">Past Dental Surgeries &amp; Minor Consults ({currentPatient.shieldedRecordsCount} files)</td>
                  <td className="py-2.5 px-3 text-neutral-500">
                    Not pulled (Irrelevant for ER)
                  </td>
                  <td className="py-2.5 px-3 text-emerald-800 font-bold bg-emerald-50">
                    <ShieldCheck className="w-3.5 h-3.5 inline mr-1 text-emerald-600" /> 100% SHIELDED &amp; HIDDEN
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium">Past Fever, Dermatology, or Stress Visits</td>
                  <td className="py-2.5 px-3 text-neutral-500">
                    Not pulled (Irrelevant for ER)
                  </td>
                  <td className="py-2.5 px-3 text-emerald-800 font-bold bg-emerald-50">
                    <ShieldCheck className="w-3.5 h-3.5 inline mr-1 text-emerald-600" /> 100% SHIELDED &amp; HIDDEN
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Current Patient Shield Status */}
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
            <div>
              <span className="font-mono text-[10px] text-emerald-800 uppercase font-bold block">
                LIVE PROTECTION STATUS FOR {currentPatient.name.toUpperCase()}
              </span>
              <p className="text-neutral-800 font-semibold mt-0.5">
                {currentPatient.shieldedRecordsCount} Non-Emergency Past Records are active in hospital archives but completely shielded from insurance view.
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="px-3 py-1 rounded-full bg-emerald-600 text-white font-mono text-[11px] font-bold">
                POLICY SAFE ✓
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200 bg-[#F8F9FA] flex justify-end">
          <button
            onClick={() => setIsInsuranceModalOpen(false)}
            className="py-2.5 px-5 rounded-xl bg-neutral-950 hover:bg-black text-white text-xs font-bold transition-colors"
          >
            I Understand &bull; Close Shield View
          </button>
        </div>
      </div>
    </div>
  );
};
