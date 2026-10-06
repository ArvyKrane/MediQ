import React, { useState } from 'react';
import {
  Camera,
  Fingerprint,
  CreditCard,
  AlertTriangle,
  ArrowRight,
  Activity,
  UserX,
  Crosshair,
  Lock,
  ShieldCheck,
  CheckCircle2,
  RotateCcw,
  Phone,
  Scan,
  Sparkles,
  Stethoscope,
  Building2,
  Heart,
  Pill,
} from 'lucide-react';
import { useMediq } from '../../context/MediqContext';
import { LiveFaceCaptureModal } from '../common/LiveFaceCaptureModal';
import { playScanSweepSound, playSuccessChime, playConflictAlertTone } from '../../utils/audioEffects';
import type { ScanInputMethod, PatientProfile } from '../../types/mediq';

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
    selectPatientByAbha,
  } = useMediq();

  const [isLiveCameraOpen, setIsLiveCameraOpen] = useState(false);
  const [inPlaceScanning, setInPlaceScanning] = useState(false);
  const [scanStepText, setScanStepText] = useState('Scanning...');

  const isIdentified = identityStatus === 'VERIFIED' || identityStatus === 'MATCHED';

  // Handle biometric simulation for Fingerprint / ID Card
  const handleSimulatedScan = (method: 'fingerprint' | 'id-card') => {
    setInPlaceScanning(true);
    playScanSweepSound();

    if (method === 'fingerprint') {
      setScanStepText('Reading biometric fingerprint minutiae...');
    } else {
      setScanStepText('Scanning physical ID card via camera OCR...');
    }

    setTimeout(() => {
      setScanStepText('Querying ABDM Health Gateway (UIDAI e-KYC)...');
    }, 450);

    setTimeout(() => {
      setScanStepText(`Identity Found: ${currentPatient.name}! Unlocking vault...`);
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
      selectPatientByAbha(selectedPatient.id);
    }
    confirmIdentity();
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
    <div className="space-y-4 pb-24 animate-in fade-in duration-200">
      {/* ─── Top Clinical Header ───────────────────────────────────── */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-neutral-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-neutral-950 text-[#FFB800] flex items-center justify-center font-black shadow-xs shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold uppercase bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded">
                AIIMS Apex Trauma Center
              </span>
              <span className="font-mono text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                ABDM Live Gateway
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-black text-neutral-950 tracking-tight mt-0.5">
              Emergency Patient Intake &amp; Identity Resolution
            </h1>
          </div>
        </div>

        {/* Clinician On Duty Chip */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsDoctorCardOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-xs text-neutral-800 transition-colors"
          >
            <Stethoscope className="w-3.5 h-3.5 text-neutral-500" />
            <span className="font-mono font-bold text-[11px]">{currentClinician.name}</span>
            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded font-bold">
              {currentClinician.nmcRegistrationNumber}
            </span>
          </button>

          {isIdentified && (
            <button
              type="button"
              onClick={handleReset}
              className="p-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-500 hover:text-neutral-900 transition-colors"
              title="Reset Intake to Unknown Patient"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ─── Blood Group Conflict Banner (Only when Identified) ─────── */}
      {isIdentified && currentPatient.hasBloodGroupConflict && !isConflictResolved && (
        <div className="bg-red-50 border-2 border-red-400 rounded-3xl p-4 sm:p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-red-100 rounded-2xl text-red-600 shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold uppercase bg-red-100 text-red-700 px-2 py-0.5 rounded">
                  ⚠️ Critical Conflict
                </span>
                <span className="text-xs font-mono font-bold text-neutral-800">
                  Apollo (B+) vs Fortis (O+)
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-black text-neutral-950 mt-1">
                Fatal Transfusion Risk: Hospital Records Disagree
              </h3>
              <p className="text-xs text-neutral-600 mt-0.5 max-w-xl">
                MEDIQ locks the field. Perform a rapid bedside blood agglutination test before administering blood.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setCurrentScreen('clinical-trust')}
            className="py-2.5 px-4 rounded-xl bg-neutral-950 hover:bg-black text-[#FFB800] text-xs font-black shadow-sm flex items-center justify-center gap-1.5 shrink-0"
          >
            <span>Resolve Bedside Test →</span>
          </button>
        </div>
      )}

      {/* ─── Main 2-Column Clinical Layout ─────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* LEFT COLUMN: Patient Intake & Scanner (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-neutral-200/90 shadow-sm p-5 flex flex-col justify-between">
          <div>
            {/* Triage Status Line */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isIdentified ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse'}`} />
                <span className="font-mono text-xs font-bold text-neutral-600 uppercase">
                  {isIdentified ? 'PATIENT IDENTIFIED & BOUND' : 'TRIAGE: UNKNOWN PATIENT'}
                </span>
              </div>

              {isIdentified ? (
                <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Aadhaar e-KYC Confirmed</span>
                </span>
              ) : (
                <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg">
                  Awaiting Scan
                </span>
              )}
            </div>

            {/* Patient Photo & Bio Details */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 mt-4 items-center">
              {/* Photo View Box */}
              <div className="sm:col-span-5 flex flex-col items-center justify-center p-3 bg-neutral-50 rounded-2xl border border-neutral-200 relative group">
                <div className="relative w-36 h-36 rounded-2xl bg-neutral-200 flex items-center justify-center border-2 border-neutral-300 overflow-hidden shadow-inner">
                  {isIdentified ? (
                    <div className="relative w-full h-full">
                      <img
                        src={
                          capturedPhotoUrl ||
                          currentPatient.photoUrl ||
                          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'
                        }
                        alt={currentPatient.name}
                        className="w-full h-full object-cover animate-in fade-in duration-200"
                      />
                      <span className="absolute bottom-1 right-1 bg-neutral-950/80 backdrop-blur-xs text-[#FFB800] font-mono text-[9px] font-bold px-1.5 py-0.5 rounded border border-neutral-700">
                        {capturedPhotoUrl ? 'Live Webcam Photo ✓' : 'Aadhaar Photo ✓'}
                      </span>
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-neutral-100 flex flex-col items-center justify-center text-neutral-400">
                      <UserX className="w-14 h-14 stroke-[1.5]" />
                      <span className="text-[10px] font-mono font-bold mt-1 text-neutral-500 uppercase">
                        Unidentified
                      </span>
                    </div>
                  )}

                  {/* Corner Crosshairs */}
                  <Crosshair className="absolute top-2 left-2 w-3.5 h-3.5 text-neutral-400 pointer-events-none" />
                  <Crosshair className="absolute bottom-2 right-2 w-3.5 h-3.5 text-neutral-400 pointer-events-none" />

                  {/* Active Laser Scanline Animation */}
                  {inPlaceScanning && <div className="animate-scanline z-20" />}
                </div>

                <div className="mt-2 text-center">
                  <span className="font-mono text-xs font-bold text-neutral-800 bg-white px-2 py-0.5 rounded border border-neutral-200">
                    {isIdentified ? currentPatient.id : 'CASE: EM-9021'}
                  </span>
                </div>
              </div>

              {/* Bio & ABHA Fields */}
              <div className="sm:col-span-7 space-y-2.5">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold block">
                    IDENTITY RESOLUTION
                  </span>

                  {isIdentified ? (
                    <div className="mt-0.5 animate-in fade-in duration-150">
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-black text-neutral-950 tracking-tight">
                          {currentPatient.name}
                        </h2>
                        <span className="text-[10px] font-mono font-bold bg-neutral-100 text-neutral-700 px-1.5 py-0.5 rounded border border-neutral-200">
                          UNCONSCIOUS
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 font-mono mt-0.5">
                        {currentPatient.age}y &bull; {currentPatient.gender} &bull; DOB: {currentPatient.dob}
                      </p>
                      <div className="text-xs font-mono font-bold text-emerald-800 mt-1">
                        ABHA: {currentPatient.abhaId}
                      </div>
                      <div className="text-[10px] font-mono text-neutral-400 mt-0.5">
                        {currentPatient.maskedGovId} &bull; ABHA No: {currentPatient.abhaNumber}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-1 p-3 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-600">
                      <div className="font-bold text-neutral-900 flex items-center gap-1.5 text-xs">
                        <Scan className="w-3.5 h-3.5 text-amber-500" />
                        <span>Take a selfie to scan patient</span>
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed">
                        Click <strong>"Face Scan"</strong> below to open your camera, capture a live photo, and instantly match their ABHA digital health record.
                      </p>
                    </div>
                  )}
                </div>

                {/* Quick Unlocked Badges */}
                {isIdentified && (
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                    <div className="bg-neutral-50 p-2 rounded-xl border border-neutral-200/80">
                      <span className="text-neutral-400 text-[9px] block font-bold">HOSPITALS</span>
                      <span className="font-bold text-neutral-900 truncate block">
                        {currentPatient.linkedHospitals.length} Connected
                      </span>
                    </div>
                    <div className="bg-neutral-50 p-2 rounded-xl border border-neutral-200/80">
                      <span className="text-neutral-400 text-[9px] block font-bold">SHIELDED</span>
                      <span className="font-bold text-emerald-700">
                        {currentPatient.shieldedRecordsCount} Private Records
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ─── The 3 Action Buttons ─────────────────────────────────── */}
          <div className="mt-5 pt-4 border-t border-neutral-100">
            {/* Scanning Progress Banner */}
            {inPlaceScanning && (
              <div className="mb-3 bg-neutral-950 text-white p-3 rounded-2xl text-xs font-mono animate-in fade-in duration-150">
                <div className="flex items-center gap-2 text-amber-400 font-bold mb-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span>{scanStepText}</span>
                </div>
                <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                  <div className="h-full bg-[#FFB800] rounded-full animate-pulse w-full" />
                </div>
              </div>
            )}

            <span className="text-[10px] font-mono uppercase font-bold text-neutral-400 block mb-2">
              {isIdentified ? 'Re-Scan Patient Via:' : 'Select Scan Method (No NFC):'}
            </span>

            <div className="grid grid-cols-3 gap-2">
              {/* Button 1: Live Webcam Face Scan */}
              <button
                type="button"
                onClick={() => setIsLiveCameraOpen(true)}
                disabled={inPlaceScanning}
                className="p-3 rounded-2xl border-2 border-neutral-950 bg-neutral-950 hover:bg-neutral-800 text-white text-left transition-all shadow-xs active:scale-98"
              >
                <div className="p-1.5 rounded-lg bg-[#FFB800] text-black w-fit mb-1.5">
                  <Camera className="w-4 h-4" />
                </div>
                <div className="font-black text-xs text-[#FFB800]">FACE SCAN</div>
                <span className="text-[10px] text-neutral-300 block mt-0.5">Live Camera</span>
              </button>

              {/* Button 2: Fingerprint */}
              <button
                type="button"
                onClick={() => handleSimulatedScan('fingerprint')}
                disabled={inPlaceScanning}
                className="p-3 rounded-2xl border border-neutral-200 hover:border-neutral-400 bg-white hover:bg-neutral-50 text-left transition-all active:scale-98"
              >
                <div className="p-1.5 rounded-lg bg-neutral-100 text-neutral-800 w-fit mb-1.5">
                  <Fingerprint className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs text-neutral-900">FINGERPRINT</div>
                <span className="text-[10px] text-neutral-500 block mt-0.5">Biometric Touch</span>
              </button>

              {/* Button 3: ID Card */}
              <button
                type="button"
                onClick={() => handleSimulatedScan('id-card')}
                disabled={inPlaceScanning}
                className="p-3 rounded-2xl border border-neutral-200 hover:border-neutral-400 bg-white hover:bg-neutral-50 text-left transition-all active:scale-98"
              >
                <div className="p-1.5 rounded-lg bg-neutral-100 text-neutral-800 w-fit mb-1.5">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs text-neutral-900">ID CARD</div>
                <span className="text-[10px] text-neutral-500 block mt-0.5">Aadhaar OCR/QR</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Clinical Intelligence Vault (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-neutral-200/90 shadow-sm p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <span className="font-mono text-xs uppercase font-bold text-neutral-600 flex items-center gap-1.5">
                {isIdentified ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Clinical Vault (Unlocked)</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-amber-500" />
                    <span>Medical Vault (Encrypted)</span>
                  </>
                )}
              </span>
              <span className="text-[10px] font-mono text-neutral-400 bg-neutral-50 px-2 py-0.5 rounded border border-neutral-200">
                ABDM Live
              </span>
            </div>

            {/* Locked vs Unlocked Content */}
            {!isIdentified ? (
              <div className="py-10 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center mx-auto text-neutral-400">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-900">
                    Data Locked Until Patient Identified
                  </h4>
                  <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto leading-relaxed">
                    Click <strong>"Face Scan"</strong> on the left to capture the patient's photo and decrypt their blood group, allergies, and emergency contact.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3 mt-3 animate-in fade-in duration-200">
                {/* Blood Group Item */}
                <div className="p-3.5 rounded-2xl border border-neutral-200/80 bg-neutral-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-500" />
                    <div>
                      <span className="text-xs font-bold text-neutral-900 block">Blood Group</span>
                      <span className="text-[10px] text-neutral-500 font-mono">
                        {currentPatient.hasBloodGroupConflict ? '⚠️ Conflicting Records' : 'Single Verified Source'}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`font-black font-mono text-lg ${
                      currentPatient.hasBloodGroupConflict && !isConflictResolved
                        ? 'text-red-600 animate-pulse'
                        : 'text-emerald-700'
                    }`}
                  >
                    {isConflictResolved
                      ? resolvedBloodGroup
                      : currentPatient.hasBloodGroupConflict
                      ? 'CONFLICT'
                      : currentPatient.bloodGroup}
                  </span>
                </div>

                {/* Drug Allergies */}
                <div className="p-3.5 rounded-2xl border border-neutral-200/80 bg-neutral-50">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                      <Pill className="w-3.5 h-3.5 text-amber-600" />
                      <span>Critical Drug Allergies</span>
                    </span>
                    <span className="text-[10px] font-mono font-bold text-red-700 bg-red-100 px-1.5 py-0.2 rounded">
                      HIGH ALERT
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {currentPatient.allergies.map((a, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-mono font-bold bg-white text-red-800 border border-red-200 px-2 py-0.5 rounded-lg shadow-2xs"
                      >
                        {a.name} ({a.severity})
                      </span>
                    ))}
                  </div>
                </div>

                {/* Emergency Contact & Call */}
                <div className="p-3.5 rounded-2xl border border-neutral-200/80 bg-neutral-50 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-neutral-900 block">
                      {currentPatient.emergencyContact.name} ({currentPatient.emergencyContact.relationship})
                    </span>
                    <span className="text-[10px] font-mono text-neutral-500">
                      {currentPatient.emergencyContact.maskedPhone} &bull; Masked Proxy
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCallModalOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-[#FFB800] text-xs font-bold flex items-center gap-1.5 shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Family</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Button */}
          {isIdentified && (
            <button
              type="button"
              onClick={() => setCurrentScreen('clinical-trust')}
              className="mt-4 w-full py-3 rounded-2xl bg-neutral-950 hover:bg-black text-[#FFB800] font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <span>OPEN FULL PATIENT VAULT &amp; CONFLICTS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ─── Real Live Webcam Face Scanner Modal ────────────────────── */}
      <LiveFaceCaptureModal
        isOpen={isLiveCameraOpen}
        onClose={() => setIsLiveCameraOpen(false)}
        onCapture={handleCaptureSuccess}
      />
    </div>
  );
};
