import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  ScreenId,
  UserRole,
  IdentityCandidate,
  ClinicalTrustBreakdown,
  MedicalRecordSource,
  PatientProfile,
  InsuranceShieldState,
  AuditEntry,
  ScanInputMethod,
  ClinicianProfile,
} from '../types/mediq';

interface MediqState {
  // Navigation & Role
  currentScreen: ScreenId;
  setCurrentScreen: (screen: ScreenId) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isOffline: boolean;
  setIsOffline: (offline: boolean) => void;

  // Active Clinician (Doctor / Paramedic Profile under NMC & ABDM HPR)
  currentClinician: ClinicianProfile;
  availableClinicians: ClinicianProfile[];
  setCurrentClinician: (clinician: ClinicianProfile) => void;
  isDoctorCardOpen: boolean;
  setIsDoctorCardOpen: (open: boolean) => void;

  // Active Patient Profile & Multi-patient switcher
  currentPatient: PatientProfile;
  availablePatients: PatientProfile[];
  selectPatientByAbha: (abhaIdOrNumber: string) => boolean;
  selectPatient: (patient: PatientProfile) => void;
  lastEnrolledId: string | null;
  registerPatient: (patient: PatientProfile) => void;
  isRegisterModalOpen: boolean;
  setIsRegisterModalOpen: (open: boolean) => void;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;

  // Input & Verification State (No NFC - Face, Fingerprint, ID Card)
  activeInputMethod: ScanInputMethod | null;
  setActiveInputMethod: (method: ScanInputMethod | null) => void;
  isScanning: boolean;
  scanningStage: string;
  identityStatus: 'UNKNOWN' | 'SCANNING' | 'MATCHED' | 'VERIFIED';
  identityConfidence: number;
  fingerprintVerified: boolean;
  idCardVerified: boolean;
  activeCandidate: IdentityCandidate;
  candidates: IdentityCandidate[];
  capturedPhotoUrl: string | null;
  setCapturedPhotoUrl: (url: string | null) => void;
  useLiveCamera: boolean;
  setUseLiveCamera: (val: boolean) => void;

  // Biometric & ID Scanners (resolves to ABHA ID)
  scanFace: () => void;
  scanFingerprint: () => void;
  scanIdCard: () => void;
  confirmIdentity: () => void;
  resetEmergencyIntake: () => void;

  // Clinical Trust & Conflict Handling (Plain English)
  clinicalTrustScore: number;
  clinicalTrustBreakdown: ClinicalTrustBreakdown;
  recordSources: MedicalRecordSource[];
  isConflictLocked: boolean;
  isConflictResolved: boolean;
  resolvedBloodGroup: string;
  lockConflict: () => void;
  resolveConflict: (chosenBloodGroup: string) => void;

  // ABDM Gateway Live Simulation
  isAbdmFetching: boolean;
  abdmFetchStatus: string;
  fetchAbdmRecords: (abhaId: string) => void;

  // Insurance Privacy Shield
  insuranceShield: InsuranceShieldState;
  isInsuranceModalOpen: boolean;
  setIsInsuranceModalOpen: (open: boolean) => void;

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

  // Evidence / Explainability Drawer
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

  // Guided Demo Tour
  isDemoPlaying: boolean;
  setIsDemoPlaying: (playing: boolean) => void;
  goToNextDemoStep: () => void;
  goToPrevDemoStep: () => void;
  demoStepIndex: number;
}

