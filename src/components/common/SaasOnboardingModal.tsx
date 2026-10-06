import React, { useState } from 'react';
import {
  ShieldCheck,
  Activity,
  UserCheck,
  Stethoscope,
  Building2,
  Lock,
  EyeOff,
  AlertTriangle,
  ArrowRight,
  Check,
  Sparkles,
  HeartPulse,
  Flame,
  Ambulance,
  X,
} from 'lucide-react';
import { useMediq } from '../../context/MediqContext';

interface SaasOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FACILITIES = [
  { id: 'aiims', name: 'AIIMS New Delhi — Apex Trauma Bay #1', city: 'New Delhi', code: 'FAC-AIIMS-01' },
  { id: 'apollo', name: 'Apollo Emergency Ambulance Fleet', city: 'Mumbai', code: 'FAC-APOLLO-04' },
  { id: 'fortis', name: 'Fortis Memorial Critical Care Unit', city: 'Gurugram', code: 'FAC-FORTIS-02' },
];

const ROLES = [
  {
    id: 'doctor',
    title: 'Dr. Sharma, MD',
    roleLabel: 'Emergency Attending Physician',
    icon: <Stethoscope className="w-5 h-5 text-emerald-600" />,
    badge: 'Full Medical Triage & Transfusion Authority',
  },
  {
    id: 'paramedic',
    title: 'Rajesh Kumar, EMT-P',
    roleLabel: 'Trauma Paramedic / First Responder',
    icon: <Ambulance className="w-5 h-5 text-amber-600" />,
    badge: 'Biometric Intake & Masked Family Dispatch',
  },
  {
    id: 'admin',
    title: 'Pooja Verma, HOD',
    roleLabel: 'Hospital System Administrator',
    icon: <Building2 className="w-5 h-5 text-blue-600" />,
    badge: 'Forensic Audit & ABDM Gateway Oversight',
  },
];

export const SaasOnboardingModal: React.FC<SaasOnboardingModalProps> = ({ isOpen, onClose }) => {
  const { userRole, setUserRole, setCurrentScreen, resetEmergencyIntake } = useMediq();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedFacility, setSelectedFacility] = useState(FACILITIES[0]);

  if (!isOpen) return null;

  const handleStartApp = () => {
    onClose();
    setCurrentScreen('emergency-landing');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl border border-neutral-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="bg-neutral-950 text-white p-6 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 text-xs font-mono text-[#FFB800] mb-1">
            <Activity className="w-4 h-4" />
            <span>MEDIQ ENTERPRISE SAAS &bull; ONBOARDING</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Emergency Identity &amp; Clinical Trust Platform
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Connected to Ayushman Bharat Digital Mission (ABDM) &bull; National Health Authority
          </p>

          {/* Stepper Dots */}
          <div className="flex items-center gap-2 mt-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all ${
                  step === s
                    ? 'w-8 bg-[#FFB800]'
                    : step > s
                    ? 'w-4 bg-neutral-600'
                    : 'w-4 bg-neutral-800'
                }`}
              />
            ))}
            <span className="text-[10px] font-mono text-neutral-500 ml-2">Step {step} of 3</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* STEP 1: Core Value Props */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div>
                <h3 className="text-base font-black text-neutral-950">
                  How MEDIQ Saves Lives in the Golden Hour
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Three critical capabilities built for frontline emergency response:
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 font-bold text-xs">
                    01
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900">Zero-Friction Biometrics (No NFC)</h4>
                    <p className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed">
                      Instant Face Scan or Aadhaar QR captures patient identity in under 2 seconds, resolving directly to their national ABHA ID.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-red-100 text-red-900 flex items-center justify-center shrink-0 font-bold text-xs">
                    02
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900">Dispute &amp; Fatal Conflict Engine</h4>
                    <p className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed">
                      If Apollo says B+ and Fortis says O+, MEDIQ locks the field and enforces a bedside agglutination test before any transfusion.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center shrink-0 font-bold text-xs">
                    03
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900">Insurance Privacy Shield</h4>
                    <p className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed">
                      Emergency scans are locked to PURPOSE: EMERGENCY_CARE. Pre-existing OPD history is encrypted and blocked from commercial insurance TPAs.
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full py-3 rounded-2xl bg-neutral-950 text-[#FFB800] hover:bg-neutral-800 font-bold text-xs flex items-center justify-center gap-2 transition-colors mt-2"
              >
                <span>Select Facility &amp; Station</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: Facility Assignment */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div>
                <h3 className="text-base font-black text-neutral-950">
                  Select Active Health Facility
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Simulate emergency operations from your assigned triage unit or fleet:
                </p>
              </div>

              <div className="space-y-2.5">
                {FACILITIES.map((fac) => {
                  const isSelected = selectedFacility.id === fac.id;
                  return (
                    <div
                      key={fac.id}
                      onClick={() => setSelectedFacility(fac)}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-neutral-950 bg-amber-50/50 shadow-2xs'
                          : 'border-neutral-200 hover:border-neutral-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                          isSelected ? 'bg-neutral-950 text-[#FFB800]' : 'bg-neutral-100 text-neutral-600'
                        }`}>
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-neutral-900 block">{fac.name}</span>
                          <span className="text-[10px] font-mono text-neutral-500">{fac.city} &bull; {fac.code}</span>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-neutral-950 text-[#FFB800] flex items-center justify-center">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-3 rounded-2xl border border-neutral-300 text-neutral-700 font-bold text-xs hover:bg-neutral-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 py-3 rounded-2xl bg-neutral-950 text-[#FFB800] hover:bg-neutral-800 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Select Responder Role</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Responder Persona */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div>
                <h3 className="text-base font-black text-neutral-950">
                  Select Duty Practitioner
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Role-based access permissions apply dynamically based on selected profile:
                </p>
              </div>

              <div className="space-y-2.5">
                {ROLES.map((r) => {
                  const isCurrent = userRole === r.id;
                  return (
                    <div
                      key={r.id}
                      onClick={() => setUserRole(r.id as any)}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                        isCurrent
                          ? 'border-neutral-950 bg-amber-50/50 shadow-2xs'
                          : 'border-neutral-200 hover:border-neutral-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center">
                          {r.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-neutral-900">{r.title}</span>
                            <span className="text-[10px] font-mono text-neutral-500 font-medium">({r.roleLabel})</span>
                          </div>
                          <span className="text-[10px] font-mono text-emerald-800 block mt-0.5">
                            {r.badge}
                          </span>
                        </div>
                      </div>
                      {isCurrent && (
                        <div className="w-6 h-6 rounded-full bg-neutral-950 text-[#FFB800] flex items-center justify-center">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-3 rounded-2xl border border-neutral-300 text-neutral-700 font-bold text-xs hover:bg-neutral-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleStartApp}
                  className="flex-1 py-3 rounded-2xl bg-neutral-950 text-[#FFB800] hover:bg-neutral-800 font-black text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <span>Launch Emergency Intelligence</span>
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
