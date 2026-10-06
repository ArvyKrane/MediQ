# MEDIQ: Emergency Medical Intelligence & Patient Identity Trust Platform

> **"MEDIQ connects unidentified, unconscious patients to their ABHA ID in seconds—retrieving life-saving medical records without jargon, resolving dangerous hospital conflicts, and strictly shielding past medical history from insurance companies."**

---

## 1. Executive Summary & Core Idea

In medical emergencies, every second counts. When an unconscious patient arrives in an ambulance without family:
1. **No Wallets or Phones:** Patients rarely carry emergency medical tags, and NFC cards are rarely available or accessible.
2. **Conflicting Hospital Records:** Two hospitals frequently hold contradictory data (e.g., Hospital A says $B^+$, Hospital B says $O^+$). Blindly merging or guessing blood groups in an ER causes fatal transfusion shock.
3. **The Insurance Privacy Fear:** Patients are often terrified of national health IDs like ABHA because they worry: *"If my hospital visits are connected, will my health insurance company find minor undisclosed past history (like past dental surgeries, childhood fevers, or minor counseling) and cancel my health insurance policy?"*

**MEDIQ** is a zero-friction, end-to-end emergency intelligence platform built on India's **ABHA / ABDM (Ayushman Bharat Digital Mission)** framework that solves all three problems.

---

## 2. Three Input Modes — No NFC Required

MEDIQ replaces physical cards and NFC with **3 zero-friction input channels**:

1. **Face Scan (Live Camera):** Uses the ambulance or mobile camera to match facial landmarks against national ABHA photo records in under 2 seconds.
2. **Fingerprint Scan (Touch Sensor):** Uses a standard USB/Bluetooth biometric scanner to match UIDAI / ABDM minutiae.
3. **Physical ID Card Scan (OCR / QR):** Uses the camera to scan physical **Aadhaar cards, Driving Licenses, Voter IDs, or physical ABHA QR cards** found in the patient's wallet.

All three inputs directly resolve to the patient's unique **ABHA Address** (e.g., `aarav.mehta@abdm`) and **ABHA Number** (`91-8291-3829-1920`).

---

## 3. The Insurance Privacy Shield (Solving the Past History Dilemma)

### The Real-World Dilemma:
> *"When people buy private health insurance in India, they often don't disclose minor past history. If everything is linked to ABHA, will the insurance company see this emergency data, claim non-disclosure of Pre-Existing Diseases (PED), and void the insurance policy?"*

### The MEDIQ Solution:
1. **Purpose-Bound Data Release (DPDP Act & ABDM Specification):**
   - MEDIQ queries the ABDM Gateway strictly under **Purpose Code: `EMERGENCY_CARE`**.
   - Under this legal token, the gateway releases **ONLY** the **Emergency Care Capsule**:
     - Blood Group & Disputed Status
     - Life-Threatening Drug Allergies (e.g. Penicillin Anaphylaxis)
     - Active Resuscitation & Emergency Medications
     - Next-of-Kin Emergency Contact (via Masked Voice Proxy)
2. **Shielded Past Records (Never Pulled or Logged):**
   - Minor historical consultations (past viral fevers, dental work, psychiatric consults, elective procedures) are **never fetched during an emergency**.
   - For example, for patient Aarav Mehta, **14 routine past records are active in hospital archives but 100% hidden and shielded**.
3. **Strict Insurance TPA Blockade:**
   - Commercial insurance Third-Party Administrators (TPAs) and underwriting crawlers have **zero access** to MEDIQ emergency sessions.
   - Any attempt by an insurance query robot to scrape emergency data is blocked at the gateway, making it **impossible for an insurer to use MEDIQ's emergency intake to cancel or contest a policy**.

---

## 4. Jargon-Free, Practical Emergency UI/UX

MEDIQ is built for tired paramedics in rocky ambulances and junior nurses in busy trauma bays. We eliminated confusing crypto equations and replaced them with direct, human clinical language:

| Technical / Jargon Concept | MEDIQ Plain-English Display |
| :--- | :--- |
| *C_id Probabilistic Match Accuracy 94.2%* | **"✓ Identity Confirmed via Aadhaar e-KYC (ABHA: aarav.mehta@abdm)"** |
| *Unmerged Ledger Provenance Conflict* | **"⚠️ Warning: Apollo says B+, Fortis says O+. Run bedside test before giving blood."** |
| *Zero-Knowledge VoIP Ephemeral Session* | **"Call Mom (Sunita Sharma) — Phone number stays private"** |
| *ECDSA P-256 HSM Enclave Validation* | **"Ambulance Offline Mode: Verified genuine by hospital digital signature"** |

---

## 5. Live ABDM Data Pulling Architecture

MEDIQ connects to the **ABDM Network Gateway** (M1, M2, M3 APIs):
- **Health Information Providers (HIPs):** Pulls from connected hospital nodes:
  - **Apollo Hospital (Delhi):** Surgery & Trauma Intake records
  - **Fortis Memorial Research Institute:** Historical pediatric records
  - **Apex Diagnostic & Pathology Center:** NABL serology blood tests
