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
  QrCode,
} from 'lucide-react';
import { useMediq } from '../../context/MediqContext';

export const Screen3IdentityVerification: React.FC = () => {
  const {
    currentPatient,
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
              Screen 03 &bull; ABHA Identity Attestation
            </span>
            <span className="text-[11px] font-mono text-emerald-700 font-bold">
              Match Accuracy &gt; 90%
            </span>
          </div>
          <h2 className="text-2xl font-black text-neutral-950 tracking-tight mt-1">
            Patient Identity &amp; ABHA Binding
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Confirmed match against national digital health database and previous hospital admission archives.
          </p>
        </div>

        {hasConfirmedLocal && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-mono font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>ABHA IDENTITY CONFIRMED ✓</span>
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
                  CONFIRMED PATIENT
                </span>
                <h3 className="text-2xl font-black text-neutral-950 mt-0.5">
                  {currentPatient.name}
                </h3>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-xs font-mono text-neutral-600">
                  <span>DOB: <strong>{currentPatient.dob}</strong> ({currentPatient.age}y)</span>
                  <span>&bull;</span>
                  <span>Gender: <strong>{currentPatient.gender}</strong></span>
                </div>
                <div className="mt-2 flex flex-wrap gap-2 text-xs font-mono">
                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-bold">
                    ABHA: {currentPatient.abhaId}
                  </span>
                  <span className="bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded">
                    Number: {currentPatient.abhaNumber}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono font-bold uppercase bg-amber-50 text-amber-900 border border-amber-200 px-2 py-1 rounded">
                  {hasConfirmedLocal ? 'Confirmed & Bound' : 'Ready to Confirm'}
                </span>
              </div>
            </div>

            {/* Match Confidence Progress */}
            <div className="my-5 bg-[#F8F9FA] p-4 rounded-xl border border-neutral-200/80">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-bold text-neutral-800">Biometric &amp; ID Consensus Score</span>
                <span className="font-mono font-bold text-neutral-950 bg-white px-2 py-0.5 rounded border border-neutral-200">
                  {identityConfidence}%
                </span>
              </div>
              <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-[#FFB800] rounded-full"
                  style={{ width: `${identityConfidence}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-neutral-400 font-mono mt-1">
                <span>Uncertain</span>
                <span className="text-emerald-700 font-bold">90% Safety Verified</span>
                <span>Exact Match</span>
              </div>
            </div>

            {/* Verification Sources Checklist */}
            <div className="space-y-2.5">
              <span className="font-mono text-xs uppercase font-bold text-neutral-500 tracking-wider block">
                VERIFICATION PROOFS (3 INDEPENDENT CHECKS)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* 1. FaceScan */}
                <div className="p-3 rounded-xl border border-neutral-200/80 bg-white flex items-center justify-between shadow-2xs">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                      <Camera className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-neutral-900">Face Scan</div>
                      <div className="text-[11px] font-mono text-neutral-500">94.2% Match with ABHA</div>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    ✓ Matched
                  </span>
                </div>

                {/* 2. Fingerprint */}
                <div className="p-3 rounded-xl border border-neutral-200/80 bg-white flex items-center justify-between shadow-2xs">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                      <Fingerprint className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-neutral-900">Fingerprint</div>
                      <div className="text-[11px] font-mono text-neutral-500">Minutiae Match Confirmed</div>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    ✓ Matched
                  </span>
                </div>

                {/* 3. Physical ID Card */}
                <div className="p-3 rounded-xl border border-neutral-200/80 bg-white flex items-center justify-between shadow-2xs">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-neutral-900">Physical ID Card</div>
                      <div className="text-[11px] font-mono text-neutral-500">{currentPatient.maskedGovId}</div>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    ✓ Verified
                  </span>
                </div>

                {/* 4. Hospital Registry Cross-Match */}
                <div className="p-3 rounded-xl border border-neutral-200/80 bg-white flex items-center justify-between shadow-2xs">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                      <Building className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-neutral-900">Hospital Consensus</div>
                      <div className="text-[11px] font-mono text-neutral-500">Linked to {currentPatient.linkedHospitals.length} Hospitals</div>
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
                  <span>CONFIRM IDENTITY &amp; PULL EMERGENCY RECORDS</span>
                </button>
              ) : (
                <div className="w-full space-y-2">
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      IDENTITY LOCKED &bull; {currentPatient.name.toUpperCase()} ({currentPatient.abhaId})
                    </span>
                    <span className="font-mono text-[10px] text-emerald-700">ACTIVE INTAKE</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setCurrentScreen('clinical-trust')}
                    className="w-full py-3 px-6 rounded-xl bg-neutral-950 hover:bg-black text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all group"
                  >
                    <span className="text-[#FFB800]">INSPECT MEDICAL RECORDS &amp; CONFLICTS</span>
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
                HOW THIS PATIENT WAS IDENTIFIED
              </span>
              <span className="text-[11px] font-mono text-neutral-400">
                Timeline
              </span>
            </div>

            <div className="relative pl-6 space-y-6 mt-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-200">
              {/* Event 1 */}
              <div className="relative">
                <div className="absolute -left-6 top-0 w-4 h-4 rounded-full bg-neutral-900 border-2 border-white flex items-center justify-center" />
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-neutral-900 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-neutral-500" />
                    Apollo Hospital Registration
                  </span>
                  <span className="text-neutral-400">2024</span>
                </div>
                <p className="text-xs text-neutral-600 mt-1">
                  Patient registered under national ABHA initiative during outpatient clinic visit.
                </p>
              </div>

              {/* Event 2 */}
              <div className="relative">
                <div className="absolute -left-6 top-0 w-4 h-4 rounded-full bg-neutral-900 border-2 border-white flex items-center justify-center" />
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-neutral-900 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-neutral-500" />
                    Government ID Authentication
                  </span>
                  <span className="text-neutral-400">2022</span>
                </div>
                <p className="text-xs text-neutral-600 mt-1">
                  Facial biometrics and Aadhaar / Driving License linked to ABHA profile.
                </p>
              </div>

              {/* Event 3 */}
              <div className="relative">
                <div className="absolute -left-6 top-0 w-4 h-4 rounded-full bg-[#FFB800] border-2 border-neutral-900 flex items-center justify-center" />
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-neutral-900 flex items-center gap-1.5">
                    <Ambulance className="w-3.5 h-3.5 text-amber-600" />
                    Ambulance Intake (Live)
                  </span>
                  <span className="text-amber-700 font-bold">Today</span>
                </div>
                <p className="text-xs text-neutral-600 mt-1">
                  Field camera match completed in 1.6 seconds without requiring any NFC card.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
