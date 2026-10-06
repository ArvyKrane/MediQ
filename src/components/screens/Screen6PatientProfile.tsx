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
  EyeOff,
} from 'lucide-react';
import { useMediq } from '../../context/MediqContext';
import { VerificationBadge } from '../common/VerificationBadge';

export const Screen6PatientProfile: React.FC = () => {
  const {
    currentPatient,
    resolvedBloodGroup,
    isConflictResolved,
    clinicalTrustScore,
    identityConfidence,
    setSelectedEvidenceItem,
    setCurrentScreen,
    setIsInsuranceModalOpen,
  } = useMediq();

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      {/* Patient Header Card */}
      <div className="bg-white rounded-2xl border border-neutral-200/90 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-neutral-100">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-neutral-950 text-[#FFB800] flex items-center justify-center font-black text-xl shadow-xs shrink-0">
              {currentPatient.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-black text-neutral-950 tracking-tight">
                  {currentPatient.name}
                </h1>
                <span className="font-mono text-xs bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded font-bold">
                  {currentPatient.id}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500 font-mono mt-1">
                <span>DOB: {currentPatient.dob} ({currentPatient.age}y)</span>
                <span>&bull;</span>
                <span>{currentPatient.gender}</span>
                <span>&bull;</span>
                <span className="text-emerald-800 font-bold">ABHA: {currentPatient.abhaId}</span>
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

            {/* Match Accuracy */}
            <div className="bg-[#F8F9FA] p-3 rounded-xl border border-neutral-200/80">
              <span className="text-[10px] text-neutral-400 block uppercase font-bold">
                MATCH ACCURACY
              </span>
              <span className="text-xs font-bold text-neutral-900 mt-0.5 block">
                {identityConfidence.toFixed(1)}%
              </span>
            </div>

            {/* Record Reliability */}
            <div className="bg-[#F8F9FA] p-3 rounded-xl border border-neutral-200/80">
              <span className="text-[10px] text-neutral-400 block uppercase font-bold">
                CLINICAL TRUST
              </span>
              <span className="text-xs font-bold text-emerald-700 mt-0.5 block">
                {clinicalTrustScore}%
              </span>
            </div>

            {/* Access Status */}
            <div className="bg-neutral-950 text-[#FFB800] p-3 rounded-xl border border-neutral-800">
              <span className="text-[10px] text-neutral-400 block uppercase font-bold">
                ACCESS
              </span>
              <span className="text-xs font-bold flex items-center gap-1 mt-0.5">
                <UserCheck className="w-3.5 h-3.5" />
                AUTHORIZED
              </span>
            </div>
          </div>
        </div>

        {/* Insurance Shield & Evidence Sub-bar */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsInsuranceModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold hover:bg-emerald-100 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{currentPatient.shieldedRecordsCount} Non-Emergency Past Records Protected from Insurance Crawlers</span>
            </button>
          </div>

          <button
            onClick={() => setSelectedEvidenceItem('Complete Emergency Capsule')}
            className="text-neutral-900 font-bold hover:text-amber-600 underline flex items-center gap-1"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Why can I trust this data? →</span>
          </button>
        </div>
      </div>

      {/* Critical Medical Information Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-mono text-xs uppercase font-bold text-neutral-900 tracking-wider">
              CRITICAL LIFE-SAVING MEDICAL INFORMATION
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Only high-priority emergency fields are retrieved; non-emergency OPD history remains shielded.
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
                {isConflictResolved ? (
                  resolvedBloodGroup
                ) : currentPatient.hasBloodGroupConflict ? (
                  'B+ / O+ [DISPUTED]'
                ) : (
                  currentPatient.bloodGroup
                )}
              </div>
              <p className="text-xs text-neutral-600 mt-2">
                {isConflictResolved
                  ? 'Confirmed by attending doctor via bedside agglutination test.'
                  : currentPatient.hasBloodGroupConflict
                  ? 'Conflict detected between Apollo Hospital (B+) and Fortis (O+).'
                  : 'Consistent across linked medical centers.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
              <span className="text-[11px] font-mono text-neutral-500">
                {isConflictResolved ? 'Bedside Verified' : 'Safety Check Active'}
              </span>
              <button
                onClick={() => setSelectedEvidenceItem('Blood Group')}
                className="text-xs font-semibold text-neutral-900 hover:text-amber-600 underline"
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
                  Known Allergies
                </span>
                <VerificationBadge level="High" text="Trust: HIGH" />
              </div>
              <div className="text-2xl font-black text-red-600">
                {currentPatient.allergies.map(a => a.name).join(', ')}
              </div>
              <p className="text-xs text-neutral-600 mt-2">
                {currentPatient.allergies[0]?.source || 'Reported severe anaphylactoid hypersensitivity.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
              <span className="text-[11px] font-mono text-red-600 font-bold">
                DO NOT ADMINISTER
              </span>
              <button
                onClick={() => setSelectedEvidenceItem('Allergy Proof')}
                className="text-xs font-semibold text-neutral-900 hover:text-amber-600 underline"
              >
                Inspect Proof →
              </button>
            </div>
          </div>

          {/* Medications */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] text-neutral-400 font-bold uppercase">
                  Active Emergency Medications
                </span>
                <VerificationBadge level="Medium" text="Trust: MEDIUM" />
              </div>
              <div className="text-base font-bold text-neutral-900">
                {currentPatient.medications.map(m => `${m.name} (${m.dosage})`).join(', ')}
              </div>
              <p className="text-xs text-neutral-500 mt-2">
                Active prescriptions pulled from linked hospital pharmacies.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
              <span className="text-[11px] font-mono text-neutral-500">
                {currentPatient.medications.length} Active Rx
              </span>
              <button
                onClick={() => setSelectedEvidenceItem('Medications')}
                className="text-xs font-semibold text-neutral-900 hover:text-amber-600 underline"
              >
                Inspect Proof →
              </button>
            </div>
          </div>

          {/* Acute Conditions */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] text-neutral-400 font-bold uppercase">
                  Acute Conditions
                </span>
                <VerificationBadge level="High" text="Trust: HIGH" />
              </div>
              <div className="text-lg font-bold text-neutral-900">
                {currentPatient.acuteConditions.map(c => c.name).join(', ')}
              </div>
              <p className="text-xs text-neutral-600 mt-2">
                {currentPatient.acuteConditions[0]?.notes}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
              <span className="text-[11px] font-mono text-neutral-500">
                Doctor Attested
              </span>
              <button
                onClick={() => setSelectedEvidenceItem('Conditions')}
                className="text-xs font-semibold text-neutral-900 hover:text-amber-600 underline"
              >
                Inspect Proof →
              </button>
            </div>
          </div>

          {/* Shielded Past History Card */}
          <div className="bg-emerald-50/70 rounded-xl border border-emerald-300 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] text-emerald-800 font-bold uppercase">
                  Insurance Shield
                </span>
                <span className="text-[10px] font-mono bg-emerald-600 text-white font-bold px-2 py-0.5 rounded">
                  HIDDEN
                </span>
              </div>
              <div className="text-lg font-bold text-emerald-950 flex items-center gap-1.5">
                <EyeOff className="w-5 h-5 text-emerald-700" />
                <span>{currentPatient.shieldedRecordsCount} Routine Past Records</span>
              </div>
              <p className="text-xs text-neutral-600 mt-2">
                Minor past consultations, dental work, and non-emergency doctor visits are <strong>never</strong> exposed to insurance auditors.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-emerald-200 flex items-center justify-between">
              <button
                onClick={() => setIsInsuranceModalOpen(true)}
                className="text-xs font-bold text-emerald-800 hover:underline"
              >
                Verify Insurance Safety →
              </button>
            </div>
          </div>

          {/* Emergency Guardian */}
          <div className="bg-[#F8F9FA] rounded-xl border border-neutral-200 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] text-neutral-400 font-bold uppercase">
                  Next of Kin Contact
                </span>
                <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                  Protected Proxy
                </span>
              </div>
              <div className="text-lg font-bold text-neutral-900">
                {currentPatient.emergencyContact.name} ({currentPatient.emergencyContact.relationship})
              </div>
              <p className="text-xs text-neutral-600 mt-2 font-mono">
                {currentPatient.emergencyContact.maskedPhone}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-neutral-200 flex items-center justify-between">
              <button
                onClick={() => setCurrentScreen('emergency-contact')}
                className="text-xs font-bold text-neutral-950 hover:text-amber-600 underline"
              >
                Launch Private Call Console →
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
