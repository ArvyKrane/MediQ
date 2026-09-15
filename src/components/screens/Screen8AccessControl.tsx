import React, { useState } from 'react';
import {
  Shield,
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
} from 'lucide-react';
import { useMediq } from '../../context/MediqContext';
import { AccessBadge } from '../common/VerificationBadge';
import type { PermissionItem, UserRole } from '../../types/mediq';

const PERMISSION_MATRIX: PermissionItem[] = [
  {
    category: 'Emergency Snapshot (Vitals, Basic ID)',
    firstResponder: 'allowed',
    ambulanceEms: 'allowed',
    doctor: 'allowed',
    hospital: 'allowed',
    admin: 'restricted',
  },
  {
    category: 'Critical Allergies & Contraindications',
    firstResponder: 'allowed',
    ambulanceEms: 'allowed',
    doctor: 'allowed',
    hospital: 'allowed',
    admin: 'restricted',
  },
  {
    category: 'Conflicting Blood Group & Lab Serology',
    firstResponder: 'restricted',
    ambulanceEms: 'allowed',
    doctor: 'allowed',
    hospital: 'allowed',
    admin: 'restricted',
  },
  {
    category: 'Full Verified Medical History',
    firstResponder: 'restricted',
    ambulanceEms: 'break-glass',
    doctor: 'allowed',
    hospital: 'allowed',
    admin: 'restricted',
  },
  {
    category: 'Private Emergency Contact (Unmasked)',
    firstResponder: 'restricted',
    ambulanceEms: 'break-glass',
    doctor: 'break-glass',
    hospital: 'break-glass',
    admin: 'restricted',
  },
  {
    category: 'Zero-Knowledge Audio Proxy Bridge',
    firstResponder: 'allowed',
    ambulanceEms: 'allowed',
    doctor: 'allowed',
    hospital: 'allowed',
    admin: 'restricted',
  },
  {
    category: 'Patient Registration & Insurance Details',
    firstResponder: 'restricted',
    ambulanceEms: 'restricted',
    doctor: 'break-glass',
    hospital: 'allowed',
    admin: 'allowed',
  },
  {
    category: 'Cryptographic Audit Trails & Compliance',
    firstResponder: 'restricted',
    ambulanceEms: 'restricted',
    doctor: 'restricted',
    hospital: 'allowed',
    admin: 'allowed',
  },
];

