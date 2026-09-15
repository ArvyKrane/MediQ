import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  ScreenId,
  UserRole,
  IdentityCandidate,
  ClinicalTrustBreakdown,
  MedicalRecordSource,
  AuditEntry,
} from '../types/mediq';

interface MediqState {
  // Navigation & Flow
  currentScreen: ScreenId;
  setCurrentScreen: (screen: ScreenId) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isOffline: boolean;
  setIsOffline: (offline: boolean) => void;

  // Identity State (C_id)
  identityStatus: 'UNKNOWN' | 'SCANNING' | 'MATCHED' | 'VERIFIED';
  identityConfidence: number;
  fingerprintVerified: boolean;
  activeCandidate: IdentityCandidate;
  candidates: IdentityCandidate[];
  startFaceScan: () => void;
  verifyFingerprint: () => void;
  confirmIdentity: () => void;
  resetIdentity: () => void;

  // Clinical Trust State (C_clin)
  clinicalTrustScore: number;
  clinicalTrustBreakdown: ClinicalTrustBreakdown;
  recordSources: MedicalRecordSource[];
  isConflictLocked: boolean;
  isConflictResolved: boolean;
  resolvedBloodGroup: string;
  lockConflict: () => void;
  resolveConflict: (chosenBloodGroup: string) => void;

  // Emergency Contact & Communication
  isCallModalOpen: boolean;
  setIsCallModalOpen: (open: boolean) => void;
  isContactShared: boolean;
  setIsContactShared: (shared: boolean) => void;

  // Break Glass
  isBreakGlassModalOpen: boolean;
  setIsBreakGlassModalOpen: (open: boolean) => void;
  hasBreakGlassActive: boolean;
  breakGlassReason: string;
  triggerBreakGlass: (reason: string, durationMinutes: number) => void;

  // Evidence Drawer
  selectedEvidenceItem: string | null;
  setSelectedEvidenceItem: (item: string | null) => void;

  // Audit Logs
  auditLogs: AuditEntry[];
  addAuditLog: (entry: Omit<AuditEntry, 'id' | 'hash'>) => void;

  // Offline Verification
  offlineSignatureVerified: boolean;
  verifyOfflineSignature: () => void;
  syncOfflineData: () => void;
  lastSyncTime: string;

  // Quick Demo Journey
  isDemoPlaying: boolean;
  setIsDemoPlaying: (playing: boolean) => void;
  goToNextDemoStep: () => void;
  goToPrevDemoStep: () => void;
  demoStepIndex: number;
}

const initialCandidates: IdentityCandidate[] = [
  {
    id: 'CAND-0192',
    name: 'Aarav Mehta',
    candidateCode: 'MED-0192',
    faceMatchScore: 94.2,
    fingerprintStatus: 'Pending',
    dob: '14 Aug 2005',
    gender: 'Male (21y)',
    nationalIdMasked: 'IND-••••-••••-8924',
    registrationDate: '12 Jan 2024 (Apollo ER)',
  },
  {
    id: 'CAND-0205',
    name: 'Arjun Mehta',
    candidateCode: 'MED-0841',
    faceMatchScore: 71.8,
    fingerprintStatus: 'Unmatched',
    dob: '02 Mar 1999',
    gender: 'Male (27y)',
    nationalIdMasked: 'IND-••••-••••-1104',
    registrationDate: '19 Oct 2023 (Fortis Trauma)',
  },
  {
    id: 'CAND-0311',
    name: 'Unconfirmed Match',
    candidateCode: 'MED-0000',
    faceMatchScore: 43.1,
    fingerprintStatus: 'Unmatched',
    dob: 'Est. 2000-2005',
    gender: 'Male',
    nationalIdMasked: 'NOT_FOUND',
    registrationDate: 'N/A',
  },
];

