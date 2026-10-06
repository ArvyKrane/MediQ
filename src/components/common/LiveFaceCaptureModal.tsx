import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw, Check, Sparkles, AlertCircle, User, ArrowRight, UserPlus, ShieldCheck } from 'lucide-react';
import { playScanSweepSound, playSuccessChime } from '../../utils/audioEffects';
import { useMediq } from '../../context/MediqContext';
import type { PatientProfile } from '../../types/mediq';

interface LiveFaceCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (photoDataUrl: string, selectedPatient?: PatientProfile) => void;
}

export const LiveFaceCaptureModal: React.FC<LiveFaceCaptureModalProps> = ({
  isOpen,
  onClose,
  onCapture,
}) => {
  const { availablePatients, selectPatient, lastEnrolledId, setIsRegisterModalOpen } = useMediq();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState<string | null>(null);
  const [step, setStep] = useState<'camera' | 'matched'>('camera');
  const [matchedCandidate, setMatchedCandidate] = useState<PatientProfile>(availablePatients[0]);

  // Start webcam when modal opens
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setCapturedPhotoUrl(null);
      setStep('camera');
      setIsCapturing(false);
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    setCameraError(null);
    playScanSweepSound();

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported in this browser. Please use demo selfie.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setCameraActive(true);
        };
      }
    } catch (err: any) {
      console.warn('Camera access denied or unavailable:', err);
      setCameraError(
        err.message || 'Camera blocked. Click "Use Sample Photo" below to continue.'
      );
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const handleCaptureFrame = () => {
    if (!videoRef.current) return;
    setIsCapturing(true);

    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
        playSuccessChime();
        stopCamera();
        setCapturedPhotoUrl(dataUrl);

        // Auto-match: Prioritize newly registered patient if one exists, then Atharv Bodkhe (enrolled face)
        const topMatch =
          (lastEnrolledId ? availablePatients.find((p) => p.id === lastEnrolledId) : null) ||
          availablePatients.find((p) => p.id.startsWith('MED-REG-')) ||
          availablePatients.find((p) => p.id === 'MED-0777' || p.name.toLowerCase().includes('atharv')) ||
          availablePatients[0];

        setMatchedCandidate(topMatch);

        setIsCapturing(false);
        setStep('matched');
      }
    } catch (err) {
      console.error('Frame capture error:', err);
      setIsCapturing(false);
    }
  };

  const handleUseDemoSample = () => {
    playSuccessChime();
    stopCamera();
    const sample = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80';
    setCapturedPhotoUrl(sample);
    const aarav = availablePatients.find((p) => p.id === 'MED-0192') || availablePatients[0];
    setMatchedCandidate(aarav);
    setStep('matched');
  };

  const handleConfirmMatch = (patient: PatientProfile) => {
    selectPatient(patient);
    onCapture(capturedPhotoUrl || patient.photoUrl || '', patient);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-neutral-950 text-white rounded-3xl border border-neutral-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Top Header */}
        <div className="p-4 flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <span className="font-mono text-xs font-bold text-[#FFB800] uppercase tracking-wider">
              {step === 'camera' ? 'ABHA Live FaceRD Scanner' : 'Aadhaar Biometric Match Result'}
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

        {/* STEP 1: Live Camera Viewfinder */}
        {step === 'camera' && (
          <div>
            <div className="relative w-full aspect-4/3 bg-black flex items-center justify-center overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover transform -scale-x-100 ${
                  cameraActive ? 'block' : 'hidden'
                }`}
              />

              {!cameraActive && (
                <div className="p-6 text-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto text-amber-400">
                    <Camera className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {cameraError ? 'Camera Unavailable' : 'Starting Camera...'}
                    </h4>
                    <p className="text-xs text-neutral-400 mt-1 max-w-xs leading-relaxed">
                      {cameraError || 'Allow camera permission in your browser to take a live selfie.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleUseDemoSample}
                    className="mt-2 px-4 py-2 rounded-xl bg-[#FFB800] text-black font-bold text-xs shadow-sm hover:bg-amber-400 transition-colors"
                  >
                    Use Sample Photo Instead
                  </button>
                </div>
              )}

              {/* Sci-Fi Biometric Face Mesh Reticle Overlay */}
              {cameraActive && (
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-between p-6">
                  <div className="bg-black/60 backdrop-blur-xs px-3 py-1 rounded-full border border-neutral-700 font-mono text-[10px] text-emerald-400 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>LIVENESS TRACKER: ALIGN FACE IN OVAL</span>
                  </div>

                  <div className="relative w-52 h-64 rounded-[50%] border-2 border-dashed border-[#FFB800]/80 shadow-[0_0_20px_rgba(255,184,0,0.25)] flex items-center justify-center">
                    <div className="absolute -top-3 w-6 h-0.5 bg-[#FFB800]" />
                    <div className="absolute -bottom-3 w-6 h-0.5 bg-[#FFB800]" />
                    <div className="absolute -left-3 h-6 w-0.5 bg-[#FFB800]" />
                    <div className="absolute -right-3 h-6 w-0.5 bg-[#FFB800]" />
                    <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#FFB800] to-transparent animate-scanline" />
                  </div>

                  <div className="bg-black/60 backdrop-blur-xs px-3 py-1 rounded-full border border-neutral-700 font-mono text-[10px] text-neutral-300">
                    Hold still &bull; Match against enrolled biometric profiles
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="p-4 bg-neutral-900 border-t border-neutral-800 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleUseDemoSample}
                className="text-[11px] font-mono text-neutral-400 hover:text-white underline"
              >
                Use Demo Photo
              </button>

              <button
                type="button"
                onClick={handleCaptureFrame}
                disabled={!cameraActive || isCapturing}
                className={`flex-1 py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${
                  cameraActive && !isCapturing
                    ? 'bg-neutral-950 text-[#FFB800] border-2 border-[#FFB800] hover:bg-neutral-900 active:scale-98'
                    : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                }`}
              >
                <Camera className="w-4 h-4 text-[#FFB800]" />
                <span>{isCapturing ? 'MATCHING FACIAL VECTORS...' : 'CAPTURE PHOTO & MATCH FACE'}</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Biometric Face Recognition Result & Candidate Matcher */}
        {step === 'matched' && (
          <div className="p-5 space-y-4 animate-in fade-in duration-200">
            {/* Captured Photo + Recognition Badge */}
            <div className="flex items-center gap-4 p-3.5 bg-neutral-900 rounded-2xl border border-neutral-800">
              <div className="relative w-18 h-18 rounded-2xl overflow-hidden bg-neutral-800 border-2 border-[#FFB800] shrink-0 shadow-md">
                {capturedPhotoUrl && (
                  <img src={capturedPhotoUrl} alt="Captured" className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-mono text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800 inline-block mb-1">
                  ✓ FACE VECTOR MATCHED: 98.8%
                </span>
                <h4 className="text-sm font-bold text-white truncate">
                  Aadhaar Biometric Attested
                </h4>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Select which enrolled profile to unlock in emergency intake:
                </p>
              </div>
            </div>

            {/* Candidate List (Enrolled Face vs Demo Patients) */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase font-bold text-neutral-500 block">
                Matched ABDM Candidate Profiles:
              </span>

              {availablePatients.map((p, idx) => {
                const isSelected = matchedCandidate.id === p.id;
                const isNewlyEnrolled = p.id === lastEnrolledId || p.id.startsWith('MED-REG-');
                const isAtharv = p.id === 'MED-0777' || p.name.toLowerCase().includes('atharv');
                const matchScore = isSelected ? '98.8%' : idx === 1 ? '84.2%' : idx === 2 ? '67.5%' : '48.9%';

                return (
                  <div
                    key={p.id}
                    onClick={() => setMatchedCandidate(p)}
                    className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-[#FFB800] bg-neutral-900 shadow-md'
                        : 'border-neutral-800 hover:border-neutral-700 bg-neutral-900/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-neutral-800 shrink-0 border border-neutral-700">
                        {p.photoUrl ? (
                          <img src={p.photoUrl} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-xs text-[#FFB800]">
                            {p.name[0]}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-bold text-white">{p.name}</span>
                          {isNewlyEnrolled && (
                            <span className="text-[9px] font-mono bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded border border-amber-500/40 font-bold">
                              ★ Newly Registered ABHA
                            </span>
                          )}
                          {!isNewlyEnrolled && isAtharv && (
                            <span className="text-[9px] font-mono bg-emerald-950 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-800 font-bold">
                              Enrolled Aadhaar Face
                            </span>
                          )}
                          {p.hasBloodGroupConflict && (
                            <span className="text-[9px] font-mono bg-red-950 text-red-300 px-1.5 py-0.2 rounded border border-red-800 font-bold">
                              Conflict Demo
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-mono text-neutral-400 block mt-0.5">
                          {p.abhaId} &bull; Blood: <strong className="text-white">{p.bloodGroup}</strong> &bull; {p.age}y
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[10px] font-mono font-bold ${isSelected ? 'text-[#FFB800]' : 'text-neutral-500'}`}>
                        {matchScore}
                      </span>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-[#FFB800] bg-[#FFB800]' : 'border-neutral-700'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 text-black" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-neutral-800 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  setIsRegisterModalOpen(true);
                }}
                className="text-[11px] font-mono text-neutral-400 hover:text-white flex items-center gap-1 underline"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Register New Profile</span>
              </button>

              <button
                type="button"
                onClick={() => handleConfirmMatch(matchedCandidate)}
                className="px-5 py-2.5 rounded-2xl bg-[#FFB800] hover:bg-amber-400 text-black font-black text-xs flex items-center gap-2 shadow-md transition-all active:scale-98"
              >
                <span>Unlock {matchedCandidate.name}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
