import React, { useState } from 'react';
import {
  Activity,
  ShieldCheck,
  Wifi,
  WifiOff,
  User,
  ChevronDown,
  Layers,
  Users,
  Search,
  UserPlus,
  Compass,
  FileSpreadsheet,
  Stethoscope,
} from 'lucide-react';
import { useMediq } from '../../context/MediqContext';
import type { ScreenId, UserRole } from '../../types/mediq';

const SCREENS: { id: ScreenId; label: string; num: string }[] = [
  { id: 'emergency-landing', label: '1. Emergency Intake', num: '01' },
  { id: 'patient-identification', label: '2. Patient Identification', num: '02' },
  { id: 'identity-verification', label: '3. Identity Verification', num: '03' },
  { id: 'clinical-trust', label: '4. Medical Records & Conflict', num: '04' },
  { id: 'emergency-contact', label: '5. Emergency Contact (Private)', num: '05' },
  { id: 'patient-profile', label: '6. Verified Patient Profile', num: '06' },
  { id: 'doctor-dashboard', label: '7. Doctor / ER Dashboard', num: '07' },
  { id: 'access-control', label: '8. Access & Privacy Control', num: '08' },
  { id: 'audit-log', label: '9. Activity & Audit Trail', num: '09' },
  { id: 'offline-mode', label: '10. Offline Mode (No Internet)', num: '10' },
];

