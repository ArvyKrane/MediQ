import React from 'react';
import {
  Stethoscope,
  X,
  CheckCircle2,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs safe-top-padding safe-bottom-padding animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white rounded-3xl border border-neutral-200 shadow-2xl max-h-[86vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-neutral-950 text-white p-4 sm:p-5 relative border-b border-neutral-800 shrink-0">
          <button
            type="button"
            onClick={() => setIsDoctorCardOpen(false)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-bold">
              NMC VERIFIED
            </span>
            <span className="text-[10px] font-mono text-neutral-400">
              National Health Registry
            </span>
          </div>
          <h2 className="text-lg font-black text-white tracking-tight mt-1">
            Doctor Digital ID
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Registered medical practitioner credentials for emergency orders
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-5 space-y-3.5 overflow-y-auto">
          {/* Digital ID Card Preview */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950 text-white p-4 shadow-lg relative overflow-hidden">
            {/* Top Bar of the Card */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#FFB800] text-black flex items-center justify-center font-black text-xs shrink-0">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-white">
                    National Medical Commission
                  </div>
                  <div className="text-[9px] text-neutral-400 font-mono">
                    Official Doctor ID
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-lg text-[10px] font-bold">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Active</span>
              </div>
            </div>

            {/* Middle Section: Doctor Photo / Initials & Details */}
            <div className="flex items-start gap-3.5 py-3">
              <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-neutral-700 flex items-center justify-center font-black text-lg text-[#FFB800] shrink-0">
                {currentClinician.name.split(' ').map((n) => n[0]).join('')}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-base font-black text-white tracking-tight truncate">
                  {currentClinician.name}
                </h3>
                <div className="text-xs text-neutral-300 mt-0.5">
                  {currentClinician.qualification}
                </div>
                <div className="text-[11px] text-neutral-400 mt-0.5">
                  {currentClinician.specialty}
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span className="font-mono text-[10px] bg-neutral-900 px-2 py-0.5 rounded text-neutral-300 font-bold border border-neutral-700">
                    Reg: {currentClinician.nmcRegistrationNumber}
                  </span>
                  <span className="font-mono text-[10px] bg-neutral-900 px-2 py-0.5 rounded text-emerald-400 font-bold border border-neutral-700">
                    {currentClinician.hprAddress}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Bar: Facility & Authority */}
            <div className="pt-2.5 border-t border-neutral-800/80 flex items-center justify-between text-[10px] font-mono text-neutral-400">
              <span>Facility: {currentClinician.facilityName.split('—')[0]}</span>
              <span className="text-emerald-400 font-bold">ER Bedside Authority</span>
            </div>
          </div>

          {/* Verification Details */}
          <div className="bg-neutral-50 rounded-2xl border border-neutral-200 p-3 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-neutral-500">Medical Council:</span>
              <span className="text-neutral-900 font-semibold">{currentClinician.stateMedicalCouncil}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-500">Government HPID:</span>
              <span className="text-neutral-900 font-mono font-bold text-[11px]">{currentClinician.hpid}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-500">Clinical Authority:</span>
              <span className="text-emerald-800 font-bold bg-emerald-100/80 px-1.5 py-0.2 rounded text-[10px]">
                Emergency Orders &amp; Transfusions
              </span>
            </div>
          </div>

          {/* Quick Switch Clinician Persona */}
          <div>
            <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase block mb-1.5">
              Switch Attending Doctor:
            </span>
            <div className="space-y-1.5">
              {availableClinicians.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setCurrentClinician(c);
                    setUserRole(c.role);
                  }}
                  className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                    currentClinician.id === c.id
                      ? 'border-neutral-950 bg-amber-50/70 shadow-xs'
                      : 'border-neutral-200 hover:border-neutral-300 bg-white'
                  }`}
                >
                  <div>
                    <div className="font-bold text-xs text-neutral-900">{c.name}</div>
                    <div className="text-[10px] font-mono text-neutral-500">{c.nmcRegistrationNumber} &bull; {c.stateMedicalCouncil}</div>
                  </div>
                  {currentClinician.id === c.id && (
                    <span className="text-[10px] font-bold text-amber-950 bg-amber-200/80 px-2 py-0.5 rounded-lg">
                      Active On Duty
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between shrink-0">
          <span className="text-[10px] text-neutral-500">
            NMC Registered Clinician
          </span>
          <button
            type="button"
            onClick={() => setIsDoctorCardOpen(false)}
            className="px-4 py-2 rounded-xl bg-neutral-950 text-[#FFB800] hover:bg-neutral-800 font-bold text-xs shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