const initialSources: MedicalRecordSource[] = [
  {
    id: 'src-1',
    sourceName: 'Apollo Speciality Hospital',
    institutionType: 'Tier-1 Tertiary Trauma Care',
    bloodGroup: 'B+',
    confidence: 'High',
    recordedDate: '2025-11-14 09:22 IST',
    verifiedBy: 'Dr. R. Sengupta (Chief Hematologist)',
    hash: 'sha256:8f7e2c90a1...b4e',
    notes: 'Pre-operative cross-match verified. Dual antibody screen negative.',
  },
  {
    id: 'src-2',
    sourceName: 'Fortis Memorial Hospital',
    institutionType: 'Regional Hospital Network',
    bloodGroup: 'O+',
    confidence: 'High',
    recordedDate: '2023-04-18 17:40 IST',
    verifiedBy: 'Dr. K. Verma (Emergency Attending)',
    hash: 'sha256:1a4b88d3e9...07c',
    notes: 'Emergency admission intake record. Note: Patient presented semi-conscious; donor card transcription logged.',
  },
  {
    id: 'src-3',
    sourceName: 'Apex Diagnostic & Pathology Center',
    institutionType: 'Accredited NABL Diagnostic Lab',
    bloodGroup: 'B+',
    confidence: 'Medium',
    recordedDate: '2025-06-02 11:15 IST',
    verifiedBy: 'Dr. V. Nambiar (Pathology Dir.)',
    hash: 'sha256:6e031b28fd...9fa',
    notes: 'Routine comprehensive metabolic & serology panel report.',
  },
];

const initialAuditLogs: AuditEntry[] = [
  {
    id: 'aud-1',
    timestamp: '23:41:18 IST',
    actor: 'Dr. Sharma',
    role: 'Attending ER Physician (Apex Trauma)',
    action: 'Accessed verified clinical history & allergy profile',
    dataAccessed: 'Penicillin Allergy, Asthma history, Blood Group status',
    reason: 'Emergency acute stabilization protocol',
    hash: '0x94f...21c',
    severity: 'normal',
  },
  {
    id: 'aud-2',
    timestamp: '23:38:42 IST',
    actor: 'Paramedic Rao (Unit 4)',
    role: 'Ambulance EMS / Rapid Response',
    action: 'Accessed Emergency Snapshot & encrypted contact proxy',
    dataAccessed: 'Candidate ID CAND-0192, vitals buffer, masked proxy',
    reason: 'En-route trauma field care',
    hash: '0x71a...88e',
    severity: 'normal',
  },
  {
    id: 'aud-3',
    timestamp: '23:34:05 IST',
    actor: 'MEDIQ Trust Engine',
    role: 'Biometric Verification Subsystem',
    action: 'Identity verified via FaceScan + Fingerprint sensor',
    dataAccessed: 'C_id recalculated to 94.2% (Threshold: 90%)',
    reason: 'Multi-factor biometric validation sequence',
    hash: '0x32e...09d',
    severity: 'normal',
  },
  {
    id: 'aud-4',
    timestamp: '23:32:19 IST',
    actor: 'MEDIQ Sensor Gateway',
    role: 'Edge Device (EMS Rig #12)',
    action: 'Candidate generated from multimodal matching pipeline',
    dataAccessed: 'CAND-0192 (Aarav Mehta) face vector matched',
    reason: 'Initial emergency scene intake',
    hash: '0x15b...44a',
    severity: 'normal',
  },
];

const DEMO_STEPS: ScreenId[] = [
  'emergency-landing',
  'patient-identification',
  'identity-verification',
  'clinical-trust',
  'emergency-contact',
  'patient-profile',
  'doctor-dashboard',
  'access-control',
  'audit-log',
  'offline-mode',
];

const MediqContext = createContext<MediqState | undefined>(undefined);