export const Navbar: React.FC = () => {
  const {
    currentScreen,
    setCurrentScreen,
    userRole,
    setUserRole,
    isOffline,
    setIsOffline,
    currentPatient,
    availablePatients,
    selectPatientByAbha,
    setIsInsuranceModalOpen,
    setIsRegisterModalOpen,
    setIsOnboardingOpen,
    currentClinician,
    setIsDoctorCardOpen,
  } = useMediq();

  const [isScreenMenuOpen, setIsScreenMenuOpen] = useState<boolean>(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState<boolean>(false);
  const [isPatientMenuOpen, setIsPatientMenuOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handlePatientSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      selectPatientByAbha(searchQuery);
      setSearchQuery('');
      setIsPatientMenuOpen(false);
    }
  };

  const isIntakeActive = currentScreen === 'emergency-landing' || currentScreen === 'patient-identification';
  const isPatientActive =
    currentScreen === 'identity-verification' ||
    currentScreen === 'clinical-trust' ||
    currentScreen === 'emergency-contact' ||
    currentScreen === 'patient-profile';
  const isErActive = currentScreen === 'doctor-dashboard' || currentScreen === 'access-control';
  const isShieldActive = currentScreen === 'audit-log' || currentScreen === 'offline-mode';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200/90 text-neutral-900 safe-top-padding">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2">
        {/* Brand & Mission */}
        <div className="flex items-center gap-3 shrink-0">
          <div
            onClick={() => setCurrentScreen('emergency-landing')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#0A0A0A] flex items-center justify-center text-[#FFB800] font-black tracking-wider text-base shadow-xs group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5 text-[#FFB800]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-black text-lg tracking-tight text-[#0A0A0A]">MEDIQ</span>
                <span className="text-[10px] font-mono bg-amber-100/90 text-amber-950 px-1.5 py-0.5 rounded font-bold border border-amber-300">
                  SAAS
                </span>
              </div>
              <p className="text-[10px] text-neutral-500 font-mono tracking-tight mt-0.5 hidden sm:block">
                Emergency Intelligence
              </p>
            </div>
          </div>
        </div>

        {/* Center: Consolidated SaaS Tabs (Desktop) */}
        <nav className="hidden md:flex items-center bg-neutral-100/90 p-1 rounded-2xl border border-neutral-200/80 font-mono text-xs">
          <button
            type="button"
            onClick={() => setCurrentScreen('emergency-landing')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
              isIntakeActive
                ? 'bg-neutral-950 text-[#FFB800] shadow-xs'
                : 'text-neutral-600 hover:text-neutral-950'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Intake</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentScreen('clinical-trust')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
              isPatientActive
                ? 'bg-neutral-950 text-[#FFB800] shadow-xs'
                : 'text-neutral-600 hover:text-neutral-950'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Patient Vault</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentScreen('doctor-dashboard')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
              isErActive
                ? 'bg-neutral-950 text-[#FFB800] shadow-xs'
                : 'text-neutral-600 hover:text-neutral-950'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>ER Bay</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentScreen('audit-log')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
              isShieldActive
                ? 'bg-neutral-950 text-[#FFB800] shadow-xs'
                : 'text-neutral-600 hover:text-neutral-950'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Shield</span>
          </button>

          {/* Legacy Screen Switcher Dropdown */}
          <div className="relative pl-1 border-l border-neutral-200">
            <button
              type="button"
              onClick={() => setIsScreenMenuOpen(!isScreenMenuOpen)}
              className="px-2 py-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 transition-colors flex items-center gap-1"
              title="Jump to all 10 granular screens"
            >
              <Layers className="w-3.5 h-3.5" />
              <ChevronDown className="w-3 h-3" />
            </button>

            {isScreenMenuOpen && (
              <div className="absolute top-full mt-2 left-0 w-72 bg-white rounded-2xl shadow-2xl border border-neutral-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 border-b border-neutral-100 flex items-center justify-between text-[11px] font-mono font-bold text-neutral-400">
                  <span>ALL 10 APP SCREENS</span>
                </div>
                <div className="max-h-96 overflow-y-auto py-1">
                  {SCREENS.map((screen) => (
                    <button
                      key={screen.id}
                      onClick={() => {
                        setCurrentScreen(screen.id);
                        setIsScreenMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 transition-colors ${
                        currentScreen === screen.id
                          ? 'bg-amber-50 text-amber-950 font-bold border-l-2 border-[#FFB800]'
                          : 'text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      <span className="font-mono text-[10px] text-neutral-400 w-4">
                        {screen.num}
                      </span>
                      <span className="truncate">{screen.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Right Controls: SaaS Onboarding Tour, Patient Switcher, Insurance, Role */}
        <div className="flex items-center gap-2">
          {/* SaaS Onboarding & Setup Tour Button */}
          <button
            type="button"
            onClick={() => setIsOnboardingOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-[#FFB800] text-xs font-bold shadow-2xs transition-colors shrink-0"
            title="Open Enterprise SaaS Onboarding & Facility Switcher"
          >
            <Compass className="w-3.5 h-3.5 text-[#FFB800]" />
            <span className="hidden sm:inline">Onboarding Tour</span>
          </button>

          {/* Citizen Sign-Up Button */}
          <button
            type="button"
            onClick={() => setIsRegisterModalOpen(true)}
            className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-50 text-amber-950 border border-amber-300 hover:bg-amber-100 transition-colors text-xs font-semibold shrink-0"
            title="Create an ABHA ID with live face selfie e-KYC"
          >
            <UserPlus className="w-3.5 h-3.5 text-amber-600" />
            <span className="font-bold">Citizen Portal</span>
          </button>

          {/* Patient Switcher Dropdown */}
          <div className="relative hidden sm:block">
            <button
              type="button"
              onClick={() => setIsPatientMenuOpen(!isPatientMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-xs font-semibold text-neutral-800 transition-colors shrink-0"
            >
              <Users className="w-3.5 h-3.5 text-neutral-500" />
              <span className="text-neutral-400 font-normal">Patient:</span>
              <span className="font-bold text-neutral-900 truncate max-w-[80px]">
                {currentPatient.name.split(' ')[0]}
              </span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            {isPatientMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-neutral-200 p-2 z-50 text-xs">
                <div className="px-2 py-1 text-[10px] font-mono text-neutral-400 font-bold uppercase border-b border-neutral-100">
                  Switch Demo Patient Profile
                </div>
                <div className="py-1 space-y-1">
                  {availablePatients.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        selectPatientByAbha(p.id);
                        setIsPatientMenuOpen(false);
                      }}
                      className={`w-full text-left p-2 rounded-xl transition-colors ${
                        currentPatient.id === p.id
                          ? 'bg-amber-50 text-amber-950 font-bold border border-amber-200'
                          : 'hover:bg-neutral-50 text-neutral-700'
                      }`}
                    >
                      <div className="font-bold">{p.name} ({p.age}y)</div>
                      <div className="text-[11px] font-mono text-neutral-500">{p.abhaId}</div>
                      <div className="text-[10px] text-neutral-400 mt-0.5">
                        {p.hasBloodGroupConflict ? '⚠️ Blood Group Conflict' : '✓ Normal ABHA Profile'}
                      </div>
                    </button>
                  ))}
                </div>

                <form onSubmit={handlePatientSearch} className="mt-1 pt-2 border-t border-neutral-100 flex gap-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter ABHA ID or name..."
                    className="flex-1 text-[11px] px-2 py-1 border border-neutral-200 rounded-lg focus:outline-none focus:border-amber-400 font-mono"
                  />
                  <button
                    type="submit"
                    className="p-1 rounded-lg bg-neutral-900 text-white hover:bg-black"
                  >
                    <Search className="w-3.5 h-3.5" />
                  </button>
                </form>

                <button
                  type="button"
                  onClick={() => {
                    setIsPatientMenuOpen(false);
                    setIsRegisterModalOpen(true);
                  }}
                  className="mt-2 w-full py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <UserPlus className="w-3.5 h-3.5 text-amber-600" />
                  <span>+ Register New Citizen / ABHA</span>
                </button>
              </div>
            )}
          </div>

          {/* Insurance Privacy Shield Button (Desktop, mobile uses Bottom Bar) */}
          <button
            type="button"
            onClick={() => setIsInsuranceModalOpen(true)}
            className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 transition-colors text-xs font-semibold shrink-0"
            title="Click to view why your past medical history is shielded from insurance companies"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="text-[11px] font-bold">Shield</span>
          </button>

          {/* Offline / Online Connection Toggle */}
          <button
            type="button"
            onClick={() => {
              setIsOffline(!isOffline);
              if (!isOffline) setCurrentScreen('offline-mode');
            }}
            title="Toggle between Online ABDM Gateway and Ambulance Offline Cache"
            className={`flex items-center gap-1 px-2 py-1.5 rounded-xl text-xs font-mono border transition-all shrink-0 ${
              isOffline
                ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}
          >
            {isOffline ? (
              <WifiOff className="w-3.5 h-3.5 text-amber-700" />
            ) : (
              <Wifi className="w-3.5 h-3.5 text-emerald-600" />
            )}
          </button>

          {/* Official Doctor / Clinician Profile Badge (NMC & ABDM HPR) */}
          <button
            type="button"
            onClick={() => setIsDoctorCardOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-50 text-xs font-medium text-neutral-900 transition-colors shrink-0 shadow-2xs group"
            title="Click to view official Indian NMC & ABDM HPR Doctor ID Card"
          >
            <div className="w-6 h-6 rounded-lg bg-[#FFB800] text-black flex items-center justify-center font-bold text-xs shrink-0 group-hover:scale-105 transition-transform">
              <Stethoscope className="w-3.5 h-3.5" />
            </div>
            <div className="text-left leading-tight hidden lg:block">
              <span className="font-bold text-neutral-950 block truncate max-w-[120px]">
                {currentClinician.name}
              </span>
              <span className="text-[10px] font-mono text-emerald-800 font-bold block truncate max-w-[120px]">
                {currentClinician.nmcRegistrationNumber}
              </span>
            </div>
            <span className="text-[10px] font-mono bg-neutral-100 text-neutral-700 px-1.5 py-0.5 rounded font-bold lg:hidden">
              DOC ID
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
