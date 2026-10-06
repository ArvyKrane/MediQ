import React, { useState } from 'react';
import {
  Camera,
  Fingerprint,
  CreditCard,
  AlertTriangle,
  ArrowRight,
  Shield,
  Activity,
  UserX,
  Crosshair,
  Sparkles,
  Lock,
  Flame,
  Radio,
  Scan,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Search,
} from 'lucide-react';
import { useMediq } from '../../context/MediqContext';
import { AbhaScannerModal } from '../common/AbhaScannerModal';
import type { ScanInputMethod } from '../../types/mediq';

export const Screen1EmergencyLanding: React.FC = () => {
  const {
    setCurrentScreen,
    currentPatient,
    identityStatus,
    identityConfidence,
    scanFace,
    scanFingerprint,
    scanIdCard,
    fingerprintVerified,
    idCardVerified,
    setIsInsuranceModalOpen,
    isConflictResolved,
    resolvedBloodGroup,
  } = useMediq();

  const [scannerModalOpen, setScannerModalOpen] = useState(false);
  const [modalMethod, setModalMethod] = useState<ScanInputMethod>('face');

  const openScanner = (method: ScanInputMethod) => {
    setModalMethod(method);
    setScannerModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      {/* Platform Mission Banner - Plain English */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-neutral-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-neutral-950 text-[#FFB800] flex items-center justify-center shrink-0 shadow-xs">
            <Activity className="w-6 h-6 text-[#FFB800]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-wider text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                ABHA-Powered Emergency Care
              </span>
              <span className="text-[11px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                No NFC Required
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-neutral-950 tracking-tight mt-1">
              MEDIQ Emergency Medical Intelligence
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-3xl leading-relaxed">
              When an unconscious patient arrives without family, MEDIQ scans their <strong>Face</strong>, <strong>Fingerprint</strong>, or <strong>ID Card</strong> to find their <strong>ABHA ID</strong>, fetch critical life-saving history, and alert doctors to dangerous conflicts.
            </p>
          </div>
        </div>

        {/* Insurance Shield Callout Badge */}
        <button
          type="button"
          onClick={() => setIsInsuranceModalOpen(true)}
          className="w-full md:w-auto bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-300 p-3 rounded-2xl text-left transition-all group shrink-0"
        >
          <div className="flex items-center gap-2 font-bold text-xs text-emerald-900">
            <ShieldCheck className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
            <span>Insurance Protection Shield</span>
          </div>
          <p className="text-[11px] text-emerald-700 mt-0.5">
            Emergency scans <strong>never</strong> leak past medical records to insurance companies.
          </p>
          <span className="text-[10px] font-mono text-emerald-800 font-bold underline mt-1 block">
            Tap to learn why →
          </span>
        </button>
      </div>

      {/* Prominent Clinical Conflict Warning Card */}
      {currentPatient.hasBloodGroupConflict && !isConflictResolved && (
        <div className="bg-red-50/80 border-2 border-red-400 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-red-100 rounded-xl text-red-600 shrink-0 mt-0.5">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-red-700 bg-red-100 px-2 py-0.5 rounded">
                  ⚠️ DANGEROUS MEDICAL CONFLICT DETECTED
                </span>
                <span className="text-xs font-bold text-neutral-900">
                  Transfusion Warning
                </span>
              </div>
              <h3 className="text-base font-bold text-neutral-950 mt-1">
                Two Hospitals Disagree on Blood Group: <span className="text-red-700 font-mono text-lg">B+ vs O+</span>
              </h3>
              <p className="text-xs text-neutral-700 mt-1 leading-relaxed">
                Apollo Hospital records say <strong className="text-neutral-900">B+</strong> (2025 cross-match), but Fortis Hospital records say <strong className="text-neutral-900">O+</strong> (2023 intake). 
                <strong> MEDIQ will never automatically guess or merge conflicting critical data.</strong>
              </p>
              <div className="mt-2 text-xs font-mono text-red-700 font-bold">
                Action Required: Perform bedside finger-prick blood test before giving any blood.
              </div>
            </div>
          </div>

          <div className="shrink-0 flex sm:flex-col gap-2">
            <button
              type="button"
              onClick={() => setCurrentScreen('clinical-trust')}
              className="py-2.5 px-4 rounded-xl bg-neutral-950 hover:bg-black text-[#FFB800] text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>VERIFY &amp; RESOLVE CONFLICT</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Patient Card Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Patient Silhouette & Identity State Card (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-neutral-200/90 shadow-xs p-6 relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                <span className="font-mono text-xs uppercase tracking-widest text-neutral-500 font-bold">
                  TRIAGE STATUS: PATIENT INTAKE
                </span>
              </div>
              <span className="font-mono text-xs bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-md font-bold">
                {identityStatus === 'VERIFIED' ? '✓ ABHA Verified' : 'Awaiting Scan'}
              </span>
            </div>

            {/* Silhouette + Data Area */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 mt-6 items-center">
              {/* Silhouette Avatar */}
              <div className="sm:col-span-5 flex flex-col items-center justify-center p-6 bg-[#F8F9FA] rounded-2xl border border-neutral-200 relative group">
                <div className="relative w-36 h-36 rounded-2xl bg-neutral-200/80 flex items-center justify-center border-2 border-dashed border-neutral-300 overflow-hidden">
                  <div className="absolute inset-0 bg-neutral-100 flex items-center justify-center">
                    <UserX className="w-20 h-20 text-neutral-400" />
                  </div>
                  <Crosshair className="absolute top-2 left-2 w-4 h-4 text-neutral-400" />
                  <Crosshair className="absolute bottom-2 right-2 w-4 h-4 text-neutral-400" />
                  {identityStatus === 'SCANNING' && <div className="animate-scanline" />}
                </div>
                <div className="mt-3 text-center">
                  <span className="font-mono text-xs font-bold text-neutral-900 bg-white px-2 py-0.5 rounded border border-neutral-200">
                    {identityStatus === 'VERIFIED' ? currentPatient.id : 'UNIDENTIFIED'}
                  </span>
                  <div className="text-[11px] text-neutral-500 mt-1 font-mono">
                    {identityStatus === 'VERIFIED' ? currentPatient.abhaId : 'Awaiting Input Scan'}
                  </div>
                </div>
              </div>

              {/* Patient Identity Telemetry */}
              <div className="sm:col-span-7 space-y-4">
                <div>
                  <span className="font-mono text-xs font-semibold text-neutral-400 uppercase">
                    Patient Name
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <h2 className="text-2xl font-black text-neutral-950 tracking-tight">
                      {identityStatus === 'VERIFIED' ? currentPatient.name : 'UNKNOWN PATIENT'}
                    </h2>
                    <span className="text-[10px] font-mono font-bold bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded border border-neutral-200">
                      UNCONSCIOUS
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Match candidate: <strong className="text-neutral-900 font-sans">{currentPatient.name}</strong> ({currentPatient.age}y, {currentPatient.gender})
                  </p>
                </div>

                {/* Match Accuracy Indicator */}
                <div className="bg-[#F8F9FA] p-3.5 rounded-xl border border-neutral-200/80">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="font-semibold text-neutral-700">Identity Match Accuracy</span>
                    <span className="font-mono font-bold text-neutral-950 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {identityConfidence}% Match
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-neutral-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-[#FFB800] rounded-full transition-all duration-700"
                      style={{ width: `${identityConfidence}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-neutral-400 font-mono mt-1">
                    <span>Low Match</span>
                    <span className="text-neutral-700 font-bold">90% Safety Threshold</span>
                    <span>High Accuracy</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="bg-[#F8F9FA] p-2.5 rounded-lg border border-neutral-200/60">
                    <span className="text-neutral-400 text-[10px] block">ABHA ADDRESS</span>
                    <span className="font-bold text-neutral-900 truncate block">
                      {currentPatient.abhaId}
                    </span>
                  </div>
                  <div className="bg-[#F8F9FA] p-2.5 rounded-lg border border-neutral-200/60">
                    <span className="text-neutral-400 text-[10px] block">LINKED HOSPITALS</span>
                    <span className="font-bold text-neutral-900">
                      {currentPatient.linkedHospitals.length} Facilities
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Identity Inputs (No NFC) */}
          <div className="mt-8 pt-6 border-t border-neutral-100">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs text-neutral-500 uppercase tracking-wider font-semibold block">
                3 ZERO-FRICTION INPUT MODES (NO NFC REQUIRED)
              </span>
              <span className="text-[10px] font-mono text-emerald-700 font-bold">
                Resolves to ABHA ID
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-4">
              {/* 1. Face Scan */}
              <button
                type="button"
                onClick={() => openScanner('face')}
                className="p-3.5 rounded-xl border border-neutral-200 hover:border-amber-400 bg-white hover:bg-amber-50/40 text-left transition-all group shadow-2xs"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-neutral-100 group-hover:bg-[#FFB800] text-neutral-900 group-hover:text-black transition-colors">
                    <Camera className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                    Camera
                  </span>
                </div>
                <div className="font-bold text-xs text-neutral-950">FACE SCAN</div>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Matches face against ABHA photo registry
                </p>
              </button>

              {/* 2. Fingerprint Scan */}
              <button
                type="button"
                onClick={() => openScanner('fingerprint')}
                className="p-3.5 rounded-xl border border-neutral-200 hover:border-amber-400 bg-white hover:bg-amber-50/40 text-left transition-all group shadow-2xs"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-neutral-100 group-hover:bg-[#FFB800] text-neutral-900 group-hover:text-black transition-colors">
                    <Fingerprint className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                    {fingerprintVerified ? '✓ Matched' : 'Sensor'}
                  </span>
                </div>
                <div className="font-bold text-xs text-neutral-950">FINGERPRINT</div>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Capacitive biometric touch sensor
                </p>
              </button>

              {/* 3. Physical ID Card Scan */}
              <button
                type="button"
                onClick={() => openScanner('id-card')}
                className="p-3.5 rounded-xl border border-neutral-200 hover:border-amber-400 bg-white hover:bg-amber-50/40 text-left transition-all group shadow-2xs"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-neutral-100 group-hover:bg-[#FFB800] text-neutral-900 group-hover:text-black transition-colors">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">
                    {idCardVerified ? '✓ Read' : 'OCR / QR'}
                  </span>
                </div>
                <div className="font-bold text-xs text-neutral-950">PHYSICAL ID CARD</div>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Aadhaar, DL, Voter ID, or ABHA QR
                </p>
              </button>
            </div>

            {/* Primary Action Button */}
            <button
              type="button"
              onClick={() => setCurrentScreen('patient-identification')}
              className="w-full py-3.5 px-6 rounded-xl bg-neutral-950 hover:bg-black text-[#FFB800] font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all group"
            >
              <span>IDENTIFY PATIENT &amp; PULL RECORDS</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Right: Emergency Status Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-neutral-200/90 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <span className="font-mono text-xs uppercase tracking-wider font-bold text-neutral-500">
                PATIENT EMERGENCY STATUS
              </span>
              <span className="text-[11px] font-mono text-neutral-500">
                ABDM Live Triage
              </span>
            </div>

            <div className="divide-y divide-neutral-100 text-xs">
              {/* Blood Group */}
              <div className="py-3.5 flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs text-neutral-400 uppercase font-semibold">
                      Blood Group
                    </span>
                    {currentPatient.hasBloodGroupConflict && !isConflictResolved ? (
                      <span className="text-[10px] font-mono bg-red-100 text-red-700 px-1.5 py-0.2 rounded font-bold">
                        CONFLICT DETECTED
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">
                        VERIFIED
                      </span>
                    )}
                  </div>
                  <div className="text-xl font-black font-mono mt-0.5">
                    {isConflictResolved ? (
                      <span className="text-emerald-700">{resolvedBloodGroup} (Bedside Verified)</span>
                    ) : currentPatient.hasBloodGroupConflict ? (
                      <span className="text-red-600">B+ vs O+ (Disputed)</span>
                    ) : (
                      <span className="text-neutral-900">{currentPatient.bloodGroup}</span>
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    {isConflictResolved
                      ? 'Clinician physical test completed.'
                      : 'Requires doctor confirmation before emergency blood transfusion.'}
                  </p>
                </div>
                <button
                  onClick={() => setCurrentScreen('clinical-trust')}
                  className="text-xs font-semibold text-neutral-900 hover:text-amber-600 underline underline-offset-4 shrink-0 pt-1"
                >
                  Verify →
                </button>
              </div>

              {/* Allergies */}
              <div className="py-3.5 flex items-start justify-between gap-2">
                <div>
                  <span className="font-mono text-xs text-neutral-400 uppercase font-semibold">
                    Known Allergies
                  </span>
                  <div className="text-sm font-bold text-red-600 mt-0.5 flex items-center gap-1.5">
                    <span>
                      {currentPatient.allergies.map((a) => a.name).join(', ') || 'None Reported'}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    {currentPatient.allergies[0]?.source || 'Verified across hospital nodes'}
                  </p>
                </div>
                <span className="font-mono text-xs text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded shrink-0 font-bold">
                  HIGH ALERT
                </span>
              </div>

              {/* Current Active Medications */}
              <div className="py-3.5 flex items-start justify-between gap-2">
                <div>
                  <span className="font-mono text-xs text-neutral-400 uppercase font-semibold">
                    Current Medications
                  </span>
                  <div className="text-sm font-bold text-neutral-900 mt-0.5">
                    {currentPatient.medications.map((m) => m.name).join(', ')}
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Pulled from linked hospital pharmacy records
                  </p>
                </div>
                <span className="font-mono text-xs text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded shrink-0">
                  {currentPatient.medications.length} Active
                </span>
              </div>

              {/* Emergency Contact */}
              <div className="py-3.5 flex items-start justify-between gap-2">
                <div>
                  <span className="font-mono text-xs text-neutral-400 uppercase font-semibold">
                    Next of Kin Contact
                  </span>
                  <div className="text-sm font-bold text-neutral-900 mt-0.5">
                    {currentPatient.emergencyContact.name} ({currentPatient.emergencyContact.relationship})
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-0.5 font-mono">
                    {currentPatient.emergencyContact.maskedPhone} &bull; Protected by Private Proxy
                  </p>
                </div>
                <button
                  onClick={() => setCurrentScreen('emergency-contact')}
                  className="text-xs font-bold text-neutral-900 hover:text-amber-600 underline underline-offset-4 shrink-0 pt-1"
                >
                  Call Now →
                </button>
              </div>
            </div>
          </div>

          {/* Quick Concept Explainer Callout */}
          <div className="bg-neutral-950 text-white rounded-2xl p-5 shadow-xs relative overflow-hidden">
            <div className="flex items-center gap-2 text-[#FFB800] text-xs font-mono font-bold uppercase mb-2">
              <Sparkles className="w-4 h-4" />
              <span>THE MEDIQ 10-SECOND PRINCIPLE</span>
            </div>
            <p className="text-sm font-bold leading-snug">
              "MEDIQ doesn't just identify the patient. It determines WHO the patient is, WHICH medical records can be trusted, and WHO is authorized to access them."
            </p>
            <div className="mt-3 pt-3 border-t border-neutral-800 flex items-center justify-between text-xs font-mono text-neutral-400">
              <button
                onClick={() => setIsInsuranceModalOpen(true)}
                className="text-emerald-400 hover:underline flex items-center gap-1 font-bold"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Insurance Privacy Active
              </button>
              <button
                onClick={() => setCurrentScreen('patient-identification')}
                className="text-[#FFB800] hover:underline font-bold"
              >
                Start Demo Walkthrough →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Multimodal Scanner Modal */}
      <AbhaScannerModal
        isOpen={scannerModalOpen}
        onClose={() => setScannerModalOpen(false)}
        initialMethod={modalMethod}
      />
    </div>
  );
};
