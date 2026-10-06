import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Camera,
  Check,
  ShieldCheck,
  Heart,
  Phone,
  Sparkles,
  RefreshCw,
  User,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Lock,
  QrCode,
  ShieldAlert,
  Activity,
} from 'lucide-react';
import { useMediq } from '../../context/MediqContext';
import type { PatientProfile } from '../../types/mediq';

export const CitizenOnboardingModal: React.FC = () => {
  const { isRegisterModalOpen, setIsRegisterModalOpen, registerPatient, setCurrentScreen } = useMediq();

  // Wizard Step: 1 = Basic Info, 2 = Face e-KYC, 3 = Emergency Medical, 4 = Insurance Shield Consent, 5 = ABHA Card Generated
  const [step, setStep] = useState<number>(1);

  // Form State
  const [fullName, setFullName] = useState<string>('Priya Sharma');
  const [age, setAge] = useState<number>(24);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Female');
  const [dob, setDob] = useState<string>('2002-05-18');
  const [idType, setIdType] = useState<'Aadhaar' | 'Voter ID' | 'Driving License' | 'PAN'>('Aadhaar');
  const [idNumber, setIdNumber] = useState<string>('8294 1029 4819');
  
  // Emergency essentials
  const [bloodGroup, setBloodGroup] = useState<string>('O+');
  const [allergiesText, setAllergiesText] = useState<string>('Penicillin, Shellfish');
  const [chronicCondition, setChronicCondition] = useState<string>('Type 1 Diabetes (Insulin Dependent)');
  const [chronicNotes, setChronicNotes] = useState<string>('Check blood sugar immediately if unconscious. Keep insulin on standby.');
  const [contactName, setContactName] = useState<string>('Sunita Sharma');
  const [contactRelation, setContactRelation] = useState<string>('Mother');
  const [contactPhone, setContactPhone] = useState<string>('+91 98201 99234');

  // Camera & Face capture state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [livenessPassed, setLivenessPassed] = useState<boolean>(false);

  // Generated ABHA details
  const [generatedAbhaId, setGeneratedAbhaId] = useState<string>('');
  const [generatedAbhaNumber, setGeneratedAbhaNumber] = useState<string>('');

  // Start / Stop camera when reaching step 2
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (isRegisterModalOpen && step === 2 && !capturedPhoto) {
      navigator.mediaDevices
        ?.getUserMedia({ video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } } })
        .then((s) => {
          stream = s;
          setCameraStream(s);
          setCameraError(null);
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch((err) => {
          console.warn('Camera access error:', err);
          setCameraError('Webcam not accessible. You can proceed with standard simulation photo.');
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [isRegisterModalOpen, step, capturedPhoto]);

  // Clean up stream on modal close
  const closeModal = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((t) => t.stop());
      setCameraStream(null);
    }
    setIsRegisterModalOpen(false);
    setStep(1);
  };

  const handleCaptureLiveSelfie = () => {
    setIsCapturing(true);
    if (videoRef.current && videoRef.current.videoWidth > 0) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setCapturedPhoto(dataUrl);
      }
    } else {
      // High quality fallback avatar if camera is unavailable
      setCapturedPhoto('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400');
    }

    // Stop camera tracks
    if (cameraStream) {
      cameraStream.getTracks().forEach((t) => t.stop());
      setCameraStream(null);
    }

    setTimeout(() => {
      setIsCapturing(false);
      setLivenessPassed(true);
    }, 600);
  };

  const handleRetakeSelfie = () => {
    setCapturedPhoto(null);
    setLivenessPassed(false);
  };

  // Generate ABHA ID and Number based on name
  const handleProceedToConsent = () => {
    const cleanName = fullName.toLowerCase().replace(/[^a-z0-9]/g, '.');
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const abhaId = `${cleanName}@abdm`;
    const abhaNum = `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${randomDigits}`;
    setGeneratedAbhaId(abhaId);
    setGeneratedAbhaNumber(abhaNum);
    setStep(4);
  };

  const handleFinalizeRegistration = () => {
    const allergiesArray = allergiesText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((name) => ({
        name,
        severity: 'Severe' as const,
        verified: true,
        source: 'Self-Declared at ABDM Onboarding (Aadhaar Verified)',
      }));

    const newProfile: PatientProfile = {
      id: `MED-REG-${Date.now().toString().slice(-4)}`,
      name: fullName,
      abhaId: generatedAbhaId || `${fullName.toLowerCase().replace(/\s+/g, '.')}@abdm`,
      abhaNumber: generatedAbhaNumber || '91-8842-1920-3341',
      age: Number(age) || 25,
      gender,
      dob,
      maskedGovId: `${idType}: •••• •••• ${idNumber.slice(-4)}`,
      bloodGroup,
      hasBloodGroupConflict: false,
      bloodGroupSources: [
        {
          id: 'reg-src-1',
          sourceName: 'National Health Authority (ABDM)',
          institutionType: 'Aadhaar e-KYC Central Registry',
          bloodGroup,
          confidence: 'High',
          recordedDate: 'Today (Live Registration)',
          verifiedBy: 'UIDAI Citizen Self-Declaration Token',
          hash: `sha256:${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
          notes: 'Registered during verified citizen onboarding with live face biometric template.',
        },
      ],
      allergies: allergiesArray.length > 0 ? allergiesArray : [
        { name: 'None Reported', severity: 'Mild', verified: true, source: 'Citizen Onboarding' }
      ],
      medications: [
        { name: 'Paracetamol', dosage: '500mg', frequency: 'As needed', verified: true }
      ],
      acuteConditions:
        chronicCondition.trim() && chronicCondition.toLowerCase() !== 'none'
          ? [
              {
                name: chronicCondition.trim(),
                notes: chronicNotes.trim() || 'Pre-existing chronic condition declared during verified citizen onboarding.',
                verified: true,
              },
            ]
          : [
              {
                name: 'No Critical Pre-existing Illness',
                notes: 'Enrolled via Aadhaar Face e-KYC',
                verified: true,
              },
            ],
      emergencyContact: {
        name: contactName,
        relationship: contactRelation,
        maskedPhone: contactPhone,
        isVerified: true,
      },
      shieldedRecordsCount: 4,
      shieldedCategories: ['Past OPD Consultations', 'Dental Procedures', 'Routine Lab Panels', 'Historical Prescriptions'],
      linkedHospitals: [
        { name: 'Apollo Hospitals', type: 'Tertiary Care', lastSync: 'Just now', recordsShared: 4 },
        { name: 'Max Healthcare', type: 'Emergency Hospital', lastSync: '1 hour ago', recordsShared: 2 },
      ],
      photoUrl: capturedPhoto || undefined,
    };

    registerPatient(newProfile);
    setStep(5);
  };

  const handleTestInEmergencyIntake = () => {
    closeModal();
    setCurrentScreen('emergency-landing');
  };

  if (!isRegisterModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-neutral-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-neutral-200 overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-neutral-950 flex items-center justify-center font-bold shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-neutral-950 tracking-tight">
                Citizen ABHA Registration
              </h2>
              <p className="text-xs text-neutral-500">
                Aadhaar Face e-KYC • Emergency Medical ID Creation
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeModal}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Progress Bar */}
        <div className="px-5 pt-3 pb-2 bg-white border-b border-neutral-100 flex items-center justify-between text-xs">
          {[
            { num: 1, label: 'Govt ID' },
            { num: 2, label: 'Face e-KYC' },
            { num: 3, label: 'Emergency Info' },
            { num: 4, label: 'Privacy' },
            { num: 5, label: 'ABHA Card' },
          ].map((s) => (
            <div key={s.num} className="flex items-center gap-1.5">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
                  step === s.num
                    ? 'bg-neutral-950 text-[#FFB800] ring-2 ring-amber-300'
                    : step > s.num
                    ? 'bg-emerald-500 text-white'
                    : 'bg-neutral-100 text-neutral-400'
                }`}
              >
                {step > s.num ? <Check className="w-3.5 h-3.5" /> : s.num}
              </div>
              <span
                className={`hidden sm:inline font-mono text-[11px] ${
                  step === s.num ? 'font-bold text-neutral-900' : 'text-neutral-400'
                }`}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          
          {/* STEP 1: Basic & Government ID Details */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="bg-amber-50/70 border border-amber-200 p-3 rounded-2xl">
                <p className="text-xs text-amber-900 font-medium">
                  <strong>Step 1 of 5:</strong> Enter your official government identity details. In MEDIQ, face & biometric features are linked securely at registration to your Aadhaar/ABHA ID.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Full Legal Name (as on Govt ID)
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm font-medium focus:outline-hidden focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-sm font-medium focus:outline-hidden focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-sm font-medium focus:outline-hidden focus:border-amber-500 bg-white"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-sm font-medium focus:outline-hidden focus:border-amber-500 bg-white"
                  >
                  </input>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">
                    Select Verification ID
                  </label>
                  <select
                    value={idType}
                    onChange={(e) => setIdType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm font-medium focus:outline-hidden focus:border-amber-500 bg-white"
                  >
                    <option value="Aadhaar">Aadhaar (UIDAI)</option>
                    <option value="Voter ID">Voter ID (Election Commission)</option>
                    <option value="Driving License">Driving License (Sarathi)</option>
                    <option value="PAN">PAN Card (Income Tax)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">
                    {idType} Number
                  </label>
                  <input
                    type="text"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    placeholder="e.g. 8294 1029 4819"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm font-mono font-medium focus:outline-hidden focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Live Face Liveness & Selfie Scan */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="bg-neutral-900 text-white p-3.5 rounded-2xl">
                <div className="flex items-center gap-2 text-xs font-bold text-[#FFB800]">
                  <Camera className="w-4 h-4" />
                  <span>Aadhaar FaceRD Live Liveness Capture</span>
                </div>
                <p className="text-[11px] text-neutral-300 mt-1">
                  Look directly at the camera. In India, this matches against the UIDAI facial biometric database to bind your face template to your ABHA ID.
                </p>
              </div>

              {/* Camera Preview / Captured Photo */}
              <div className="relative rounded-2xl overflow-hidden bg-neutral-950 aspect-4/3 flex items-center justify-center border-2 border-neutral-300">
                {!capturedPhoto ? (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover -scale-x-100"
                    />
                    {/* Face Oval Overlay Guide */}
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      <div className="w-44 h-56 rounded-full border-2 border-dashed border-amber-400/80 bg-transparent flex items-center justify-center">
                        <span className="text-[10px] font-mono font-bold text-amber-300 bg-neutral-950/80 px-2 py-0.5 rounded">
                          Position Face Inside Oval
                        </span>
                      </div>
                    </div>

                    {cameraError && (
                      <div className="absolute inset-0 bg-neutral-900/90 p-4 flex flex-col items-center justify-center text-center">
                        <p className="text-xs text-red-300 mb-3">{cameraError}</p>
                        <button
                          type="button"
                          onClick={handleCaptureLiveSelfie}
                          className="bg-amber-400 text-neutral-950 px-4 py-2 rounded-xl text-xs font-bold"
                        >
                          Use Demo Citizen Photo
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="relative w-full h-full">
                    <img
                      src={capturedPhoto}
                      alt="Captured Citizen Selfie"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-3 left-3 bg-emerald-600/90 backdrop-blur-xs text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Face Liveness Verified & Anchored</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons for Step 2 */}
              <div className="flex items-center justify-center gap-3 pt-1">
                {!capturedPhoto ? (
                  <button
                    type="button"
                    onClick={handleCaptureLiveSelfie}
                    disabled={isCapturing}
                    className="w-full py-3 bg-neutral-950 hover:bg-neutral-800 text-[#FFB800] rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all"
                  >
                    <Camera className="w-4 h-4 text-[#FFB800]" />
                    <span>{isCapturing ? 'Analyzing Biometrics...' : 'Capture Selfie (Simulate e-KYC)'}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleRetakeSelfie}
                    className="py-2.5 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Retake Photo</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: Emergency Medical Essentials */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="bg-red-50/80 border border-red-200 p-3 rounded-2xl">
                <div className="flex items-center gap-2 text-xs font-bold text-red-950">
                  <Heart className="w-4 h-4 text-red-600" />
                  <span>Only Critical Life-Saving Data</span>
                </div>
                <p className="text-[11px] text-red-800 mt-1">
                  Doctors in the emergency room only need to know what saves your life right now: your confirmed blood group, critical drug allergies, and who to call.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Blood Group
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['O+', 'A+', 'B+', 'AB+', 'O-', 'A-', 'B-', 'AB-'].map((bg) => (
                    <button
                      key={bg}
                      type="button"
                      onClick={() => setBloodGroup(bg)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        bloodGroup === bg
                          ? 'bg-neutral-950 text-[#FFB800] border-neutral-950 shadow-xs'
                          : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                      }`}
                    >
                      {bg}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Severe Drug / Food Allergies (Comma separated)
                </label>
                <input
                  type="text"
                  value={allergiesText}
                  onChange={(e) => setAllergiesText(e.target.value)}
                  placeholder="e.g. Penicillin, Sulfa drugs, Peanuts"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm font-medium focus:outline-hidden focus:border-amber-500"
                />
                <span className="text-[10px] text-neutral-400 mt-0.5 block">
                  Leave blank or type 'None' if you have no known allergies.
                </span>
              </div>

              {/* Pre-existing Chronic Disease / Condition */}
              <div className="pt-2 border-t border-neutral-100">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-amber-600" />
                    <span>Pre-existing Chronic Illness / Medical Condition</span>
                  </label>
                  <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                    Crucial for ER Doctors
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-2">
                  {[
                    'Type 1 Diabetes',
                    'Refractory Epilepsy',
                    'Severe Asthma',
                    'Kidney Disease (CKD)',
                    'Hypertension',
                    'None',
                  ].map((cond) => (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => setChronicCondition(cond === 'None' ? '' : cond)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors ${
                        (cond === 'None' && !chronicCondition) || chronicCondition === cond
                          ? 'bg-amber-400/20 text-amber-900 border-amber-400 font-bold'
                          : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                      }`}
                    >
                      {cond}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  value={chronicCondition}
                  onChange={(e) => setChronicCondition(e.target.value)}
                  placeholder="e.g. Type 1 Diabetes, Epilepsy, Asthma"
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs font-medium focus:outline-hidden focus:border-amber-500 mb-1.5"
                />

                <input
                  type="text"
                  value={chronicNotes}
                  onChange={(e) => setChronicNotes(e.target.value)}
                  placeholder="Clinical precautions (e.g. Check blood sugar immediately if unconscious)"
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 bg-neutral-50/50 text-[11px] text-neutral-600 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div className="pt-2 border-t border-neutral-100">
                <span className="text-xs font-bold text-neutral-800 flex items-center gap-1.5 mb-2.5">
                  <Phone className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Primary Emergency Contact (Called when admitted unconscious)</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="text-[10px] font-bold text-neutral-500 block mb-1">
                      Contact Name
                    </label>
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Sunita Sharma"
                      className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-neutral-500 block mb-1">
                      Relationship
                    </label>
                    <input
                      type="text"
                      value={contactRelation}
                      onChange={(e) => setContactRelation(e.target.value)}
                      placeholder="e.g. Mother / Spouse"
                      className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-neutral-500 block mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-mono font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Insurance Privacy Shield & Legal Protection */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="bg-emerald-50 border-2 border-emerald-300 p-4 rounded-2xl">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-sm font-black text-emerald-950">
                    Your Medical Records are Protected from Insurance Companies
                  </h3>
                </div>
                <p className="text-xs text-emerald-800 mt-2 leading-relaxed">
                  Many citizens worry that linking health history to ABHA will allow insurance companies to snoop on old pre-existing conditions and cancel policies.
                </p>
                <div className="mt-3 bg-white p-3 rounded-xl border border-emerald-200 space-y-2">
                  <div className="flex items-start gap-2 text-xs">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-neutral-700">
                      <strong>Emergency-Only Gateway:</strong> When paramedics or doctors scan you in an ambulance, MEDIQ queries ABDM with <code className="bg-neutral-100 px-1 py-0.5 rounded text-[10px] font-mono">Purpose: EMERGENCY_CARE</code>.
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-xs">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-neutral-700">
                      <strong>Insurance TPA Blocked:</strong> Commercial insurance crawlers and TPAs receive a strict cryptographic 403 Forbidden. They cannot view your routine OPD or past minor consultations.
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-xs">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-neutral-700">
                      <strong>DPDP Act 2023 Compliant:</strong> Emergency health access automatically expires after 4 hours with immutable cryptographic audit logging.
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 flex items-center gap-3">
                <Lock className="w-5 h-5 text-neutral-500 shrink-0" />
                <p className="text-xs text-neutral-600">
                  By clicking <strong>Create My ABHA Profile</strong>, you authorize MEDIQ to anchor your biometric key to the National Health Authority emergency network.
                </p>
              </div>
            </div>
          )}

          {/* STEP 5: ABHA Digital Card Ready & Simulation */}
          {step === 5 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="text-center py-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-2 shadow-xs">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h3 className="text-lg font-black text-neutral-950">
                  ABHA Profile Created Successfully!
                </h3>
                <p className="text-xs text-neutral-500">
                  Your biometric face template and emergency card are now active.
                </p>
              </div>

              {/* Digital ABHA Card UI */}
              <div className="bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white rounded-3xl p-5 border border-amber-400/40 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-36 h-36 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
                
                {/* Card Top */}
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-400 text-neutral-950 flex items-center justify-center font-bold text-xs">
                      M
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block">
                        Ayushman Bharat Digital Mission (ABDM)
                      </span>
                      <span className="text-xs font-bold text-neutral-200">
                        ABHA Digital Health Card
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded">
                    ACTIVE
                  </span>
                </div>

                {/* Card Main Body */}
                <div className="flex items-center gap-4 py-4">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-amber-400/70 shrink-0 bg-neutral-800">
                    <img
                      src={capturedPhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
                      alt={fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-black text-white truncate">
                      {fullName}
                    </h4>
                    <p className="text-xs text-neutral-400">
                      {gender}, {age} years
                    </p>
                    <div className="mt-2 font-mono text-xs">
                      <div className="text-amber-400 font-bold text-sm">
                        {generatedAbhaNumber || '91-8842-1920-3341'}
                      </div>
                      <div className="text-neutral-400 text-[11px] truncate">
                        {generatedAbhaId || `${fullName.toLowerCase().replace(/\s+/g, '.')}@abdm`}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 bg-white p-2 rounded-xl text-neutral-950 flex flex-col items-center">
                    <QrCode className="w-12 h-12" />
                    <span className="text-[8px] font-mono font-bold mt-1">EMERGENCY</span>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="text-neutral-400 text-[10px] block">BLOOD GROUP</span>
                    <span className="font-bold text-amber-400 text-sm">{bloodGroup}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 text-[10px] block">EMERGENCY SOS</span>
                    <span className="font-bold text-neutral-200">{contactPhone}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 text-[10px] block">INSURANCE PRIVACY</span>
                    <span className="font-bold text-emerald-400">SHIELDED</span>
                  </div>
                </div>
              </div>

              {/* Ready to Test Prompt */}
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-center">
                <p className="text-xs text-amber-900 font-medium">
                  <strong>You can now test this patient in the emergency triage!</strong>
                  <br />
                  The camera or face scan will immediately recognize {fullName} and bring up this profile.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Modal Navigation Buttons */}
        <div className="p-4 sm:p-5 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-between gap-3">
          {step > 1 && step < 5 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-700 hover:bg-neutral-100 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          )}

          <div className="ml-auto flex items-center gap-2">
            {step === 1 && (
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!fullName.trim()}
                className="px-5 py-2.5 bg-neutral-950 hover:bg-neutral-800 text-[#FFB800] rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
              >
                <span>Next: Live Face e-KYC</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {step === 2 && (
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-5 py-2.5 bg-neutral-950 hover:bg-neutral-800 text-[#FFB800] rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <span>Next: Medical Essentials</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {step === 3 && (
              <button
                type="button"
                onClick={handleProceedToConsent}
                className="px-5 py-2.5 bg-neutral-950 hover:bg-neutral-800 text-[#FFB800] rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <span>Next: Privacy Shield</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {step === 4 && (
              <button
                type="button"
                onClick={handleFinalizeRegistration}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Create &amp; Issue ABHA Card</span>
              </button>
            )}

            {step === 5 && (
              <button
                type="button"
                onClick={handleTestInEmergencyIntake}
                className="w-full sm:w-auto px-6 py-3 bg-neutral-950 hover:bg-neutral-800 text-[#FFB800] rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <Sparkles className="w-4 h-4 text-[#FFB800]" />
                <span>Open in Ambulance / Emergency ER</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
