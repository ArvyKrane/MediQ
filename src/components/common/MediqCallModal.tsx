import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Volume2, ShieldCheck, UserCheck, X } from 'lucide-react';
import { useMediq } from '../../context/MediqContext';

export const MediqCallModal: React.FC = () => {
  const { isCallModalOpen, setIsCallModalOpen, addAuditLog, userRole } = useMediq();
  const [callState, setCallState] = useState<'connecting' | 'ringing' | 'connected' | 'ended'>('connecting');
  const [seconds, setSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (!isCallModalOpen) {
      setCallState('connecting');
      setSeconds(0);
      return;
    }

    // Sequence simulation
    const t1 = setTimeout(() => setCallState('ringing'), 1200);
    const t2 = setTimeout(() => {
      setCallState('connected');
      addAuditLog({
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' IST',
        actor: `${userRole.toUpperCase()} (VoIP Tunnel)`,
        role: 'Authorized Dispatcher',
        action: 'Encrypted peer-to-peer audio tunnel established with verified guardian (Priya Mehta)',
        dataAccessed: 'Virtual proxy bridge (Private phone number masked: +91 •••••• 4821)',
        reason: 'Emergency family notification & consent protocol',
        severity: 'normal',
      });
    }, 3200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isCallModalOpen]);

  useEffect(() => {
    let interval: any;
    if (callState === 'connected') {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callState]);

  if (!isCallModalOpen) return null;

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainder = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    setCallState('ended');
    setTimeout(() => {
      setIsCallModalOpen(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-neutral-900 text-white rounded-3xl max-w-sm w-full p-6 border border-neutral-800 shadow-2xl relative overflow-hidden text-center">
        {/* Ambient pulse glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#FFB800]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex justify-end">
          <button
            onClick={() => setIsCallModalOpen(false)}
            className="text-neutral-400 hover:text-white p-1 rounded-full hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Chip */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-800/90 border border-neutral-700 text-[10px] font-mono font-medium text-neutral-300 mb-6">
          <ShieldCheck className="w-3.5 h-3.5 text-[#FFB800]" />
          <span>ZERO-KNOWLEDGE AUDIO PROXY</span>
        </div>

        {/* Avatar / Profile ring */}
        <div className="relative mx-auto w-24 h-24 mb-4 flex items-center justify-center">
          <div
            className={`absolute inset-0 rounded-full border-2 transition-all ${
              callState === 'connected'
                ? 'border-emerald-500 animate-pulse scale-105'
                : 'border-[#FFB800]/40 animate-ping'
            }`}
          />
          <div className="w-20 h-20 rounded-full bg-neutral-800 border-2 border-neutral-700 flex items-center justify-center text-2xl font-bold text-[#FFB800]">
            PM
          </div>
        </div>

        <h3 className="text-xl font-bold text-white tracking-tight">Priya Mehta</h3>
        <p className="text-xs text-neutral-400 font-mono mt-0.5">Mother • Primary Emergency Contact</p>

        {/* Masked Number */}
        <div className="mt-3 inline-block bg-neutral-800/70 border border-neutral-700/80 px-3 py-1 rounded-lg text-xs font-mono text-neutral-300">
          +91 •••••• 4821
        </div>

        {/* State description */}
        <div className="my-6">
          {callState === 'connecting' && (
            <div className="text-xs font-mono text-neutral-400 animate-pulse">
              Initializing encrypted relay bridge...
            </div>
          )}
          {callState === 'ringing' && (
            <div className="text-xs font-mono text-[#FFB800] animate-pulse">
              Ringing verified guardian device...
            </div>
          )}
          {callState === 'connected' && (
            <div className="space-y-1">
              <div className="text-xs font-mono text-emerald-400 font-bold flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                SECURE CALL IN PROGRESS
              </div>
              <div className="text-2xl font-mono font-bold text-white tracking-wider">
                {formatTimer(seconds)}
              </div>
            </div>
          )}
          {callState === 'ended' && (
            <div className="text-xs font-mono text-neutral-400">Call Terminated</div>
          )}
        </div>

        {/* Audio controls */}
        <div className="flex items-center justify-center gap-4 pt-2">
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3.5 rounded-full border transition-all ${
              isMuted
                ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:text-white'
            }`}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <button
            type="button"
            onClick={handleEndCall}
            className="p-4 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/40 transition-transform active:scale-95"
          >
            <PhoneOff className="w-6 h-6" />
          </button>

          <button
            type="button"
            className="p-3.5 rounded-full bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white transition-all"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>

        {/* Security footnote */}
        <div className="mt-6 pt-4 border-t border-neutral-800/80 flex items-center justify-center gap-1 text-[10px] text-neutral-500 font-mono">
          <UserCheck className="w-3 h-3 text-emerald-500" />
          <span>Responder Verified &bull; Session Key: 0x90a...21f</span>
        </div>
      </div>
    </div>
  );
};
