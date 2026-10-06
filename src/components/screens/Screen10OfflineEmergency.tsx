import React, { useState } from 'react';
import {
  WifiOff,
  ShieldCheck,
  RefreshCw,
  FileKey,
  CheckCircle2,
  AlertCircle,
  Lock,
  ArrowRight,
  HardDrive,
  Cpu,
  Layers,
} from 'lucide-react';
import { useMediq } from '../../context/MediqContext';

export const Screen10OfflineEmergency: React.FC = () => {
  const {
    isOffline,
    setIsOffline,
    offlineSignatureVerified,
    verifyOfflineSignature,
    syncOfflineData,
    lastSyncTime,
    resolvedBloodGroup,
    isConflictResolved,
    currentPatient,
    setCurrentScreen,
  } = useMediq();

  const [isVerifyingSignature, setIsVerifyingSignature] = useState(false);
  const [signatureVerifiedToast, setSignatureVerifiedToast] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleVerifySig = () => {
    setIsVerifyingSignature(true);
    setTimeout(() => {
      setIsVerifyingSignature(false);
      verifyOfflineSignature();
      setSignatureVerifiedToast(true);
      setTimeout(() => setSignatureVerifiedToast(false), 3000);
    }, 1200);
  };

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      syncOfflineData();
      setIsOffline(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      {/* Offline Alert Header Banner */}
      <div className="bg-amber-500/15 border-2 border-amber-500 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-amber-500 text-black flex items-center justify-center font-bold shrink-0 shadow-sm">
            <WifiOff className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-wider text-amber-950 font-bold bg-amber-200/80 px-2 py-0.5 rounded border border-amber-300">
                OFFLINE EMERGENCY MODE
              </span>
              <span className="text-xs font-mono font-bold text-amber-900">
                CONNECTION: OFFLINE
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-neutral-950 tracking-tight mt-1">
              Ambulance Tablet Offline Care Mode
            </h1>
            <p className="text-xs text-neutral-700 mt-0.5 max-w-2xl">
              When an ambulance is in a remote highway dead-zone or hospital basement, MEDIQ uses a digitally signed, pre-cached emergency capsule directly from the device memory.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsOffline(!isOffline)}
            className="px-3.5 py-2 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-100 text-xs font-mono font-bold text-neutral-900 transition-colors"
          >
            {isOffline ? 'Simulate Internet Restore' : 'Simulate Network Outage'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Signed Emergency Bundle Information (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white rounded-2xl border border-neutral-200/90 p-6 shadow-xs relative">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <div>
                <span className="font-mono text-xs uppercase font-bold text-neutral-400">
                  STORED OFFLINE CAPSULE
                </span>
                <h3 className="text-lg font-black text-neutral-950 mt-0.5">
                  Emergency Capsule for {currentPatient.name}
                </h3>
                <div className="text-xs font-mono text-emerald-800 font-bold mt-0.5">
                  ABHA: {currentPatient.abhaId}
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono text-neutral-400 block">
                  LAST CLOUD SYNC
                </span>
                <span className="font-mono text-xs font-bold text-neutral-900">
                  {lastSyncTime}
                </span>
              </div>
            </div>

            {/* Checklist of Available Information */}
            <div className="my-5 space-y-2.5">
              <span className="font-mono text-xs uppercase font-bold text-neutral-500 tracking-wider block">
                AVAILABLE EMERGENCY DATA ASSETS (OFFLINE SAFE)
              </span>

              <div className="space-y-2">
                {/* 1. Identity snapshot */}
                <div className="p-3 rounded-xl border border-neutral-200 bg-[#F8F9FA] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="font-bold text-neutral-900">✓ Patient Identity Snapshot</span>
                      <div className="text-[11px] font-mono text-neutral-500">
                        {currentPatient.name} &bull; {currentPatient.age}y {currentPatient.gender}
                      </div>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    CACHED
                  </span>
                </div>

                {/* 2. Critical allergies */}
                <div className="p-3 rounded-xl border border-neutral-200 bg-[#F8F9FA] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="font-bold text-neutral-900">✓ Critical Allergies</span>
                      <div className="text-[11px] font-mono text-red-600 font-semibold">
                        {currentPatient.allergies.map(a => a.name).join(', ')} Hypersensitivity
                      </div>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    CACHED
                  </span>
                </div>

                {/* 3. Critical medications */}
                <div className="p-3 rounded-xl border border-neutral-200 bg-[#F8F9FA] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="font-bold text-neutral-900">✓ Emergency Medications</span>
                      <div className="text-[11px] font-mono text-neutral-500">
                        {currentPatient.medications.map(m => m.name).join(', ')}
                      </div>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    CACHED
                  </span>
                </div>

                {/* 4. Emergency contact token */}
                <div className="p-3 rounded-xl border border-neutral-200 bg-[#F8F9FA] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="font-bold text-neutral-900">✓ Emergency Contact Token</span>
                      <div className="text-[11px] font-mono text-neutral-500">
                        {currentPatient.emergencyContact.name} ({currentPatient.emergencyContact.relationship}) &bull; Offline SMS Relay
                      </div>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    TOKENIZED
                  </span>
                </div>

                {/* 5. Last verified clinical data */}
                <div className="p-3 rounded-xl border border-neutral-200 bg-[#F8F9FA] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="font-bold text-neutral-900">✓ Verified Blood Group Status</span>
                      <div className="text-[11px] font-mono text-neutral-500">
                        {isConflictResolved
                          ? `${resolvedBloodGroup} (Bedside Verified)`
                          : currentPatient.hasBloodGroupConflict
                          ? 'B+ vs O+ Conflict Flag'
                          : currentPatient.bloodGroup}
                      </div>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    SIGNED
                  </span>
                </div>
              </div>
            </div>

            {/* Simple explainer callout */}
            <div className="p-4 rounded-xl bg-neutral-100 border border-neutral-200/90 text-xs text-neutral-700 leading-relaxed">
              <span className="font-bold text-neutral-900 block mb-1">
                Zero-Connectivity Privacy Safeguard:
              </span>
              Offline access is strictly limited to life-saving vitals and does not download the patient's entire medical record history to field tablets, keeping data private and lightweight.
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-5 border-t border-neutral-100">
              <button
                type="button"
                onClick={handleVerifySig}
                disabled={isVerifyingSignature}
                className="py-3 px-4 rounded-xl bg-neutral-950 hover:bg-black text-[#FFB800] text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all"
              >
                <FileKey className={`w-4 h-4 ${isVerifyingSignature ? 'animate-spin' : ''}`} />
                <span>{isVerifyingSignature ? 'VALIDATING...' : 'VERIFY DIGITAL SIGNATURE'}</span>
              </button>

              <button
                type="button"
                onClick={handleSync}
                disabled={isSyncing}
                className="py-3 px-4 rounded-xl bg-white hover:bg-neutral-100 text-neutral-900 border border-neutral-300 text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'TRANSMITTING SYNC...' : 'SYNC WHEN CONNECTED'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Security Telemetry (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-neutral-950 text-white rounded-2xl p-5 border border-neutral-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2 text-[#FFB800]">
                <Cpu className="w-4 h-4" />
                <h3 className="font-mono text-xs uppercase font-bold tracking-wider">
                  AMBULANCE HARDWARE ENCLAVE
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400">HARDWARE SECURED</span>
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex justify-between p-2 rounded-lg bg-neutral-900 border border-neutral-800">
                <span className="text-neutral-400">Hardware ID:</span>
                <span className="text-neutral-200">RIG-12-AMBULANCE</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-neutral-900 border border-neutral-800">
                <span className="text-neutral-400">Bundle Hash:</span>
                <span className="text-amber-400 text-[11px]">sha256:e8b9f...a02</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-neutral-900 border border-neutral-800">
                <span className="text-neutral-400">Origin Hospital:</span>
                <span className="text-neutral-200">Apollo Health HSM Root</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-neutral-900 border border-neutral-800">
                <span className="text-neutral-400">Integrity:</span>
                <span className="text-emerald-400 font-bold">
                  {offlineSignatureVerified ? 'VALID &amp; UNALTERED ✓' : 'CHECKING...'}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-800">
              <div className="text-[11px] text-neutral-400 leading-relaxed mb-3">
                Paramedics can treat with confidence even without cellular reception because the stored record is verified against hospital digital signatures.
              </div>
              <button
                onClick={() => setCurrentScreen('emergency-landing')}
                className="w-full py-2.5 rounded-xl bg-white hover:bg-neutral-100 text-black font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <span>RETURN TO EMERGENCY INTAKE</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
