import React from 'react';
import {
  Camera,
  Fingerprint,
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
} from 'lucide-react';
import { useMediq } from '../../context/MediqContext';
import { ConfidenceMeter } from '../common/ConfidenceMeter';
import { ConflictAlert } from '../common/ConflictAlert';

export const Screen1EmergencyLanding: React.FC = () => {
  const {
    setCurrentScreen,
    identityStatus,
    identityConfidence,
    activeCandidate,
    startFaceScan,
    verifyFingerprint,
    fingerprintVerified,
  } = useMediq();

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      {/* Platform Thesis Banner */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-neutral-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-neutral-950 text-[#FFB800] flex items-center justify-center shrink-0 shadow-xs">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-wider text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Core Medical Intelligence Layer
              </span>
              <span className="text-[11px] font-mono text-neutral-400">v2.4 Live Enclave</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-neutral-950 tracking-tight mt-1">
              MEDIQ — Emergency Medical Intelligence &amp; Patient Identity Trust
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-3xl leading-relaxed">
              Creates a trusted verification bridge between an unidentified/unconscious patient, first responders, ambulance EMS, ER doctors and trauma centers.
            </p>
          </div>
        </div>

        {/* 3 Pillars Teaser */}
        <div className="flex items-center gap-2 w-full md:w-auto bg-[#F8F9FA] p-2 rounded-xl border border-neutral-200/80 text-xs font-mono">
          <div className="px-2.5 py-1.5 rounded-lg bg-white border border-neutral-200/80 text-center">
            <span className="block text-[10px] text-neutral-400 font-bold">1. IDENTIFY</span>
            <span className="font-bold text-neutral-900">C_id: 94.2%</span>
          </div>
          <div className="px-2.5 py-1.5 rounded-lg bg-white border border-neutral-200/80 text-center">
            <span className="block text-[10px] text-neutral-400 font-bold">2. VERIFY</span>
            <span className="font-bold text-amber-600">C_clin: 71%</span>
          </div>
          <div className="px-2.5 py-1.5 rounded-lg bg-neutral-900 text-[#FFB800] text-center px-3">
            <span className="block text-[10px] text-neutral-400 font-bold">3. ACCESS</span>
            <span className="font-bold">AUTHORIZED</span>
          </div>
        </div>
      </div>

      {/* Prominent Clinical Conflict Warning */}
      <ConflictAlert onVerifyClick={() => setCurrentScreen('clinical-trust')} />

      {/* Main Unknown Patient Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Patient Silhouette & Identity State Card (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-neutral-200/90 shadow-xs p-6 relative overflow-hidden flex flex-col justify-between">
          {/* Subtle tech coordinate background marks */}
          <div className="absolute top-3 right-4 font-mono text-[10px] text-neutral-300 select-none">
            LAT: 28.6139° N &bull; LON: 77.2090° E &bull; RIG_ID: #04
          </div>

          <div>
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                <span className="font-mono text-xs uppercase tracking-widest text-neutral-500 font-bold">
                  TRIAGE STATUS: ACTIVE INTAKE
                </span>
              </div>
              <span className="font-mono text-xs bg-neutral-100 text-neutral-700 px-2.5 py-1 rounded-md font-semibold border border-neutral-200">
                Awaiting Multimodal Verification
              </span>
            </div>

            {/* Silhouette + Data Area */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 mt-6 items-center">
              {/* Silhouette Avatar */}
              <div className="sm:col-span-5 flex flex-col items-center justify-center p-6 bg-[#F8F9FA] rounded-2xl border border-neutral-200 relative group">
                <div className="relative w-36 h-36 rounded-2xl bg-neutral-200/80 flex items-center justify-center border-2 border-dashed border-neutral-300 overflow-hidden">
                  {/* Subtle scanning crosshairs */}
                  <div className="absolute inset-0 bg-neutral-100 flex items-center justify-center">
                    <UserX className="w-20 h-20 text-neutral-400" />
                  </div>
                  <Crosshair className="absolute top-2 left-2 w-4 h-4 text-neutral-400" />
                  <Crosshair className="absolute bottom-2 right-2 w-4 h-4 text-neutral-400" />
                  <div className="animate-scanline" />
                </div>
                <div className="mt-3 text-center">
                  <span className="font-mono text-xs font-bold text-neutral-900 bg-white px-2 py-0.5 rounded border border-neutral-200">
                    CAND-0192
                  </span>
                  <div className="text-[11px] text-neutral-400 mt-1 font-mono">
                    Vector Matched (94.2%)
                  </div>
                </div>
              </div>

              {/* Identity Telemetry */}
              <div className="sm:col-span-7 space-y-4">
                <div>
                  <span className="font-mono text-xs font-semibold text-neutral-400 uppercase">
                    Patient Name
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <h2 className="text-2xl font-black text-neutral-950 tracking-tight">
                      UNKNOWN PATIENT
                    </h2>
                    <span className="text-[10px] font-mono font-bold bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded border border-neutral-200">
                      UNCONSCIOUS
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 font-mono mt-0.5">
                    Matched Candidate: <strong className="text-neutral-900 font-sans">Aarav Mehta</strong> (21y, M)
                  </p>
                </div>

                {/* Identity Confidence Meter C_id */}
                <div className="bg-[#F8F9FA] p-3.5 rounded-xl border border-neutral-200/80">
                  <ConfidenceMeter score={identityConfidence} showFormula={true} />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="bg-[#F8F9FA] p-2.5 rounded-lg border border-neutral-200/60">
                    <span className="text-neutral-400 text-[10px] block">CANDIDATE ID</span>
                    <span className="font-bold text-neutral-900">CAND-0192</span>
                  </div>
                  <div className="bg-[#F8F9FA] p-2.5 rounded-lg border border-neutral-200/60">
                    <span className="text-neutral-400 text-[10px] block">STATUS</span>
                    <span className="font-bold text-amber-600">Awaiting Verification</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Identity Inputs: Face Scan & Fingerprint */}
          <div className="mt-8 pt-6 border-t border-neutral-100">
            <span className="font-mono text-xs text-neutral-500 uppercase tracking-wider font-semibold block mb-3">
              MULTIMODAL IDENTITY INPUTS (SELECT TO SIMULATE)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {/* Face Scan Button */}
              <button
                type="button"
                onClick={startFaceScan}
                className="p-3.5 rounded-xl border border-neutral-200 hover:border-amber-400 bg-white hover:bg-amber-50/40 text-left transition-all group flex items-start gap-3 shadow-2xs"
              >
                <div className="p-2.5 rounded-lg bg-neutral-100 group-hover:bg-[#FFB800] text-neutral-900 group-hover:text-black transition-colors shrink-0">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-xs text-neutral-950">
                    <span>FACE SCAN</span>
                    <span className="text-[10px] font-mono text-amber-700 bg-amber-100 px-1 rounded">
                      94.2% Match
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    "Capture / Upload Face" &bull; Rig Camera #12
                  </p>
                </div>
              </button>

              {/* Fingerprint Button */}
              <button
                type="button"
                onClick={verifyFingerprint}
                className="p-3.5 rounded-xl border border-neutral-200 hover:border-amber-400 bg-white hover:bg-amber-50/40 text-left transition-all group flex items-start gap-3 shadow-2xs"
              >
                <div
                  className={`p-2.5 rounded-lg transition-colors shrink-0 ${
                    fingerprintVerified
                      ? 'bg-emerald-500 text-white'
                      : 'bg-neutral-100 group-hover:bg-[#FFB800] text-neutral-900 group-hover:text-black'
                  }`}
                >
                  <Fingerprint className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-xs text-neutral-950">
                    <span>FINGERPRINT</span>
                    <span
                      className={`text-[10px] font-mono px-1 rounded ${
                        fingerprintVerified
                          ? 'text-emerald-700 bg-emerald-100'
                          : 'text-neutral-500 bg-neutral-100'
                      }`}
                    >
                      {fingerprintVerified ? '✓ Matched' : 'Scan Fingerprint'}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Capacitive Biometric Sensor v3
                  </p>
                </div>
              </button>
            </div>

            {/* Primary CTA */}
            <button
              type="button"
              onClick={() => setCurrentScreen('patient-identification')}
              className="w-full py-3.5 px-6 rounded-xl bg-neutral-950 hover:bg-black text-[#FFB800] font-bold text-sm flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all group"
            >
              <span>IDENTIFY PATIENT</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Right: Emergency Status Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-neutral-200/90 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <span className="font-mono text-xs uppercase tracking-wider font-bold text-neutral-500">
                EMERGENCY STATUS CARDS
              </span>
              <span className="text-[11px] font-mono text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200 font-bold">
                C_clin: 71% (LOW)
              </span>
            </div>

            <div className="divide-y divide-neutral-100">
              {/* Blood Group */}
              <div className="py-3.5 flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs text-neutral-400 uppercase font-semibold">
                      Blood Group
                    </span>
                    <span className="text-[10px] font-mono bg-red-100 text-red-700 px-1.5 py-0.2 rounded font-bold">
                      CONFLICTING
                    </span>
                  </div>
                  <div className="text-xl font-black text-red-600 font-mono mt-0.5">
                    B+ <span className="text-neutral-400 font-normal text-sm">/ conflicting with</span> O+
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Requires clinician bedside verification before transfusion.
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
                    Allergies
                  </span>
                  <div className="text-sm font-bold text-neutral-900 mt-0.5 flex items-center gap-1.5">
                    <span>Unknown (Pending ID verification)</span>
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Candidate record indicates possible Penicillin hypersensitivity.
                  </p>
                </div>
                <span className="font-mono text-xs text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded shrink-0">
                  LOCKED
                </span>
              </div>

              {/* Medications */}
              <div className="py-3.5 flex items-start justify-between gap-2">
                <div>
                  <span className="font-mono text-xs text-neutral-400 uppercase font-semibold">
                    Medications
                  </span>
                  <div className="text-sm font-bold text-neutral-900 mt-0.5">
                    Unknown
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Encrypted until clinical provenance validated.
                  </p>
                </div>
                <span className="font-mono text-xs text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded shrink-0">
                  LOCKED
                </span>
              </div>

              {/* Emergency Contact */}
              <div className="py-3.5 flex items-start justify-between gap-2">
                <div>
                  <span className="font-mono text-xs text-neutral-400 uppercase font-semibold">
                    Emergency Contact
                  </span>
                  <div className="text-sm font-bold text-neutral-900 mt-0.5">
                    Available after verification
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Zero-knowledge masked proxy will connect next of kin.
                  </p>
                </div>
                <button
                  onClick={() => setCurrentScreen('emergency-contact')}
                  className="text-xs font-semibold text-neutral-900 hover:text-amber-600 underline underline-offset-4 shrink-0 pt-1"
                >
                  Preview →
                </button>
              </div>
            </div>
          </div>

          {/* Quick Concept Explainer Callout */}
          <div className="bg-neutral-950 text-white rounded-2xl p-5 shadow-xs relative overflow-hidden">
            <div className="flex items-center gap-2 text-[#FFB800] text-xs font-mono font-bold uppercase mb-2">
              <Sparkles className="w-4 h-4" />
              <span>MEDIQ 10-Second Principle</span>
            </div>
            <p className="text-sm font-bold leading-snug">
              "MEDIQ doesn't just identify the patient. It determines WHO the patient is, WHICH medical information can be trusted, and WHO is authorized to access it."
            </p>
            <div className="mt-3 pt-3 border-t border-neutral-800 flex items-center justify-between text-xs font-mono text-neutral-400">
              <span>C_id &bull; C_clin &bull; ACCESS</span>
              <button
                onClick={() => setCurrentScreen('patient-identification')}
                className="text-[#FFB800] hover:underline font-bold"
              >
                Start Demo Flow →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
