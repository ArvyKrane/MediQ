import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Lock,
  ShieldCheck,
  Stethoscope,
  HeartPulse,
  Syringe,
  AlertCircle,
  ArrowRight,
  Clock,
  Flame,
  EyeOff,
  Building,
  Ambulance,
  UserCheck,
  XCircle,
  RefreshCw,
} from 'lucide-react';
import { useMediq } from '../../context/MediqContext';

type RoleKey = 'firstResponder' | 'ambulanceEms' | 'doctor' | 'hospital' | 'insuranceTpa';

interface PermissionRow {
  category: string;
  firstResponder: 'allowed' | 'restricted';
  ambulanceEms: 'allowed' | 'restricted';
  doctor: 'allowed' | 'restricted';
  hospital: 'allowed' | 'restricted';
  insuranceTpa: 'restricted';
}

const PERMISSIONS: PermissionRow[] = [
  {
    category: 'Emergency Vitals & ABHA ID',
    firstResponder: 'allowed',
    ambulanceEms: 'allowed',
    doctor: 'allowed',
    hospital: 'allowed',
    insuranceTpa: 'restricted',
  },
  {
    category: 'Critical Drug Allergies',
    firstResponder: 'allowed',
    ambulanceEms: 'allowed',
    doctor: 'allowed',
    hospital: 'allowed',
    insuranceTpa: 'restricted',
  },
  {
    category: 'Blood Group (After Conflict Resolution)',
    firstResponder: 'restricted',
    ambulanceEms: 'allowed',
    doctor: 'allowed',
    hospital: 'allowed',
    insuranceTpa: 'restricted',
  },
  {
    category: 'Emergency Next-of-Kin Contact',
    firstResponder: 'allowed',
    ambulanceEms: 'allowed',
    doctor: 'allowed',
    hospital: 'allowed',
    insuranceTpa: 'restricted',
  },
  {
    category: 'Full Verified Medical History',
    firstResponder: 'restricted',
    ambulanceEms: 'restricted',
    doctor: 'allowed',
    hospital: 'allowed',
    insuranceTpa: 'restricted',
  },
  {
    category: 'Past OPD Visits & Private Consultations',
    firstResponder: 'restricted',
    ambulanceEms: 'restricted',
    doctor: 'allowed',
    hospital: 'restricted',
    insuranceTpa: 'restricted',
  },
];

const ROLE_LABELS: { key: RoleKey; label: string; icon: React.ReactNode }[] = [
  { key: 'firstResponder', label: 'First Responder', icon: <Flame className="w-3.5 h-3.5" /> },
  { key: 'ambulanceEms', label: 'Ambulance / EMS', icon: <Ambulance className="w-3.5 h-3.5" /> },
  { key: 'doctor', label: 'ER Doctor', icon: <Stethoscope className="w-3.5 h-3.5" /> },
  { key: 'hospital', label: 'Hospital Admin', icon: <Building className="w-3.5 h-3.5" /> },
  { key: 'insuranceTpa', label: 'Insurance TPA', icon: <EyeOff className="w-3.5 h-3.5" /> },
];

type ActiveTab = 'er' | 'access';