const DEMO_PATIENTS: PatientProfile[] = [
  {
    id: 'MED-0777',
    name: 'Atharv Bodkhe',
    abhaId: 'atharv.bodkhe@abdm',
    abhaNumber: '91-9988-7766-5544',
    age: 22,
    gender: 'Male',
    dob: '05 May 2004',
    maskedGovId: 'Aadhaar: •••• •••• 9924',
    photoUrl: '/user_face.png',
    bloodGroup: 'B+',
    hasBloodGroupConflict: false,
    bloodGroupSources: [
      {
        id: 'src-ak-1',
        sourceName: 'AIIMS Apex Trauma Center',
        institutionType: 'National Health Authority',
        bloodGroup: 'B+',
        confidence: 'High',
        recordedDate: '01 Oct 2025',
        verifiedBy: 'Dr. Rajiv Sharma (Attending)',
        hash: 'sha256:4a9c1e...88f',
        notes: 'ABDM biometric linked with Aadhaar FaceRD live capture.',
      },
    ],
    allergies: [
      { name: 'Dust Allergies', severity: 'Mild', verified: true, source: 'Citizen Self-Declaration' },
    ],
    medications: [],
    acuteConditions: [
      { name: 'Active Trauma Registry', notes: 'Live face registered in local ABDM repository', verified: true },
    ],
    emergencyContact: {
      name: 'Emergency Next-of-Kin',
      relationship: 'Family Member',
      maskedPhone: '+91 •••••• 9924',
      isVerified: true,
    },
    linkedHospitals: [
      { name: 'AIIMS New Delhi', type: 'Apex Trauma', lastSync: 'Today', recordsShared: 3 },
      { name: 'Apollo Emergency', type: 'Ambulance Network', lastSync: '1 hour ago', recordsShared: 2 },
    ],
    shieldedRecordsCount: 6,
    shieldedCategories: ['OPD checkup logs', 'Dental cleaning record'],
  },
  {
    id: 'MED-0192',
    name: 'Aarav Mehta',
    abhaId: 'aarav.mehta@abdm',
    abhaNumber: '91-8291-3829-1920',
    age: 21,
    gender: 'Male',
    dob: '14 Aug 2005',
    maskedGovId: 'Aadhaar: •••• •••• 8924',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    bloodGroup: 'B+',
    hasBloodGroupConflict: true,
    bloodGroupSources: [
      {
        id: 'src-1',
        sourceName: 'Apollo Hospital (Delhi)',
        institutionType: 'Tertiary Trauma Center',
        bloodGroup: 'B+',
        confidence: 'High',
        recordedDate: '14 Nov 2025',
        verifiedBy: 'Dr. R. Sengupta (Chief Hematologist)',
        hash: 'sha256:8f7e2c90a1...b4e',
        notes: 'Pre-op cross match verified. Dual antibody screen negative.',
      },
      {
        id: 'src-2',
        sourceName: 'Fortis Memorial Research Institute',
        institutionType: 'Regional Hospital Network',
        bloodGroup: 'O+',
        confidence: 'High',
        recordedDate: '18 Apr 2023',
        verifiedBy: 'Dr. K. Verma (ER Attending)',
        hash: 'sha256:1a4b88d3e9...07c',
        notes: 'Emergency intake record. Transcribed from older donor slip.',
      },
      {
        id: 'src-3',
        sourceName: 'Apex Diagnostic & Pathology Lab',
        institutionType: 'NABL Certified Diagnostic Center',
        bloodGroup: 'B+',
        confidence: 'Medium',
        recordedDate: '02 Jun 2025',
        verifiedBy: 'Dr. V. Nambiar (Pathology Dir.)',
        hash: 'sha256:6e031b28fd...9fa',
        notes: 'Routine blood group serology test.',
      },
    ],
    allergies: [
      {
        name: 'Penicillin',
        severity: 'Severe',
        verified: true,
        source: 'Fortis ER (2023) — Severe Anaphylaxis reaction',
      },
    ],
    medications: [
      {
        name: 'Salbutamol Inhaler',
        dosage: '100mcg',
        frequency: 'As needed (PRN)',
        verified: true,
      },
      {
        name: 'Levocetirizine',
        dosage: '5mg',
        frequency: 'Nightly',
        verified: false,
      },
    ],
    acuteConditions: [
      {
        name: 'Bronchial Asthma (Mild)',
        notes: 'Airway hyper-reactivity. Keep bronchodilator on standby.',
        verified: true,
      },
    ],
    emergencyContact: {
      name: 'Priya Mehta',
      relationship: 'Mother',
      maskedPhone: '+91 •••••• 4821',
      isVerified: true,
    },
    linkedHospitals: [
      { name: 'Apollo Hospital', type: 'Trauma & Surgery', lastSync: '14 Nov 2025', recordsShared: 4 },
      { name: 'Fortis Memorial', type: 'Pediatric Care', lastSync: '18 Apr 2023', recordsShared: 3 },
      { name: 'Apex Diagnostics', type: 'Pathology Lab', lastSync: '02 Jun 2025', recordsShared: 2 },
    ],
    shieldedRecordsCount: 14,
    shieldedCategories: [
      '2 Past Dental Extractions & Orthodontics',
      'Childhood Viral Fever Consultation notes (2018, 2021)',
      '1 Minor Sports Ankle Sprain X-Ray (2022)',
      'Routine Outpatient Dermatology checkup notes',
    ],
  },
  {
    id: 'MED-0442',
    name: 'Priya Sharma',
    abhaId: 'priya.sharma@abdm',
    abhaNumber: '91-4412-9903-8821',
    age: 34,
    gender: 'Female',
    dob: '22 Feb 1992',
    maskedGovId: 'Driving License: •••• •••• 1943',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    bloodGroup: 'A+',
    hasBloodGroupConflict: false,
    bloodGroupSources: [
      {
        id: 'src-ps-1',
        sourceName: 'Max Super Speciality Hospital',
        institutionType: 'Cardiac Center',
        bloodGroup: 'A+',
        confidence: 'High',
        recordedDate: '10 Aug 2025',
        verifiedBy: 'Dr. A. Khurana',
        hash: 'sha256:77bc01...88a',
        notes: 'Pre-procedural crossmatch verified.',
      },
    ],
    allergies: [
      { name: 'Penicillin', severity: 'Severe', verified: true, source: 'Max Hospital' },
      { name: 'Latex Gloves', severity: 'Moderate', verified: true, source: 'Allergy Clinic' },
    ],
    medications: [
      { name: 'Metoprolol Succinate', dosage: '25mg', frequency: 'Daily (Morning)', verified: true },
    ],
    acuteConditions: [
      { name: 'Dual Chamber Pacemaker Fitted', notes: 'Fitted Nov 2023. MRI unsafe without protocol.', verified: true },
    ],
    emergencyContact: {
      name: 'Vikram Sharma',
      relationship: 'Husband',
      maskedPhone: '+91 •••••• 1943',
      isVerified: true,
    },
    linkedHospitals: [
      { name: 'Max Super Speciality', type: 'Cardiology', lastSync: '10 Aug 2025', recordsShared: 5 },
    ],
    shieldedRecordsCount: 8,
    shieldedCategories: [
      'Thyroid dosage consultation logs',
      'Mild postpartum anxiety consultation (2020)',
    ],
  },
  {
    id: 'MED-0819',
    name: 'Rajesh Kumar',
    abhaId: 'rajesh.k@abdm',
    abhaNumber: '91-7729-1120-4491',
    age: 58,
    gender: 'Male',
    dob: '10 Nov 1968',
    maskedGovId: 'Voter ID: •••• •••• 7732',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    bloodGroup: 'O+',
    hasBloodGroupConflict: false,
    bloodGroupSources: [
      {
        id: 'src-rk-1',
        sourceName: 'Medanta The Medicity',
        institutionType: 'Cardiovascular Institute',
        bloodGroup: 'O+',
        confidence: 'High',
        recordedDate: '05 Jan 2026',
        verifiedBy: 'Dr. N. Trehan Clinic',
        hash: 'sha256:49c001...23e',
        notes: 'Consistent O+ donor record.',
      },
    ],
    allergies: [
      { name: 'Sulfa Drugs (Sulfonamides)', severity: 'Severe', verified: true, source: 'Medanta Cardiology' },
    ],
    medications: [
      { name: 'Insulin Glargine', dosage: '14 Units', frequency: 'Bedtime', verified: true },
      { name: 'Aspirin (Ecosprin)', dosage: '75mg', frequency: 'Daily', verified: true },
    ],
    acuteConditions: [
      { name: 'Coronary Stent (DES) & Type 2 Diabetes', notes: 'High risk of acute hypoglycemia if fasting.', verified: true },
    ],
    emergencyContact: {
      name: 'Sunita Kumar',
      relationship: 'Wife',
      maskedPhone: '+91 •••••• 7732',
      isVerified: true,
    },
    linkedHospitals: [
      { name: 'Medanta Medicity', type: 'Cardiology', lastSync: '05 Jan 2026', recordsShared: 6 },
    ],
    shieldedRecordsCount: 19,
    shieldedCategories: [
      'Lumbar spondylosis physiotherapy notes',
      'Annual routine lipid profile tests',
    ],
  },
];

