import React, { useState, useEffect } from 'react';
import { Play, Pause, ChevronRight, ChevronLeft, Sparkles, Compass } from 'lucide-react';
import { useMediq } from '../../context/MediqContext';
import type { ScreenId } from '../../types/mediq';

interface StepMeta {
  id: ScreenId;
  title: string;
  badge: string;
}

const TOUR_STEPS: StepMeta[] = [
  { id: 'emergency-landing', title: '1. Emergency Intake', badge: 'Unconscious Patient' },
  { id: 'patient-identification', title: '2. Biometric & ID Scan', badge: 'Face, Finger, ID Card' },
  { id: 'identity-verification', title: '3. ABHA Identity Found', badge: 'Aarav Mehta (94% Match)' },
  { id: 'clinical-trust', title: '4. Medical Conflict Alert', badge: 'B+ vs O+ Blood Warning' },
  { id: 'emergency-contact', title: '5. Private Family Call', badge: 'Encrypted Proxy Call' },
  { id: 'patient-profile', title: '6. Verified Health Profile', badge: 'Life-Saving Facts' },
  { id: 'doctor-dashboard', title: '7. Doctor ER Dashboard', badge: 'Fast Trauma Actions' },
  { id: 'access-control', title: '8. Insurance Privacy Shield', badge: 'Past History Protected' },
  { id: 'audit-log', title: '9. Activity Audit Trail', badge: 'Tamper-Proof Log' },
  { id: 'offline-mode', title: '10. Offline Ambulance Mode', badge: 'Works Without Internet' },
];

export const DemoTourBar: React.FC = () => {
  const { currentScreen, setCurrentScreen } = useMediq();
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  const currentIndex = TOUR_STEPS.findIndex((s) => s.id === currentScreen);
  const safeIndex = currentIndex === -1 ? 0 : currentIndex;

  useEffect(() => {
    let timer: any;
    if (isAutoPlaying) {
      timer = setInterval(() => {
        const next = (safeIndex + 1) % TOUR_STEPS.length;
        setCurrentScreen(TOUR_STEPS[next].id);
      }, 7000); // 7s per slide in auto mode
    }
    return () => clearInterval(timer);
  }, [isAutoPlaying, safeIndex, setCurrentScreen]);

  const handlePrev = () => {
    const prev = (safeIndex - 1 + TOUR_STEPS.length) % TOUR_STEPS.length;
    setCurrentScreen(TOUR_STEPS[prev].id);
  };

  const handleNext = () => {
    const next = (safeIndex + 1) % TOUR_STEPS.length;
    setCurrentScreen(TOUR_STEPS[next].id);
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-4xl w-[94%] bg-neutral-950/90 text-white backdrop-blur-md rounded-2xl p-2.5 border border-neutral-800 shadow-2xl">
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 px-2">
        {/* Left: Mission Pill & Step Counter */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-md bg-[#FFB800] text-black font-extrabold text-xs">
              <Compass className="w-3.5 h-3.5" />
            </span>
            <div>
              <div className="text-[10px] font-mono uppercase text-[#FFB800] tracking-wider font-bold">
                2-MIN DEMO JOURNEY
              </div>
              <div className="text-xs font-bold text-neutral-200">
                Step {safeIndex + 1} of {TOUR_STEPS.length}: {TOUR_STEPS[safeIndex].title}
              </div>
            </div>
          </div>

          <span className="text-[10px] font-mono bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded border border-neutral-700">
            {TOUR_STEPS[safeIndex].badge}
          </span>
        </div>

        {/* Center: Mini Step Dots */}
        <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto py-1">
          {TOUR_STEPS.map((step, idx) => (
            <button
              key={step.id}
              onClick={() => setCurrentScreen(step.id)}
              title={step.title}
              className={`h-2 rounded-full transition-all ${
                safeIndex === idx
                  ? 'w-7 bg-[#FFB800]'
                  : 'w-2 bg-neutral-700 hover:bg-neutral-500'
              }`}
            />
          ))}
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all ${
              isAutoPlaying
                ? 'bg-[#FFB800] text-black font-bold'
                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
            }`}
          >
            {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isAutoPlaying ? 'Pause Auto' : 'Auto Play'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrev}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
            title="Previous Step"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white hover:bg-neutral-200 text-black font-bold text-xs transition-colors shadow-xs"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
