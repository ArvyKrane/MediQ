import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Fingerprint,
  Camera,
  CreditCard,
  Phone,
  ArrowRight,
  Building2,
  Pill,
  Heart,
  UserCheck,
  Activity,
  EyeOff,
  Lock,
  ShieldAlert,
  RefreshCw,
  Check,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import { useMediq } from '../../context/MediqContext';

// ─── PatientView: Merged Screens 3+4+5+6 into one flowing clinical record ────
export const PatientView: React.FC = () => {
  const {
    currentPatient,
    identityStatus,
    isConflictResolved,
    isConflictLocked,
    resolvedBloodGroup,
    lockConflict,
    resolveConflict,
    clinicalTrustScore,
    recordSources,
    capturedPhotoUrl,
    setCurrentScreen,
    setIsCallModalOpen,
    setIsInsuranceModalOpen,
    isAbdmFetching,
    fetchAbdmRecords,
    addAuditLog,
    userRole,
    setIsContactShared,
  } = useMediq();

  const isIdentified = identityStatus === 'VERIFIED' || identityStatus === 'MATCHED';

  const handleResolveConflict = (bloodGroup: string) => {
    resolveConflict(bloodGroup);
    addAuditLog({
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' IST',
      actor: `${userRole.toUpperCase()} (${userRole === 'doctor' ? 'Dr. Sharma' : 'Paramedic'})`,
      role: userRole,
      action: `Confirmed blood group ${bloodGroup} via bedside agglutination test for ${currentPatient.name}`,
      dataAccessed: 'Blood Group Conflict Resolution Record',
      reason: 'Bedside clinical verification before blood transfusion',
      severity: 'warning',
    });
  };

  // Not identified yet
  if (!isIdentified) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4 text-center animate-in fade-in duration-200">
        <div className="w-16 h-16 rounded-3xl bg-neutral-100 border border-neutral-200 flex items-center justify-center">
          <Lock className="w-8 h-8 text-neutral-400" />
        </div>
        <div>
          <h3 className="text-base font-black text-neutral-900">Scan Patient First</h3>
          <p className="text-sm text-neutral-500 mt-1 max-w-xs">
            Go to the Emergency Intake tab, scan the patient's face, fingerprint, or ID card to unlock their medical record.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCurrentScreen('emergency-landing')}
          className="mt-2 px-5 py-2.5 bg-neutral-950 text-[#FFB800] rounded-2xl font-bold text-xs flex items-center gap-2"
        >
          <Camera className="w-4 h-4" />
          <span>Go to Emergency Intake</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-28 animate-in fade-in duration-200">

      {/* ─── Patient Identity Card ─────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-4 p-5 border-b border-neutral-100">
          {/* Avatar */}
          <div className="w-14 h-14 rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0">
            {capturedPhotoUrl || currentPatient.photoUrl ? (
              <img
                src={capturedPhotoUrl || currentPatient.photoUrl}
                alt={currentPatient.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-950 font-black text-lg bg-[#FFB800]">
                {currentPatient.name.split(' ').map((n) => n[0]).join('')}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-black text-neutral-950 tracking-tight truncate">
                {currentPatient.name}
              </h2>
              <span className="font-mono text-[10px] bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded border border-neutral-200 font-bold shrink-0">
                UNCONSCIOUS
              </span>
            </div>
            <div className="text-xs text-neutral-500 font-mono mt-0.5">
              {currentPatient.age}y • {currentPatient.gender} • DOB: {currentPatient.dob}
            </div>
            <div className="text-[11px] font-mono font-bold text-emerald-800 mt-0.5 truncate">
              {currentPatient.abhaId}
            </div>
          </div>

          {/* Identity verified badge */}
          <div className="shrink-0 text-right">
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-1 rounded-lg">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Aadhaar e-KYC</span>
            </span>
            <div className="text-[10px] font-mono text-neutral-400 mt-0.5">
              {currentPatient.maskedGovId}
            </div>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-3 divide-x divide-neutral-100 bg-neutral-50/60">
          <div className="p-3 text-center">
            <span className="text-[10px] font-mono text-neutral-400 uppercase block font-bold">ABHA No.</span>
            <span className="text-[11px] font-mono font-bold text-neutral-800 truncate block">
              {currentPatient.abhaNumber.slice(0, 14)}
            </span>
          </div>
          <div className="p-3 text-center">
            <span className="text-[10px] font-mono text-neutral-400 uppercase block font-bold">Record Score</span>
            <span className={`text-sm font-black font-mono ${isConflictResolved ? 'text-emerald-700' : 'text-amber-700'}`}>
              {isConflictResolved ? 87 : clinicalTrustScore}%
            </span>
          </div>
          <div className="p-3 text-center">
            <span className="text-[10px] font-mono text-neutral-400 uppercase block font-bold">Hospitals</span>
            <span className="text-sm font-black font-mono text-neutral-800">
              {currentPatient.linkedHospitals.length}
            </span>
          </div>
        </div>
      </div>

      {/* ─── Blood Group Conflict Resolution ────────────────────────── */}
      {currentPatient.hasBloodGroupConflict && (
        <div className={`rounded-3xl border-2 shadow-sm overflow-hidden ${
          isConflictResolved ? 'border-emerald-300 bg-white' : 'border-red-400 bg-red-50/30'
        }`}>
          <div className="p-5">
            {/* Conflict Header */}
            <div className="flex items-start gap-3">
              <div className={`p-2.5 rounded-2xl shrink-0 ${isConflictResolved ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                {isConflictResolved ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 animate-pulse" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <span className={`text-[10px] font-mono font-bold uppercase block ${
                  isConflictResolved ? 'text-emerald-700' : 'text-red-700'
                }`}>
                  {isConflictResolved ? '✓ Blood Group Conflict Resolved' : '⚠️ Critical Blood Group Conflict'}
                </span>
                <h3 className="text-base font-black text-neutral-950 mt-0.5">
                  {isConflictResolved
                    ? `Confirmed: ${resolvedBloodGroup} (Bedside Test Verified)`
                    : 'Apollo says B+ · Fortis says O+'}
                </h3>
                <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                  {isConflictResolved
                    ? 'Clinician confirmed via bedside agglutination test. Safe for transfusion.'
                    : 'Cannot blindly merge conflicting hospital records. Perform a rapid bedside blood test before any transfusion.'}
                </p>
              </div>
            </div>

            {/* Bedside Resolution Buttons */}
            {!isConflictResolved && (
              <div className="mt-4 pt-4 border-t border-red-200/80">
                <span className="text-[10px] font-mono font-bold text-neutral-600 uppercase block mb-2.5">
                  Doctor: Confirm bedside agglutination result →
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  {['B+', 'O+'].map((bg) => (
                    <button
                      key={bg}
                      type="button"
                      onClick={() => handleResolveConflict(bg)}
                      className="py-3 rounded-2xl font-black text-base font-mono border-2 transition-all bg-white border-neutral-200 hover:border-neutral-950 hover:bg-neutral-950 hover:text-[#FFB800] text-neutral-900"
                    >
                      {bg}
                      <span className="block text-[10px] font-mono font-bold text-neutral-500 group-hover:text-amber-300">
                        {bg === 'B+' ? 'Apollo (2025)' : 'Fortis (2023)'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Side-by-Side Hospital Sources */}
          <div className="border-t border-neutral-100 bg-neutral-50/40">
            <div className="px-5 py-3">
              <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase">
                Hospital Records ({recordSources.length} sources)
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 px-5 pb-5">
              {recordSources.map((src) => {
                const isConflicting = src.bloodGroup === 'O+';
                return (
                  <div
                    key={src.id}
                    className={`p-3.5 rounded-2xl border text-xs ${
                      isConflicting
                        ? 'border-red-300 bg-red-50'
                        : 'border-emerald-300 bg-emerald-50/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-neutral-900 text-[11px] truncate pr-1">
                        {src.sourceName.split(' ').slice(0, 2).join(' ')}
                      </span>
                      <span className={`font-mono text-sm font-black ${isConflicting ? 'text-red-700' : 'text-emerald-700'}`}>
                        {src.bloodGroup}
                      </span>
                    </div>
                    <div className="font-mono text-[10px] text-neutral-500">
                      <div>{src.recordedDate}</div>
                      <div className="truncate">{src.confidence} confidence</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* If no blood group conflict, just show blood group */}
      {!currentPatient.hasBloodGroupConflict && (
        <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-sm p-5">
          <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase">Blood Group</span>
          <div className="text-3xl font-black font-mono text-neutral-950 mt-1">
            {currentPatient.bloodGroup}
            <span className="ml-2 text-[11px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-lg border border-emerald-200">
              Verified ✓
            </span>
          </div>
        </div>
      )}

      {/* ─── Drug Allergies ─────────────────────────────────────────── */}
      {currentPatient.allergies.length > 0 && (
        <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase">
              Critical Drug Allergies
            </span>
            <span className="text-[10px] font-mono font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-lg">
              HIGH ALERT
            </span>
          </div>
          <div className="space-y-2">
            {currentPatient.allergies.map((allergy, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-red-50/60 border border-red-200/80">
                <div>
                  <span className="font-bold text-red-900 text-sm">{allergy.name}</span>
                  <p className="text-[11px] text-red-700/80 mt-0.5">{allergy.source}</p>
                </div>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg border ${
                  allergy.severity === 'Severe'
                    ? 'bg-red-100 text-red-700 border-red-300'
                    : 'bg-amber-100 text-amber-800 border-amber-300'
                }`}>
                  {allergy.severity}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Active Medications ─────────────────────────────────────── */}
      {currentPatient.medications.length > 0 && (
        <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-sm p-5">
          <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase block mb-3">
            Active Medications ({currentPatient.medications.length})
          </span>
          <div className="space-y-2">
            {currentPatient.medications.map((med, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-neutral-50 border border-neutral-200/80">
                <div className="flex items-center gap-2.5">
                  <Pill className="w-4 h-4 text-neutral-500 shrink-0" />
                  <div>
                    <span className="font-bold text-neutral-900 text-sm">{med.name}</span>
                    <span className="text-[11px] text-neutral-500 ml-2">{med.dosage}</span>
                    <p className="text-[10px] text-neutral-400">{med.frequency}</p>
                  </div>
                </div>
                {med.verified && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Emergency Contact with Masked Proxy Call ──────────────── */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-sm p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase">
            Emergency Contact
          </span>
          <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg">
            MASKED PROXY — Phone Hidden
          </span>
        </div>

        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200">
          <div>
            <div className="font-bold text-neutral-950 text-sm">
              {currentPatient.emergencyContact.name}
            </div>
            <div className="text-xs text-neutral-500 font-mono mt-0.5">
              {currentPatient.emergencyContact.relationship} • {currentPatient.emergencyContact.maskedPhone}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsCallModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-neutral-950 hover:bg-neutral-800 text-[#FFB800] rounded-2xl font-bold text-xs shadow-sm transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span>Call Now</span>
          </button>
        </div>

        <p className="text-[10px] text-neutral-400 font-mono mt-2 leading-relaxed">
          Real phone number stays private. MEDIQ bridges the call through an anonymous proxy — family can be notified without the patient's number being exposed in the hospital system.
        </p>
      </div>

      {/* ─── Insurance Privacy Shield Notice ───────────────────────── */}
      <div className="bg-emerald-50/80 rounded-3xl border border-emerald-300 shadow-sm p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-emerald-950 text-sm">
                {currentPatient.shieldedRecordsCount} past records shielded from insurers
              </span>
              <p className="text-[11px] text-emerald-800 mt-1 leading-relaxed">
                Past OPD visits, dental procedures, and minor lab tests are encrypted and <strong>never</strong> accessible to insurance TPAs under this emergency scan.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsInsuranceModalOpen(true)}
            className="shrink-0 text-[10px] font-mono font-bold text-emerald-900 underline"
          >
            Why? →
          </button>
        </div>
      </div>

      {/* ─── Linked Hospitals ──────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-sm p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase">
            Linked Hospital Networks ({currentPatient.linkedHospitals.length})
          </span>
          <button
            type="button"
            onClick={() => fetchAbdmRecords(currentPatient.abhaId)}
            disabled={isAbdmFetching}
            className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-neutral-700 hover:text-neutral-950 transition-colors"
          >
            <RefreshCw className={`w-3 h-3 ${isAbdmFetching ? 'animate-spin text-amber-500' : ''}`} />
            <span>{isAbdmFetching ? 'Syncing...' : 'Sync'}</span>
          </button>
        </div>
        <div className="space-y-2">
          {currentPatient.linkedHospitals.map((h, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-neutral-50 border border-neutral-200/80">
              <div className="flex items-center gap-2.5">
                <Building2 className="w-4 h-4 text-neutral-400 shrink-0" />
                <div>
                  <span className="font-bold text-neutral-900 text-xs">{h.name}</span>
                  <p className="text-[10px] text-neutral-400">{h.type}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono font-bold text-emerald-700">{h.recordsShared} records</span>
                <p className="text-[9px] text-neutral-400 font-mono">{h.lastSync}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
