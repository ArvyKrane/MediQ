import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw, Check, Sparkles, AlertCircle } from 'lucide-react';
import { playScanSweepSound, playSuccessChime } from '../../utils/audioEffects';

interface LiveFaceCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (photoDataUrl: string) => void;
}

export const LiveFaceCaptureModal: React.FC<LiveFaceCaptureModalProps> = ({
  isOpen,
  onClose,
  onCapture,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  // Start webcam when modal opens
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
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
        // Draw frame with slight mirror correction
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
        playSuccessChime();

        setTimeout(() => {
          stopCamera();
          onCapture(dataUrl);
          setIsCapturing(false);
          onClose();
        }, 500);
      }
    } catch (err) {
      console.error('Frame capture error:', err);
      setIsCapturing(false);
    }
  };

  const handleUseDemoSample = () => {
    playSuccessChime();
    stopCamera();
    onCapture(
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'
    );
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
              ABHA Live FaceRD Scanner
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

        {/* Video Viewfinder Area */}
        <div className="relative w-full aspect-4/3 bg-black flex items-center justify-center overflow-hidden">
          {/* Active Video Stream */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover transform -scale-x-100 ${
              cameraActive ? 'block' : 'hidden'
            }`}
          />

          {/* Fallback / Error State */}
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
                Use Verified Patient Photo Instead
              </button>
            </div>
          )}

          {/* Sci-Fi Biometric Face Mesh Reticle Overlay */}
          {cameraActive && (
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-between p-6">
              {/* Top status */}
              <div className="bg-black/60 backdrop-blur-xs px-3 py-1 rounded-full border border-neutral-700 font-mono text-[10px] text-emerald-400 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>LIVENESS TRACKER: ALIGN FACE IN OVAL</span>
              </div>

              {/* Center Face Oval Brackets */}
              <div className="relative w-52 h-64 rounded-[50%] border-2 border-dashed border-[#FFB800]/80 shadow-[0_0_20px_rgba(255,184,0,0.25)] flex items-center justify-center">
                {/* Horizontal & Vertical Crosshair ticks */}
                <div className="absolute -top-3 w-6 h-0.5 bg-[#FFB800]" />
                <div className="absolute -bottom-3 w-6 h-0.5 bg-[#FFB800]" />
                <div className="absolute -left-3 h-6 w-0.5 bg-[#FFB800]" />
                <div className="absolute -right-3 h-6 w-0.5 bg-[#FFB800]" />

                {/* Laser scan bar */}
                <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#FFB800] to-transparent animate-scanline" />
              </div>

              {/* Bottom Instructions */}
              <div className="bg-black/60 backdrop-blur-xs px-3 py-1 rounded-full border border-neutral-700 font-mono text-[10px] text-neutral-300">
                Hold still for UIDAI e-KYC matching
              </div>
            </div>
          )}
        </div>

        {/* Action Controls */}
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
            <span>{isCapturing ? 'MATCHING ABHA...' : 'CAPTURE PHOTO & MATCH ABHA'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
