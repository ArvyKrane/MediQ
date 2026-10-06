import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  X,
  Check,
  CheckCircle2,
  ArrowRight,
  QrCode,
  Scan,
} from 'lucide-react';
import { playScanSweepSound, playSuccessChime } from '../../utils/audioEffects';
import { useMediq } from '../../context/MediqContext';
import type { PatientProfile } from '../../types/mediq';

interface IdCardScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (patient: PatientProfile) => void;
}

export const IdCardScannerModal: React.FC<IdCardScannerModalProps> = ({
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
              {scanState === 'matched' ? 'ID Card Verified' : 'Scan Physical ID Card'}
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
          
          {/* STEP 1: Card Scanner Viewfinder */}
          {scanState !== 'matched' && (
            <div className="flex flex-col items-center justify-center py-2 space-y-4 text-center">
              
              {/* ID Card Graphic Frame */}
              <div
                onClick={handleStartScan}
                className={`relative w-full max-w-xs aspect-8/5 rounded-2xl border-2 cursor-pointer flex flex-col justify-between p-3.5 transition-all overflow-hidden ${
                  scanState === 'scanning'
                    ? 'border-[#FFB800] bg-amber-400/10 shadow-[0_0_30px_rgba(255,184,0,0.3)]'
                    : 'border-neutral-700 bg-neutral-900/80 hover:border-[#FFB800] hover:bg-neutral-900 active:scale-98'
                }`}
              >
                {/* Laser scanline */}
                {scanState === 'scanning' && (
                  <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#FFB800] to-transparent animate-scanline z-20" />
                )}

                {/* Top of simulated ID */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md bg-[#FFB800] text-black flex items-center justify-center font-bold text-[10px]">
                      ID
                    </div>
                    <span className="text-[11px] font-bold text-white">Government Photo ID</span>
                  </div>
                  <QrCode className="w-5 h-5 text-neutral-400" />
                </div>

                {/* Middle skeleton */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-14 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-500 shrink-0">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div className="space-y-1.5 flex-1 text-left">
                    <div className="h-2.5 bg-neutral-800 rounded-md w-3/4" />
                    <div className="h-2 bg-neutral-800 rounded-md w-1/2" />
                    <div className="h-2 bg-neutral-800 rounded-md w-2/3" />
                  </div>
                </div>

                {/* Bottom barcode line */}
                <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-[9px] text-neutral-400 font-mono">
                  <span>Aadhaar / Voter / Driving License</span>
                  <span className="text-[#FFB800]">Tap to Scan OCR</span>
                </div>
              </div>

              {/* Status Text & Instruction */}
              <div>
                <h3 className="text-base font-bold text-white">
                  {scanState === 'scanning' ? 'Reading Card QR & OCR...' : 'Position ID Card to Scan'}
                </h3>
                <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">
                  {scanState === 'scanning'
                    ? 'Extracting demographic data and verifying ABHA digital health record...'
                    : 'Place patient Aadhaar, Voter ID, or health card in view.'}
                </p>
              </div>

              {/* Quick Scan Action Button */}
              <button
                type="button"
                onClick={handleStartScan}
                disabled={scanState === 'scanning'}
                className="w-full py-3 px-4 rounded-xl bg-[#FFB800] hover:bg-amber-400 text-black font-bold text-xs shadow-md transition-all active:scale-98 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                <Scan className="w-4 h-4" />
                <span>{scanState === 'scanning' ? 'Scanning...' : 'Scan ID Card Now'}</span>
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
                    ✓ Aadhaar QR Verified (100%)
                  </span>
                  <h4 className="text-base font-bold text-white truncate">
                    {matchedPatient.name}
                  </h4>
                  <p className="text-xs text-neutral-400">
                    {matchedPatient.maskedGovId} &bull; Blood: <strong className="text-white">{matchedPatient.bloodGroup}</strong>
                  </p>
                </div>
              </div>

              {/* Matched Details */}
              <div className="bg-neutral-900/60 rounded-2xl border border-neutral-800 p-3 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Patient Name:</span>
                  <span className="font-bold text-white">{matchedPatient.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Date of Birth:</span>
                  <span className="text-white">{matchedPatient.dob} ({matchedPatient.age} yrs)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Government ID:</span>
                  <span className="font-mono text-white">{matchedPatient.maskedGovId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">ABHA Address:</span>
                  <span className="font-mono text-emerald-400 font-bold">{matchedPatient.abhaId}</span>
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
                          {isSelected ? '100%' : '74%'}
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