const initialCandidates: IdentityCandidate[] = [
  {
    id: 'CAND-0192',
    name: 'Aarav Mehta',
    candidateCode: 'MED-0192',
    abhaId: 'aarav.mehta@abdm',
    abhaNumber: '91-8291-3829-1920',
    faceMatchScore: 94.2,
    fingerprintStatus: 'Pending',
    idCardStatus: 'Pending',
    dob: '14 Aug 2005',
    gender: 'Male (21y)',
    nationalIdMasked: 'Aadhaar: •••• •••• 8924',
    registrationDate: 'Apollo Hospital (2024)',
  },
  {
    id: 'CAND-0205',
    name: 'Arjun Mehta',
    candidateCode: 'MED-0841',
    abhaId: 'arjun.m@abdm',
    abhaNumber: '91-5510-2291-0021',
    faceMatchScore: 71.8,
    fingerprintStatus: 'Unmatched',
    idCardStatus: 'Unmatched',
    dob: '02 Mar 1999',
    gender: 'Male (27y)',
    nationalIdMasked: 'Voter ID: •••• •••• 1104',
    registrationDate: 'Fortis Trauma (2023)',
  },
  {
    id: 'CAND-0311',
    name: 'Unconfirmed Match',
    candidateCode: 'MED-0000',
    abhaId: 'unverified@abdm',
    abhaNumber: '00-0000-0000-0000',
    faceMatchScore: 43.1,
    fingerprintStatus: 'Unmatched',
    idCardStatus: 'Unmatched',
    dob: 'Est. 2000-2005',
    gender: 'Male',
    nationalIdMasked: 'NOT_FOUND',
    registrationDate: 'N/A',
  },
];

