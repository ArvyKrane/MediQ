export type ScreenId =
  | 'emergency-landing'
  | 'patient-identification'
  | 'identity-verification'
  | 'clinical-trust'
  | 'emergency-contact'
  | 'patient-profile'
  | 'doctor-dashboard'
  | 'access-control'
  | 'audit-log'
  | 'offline-mode';

export type UserRole =
  | 'first-responder'
  | 'ambulance-ems'
  | 'doctor'
  | 'hospital-admin'
  | 'system-auditor';

export type ScanInputMethod = 'face' | 'fingerprint' | 'id-card';

export interface IdentityCandidate {
  id: string;
  name: string;
  candidateCode: string;
  abhaId: string;
  abhaNumber: string;
  faceMatchScore: number;
  fingerprintStatus: 'Pending' | 'Matched' | 'Unmatched';
  idCardStatus: 'Pending' | 'Matched' | 'Unmatched';
  dob: string;
  gender: string;
  nationalIdMasked: string;
  registrationDate: string;
  photoUrl?: string;
}

export interface MedicalRecordSource {
  id: string;
  sourceName: string;
  institutionType: string;
  bloodGroup: string;
  confidence: 'High' | 'Medium' | 'Low';
  recordedDate: string;
  verifiedBy: string;
  hash: string;
  notes: string;
}

export interface ClinicalTrustBreakdown {
  overallScore: number;
  sourceReliability: number;
  crossValidation: number;
  recency: number;
  consistency: number;
  temporalValidity: number;
  provenance: number;
}

export interface ClinicianProfile {
  id: string;
  name: string;
  qualification: string;
  specialty: string;
  // Official Indian Regulatory & ABDM Credentials
  nmcRegistrationNumber: string; // e.g., "DMC/R/14205" (State Medical Council / NMC)
  stateMedicalCouncil: string; // e.g., "Delhi Medical Council"
  hpid: string; // 14-digit ABDM Health Professional ID: "21-8924-1102-3910"
  hprAddress: string; // e.g., "dr.sharma@hpr.abdm"
  facilityName: string; // e.g., "AIIMS New Delhi — Apex Trauma Bay #1"
  facilityHfrId: string; // e.g., "HFR-IN-DL-00192"
  digitalSigningKey: string;
  status: 'ACTIVE & VERIFIED' | 'PROVISIONAL';
  role: UserRole;
  avatarUrl?: string;
}

export interface PatientProfile {
  id: string;
  name: string;
  abhaId: string;
  abhaNumber: string;
  age: number;
  gender: string;
  dob: string;
  maskedGovId: string;
  photoPlaceholder?: string;
  photoUrl?: string;
  bloodGroup: string;
  hasBloodGroupConflict: boolean;
  bloodGroupSources: MedicalRecordSource[];
  allergies: {
    name: string;
    severity: 'Severe' | 'Moderate' | 'Mild';
    verified: boolean;
    source: string;
  }[];
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    verified: boolean;
  }[];
  acuteConditions: {
    name: string;
    notes: string;
    verified: boolean;
  }[];
  emergencyContact: {
    name: string;
    relationship: string;
    maskedPhone: string;
    isVerified: boolean;
  };
  linkedHospitals: {
    name: string;
    type: string;
    lastSync: string;
    recordsShared: number;
  }[];
  // Insurance privacy shield
  shieldedRecordsCount: number;
  shieldedCategories: string[];
}

export interface InsuranceShieldState {
  isProtectionActive: boolean;
  purposeCode: 'EMERGENCY_CARE';
  tpaBlockedCount: number;
  lastBlockedQuery: string;
  shieldedPastRecordsCount: number;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  dataAccessed: string;
  reason: string;
  hash: string;
  severity?: 'normal' | 'warning' | 'critical';
}

export interface PermissionItem {
  category: string;
  firstResponder: 'allowed' | 'restricted' | 'break-glass';
  ambulanceEms: 'allowed' | 'restricted' | 'break-glass';
  doctor: 'allowed' | 'restricted' | 'break-glass';
  hospital: 'allowed' | 'restricted' | 'break-glass';
  admin: 'allowed' | 'restricted' | 'break-glass';
  insuranceTpa: 'restricted'; // Strictly restricted for insurance underwriters
}
