import React from 'react';
import {
  Shield,
  ShieldCheck,
  Lock,
  Unlock,
  AlertTriangle,
  UserCheck,
  Building,
  Ambulance,
  Stethoscope,
  Key,
  Flame,
  ArrowRight,
  EyeOff,
  XCircle,
} from 'lucide-react';
import { useMediq } from '../../context/MediqContext';
import { AccessBadge } from '../common/VerificationBadge';
import type { PermissionItem } from '../../types/mediq';

const PERMISSION_MATRIX: PermissionItem[] = [
  {
    category: 'Emergency Snapshot (Vitals, Basic ID, ABHA)',
    firstResponder: 'allowed',
    ambulanceEms: 'allowed',
    doctor: 'allowed',
    hospital: 'allowed',
    admin: 'restricted',
    insuranceTpa: 'restricted',
  },
  {
    category: 'Critical Allergies (e.g. Penicillin Anaphylaxis)',
    firstResponder: 'allowed',
    ambulanceEms: 'allowed',
    doctor: 'allowed',
    hospital: 'allowed',
    admin: 'restricted',
    insuranceTpa: 'restricted',
  },
  {
    category: 'Conflicting Blood Group & Bedside Lab Test',
    firstResponder: 'restricted',
    ambulanceEms: 'allowed',
    doctor: 'allowed',
    hospital: 'allowed',
    admin: 'restricted',
    insuranceTpa: 'restricted',
  },
  {
    category: 'Emergency Next-of-Kin Contact (Masked Proxy)',
    firstResponder: 'allowed',
    ambulanceEms: 'allowed',
    doctor: 'allowed',
    hospital: 'allowed',
    admin: 'restricted',
    insuranceTpa: 'restricted',
  },
  {
    category: 'Full Verified Medical History (ER Scope)',
    firstResponder: 'restricted',
    ambulanceEms: 'break-glass',
    doctor: 'allowed',
    hospital: 'allowed',
    admin: 'restricted',
    insuranceTpa: 'restricted',
  },
  {
    category: 'Non-Emergency Past Records (Dental, Minor Fever, OPD)',
    firstResponder: 'restricted',
    ambulanceEms: 'restricted',
    doctor: 'restricted',
    hospital: 'restricted',
    admin: 'restricted',
    insuranceTpa: 'restricted',
  },
  {
    category: 'Insurance Policy & Inpatient Billing Details',
    firstResponder: 'restricted',
    ambulanceEms: 'restricted',
    doctor: 'restricted',
    hospital: 'allowed',
    admin: 'allowed',
    insuranceTpa: 'restricted',
  },
];

