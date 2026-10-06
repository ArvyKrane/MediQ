import React, { useState } from 'react';
import {
  Camera,
  Fingerprint,
  CreditCard,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Heart,
  Pill,
  Phone,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  UserX,
} from 'lucide-react';
import {
  playScanSweepSound,
  playSuccessChime,
  playConflictAlertTone,
} from '../../utils/audioEffects';
import { useMediq } from '../../context/MediqContext';
import { LiveFaceCaptureModal } from '../common/LiveFaceCaptureModal';
import { FingerprintScannerModal } from '../common/FingerprintScannerModal';
import { IdCardScannerModal } from '../common/IdCardScannerModal';
import type { PatientProfile } from '../../types/mediq';

export const Screen1EmergencyLanding: React.FC = () => {
  const {
    setCurrentScreen,
    currentPatient,
    identityStatus,
    confirmIdentity,
    resetEmergencyIntake,
    capturedPhotoUrl,
    setCapturedPhotoUrl,
    isConflictResolved,
    resolvedBloodGroup,
    setIsInsuranceModalOpen,
    setIsCallModalOpen,
    currentClinician,
    setIsDoctorCardOpen,
    selectPatient,
  } = useMediq();

  const [isLiveCameraOpen, setIsLiveCameraOpen] = useState(false);
  const [isFingerprintModalOpen, setIsFingerprintModalOpen] = useState(false);
  const [isIdCardModalOpen, setIsIdCardModalOpen] = useState(false);
  const [inPlaceScanning, setInPlaceScanning] = useState(false);
  const [scanStepText, setScanStepText] = useState('Scanning...');

  const isIdentified = identityStatus === 'VERIFIED' || identityStatus === 'MATCHED';

  // Handle simulated scan for Fingerprint / ID Card
  const handleSimulatedScan = (method: 'fingerprint' | 'id-card') => {
    setInPlaceScanning(true);
    playScanSweepSound();

    if (method === 'fingerprint') {
      setScanStepText('Scanning fingerprint sensor...');
    } else {
      setScanStepText('Scanning ID card / Aadhaar...');
    }

    setTimeout(() => {
      setScanStepText('Retrieving patient records...');
    }, 450);

    setTimeout(() => {
      setScanStepText(`Match found: ${currentPatient.name}`);
    }, 900);

    setTimeout(() => {
      setInPlaceScanning(false);
      confirmIdentity();
      playSuccessChime();

      if (currentPatient.hasBloodGroupConflict) {
        setTimeout(() => {
          playConflictAlertTone();
        }, 500);
      }
    }, 1300);
  };

  const handleCaptureSuccess = (photoDataUrl: string, selectedPatient?: PatientProfile) => {
    setCapturedPhotoUrl(photoDataUrl);
    if (selectedPatient) {
      selectPatient(selectedPatient);
    } else {
      confirmIdentity();
    }
    playSuccessChime();

    const targetPatient = selectedPatient || currentPatient;
    if (targetPatient.hasBloodGroupConflict) {
      setTimeout(() => {
        playConflictAlertTone();
      }, 500);
    }
  };

  const handleReset = () => {
    setCapturedPhotoUrl(null);
    resetEmergencyIntake();
  };

  return (
    <div className="space-y-3.5 pb-20 animate-in fade-in duration-150">
      
      {/* ─── Clean Header: Intake Title & Doctor On Duty ────────── */}
      <div className="flex items-center justify-between gap-2 px-1">
        <div>
          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
            Emergency Care
          </span>
          <h1 className="text-xl font-black text-neutral-950 tracking-tight mt-0.5">
            Patient Intake
          </h1>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsDoctorCardOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-xs font-bold text-neutral-800 shadow-2xs transition-colors"
          >
            <Stethoscope className="w-3.5 h-3.5 text-amber-500" />
            <span className="truncate max-w-[120px]">{currentClinician.name}</span>
          </button>

          {isIdentified && (
            <button
              type="button"
              onClick={handleReset}
              className="p-1.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-500 hover:text-neutral-900 transition-colors"
              title="Scan a new patient"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ─── Blood Group Conflict Banner (Only When Discrepancy Found) ─── */}
      {isIdentified && currentPatient.hasBloodGroupConflict && !isConflictResolved && (
        <div className="bg-red-50 border-2 border-red-400 rounded-2xl p-3.5 sm:p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-150">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-100 rounded-xl text-red-600 shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold bg-red-200 text-red-900 px-1.5 py-0.2 rounded">
                  ⚠️ Blood Group Conflict
                </span>
                <span className="text-xs font-bold text-neutral-800">
                  Apollo (B+) vs Fortis (O+)
                </span>
              </div>
              <h3 className="text-sm font-bold text-neutral-950 mt-0.5">
                Hospital Records Disagree on Blood Type
              </h3>
              <p className="text-xs text-neutral-600 mt-0.5">
                Administering wrong blood is fatal. Perform rapid bedside testing before transfusion.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setCurrentScreen('clinical-trust')}
            className="py-2 px-3.5 rounded-xl bg-neutral-950 hover:bg-black text-[#FFB800] text-xs font-bold shadow-xs shrink-0 flex items-center justify-center gap-1.5"
          >
            <span>Resolve Blood Test &rarr;</span>
          </button>
        </div>
      )}

      {/* ─── TOP PRIMARY ACTION: Scan Patient (Above The Fold) ────── */}
      <div className="bg-white rounded-3xl border border-neutral-200 p-4 shadow-sm space-y-3">
        {/* Scanning in progress banner */}
        {inPlaceScanning && (
          <div className="bg-neutral-950 text-white p-3 rounded-2xl text-xs font-medium animate-in fade-in duration-150">
            <div className="flex items-center gap-2 text-amber-400 font-bold mb-1">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>{scanStepText}</span>
            </div>
            <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
              <div className="h-full bg-[#FFB800] rounded-full animate-pulse w-full" />
            </div>
          </div>
        )}

        {/* Primary Big Scan Button */}
        <button
          type="button"
          onClick={() => setIsLiveCameraOpen(true)}
          disabled={inPlaceScanning}
          className="w-full py-3.5 px-4 rounded-2xl bg-neutral-950 hover:bg-neutral-900 text-white border-2 border-[#FFB800] flex items-center justify-between shadow-md active:scale-98 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#FFB800] text-black">
              <Camera className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="font-black text-sm text-[#FFB800]">
                {isIdentified ? 'RE-SCAN PATIENT FACE' : 'SCAN PATIENT FACE'}
              </div>
              <div className="text-[11px] text-neutral-300">
                Live camera biometric match via ABHA
              </div>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-[#FFB800]" />
        </button>

        {/* Secondary Scan Methods */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={() => setIsFingerprintModalOpen(true)}
            className="p-2.5 rounded-xl border border-neutral-200 hover:border-neutral-300 bg-neutral-50 hover:bg-white text-left transition-all flex items-center gap-2.5 shadow-2xs"
          >
            <div className="p-1.5 rounded-lg bg-neutral-200 text-neutral-700 shrink-0">
              <Fingerprint className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-xs text-neutral-900">Fingerprint</div>
              <div className="text-[10px] text-neutral-500">Biometric touch</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setIsIdCardModalOpen(true)}
            className="p-2.5 rounded-xl border border-neutral-200 hover:border-neutral-300 bg-neutral-50 hover:bg-white text-left transition-all flex items-center gap-2.5 shadow-2xs"
          >
            <div className="p-1.5 rounded-lg bg-neutral-200 text-neutral-700 shrink-0">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-xs text-neutral-900">ID Card</div>
              <div className="text-[10px] text-neutral-500">Aadhaar / OCR</div>
            </div>
          </button>
        </div>
      </div>

      {/* ─── PATIENT CARD: Unidentified vs Identified ────────────── */}
      <div className="bg-white rounded-3xl border border-neutral-200 p-4 sm:p-5 shadow-sm">
        {!isIdentified ? (
          /* Unidentified Placeholder */
          <div className="py-6 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-20 h-20 rounded-2xl bg-neutral-100 border-2 border-dashed border-neutral-300 flex items-center justify-center text-neutral-400">
              <UserX className="w-10 h-10" />
            </div>
            <div>
              <h3 className="font-bold text-base text-neutral-900">
                Patient Not Identified Yet
              </h3>
              <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto leading-relaxed">
                Tap <strong>"Scan Patient Face"</strong> above. The camera will match their face against government health records and retrieve their blood group and emergency history.
              </p>
            </div>
          </div>
        ) : (
          /* Identified Patient Profile */
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* Top row: Photo, Name, Blood Group */}
            <div className="flex items-center gap-3.5 pb-3 border-b border-neutral-100">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-neutral-100 border-2 border-[#FFB800] shrink-0 shadow-xs">
                <img
                  src={capturedPhotoUrl || currentPatient.photoUrl || '/user_face.png'}
                  alt={currentPatient.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-black text-neutral-950 truncate">
                    {currentPatient.name}
                  </h2>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded shrink-0">
                    Verified
                  </span>
                </div>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {currentPatient.age} yrs &bull; {currentPatient.gender} &bull; DOB: {currentPatient.dob}
                </p>
                <p className="text-[11px] font-mono text-emerald-700 font-bold mt-0.5 truncate">
                  ABHA: {currentPatient.abhaId}
                </p>
              </div>

              {/* Bold Blood Group Badge */}
              <div className="text-center shrink-0 p-2.5 rounded-2xl bg-neutral-50 border border-neutral-200">
                <span className="text-[9px] uppercase font-bold text-neutral-400 block">
                  Blood Group
                </span>
                <span
                  className={`text-xl font-black font-mono block ${
                    currentPatient.hasBloodGroupConflict && !isConflictResolved
                      ? 'text-red-600 animate-pulse'
                      : 'text-neutral-950'
                  }`}
                >
                  {isConflictResolved ? resolvedBloodGroup : currentPatient.bloodGroup}
                </span>
              </div>
            </div>

            {/* Quick Medical Essentials */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Critical Drug Allergies */}
              <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/80">
                <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-900 mb-1">
                  <Pill className="w-3.5 h-3.5 text-red-600" />
                  <span>Critical Allergies</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {currentPatient.allergies.map((a, i) => (
                    <span
                      key={i}
                      className="text-[11px] font-bold bg-white text-red-800 border border-red-200 px-2 py-0.5 rounded-lg"
                    >
                      {a.name} ({a.severity})
                    </span>
                  ))}
                </div>
              </div>

              {/* Emergency Contact & Call */}
              <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-neutral-900">
                    {currentPatient.emergencyContact.name} ({currentPatient.emergencyContact.relationship})
                  </div>
                  <div className="text-[10px] text-neutral-500 font-mono mt-0.5">
                    {currentPatient.emergencyContact.maskedPhone}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCallModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-[#FFB800] text-xs font-bold flex items-center gap-1 shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call</span>
                </button>
              </div>
            </div>

            {/* Privacy Shield Pill */}
            <div
              onClick={() => setIsInsuranceModalOpen(true)}
              className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 cursor-pointer hover:bg-emerald-100/60 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-bold text-emerald-950">
                  {currentPatient.shieldedRecordsCount} Private Records Shielded from Insurance TPAs
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-emerald-700 shrink-0" />
            </div>

            {/* Go to Full Patient Record Button */}
            <button
              type="button"
              onClick={() => setCurrentScreen('clinical-trust')}
              className="w-full py-3 rounded-2xl bg-neutral-950 hover:bg-black text-[#FFB800] font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <span>View Full Clinical Record &amp; History</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Modal: Live Camera & Face Identification */}
      <LiveFaceCaptureModal
        isOpen={isLiveCameraOpen}
        onClose={() => setIsLiveCameraOpen(false)}
        onCapture={handleCaptureSuccess}
      />

      {/* Modal: Fingerprint Biometric Scanner */}
      <FingerprintScannerModal
        isOpen={isFingerprintModalOpen}
        onClose={() => setIsFingerprintModalOpen(false)}
        onSuccess={(patient) => handleCaptureSuccess(patient.photoUrl || '', patient)}
      />

      {/* Modal: Physical ID Card / Aadhaar Scanner */}
      <IdCardScannerModal
        isOpen={isIdCardModalOpen}
        onClose={() => setIsIdCardModalOpen(false)}
        onSuccess={(patient) => handleCaptureSuccess(patient.photoUrl || '', patient)}
      />
    </div>
  );
};
