import React, { useState } from 'react';
import {
  ShieldCheck,
  Clock,
  Hash,
  FileCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Filter,
  Download,
  AlertTriangle,
  Fingerprint,
} from 'lucide-react';
import { useMediq } from '../../context/MediqContext';

export const Screen9AuditLog: React.FC = () => {
  const { auditLogs, setCurrentScreen, currentPatient } = useMediq();
  const [filterQuery, setFilterQuery] = useState('');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const filteredLogs = auditLogs.filter(
    (log) =>
      log.actor.toLowerCase().includes(filterQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(filterQuery.toLowerCase()) ||
      log.dataAccessed.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const handleCopyHash = (hash: string) => {
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-wider text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Screen 09 &bull; Forensic Compliance
            </span>
            <span className="text-[11px] font-mono text-neutral-400">
              Tamper-Proof Audit Trail
            </span>
          </div>
          <h2 className="text-2xl font-black text-neutral-950 tracking-tight mt-1">
            IMMUTABLE ACTIVITY &amp; AUDIT LOG
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            "Every access generates an auditable event." Any hospital or responder accessing patient records is permanently logged for accountability.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-mono font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Audit State: UNTAMPERED</span>
          </div>
        </div>
      </div>

      {/* Forensic Overview Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 font-mono text-xs">
        <div className="bg-white p-3.5 rounded-xl border border-neutral-200/90 shadow-xs">
          <span className="text-neutral-400 block text-[10px] uppercase font-bold">LOGGED EVENTS</span>
          <span className="text-xl font-black text-neutral-950 mt-0.5 block">{auditLogs.length} Events</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-neutral-200/90 shadow-xs">
          <span className="text-neutral-400 block text-[10px] uppercase font-bold">ACTIVE PATIENT ABHA</span>
          <span className="text-xs font-bold text-neutral-800 mt-1 block truncate">{currentPatient.abhaId}</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-neutral-200/90 shadow-xs">
          <span className="text-neutral-400 block text-[10px] uppercase font-bold">COMMERCIAL INSURERS</span>
          <span className="text-xs font-bold text-red-600 mt-1 block">0 QUERIES ALLOWED</span>
        </div>
        <div className="bg-neutral-950 text-white p-3.5 rounded-xl border border-neutral-800 shadow-xs">
          <span className="text-neutral-400 block text-[10px] uppercase font-bold">LEGAL COMPLIANCE</span>
          <span className="text-xs font-bold text-[#FFB800] mt-1 block">DPDP ACT / ABDM READY</span>
        </div>
      </div>

      {/* Main Audit Trail Timeline */}
      <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-xs p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-100 mb-6">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-neutral-700" />
            <h3 className="font-bold text-sm text-neutral-950">
              Activity History for {currentPatient.name}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Search activity..."
              className="text-xs px-3 py-1.5 rounded-lg border border-neutral-200 focus:outline-none focus:border-[#FFB800] w-56 font-mono"
            />
            <button
              type="button"
              onClick={() => alert('Exporting signed legal audit transcript...')}
              className="px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Timeline Entries */}
        <div className="space-y-4">
          {filteredLogs.map((log) => {
            const isCritical = log.severity === 'critical';
            return (
              <div
                key={log.id}
                className={`p-4 rounded-xl border transition-all ${
                  isCritical
                    ? 'border-red-300 bg-red-50/30'
                    : 'border-neutral-200/80 bg-white hover:border-neutral-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                        isCritical
                          ? 'bg-red-100 text-red-700'
                          : 'bg-neutral-100 text-neutral-800'
                      }`}
                    >
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-neutral-900">
                          {log.timestamp}
                        </span>
                        <span className="text-neutral-300">&bull;</span>
                        <span className="font-bold text-sm text-neutral-950">
                          {log.actor}
                        </span>
                        <span className="font-mono text-[10px] bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded">
                          {log.role}
                        </span>
                        {isCritical && (
                          <span className="font-mono text-[10px] bg-red-600 text-white font-bold px-1.5 py-0.2 rounded">
                            OVERRIDE
                          </span>
                        )}
                      </div>

                      <p className="text-xs font-semibold text-neutral-900 mt-1">
                        Action: {log.action}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2.5 text-xs">
                        <div className="bg-[#F8F9FA] p-2 rounded-lg border border-neutral-200/60">
                          <span className="text-[10px] font-mono text-neutral-400 block uppercase font-bold">
                            DATA ACCESSED
                          </span>
                          <span className="text-neutral-800 font-mono text-[11px]">
                            {log.dataAccessed}
                          </span>
                        </div>

                        <div className="bg-[#F8F9FA] p-2 rounded-lg border border-neutral-200/60">
                          <span className="text-[10px] font-mono text-neutral-400 block uppercase font-bold">
                            REASON
                          </span>
                          <span className="text-neutral-800 text-[11px]">
                            {log.reason}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 pt-1 sm:pt-0">
                    <button
                      type="button"
                      onClick={() => handleCopyHash(log.hash)}
                      className="font-mono text-[11px] text-neutral-400 hover:text-neutral-900 flex items-center sm:justify-end gap-1"
                      title="Click to copy hash"
                    >
                      <Hash className="w-3 h-3 text-amber-500" />
                      <span>{copiedHash === log.hash ? 'COPIED!' : log.hash}</span>
                    </button>
                    <span className="text-[10px] font-mono text-emerald-600 block mt-0.5">
                      Immutable ✓
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
        <span className="text-xs text-neutral-500">
          Next: Test offline emergency triage when cellular internet is unavailable
        </span>
        <button
          type="button"
          onClick={() => setCurrentScreen('offline-mode')}
          className="py-2.5 px-5 rounded-xl bg-neutral-950 hover:bg-black text-[#FFB800] text-xs font-bold flex items-center gap-2 shadow-xs transition-all"
        >
          <span>TEST OFFLINE AMBULANCE MODE</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