export const MediqProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('emergency-landing');
  const [userRole, setUserRole] = useState<UserRole>('doctor');
  const [isOffline, setIsOffline] = useState<boolean>(false);

  // Identity
  const [identityStatus, setIdentityStatus] = useState<'UNKNOWN' | 'SCANNING' | 'MATCHED' | 'VERIFIED'>('UNKNOWN');
  const [identityConfidence, setIdentityConfidence] = useState<number>(94.2);
  const [fingerprintVerified, setFingerprintVerified] = useState<boolean>(false);
  const [candidates] = useState<IdentityCandidate[]>(initialCandidates);
  const [activeCandidate] = useState<IdentityCandidate>(initialCandidates[0]);

  // Clinical Trust
  const [clinicalTrustScore, setClinicalTrustScore] = useState<number>(71); // Starts at 71 before conflict resolution, reaches 87
  const [recordSources] = useState<MedicalRecordSource[]>(initialSources);
  const [isConflictLocked, setIsConflictLocked] = useState<boolean>(false);
  const [isConflictResolved, setIsConflictResolved] = useState<boolean>(false);
  const [resolvedBloodGroup, setResolvedBloodGroup] = useState<string>('B+');

  const clinicalTrustBreakdown: ClinicalTrustBreakdown = {
    overallScore: isConflictResolved ? 87 : 71,
    sourceReliability: 92,
    crossValidation: isConflictResolved ? 89 : 68,
    recency: 76,
    consistency: isConflictResolved ? 91 : 62,
    temporalValidity: 88,
    provenance: 94,
  };

  // Modals & Drawers
  const [isCallModalOpen, setIsCallModalOpen] = useState<boolean>(false);
  const [isContactShared, setIsContactShared] = useState<boolean>(false);
  const [isBreakGlassModalOpen, setIsBreakGlassModalOpen] = useState<boolean>(false);
  const [hasBreakGlassActive, setHasBreakGlassActive] = useState<boolean>(false);
  const [breakGlassReason, setBreakGlassReason] = useState<string>('');
  const [selectedEvidenceItem, setSelectedEvidenceItem] = useState<string | null>(null);

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>(initialAuditLogs);

  // Offline
  const [offlineSignatureVerified, setOfflineSignatureVerified] = useState<boolean>(true);
  const [lastSyncTime, setLastSyncTime] = useState<string>('14:32 IST');

  // Demo Tour
  const [isDemoPlaying, setIsDemoPlaying] = useState<boolean>(false);
  const [demoStepIndex, setDemoStepIndex] = useState<number>(0);

  const addAuditLog = (entry: Omit<AuditEntry, 'id' | 'hash'>) => {
    const newLog: AuditEntry = {
      ...entry,
      id: `aud-${Date.now()}`,
      hash: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 5)}`,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const startFaceScan = () => {
    setIdentityStatus('SCANNING');
    setTimeout(() => {
      setIdentityStatus('MATCHED');
      setCurrentScreen('patient-identification');
      addAuditLog({
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' IST',
        actor: 'Facial Biometric Array (Rig #12)',
        role: 'Autonomous Sensor Pipeline',
        action: 'Analyzed facial vector against Aadhaar/Hospital master registry',
        dataAccessed: 'Candidate Aarav Mehta (CAND-0192) identified at 94.2% match',
        reason: 'Emergency scene unconscious patient scan',
        severity: 'normal',
      });
    }, 1800);
  };

  const verifyFingerprint = () => {
    setFingerprintVerified(true);
    addAuditLog({
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' IST',
      actor: 'BioLock Scanner v3',
      role: 'Hardware Enclave',
      action: 'Capacitive fingerprint match validated (Minutiae count: 68)',
      dataAccessed: 'Biometric template MED-0192 match confirmed',
      reason: 'Dual-factor patient identification',
      severity: 'normal',
    });
  };

  const confirmIdentity = () => {
    setIdentityStatus('VERIFIED');
    setFingerprintVerified(true);
    setIdentityConfidence(94.2);
    addAuditLog({
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' IST',
      actor: 'Clinician / EMS Lead',
      role: 'Authorized Verifier',
      action: 'Confirmed Aarav Mehta (MED-0192) patient identity binding',
      dataAccessed: 'Full demographic & health ID token unlocked for C_clin check',
      reason: 'Multi-source biometric verification confirmed',
      severity: 'normal',
    });
  };

  const resetIdentity = () => {
    setIdentityStatus('UNKNOWN');
    setFingerprintVerified(false);
    setIsConflictResolved(false);
    setIsConflictLocked(false);
    setClinicalTrustScore(71);
  };

  const lockConflict = () => {
    setIsConflictLocked(true);
    addAuditLog({
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' IST',
      actor: 'MEDIQ Safety Sentinel',
      role: 'Automated Clinical Safety System',
      action: 'LOCKED blood group field (B+ vs O+) to prevent fatal transfusion error',
      dataAccessed: 'Blood group marked DISPUTED. Transfusion orders blocked pending lab confirmation',
      reason: 'Conflicting medical records from Hospital A and Hospital B',
      severity: 'critical',
    });
  };

  const resolveConflict = (chosenBloodGroup: string) => {
    setIsConflictResolved(true);
    setResolvedBloodGroup(chosenBloodGroup);
    setClinicalTrustScore(87);
    addAuditLog({
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' IST',
      actor: 'Dr. Sharma (Attending)',
      role: 'Senior ER Physician',
      action: `Clinical confirmation overridden: Verified blood group as ${chosenBloodGroup} via bedside stat bed-side crossmatch`,
      dataAccessed: `Blood group finalized to ${chosenBloodGroup}. C_clin elevated to 87%`,
      reason: 'Direct clinician verification & bedside blood agglutination test',
      severity: 'warning',
    });
  };

  const triggerBreakGlass = (reason: string, durationMinutes: number) => {
    setHasBreakGlassActive(true);
    setBreakGlassReason(reason);
    setIsBreakGlassModalOpen(false);
    addAuditLog({
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' IST',
      actor: `${userRole.toUpperCase()} (Break-Glass Protocol)`,
      role: 'Emergency Override Authority',
      action: `BREAK-GLASS access granted for ${durationMinutes} minutes: ${reason}`,
      dataAccessed: 'Full decrypted patient dossier including unverified historical files',
      reason: `Immediate life-threatening scenario: ${reason}`,
      severity: 'critical',
    });
  };

  const verifyOfflineSignature = () => {
    setOfflineSignatureVerified(true);
    addAuditLog({
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' IST',
      actor: 'Offline Cryptographic Sentinel',
      role: 'Hardware Security Module',
      action: 'Emergency bundle ECDSA P-256 signature verified against Ministry of Health root certificate',
      dataAccessed: 'Offline emergency cache integrity verified (Checksum valid)',
      reason: 'Zero-connectivity emergency triage',
      severity: 'normal',
    });
  };

  const syncOfflineData = () => {
    const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ' IST';
    setLastSyncTime(now);
    addAuditLog({
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' IST',
      actor: 'MEDIQ Sync Node',
      role: 'Gateway Relay',
      action: 'Synchronized offline field treatment events with cloud ledger',
      dataAccessed: 'Transmitted field vitals and admin audit stamps',
      reason: 'Network connectivity restored',
      severity: 'normal',
    });
  };

  // Demo step synchronization
  useEffect(() => {
    const idx = DEMO_STEPS.indexOf(currentScreen);
    if (idx !== -1) {
      setDemoStepIndex(idx);
    }
  }, [currentScreen]);

  const goToNextDemoStep = () => {
    const nextIdx = (demoStepIndex + 1) % DEMO_STEPS.length;
    setDemoStepIndex(nextIdx);
    setCurrentScreen(DEMO_STEPS[nextIdx]);
  };

  const goToPrevDemoStep = () => {
    const prevIdx = (demoStepIndex - 1 + DEMO_STEPS.length) % DEMO_STEPS.length;
    setDemoStepIndex(prevIdx);
    setCurrentScreen(DEMO_STEPS[prevIdx]);
  };

  return (
    <MediqContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        userRole,
        setUserRole,
        isOffline,
        setIsOffline,

        identityStatus,
        identityConfidence,
        fingerprintVerified,
        activeCandidate,
        candidates,
        startFaceScan,
        verifyFingerprint,
        confirmIdentity,
        resetIdentity,

        clinicalTrustScore,
        clinicalTrustBreakdown,
        recordSources,
        isConflictLocked,
        isConflictResolved,
        resolvedBloodGroup,
        lockConflict,
        resolveConflict,

        isCallModalOpen,
        setIsCallModalOpen,
        isContactShared,
        setIsContactShared,

        isBreakGlassModalOpen,
        setIsBreakGlassModalOpen,
        hasBreakGlassActive,
        breakGlassReason,
        triggerBreakGlass,

        selectedEvidenceItem,
        setSelectedEvidenceItem,

        auditLogs,
        addAuditLog,

        offlineSignatureVerified,
        verifyOfflineSignature,
        syncOfflineData,
        lastSyncTime,

        isDemoPlaying,
        setIsDemoPlaying,
        goToNextDemoStep,
        goToPrevDemoStep,
        demoStepIndex,
      }}
    >
      {children}
    </MediqContext.Provider>
  );
};

export const useMediq = () => {
  const context = useContext(MediqContext);
  if (!context) {
    throw new Error('useMediq must be used within a MediqProvider');
  }
  return context;
};