export const Screen8AccessControl: React.FC = () => {
  const {
    setIsBreakGlassModalOpen,
    hasBreakGlassActive,
    breakGlassReason,
    userRole,
    setUserRole,
    setCurrentScreen,
  } = useMediq();

  const [activeFilterRole, setActiveFilterRole] = useState<UserRole | 'all'>('all');

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-wider text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Screen 08 &bull; Zero-Trust Authorization
            </span>
            <span className="text-[11px] font-mono text-neutral-400">
              Attribute-Based Access Control (ABAC)
            </span>
          </div>
          <h2 className="text-2xl font-black text-neutral-950 tracking-tight mt-1">
            WHO IS ALLOWED TO SEE IT?
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Granular data isolation based on responder clinical scope, patient state, and operational urgency.
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

      {/* 5 Distinct Roles Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {/* First Responder */}
        <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs">
          <div className="flex items-center gap-2 text-neutral-900 font-bold text-xs mb-1">
            <UserCheck className="w-4 h-4 text-amber-600" />
            <span>FIRST RESPONDER</span>
          </div>
          <div className="text-[11px] font-mono text-neutral-500 uppercase font-semibold">
            Access Scope
          </div>
          <div className="text-xs font-bold text-neutral-900 mt-0.5">
            Emergency Snapshot
          </div>
          <p className="text-[11px] text-neutral-500 mt-2">
            Vitals, severe allergies, proxy contact token.
          </p>
        </div>

        {/* Ambulance / EMS */}
        <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs">
          <div className="flex items-center gap-2 text-neutral-900 font-bold text-xs mb-1">
            <Ambulance className="w-4 h-4 text-amber-600" />
            <span>AMBULANCE / EMS</span>
          </div>
          <div className="text-[11px] font-mono text-neutral-500 uppercase font-semibold">
            Access Scope
          </div>
          <div className="text-xs font-bold text-neutral-900 mt-0.5">
            Critical Medical Info
          </div>
          <p className="text-[11px] text-neutral-500 mt-2">
            Field stabilization, anaphylaxis flags, conflict alerts.
          </p>
        </div>

        {/* Doctor */}
        <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs">
          <div className="flex items-center gap-2 text-neutral-900 font-bold text-xs mb-1">
            <Stethoscope className="w-4 h-4 text-amber-600" />
            <span>DOCTOR</span>
          </div>
          <div className="text-[11px] font-mono text-neutral-500 uppercase font-semibold">
            Access Scope
          </div>
          <div className="text-xs font-bold text-neutral-900 mt-0.5">
            Verified Medical History
          </div>
          <p className="text-[11px] text-neutral-500 mt-2">
            Multi-source records, conflict resolution, lab history.
          </p>
        </div>

        {/* Hospital */}
        <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs">
          <div className="flex items-center gap-2 text-neutral-900 font-bold text-xs mb-1">
            <Building className="w-4 h-4 text-amber-600" />
            <span>HOSPITAL</span>
          </div>
          <div className="text-[11px] font-mono text-neutral-400 uppercase font-semibold">
            Access Scope
          </div>
          <div className="text-xs font-bold text-neutral-900 mt-0.5">
            Registration + Clinical
          </div>
          <p className="text-[11px] text-neutral-500 mt-2">
            Inpatient admission, beds, insurance, and records.
          </p>
        </div>

        {/* Admin */}
        <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs">
          <div className="flex items-center gap-2 text-neutral-900 font-bold text-xs mb-1">
            <Shield className="w-4 h-4 text-amber-600" />
            <span>ADMIN</span>
          </div>
          <div className="text-[11px] font-mono text-neutral-400 uppercase font-semibold">
            Access Scope
          </div>
          <div className="text-xs font-bold text-neutral-900 mt-0.5">
            Audit + Governance
          </div>
          <p className="text-[11px] text-neutral-500 mt-2">
            Tamper verification, compliance, key rotation.
          </p>
        </div>
      </div>

      {/* Granular Permission Matrix Table */}
      <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-sm text-neutral-950">
              Granular Role-Based Permission Matrix
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Strict enforcement: ✓ Allowed &bull; 🔒 Restricted &bull; ⚠ Break-glass access only
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="flex items-center gap-1 text-emerald-700">
              <span className="font-bold">✓</span> Allowed
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1 text-neutral-500">
              <span>🔒</span> Restricted
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1 text-amber-700">
              <span>⚠</span> Break-Glass
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F9FA] text-neutral-600 font-mono text-[11px] uppercase border-b border-neutral-200">
              <tr>
                <th className="py-3 px-4 font-bold">Data Asset / Intelligence Slice</th>
                <th className="py-3 px-3 text-center">First Responder</th>
                <th className="py-3 px-3 text-center">Ambulance / EMS</th>
                <th className="py-3 px-3 text-center">Doctor (ER)</th>
                <th className="py-3 px-3 text-center">Hospital Admin</th>
                <th className="py-3 px-3 text-center">System Auditor</th>
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
                  <td className="py-3.5 px-3 text-center">
                    <AccessBadge status={row.admin} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Break-Glass Specification Callout */}
      <div className="bg-[#F8F9FA] rounded-2xl border border-neutral-200/90 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase font-bold text-red-600">
              BREAK-GLASS EMERGENCY ACCESS PROTOCOL
            </span>
            <span className="text-[10px] font-mono bg-red-100 text-red-800 px-1.5 py-0.5 rounded font-bold">
              ISO/IEC 27799 Compliant
            </span>
          </div>
          <p className="text-xs text-neutral-700 max-w-3xl leading-relaxed">
            "Emergency access may temporarily expose critical information when normal connectivity or authorization paths are unavailable."
          </p>
          <div className="text-[11px] text-neutral-500 font-mono">
            Mandatory credentials required: Clinical justification &bull; Cryptographic responder signature &bull; Maximum 60-minute duration.
          </div>
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
            <span>VIEW AUDIT TRAIL</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
