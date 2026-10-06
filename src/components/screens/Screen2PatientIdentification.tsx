import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Scan,
  CheckCircle,
  Clock,
  Sparkles,
  RefreshCw,
  Eye,
  ShieldCheck,
  ChevronRight,
  User,
  Fingerprint,
  CreditCard,
  Building2,
  Video,
  VideoOff,
  Crosshair,
} from 'lucide-react';
import { useMediq } from '../../context/MediqContext';

export const Screen2PatientIdentification: React.FC = () => {
  const {
    candidates,
    currentPatient,
    setCurrentScreen,
    confirmIdentity,
    capturedPhotoUrl,
    setCapturedPhotoUrl,
    useLiveCamera,
    setUseLiveCamera,
  } = useMediq();

  const [isScanningActive, setIsScanningActive] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isLiveActive, setIsLiveActive] = useState(useLiveCamera);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Setup / teardown live webcam
  useEffect(() => {
    if (isLiveActive && !capturedPhotoUrl) {
      navigator.mediaDevices
        ?.getUserMedia({ video: { width: 400, height: 450, facingMode: 'user' } })
        .then((stream) => {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
          setCameraError(null);
        })
        .catch((err) => {
          console.warn('Webcam access error:', err);
          setCameraError('Webcam permission denied or unavailable. Showing simulated vector scanner.');
          setIsLiveActive(false);
          setUseLiveCamera(false);
        });
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [isLiveActive, capturedPhotoUrl]);

  const handleCaptureSnapshot = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 320;
      canvas.height = videoRef.current.videoHeight || 360;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setCapturedPhotoUrl(dataUrl);
        // Stop the live stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((t) => t.stop());
        }
      }
    }
  };

  const handleRetake = () => {
    setCapturedPhotoUrl(null);
    setIsLiveActive(true);
    setUseLiveCamera(true);
  };

  const handleVerifyCandidate = (candidateId: string) => {
    confirmIdentity();
    setCurrentScreen('identity-verification');
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-wider text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Screen 02 &bull; Multimodal Intake
            </span>
            <span className="text-[11px] font-mono text-neutral-400">
              ABHA Identity Matcher
            </span>
          </div>
          <h2 className="text-2xl font-black text-neutral-950 tracking-tight mt-1">
            Patient Biometric &amp; ID Card Identification
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Face and document matching cross-referenced with national ABHA / hospital registries.
          </p>
        </div>

        {/* Live Webcam Toggle Button for Hackathon Judges */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const next = !isLiveActive;
              setIsLiveActive(next);
              setUseLiveCamera(next);
              if (!next) setCapturedPhotoUrl(null);
            }}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
              isLiveActive
                ? 'bg-amber-50 text-amber-950 border-amber-300 font-bold ring-2 ring-amber-400'
                : 'bg-white hover:bg-neutral-50 text-neutral-800 border-neutral-300'
            }`}
          >
            {isLiveActive ? <Video className="w-3.5 h-3.5 text-amber-600" /> : <Camera className="w-3.5 h-3.5 text-neutral-500" />}
            <span>{isLiveActive ? '📷 Live Camera ON' : '📷 Test with Your Own Face'}</span>
          </button>
        </div>
      </div>

      {cameraError && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center justify-between">
          <span>{cameraError}</span>
          <button onClick={() => setCameraError(null)} className="font-bold underline">Dismiss</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Camera & Face Mesh Viewfinder (6 cols) */}
        <div className="lg:col-span-6 bg-neutral-950 text-white rounded-2xl p-6 border border-neutral-800 shadow-xl relative overflow-hidden flex flex-col justify-between">
          {/* Top Telemetry */}
          <div className="flex items-center justify-between font-mono text-[11px] text-neutral-400 border-b border-neutral-800 pb-3 z-10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span className="text-white font-bold">
                {isLiveActive ? 'LIVE WEBCAM STREAM' : 'SIMULATED RIG_CAM_01'}
              </span>
              <span className="text-neutral-500">1080P @ 60FPS</span>
            </div>
            <div className="text-amber-400 font-bold">EXPOSURE: OPTIMAL</div>
          </div>

          {/* Viewfinder Target */}
          <div className="relative my-6 py-4 flex flex-col items-center justify-center">
            <div className="relative w-64 h-72 rounded-2xl border-2 border-neutral-700 bg-neutral-900/90 flex items-center justify-center overflow-hidden shadow-2xl">
              {/* Corner brackets */}
              <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-[#FFB800] z-20" />
              <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-[#FFB800] z-20" />
              <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-[#FFB800] z-20" />
              <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-[#FFB800] z-20" />

              {/* Scanline */}
              {isScanningActive && <div className="animate-scanline z-20" />}

              {/* Case 1: Captured Photo */}
              {capturedPhotoUrl || currentPatient.photoUrl ? (
                <div className="relative w-full h-full">
                  <img
                    src={capturedPhotoUrl || currentPatient.photoUrl}
                    alt="Captured patient face"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-[#FFB800]/10 flex items-center justify-center pointer-events-none">
                    <Crosshair className="w-16 h-16 text-[#FFB800] opacity-80" />
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 bg-black/85 p-1.5 rounded-lg text-center text-[10px] font-mono text-[#FFB800] z-20 font-bold border border-amber-500/30">
                    LIVE BIOMETRIC CAPTURED • AADHAAR e-KYC VERIFIED ✓
                  </div>
                </div>
              ) : isLiveActive ? (
                /* Case 2: Live Video Stream from real webcam */
                <div className="relative w-full h-full flex items-center justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {/* Subtle target crosshairs over live video */}
                  <div className="absolute inset-0 border border-white/20 pointer-events-none flex items-center justify-center">
                    <div className="w-36 h-48 border border-dashed border-[#FFB800]/80 rounded-2xl" />
                  </div>
                </div>
              ) : (
                /* Case 3: High-tech Vector SVG Simulation */
                <div className="relative flex flex-col items-center justify-center">
                  <svg
                    className="w-44 h-52 text-neutral-400"
                    viewBox="0 0 200 240"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 20C55 20 35 60 35 110C35 160 65 210 100 220C135 210 165 160 165 110C165 60 145 20 100 20Z"
                      stroke="#FFB800"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                      fill="rgba(255, 184, 0, 0.04)"
                    />
                    <line x1="50" y1="95" x2="150" y2="95" stroke="#FFB800" strokeWidth="0.8" opacity="0.6" />
                    <line x1="100" y1="60" x2="100" y2="150" stroke="#FFB800" strokeWidth="0.8" opacity="0.6" />
                    <line x1="75" y1="165" x2="125" y2="165" stroke="#FFB800" strokeWidth="0.8" opacity="0.6" />

                    <circle cx="75" cy="95" r="3" fill="#FFB800" />
                    <circle cx="125" cy="95" r="3" fill="#FFB800" />
                    <circle cx="100" cy="130" r="3" fill="#FFB800" />
                    <circle cx="85" cy="165" r="2.5" fill="#FFB800" />
                    <circle cx="115" cy="165" r="2.5" fill="#FFB800" />
                    <circle cx="100" cy="195" r="2.5" fill="#FFB800" />

                    <polygon
                      points="75,95 125,95 100,130"
                      stroke="rgba(255,184,0,0.4)"
                      strokeWidth="0.7"
                      fill="rgba(255,184,0,0.06)"
                    />
                  </svg>

                  <div className="absolute bottom-2 bg-black/80 px-2.5 py-1 rounded-md border border-[#FFB800]/50 text-[10px] font-mono text-[#FFB800] tracking-wider">
                    FACE MATCH: 94.2%
                  </div>
                </div>
              )}
            </div>

            {/* Live Camera Snap Controls */}
            {isLiveActive && !capturedPhotoUrl && (
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCaptureSnapshot}
                  className="px-4 py-2 rounded-xl bg-[#FFB800] hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1.5 shadow-md"
                >
                  <Camera className="w-4 h-4" />
                  <span>Take Picture of Myself / Judge</span>
                </button>
              </div>
            )}

            {capturedPhotoUrl && (
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRetake}
                  className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold"
                >
                  Retake Photo
                </button>
                <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                  ✓ Photo Bound to ABHA
                </span>
              </div>
            )}

            <div className="mt-4 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-mono text-[#FFB800]">
                <Scan className="w-3.5 h-3.5 animate-pulse" />
                <span>
                  {capturedPhotoUrl
                    ? 'Photo analyzed & matched with ABHA records'
                    : isLiveActive
                    ? 'Live webcam active: Position face in target box'
                    : 'Matching face biometrics to ABHA photo database...'}
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Diagnostics Bar */}
          <div className="bg-neutral-900/80 p-3 rounded-xl border border-neutral-800 text-[11px] font-mono grid grid-cols-3 text-center gap-2">
            <div>
              <span className="text-neutral-500 block text-[10px]">FACIAL KEYPOINTS</span>
              <span className="text-emerald-400 font-bold">68 Extracted</span>
            </div>
            <div>
              <span className="text-neutral-500 block text-[10px]">ID CARD OCR</span>
              <span className="text-blue-400 font-bold">Aadhaar Found</span>
            </div>
            <div>
              <span className="text-neutral-500 block text-[10px]">ABHA STATUS</span>
              <span className="text-[#FFB800] font-bold">Resolved ✓</span>
            </div>
          </div>
        </div>

        {/* Right Side: Candidate Matches (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-2xl border border-neutral-200/90 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs uppercase font-bold text-neutral-900 tracking-wider">
                  MATCHED CANDIDATES FROM ABHA
                </span>
                <span className="bg-amber-100 text-amber-900 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                  Top Match
                </span>
              </div>
              <span className="text-xs font-mono text-neutral-400">
                Sorted by Match Score
              </span>
            </div>

            <div className="space-y-3 mt-4">
              {/* Candidate #01 — Aarav Mehta (or custom captured) */}
              <div className="p-4 rounded-xl border-2 border-neutral-950 bg-[#F8F9FA] shadow-xs relative overflow-hidden transition-all hover:border-[#FFB800]">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {capturedPhotoUrl ? (
                      <img
                        src={capturedPhotoUrl}
                        alt="Candidate"
                        className="w-12 h-12 rounded-xl object-cover border-2 border-[#FFB800] shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-neutral-950 text-[#FFB800] flex items-center justify-center font-bold text-sm shrink-0">
                        #01
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-black text-base text-neutral-950">
                          {currentPatient.name}
                        </h3>
                        <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.2 rounded font-bold border border-emerald-200">
                          Primary Match
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono mt-1">
                        <span>DOB: <strong className="text-neutral-800">{currentPatient.dob}</strong></span>
                        <span>&bull;</span>
                        <span>Age: <strong className="text-neutral-800">{currentPatient.age}y</strong></span>
                      </div>
                      <div className="text-xs font-mono text-emerald-800 font-bold mt-1">
                        ABHA: {currentPatient.abhaId}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-mono text-neutral-500">Face Match</div>
                    <div className="text-xl font-black font-mono text-neutral-950">
                      94.2%
                    </div>
                  </div>
                </div>

                {/* Status Telemetry */}
                <div className="grid grid-cols-2 gap-2 my-3 text-xs font-mono">
                  <div className="bg-white p-2 rounded-lg border border-neutral-200/80">
                    <span className="text-neutral-400 text-[10px] block">LINKED IDENTIFIER</span>
                    <span className="font-bold text-neutral-900">{currentPatient.maskedGovId}</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-neutral-200/80">
                    <span className="text-neutral-400 text-[10px] block">HOSPITAL RECORDS</span>
                    <span className="font-bold text-neutral-900">{currentPatient.linkedHospitals.length} Linked Hospitals</span>
                  </div>
                </div>

                {/* Action CTA */}
                <div className="flex items-center justify-between pt-2 border-t border-neutral-200/60">
                  <span className="text-xs text-neutral-500">
                    Confidence exceeds 90% threshold
                  </span>
                  <button
                    type="button"
                    onClick={() => handleVerifyCandidate(currentPatient.id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-neutral-950 hover:bg-black text-[#FFB800] text-xs font-bold shadow-xs hover:shadow transition-all group"
                  >
                    <span>VERIFY &amp; PULL RECORDS</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Candidate #02 — Arjun Mehta */}
              <div className="p-4 rounded-xl border border-neutral-200 bg-white hover:border-neutral-300 transition-all opacity-80">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-600 flex items-center justify-center font-bold text-sm shrink-0">
                      #02
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-neutral-900">
                          Arjun Mehta
                        </h3>
                        <span className="text-[10px] font-mono bg-neutral-100 text-neutral-600 px-1.5 py-0.2 rounded">
                          Secondary
                        </span>
                      </div>
                      <div className="text-xs text-neutral-500 font-mono mt-0.5">
                        DOB: 02 Mar 1999 &bull; ABHA: arjun.m@abdm
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-mono text-neutral-500">Face Match</div>
                    <div className="text-lg font-bold font-mono text-neutral-700">
                      71.8%
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-neutral-100 font-mono text-neutral-500">
                  <span>Below 90% primary safety threshold</span>
                  <span className="text-neutral-400">Fingerprint: Mismatched</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
