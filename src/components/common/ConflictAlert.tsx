import React, { useState } from 'react';
import { AlertOctagon, Lock, ShieldAlert, CheckCircle2, ChevronRight } from 'lucide-react';
import { useMediq } from '../../context/MediqContext';

interface ConflictAlertProps {
  onVerifyClick?: () => void;
}

export const ConflictAlert: React.FC<ConflictAlertProps> = ({ onVerifyClick }) => {
  const {
    isConflictLocked,
    isConflictResolved,
    resolvedBloodGroup,
    lockConflict,
    resolveConflict,
  } = useMediq();

  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<'B+' | 'O+'>('B+');
  const [clinicianNotes, setClinicianNotes] = useState('Bedside agglutination test confirms Anti-A absent, Anti-B agglutinated. Rh positive.');

  if (isConflictResolved) {
    return (
      <div className="bg-emerald-50/80 border border-emerald-300 rounded-xl p-4 transition-all">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-800 shrink-0">
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold uppercase text-emerald-800">
                  CLINICAL CONFLICT RESOLVED &amp; ATTESTED
                </span>
                <span className="bg-emerald-200/80 text-emerald-900 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                  {resolvedBloodGroup} CONFIRMED
                </span>
              </div>
              <h4 className="font-semibold text-neutral-900 text-sm mt-0.5">
                Bedside Confirmation by Dr. Sharma (Attending Physician)
              </h4>
              <p className="text-xs text-neutral-600 mt-1">
                Disputed record from Fortis Hospital overridden. Transfusion protocol unlocked for{' '}
                <strong className="text-neutral-900">{resolvedBloodGroup}</strong>.
              </p>
            </div>
          </div>
          <div className="text-right shrink-0 font-mono text-xs text-neutral-500">
            C_clin: <strong className="text-emerald-700 font-bold">87% (HIGH)</strong>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={`bg-white border-2 ${
          isConflictLocked ? 'border-red-500 bg-red-50/20' : 'border-red-400'
        } rounded-xl p-5 shadow-sm transition-all pulse-warning relative overflow-hidden`}
      >
        {/* Subtle diagonal warning stripe on top edge */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-amber-500 to-red-600" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-red-100 rounded-lg text-red-600 shrink-0 mt-0.5">
              <AlertOctagon className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-red-700 bg-red-100 px-2 py-0.5 rounded">
                  ⚠ CLINICAL CONFLICT DETECTED
                </span>
                <span className="font-mono text-xs text-neutral-500">
                  Safety Gate: <strong className="text-neutral-800">HARD STOP</strong>
                </span>
                {isConflictLocked && (
                  <span className="inline-flex items-center gap-1 font-mono text-xs bg-red-600 text-white px-2 py-0.5 rounded font-bold">
                    <Lock className="w-3 h-3" /> LOCKED FIELD
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-[#0A0A0A] mt-1.5">
                Blood Group Records Disagree: <span className="text-red-600 underline">B+ vs O+</span>
              </h3>

              <p className="text-xs text-neutral-700 mt-1 max-w-2xl font-medium">
                "MEDIQ will NOT automatically merge conflicting critical data."
              </p>
              <p className="text-xs text-neutral-500 mt-0.5 max-w-2xl">
                Apollo Speciality (2025) reports <strong className="text-neutral-800">B+</strong> (High Confidence), whereas Fortis Memorial (2023) reports <strong className="text-neutral-800">O+</strong> (Transcribed Record). Transfusion risk rating is severe.
              </p>

              <div className="flex items-center gap-4 mt-3 text-xs font-mono">
                <span className="text-neutral-500">
                  Degraded Clinical Trust: <strong className="text-red-600 font-bold text-sm">C_clin = 71%</strong>
                </span>
                <span className="text-neutral-400">•</span>
                <span className="text-neutral-600">
                  Status: {isConflictLocked ? 'Dispute Locked in Registry' : 'Awaiting Clinician Action'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-row md:flex-col gap-2 shrink-0 justify-end">
            {!isConflictLocked && (
              <button
                type="button"
                onClick={lockConflict}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-xs font-semibold border border-neutral-300 transition-colors"
              >
                <Lock className="w-3.5 h-3.5" />
                LOCK CONFLICT
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                if (onVerifyClick) {
                  onVerifyClick();
                } else {
                  setShowOverrideModal(true);
                }
              }}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-[#0A0A0A] hover:bg-black text-[#FFB800] text-xs font-bold shadow-xs hover:shadow transition-all"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              REQUEST CLINICAL VERIFICATION
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Direct Clinician Resolution Modal */}
      {showOverrideModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-neutral-200 shadow-2xl">
            <div className="flex items-center gap-2 text-red-600 mb-2">
              <ShieldAlert className="w-6 h-6" />
              <h3 className="text-lg font-bold text-neutral-900">
                Clinician Blood Group Verification
              </h3>
            </div>
            <p className="text-xs text-neutral-600 mb-4">
              As the attending clinician, you are resolving a critical medical conflict. Select the verified blood group based on physical crossmatch or verified direct diagnostic evidence.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                type="button"
                onClick={() => setSelectedGroup('B+')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedGroup === 'B+'
                    ? 'border-[#FFB800] bg-amber-50/80 ring-2 ring-[#FFB800]'
                    : 'border-neutral-200 hover:border-neutral-300 bg-white'
                }`}
              >
                <div className="text-xl font-black text-neutral-900">B+</div>
                <div className="text-[11px] text-neutral-500 mt-1">
                  Apollo Hospital (2025) &amp; Apex Lab
                </div>
                <div className="text-[10px] font-mono text-emerald-700 font-semibold mt-1">
                  High Evidence Consensus
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedGroup('O+')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedGroup === 'O+'
                    ? 'border-[#FFB800] bg-amber-50/80 ring-2 ring-[#FFB800]'
                    : 'border-neutral-200 hover:border-neutral-300 bg-white'
                }`}
              >
                <div className="text-xl font-black text-neutral-900">O+</div>
                <div className="text-[11px] text-neutral-500 mt-1">
                  Fortis Memorial (2023 Intake)
                </div>
                <div className="text-[10px] font-mono text-amber-700 font-semibold mt-1">
                  Disputed Transcription
                </div>
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-mono text-neutral-600 uppercase font-semibold mb-1">
                Verification Proof / Clinical Note
              </label>
              <textarea
                value={clinicianNotes}
                onChange={(e) => setClinicianNotes(e.target.value)}
                rows={2}
                className="w-full text-xs p-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:border-[#FFB800] font-mono"
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowOverrideModal(false)}
                className="px-3.5 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  resolveConflict(selectedGroup);
                  setShowOverrideModal(false);
                }}
                className="px-4 py-2 text-xs font-bold bg-neutral-900 hover:bg-black text-[#FFB800] rounded-lg shadow-sm"
              >
                ATTEST &amp; UNLOCK RECORD (C_clin → 87%)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
