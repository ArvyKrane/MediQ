import React from 'react';
import {
  Phone,
  Share2,
  ShieldCheck,
  UserCheck,
  Lock,
  EyeOff,
  AlertCircle,
  Radio,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { useMediq } from '../../context/MediqContext';

export const Screen5EmergencyContact: React.FC = () => {
  const {
    currentPatient,
    setIsCallModalOpen,
    isContactShared,
    setIsContactShared,
    addAuditLog,
    userRole,
    setCurrentScreen,
  } = useMediq();

  const handleShareContact = () => {
    setIsContactShared(true);
    addAuditLog({
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' IST',
      actor: `${userRole.toUpperCase()}`,
      role: 'Emergency Dispatcher',
      action: `Authorized emergency contact proxy token shared with hospital trauma team`,
      dataAccessed: `Contact: ${currentPatient.emergencyContact.name} (${currentPatient.emergencyContact.relationship})`,
      reason: 'Critical trauma notification to next of kin',
      severity: 'normal',
    });
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-wider text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Screen 05 &bull; Family Communication
            </span>
            <span className="text-[11px] font-mono text-emerald-700 font-bold">
              Zero-Leakage Audio Bridge
            </span>
          </div>
          <h2 className="text-2xl font-black text-neutral-950 tracking-tight mt-1">
            PRIVATE EMERGENCY CONTACT
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Connecting authorized medical responders with verified guardians without exposing private phone numbers.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-mono font-bold">
          <UserCheck className="w-4 h-4 text-emerald-600" />
          <span>Responder Verified ✓</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Contact Card & Actions (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white rounded-2xl border border-neutral-200/90 p-6 shadow-xs relative overflow-hidden">
            <div className="flex items-start justify-between pb-4 border-b border-neutral-100">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-neutral-950 text-[#FFB800] flex items-center justify-center font-bold text-lg shadow-xs">
                  {currentPatient.emergencyContact.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <span className="font-mono text-[10px] text-neutral-400 uppercase font-semibold">
                    Primary Emergency Contact
                  </span>
                  <h3 className="text-xl font-black text-neutral-950">
                    {currentPatient.emergencyContact.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5 text-xs font-mono text-neutral-500">
                    <span>Relationship: <strong className="text-neutral-900 font-sans">{currentPatient.emergencyContact.relationship}</strong></span>
                    <span>&bull;</span>
                    <span className="text-emerald-700 font-semibold">Legal Next of Kin</span>
                  </div>
                </div>
              </div>

              <span className="text-[10px] font-mono font-bold bg-amber-50 text-amber-900 border border-amber-200 px-2 py-1 rounded-md">
                Encrypted Proxy
              </span>
            </div>

            {/* Masked Phone Number Display */}
            <div className="my-6 p-4 rounded-xl bg-[#F8F9FA] border border-neutral-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono text-neutral-400 uppercase font-bold block">
                  Guardian Phone Number (Protected)
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono text-xl font-black tracking-wider text-neutral-900">
                    {currentPatient.emergencyContact.maskedPhone}
                  </span>
                  <EyeOff className="w-4 h-4 text-neutral-400" />
                </div>
                <div className="text-[11px] font-mono text-neutral-500 mt-0.5">
                  Actual phone number stays private to prevent harassment and spam.
                </div>
              </div>

              <div className="text-right">
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Direct Encrypted Call
                </span>
              </div>
            </div>

            {/* Explainer Quotation */}
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 mb-6">
              <p className="text-xs font-medium text-amber-950 leading-relaxed">
                "Personal contact information remains hidden. MEDIQ connects authorized emergency responders without exposing the private mobile number to personal phones."
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setIsCallModalOpen(true)}
                className="py-3 px-4 rounded-xl bg-neutral-950 hover:bg-black text-[#FFB800] font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
              >
                <Phone className="w-4 h-4" />
                <span>CALL THROUGH MEDIQ</span>
              </button>

              <button
                type="button"
                onClick={handleShareContact}
                className={`py-3 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  isContactShared
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-white hover:bg-neutral-100 text-neutral-900 border-neutral-300'
                }`}
              >
                {isContactShared ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>SHARED WITH HOSPITAL ER ✓</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    <span>SHARE WITH AUTHORIZED RESPONDER</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Security Protocol & Access Details (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-neutral-200/90 p-5 shadow-xs">
            <h3 className="font-bold text-sm text-neutral-950 flex items-center gap-2 pb-3 border-b border-neutral-100">
              <Lock className="w-4 h-4 text-neutral-500" />
              <span>COMMUNICATION ACCESS TELEMETRY</span>
            </h3>

            <div className="space-y-3 mt-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#F8F9FA] border border-neutral-200 font-mono">
                <span className="text-neutral-500">Authorized Caller:</span>
                <span className="font-bold text-neutral-900">Dr. Sharma / Paramedic Rao</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#F8F9FA] border border-neutral-200 font-mono">
                <span className="text-neutral-500">Call Channel:</span>
                <span className="text-emerald-700 font-bold">Secure MEDIQ Relay</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#F8F9FA] border border-neutral-200 font-mono">
                <span className="text-neutral-500">Proxy Session TTL:</span>
                <span className="font-bold text-neutral-900">45 Minutes Remaining</span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setCurrentScreen('patient-profile')}
                className="w-full py-2.5 px-4 rounded-xl bg-neutral-950 hover:bg-black text-[#FFB800] text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all"
              >
                <span>CONTINUE TO PATIENT PROFILE</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