const initialAuditLogs: AuditEntry[] = [
  {
    id: 'aud-1',
    timestamp: '23:41 IST',
    actor: 'Dr. Sharma',
    role: 'ER Attending Doctor',
    action: 'Looked up emergency allergy & blood type data',
    dataAccessed: 'Penicillin allergy warning, asthma history',
    reason: 'Immediate trauma resuscitation',
    hash: '0x94f...21c',
    severity: 'normal',
  },
  {
    id: 'aud-2',
    timestamp: '23:38 IST',
    actor: 'Paramedic Rao (Ambulance Unit #4)',
    role: 'Ambulance First Responder',
    action: 'Called patient guardian using private audio proxy',
    dataAccessed: 'Encrypted call token (Phone masked: +91 •••••• 4821)',
    reason: 'Family emergency notification',
    hash: '0x71a...88e',
    severity: 'normal',
  },
  {
    id: 'aud-3',
    timestamp: '23:34 IST',
    actor: 'MEDIQ Gateway',
    role: 'ABHA Resolver',
    action: 'Patient matched via Face + Fingerprint scan',
    dataAccessed: 'Resolved ABHA ID: aarav.mehta@abdm (Accuracy: 94.2%)',
    reason: 'Unconscious patient emergency intake',
    hash: '0x32e...09d',
    severity: 'normal',
  },
  {
    id: 'aud-4',
    timestamp: '23:32 IST',
    actor: 'Ambulance Camera Array',
    role: 'First Responder Device',
    action: 'Face scanned from scene',
    dataAccessed: 'Matched against regional ABHA health registry',
    reason: 'Unidentified roadside trauma intake',
    hash: '0x15b...44a',
    severity: 'normal',
  },
];

