import React, { useState, useEffect, useRef } from 'react';
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  ShieldCheck,
  UserCheck,
  X,
  Radio,
  Sparkles,
  MessageSquare,
  Lock,
} from 'lucide-react';
import { useMediq } from '../../context/MediqContext';
import { playPhoneRingCadence, speakMotherVoice } from '../../utils/audioEffects';

interface DialogueTurn {
  sender: 'mother' | 'doctor';
  text: string;
  time: string;
}

export const MediqCallModal: React.FC = () => {
  const { isCallModalOpen, setIsCallModalOpen, addAuditLog, userRole, currentPatient, currentClinician } = useMediq();

  const [callState, setCallState] = useState<'connecting' | 'ringing' | 'connected' | 'ended'>('connecting');
  const [seconds, setSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<DialogueTurn[]>([]);
  const stopRingRef = useRef<(() => void) | null>(null);

  // Initialize and run sequence
  useEffect(() => {
    if (!isCallModalOpen) {
      if (stopRingRef.current) stopRingRef.current();
      window.speechSynthesis?.cancel();
      setCallState('connecting');
      setSeconds(0);
      setTranscript([]);
      setIsSpeaking(false);
      return;
    }

    // Step 1: Connecting (0.8s)
    const t1 = setTimeout(() => {
      setCallState('ringing');
      // Play real audio ring cadence
      stopRingRef.current = playPhoneRingCadence();
    }, 800);

    // Step 2: Answered (3.2s)
    const t2 = setTimeout(() => {
      if (stopRingRef.current) stopRingRef.current();
      setCallState('connected');

      const initialMotherLine = `Hello? Who is this? I am Aarav's mother Sunita! Is my son Aarav okay?! Where is he?!`;
      setTranscript([
        {
          sender: 'mother',
          text: initialMotherLine,
          time: new Date().toLocaleTimeString('en-US', { hour12: false, minute: '2-digit', second: '2-digit' }),
        },
      ]);

      setIsSpeaking(true);
      speakMotherVoice(initialMotherLine, () => {
        setIsSpeaking(false);
      });

      addAuditLog({
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' IST',
        actor: `${currentClinician.name} (${currentClinician.nmcRegistrationNumber})`,
        role: 'Attending Physician',
        action: `Encrypted audio proxy tunnel bridged with next-of-kin (${currentPatient.emergencyContact.name})`,
        dataAccessed: 'Virtual telecom bridge: +91 •••••• 4821 (Real Number Hidden)',
        reason: 'Emergency trauma notification and next-of-kin verification protocol',
        severity: 'normal',
      });
    }, 3200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      if (stopRingRef.current) stopRingRef.current();
      window.speechSynthesis?.cancel();
    };
  }, [isCallModalOpen]);

  // Call duration counter
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
    if (stopRingRef.current) stopRingRef.current();
    window.speechSynthesis?.cancel();
    setCallState('ended');
    setTimeout(() => {
      setIsCallModalOpen(false);
    }, 400);
  };

  const handleDoctorSpeak = (doctorText: string, motherReply: string) => {
    setTranscript((prev) => [
      ...prev,
      {
        sender: 'doctor',
        text: doctorText,
        time: new Date().toLocaleTimeString('en-US', { hour12: false, minute: '2-digit', second: '2-digit' }),
      },
    ]);

    setTimeout(() => {
      setTranscript((prev) => [
        ...prev,
        {
          sender: 'mother',
          text: motherReply,
          time: new Date().toLocaleTimeString('en-US', { hour12: false, minute: '2-digit', second: '2-digit' }),
        },
      ]);
      setIsSpeaking(true);
      speakMotherVoice(motherReply, () => {
        setIsSpeaking(false);
      });
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-neutral-950 text-white rounded-3xl max-w-md w-full p-6 border border-neutral-800 shadow-2xl relative overflow-hidden flex flex-col max-h-[92vh]">
        {/* Ambient pulse glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#FFB800]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Controls */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-900 border border-neutral-700/80 text-[10px] font-mono text-emerald-400 font-bold">
            <Lock className="w-3 h-3 text-[#FFB800]" />
            <span>MASKED PROXY TUNNEL &bull; NO NUMBER LEAK</span>
          </div>

          <button
            onClick={handleEndCall}
            className="text-neutral-400 hover:text-white p-1 rounded-full hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contact Info Header */}
        <div className="text-center py-4">
          <div className="relative mx-auto w-20 h-20 mb-3 flex items-center justify-center">
            {callState === 'connected' && (
              <div
                className={`absolute inset-0 rounded-full border-2 border-emerald-400 transition-all ${
                  isSpeaking ? 'animate-ping scale-110 opacity-75' : 'animate-pulse'
                }`}
              />
            )}
            {callState === 'ringing' && (
              <div className="absolute inset-0 rounded-full border-2 border-[#FFB800] animate-ping" />
            )}
            <div className="w-18 h-18 rounded-full bg-neutral-900 border-2 border-neutral-700 flex items-center justify-center text-xl font-black text-[#FFB800] shadow-xl">
              {currentPatient.emergencyContact.name.split(' ').map((n) => n[0]).join('')}
            </div>
          </div>

          <h3 className="text-lg font-black text-white tracking-tight">
            {currentPatient.emergencyContact.name}
          </h3>
          <p className="text-xs text-neutral-400 font-mono mt-0.5">
            {currentPatient.emergencyContact.relationship} &bull; {currentPatient.emergencyContact.maskedPhone}
          </p>

          {/* Status Display */}
          <div className="mt-2 flex items-center justify-center gap-2 font-mono text-xs">
            {callState === 'connecting' && (
              <span className="text-amber-400 font-bold flex items-center gap-1.5 animate-pulse">
                <Radio className="w-3.5 h-3.5" />
                <span>Routing through Anonymous VoIP Bridge...</span>
              </span>
            )}
            {callState === 'ringing' && (
              <span className="text-[#FFB800] font-bold flex items-center gap-1.5 animate-bounce">
                <Volume2 className="w-3.5 h-3.5" />
                <span>Ringing Family Handset (Cadence Active)...</span>
              </span>
            )}
            {callState === 'connected' && (
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-emerald-400 font-bold">CONNECTED ({formatTimer(seconds)})</span>
              </div>
            )}
          </div>
        </div>

        {/* Live Audio Visualizer Bars (Dancing when speaking) */}
        {callState === 'connected' && (
          <div className="flex items-center justify-center gap-1 h-8 my-2 px-6">
            {[14, 28, 45, 20, 50, 30, 60, 24, 40, 55, 18, 35].map((h, i) => (
              <div
                key={i}
                style={{
                  height: isSpeaking ? `${Math.max(15, (h * (seconds % 3 + 1)) % 32)}px` : '4px',
                  transition: 'height 0.12s ease-in-out',
                }}
                className={`w-1 rounded-full ${
                  isSpeaking ? 'bg-[#FFB800]' : 'bg-neutral-700'
                }`}
              />
            ))}
          </div>
        )}

        {/* Live Subtitle Transcript Box */}
        {callState === 'connected' && (
          <div className="flex-1 overflow-y-auto max-h-40 bg-neutral-900/90 rounded-2xl p-3 border border-neutral-800 space-y-2 text-left my-2 font-sans">
            <div className="text-[10px] font-mono text-neutral-500 uppercase font-bold flex items-center justify-between pb-1 border-b border-neutral-800">
              <span>Live Dialogue &bull; Real Audio Active</span>
              {isSpeaking && <span className="text-amber-400 animate-pulse">&bull; Mother Speaking</span>}
            </div>

            {transcript.map((t, idx) => (
              <div
                key={idx}
                className={`text-xs p-2 rounded-xl ${
                  t.sender === 'mother'
                    ? 'bg-amber-950/40 text-amber-200 border border-amber-900/50'
                    : 'bg-emerald-950/40 text-emerald-200 border border-emerald-900/50 ml-4'
                }`}
              >
                <div className="text-[10px] font-mono font-bold opacity-75 mb-0.5">
                  {t.sender === 'mother' ? 'Sunita (Mother):' : 'Dr. Sharma (AIIMS ER):'}
                </div>
                <div>{t.text}</div>
              </div>
            ))}
          </div>
        )}

        {/* Interactive Response Triggers for Clinician */}
        {callState === 'connected' && (
          <div className="space-y-1.5 pt-2">
            <span className="text-[10px] font-mono text-neutral-400 font-bold uppercase block text-left">
              Quick Doctor Audio Response (Simulate live talk):
            </span>
            <div className="grid grid-cols-1 gap-1.5 text-left">
              <button
                type="button"
                onClick={() =>
                  handleDoctorSpeak(
                    "Sunita ji, this is Dr. Sharma from AIIMS Trauma Bay. Aarav is stable and under acute resuscitation.",
                    "Oh God, thank you doctor! I am rushing to AIIMS Trauma right now! Please take care of him!"
                  )
                }
                className="text-left text-[11px] p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700/80 transition-colors"
              >
                🗣️ "Sunita ji, Aarav is stable at AIIMS Trauma Bay..."
              </button>

              <button
                type="button"
                onClick={() =>
                  handleDoctorSpeak(
                    "We need to confirm: does Aarav have a documented Penicillin anaphylaxis allergy?",
                    "YES doctor! In 2018 he had a severe anaphylactic reaction to Penicillin! Do NOT give Penicillin!"
                  )
                }
                className="text-left text-[11px] p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700/80 transition-colors"
              >
                ⚠️ "Confirming: Does Aarav have a Penicillin allergy?"
              </button>
            </div>
          </div>
        )}

        {/* Bottom Call Controls */}
        <div className="flex items-center justify-center gap-4 pt-4 mt-auto border-t border-neutral-800">
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              isMuted ? 'bg-amber-500 text-black' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <button
            type="button"
            onClick={handleEndCall}
            className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};
