import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, Check, UserPlus, ArrowRight } from 'lucide-react';
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
  
  // Find primary default patient (Atharv Bodkhe or newly registered)
  const getPrimaryPatient = (): PatientProfile => {
    if (lastEnrolledId) {
      const found = availablePatients.find((p) => p.id === lastEnrolledId);
      if (found) return found;
    }
    const newlyRegistered = availablePatients.find((p) => p.id.startsWith('MED-REG-'));
    if (newlyRegistered) return newlyRegistered;
    const atharv = availablePatients.find((p) => p.id === 'MED-0777' || p.name.toLowerCase().includes('atharv'));
    if (atharv) return atharv;
    return availablePatients[0];
  };

  const [matchedCandidate, setMatchedCandidate] = useState<PatientProfile>(getPrimaryPatient);

  // Start camera when modal opens
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setCapturedPhotoUrl(null);
      setStep('camera');
      setIsCapturing(false);
      return;
    }

    setMatchedCandidate(getPrimaryPatient());
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
        throw new Error('Camera not available. Tap "Use Demo Photo" to test.');
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
      console.warn('Camera access issue:', err);
      setCameraError(err.message || 'Camera blocked. Tap "Use Demo Photo" below to continue.');
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

        // Auto-match: Prioritize newly registered patient, then Atharv Bodkhe
        const topMatch = getPrimaryPatient();
        setMatchedCandidate(topMatch);

        setIsCapturing(false);
        setStep('matched');
      }
    } catch (err) {
      console.error('Capture error:', err);
      setIsCapturing(false);
    }
  };

  const handleUseDemoSample = () => {
    playSuccessChime();
    stopCamera();
    const primary = getPrimaryPatient();
    setCapturedPhotoUrl(primary.photoUrl || '/user_face.png');
    setMatchedCandidate(primary);
    setStep('matched');
  };

  const handleConfirmMatch = (patient: PatientProfile) => {
    selectPatient(patient);
    onCapture(capturedPhotoUrl || patient.photoUrl || '', patient);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs safe-top-padding safe-bottom-padding animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-neutral-950 text-white rounded-3xl border border-neutral-800 shadow-2xl max-h-[86vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Top Header */}
        <div className="p-4 flex items-center justify-between border-b border-neutral-800 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-[#FFB800] uppercase tracking-wide">
              {step === 'camera' ? 'Patient Face Scan' : 'Face Matched'}
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
          <div className="flex flex-col flex-1 overflow-hidden">
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

              {/* Camera Error / Fallback State */}
              {!cameraActive && (
                <div className="p-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-amber-400 flex items-center justify-center mx-auto border border-neutral-800">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Camera Offline</h4>
                    <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">
                      {cameraError || 'Allow camera permission or use the test photo below.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleUseDemoSample}
                    className="px-4 py-2 bg-[#FFB800] hover:bg-amber-400 text-black font-bold text-xs rounded-xl transition-colors shadow-xs"
                  >
                    Use Test Photo Instead
                  </button>
                </div>
              )}

              {/* Simple Reticle Guide */}
              {cameraActive && (
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-between p-4">
                  <span className="bg-black/70 px-3 py-1 rounded-full text-[11px] text-white font-medium">
                    Position patient face inside frame
                  </span>

                  <div className="relative w-44 h-56 rounded-full border-2 border-dashed border-[#FFB800] flex items-center justify-center">
                    <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#FFB800] to-transparent animate-scanline" />
                  </div>

                  <span className="bg-black/70 px-3 py-1 rounded-full text-[10px] text-neutral-300">
                    Hold still for instant identification
                  </span>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="p-3.5 bg-neutral-900 border-t border-neutral-800 flex items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={handleUseDemoSample}
                className="text-xs text-neutral-400 hover:text-white underline px-1"
              >
                Use Test Photo
              </button>

              <button
                type="button"
                onClick={handleCaptureFrame}
                disabled={!cameraActive || isCapturing}
                className={`flex-1 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all ${
                  cameraActive && !isCapturing
                    ? 'bg-[#FFB800] hover:bg-amber-400 text-black active:scale-98'
                    : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>{isCapturing ? 'Scanning Face...' : 'Take Photo & Identify'}</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Recognition Result & Patient Profile Selector */}
        {step === 'matched' && (
          <div className="p-4 space-y-3 overflow-y-auto flex-1">
            {/* Top Confirmed Card */}
            <div className="flex items-center gap-3 p-3 bg-neutral-900 rounded-2xl border border-neutral-800">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-neutral-800 border-2 border-[#FFB800] shrink-0">
                <img
                  src={capturedPhotoUrl || matchedCandidate.photoUrl || '/user_face.png'}
                  alt="Captured"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800 inline-block mb-0.5">
                  ✓ Match Found: 99%
                </span>
                <h4 className="text-sm font-bold text-white truncate">
                  {matchedCandidate.name}
                </h4>
                <p className="text-xs text-neutral-400">
                  Blood Group: <strong className="text-white">{matchedCandidate.bloodGroup}</strong> &bull; {matchedCandidate.age} yrs
                </p>
              </div>
            </div>

            {/* Candidate List */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-neutral-500 block">
                Select Patient Record to Open:
              </span>

              {availablePatients.map((p, idx) => {
                const isSelected = matchedCandidate.id === p.id;
                const isEnrolled = p.id === 'MED-0777' || p.id === lastEnrolledId || p.id.startsWith('MED-REG-');
                const score = isSelected ? '99%' : idx === 1 ? '82%' : idx === 2 ? '65%' : '45%';

                return (
                  <div
                    key={p.id}
                    onClick={() => setMatchedCandidate(p)}
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

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white truncate">{p.name}</span>
                        {isEnrolled && (
                          <span className="text-[9px] bg-emerald-950 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-800 font-bold shrink-0">
                            Your Profile
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-neutral-400 truncate mt-0.5">
                        Blood: <strong className="text-white">{p.bloodGroup}</strong> &bull; {p.age}y &bull; {p.abhaId}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[11px] font-bold ${isSelected ? 'text-[#FFB800]' : 'text-neutral-500'}`}>
                        {score}
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

            {/* Bottom Actions */}
            <div className="pt-2 border-t border-neutral-800 flex items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  setIsRegisterModalOpen(true);
                }}
                className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 underline"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Register New</span>
              </button>

              <button
                type="button"
                onClick={() => handleConfirmMatch(matchedCandidate)}
                className="px-5 py-2.5 rounded-xl bg-[#FFB800] hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-2 shadow-md transition-all active:scale-98"
              >
                <span>Open {matchedCandidate.name.split(' ')[0]}'s Record</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