export const Screen8AccessControl: React.FC = () => {
  const {
    setIsBreakGlassModalOpen,
    hasBreakGlassActive,
    breakGlassReason,
    setCurrentScreen,
    setIsInsuranceModalOpen,
    currentPatient,
  } = useMediq();

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-wider text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Screen 08 &bull; Privacy &amp; Access Controls
            </span>
            <span className="text-[11px] font-mono text-emerald-700 font-bold">
              Insurance Firewall Active
            </span>
          </div>
          <h2 className="text-2xl font-black text-neutral-950 tracking-tight mt-1">
            WHO IS ALLOWED TO SEE WHAT?
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Strict role-based isolation guaranteeing that emergency responders get what they need to save lives, while commercial insurance crawlers are 100% blocked.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsBreakGlassModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>REQUEST BREAK-GLASS ACCESS</span>
          </button>
        </div>
      </div>

      {/* Break-Glass Active Banner if triggered */}
      {hasBreakGlassActive && (
        <div className="bg-red-50 border-2 border-red-500 rounded-xl p-4 flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
            <div>
              <span className="font-mono text-xs font-bold text-red-700 uppercase">
                BREAK-GLASS PRIVILEGE OVERRIDE ACTIVE
              </span>
              <p className="text-xs text-neutral-800 font-medium">
                Reason: {breakGlassReason}
              </p>
            </div>
          </div>
          <span className="font-mono text-xs text-red-700 font-bold bg-red-100 px-2.5 py-1 rounded">
            Auto-Expiring Token
          </span>
        </div>
      )}

      {/* Insurance Protection Banner */}
      <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-emerald-100 rounded-xl text-emerald-800 shrink-0 mt-0.5">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold uppercase text-emerald-900 bg-emerald-200/80 px-2 py-0.5 rounded">
                PATIENT INSURANCE POLICY SAFEGUARD
              </span>
              <span className="text-xs text-emerald-800 font-semibold font-mono">
                {currentPatient.shieldedRecordsCount} Records Shielded
              </span>
            </div>
            <h3 className="text-base font-bold text-neutral-950 mt-1">
              Commercial Insurers Cannot Nullify Policies Using ABHA Emergency Data
            </h3>
            <p className="text-xs text-neutral-700 mt-1 leading-relaxed max-w-3xl">
              In India, patients often fear insurance companies will find undisclosed past history via ABHA and cancel coverage. MEDIQ's Emergency Care token restricts data access strictly to immediate life-support vitals. Non-emergency consultations remain sealed.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsInsuranceModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shrink-0 transition-colors shadow-xs"
        >
          View Insurance Firewall Proof →
        </button>
      </div>

      {/* Role Scope Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {/* First Responder */}
        <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs">
          <div className="flex items-center gap-2 text-neutral-900 font-bold text-xs mb-1">
            <UserCheck className="w-4 h-4 text-amber-600" />
            <span>FIRST RESPONDER</span>
          </div>
          <div className="text-[11px] font-mono text-neutral-500 uppercase font-semibold">Access Scope</div>
          <div className="text-xs font-bold text-neutral-900 mt-0.5">Emergency Snapshot</div>
          <p className="text-[11px] text-neutral-500 mt-2">Vitals, severe allergies, proxy contact token.</p>
        </div>

        {/* Ambulance / EMS */}
        <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs">
          <div className="flex items-center gap-2 text-neutral-900 font-bold text-xs mb-1">
            <Ambulance className="w-4 h-4 text-amber-600" />
            <span>AMBULANCE / EMS</span>
          </div>
          <div className="text-[11px] font-mono text-neutral-500 uppercase font-semibold">Access Scope</div>
          <div className="text-xs font-bold text-neutral-900 mt-0.5">Field Stabilization</div>
          <p className="text-[11px] text-neutral-500 mt-2">Active meds, conflict warnings, airway alerts.</p>
        </div>

        {/* Doctor */}
        <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs">
          <div className="flex items-center gap-2 text-neutral-900 font-bold text-xs mb-1">
            <Stethoscope className="w-4 h-4 text-amber-600" />
            <span>ER DOCTOR</span>
          </div>
          <div className="text-[11px] font-mono text-neutral-500 uppercase font-semibold">Access Scope</div>
          <div className="text-xs font-bold text-neutral-900 mt-0.5">Verified Medical History</div>
          <p className="text-[11px] text-neutral-500 mt-2">Multi-hospital records, lab history, bedside tests.</p>
        </div>

        {/* Hospital Admin */}
        <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs">
          <div className="flex items-center gap-2 text-neutral-900 font-bold text-xs mb-1">
            <Building className="w-4 h-4 text-amber-600" />
            <span>HOSPITAL ADMIN</span>
          </div>
          <div className="text-[11px] font-mono text-neutral-400 uppercase font-semibold">Access Scope</div>
          <div className="text-xs font-bold text-neutral-900 mt-0.5">Registration &amp; Beds</div>
          <p className="text-[11px] text-neutral-500 mt-2">Inpatient intake, insurance claims, billing.</p>
        </div>

        {/* Insurance TPA - Strictly Blocked */}
        <div className="bg-red-50/50 rounded-xl border-2 border-red-300 p-4 shadow-xs">
          <div className="flex items-center gap-2 text-red-900 font-bold text-xs mb-1">
            <EyeOff className="w-4 h-4 text-red-600" />
            <span>INSURANCE TPAs</span>
          </div>
          <div className="text-[11px] font-mono text-red-700 uppercase font-bold">Access Scope</div>
          <div className="text-xs font-bold text-red-700 mt-0.5">🚫 ZERO ACCESS</div>
          <p className="text-[11px] text-neutral-600 mt-2">Legally and technically blocked from emergency records.</p>
        </div>
      </div>

      {/* Granular Permission Matrix Table */}
      <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-sm text-neutral-950">
              Role-Based Emergency Access Matrix
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Notice the dedicated <strong>Insurance TPA</strong> column: strictly restricted across all emergency clinical tokens.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="flex items-center gap-1 text-emerald-700 font-bold">
              <span>✓</span> Allowed
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1 text-neutral-500 font-bold">
              <span>🔒</span> Restricted
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1 text-red-600 font-bold">
              <span>🚫</span> Blocked
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F9FA] text-neutral-600 font-mono text-[11px] uppercase border-b border-neutral-200">
              <tr>
                <th className="py-3 px-4 font-bold">Data Asset</th>
                <th className="py-3 px-3 text-center">First Responder</th>
                <th className="py-3 px-3 text-center">Ambulance EMS</th>
                <th className="py-3 px-3 text-center">ER Doctor</th>
                <th className="py-3 px-3 text-center">Hospital Admin</th>
                <th className="py-3 px-3 text-center text-red-700 bg-red-50">Insurance TPA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {PERMISSION_MATRIX.map((row, idx) => (
                <tr key={idx} className="hover:bg-neutral-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-neutral-900">
                    {row.category}
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <AccessBadge status={row.firstResponder} />
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <AccessBadge status={row.ambulanceEms} />
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <AccessBadge status={row.doctor} />
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <AccessBadge status={row.hospital} />
                  </td>
                  <td className="py-3.5 px-3 text-center bg-red-50/40">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-100 text-red-800 border border-red-300">
                      🚫 Blocked
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Break-Glass Callout */}
      <div className="bg-[#F8F9FA] rounded-2xl border border-neutral-200/90 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase font-bold text-red-600">
              BREAK-GLASS EMERGENCY PROTOCOL
            </span>
          </div>
          <p className="text-xs text-neutral-700 max-w-3xl leading-relaxed">
            "Emergency access may temporarily expose critical information when normal connectivity or authorization paths are unavailable."
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setIsBreakGlassModalOpen(true)}
            className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Key className="w-4 h-4" />
            <span>REQUEST BREAK-GLASS ACCESS</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentScreen('audit-log')}
            className="py-2.5 px-4 rounded-xl bg-neutral-950 hover:bg-black text-[#FFB800] text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <span>VIEW AUDIT LOG</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