- **Multi-Patient Simulator:** Test with 3 distinct real-world emergency profiles:
  1. **Aarav Mehta** (`aarav.mehta@abdm`) — Unconscious trauma patient with a critical $B^+$ vs $O^+$ blood group dispute and Penicillin allergy.
  2. **Priya Sharma** (`priya.sharma@abdm`) — Patient with a cardiac pacemaker and dual Penicillin + Latex allergies.
  3. **Rajesh Kumar** (`rajesh.k@abdm`) — Diabetic patient with coronary stent and active insulin protocol.

---

## 6. The 10 Interactive Prototype Screens

```
[01. Emergency Intake]  ──►  [02. Face/ID Scan]     ──►  [03. ABHA Verified]
                                                                  │
[06. Patient Profile]   ◄──  [05. Private Call]     ◄──  [04. Blood Conflict]
         │
         ▼
[07. ER Dashboard]      ──►  [08. Insurance Shield] ──►  [09. Activity Log]
                                                                  │
                                                                  ▼
                                                         [10. Offline Mode]
```

1. **Screen 01 — Emergency Intake:** Unconscious patient intake, 3 quick scan buttons (Face, Fingerprint, ID Card), blood group conflict alert, and Insurance Shield indicator.
2. **Screen 02 — Biometric & ID Identification:** Live camera viewfinder, facial landmark tracker, and ranked ABHA candidates.
3. **Screen 03 — Identity Verification:** Confirmed match against ABHA ID, proof checklist, and hospital registration history.
4. **Screen 04 — Medical Records & Conflict Resolution:** Side-by-side hospital records, explanation of why MEDIQ refuses to blindly merge $B^+$ vs $O^+$, and 1-click bedside blood test confirmation.
5. **Screen 05 — Private Emergency Contact:** Connect to mother Priya Mehta through a masked audio proxy without exposing private phone numbers.
6. **Screen 06 — Verified Health Profile:** Life-saving facts, verified medication list, and the **Shielded History Inspector** proving past records are hidden from insurance.
7. **Screen 07 — Doctor / ER Dashboard:** Full desktop trauma console with the rapid-action **Intelligence Summary**.
8. **Screen 08 — Access & Insurance Control:** Granular permission matrix across roles showing the **Insurance TPA column strictly blocked 🚫**.
9. **Screen 09 — Activity Audit Trail:** Immutable, plain-language log of every doctor and paramedic action.
10. **Screen 10 — Offline Ambulance Mode:** Emergency care without internet; local signed capsule for rural highways and hospital basements.

---

## 7. How to Run Locally

### Prerequisites
- Node.js v18+ (tested on Node v24)
- npm v9+

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev
```

Open **`http://localhost:5173/`** in your browser.

---

## 8. How to Deploy

The prototype is a pure client-side SPA (React + Vite), compatible with any static hosting platform or edge CDN.

### Option A: Deploy to Vercel (1-Click)
```bash
npm install -g vercel
vercel
```
- Framework Preset: **Vite**
- Build Command: `npm run build`
- Output Directory: `dist`
- The included `vercel.json` automatically configures SPA routing.

### Option B: Deploy to Netlify
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```
- The included `public/_redirects` guarantees direct deep links work without 404s.

### Option C: Docker Container (Hospital Intranet)
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```
```bash
docker build -t mediq-app .
docker run -p 8080:80 mediq-app
```

---

## 9. Citizen Onboarding & Live Face e-KYC Flow

Anyone can register as a citizen in the app by clicking **"Register Patient / Create ABHA"**:
1. **Govt ID Verification:** Enter full legal name, date of birth, and Aadhaar/Voter ID/Driving License/PAN number.
2. **Live Aadhaar FaceRD Capture:** Look at the camera and take a live selfie. The facial vector template is cryptographically bound to the citizen's profile.
3. **Emergency Essentials Only:** Select confirmed blood group, critical drug allergies (e.g. Penicillin), and primary emergency contact (e.g. Mother's phone).
4. **Insurance Privacy Guarantee:** Reviews the DPDP Act & Purpose `EMERGENCY_CARE` shield confirming insurance TPAs cannot view past OPD or minor medical history.
5. **ABHA Digital Card:** Issues the official digital card with QR code and instant **"Open in Ambulance / Emergency ER"** button to simulate live emergency intake of the newly registered patient.

---

## 10. Packaging as an Android / Tablet App

MEDIQ is built mobile-first with responsive touch targets, offline service worker capability, and a full Web App Manifest.

### Option A: Install directly as a Progressive Web App (PWA)
1. Open the hosted URL in Chrome on any Android phone or tablet.
2. Tap the browser menu `⋮` and select **"Add to Home screen"** or **"Install app"**.
3. MEDIQ installs with full-screen standalone mode, custom launcher icon, and zero browser address bar interference.

### Option B: Native Android Project (Ready for Android Studio)
The native Android project is **already initialized and configured** inside the `android/` directory with Camera (`CAMERA`) and Internet permissions!

To open and run immediately in **Android Studio**:
```bash
# Open directly in Android Studio
npm run cap:android
# Or open the "android" directory directly from Android Studio: File -> Open -> select "android" folder
```

Whenever you update web code, sync changes to Android Studio in one command:
```bash
npm run cap:sync
```

In Android Studio:
- Select your connected phone, tablet, or emulator.
- Hit **Run (Shift + F10)** to launch live on device.
- Or select **Build > Build Bundle(s) / APK(s) > Build APK(s)** to generate a release APK.