const DEFAULT_CLINICIANS: ClinicianProfile[] = [
  {
    id: 'doc-sharma',
    name: 'Dr. Rajiv Sharma',
    qualification: 'MBBS, MD (Emergency Medicine & Critical Care - AIIMS)',
    specialty: 'Apex Trauma Bay Chief & Resuscitation Specialist',
    nmcRegistrationNumber: 'DMC/R/14205',
    stateMedicalCouncil: 'Delhi Medical Council & National Medical Commission (NMC)',
    hpid: '21-8924-1102-3910',
    hprAddress: 'dr.sharma@hpr.abdm',
    facilityName: 'AIIMS New Delhi — Apex Trauma Bay #1',
    facilityHfrId: 'HFR-IN-DL-00192',
    digitalSigningKey: 'SHA256:RSA-4096:NMC-DMC-14205-AUTHENTICATED',
    status: 'ACTIVE & VERIFIED',
    role: 'doctor',
  },
  {
    id: 'emt-rajesh',
    name: 'Rajesh Kumar, EMT-P',
    qualification: 'B.Sc. Emergency Medical Tech, ATLS Certified',
    specialty: 'Pre-Hospital Trauma Triage & Resuscitation',
    nmcRegistrationNumber: 'NCAHP/DL/EMT-8819',
    stateMedicalCouncil: 'National Commission for Allied & Healthcare Professions (NCAHP)',
    hpid: '14-5510-9281-4402',
    hprAddress: 'rajesh.k@hpr.abdm',
    facilityName: 'Apollo Emergency Mobile Response Fleet',
    facilityHfrId: 'HFR-IN-MH-00441',
    digitalSigningKey: 'SHA256:RSA-2048:NCAHP-8819-SIG',
    status: 'ACTIVE & VERIFIED',
    role: 'ambulance-ems',
  },
  {
    id: 'doc-ananya',
    name: 'Dr. Ananya Sen',
    qualification: 'MBBS, MS, MCh (Trauma & Acute Care Surgery)',
    specialty: 'Trauma Resuscitation & Emergency Blood Transfusions',
    nmcRegistrationNumber: 'WBMC/2018/3910',
    stateMedicalCouncil: 'West Bengal Medical Council & NMC',
    hpid: '91-3310-4491-0018',
    hprAddress: 'dr.ananya@hpr.abdm',
    facilityName: 'Fortis Memorial Critical Care Center',
    facilityHfrId: 'HFR-IN-HR-00311',
    digitalSigningKey: 'SHA256:RSA-4096:WBMC-3910-SIG',
    status: 'ACTIVE & VERIFIED',
    role: 'doctor',
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

const LOCAL_STORAGE_KEY = 'mediq_registered_patients_v1';
const LAST_ENROLLED_KEY = 'mediq_last_enrolled_patient_id';

const getInitialPatients = (): PatientProfile[] => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed: PatientProfile[] = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Prepend custom registered profiles before demo patients, de-duplicating by ID
        const customOnes = parsed.filter((p) => !DEMO_PATIENTS.some((dp) => dp.id === p.id));
        return [...customOnes, ...DEMO_PATIENTS];
      }
    }
  } catch (e) {
    console.warn('Could not load stored patients from localStorage:', e);
  }
  return DEMO_PATIENTS;
};

