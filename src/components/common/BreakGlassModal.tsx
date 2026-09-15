import React, { useState } from 'react';
import { AlertTriangle, ShieldOff, X, Lock, FileWarning } from 'lucide-react';
import { useMediq } from '../../context/MediqContext';

export const BreakGlassModal: React.FC = () => {
  const { isBreakGlassModalOpen, setIsBreakGlassModalOpen, triggerBreakGlass, userRole } = useMediq();
  const [reason, setReason] = useState('Unconscious patient with hypovolemic shock; immediate life-saving surgery required.');
  const [duration, setDuration] = useState<number>(30);
  const [confirmedRisk, setConfirmedRisk] = useState(false);

  if (!isBreakGlassModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmedRisk) return;
    triggerBreakGlass(reason, duration);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full border-2 border-red-500 shadow-2xl overflow-hidden">
        {/* Urgent header */}
        <div className="bg-red-500 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-red-600 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="text-[10px] font-mono tracking-widest uppercase font-bold text-red-100">
                CRITICAL PROTOCOL 0xBG
              </div>
              <h3 className="font-bold text-base leading-none mt-0.5">
                REQUEST BREAK-GLASS ACCESS
              </h3>
            </div>
          </div>
          <button
            onClick={() => setIsBreakGlassModalOpen(false)}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-red-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 text-neutral-800">
            <h4 className="font-bold flex items-center gap-1.5 text-red-800 text-xs mb-1">
              <ShieldOff className="w-4 h-4 text-red-600" />
              Emergency Access Override Notice
            </h4>
            <p className="text-[11px] text-neutral-700 leading-relaxed">
              "Emergency access may temporarily expose critical information when normal connectivity or authorization paths are unavailable."
            </p>
            <div className="mt-2 text-[10px] font-mono text-red-700 bg-red-100/70 px-2 py-1 rounded">
              ATTENTION: Every break-glass action creates an immutable forensic audit event reviewed by the Medical Ethics &amp; Compliance Committee.
            </div>
          </div>

          <div>
            <label className="block font-mono text-[11px] uppercase font-bold text-neutral-700 mb-1">
              Requesting Responder Identity
            </label>
            <div className="bg-neutral-100 p-2.5 rounded-lg border border-neutral-200 font-mono text-xs flex justify-between items-center">
              <span className="font-bold text-neutral-900">{userRole.toUpperCase()} • ID: USER-8910-EMERG</span>
              <span className="text-[10px] bg-neutral-200 text-neutral-700 px-2 py-0.5 rounded font-semibold">
                Biometric Token Active
              </span>
            </div>
          </div>

          <div>
            <label className="block font-mono text-[11px] uppercase font-bold text-neutral-700 mb-1">
              Clinical Justification / Reason *
            </label>
            <textarea
              required
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Specify clinical urgency (e.g., Cardiac arrest, massive trauma, unverified allergy shock)..."
              className="w-full p-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:border-red-500 text-neutral-800 font-sans text-xs"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[15, 30, 60].map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => setDuration(mins)}
                className={`py-2 px-3 rounded-lg border text-center font-mono font-semibold text-xs transition-all ${
                  duration === mins
                    ? 'border-red-500 bg-red-50 text-red-900 ring-1 ring-red-500'
                    : 'border-neutral-200 hover:border-neutral-300 bg-white text-neutral-700'
                }`}
              >
                {mins} Minutes
              </button>
            ))}
          </div>

          <label className="flex items-start gap-2.5 pt-1 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={confirmedRisk}
              onChange={(e) => setConfirmedRisk(e.target.checked)}
              className="mt-0.5 rounded border-neutral-300 text-red-600 focus:ring-red-500"
            />
            <span className="text-[11px] text-neutral-600">
              I certify under penalty of professional license revocation that this access is medically essential to prevent immediate patient mortality or irreversible morbidity.
            </span>
          </label>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-neutral-100">
            <button
              type="button"
              onClick={() => setIsBreakGlassModalOpen(false)}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-neutral-600 hover:text-neutral-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!confirmedRisk}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition-all shadow-sm ${
                confirmedRisk
                  ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-200'
                  : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
              }`}
            >
              EXECUTE BREAK-GLASS ({duration}M)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
