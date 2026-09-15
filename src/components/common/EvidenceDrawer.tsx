import React from 'react';
import { X, ShieldCheck, FileCheck, Hash, Link2, Building2, Calendar, UserCheck } from 'lucide-react';
import { useMediq } from '../../context/MediqContext';

export const EvidenceDrawer: React.FC = () => {
  const { selectedEvidenceItem, setSelectedEvidenceItem, recordSources } = useMediq();

  if (!selectedEvidenceItem) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-neutral-200 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-neutral-200 bg-[#F8F9FA] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-amber-600 font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Cryptographic Provenance</span>
            </div>
            <h3 className="text-base font-bold text-[#0A0A0A] mt-0.5">
              Evidence Trail &amp; Attestation
            </h3>
            <p className="text-xs text-neutral-500 font-mono">
              Target Field: <span className="text-neutral-900 font-bold">{selectedEvidenceItem}</span>
            </p>
          </div>
          <button
            onClick={() => setSelectedEvidenceItem(null)}
            className="p-2 rounded-lg hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
          {/* Trust Guarantee banner */}
          <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3.5">
            <h4 className="font-bold text-neutral-900 flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-amber-600" />
              <span>Zero-Trust Evidence Protocol</span>
            </h4>
            <p className="text-[11px] text-neutral-600 mt-1 leading-relaxed">
              MEDIQ records cannot be edited or fabricated. Every record is signed with hospital HSM root certificates and verifiable across independent node checkpoints.
            </p>
          </div>

          {/* Sources breakdown */}
          <div>
            <div className="flex items-center justify-between text-neutral-500 font-mono text-[11px] uppercase tracking-wider mb-2 font-semibold">
              <span>Verified Hospital Sources ({recordSources.length})</span>
              <span>Consensus: 67%</span>
            </div>

            <div className="space-y-3">
              {recordSources.map((src, index) => (
                <div
                  key={src.id}
                  className="p-3.5 rounded-xl border border-neutral-200 bg-white hover:border-neutral-300 transition-all shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-neutral-900 text-xs">
                      #{index + 1} {src.sourceName}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                        src.confidence === 'High'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {src.confidence} Confidence
                    </span>
                  </div>

                  <div className="mt-2 space-y-1 text-neutral-600">
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <Building2 className="w-3 h-3 text-neutral-400" />
                      <span>{src.institutionType}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <Calendar className="w-3 h-3 text-neutral-400" />
                      <span className="font-mono">{src.recordedDate}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <UserCheck className="w-3 h-3 text-neutral-400" />
                      <span>Attesting Clinician: {src.verifiedBy}</span>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-neutral-100 flex items-center justify-between">
                    <span className="text-[11px] text-neutral-500">
                      Logged Blood Group: <strong className="text-neutral-900 font-mono">{src.bloodGroup}</strong>
                    </span>
                    <span className="font-mono text-[10px] text-neutral-400 flex items-center gap-1">
                      <Hash className="w-2.5 h-2.5" />
                      {src.hash}
                    </span>
                  </div>

                  <p className="mt-2 text-[11px] text-neutral-500 bg-neutral-50 p-2 rounded border border-neutral-100 italic">
                    "{src.notes}"
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Cryptographic Ledger Block */}
          <div className="p-3.5 bg-neutral-900 text-neutral-100 rounded-xl font-mono text-[11px] space-y-2">
            <div className="flex items-center justify-between text-neutral-400 border-b border-neutral-800 pb-1.5">
              <span className="flex items-center gap-1">
                <Link2 className="w-3 h-3 text-[#FFB800]" />
                IMMUTABLE CHAIN STATE
              </span>
              <span className="text-emerald-400 text-[10px]">VERIFIED ✓</span>
            </div>
            <div>
              <span className="text-neutral-400">Block ID:</span> #0091824-NDHM
            </div>
            <div>
              <span className="text-neutral-400">Merkle Root:</span> 0x8a92f009b7c61...4f9
            </div>
            <div>
              <span className="text-neutral-400">Signer Key:</span> HSM_APOLLO_ROOT_02 (NIST P-256)
            </div>
            <div>
              <span className="text-neutral-400">Tamper Status:</span> Unaltered / Zero Conflict Merge
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200 bg-[#F8F9FA] flex justify-end">
          <button
            onClick={() => setSelectedEvidenceItem(null)}
            className="w-full py-2 px-4 rounded-lg bg-neutral-900 text-white font-semibold text-xs hover:bg-black transition-colors"
          >
            Close Provenance View
          </button>
        </div>
      </div>
    </div>
  );
};