export const ERView: React.FC = () => {
  const {
    currentPatient,
    identityStatus,
    isConflictResolved,
    resolvedBloodGroup,
    clinicalTrustScore,
    identityConfidence,
    setCurrentScreen,
    setIsInsuranceModalOpen,
  } = useMediq();

  const [tab, setTab] = useState<ActiveTab>('er');
  const isIdentified = identityStatus === 'VERIFIED' || identityStatus === 'MATCHED';

  // Not identified yet
  if (!isIdentified) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4 text-center animate-in fade-in duration-200">
        <div className="w-16 h-16 rounded-3xl bg-neutral-100 border border-neutral-200 flex items-center justify-center">
          <Lock className="w-8 h-8 text-neutral-400" />
        </div>
        <div>
          <h3 className="text-base font-black text-neutral-900">Patient Not Identified</h3>
          <p className="text-sm text-neutral-500 mt-1 max-w-xs">
            ER dashboard unlocks automatically once patient identity is verified via biometric scan.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCurrentScreen('emergency-landing')}
          className="px-5 py-2.5 bg-neutral-950 text-[#FFB800] rounded-2xl font-bold text-xs flex items-center gap-2"
        >
          <ArrowRight className="w-4 h-4" />
          <span>Go to Emergency Intake</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-28 animate-in fade-in duration-200">

      {/* ─── ER Command Header ────────────────────────────────────── */}
      <div className="bg-neutral-950 text-white rounded-3xl p-5 border border-neutral-800 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
              <span className="text-red-400 font-bold uppercase">TRAUMA BAY #01 · CRITICAL</span>
            </div>
            <h1 className="text-lg font-black text-white tracking-tight mt-1">
              ER Intelligence Dashboard
            </h1>
            <p className="text-[11px] font-mono text-neutral-400 mt-0.5">
              Attending: Dr. Sharma · AIIMS Delhi
            </p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-[10px] font-mono text-neutral-500">ABHA</div>
            <div className="text-[11px] font-mono font-bold text-[#FFB800]">
              {currentPatient.abhaId}
            </div>
            <div className="text-[10px] font-mono text-neutral-600 mt-0.5">
              {new Date().toLocaleTimeString('en-IN', { hour12: false })} IST
            </div>
          </div>
        </div>
      </div>

      {/* ─── Sub-Tab: ER View / Access Control ───────────────────── */}
      <div className="flex gap-1 bg-neutral-100 rounded-2xl p-1">
        {(['er', 'access'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              tab === t
                ? 'bg-white text-neutral-950 shadow-sm'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            {t === 'er' ? '🏥 Doctor View' : '🔐 Access Control'}
          </button>
        ))}
      </div>

      {/* ─── ER Doctor View ──────────────────────────────────────── */}
      {tab === 'er' && (
        <div className="space-y-4">
          {/* Critical Action Row */}
          {currentPatient.hasBloodGroupConflict && !isConflictResolved && (
            <div className="bg-red-600 text-white rounded-3xl p-4 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0 animate-pulse" />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm">Blood Group Conflict — Do Not Transfuse</div>
                <p className="text-xs text-red-200 mt-0.5">
                  Apollo (B+) vs Fortis (O+). Resolve on the Patient tab first.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCurrentScreen('patient-identification')}
                className="px-3 py-1.5 bg-white text-red-700 rounded-xl text-xs font-bold shrink-0"
              >
                Resolve →
              </button>
            </div>
          )}

          {isConflictResolved && (
            <div className="bg-emerald-600 text-white rounded-3xl p-4 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <div>
                <div className="font-bold text-sm">Blood Group Confirmed: {resolvedBloodGroup}</div>
                <p className="text-xs text-emerald-100 mt-0.5">Safe for transfusion — bedside test logged.</p>
              </div>
            </div>
          )}

          {/* Patient Summary for Doctor */}
          <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-sm p-5 space-y-4">
            <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase">
              Clinical Summary
            </span>

            {/* Blood Group */}
            <div className="flex items-center justify-between py-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-red-500" />
                <span className="text-sm font-semibold text-neutral-800">Blood Group</span>
              </div>
              <span className={`font-black font-mono text-lg ${
                isConflictResolved ? 'text-emerald-700' : 'text-red-600'
              }`}>
                {isConflictResolved ? resolvedBloodGroup : '⚠️ CONFLICT'}
              </span>
            </div>

            {/* Allergies */}
            {currentPatient.allergies.map((a, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-none">
                <div className="flex items-center gap-2">
                  <Syringe className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-semibold text-neutral-800">{a.name}</span>
                </div>
                <span className="text-xs font-bold font-mono text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-lg">
                  DO NOT GIVE
                </span>
              </div>
            ))}

            {/* Conditions */}
            {currentPatient.acuteConditions.map((c, i) => (
              <div key={i} className="flex items-start justify-between gap-3 py-2 border-b border-neutral-100 last:border-none">
                <div className="flex items-start gap-2">
                  <Activity className="w-4 h-4 text-neutral-500 mt-0.5" />
                  <div>
                    <span className="text-sm font-semibold text-neutral-800">{c.name}</span>
                    <p className="text-xs text-neutral-500 mt-0.5">{c.notes}</p>
                  </div>
                </div>
                {c.verified && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />}
              </div>
            ))}
          </div>

          {/* Insurance Shield Note */}
          <button
            type="button"
            onClick={() => setIsInsuranceModalOpen(true)}
            className="w-full text-left bg-emerald-50/80 rounded-3xl border border-emerald-300 p-4 flex items-center gap-3"
          >
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold text-emerald-950">
                {currentPatient.shieldedRecordsCount} records blocked from Insurance/TPA
              </span>
              <p className="text-[10px] text-emerald-800 mt-0.5">
                Emergency scan purpose: EMERGENCY_CARE — private history is encrypted.
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-emerald-700 shrink-0" />
          </button>
        </div>
      )}

      {/* ─── Access Control Tab ──────────────────────────────────── */}
      {tab === 'access' && (
        <div className="space-y-4">
          {/* Header */}
          <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-sm p-5">
            <h3 className="text-sm font-black text-neutral-950 mb-0.5">
              Who Can See What
            </h3>
            <p className="text-[11px] text-neutral-500 mb-4">
              Access is scoped to purpose: <strong>EMERGENCY_CARE</strong>. Insurance companies are always blocked.
            </p>

            {/* Mobile-friendly card layout */}
            <div className="space-y-3">
              {PERMISSIONS.map((row, i) => (
                <div key={i} className="rounded-2xl border border-neutral-200/90 overflow-hidden">
                  {/* Category title */}
                  <div className="bg-neutral-50 px-3 py-2 border-b border-neutral-100">
                    <span className="text-xs font-semibold text-neutral-700">{row.category}</span>
                  </div>
                  {/* Role badges */}
                  <div className="p-3">
                    <div className="flex flex-wrap gap-1.5">
                      {ROLE_LABELS.map(({ key, label, icon }) => {
                        const status = row[key];
                        const allowed = status === 'allowed';
                        return (
                          <span
                            key={key}
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold font-mono border ${
                              key === 'insuranceTpa'
                                ? 'bg-red-50 text-red-700 border-red-200 line-through opacity-70'
                                : allowed
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                  : 'bg-neutral-100 text-neutral-400 border-neutral-200'
                            }`}
                          >
                            {icon}
                            <span>{label}</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Insurance TPA Block Explainer */}
          <div className="bg-neutral-950 text-white rounded-3xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <EyeOff className="w-4 h-4 text-[#FFB800]" />
              <span className="text-[#FFB800] font-bold text-sm">Why Insurance can never see this</span>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              When you buy insurance, doctors often hide past conditions to avoid denial. MEDIQ prevents that loop: emergency scans are purpose-locked to <strong className="text-white">EMERGENCY_CARE</strong> only. Insurance TPAs cannot query this endpoint — ever — regardless of court orders or claims investigations.
            </p>
            <button
              type="button"
              onClick={() => setIsInsuranceModalOpen(true)}
              className="mt-3 text-xs font-bold text-[#FFB800] underline"
            >
              See the technical breakdown →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
