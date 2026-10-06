import React, { useState } from 'react';
import {
  Camera,
  Fingerprint,
  CreditCard,
  X,
  Scan,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  QrCode,
  ShieldCheck,
} from 'lucide-react';
import { useMediq } from '../../context/MediqContext';
import type { ScanInputMethod } from '../../types/mediq';

interface AbhaScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMethod?: ScanInputMethod;
}

export const AbhaScannerModal: React.FC<AbhaScannerModalProps> = ({
  isOpen,
  onClose,
  initialMethod = 'face',
}) => {
  const {
    currentPatient,
    scanFace,
    scanFingerprint,
    scanIdCard,
    isScanning,
    scanningStage,
    identityStatus,
    confirmIdentity,
    setCurrentScreen,
  } = useMediq();

  const [selectedMethod, setSelectedMethod] = useState<ScanInputMethod>(initialMethod);

  if (!isOpen) return null;

  const handleRunScan = () => {
    if (selectedMethod === 'face') {
      scanFace();
    } else if (selectedMethod === 'fingerprint') {
      scanFingerprint();
    } else if (selectedMethod === 'id-card') {
      scanIdCard();
    }
  };

  const handleFinishAndProceed = () => {
    confirmIdentity();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-neutral-200 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-100 flex items-center justify-between bg-[#F8F9FA]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-neutral-950 text-[#FFB800] flex items-center justify-center font-bold">
              <Scan className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase text-amber-700 font-bold">
                NO NFC REQUIRED &bull; MULTIMODAL INTAKE
              </div>
              <h3 className="text-base font-bold text-neutral-950">
                Identify Patient via ABHA Registry
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Method Selector Tabs */}
        <div className="grid grid-cols-3 gap-1 p-2 bg-neutral-100 mx-5 mt-4 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setSelectedMethod('face')}
            className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              selectedMethod === 'face'
                ? 'bg-white text-neutral-950 shadow-xs font-bold'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Face Scan</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedMethod('fingerprint')}
            className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              selectedMethod === 'fingerprint'
                ? 'bg-white text-neutral-950 shadow-xs font-bold'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Fingerprint className="w-3.5 h-3.5" />
            <span>Fingerprint</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedMethod('id-card')}
            className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              selectedMethod === 'id-card'
                ? 'bg-white text-neutral-950 shadow-xs font-bold'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>ID Card / QR</span>
          </button>
        </div>

        {/* Active Scan Area */}
        <div className="p-5 flex flex-col items-center justify-center text-center">
          {selectedMethod === 'face' && (
            <div className="w-full flex flex-col items-center">
              <div className="relative w-48 h-56 rounded-2xl bg-neutral-950 border-2 border-neutral-800 flex items-center justify-center overflow-hidden shadow-inner my-2">
                {/* Corner markers */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#FFB800]" />
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#FFB800]" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#FFB800]" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#FFB800]" />

                {isScanning && <div className="animate-scanline" />}

                <div className="text-neutral-500 flex flex-col items-center">
                  <Camera className="w-12 h-12 text-neutral-600 mb-2" />
                  <span className="text-[11px] font-mono text-neutral-400">Position face in frame</span>
                </div>
              </div>
              <p className="text-xs text-neutral-600 mt-2">
                Uses ambulance / mobile camera to match face against national ABHA photo records.
              </p>
            </div>
          )}

          {selectedMethod === 'fingerprint' && (
            <div className="w-full flex flex-col items-center">
              <button
                type="button"
                onClick={handleRunScan}
                disabled={isScanning}
                className={`relative w-40 h-40 rounded-full border-4 flex flex-col items-center justify-center my-4 transition-all ${
                  isScanning
                    ? 'border-amber-400 bg-amber-50 animate-pulse'
                    : 'border-neutral-200 hover:border-amber-400 bg-neutral-50 hover:bg-white cursor-pointer'
                }`}
              >
                <Fingerprint
                  className={`w-16 h-16 transition-colors ${
                    isScanning ? 'text-amber-500 animate-bounce' : 'text-neutral-700'
                  }`}
                />
                <span className="text-[11px] font-mono text-neutral-500 mt-1">Tap sensor</span>
              </button>
              <p className="text-xs text-neutral-600">
                Touch capacitive biometric scanner to match UIDAI / ABHA minutiae.
              </p>
            </div>
          )}

          {selectedMethod === 'id-card' && (
            <div className="w-full flex flex-col items-center">
              <div className="relative w-64 h-40 rounded-2xl bg-neutral-900 border-2 border-neutral-700 flex flex-col items-center justify-center my-3 p-4 text-white overflow-hidden">
                {isScanning && <div className="animate-scanline" />}
                <div className="flex items-center gap-2 text-neutral-400 mb-2">
                  <CreditCard className="w-6 h-6 text-[#FFB800]" />
                  <QrCode className="w-6 h-6 text-neutral-400" />
                </div>
                <span className="text-xs font-bold text-neutral-200">
                  Aadhaar / Voter ID / DL / ABHA Card
                </span>
                <span className="text-[10px] font-mono text-neutral-400 mt-1">
                  Hold card flat to camera for instant OCR
                </span>
              </div>
              <p className="text-xs text-neutral-600">
                Camera reads document number or scans the QR code to pull ABHA details.
              </p>
            </div>
          )}

          {/* Scanning Progress / Status */}
          {isScanning && (
            <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs font-mono flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-amber-600 shrink-0" />
              <span>{scanningStage}</span>
            </div>
          )}

          {/* Matched State Card */}
          {identityStatus === 'MATCHED' && !isScanning && (
            <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-left w-full">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-emerald-800 uppercase flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  MATCH FOUND ON ABDM REGISTRY
                </span>
                <span className="font-mono text-xs font-bold text-emerald-800 bg-white px-2 py-0.5 rounded-md border border-emerald-300">
                  Aadhaar e-KYC Verified ✓
                </span>
              </div>
              <div className="mt-2 text-neutral-900">
                <div className="text-base font-bold">{currentPatient.name}</div>
                <div className="text-xs font-mono text-neutral-600 mt-0.5">
                  ABHA ID: <strong className="text-emerald-800">{currentPatient.abhaId}</strong> &bull; {currentPatient.gender}, {currentPatient.age}y
                </div>
                <div className="text-[11px] font-mono text-neutral-500 mt-0.5">
                  Linked ID: {currentPatient.maskedGovId}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-neutral-100 bg-[#F8F9FA] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900"
          >
            Cancel
          </button>

          {identityStatus === 'MATCHED' ? (
            <button
              type="button"
              onClick={handleFinishAndProceed}
              className="py-2.5 px-5 rounded-xl bg-neutral-950 hover:bg-black text-[#FFB800] text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>CONFIRM &amp; FETCH EMERGENCY RECORDS</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleRunScan}
              disabled={isScanning}
              className="py-2.5 px-5 rounded-xl bg-neutral-950 hover:bg-black text-[#FFB800] text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Scan className="w-4 h-4" />
              <span>START {selectedMethod.toUpperCase()} SCAN</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
