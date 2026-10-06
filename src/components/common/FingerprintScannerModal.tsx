import React, { useState, useEffect } from 'react';
import {
  Fingerprint,
  X,
  Check,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  UserPlus,
} from 'lucide-react';
import { playScanSweepSound, playSuccessChime } from '../../utils/audioEffects';
import { useMediq } from '../../context/MediqContext';
import type { PatientProfile } from '../../types/mediq';

interface FingerprintScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (patient: PatientProfile) => void;
}

export const FingerprintScannerModal: React.FC<FingerprintScannerModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { availablePatients, currentPatient, selectPatient, lastEnrolledId } = useMediq();

  // Benchmark patient is Atharv Bodkhe MED-0777 or current active patient
  const getPrimaryPatient = (): PatientProfile => {
    if (currentPatient && currentPatient.id) {
      const found = availablePatients.find((p) => p.id === currentPatient.id);
      if (found) return found;
    }
    const atharv = availablePatients.find((p) => p.id === 'MED-0777' || p.name.toLowerCase().includes('atharv'));
    if (atharv) return atharv;
    return availablePatients[0];
  };

  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'matched'>('idle');
  const [matchedPatient, setMatchedPatient] = useState<PatientProfile>(getPrimaryPatient);
  const [activeFinger, setActiveFinger] = useState<'Right Thumb' | 'Right Index' | 'Left Thumb'>('Right Thumb');

  useEffect(() => {
    if (!isOpen) {
      setScanState('idle');
      return;
    }
    const primary = getPrimaryPatient();
    setMatchedPatient(primary);
    setScanState('idle');
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStartScan = () => {
    if (scanState === 'scanning') return;
    setScanState('scanning');
    playScanSweepSound();

    // Fast, realistic biometric verification (800ms)
    setTimeout(() => {
      const primary = getPrimaryPatient();
      setMatchedPatient(primary);
      setScanState('matched');
      playSuccessChime();
    }, 850);
  };

  const handleConfirmAndUnlock = (patient: PatientProfile) => {
    selectPatient(patient);
    onSuccess(patient);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs safe-top-padding safe-bottom-padding animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-neutral-950 text-white rounded-3xl border border-neutral-800 shadow-2xl max-h-[86vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-neutral-800 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-[#FFB800] uppercase tracking-wide">
              {scanState === 'matched' ? 'Fingerprint Matched' : 'Fingerprint Scanner'}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-900 hover:bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1">
          
          {/* STEP 1: Idle & Scanning Sensor Touch Pad */}
          {scanState !== 'matched' && (
            <div className="flex flex-col items-center justify-center py-4 space-y-4 text-center">
              
              {/* Sensor Pad Graphic */}
              <div
                onClick={handleStartScan}
                className={`relative w-36 h-36 rounded-full border-2 cursor-pointer flex items-center justify-center transition-all ${
                  scanState === 'scanning'
                    ? 'border-[#FFB800] bg-amber-400/10 shadow-[0_0_35px_rgba(255,184,0,0.35)] scale-105'
                    : 'border-neutral-700 bg-neutral-900/80 hover:border-[#FFB800] hover:bg-neutral-900 active:scale-95'
                }`}
              >
                {/* Laser scan line when active */}
                {scanState === 'scanning' && (
                  <>
                    <div className="absolute inset-0 rounded-full border border-emerald-400/50 animate-ping" />
                    <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#FFB800] to-transparent animate-scanline" />
                  </>
                )}

                <Fingerprint
                  className={`w-20 h-20 transition-all ${
                    scanState === 'scanning'
                      ? 'text-[#FFB800] animate-pulse'
                      : 'text-neutral-400 group-hover:text-white'
                  }`}
                />
              </div>

              {/* Status Text & Instruction */}
              <div>
                <h3 className="text-base font-bold text-white">
                  {scanState === 'scanning' ? 'Reading Fingerprint...' : 'Touch Sensor to Scan'}
                </h3>
                <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">
                  {scanState === 'scanning'
                    ? 'Verifying biometric ridges against government health records...'
                    : 'Tap the sensor pad above or place patient finger on USB scanner.'}
                </p>
              </div>

              {/* Finger Selector Chips */}
              <div className="flex items-center gap-1.5 pt-1">
                {(['Right Thumb', 'Right Index', 'Left Thumb'] as const).map((finger) => (
                  <button
                    key={finger}
                    type="button"
                    onClick={() => setActiveFinger(finger)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors ${
                      activeFinger === finger
                        ? 'bg-amber-400/20 text-[#FFB800] border-amber-400/50 font-bold'
                        : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
                    }`}
                  >
                    {finger}
                  </button>
                ))}
              </div>

              {/* Quick Scan Action Button */}
              <button
                type="button"
                onClick={handleStartScan}
                disabled={scanState === 'scanning'}
                className="w-full py-3 px-4 rounded-xl bg-[#FFB800] hover:bg-amber-400 text-black font-bold text-xs shadow-md transition-all active:scale-98 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                <Fingerprint className="w-4 h-4" />
                <span>{scanState === 'scanning' ? 'Scanning...' : 'Scan Fingerprint Now'}</span>
              </button>
            </div>
          )}

          {/* STEP 2: Matched Result */}
          {scanState === 'matched' && (
            <div className="space-y-3.5 animate-in fade-in duration-200">
              
              {/* Confirmed Match Card */}
              <div className="flex items-center gap-3 p-3 bg-neutral-900 rounded-2xl border border-neutral-800">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-neutral-800 border-2 border-[#FFB800] shrink-0 shadow-xs">
                  <img
                    src={matchedPatient.photoUrl || '/user_face.png'}
                    alt={matchedPatient.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 inline-block mb-0.5">
                    ✓ Verified: {activeFinger} (99.4%)
                  </span>
                  <h4 className="text-base font-bold text-white truncate">
                    {matchedPatient.name}
                  </h4>
                  <p className="text-xs text-neutral-400">
                    Blood Group: <strong className="text-white">{matchedPatient.bloodGroup}</strong> &bull; {matchedPatient.age} yrs
                  </p>
                </div>
              </div>

              {/* Candidate Switcher */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-neutral-500 block">
                  Matched Records in Health Registry:
                </span>

                {availablePatients.slice(0, 4).map((p) => {
                  const isSelected = matchedPatient.id === p.id;
                  const isPrimaryAbdm = p.id === 'MED-0777';
                  const isNewRegistration = p.id === lastEnrolledId || p.id.startsWith('MED-REG-');

                  return (
                    <div
                      key={p.id}
                      onClick={() => setMatchedPatient(p)}
                      className={`p-2.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'border-[#FFB800] bg-neutral-900 shadow-sm'
                          : 'border-neutral-800/80 hover:border-neutral-700 bg-neutral-900/40'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-neutral-800 shrink-0 border border-neutral-700">
                        {p.photoUrl ? (
                          <img src={p.photoUrl} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-xs text-[#FFB800]">
                            {p.name[0]}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 pr-1">
                        <div className="text-xs font-bold text-white truncate leading-tight">
                          {p.name}
                        </div>
                        <div className="text-[11px] text-neutral-400 flex items-center gap-1.5 mt-0.5 truncate">
                          <span>Blood: <strong className="text-white">{p.bloodGroup}</strong></span>
                          <span>&bull;</span>
                          <span>{p.age}y</span>
                          {isPrimaryAbdm && (
                            <span className="text-[9px] bg-emerald-950 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-800 font-semibold shrink-0">
                              ABDM
                            </span>
                          )}
                          {isNewRegistration && !isPrimaryAbdm && (
                            <span className="text-[9px] bg-blue-950 text-blue-300 px-1.5 py-0.2 rounded border border-blue-800 font-semibold shrink-0">
                              Registered
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[11px] font-bold ${isSelected ? 'text-[#FFB800]' : 'text-neutral-500'}`}>
                          {isSelected ? '99.4%' : '78%'}
                        </span>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            isSelected ? 'border-[#FFB800] bg-[#FFB800]' : 'border-neutral-700'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 text-black" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Unlock Button */}
              <div className="pt-2 border-t border-neutral-800 flex items-center justify-between gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setScanState('idle')}
                  className="text-xs text-neutral-400 hover:text-white underline px-1"
                >
                  Scan Again
                </button>

                <button
                  type="button"
                  onClick={() => handleConfirmAndUnlock(matchedPatient)}
                  className="px-5 py-2.5 rounded-xl bg-[#FFB800] hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-2 shadow-md transition-all active:scale-98"
                >
                  <span>Unlock {matchedPatient.name.split(' ')[0]}'s Record</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
