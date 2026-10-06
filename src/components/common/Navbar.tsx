import React, { useState, useEffect } from 'react';
import {
  Activity,
  ShieldCheck,
  Wifi,
  WifiOff,
  User,
  ChevronDown,
  Layers,
  AlertTriangle,
  Radio,
  Users,
  Search,
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
    hasBreakGlassActive,
  } = useMediq();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [isScreenMenuOpen, setIsScreenMenuOpen] = useState<boolean>(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState<boolean>(false);
  const [isPatientMenuOpen, setIsPatientMenuOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }) + ' IST'
      );
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  const handlePatientSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      selectPatientByAbha(searchQuery);
      setSearchQuery('');
      setIsPatientMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200/90 text-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Mission */}
        <div className="flex items-center gap-4">
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
                  ABHA GATEWAY
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 font-mono tracking-tight mt-0.5 hidden sm:block">
                Emergency Medical Intelligence
              </p>
            </div>
          </div>

          {/* Simple plain-English 3-step workflow pill */}
          <div className="hidden lg:flex items-center text-xs font-mono text-neutral-400 pl-3 border-l border-neutral-200 gap-1.5">
            <span className="text-neutral-900 font-bold">1. IDENTIFY PATIENT</span>
            <span>→</span>
            <span className="text-neutral-900 font-bold">2. RESOLVE CONFLICTS</span>
            <span>→</span>
            <span className="text-[#FFB800] bg-neutral-900 px-2 py-0.5 rounded font-bold">
              3. SAVE LIVES
            </span>
          </div>
        </div>

        {/* Center: Screen Switcher */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsScreenMenuOpen(!isScreenMenuOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-neutral-200 bg-[#F8F9FA] hover:bg-neutral-100 text-xs font-semibold text-neutral-800 transition-colors shadow-2xs"
          >
            <Layers className="w-3.5 h-3.5 text-neutral-500" />
            <span className="hidden md:inline text-neutral-400 font-mono">
              Screen {SCREENS.find((s) => s.id === currentScreen)?.num}:
            </span>
            <span className="font-bold text-neutral-900 truncate max-w-[150px] sm:max-w-none">
              {SCREENS.find((s) => s.id === currentScreen)?.label}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400 ml-0.5" />
          </button>

          {isScreenMenuOpen && (
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-80 bg-white rounded-2xl shadow-2xl border border-neutral-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
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

        {/* Right Controls: Patient Switcher, Insurance Shield, Connection, Role */}
        <div className="flex items-center gap-2.5">
          {/* Patient Switcher Dropdown */}
          <div className="relative hidden md:block">
            <button
              type="button"
              onClick={() => setIsPatientMenuOpen(!isPatientMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-xs font-semibold text-neutral-800 transition-colors"
            >
              <Users className="w-3.5 h-3.5 text-neutral-500" />
              <span className="text-neutral-400 font-normal">Patient:</span>
              <span className="font-bold text-neutral-900">{currentPatient.name.split(' ')[0]}</span>
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

                {/* Search Bar inside dropdown */}
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
              </div>
            )}
          </div>

          {/* Insurance Privacy Shield Button */}
          <button
            type="button"
            onClick={() => setIsInsuranceModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 transition-colors text-xs font-semibold"
            title="Click to view why your past medical history is shielded from insurance companies"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline font-bold">Insurance Shield:</span>
            <span className="text-[11px] font-mono font-bold text-emerald-700">Protected</span>
          </button>

          {/* Offline / Online Connection Toggle */}
          <button
            type="button"
            onClick={() => {
              setIsOffline(!isOffline);
              if (!isOffline) setCurrentScreen('offline-mode');
            }}
            title="Toggle between Online ABDM Gateway and Ambulance Offline Cache"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono border transition-all ${
              isOffline
                ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}
          >
            {isOffline ? (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-700" />
                <span className="hidden sm:inline">OFFLINE</span>
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">ONLINE</span>
              </>
            )}
          </button>

          {/* Role selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-xs font-medium text-neutral-800 transition-colors"
            >
              <User className="w-3.5 h-3.5 text-neutral-500" />
              <span className="capitalize hidden sm:inline">{userRole.replace('-', ' ')}</span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            {isRoleMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-neutral-200 py-1.5 z-50 text-xs">
                <div className="px-3 py-1 text-[10px] font-mono text-neutral-400 font-bold border-b border-neutral-100 uppercase">
                  Select User Role
                </div>
                {(['doctor', 'ambulance-ems', 'first-responder', 'hospital-admin'] as UserRole[]).map(
                  (role) => (
                    <button
                      key={role}
                      onClick={() => {
                        setUserRole(role);
                        setIsRoleMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 capitalize hover:bg-neutral-100 transition-colors ${
                        userRole === role ? 'font-bold text-amber-600 bg-amber-50/50' : 'text-neutral-700'
                      }`}
                    >
                      {role.replace('-', ' ')}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
