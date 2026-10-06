import React from 'react';
import {
  Activity,
  FileSpreadsheet,
  Stethoscope,
  ShieldCheck,
  UserPlus,
  AlertTriangle,
} from 'lucide-react';
import { useMediq } from '../../context/MediqContext';
import type { ScreenId } from '../../types/mediq';

export const BottomNavigationBar: React.FC = () => {
  const {
    currentScreen,
    setCurrentScreen,
    currentPatient,
    isConflictResolved,
    identityStatus,
    setIsRegisterModalOpen,
  } = useMediq();

  const isIdentified = identityStatus === 'VERIFIED' || identityStatus === 'MATCHED';

  // Determine active tab
  const getActiveTab = (): 'intake' | 'patient' | 'er' | 'compliance' => {
    if (currentScreen === 'emergency-landing' || currentScreen === 'patient-identification') {
      return 'intake';
    }
    if (
      currentScreen === 'identity-verification' ||
      currentScreen === 'clinical-trust' ||
      currentScreen === 'emergency-contact' ||
      currentScreen === 'patient-profile'
    ) {
      return 'patient';
    }
    if (currentScreen === 'doctor-dashboard' || currentScreen === 'access-control') {
      return 'er';
    }
    return 'compliance';
  };

  const activeTab = getActiveTab();

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200/90 shadow-lg md:hidden safe-bottom-padding"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 4px)' }}
    >
      <div className="grid grid-cols-5 h-15 max-w-md mx-auto px-1">
        {/* 1. Intake */}
        <button
          type="button"
          onClick={() => setCurrentScreen('emergency-landing')}
          className={`flex flex-col items-center justify-center gap-1 transition-colors ${
            activeTab === 'intake' ? 'text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-600'
          }`}
        >
          <div className={`p-1 rounded-xl ${activeTab === 'intake' ? 'bg-[#FFB800] text-black' : ''}`}>
            <Activity className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight">Intake</span>
        </button>

        {/* 2. Patient Record & Conflict */}
        <button
          type="button"
          onClick={() => setCurrentScreen('clinical-trust')}
          className={`flex flex-col items-center justify-center gap-1 relative transition-colors ${
            activeTab === 'patient' ? 'text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-600'
          }`}
        >
          <div className={`p-1 rounded-xl ${activeTab === 'patient' ? 'bg-[#FFB800] text-black' : ''}`}>
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight">Patient</span>
          {isIdentified && currentPatient.hasBloodGroupConflict && !isConflictResolved && (
            <span className="absolute top-1 right-3 w-2 h-2 bg-red-500 rounded-full animate-ping" />
          )}
        </button>

        {/* 3. ER Command */}
        <button
          type="button"
          onClick={() => setCurrentScreen('doctor-dashboard')}
          className={`flex flex-col items-center justify-center gap-1 transition-colors ${
            activeTab === 'er' ? 'text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-600'
          }`}
        >
          <div className={`p-1 rounded-xl ${activeTab === 'er' ? 'bg-[#FFB800] text-black' : ''}`}>
            <Stethoscope className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight">ER Bay</span>
        </button>

        {/* 4. Compliance & Offline */}
        <button
          type="button"
          onClick={() => setCurrentScreen('audit-log')}
          className={`flex flex-col items-center justify-center gap-1 transition-colors ${
            activeTab === 'compliance' ? 'text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-600'
          }`}
        >
          <div className={`p-1 rounded-xl ${activeTab === 'compliance' ? 'bg-[#FFB800] text-black' : ''}`}>
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight">Shield</span>
        </button>

        {/* 5. Citizen Signup */}
        <button
          type="button"
          onClick={() => setIsRegisterModalOpen(true)}
          className="flex flex-col items-center justify-center gap-1 text-neutral-400 hover:text-neutral-900 transition-colors"
        >
          <div className="p-1 rounded-xl bg-neutral-100 text-neutral-700">
            <UserPlus className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight">ABHA Sign</span>
        </button>
      </div>
    </nav>
  );
};