export const MediqProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('emergency-landing');
  const [userRole, setUserRole] = useState<UserRole>('doctor');
  const [isOffline, setIsOffline] = useState<boolean>(false);

  // Clinician Profiles (NMC & ABDM HPR)
  const [availableClinicians, setAvailableClinicians] = useState<ClinicianProfile[]>(DEFAULT_CLINICIANS);
  const [currentClinician, setCurrentClinician] = useState<ClinicianProfile>(DEFAULT_CLINICIANS[0]);
  const [isDoctorCardOpen, setIsDoctorCardOpen] = useState<boolean>(false);

  // Patients (persisted across reloads)
  const [availablePatients, setAvailablePatients] = useState<PatientProfile[]>(getInitialPatients);
  const [lastEnrolledId, setLastEnrolledId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(LAST_ENROLLED_KEY);
    } catch {
      return null;
    }
  });
  const [currentPatient, setCurrentPatient] = useState<PatientProfile>(() => {
    const list = getInitialPatients();
    return list[0] || DEMO_PATIENTS[0];
  });
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState<boolean>(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);

  // Scanning inputs: No NFC! Strictly Face, Fingerprint, ID Card
  const [activeInputMethod, setActiveInputMethod] = useState<ScanInputMethod | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanningStage, setScanningStage] = useState<string>('');
  const [identityStatus, setIdentityStatus] = useState<'UNKNOWN' | 'SCANNING' | 'MATCHED' | 'VERIFIED'>('UNKNOWN');
  const [identityConfidence, setIdentityConfidence] = useState<number>(94.2);
  const [fingerprintVerified, setFingerprintVerified] = useState<boolean>(false);
  const [idCardVerified, setIdCardVerified] = useState<boolean>(false);
  const [candidates] = useState<IdentityCandidate[]>(initialCandidates);
  const [activeCandidate] = useState<IdentityCandidate>(initialCandidates[0]);
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState<string | null>(null);
  const [useLiveCamera, setUseLiveCamera] = useState<boolean>(false);

  // Clinical Trust & Conflict
  const [clinicalTrustScore, setClinicalTrustScore] = useState<number>(71);
  const [isConflictLocked, setIsConflictLocked] = useState<boolean>(false);
  const [isConflictResolved, setIsConflictResolved] = useState<boolean>(false);
  const [resolvedBloodGroup, setResolvedBloodGroup] = useState<string>(currentPatient.bloodGroup);

  const clinicalTrustBreakdown: ClinicalTrustBreakdown = {
    overallScore: isConflictResolved ? 87 : 71,
    sourceReliability: 92,
    crossValidation: isConflictResolved ? 89 : 68,
    recency: 76,
    consistency: isConflictResolved ? 91 : 62,
    temporalValidity: 88,
    provenance: 94,
  };

  // ABDM Gateway Simulation
  const [isAbdmFetching, setIsAbdmFetching] = useState<boolean>(false);
  const [abdmFetchStatus, setAbdmFetchStatus] = useState<string>('Connected to ABDM Live Gateway');

  // Insurance Privacy Shield
  const [insuranceShield, setInsuranceShield] = useState<InsuranceShieldState>({
    isProtectionActive: true,
    purposeCode: 'EMERGENCY_CARE',
    tpaBlockedCount: 3,
    lastBlockedQuery: 'HDFC Ergo TPA query blocked (Reason: Purpose EMERGENCY_CARE restricts commercial access)',
    shieldedPastRecordsCount: currentPatient.shieldedRecordsCount,
  });
  const [isInsuranceModalOpen, setIsInsuranceModalOpen] = useState<boolean>(false);

  // Modals & Drawers
  const [isCallModalOpen, setIsCallModalOpen] = useState<boolean>(false);
  const [isContactShared, setIsContactShared] = useState<boolean>(false);
  const [isBreakGlassModalOpen, setIsBreakGlassModalOpen] = useState<boolean>(false);
  const [hasBreakGlassActive, setHasBreakGlassActive] = useState<boolean>(false);
  const [breakGlassReason, setBreakGlassReason] = useState<string>('');
  const [selectedEvidenceItem, setSelectedEvidenceItem] = useState<string | null>(null);

  // Audit
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>(initialAuditLogs);

  // Offline
  const [offlineSignatureVerified, setOfflineSignatureVerified] = useState<boolean>(true);
  const [lastSyncTime, setLastSyncTime] = useState<string>('14:32 IST');

  // Demo Tour
  const [isDemoPlaying, setIsDemoPlaying] = useState<boolean>(false);
  const [demoStepIndex, setDemoStepIndex] = useState<number>(0);

  // Direct patient selector
  const selectPatient = (patient: PatientProfile) => {
    setCurrentPatient(patient);
    setResolvedBloodGroup(patient.bloodGroup);
    setIsConflictResolved(!patient.hasBloodGroupConflict);
    setClinicalTrustScore(patient.hasBloodGroupConflict ? 71 : 94);
    setInsuranceShield((prev) => ({
      ...prev,
      shieldedPastRecordsCount: patient.shieldedRecordsCount,
    }));
    if (patient.photoUrl) {
      setCapturedPhotoUrl(patient.photoUrl);
    }
    setIdentityConfidence(98.8);
    setIdentityStatus('VERIFIED');
    addAuditLog({
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' IST',
      actor: 'MEDIQ ABDM Gateway',
      role: 'Gateway Relay',
      action: `Retrieved emergency health bundle for ${patient.name} (${patient.abhaId})`,
      dataAccessed: 'Blood group, critical allergies, active medications',
      reason: 'Emergency intake identity match',
      severity: 'normal',
    });
  };

  // Patient selector helper by ID, ABHA ID or Name
  const selectPatientByAbha = (query: string): boolean => {
    const q = query.trim().toLowerCase();
    const found = availablePatients.find(
      (p) =>
        p.id.toLowerCase() === q ||
        p.id.toLowerCase().includes(q) ||
        p.abhaId.toLowerCase().includes(q) ||
        p.abhaNumber.includes(q) ||
        p.name.toLowerCase().includes(q)
    );
    if (found) {
      selectPatient(found);
      return true;
    }
    return false;
  };

  const registerPatient = (patient: PatientProfile) => {
    setAvailablePatients((prev) => {
      const updated = [patient, ...prev.filter((p) => p.id !== patient.id)];
      try {
        const customToSave = updated.filter((p) => p.id.startsWith('MED-REG-') || p.id === 'MED-0777');
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(customToSave));
      } catch (e) {
        console.warn('Failed to persist registered patient to localStorage:', e);
      }
      return updated;
    });

    setLastEnrolledId(patient.id);
    try {
      localStorage.setItem(LAST_ENROLLED_KEY, patient.id);
    } catch {}

    selectPatient(patient);
    setIdentityStatus('VERIFIED');

    addAuditLog({
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' IST',
      actor: 'ABDM Citizen e-KYC',
      role: 'Self-Enrollment',
      action: `Created new ABHA ID ${patient.abhaId} with Aadhaar Face e-KYC`,
      dataAccessed: 'Govt Photo ID, Biometric template, Emergency Contacts',
      reason: 'Citizen ABHA Onboarding',
      severity: 'normal',
    });
  };

  const addAuditLog = (entry: Omit<AuditEntry, 'id' | 'hash'>) => {
    const newLog: AuditEntry = {
      ...entry,
      id: `aud-${Date.now()}`,
      hash: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 5)}`,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // 1. Face Scan (Camera -> ABHA)
  const scanFace = () => {
    setActiveInputMethod('face');
    setIsScanning(true);
    setScanningStage('Analyzing face biometrics...');
    setIdentityStatus('SCANNING');

    setTimeout(() => {
      setScanningStage('Matching against national ABHA photo database...');
    }, 800);

    setTimeout(() => {
      setIsScanning(false);
      setIdentityStatus('MATCHED');
      setCurrentScreen('patient-identification');
      addAuditLog({
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' IST',
        actor: 'Ambulance Camera Array',
        role: 'Biometric Scanner',
        action: `Face scan matched ${currentPatient.name} (ABHA: ${currentPatient.abhaId})`,
        dataAccessed: 'Facial landmarks matched with 94.2% accuracy',
        reason: 'Unconscious roadside patient intake',
        severity: 'normal',
      });
    }, 1600);
  };

  // 2. Fingerprint Scan (Capacitive sensor -> ABHA)
  const scanFingerprint = () => {
    setActiveInputMethod('fingerprint');
    setIsScanning(true);
    setScanningStage('Reading fingerprint sensor...');

    setTimeout(() => {
      setIsScanning(false);
      setFingerprintVerified(true);
      setIdentityStatus('MATCHED');
      addAuditLog({
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' IST',
        actor: 'BioScanner Hardware',
        role: 'Hardware Reader',
        action: `Fingerprint matched ${currentPatient.name} on ABDM registry`,
        dataAccessed: 'Biometric minutiae verified',
        reason: 'Emergency identity verification',
        severity: 'normal',
      });
    }, 1200);
  };

  // 3. Physical ID Card Scan (Aadhaar / Voter ID / DL / ABHA QR)
  const scanIdCard = () => {
    setActiveInputMethod('id-card');
    setIsScanning(true);
    setScanningStage('Scanning physical ID card via camera OCR...');

    setTimeout(() => {
      setScanningStage('Reading text & QR code from card...');
    }, 700);

    setTimeout(() => {
      setIsScanning(false);
      setIdCardVerified(true);
      setIdentityStatus('MATCHED');
      setCurrentScreen('patient-identification');
      addAuditLog({
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' IST',
        actor: 'Camera OCR Reader',
        role: 'Document Scanner',
        action: `Physical card scanned: ${currentPatient.maskedGovId} linked to ${currentPatient.abhaId}`,
        dataAccessed: 'Card verified against ABHA national gateway',
        reason: 'Wallet ID discovery during emergency intake',
        severity: 'normal',
      });
    }, 1500);
  };

  const confirmIdentity = () => {
    setIdentityStatus('VERIFIED');
    setFingerprintVerified(true);
    setIdCardVerified(true);
    setIdentityConfidence(94.2);
    addAuditLog({
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' IST',
      actor: 'Medical Responder',
      role: 'Attending Verifier',
      action: `Confirmed identity of ${currentPatient.name} (${currentPatient.abhaId})`,
      dataAccessed: 'Unlocked emergency clinical history from linked hospitals',
      reason: 'Biometrics and ID verified',
      severity: 'normal',
    });
  };

  const resetEmergencyIntake = () => {
    setIdentityStatus('UNKNOWN');
    setFingerprintVerified(false);
    setIdCardVerified(false);
    setIsConflictResolved(false);
    setIsConflictLocked(false);
    setClinicalTrustScore(71);
    setActiveInputMethod(null);
  };

  const lockConflict = () => {
    setIsConflictLocked(true);
    addAuditLog({
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' IST',
      actor: 'MEDIQ Safety System',
      role: 'Automated Safety Check',
      action: 'LOCKED blood group field to prevent accidental wrong transfusion',
      dataAccessed: 'Hospital A (B+) vs Hospital B (O+) conflict flagged',
      reason: 'Conflicting medical records detected from two hospitals',
      severity: 'critical',
    });
  };

  const resolveConflict = (chosenBloodGroup: string) => {
    setIsConflictResolved(true);
    setResolvedBloodGroup(chosenBloodGroup);
    setClinicalTrustScore(87);
    addAuditLog({
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' IST',
      actor: 'Dr. Sharma',
      role: 'Attending Doctor',
      action: `Bedside blood test completed: Verified as ${chosenBloodGroup}`,
      dataAccessed: `Blood group set to ${chosenBloodGroup}. Record marked trustworthy.`,
      reason: 'Direct physical bedside crossmatch test',
      severity: 'warning',
    });
  };

  const fetchAbdmRecords = (abhaId: string) => {
    setIsAbdmFetching(true);
    setAbdmFetchStatus(`Pinging ABDM Gateway for ${abhaId}...`);

    setTimeout(() => {
      setAbdmFetchStatus('Contacting Apollo Hospital & Fortis Memorial HIP nodes...');
    }, 700);

    setTimeout(() => {
      setIsAbdmFetching(false);
      setAbdmFetchStatus('Emergency health records received & verified');
      addAuditLog({
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' IST',
        actor: 'ABDM Network Gateway',
        role: 'National Health Exchange',
        action: `Pulled emergency bundle for ${abhaId}`,
        dataAccessed: 'Allergies, blood type, active emergency meds (Shielded past records excluded)',
        reason: 'Emergency care request (Purpose: EMERGENCY_CARE)',
        severity: 'normal',
      });
    }, 1500);
  };

  const triggerBreakGlass = (reason: string, durationMinutes: number) => {
    setHasBreakGlassActive(true);
    setBreakGlassReason(reason);
    setIsBreakGlassModalOpen(false);
    addAuditLog({
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' IST',
      actor: `${userRole.toUpperCase()} (Break-Glass)`,
      role: 'Emergency Privilege Override',
      action: `Temporary emergency access granted for ${durationMinutes} mins: ${reason}`,
      dataAccessed: 'Emergency clinical records unlocked immediately without secondary delay',
      reason: `Immediate life-threatening situation: ${reason}`,
      severity: 'critical',
    });
  };

  const verifyOfflineSignature = () => {
    setOfflineSignatureVerified(true);
    addAuditLog({
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' IST',
      actor: 'Ambulance Tablet Security Module',
      role: 'Offline Cryptographic Validator',
      action: 'Verified digital signature of stored emergency data',
      dataAccessed: 'Confirmed emergency data is authentic and unmodified',
      reason: 'No internet connection in remote area',
      severity: 'normal',
    });
  };

  const syncOfflineData = () => {
    const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ' IST';
    setLastSyncTime(now);
    addAuditLog({
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' IST',
      actor: 'Ambulance Unit #4',
      role: 'Gateway Relay',
      action: 'Synced field treatment actions with hospital server',
      dataAccessed: 'Transmitted emergency care notes and timestamps',
      reason: 'Internet connection re-established',
      severity: 'normal',
    });
  };

  // Keep demo index synchronized
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

        currentClinician,
        availableClinicians,
        setCurrentClinician,
        isDoctorCardOpen,
        setIsDoctorCardOpen,

        currentPatient,
        availablePatients,
        selectPatientByAbha,
        selectPatient,
        lastEnrolledId,
        registerPatient,
        isRegisterModalOpen,
        setIsRegisterModalOpen,
        isOnboardingOpen,
        setIsOnboardingOpen,

        activeInputMethod,
        setActiveInputMethod,
        isScanning,
        scanningStage,
        identityStatus,
        identityConfidence,
        fingerprintVerified,
        idCardVerified,
        activeCandidate,
        candidates,
        capturedPhotoUrl,
        setCapturedPhotoUrl,
        useLiveCamera,
        setUseLiveCamera,

        scanFace,
        scanFingerprint,
        scanIdCard,
        confirmIdentity,
        resetEmergencyIntake,

        clinicalTrustScore,
        clinicalTrustBreakdown,
        recordSources: currentPatient.bloodGroupSources,
        isConflictLocked,
        isConflictResolved,
        resolvedBloodGroup,
        lockConflict,
        resolveConflict,

        isAbdmFetching,
        abdmFetchStatus,
        fetchAbdmRecords,

        insuranceShield,
        isInsuranceModalOpen,
        setIsInsuranceModalOpen,

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
