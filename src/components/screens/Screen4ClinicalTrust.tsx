import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  Building2,
  Calendar,
  UserCheck,
  Hash,
  ArrowRight,
  HelpCircle,
  Stethoscope,
  RefreshCw,
} from 'lucide-react';
import { useMediq } from '../../context/MediqContext';

export const Screen4ClinicalTrust: React.FC = () => {
  const {
    currentPatient,
    clinicalTrustScore,
    clinicalTrustBreakdown,
    recordSources,
    isConflictLocked,
    isConflictResolved,
    resolvedBloodGroup,
    lockConflict,
    resolveConflict,
    setCurrentScreen,
    setSelectedEvidenceItem,
    isAbdmFetching,
    abdmFetchStatus,
    fetchAbdmRecords,
  } = useMediq();

  const [showDirectVerifyModal, setShowDirectVerifyModal] = useState(false);
  const [selectedBloodChoice, setSelectedBloodChoice] = useState<'B+' | 'O+'>('B+');

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-wider text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Screen 04 &bull; Medical Records Verification
            </span>
            <span className="text-[11px] font-mono text-neutral-500">
              ABHA Live Records
            </span>
          </div>
          <h2 className="text-2xl font-black text-neutral-950 tracking-tight mt-1">
            VERIFY MEDICAL RECORDS &amp; CONFLICTS
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Patient: <strong className="text-neutral-950">{currentPatient.name}</strong> &bull; ABHA: <strong className="text-emerald-800 font-mono">{currentPatient.abhaId}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fetchAbdmRecords(currentPatient.abhaId)}
            disabled={isAbdmFetching}
            className="px-3 py-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-xs font-semibold text-neutral-800 flex items-center gap-1.5 shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAbdmFetching ? 'animate-spin text-amber-500' : 'text-neutral-500'}`} />
            <span>{isAbdmFetching ? 'Fetching ABDM...' : 'Re-sync Hospital Records'}</span>
          </button>
        </div>
      </div>

      {/* Prominent Clinical Conflict Warning Card */}
      {currentPatient.hasBloodGroupConflict && (
        <div
          className={`bg-white border-2 ${
            isConflictResolved
              ? 'border-emerald-400 bg-emerald-50/20'
              : 'border-red-400 bg-red-50/15'
          } rounded-2xl p-5 shadow-sm transition-all relative overflow-hidden`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div
                className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                  isConflictResolved ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-600'
                }`}
              >
                {isConflictResolved ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-700" />
                ) : (
                  <AlertTriangle className="w-6 h-6 animate-pulse" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`font-mono text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      isConflictResolved
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {isConflictResolved
                      ? '✓ BLOOD GROUP CONFLICT RESOLVED AT BEDSIDE'
                      : '⚠️ FATAL CONFLICT: BLOOD GROUP DISPUTE'}
                  </span>
                  {isConflictLocked && !isConflictResolved && (
                    <span className="font-mono text-xs bg-red-600 text-white px-2 py-0.5 rounded font-bold">
                      FIELD LOCKED
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-neutral-950 mt-1">
                  {isConflictResolved ? (
                    <span>
                      Confirmed Blood Group: <strong className="text-emerald-700 font-mono text-lg">{resolvedBloodGroup}</strong>
                    </span>
                  ) : (
                    <span>
                      Apollo Hospital says <span className="text-red-700 font-mono font-bold">B+</span> vs Fortis Hospital says <span className="text-red-700 font-mono font-bold">O+</span>
                    </span>
                  )}
                </h3>

                <p className="text-xs text-neutral-700 mt-1 leading-relaxed max-w-2xl">
                  {isConflictResolved ? (
                    'Bedside test completed by Dr. Sharma. Blood bank notified; safe for transfusion.'
                  ) : (
                    <>
                      <strong>"MEDIQ will NOT automatically merge conflicting critical data."</strong> Merging these blindly could cause a fatal acute transfusion reaction. The doctor must confirm physically.
                    </>
                  )}
                </p>

                <div className="flex items-center gap-3 mt-2 text-xs font-mono">
                  <span className="text-neutral-500">
                    Clinical Record Reliability:{' '}
                    <strong
                      className={`text-sm ${
                        isConflictResolved ? 'text-emerald-700 font-bold' : 'text-red-600 font-bold'
                      }`}
                    >
                      {clinicalTrustScore}%
                    </strong>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-row md:flex-col gap-2 shrink-0 justify-end">
              {!isConflictResolved && (
                <>
                  {!isConflictLocked && (
                    <button
                      type="button"
                      onClick={lockConflict}
                      className="px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-xs font-semibold border border-neutral-300"
                    >
                      Lock Dispute
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowDirectVerifyModal(true)}
                    className="px-4 py-2 rounded-xl bg-neutral-950 hover:bg-black text-[#FFB800] text-xs font-bold shadow-xs"
                  >
                    Confirm Bedside Test →
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Side-by-Side Hospital Records */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-mono text-xs uppercase font-bold text-neutral-900 tracking-wider">
              RAW MEDICAL RECORDS PULLED FROM LINKED HOSPITALS ({recordSources.length})
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Notice how independent hospital databases have conflicting entries.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recordSources.map((src, index) => {
            const isConflictingSource = src.bloodGroup === 'O+';
            return (
              <div
                key={src.id}
                className={`bg-white rounded-2xl border-2 p-5 shadow-xs relative flex flex-col justify-between ${
                  isConflictingSource ? 'border-red-400 bg-red-50/10' : 'border-neutral-200'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-neutral-400 font-bold uppercase">
                        Hospital #{index + 1}
                      </span>
                      <h4 className="font-bold text-sm text-neutral-950">{src.sourceName}</h4>
                    </div>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        isConflictingSource
                          ? 'bg-red-100 text-red-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {isConflictingSource ? 'Disputed Record' : 'Verified Lab'}
                    </span>
                  </div>

                  <div className="my-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                    <span className="text-[10px] font-mono text-neutral-400 block uppercase">
                      Logged Blood Group
                    </span>
                    <div
                      className={`text-2xl font-black font-mono mt-0.5 ${
                        isConflictingSource ? 'text-red-600' : 'text-neutral-950'
                      }`}
                    >
                      {src.bloodGroup}
                    </div>
                    <span className="text-[10px] text-neutral-500">
                      Recorded: {src.recordedDate}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-neutral-600">
                    <div>Attesting Doctor: {src.verifiedBy}</div>
                    <div className="text-[11px] text-neutral-500 italic mt-2 bg-white p-2 rounded-lg border border-neutral-100">
                      "{src.notes}"
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-neutral-400 truncate max-w-[150px]">
                    {src.hash}
                  </span>
                  <button
                    onClick={() => setSelectedEvidenceItem(src.sourceName)}
                    className="text-xs font-semibold text-neutral-900 hover:text-amber-600 underline"
                  >
                    View Proof →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Next Step CTA */}
      <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
        <span className="text-xs text-neutral-500">
          Next: Contact patient's family privately without revealing phone number
        </span>
        <button
          type="button"
          onClick={() => setCurrentScreen('emergency-contact')}
          className="py-3 px-6 rounded-xl bg-neutral-950 hover:bg-black text-[#FFB800] text-xs font-bold flex items-center gap-2 shadow-xs transition-all"
        >
          <span>PROCEED TO EMERGENCY CONTACT</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Bedside Clinician Confirmation Modal */}
      {showDirectVerifyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-neutral-200 shadow-2xl">
            <div className="flex items-center gap-2 text-neutral-900 mb-2">
              <Stethoscope className="w-5 h-5 text-amber-600" />
              <h3 className="text-lg font-bold">
                Doctor Bedside Blood Group Confirmation
              </h3>
            </div>
            <p className="text-xs text-neutral-600 mb-4">
              Select the blood group confirmed by physical finger-prick agglutination test in the ER. This unlocks blood bank release and sets clinical trust to 87%.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                type="button"
                onClick={() => setSelectedBloodChoice('B+')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  selectedBloodChoice === 'B+'
                    ? 'border-[#FFB800] bg-amber-50 ring-2 ring-[#FFB800]'
                    : 'border-neutral-200 bg-white'
                }`}
              >
                <span className="font-mono text-2xl font-black text-neutral-950">B+</span>
                <span className="text-[11px] text-neutral-600 block mt-1">
                  Supported by Apollo Hospital &amp; Apex Lab
                </span>
                <span className="text-[10px] font-mono text-emerald-700 font-bold">
                  Recommended Test Match
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedBloodChoice('O+')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  selectedBloodChoice === 'O+'
                    ? 'border-[#FFB800] bg-amber-50 ring-2 ring-[#FFB800]'
                    : 'border-neutral-200 bg-white'
                }`}
              >
                <span className="font-mono text-2xl font-black text-neutral-950">O+</span>
                <span className="text-[11px] text-neutral-600 block mt-1">
                  Fortis Memorial 2023 transcription
                </span>
                <span className="text-[10px] font-mono text-amber-700 font-bold">
                  Single Older Record
                </span>
              </button>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setShowDirectVerifyModal(false)}
                className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  resolveConflict(selectedBloodChoice);
                  setShowDirectVerifyModal(false);
                }}
                className="px-4 py-2 text-xs font-bold bg-neutral-950 hover:bg-black text-[#FFB800] rounded-xl shadow-xs"
              >
                ATTEST &amp; CONFIRM {selectedBloodChoice}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
