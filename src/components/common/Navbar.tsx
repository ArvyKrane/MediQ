import React, { useState, useEffect } from 'react';
import {
  Activity,
  Shield,
  Wifi,
  WifiOff,
  User,
  ChevronDown,
  Layers,
  AlertTriangle,
  Radio,
} from 'lucide-react';
import { useMediq } from '../../context/MediqContext';
import type { ScreenId, UserRole } from '../../types/mediq';

const SCREENS: { id: ScreenId; label: string; num: string }[] = [
  { id: 'emergency-landing', label: 'Emergency Mode / Intake', num: '01' },
  { id: 'patient-identification', label: 'Patient Identification', num: '02' },
  { id: 'identity-verification', label: 'Identity Verification', num: '03' },
  { id: 'clinical-trust', label: 'Clinical Trust / Medical History', num: '04' },
  { id: 'emergency-contact', label: 'Emergency Contact (Private)', num: '05' },
  { id: 'patient-profile', label: 'Trusted Patient Profile', num: '06' },
  { id: 'doctor-dashboard', label: 'Doctor / Hospital Dashboard', num: '07' },
  { id: 'access-control', label: 'Access Control (Who Can See)', num: '08' },
  { id: 'audit-log', label: 'Audit Trail & Compliance', num: '09' },
  { id: 'offline-mode', label: 'Offline Emergency Mode', num: '10' },
];

export const Navbar: React.FC = () => {
  const {
    currentScreen,
    setCurrentScreen,
    userRole,
    setUserRole,
    isOffline,
    setIsOffline,
    identityStatus,
    hasBreakGlassActive,
  } = useMediq();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [isScreenMenuOpen, setIsScreenMenuOpen] = useState<boolean>(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState<boolean>(false);

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

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200/90 text-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Concept pill */}
        <div className="flex items-center gap-4">
          <div
            onClick={() => setCurrentScreen('emergency-landing')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#0A0A0A] flex items-center justify-center text-[#FFB800] font-black tracking-wider text-sm shadow-xs group-hover:scale-105 transition-transform">
              <Activity className="w-4 h-4 text-[#FFB800]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-extrabold text-base tracking-tight text-[#0A0A0A]">MEDIQ</span>
                <span className="text-[10px] font-mono bg-amber-100/90 text-amber-900 px-1.5 py-0.5 rounded font-bold border border-amber-300">
                  TRUST ENGINE
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 font-mono tracking-tight mt-0.5 hidden sm:block">
                Emergency Medical Intelligence
              </p>
            </div>
          </div>

          <div className="hidden lg:flex items-center text-[11px] font-mono text-neutral-400 pl-3 border-l border-neutral-200 gap-1.5">
            <span className="text-neutral-900 font-bold">IDENTIFY</span>
            <span>→</span>
            <span className="text-neutral-900 font-bold">VERIFY</span>
            <span>→</span>
            <span className="text-[#FFB800] bg-neutral-900 px-1.5 py-0.5 rounded font-bold">
              INTELLIGENTLY RETRIEVE
            </span>
          </div>
        </div>

        {/* Center / Navigation dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsScreenMenuOpen(!isScreenMenuOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-200 bg-[#F8F9FA] hover:bg-neutral-100 text-xs font-semibold text-neutral-800 transition-colors shadow-2xs"
          >
            <Layers className="w-3.5 h-3.5 text-neutral-500" />
            <span className="hidden md:inline text-neutral-400 font-mono">
              Screen {SCREENS.find((s) => s.id === currentScreen)?.num}:
            </span>
            <span className="font-medium text-neutral-900">
              {SCREENS.find((s) => s.id === currentScreen)?.label}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400 ml-0.5" />
          </button>

          {isScreenMenuOpen && (
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-80 bg-white rounded-xl shadow-xl border border-neutral-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1.5 border-b border-neutral-100 flex items-center justify-between text-[11px] font-mono font-bold text-neutral-400">
                <span>MEDIQ ARCHITECTURE (10 SCREENS)</span>
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

        {/* Right controls: Status, Role, Offline toggle, Clock */}
        <div className="flex items-center gap-3">
          {/* Emergency state indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
            <span>EMERGENCY ACTIVE</span>
          </div>

          {/* Break glass status if active */}
          {hasBreakGlassActive && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-mono font-bold animate-pulse">
              <AlertTriangle className="w-3 h-3" />
              <span>BREAK-GLASS</span>
            </div>
          )}

          {/* Connection status toggle */}
          <button
            type="button"
            onClick={() => {
              setIsOffline(!isOffline);
              if (!isOffline) setCurrentScreen('offline-mode');
            }}
            title="Click to simulate Online / Offline transition"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono border transition-all ${
              isOffline
                ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}
          >
            {isOffline ? (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-700" />
                <span>OFFLINE</span>
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                <span>ONLINE</span>
              </>
            )}
          </button>

          {/* User Role selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-xs font-mono font-medium text-neutral-800 transition-colors"
            >
              <User className="w-3.5 h-3.5 text-neutral-500" />
              <span className="capitalize">{userRole.replace('-', ' ')}</span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            {isRoleMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-neutral-200 py-1.5 z-50 text-xs">
                <div className="px-3 py-1 text-[10px] font-mono text-neutral-400 font-bold border-b border-neutral-100 uppercase">
                  Simulate Access Role
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

          {/* Realtime clock */}
          <div className="hidden xl:block font-mono text-xs font-bold text-neutral-600 bg-neutral-100 px-2.5 py-1 rounded border border-neutral-200/80">
            {currentTime}
          </div>
        </div>
      </div>
    </header>
  );
};
