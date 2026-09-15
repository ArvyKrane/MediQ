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

export interface IdentityCandidate {
  id: string;
  name: string;
  candidateCode: string;
  faceMatchScore: number;
  fingerprintStatus: 'Pending' | 'Matched' | 'Unmatched';
  dob: string;
  gender: string;
  nationalIdMasked: string;
  registrationDate: string;
  photoUrl?: string;
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
}
