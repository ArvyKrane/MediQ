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
  Sparkles,
  Lock,
  ShieldCheck,
  CheckCircle2,
  Building2,
  UserPlus,
  RotateCcw,
  Phone,
  Scan,
  Check,
  ShieldAlert,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { useMediq } from '../../context/MediqContext';
import { AbhaScannerModal } from '../common/AbhaScannerModal';
import { playScanSweepSound, playSuccessChime, playConflictAlertTone } from '../../utils/audioEffects';
import type { ScanInputMethod } from '../../types/mediq';

export const Screen1EmergencyLanding: React.FC = () => {
  const {
    setCurrentScreen,
    currentPatient,
    identityStatus,
    confirmIdentity,
    resetEmergencyIntake,
    scanFace,
    scanFingerprint,
    scanIdCard,
    fingerprintVerified,
    idCardVerified,
    setIsInsuranceModalOpen,
    setIsRegisterModalOpen,
    isConflictResolved,
    resolvedBloodGroup,
    capturedPhotoUrl,
  } = useMediq();

  const [scannerModalOpen, setScannerModalOpen] = useState(false);
  const [modalMethod, setModalMethod] = useState<ScanInputMethod>('face');
  const [inPlaceScanning, setInPlaceScanning] = useState(false);
  const [scanStepText, setScanStepText] = useState('Capturing live biometric vectors...');

  const isIdentified = identityStatus === 'VERIFIED' || identityStatus === 'MATCHED';

  // Fast, slick in-place scan simulation with audio cues
  const handleQuickScan = (method: ScanInputMethod) => {
    setInPlaceScanning(true);
    playScanSweepSound();

    if (method === 'face') {
      setScanStepText('Analyzing facial landmarks via camera...');
    } else if (method === 'fingerprint') {
      setScanStepText('Reading capacitive biometric minutiae...');
    } else {
      setScanStepText('Scanning physical ID card via camera OCR...');
    }

    setTimeout(() => {
      setScanStepText('Querying ABDM National Health Registry (UIDAI e-KYC)...');
    }, 500);

    setTimeout(() => {
      setScanStepText(`Identity Found: ${currentPatient.name}! Unlocking records...`);
    }, 1000);

    setTimeout(() => {
      setInPlaceScanning(false);
      confirmIdentity();
      playSuccessChime();

      if (currentPatient.hasBloodGroupConflict) {
        setTimeout(() => {
          playConflictAlertTone();
        }, 550);
      }
    }, 1400);
  };

  const openScanner = (method: ScanInputMethod) => {
    setModalMethod(method);
    setScannerModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      {/* Platform Mission & Action Header */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-neutral-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-neutral-950 text-[#FFB800] flex items-center justify-center shrink-0 shadow-xs">
            <Activity className="w-6 h-6 text-[#FFB800]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-wider text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                ABHA Live Emergency Intake
              </span>
              <span className="text-[11px] font-mono text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                No NFC Required
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-neutral-950 tracking-tight mt-1">
              Emergency Medical Intelligence
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 mt-0.5 max-w-2xl leading-relaxed">
              When an unconscious patient arrives without family, scan their <strong>Face</strong>, <strong>Fingerprint</strong>, or <strong>ID Card</strong> to discover their <strong>ABHA ID</strong>, fetch critical life-saving data, and prevent medical errors.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto shrink-0">
          {/* Register Patient Button */}
          <button
            type="button"
            onClick={() => setIsRegisterModalOpen(true)}
            className="bg-amber-50 hover:bg-amber-100/90 border border-amber-300 p-3 rounded-2xl text-left transition-all group shrink-0"
          >
            <div className="flex items-center gap-2 font-bold text-xs text-amber-950">
              <UserPlus className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
              <span>Register Patient / Create ABHA</span>
            </div>
            <p className="text-[11px] text-amber-800 mt-0.5">
              Take selfie + enter Aadhaar to test your own profile.
            </p>
          </button>

          {/* Insurance Shield Button */}
          <button
            type="button"
            onClick={() => setIsInsuranceModalOpen(true)}
            className="bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-300 p-3 rounded-2xl text-left transition-all group shrink-0"
          >
            <div className="flex items-center gap-2 font-bold text-xs text-emerald-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
              <span>Insurance Shield</span>
            </div>
            <p className="text-[11px] text-emerald-700 mt-0.5">
              Emergency scans <strong>never</strong> leak past OPD history.
            </p>
          </button>
        </div>
      </div>

      {/* ─── Golden Hour Triage & Critical Vitals HUD ──────────────── */}
      <div className="bg-neutral-950 text-white rounded-3xl p-4 sm:p-5 border border-neutral-800 shadow-xl overflow-hidden relative">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left: Triage Code & Golden Hour Timer */}
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-ping shrink-0" />
            <div>
              <div className="flex items-center gap-2 text-[10px] font-mono">
                <span className="text-red-400 font-bold uppercase tracking-wider">
                  TRAUMA CODE RED &bull; GOLDEN HOUR CLOCK
                </span>
                <span className="text-neutral-500">&bull; AIIMS APEX TRAUMA</span>
              </div>
              <div className="text-xl sm:text-2xl font-black font-mono text-white tracking-tight mt-0.5 flex flex-wrap items-center gap-2">
                <span>00:14:38</span>
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">
                  Critical Golden Window
                </span>
              </div>
            </div>
          </div>

          {/* Center: Real-time ECG Heartbeat Waveform SVG */}
          <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-2xl bg-neutral-900/90 border border-neutral-800">
            <svg className="w-28 h-8 text-emerald-400" viewBox="0 0 120 32" fill="none">
              <path
                d="M0 16 L25 16 L32 4 L38 28 L44 12 L50 20 L56 16 L120 16"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-pulse"
              />
            </svg>
            <div className="font-mono text-xs">
              <span className="text-neutral-400 block text-[9px] uppercase font-bold">SINUS TACHYCARDIA</span>
              <span className="text-emerald-400 font-bold text-sm">108 BPM</span>
            </div>
          </div>

          {/* Right: Trauma Vitals Trio */}
          <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs">
            <div className="bg-neutral-900 p-2.5 rounded-xl border border-neutral-800">
              <span className="text-[9px] text-neutral-400 block font-bold">SpO2</span>
              <span className="text-emerald-400 font-bold text-sm">94%</span>
            </div>
            <div className="bg-neutral-900 p-2.5 rounded-xl border border-neutral-800">
              <span className="text-[9px] text-neutral-400 block font-bold">BP (mmHg)</span>
              <span className="text-white font-bold text-sm">108/68</span>
            </div>
            <div className="bg-neutral-900 p-2.5 rounded-xl border border-neutral-800">
              <span className="text-[9px] text-neutral-400 block font-bold">GCS SCORE</span>
              <span className="text-amber-400 font-bold text-sm">8 / 15</span>
            </div>
          </div>
        </div>
      </div>

      {/* Prominent Clinical Conflict Warning Card - ONLY SHOWN ONCE PATIENT IS IDENTIFIED */}
      {isIdentified && currentPatient.hasBloodGroupConflict && !isConflictResolved && (
        <div className="bg-red-50 border-2 border-red-400 rounded-3xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-start gap-3.5">
            <div className="p-3 bg-red-100 rounded-2xl text-red-600 shrink-0 mt-0.5">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-red-700 bg-red-100 px-2 py-0.5 rounded">
                  ⚠️ CRITICAL MEDICAL CONFLICT DETECTED
                </span>
                <span className="text-xs font-bold text-neutral-900 font-mono">
                  Transfusion Safety Alert
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-neutral-950 mt-1">
                Two Hospitals Disagree on Blood Group: <span className="text-red-700 font-mono">B+ vs O+</span>
              </h3>
              <p className="text-xs text-neutral-700 mt-1 leading-relaxed">
                Apollo Hospital records say <strong className="text-neutral-950">B+</strong>, but Fortis Hospital records say <strong className="text-neutral-950">O+</strong>. 
                MEDIQ refuses to blindly merge or guess conflicting records to prevent fatal transfusion shock.
              </p>
              <div className="mt-2 text-xs font-mono text-red-800 font-bold bg-red-100/70 px-2.5 py-1 rounded-lg inline-block">
                Required Action: Perform bedside blood test confirmation before administering red blood cells.
              </div>
            </div>
          </div>

          <div className="shrink-0">
            <button
              type="button"
              onClick={() => setCurrentScreen('clinical-trust')}
              className="w-full sm:w-auto py-3 px-5 rounded-2xl bg-neutral-950 hover:bg-black text-[#FFB800] text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 group"
            >
              <span>VERIFY &amp; RESOLVE CONFLICT</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: Triage Identification Terminal & Medical Intelligence Record */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Triage Terminal Card (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-neutral-200/90 shadow-sm p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden">
          
          <div>
            {/* Triage Status Header */}
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <div className="flex items-center gap-2.5">
                <span className={`w-3 h-3 rounded-full ${isIdentified ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                <span className="font-mono text-xs uppercase tracking-wider text-neutral-500 font-bold">
                  {isIdentified ? 'TRIAGE STATUS: PATIENT VERIFIED' : 'TRIAGE STATUS: AWAITING IDENTIFICATION'}
                </span>
              </div>
              
              {isIdentified ? (
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>ABHA Verified</span>
                  </span>
                  <button
                    type="button"
                    onClick={resetEmergencyIntake}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
                    title="Reset Intake to Unidentified"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <span className="font-mono text-xs bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-lg font-bold">
                  Patient Unknown
                </span>
              )}
            </div>

            {/* Silhouette / Avatar & Basic Patient Details */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 mt-5 items-center">
              
              {/* Avatar Box with Scanline and Technical Crosshairs */}
              <div className="sm:col-span-5 flex flex-col items-center justify-center p-5 bg-[#F8F9FA] rounded-2xl border border-neutral-200 relative group">
                <div className="relative w-36 h-36 rounded-2xl bg-neutral-200/80 flex items-center justify-center border-2 border-dashed border-neutral-300 overflow-hidden shadow-inner">
                  {/* Case 1: Identified Patient Photo */}
                  {isIdentified && (capturedPhotoUrl || currentPatient.photoUrl) ? (
                    <img
                      src={capturedPhotoUrl || currentPatient.photoUrl}
                      alt={currentPatient.name}
                      className="w-full h-full object-cover animate-in fade-in duration-300"
                    />
                  ) : (
                    /* Case 2: Unidentified Silhouette */
                    <div className="absolute inset-0 bg-neutral-100 flex flex-col items-center justify-center text-neutral-400">
                      <UserX className="w-16 h-16 stroke-[1.5]" />
                      <span className="text-[10px] font-mono font-bold mt-1 text-neutral-500 uppercase">
                        Unidentified
                      </span>
                    </div>
                  )}

                  {/* Corner Crosshairs */}
                  <Crosshair className="absolute top-2 left-2 w-4 h-4 text-neutral-400 pointer-events-none" />
                  <Crosshair className="absolute bottom-2 right-2 w-4 h-4 text-neutral-400 pointer-events-none" />

                  {/* Active Laser Scanline Animation */}
                  {inPlaceScanning && <div className="animate-scanline z-20" />}
                </div>

                <div className="mt-3 text-center">
                  <span className="font-mono text-xs font-bold text-neutral-900 bg-white px-2.5 py-1 rounded-lg border border-neutral-200">
                    {isIdentified ? currentPatient.id : 'INTAKE ID: EM-9021'}
                  </span>
                </div>
              </div>

              {/* Patient Basic Identity Details */}
              <div className="sm:col-span-7 space-y-3">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold block">
                    IDENTITY RESOLUTION
                  </span>
                  
                  {isIdentified ? (
                    /* UNLOCKED PATIENT IDENTITY */
                    <div className="mt-1 animate-in fade-in duration-200">
                      <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-black text-neutral-950 tracking-tight">
                          {currentPatient.name}
                        </h2>
                        <span className="text-[10px] font-mono font-bold bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded border border-neutral-200">
                          UNCONSCIOUS
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        Demographics: <strong className="text-neutral-900 font-sans">{currentPatient.age} years</strong>, {currentPatient.gender} (DOB: {currentPatient.dob})
                      </p>
                    </div>
                  ) : (
                    /* UNIDENTIFIED STATE */
                    <div className="mt-1">
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl sm:text-2xl font-black text-neutral-400 tracking-tight">
                          UNKNOWN PATIENT
                        </h2>
                        <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-200 animate-pulse">
                          NEEDS SCAN
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                        No ID found on scene. Patient arrived unconscious. Scan biometric or document to query national ABHA registry.
                      </p>
                    </div>
                  )}
                </div>

                {/* Identity Verification Badge / Prompt */}
                {isIdentified ? (
                  <div className="bg-emerald-50/90 p-3 rounded-2xl border border-emerald-300 animate-in fade-in duration-300">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                      <span className="font-bold text-xs text-emerald-950">
                        Identity Verified via Aadhaar e-KYC &amp; ABDM
                      </span>
                      <span className="ml-auto text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-300">
                        CONFIRMED
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-2 text-[10px] font-mono text-emerald-900 border-t border-emerald-200/80 pt-1.5">
                      <span>{currentPatient.maskedGovId}</span>
                      <span>•</span>
                      <span>ABHA No: {currentPatient.abhaNumber}</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-neutral-50 p-3 rounded-2xl border border-neutral-200/80 text-xs text-neutral-600 space-y-1">
                    <div className="font-bold text-neutral-900 flex items-center gap-1.5 text-[11px]">
                      <Scan className="w-3.5 h-3.5 text-amber-500" />
                      <span>Zero-Friction Emergency Lookup</span>
                    </div>
                    <p className="text-[11px] text-neutral-500 leading-relaxed">
                      Scanning matches citizen's UIDAI facial template or fingerprint minutiae directly to their ABHA ID.
                    </p>
                  </div>
                )}

                {/* ABHA Address & Hospitals (Only displayed when identified) */}
                {isIdentified && (
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono animate-in fade-in duration-200">
                    <div className="bg-[#F8F9FA] p-2.5 rounded-xl border border-neutral-200/70">
                      <span className="text-neutral-400 text-[10px] block font-bold">ABHA ADDRESS</span>
                      <span className="font-bold text-neutral-900 truncate block">
                        {currentPatient.abhaId}
                      </span>
                    </div>
                    <div className="bg-[#F8F9FA] p-2.5 rounded-xl border border-neutral-200/70">
                      <span className="text-neutral-400 text-[10px] block font-bold">LINKED HOSPITALS</span>
                      <span className="font-bold text-neutral-900">
                        {currentPatient.linkedHospitals.length} Connected Nodes
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Interactive Scanning Console (No NFC - Face, Fingerprint, ID Card) */}
          <div className="mt-6 pt-5 border-t border-neutral-100">
            
            {/* Scanning Progress Bar if in-place scanning is active */}
            {inPlaceScanning && (
              <div className="mb-4 bg-neutral-950 text-white p-3.5 rounded-2xl animate-in fade-in duration-200 shadow-md">
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-amber-400 font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                    {scanStepText}
                  </span>
                  <span className="text-neutral-400 text-[10px]">PLEASE HOLD STILL</span>
                </div>
                <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-400 to-[#FFB800] rounded-full animate-pulse w-full transition-all duration-1000" />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs uppercase font-bold text-neutral-500 tracking-wider">
                {isIdentified ? 'RE-SCAN PATIENT VIA' : 'STEP 1: SELECT ZERO-FRICTION SCAN MODE'}
              </span>
              <span className="text-[10px] font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-bold border border-amber-200">
                NO NFC NEEDED
              </span>
            </div>

            {/* 3 Input Methods Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              
              {/* 1. Face Scan */}
              <button
                type="button"
                onClick={() => handleQuickScan('face')}
                disabled={inPlaceScanning}
                className="p-3.5 rounded-2xl border border-neutral-200 hover:border-amber-400 bg-white hover:bg-amber-50/40 text-left transition-all group shadow-2xs cursor-pointer active:scale-98"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-xl bg-neutral-100 group-hover:bg-[#FFB800] text-neutral-900 group-hover:text-black transition-colors">
                    <Camera className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-neutral-500 group-hover:text-neutral-900">
                    Camera
                  </span>
                </div>
                <div className="font-bold text-xs text-neutral-950">FACE SCAN</div>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Matches live webcam against ABHA photo
                </p>
              </button>

              {/* 2. Fingerprint Scan */}
              <button
                type="button"
                onClick={() => handleQuickScan('fingerprint')}
                disabled={inPlaceScanning}
                className="p-3.5 rounded-2xl border border-neutral-200 hover:border-amber-400 bg-white hover:bg-amber-50/40 text-left transition-all group shadow-2xs cursor-pointer active:scale-98"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-xl bg-neutral-100 group-hover:bg-[#FFB800] text-neutral-900 group-hover:text-black transition-colors">
                    <Fingerprint className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-neutral-500 group-hover:text-neutral-900">
                    Biometric
                  </span>
                </div>
                <div className="font-bold text-xs text-neutral-950">FINGERPRINT</div>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Reads minutiae via touch sensor
                </p>
              </button>

              {/* 3. Physical ID Card Scan */}
              <button
                type="button"
                onClick={() => handleQuickScan('id-card')}
                disabled={inPlaceScanning}
                className="p-3.5 rounded-2xl border border-neutral-200 hover:border-amber-400 bg-white hover:bg-amber-50/40 text-left transition-all group shadow-2xs cursor-pointer active:scale-98"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-xl bg-neutral-100 group-hover:bg-[#FFB800] text-neutral-900 group-hover:text-black transition-colors">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-neutral-500 group-hover:text-neutral-900">
                    OCR / QR
                  </span>
                </div>
                <div className="font-bold text-xs text-neutral-950">ID CARD SCAN</div>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Aadhaar, Voter ID, DL, or ABHA QR
                </p>
              </button>
            </div>

            {/* Quick Action Button */}
            {!isIdentified ? (
              <button
                type="button"
                onClick={() => handleQuickScan('face')}
                disabled={inPlaceScanning}
                className="mt-4 w-full py-3.5 px-6 rounded-2xl bg-neutral-950 hover:bg-neutral-800 text-[#FFB800] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all group cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#FFB800]" />
                <span>RUN INSTANT EMERGENCY SCAN (DISCOVER ABHA)</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setCurrentScreen('clinical-trust')}
                className="mt-4 w-full py-3.5 px-6 rounded-2xl bg-neutral-950 hover:bg-neutral-800 text-[#FFB800] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all group cursor-pointer"
              >
                <span>PROCEED TO CLINICAL RECORDS &amp; CONFLICT RESOLUTION</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Medical Record Intelligence / Vault (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-white rounded-3xl border border-neutral-200/90 p-5 sm:p-6 shadow-sm flex flex-col justify-between h-full">
            
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-neutral-100">
                <span className="font-mono text-xs uppercase tracking-wider font-bold text-neutral-500 flex items-center gap-1.5">
                  {isIdentified ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>PATIENT EMERGENCY HEALTH RECORD</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-amber-500" />
                      <span>MEDICAL RECORD VAULT: ENCRYPTED</span>
                    </>
                  )}
                </span>
                <span className="text-[10px] font-mono text-neutral-400 bg-neutral-50 px-2 py-0.5 rounded border border-neutral-200">
                  ABDM Gateway
                </span>
              </div>

              {/* BODY: CONDITIONAL ON WHETHER PATIENT IS IDENTIFIED */}
              {!isIdentified ? (
                /* CASE A: UNIDENTIFIED - VAULT LOCKED STATE (MAKES CLINICAL SENSE!) */
                <div className="py-8 px-4 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-3xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-400 shadow-inner">
                      <Lock className="w-8 h-8 text-neutral-500" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-400 text-neutral-950 flex items-center justify-center font-bold text-xs shadow-xs">
                      !
                    </div>
                  </div>

                  <div className="max-w-xs">
                    <h3 className="text-base font-black text-neutral-900 tracking-tight">
                      Records Locked Until Identified
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
                      Blood group, drug allergies, and medical history cannot be revealed for an unknown patient.
                    </p>
                  </div>

                  {/* Grayed-out skeleton preview boxes */}
                  <div className="w-full space-y-2 pt-2">
                    <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80 flex items-center justify-between text-xs text-neutral-400">
                      <span className="font-mono font-bold">BLOOD GROUP</span>
                      <span className="font-mono text-[11px] bg-neutral-200/70 px-2 py-0.5 rounded text-neutral-500 flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Locked
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80 flex items-center justify-between text-xs text-neutral-400">
                      <span className="font-mono font-bold">DRUG ALLERGIES</span>
                      <span className="font-mono text-[11px] bg-neutral-200/70 px-2 py-0.5 rounded text-neutral-500 flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Locked
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80 flex items-center justify-between text-xs text-neutral-400">
                      <span className="font-mono font-bold">EMERGENCY CONTACT</span>
                      <span className="font-mono text-[11px] bg-neutral-200/70 px-2 py-0.5 rounded text-neutral-500 flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Locked
                      </span>
                    </div>
                  </div>

                  <div className="bg-amber-50/80 border border-amber-200/90 p-3 rounded-2xl text-[11px] text-amber-900 text-left w-full mt-2">
                    <span className="font-bold block mb-0.5">🔒 DPDP Act &amp; ABDM Security Guard:</span>
                    <span>Scan patient to generate an ephemeral authorization token bound strictly to <code className="font-mono bg-white px-1 py-0.5 rounded text-[10px]">Purpose: EMERGENCY_CARE</code>.</span>
                  </div>
                </div>
              ) : (
                /* CASE B: IDENTIFIED - REAL MEDICAL DATA UNLOCKED! */
                <div className="divide-y divide-neutral-100 text-xs animate-in fade-in duration-300">
                  
                  {/* Blood Group */}
                  <div className="py-3.5 flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs text-neutral-400 uppercase font-semibold">
                          Blood Group
                        </span>
                        {currentPatient.hasBloodGroupConflict && !isConflictResolved ? (
                          <span className="text-[10px] font-mono bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold">
                            CONFLICT DETECTED
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
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
                          ? 'Clinician bedside agglutination completed.'
                          : 'Requires doctor confirmation before transfusion.'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentScreen('clinical-trust')}
                      className="text-xs font-semibold text-neutral-900 hover:text-amber-600 underline underline-offset-4 shrink-0 pt-1 cursor-pointer"
                    >
                      Verify →
                    </button>
                  </div>

                  {/* Severe Drug Allergies */}
                  <div className="py-3.5 flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-xs text-neutral-400 uppercase font-semibold">
                        Critical Drug Allergies
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
                  <div className="py-3.5">
                    <span className="font-mono text-xs text-neutral-400 uppercase font-semibold">
                      Active Medications
                    </span>
                    <div className="font-medium text-neutral-900 mt-0.5">
                      {currentPatient.medications.map((m) => `${m.name} (${m.dosage})`).join(', ') || 'None recorded'}
                    </div>
                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      Pulled from linked hospital pharmacy records
                    </p>
                  </div>

                  {/* Primary Emergency Contact */}
                  <div className="py-3.5 flex items-center justify-between">
                    <div>
                      <span className="font-mono text-xs text-neutral-400 uppercase font-semibold">
                        Emergency Contact
                      </span>
                      <div className="font-bold text-neutral-900 mt-0.5">
                        {currentPatient.emergencyContact.name} ({currentPatient.emergencyContact.relationship})
                      </div>
                      <div className="text-[11px] font-mono text-neutral-500">
                        {currentPatient.emergencyContact.maskedPhone}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentScreen('emergency-contact')}
                      className="px-3 py-1.5 bg-neutral-950 hover:bg-neutral-800 text-[#FFB800] rounded-xl font-bold text-xs flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Mom</span>
                    </button>
                  </div>

                  {/* Shielded Records Notice */}
                  <div className="pt-3 flex items-center justify-between text-[11px]">
                    <span className="text-emerald-800 font-medium flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{currentPatient.shieldedRecordsCount} non-emergency records shielded</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsInsuranceModalOpen(true)}
                      className="font-bold text-emerald-900 underline cursor-pointer"
                    >
                      Details
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Hospital Network Status */}
            <div className="mt-4 pt-3.5 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500 font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                ABDM Live Gateway: Connected
              </span>
              <span>Latency: 42ms</span>
            </div>

          </div>
        </div>

      </div>

      {/* Global Multimodal Scanner Modal */}
      <AbhaScannerModal
        isOpen={scannerModalOpen}
        onClose={() => setScannerModalOpen(false)}
        initialMethod={modalMethod}
      />
    </div>
  );
};
