import React from 'react';
import {
  ShieldCheck,
  Stethoscope,
  X,
  Award,
  CheckCircle2,
  Building2,
  QrCode,
  FileCheck,
  KeyRound,
  ExternalLink,
  Users,
} from 'lucide-react';
import { useMediq } from '../../context/MediqContext';

export const DoctorDigitalIdModal: React.FC = () => {
  const {
    isDoctorCardOpen,
    setIsDoctorCardOpen,
    currentClinician,
    availableClinicians,
    setCurrentClinician,
    setUserRole,
  } = useMediq();

  if (!isDoctorCardOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white rounded-3xl border border-neutral-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-neutral-950 text-white p-5 relative border-b border-neutral-800">
          <button
            type="button"
            onClick={() => setIsDoctorCardOpen(false)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase bg-amber-400/20 text-[#FFB800] border border-amber-400/40 px-2 py-0.5 rounded font-bold">
              GOVERNMENT OF INDIA &bull; ABDM HPR
            </span>
            <span className="text-[10px] font-mono text-neutral-400">
              NATIONAL MEDICAL REGISTER
            </span>
          </div>
          <h2 className="text-xl font-black text-white tracking-tight mt-1">
            Registered Medical Practitioner ID Card
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Verified under National Medical Commission (NMC) &amp; Healthcare Professionals Registry
          </p>
        </div>

        {/* Digital ID Card Preview */}
        <div className="p-5 space-y-4">
          <div className="rounded-3xl border-2 border-neutral-900 bg-linear-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white p-5 shadow-xl relative overflow-hidden">
            {/* Background watermark tech lines */}
            <div className="absolute -right-12 -bottom-12 w-44 h-44 rounded-full border-8 border-neutral-800/40 pointer-events-none" />

            {/* Top Bar of the Card */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#FFB800] text-black flex items-center justify-center font-black text-xs">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-mono tracking-widest text-[#FFB800] font-bold">
                    NMC / ABDM HPR CARD
                  </div>
                  <div className="text-[9px] text-neutral-400 font-mono">
                    HEALTH PROFESSIONAL ID (HPID)
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold">
                <CheckCircle2 className="w-3 h-3" />
                <span>ACTIVE &bull; VERIFIED</span>
              </div>
            </div>

            {/* Middle Section: Doctor Photo / Initials & Details */}
            <div className="flex items-start gap-4 py-4">
              <div className="w-16 h-16 rounded-2xl bg-neutral-800 border-2 border-[#FFB800]/60 flex items-center justify-center font-black text-xl text-[#FFB800] shrink-0 shadow-md">
                {currentClinician.name.split(' ').map((n) => n[0]).join('')}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-black text-white tracking-tight truncate">
                  {currentClinician.name}
                </h3>
                <div className="text-xs text-amber-200/90 font-mono mt-0.5">
                  {currentClinician.qualification}
                </div>
                <div className="text-[11px] text-neutral-400 mt-0.5">
                  {currentClinician.specialty}
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[10px] bg-neutral-800 px-2 py-0.5 rounded text-neutral-300 font-bold border border-neutral-700">
                    Reg: {currentClinician.nmcRegistrationNumber}
                  </span>
                  <span className="font-mono text-[10px] bg-neutral-800 px-2 py-0.5 rounded text-emerald-400 font-bold border border-neutral-700">
                    {currentClinician.hprAddress}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Bar: HPID & Facility */}
            <div className="pt-3 border-t border-neutral-800/80 grid grid-cols-2 gap-2 text-[10px] font-mono">
              <div>
                <span className="text-neutral-500 block">ABDM 14-DIGIT HPID</span>
                <span className="text-white font-bold text-[11px]">{currentClinician.hpid}</span>
              </div>
              <div className="text-right">
                <span className="text-neutral-500 block">ASSIGNED FACILITY (HFR)</span>
                <span className="text-white font-bold truncate block">{currentClinician.facilityName.split('—')[0]}</span>
              </div>
            </div>
          </div>

          {/* Regulatory Verification Details */}
          <div className="bg-neutral-50 rounded-2xl border border-neutral-200 p-4 space-y-2.5 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200/80">
              <span className="text-neutral-500">State Medical Council:</span>
              <strong className="text-neutral-900 font-mono text-[11px] text-right">
                {currentClinician.stateMedicalCouncil}
              </strong>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-neutral-200/80">
              <span className="text-neutral-500">Clinical Authority Scope:</span>
              <span className="text-emerald-800 font-bold font-mono text-[11px] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                Bedside Transfusion &amp; Trauma Orders
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-neutral-500">Digital Signing Certificate:</span>
              <span className="text-neutral-700 font-mono text-[10px] truncate max-w-[200px]">
                {currentClinician.digitalSigningKey}
              </span>
            </div>
          </div>

          {/* Quick Switch Clinician Persona */}
          <div>
            <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase block mb-2">
              Switch Attending Clinician / Paramedic Profile:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {availableClinicians.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setCurrentClinician(c);
                    setUserRole(c.role);
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    currentClinician.id === c.id
                      ? 'border-neutral-950 bg-amber-50/60 shadow-xs'
                      : 'border-neutral-200 hover:border-neutral-300 bg-white'
                  }`}
                >
                  <div className="font-bold text-xs text-neutral-900 truncate">{c.name}</div>
                  <div className="text-[10px] font-mono text-neutral-500 truncate">{c.nmcRegistrationNumber}</div>
                  <div className="text-[9px] font-mono text-emerald-800 font-bold mt-0.5 truncate">{c.hprAddress}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-100 border-t border-neutral-200 flex items-center justify-between">
          <span className="text-[11px] text-neutral-500 font-mono">
            Powered by ABDM HPR &bull; National Health Authority
          </span>
          <button
            type="button"
            onClick={() => setIsDoctorCardOpen(false)}
            className="px-4 py-2 rounded-xl bg-neutral-950 text-[#FFB800] hover:bg-neutral-800 font-bold text-xs shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
