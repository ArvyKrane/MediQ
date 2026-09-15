import React, { useState } from 'react';
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
} from 'lucide-react';
import { useMediq } from '../../context/MediqContext';

export const Screen2PatientIdentification: React.FC = () => {
  const { candidates, setCurrentScreen, confirmIdentity } = useMediq();
  const [isScanningActive, setIsScanningActive] = useState(true);

  const handleVerifyCandidate = (candidateId: string) => {
    if (candidateId === 'CAND-0192') {
      setCurrentScreen('identity-verification');
    }
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
              Vector Pipeline v3.2
            </span>
          </div>
          <h2 className="text-2xl font-black text-neutral-950 tracking-tight mt-1">
            Multimodal Patient Identification
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Real-time biometric facial triangulation cross-referenced with regional hospital registries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsScanningActive(!isScanningActive)}
            className="px-3 py-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-xs font-mono font-medium text-neutral-700 flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanningActive ? 'animate-spin' : ''}`} />
            <span>{isScanningActive ? 'Sensor Active' : 'Sensor Paused'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Camera / Face Scan Viewfinder (6 cols) */}
        <div className="lg:col-span-6 bg-neutral-950 text-white rounded-2xl p-6 border border-neutral-800 shadow-xl relative overflow-hidden flex flex-col justify-between">
          {/* Top Viewfinder Telemetry */}
          <div className="flex items-center justify-between font-mono text-[11px] text-neutral-400 border-b border-neutral-800 pb-3 z-10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span className="text-white font-bold">REC &bull; RIG_CAM_01</span>
              <span className="text-neutral-500">1080P @ 60FPS</span>
            </div>
            <div className="text-amber-400 font-bold">EXPOSURE: OPTIMAL</div>
          </div>

          {/* Camera Frame & Realistic Face Placeholder Illustration */}
          <div className="relative my-8 py-8 flex flex-col items-center justify-center">
            {/* Outer Target Box with golden corner brackets */}
            <div className="relative w-64 h-72 rounded-2xl border-2 border-neutral-700 bg-neutral-900/90 flex items-center justify-center overflow-hidden shadow-2xl">
              {/* Golden corner brackets */}
              <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-[#FFB800]" />
              <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-[#FFB800]" />
              <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-[#FFB800]" />
              <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-[#FFB800]" />

              {/* Laser Scanline */}
              {isScanningActive && <div className="animate-scanline" />}

              {/* Stylized Face Biometric Grid Placeholder */}
              <div className="relative flex flex-col items-center justify-center">
                {/* Clean SVG Head & Facial Keypoint Mesh */}
                <svg
                  className="w-44 h-52 text-neutral-400"
                  viewBox="0 0 200 240"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Head Contour */}
                  <path
                    d="M100 20C55 20 35 60 35 110C35 160 65 210 100 220C135 210 165 160 165 110C165 60 145 20 100 20Z"
                    stroke="#FFB800"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    fill="rgba(255, 184, 0, 0.04)"
                  />
                  {/* Eye Level Line */}
                  <line x1="50" y1="95" x2="150" y2="95" stroke="#FFB800" strokeWidth="0.8" opacity="0.6" />
                  {/* Nose Centerline */}
                  <line x1="100" y1="60" x2="100" y2="150" stroke="#FFB800" strokeWidth="0.8" opacity="0.6" />
                  {/* Mouth Line */}
                  <line x1="75" y1="165" x2="125" y2="165" stroke="#FFB800" strokeWidth="0.8" opacity="0.6" />

                  {/* Facial Landmark Keypoints */}
                  <circle cx="75" cy="95" r="3" fill="#FFB800" />
                  <circle cx="125" cy="95" r="3" fill="#FFB800" />
                  <circle cx="100" cy="130" r="3" fill="#FFB800" />
                  <circle cx="85" cy="165" r="2.5" fill="#FFB800" />
                  <circle cx="115" cy="165" r="2.5" fill="#FFB800" />
                  <circle cx="100" cy="195" r="2.5" fill="#FFB800" />
                  <circle cx="52" cy="115" r="2" fill="#FFB800" opacity="0.7" />
                  <circle cx="148" cy="115" r="2" fill="#FFB800" opacity="0.7" />
                  <circle cx="70" cy="55" r="2" fill="#FFB800" opacity="0.7" />
                  <circle cx="130" cy="55" r="2" fill="#FFB800" opacity="0.7" />

                  {/* Connecting biometric triangulation mesh */}
                  <polygon
                    points="75,95 125,95 100,130"
                    stroke="rgba(255,184,0,0.4)"
                    strokeWidth="0.7"
                    fill="rgba(255,184,0,0.06)"
                  />
                  <polygon
                    points="75,95 100,130 85,165"
                    stroke="rgba(255,184,0,0.3)"
                    strokeWidth="0.7"
                  />
                  <polygon
                    points="125,95 100,130 115,165"
                    stroke="rgba(255,184,0,0.3)"
                    strokeWidth="0.7"
                  />
                </svg>

                {/* Floating Tag */}
                <div className="absolute bottom-2 bg-black/80 px-2.5 py-1 rounded-md border border-[#FFB800]/50 text-[10px] font-mono text-[#FFB800] tracking-wider">
                  CONFIDENCE: 94.2%
                </div>
              </div>
            </div>

            {/* Scanning Status Text */}
            <div className="mt-4 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-mono text-[#FFB800]">
                <Scan className="w-3.5 h-3.5 animate-pulse" />
                <span>Analyzing facial features...</span>
              </div>
              <p className="text-[11px] text-neutral-400 font-mono mt-1.5">
                68 geometric landmarks extracted &bull; Distance Euclidean metric: 0.058
              </p>
            </div>
          </div>

          {/* Bottom Diagnostics Bar */}
          <div className="bg-neutral-900/80 p-3 rounded-xl border border-neutral-800 text-[11px] font-mono grid grid-cols-3 text-center gap-2">
            <div>
              <span className="text-neutral-500 block text-[10px]">OCCLUSION</span>
              <span className="text-emerald-400 font-bold">12% (Clear)</span>
            </div>
            <div>
              <span className="text-neutral-500 block text-[10px]">LIGHTING</span>
              <span className="text-emerald-400 font-bold">480 Lux (Good)</span>
            </div>
            <div>
              <span className="text-neutral-500 block text-[10px]">CANDIDATES</span>
              <span className="text-[#FFB800] font-bold">3 Extracted</span>
            </div>
          </div>
        </div>

        {/* Right Side: Candidate Matches (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-2xl border border-neutral-200/90 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs uppercase font-bold text-neutral-900 tracking-wider">
                  CANDIDATE MATCHES (RANKED)
                </span>
                <span className="bg-amber-100 text-amber-900 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                  Top 3
                </span>
              </div>
              <span className="text-xs font-mono text-neutral-400">
                Sorted by Vector Proximity
              </span>
            </div>

            <div className="space-y-3 mt-4">
              {/* Candidate #01 — Aarav Mehta */}
              <div className="p-4 rounded-xl border-2 border-neutral-950 bg-[#F8F9FA] shadow-xs relative overflow-hidden transition-all hover:border-[#FFB800]">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-neutral-950 text-[#FFB800] flex items-center justify-center font-bold text-sm shrink-0">
                      #01
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-black text-base text-neutral-950">
                          Aarav Mehta
                        </h3>
                        <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.2 rounded font-bold border border-emerald-200">
                          Primary Match
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-neutral-500 font-mono mt-1">
                        <span>DOB: <strong className="text-neutral-800">14 Aug 2005</strong></span>
                        <span>&bull;</span>
                        <span>ID: <strong className="text-neutral-800">MED-0192</strong></span>
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
                    <span className="text-neutral-400 text-[10px] block">FINGERPRINT</span>
                    <span className="font-bold text-amber-600 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Pending Secondary
                    </span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-neutral-200/80">
                    <span className="text-neutral-400 text-[10px] block">LAST REGISTRATION</span>
                    <span className="font-medium text-neutral-700 truncate">
                      Apollo Hospital (2024)
                    </span>
                  </div>
                </div>

                {/* Action CTA */}
                <div className="flex items-center justify-between pt-2 border-t border-neutral-200/60">
                  <span className="text-xs text-neutral-500">
                    Confidence exceeds 90% threshold
                  </span>
                  <button
                    type="button"
                    onClick={() => handleVerifyCandidate('CAND-0192')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-neutral-950 hover:bg-black text-[#FFB800] text-xs font-bold shadow-xs hover:shadow transition-all group"
                  >
                    <span>VERIFY IDENTITY</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Candidate #02 — Arjun Mehta */}
              <div className="p-4 rounded-xl border border-neutral-200 bg-white hover:border-neutral-300 transition-all opacity-85">
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
                        DOB: 02 Mar 1999 &bull; ID: MED-0841
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
                  <span>Below 90% primary threshold</span>
                  <span className="text-neutral-400">Fingerprint: Mismatched</span>
                </div>
              </div>

              {/* Candidate #03 — Unknown */}
              <div className="p-4 rounded-xl border border-neutral-200 bg-white hover:border-neutral-300 transition-all opacity-70">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-400 flex items-center justify-center font-bold text-sm shrink-0">
                      #03
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-neutral-800">
                        Unknown / Demographic Outlier
                      </h3>
                      <div className="text-xs text-neutral-400 font-mono mt-0.5">
                        Est. 2000-2005 &bull; No ID match
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-mono text-neutral-400">Face Match</div>
                    <div className="text-lg font-semibold font-mono text-neutral-500">
                      43.1%
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-neutral-100 font-mono text-neutral-400">
                  <span>Insufficient biometric landmarks</span>
                  <span>Rejected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
