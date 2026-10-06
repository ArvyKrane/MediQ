import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Activity,
  UserCheck,
  FileText,
  Lock,
  Stethoscope,
  HeartPulse,
  Syringe,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Users,
  Settings,
  Flame,
  Clock,
} from 'lucide-react';
import { useMediq } from '../../context/MediqContext';

export const Screen7DoctorDashboard: React.FC = () => {
  const {
    currentPatient,
    resolvedBloodGroup,
    isConflictResolved,
    isConflictLocked,
    clinicalTrustScore,
    identityConfidence,
    setCurrentScreen,
    setSelectedEvidenceItem,
  } = useMediq();

  const [activeSidebarItem, setActiveSidebarItem] = useState('Emergency');

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      {/* ER Top Command Banner */}
      <div className="bg-neutral-950 text-white rounded-2xl p-5 border border-neutral-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#FFB800] text-black flex items-center justify-center font-black text-base shadow-sm">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span className="text-red-400 font-bold uppercase">TRAUMA BAY #01 &bull; CRITICAL INTAKE</span>
              <span className="text-neutral-500">&bull; Attending: Dr. Sharma</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
              Doctor / Emergency Room Intelligence Center
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800">
            <span className="text-neutral-500 block text-[10px]">PATIENT ABHA</span>
            <span className="text-[#FFB800] font-bold">{currentPatient.abhaId}</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800">
            <span className="text-neutral-500 block text-[10px]">INSURANCE SHIELD</span>
            <span className="text-emerald-400 font-bold">100% PROTECTED</span>
          </div>
        </div>
      </div>

      {/* Main Layout: Embedded Workspace with Sidebar + Center + Intelligence Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Inner Mini Sidebar (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-200/90 p-3 shadow-xs space-y-1 h-fit">
          <div className="px-3 py-2 font-mono text-[10px] text-neutral-400 uppercase font-bold tracking-wider">
            ER CONSOLE
          </div>
          {[
            { label: 'Emergency', icon: Flame, screen: 'doctor-dashboard' },
            { label: 'Patients', icon: Users, screen: 'patient-profile' },
            { label: 'Medical Records', icon: FileText, screen: 'clinical-trust' },
            { label: 'Access Control', icon: Lock, screen: 'access-control' },
            { label: 'Audit Logs', icon: Clock, screen: 'audit-log' },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeSidebarItem === item.label;
            return (
              <button
                key={item.label}
                onClick={() => {
                  setActiveSidebarItem(item.label);
                  if (item.screen !== 'doctor-dashboard') {
                    setCurrentScreen(item.screen as any);
                  }
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors ${
                  isActive
                    ? 'bg-neutral-950 text-[#FFB800] shadow-xs'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Center Main Dashboard (6 cols) */}
        <div className="lg:col-span-6 space-y-5">
          {/* Active Emergency Patient Card */}
          <div className="bg-white rounded-2xl border border-neutral-200/90 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
                <span className="font-mono text-xs uppercase font-bold text-neutral-900">
                  ACTIVE TRAUMA PATIENT
                </span>
              </div>
              <span className="text-xs font-mono bg-neutral-100 px-2 py-0.5 rounded text-neutral-700 font-semibold">
                Arrival: 23:32 IST
              </span>
            </div>

            <div className="mt-4 flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-neutral-400 font-semibold">
                  Patient Identified via ABHA
                </span>
                <h3 className="text-xl font-black text-neutral-950">{currentPatient.name}</h3>
                <div className="text-xs font-mono text-neutral-500 mt-0.5">
                  ID: <strong className="text-neutral-800">{currentPatient.id}</strong> &bull; {currentPatient.age}y {currentPatient.gender} &bull; Unconscious
                </div>
              </div>

              {/* Status Badges */}
              <div className="flex flex-col items-end gap-1.5 font-mono text-xs">
                <span className="bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded font-bold">
                  Match: {identityConfidence}% Acc
                </span>
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-bold">
                  Clinical Trust: {clinicalTrustScore}%
                </span>
                <span className="bg-neutral-950 text-[#FFB800] px-2 py-0.5 rounded font-bold">
                  Access: AUTHORIZED
                </span>
              </div>
            </div>

            {/* Critical Alerts Checklist */}
            <div className="mt-5 space-y-2">
              <span className="font-mono text-xs uppercase font-bold text-neutral-500 block tracking-wider">
                CRITICAL TRIAGE ALERTS
              </span>

              <div className="space-y-2 text-xs">
                {/* Blood Group Conflict Alert */}
                {currentPatient.hasBloodGroupConflict && (
                  <div
                    className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                      isConflictResolved
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                        : 'bg-red-50/70 border-red-200 text-red-950'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isConflictResolved ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 animate-pulse" />
                      )}
                      <span className="font-semibold">
                        {isConflictResolved
                          ? `Blood group verified: ${resolvedBloodGroup} (Bedside Verified)`
                          : '⚠️ Blood group conflict: Apollo (B+) vs Fortis (O+)'}
                      </span>
                    </div>
                    {!isConflictResolved && (
                      <button
                        onClick={() => setCurrentScreen('clinical-trust')}
                        className="text-xs font-bold text-red-700 underline shrink-0"
                      >
                        Resolve →
                      </button>
                    )}
                  </div>
                )}

                {/* Identity Verified */}
                <div className="p-2.5 rounded-xl border border-neutral-200/80 bg-[#F8F9FA] flex items-center justify-between">
                  <div className="flex items-center gap-2 text-neutral-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="font-medium">✓ Identity verified via Face &amp; ABHA Biometric Registry</span>
                  </div>
                  <span className="font-mono text-[10px] text-neutral-500">&gt;90% Threshold</span>
                </div>

                {/* Emergency Contact */}
                <div className="p-2.5 rounded-xl border border-neutral-200/80 bg-[#F8F9FA] flex items-center justify-between">
                  <div className="flex items-center gap-2 text-neutral-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="font-medium">✓ Emergency contact reachable: {currentPatient.emergencyContact.name} ({currentPatient.emergencyContact.relationship})</span>
                  </div>
                  <button
                    onClick={() => setCurrentScreen('emergency-contact')}
                    className="font-mono text-[10px] text-amber-700 hover:underline font-bold"
                  >
                    Call Proxy →
                  </button>
                </div>

                {/* Allergy Verified */}
                <div className="p-2.5 rounded-xl border border-neutral-200/80 bg-[#F8F9FA] flex items-center justify-between">
                  <div className="flex items-center gap-2 text-neutral-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="font-medium">
                      ✓ Allergy warning: {currentPatient.allergies.map(a => a.name).join(', ')} Anaphylaxis
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-red-600 font-bold bg-red-100 px-1.5 py-0.2 rounded">
                    CONTRAINDICATED
                  </span>
                </div>
              </div>
            </div>

            {/* Medical Summary Grid */}
            <div className="mt-6 pt-4 border-t border-neutral-100">
              <span className="font-mono text-xs uppercase font-bold text-neutral-500 block mb-3 tracking-wider">
                RAPID ACTION SUMMARY
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                <div className="bg-[#F8F9FA] p-3 rounded-xl border border-neutral-200">
                  <span className="text-[10px] font-mono text-neutral-400 block uppercase font-bold">
                    Blood Group
                  </span>
                  <span className="text-lg font-black font-mono text-neutral-900 mt-0.5 block">
                    {isConflictResolved
                      ? resolvedBloodGroup
                      : currentPatient.hasBloodGroupConflict
                      ? 'B+ / O+'
                      : currentPatient.bloodGroup}
                  </span>
                </div>

                <div className="bg-[#F8F9FA] p-3 rounded-xl border border-neutral-200">
                  <span className="text-[10px] font-mono text-neutral-400 block uppercase font-bold">
                    Allergies
                  </span>
                  <span className="text-sm font-bold text-red-600 mt-1 block">
                    {currentPatient.allergies[0]?.name || 'None'}
                  </span>
                </div>

                <div className="bg-[#F8F9FA] p-3 rounded-xl border border-neutral-200">
                  <span className="text-[10px] font-mono text-neutral-400 block uppercase font-bold">
                    Active Meds
                  </span>
                  <span className="text-sm font-bold text-neutral-800 mt-1 block">
                    {currentPatient.medications.length} active
                  </span>
                </div>

                <div className="bg-[#F8F9FA] p-3 rounded-xl border border-neutral-200">
                  <span className="text-[10px] font-mono text-neutral-400 block uppercase font-bold">
                    Conditions
                  </span>
                  <span className="text-sm font-bold text-neutral-800 mt-1 block truncate">
                    {currentPatient.acuteConditions[0]?.name.split(' ')[0] || 'None'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right-Side Panel: "INTELLIGENCE SUMMARY" (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-neutral-950 text-white rounded-2xl p-5 border border-neutral-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2 text-[#FFB800]">
                <Sparkles className="w-4 h-4" />
                <h3 className="font-mono text-xs uppercase font-bold tracking-wider text-[#FFB800]">
                  INTELLIGENCE SUMMARY
                </h3>
              </div>
              <span className="text-[10px] font-mono text-neutral-400">
                Actionable Triage
              </span>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed">
              Synthesizing raw records into immediate, life-saving trauma decisions without data overload.
            </p>

            <div className="space-y-3.5 text-xs">
              {/* Item 1 */}
              <div className="bg-neutral-900/80 p-3.5 rounded-xl border border-neutral-800">
                <span className="font-mono text-[10px] text-neutral-400 uppercase font-bold block">
                  PATIENT IDENTITY
                </span>
                <p className="text-neutral-200 font-semibold mt-1">
                  Verified as {currentPatient.name} via ABHA ID ({currentPatient.abhaId})
                </p>
                <div className="text-[11px] text-neutral-500 mt-0.5">
                  Face vector matched national health registry photo.
                </div>
              </div>

              {/* Item 2 */}
              <div className="bg-neutral-900/80 p-3.5 rounded-xl border border-neutral-800">
                <span className="font-mono text-[10px] text-red-400 uppercase font-bold block">
                  CLINICAL RISK
                </span>
                <p className="text-neutral-200 font-semibold mt-1">
                  {currentPatient.hasBloodGroupConflict && !isConflictResolved
                    ? 'Blood group conflict requires bedside clinician confirmation'
                    : 'Severe Penicillin anaphylaxis reaction documented'}
                </p>
                <div className="text-[11px] text-neutral-500 mt-0.5">
                  {currentPatient.hasBloodGroupConflict && !isConflictResolved
                    ? 'Two major hospitals have contradictory records logged.'
                    : 'Avoid all beta-lactam antibiotics.'}
                </div>
              </div>

              {/* Item 3 */}
              <div className="bg-amber-950/30 p-3.5 rounded-xl border border-amber-500/40">
                <span className="font-mono text-[10px] text-[#FFB800] uppercase font-bold block">
                  IMMEDIATE ACTION
                </span>
                <p className="text-amber-200 font-bold mt-1">
                  {currentPatient.hasBloodGroupConflict && !isConflictResolved
                    ? 'Avoid relying on blood record until bedside test confirms B+ vs O+'
                    : 'Transfuse compatible blood; keep airway support ready for asthma.'}
                </p>
                <div className="text-[11px] text-amber-300/80 mt-0.5">
                  Administer O-negative blood if immediate uncrossmatched transfusion is mandated.
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setCurrentScreen('access-control')}
                className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-neutral-100 text-black text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
              >
                <span>VIEW ACCESS &amp; INSURANCE CONTROLS</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
