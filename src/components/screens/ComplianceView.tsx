import React, { useState } from 'react';
import {
  ShieldCheck,
  Clock,
  Hash,
  FileCheck,
  CheckCircle2,
  Lock,
  Filter,
  Download,
  AlertTriangle,
  Fingerprint,
  WifiOff,
  RefreshCw,
  FileKey,
  HardDrive,
  Cpu,
  Layers,
  ArrowRight,
  EyeOff,
  Copy,
  Check,
} from 'lucide-react';
import { useMediq } from '../../context/MediqContext';

export const ComplianceView: React.FC = () => {
  const {
    auditLogs,
    currentPatient,
    isOffline,
    setIsOffline,
    offlineSignatureVerified,
    verifyOfflineSignature,
    syncOfflineData,
    lastSyncTime,
    setIsInsuranceModalOpen,
  } = useMediq();

  const [activeTab, setActiveTab] = useState<'audit' | 'offline'>('audit');
  const [filterQuery, setFilterQuery] = useState('');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const filteredLogs = auditLogs.filter(
    (log) =>
      log.actor.toLowerCase().includes(filterQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(filterQuery.toLowerCase()) ||
      log.dataAccessed.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const handleCopyHash = (hash: string) => {
    setCopiedHash(hash);
    navigator.clipboard?.writeText(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handleVerifyOffline = () => {
    setIsVerifying(true);
    setTimeout(() => {
      verifyOfflineSignature();
      setIsVerifying(false);
    }, 1200);
  };

  const handleSyncOffline = () => {
    setIsSyncing(true);
    setTimeout(() => {
      syncOfflineData();
      setIsOffline(false);
      setIsSyncing(false);
    }, 1400);
  };

  return (
    <div className="space-y-4 pb-28 animate-in fade-in duration-200">
      {/* ─── Top Header ───────────────────────────────────────────── */}
      <div className="bg-neutral-950 text-white rounded-3xl p-5 border border-neutral-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-[#FFB800]">
            <ShieldCheck className="w-4 h-4" />
            <span className="font-bold uppercase tracking-wider">COMPLIANCE &amp; FORENSIC VAULT</span>
          </div>
          <h1 className="text-xl font-black text-white tracking-tight mt-1">
            Audit Trail &amp; Offline Integrity
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Every clinical query is cryptographically signed and logged under DPDP Act &amp; ABDM specifications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsOffline(!isOffline)}
            className={`px-3 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 border transition-all ${
              isOffline
                ? 'bg-amber-400 text-black border-amber-500 shadow-sm'
                : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:bg-neutral-800'
            }`}
          >
            <WifiOff className="w-3.5 h-3.5" />
            <span>{isOffline ? 'Mode: OFFLINE' : 'Mode: ONLINE'}</span>
          </button>
        </div>
      </div>

      {/* ─── Tabs Switcher ────────────────────────────────────────── */}
      <div className="flex gap-1 bg-neutral-100 rounded-2xl p-1">
        <button
          type="button"
          onClick={() => setActiveTab('audit')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'audit'
              ? 'bg-white text-neutral-950 shadow-sm'
              : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          📋 Forensic Audit Trail ({auditLogs.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('offline')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'offline'
              ? 'bg-white text-neutral-950 shadow-sm'
              : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          ⚡ Offline Emergency Vault {isOffline && '(ACTIVE)'}
        </button>
      </div>

      {/* ─── Tab 1: Audit Log ─────────────────────────────────────── */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            <div className="bg-white p-3.5 rounded-2xl border border-neutral-200/90 shadow-2xs">
              <span className="text-neutral-400 block text-[10px] uppercase font-bold">TOTAL LOGS</span>
              <span className="text-lg font-black text-neutral-950 mt-0.5 block">{auditLogs.length} Events</span>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-neutral-200/90 shadow-2xs">
              <span className="text-neutral-400 block text-[10px] uppercase font-bold">INSURER QUERIES</span>
              <span className="text-lg font-black text-red-600 mt-0.5 block">0 (BLOCKED)</span>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-neutral-200/90 shadow-2xs">
              <span className="text-neutral-400 block text-[10px] uppercase font-bold">IMMUTABILITY</span>
              <span className="text-xs font-bold text-emerald-700 mt-1 block">SHA-256 VERIFIED</span>
            </div>
            <div className="bg-neutral-950 text-white p-3.5 rounded-2xl border border-neutral-800 shadow-2xs">
              <span className="text-neutral-400 block text-[10px] uppercase font-bold">PURPOSE LOCK</span>
              <span className="text-xs font-bold text-[#FFB800] mt-1 block">EMERGENCY_CARE</span>
            </div>
          </div>

          {/* Search bar */}
          <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-sm p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
              <h3 className="font-bold text-sm text-neutral-950">
                Tamper-Evident Access Logs &bull; {currentPatient.name}
              </h3>
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Search actor, action, or dataset..."
                className="w-full sm:w-64 text-xs px-3.5 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#FFB800] font-mono"
              />
            </div>

            {/* Log Entries */}
            <div className="space-y-2.5">
              {filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-2xl border border-neutral-200/80 bg-neutral-50/50 hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-neutral-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-neutral-900">{log.actor}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-200/80 text-neutral-700 font-bold">
                        {log.role}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-400">
                      {log.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-800 mt-2 font-medium">
                    {log.action}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 mt-2 pt-2 border-t border-neutral-100 text-[10px] font-mono">
                    <span className="text-neutral-500">
                      Target: <strong className="text-neutral-800">{log.dataAccessed}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyHash(log.hash)}
                      className="flex items-center gap-1 text-neutral-400 hover:text-neutral-700 transition-colors"
                    >
                      {copiedHash === log.hash ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>{copiedHash === log.hash ? 'Hash Copied!' : log.hash.slice(0, 16) + '...'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── Tab 2: Offline Emergency Mode ────────────────────────── */}
      {activeTab === 'offline' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-sm p-5 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
                <WifiOff className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-black text-neutral-950">
                  Zero-Connectivity Fallback Architecture
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">
                  In highway crashes or subway tunnels where cellular networks fail, MEDIQ runs on a locally cryptographically signed emergency cache.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-neutral-900">Local Signed Cache</span>
                  <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    ACTIVE
                  </span>
                </div>
                <p className="text-[11px] text-neutral-600 leading-relaxed">
                  Patient emergency profile is signed with the government health gateway's public key (RSA-4096).
                </p>
                <div className="mt-3 text-[10px] font-mono text-neutral-400">
                  Last verified sync: {lastSyncTime}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-neutral-900">Tamper Seal</span>
                  <span className="text-[10px] font-mono font-bold text-neutral-700 bg-neutral-200 px-2 py-0.5 rounded">
                    VALID
                  </span>
                </div>
                <p className="text-[11px] text-neutral-600 leading-relaxed">
                  Any local modifications during offline triage are queued and validated upon network reconnection.
                </p>
                <div className="mt-3 text-[10px] font-mono text-neutral-400">
                  Signature Status: {offlineSignatureVerified ? '✓ Cryptographically Valid' : 'Unchecked'}
                </div>
              </div>
            </div>

            {/* Offline Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-neutral-100">
              <button
                type="button"
                onClick={handleVerifyOffline}
                disabled={isVerifying}
                className="px-4 py-2.5 rounded-2xl bg-neutral-950 text-[#FFB800] text-xs font-bold flex items-center gap-2 hover:bg-neutral-800 transition-colors"
              >
                <FileKey className="w-4 h-4" />
                <span>{isVerifying ? 'Verifying RSA Signature...' : 'Verify Offline Signature'}</span>
              </button>

              <button
                type="button"
                onClick={handleSyncOffline}
                disabled={isSyncing}
                className="px-4 py-2.5 rounded-2xl bg-white border border-neutral-300 text-neutral-800 text-xs font-bold flex items-center gap-2 hover:bg-neutral-50 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-amber-500' : ''}`} />
                <span>{isSyncing ? 'Re-syncing Gateway...' : 'Sync Gateway to Server'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
