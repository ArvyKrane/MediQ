# MEDIQ: Emergency Medical Intelligence & Patient Identity Trust Platform

> **"MEDIQ doesn't just identify the patient. It determines WHO the patient is, WHICH medical information can be trusted, and WHO is authorized to access it."**

---

## 1. Executive Summary

When an unidentified or unconscious patient arrives at an emergency trauma bay, medical teams face an information crisis:
1. **Identity Uncertainty:** Is the patient who we think they are?
2. **Clinical Contradictions:** Medical records from different hospitals often contradict one another (e.g., conflicting blood types or unverified allergy lists). Traditional EHRs either blindly overwrite data or fail silently.
3. **Privacy vs. Urgency:** First responders need instant access to life-saving vitals, but patients' private phone numbers, full demographic dossiers, and historical records must not be exposed carelessly.

**MEDIQ** is a zero-trust intelligence layer that connects unconscious patients, paramedics, ER physicians, and trauma hospitals through a 3-stage deterministic pipeline:

$$\mathbf{IDENTIFY} \ (C_{id}) \longrightarrow \mathbf{VERIFY} \ (C_{clin}) \longrightarrow \mathbf{INTELLIGENTLY\ RETRIEVE} \ (\text{ACCESS})$$

---

## 2. The 3 Core Mathematical Pillars

### 1. $C_{id}$ — Identity Confidence ("Who is the patient?")
- Multimodal biometric verification combining **facial landmark triangulation (68 vectors)**, **capacitive fingerprint minutiae matching**, and **OCR / National ID cross-referencing**.
- Threshold gating: Only candidates with $C_{id} \ge 90\%$ can be bound to clinical records without mandatory manual supervisor signoff.

### 2. $C_{clin}$ — Clinical Trust Score ("Can we trust the medical record?")
- Deterministic formula aggregating:
  - **Source Reliability ($92\%$)** — Accredited trauma centers vs. self-reported apps.
  - **Cross Validation ($89\%$)** — Multi-node consensus across independent hospitals.
  - **Recency ($76\%$)** & **Temporal Validity ($88\%$)** — Decay models for lab reports.
  - **Consistency ($91\%$)** & **Cryptographic Provenance ($94\%$)** — SHA-256 Merkle proofs.
- **The Zero-Merge Invariant:** When records conflict on fatal fields (such as **$B^+$ vs $O^+$ blood group**), MEDIQ **refuses to automatically merge**. It locks the dispute, alerts the clinician, and mandates bedside attestation before unlocking transfusion orders.

### 3. $\text{ACCESS}$ — Authorization & Context ("Who is allowed to see it?")
- Attribute-Based Access Control (ABAC):
  - **First Responder / Paramedic:** Emergency snapshot, allergies, audio proxy token.
  - **Ambulance / EMS:** Field stabilization data, conflict warnings.
  - **ER Doctor:** Full verified medical history, clinical attestation override.
  - **Hospital Admin:** Inpatient beds, registration, insurance.
  - **System Auditor:** Immutable forensic event logs.
- **Break-Glass Emergency Protocol:** Allows time-limited privilege escalation during life-threatening events with mandatory clinical justification and immutable audit logging.
- **Zero-Knowledge Telephony Proxy:** Paramedics can voice-call the patient’s next of kin (**Priya Mehta - Mother**) through an encrypted VoIP bridge without exposing private phone numbers (`+91 •••••• 4821`).

---

## 3. Demo Walkthrough (2–3 Minutes)

The prototype includes a persistent **Demo Tour Bar** at the bottom of the screen with an **Auto-Play** mode and quick **Next / Previous** controls.

```
[01. Emergency Intake]  ──►  [02. Multimodal Scan]  ──►  [03. Identity Verified]
                                                                  │
[06. Trusted Profile]   ◄──  [05. Private Contact]  ◄──  [04. Clinical Conflict]
         │
         ▼
[07. ER Dashboard]      ──►  [08. Access Matrix]    ──►  [09. Audit Trail]
                                                                  │
                                                                  ▼
                                                         [10. Offline Bundle]
```

### Step-by-Step Demo Script:

1. **Screen 01 — Emergency Intake (`/emergency-landing`):**
   - View the unconscious **UNKNOWN PATIENT** card with candidate ID `CAND-0192`.
   - Observe the prominent red banner: **⚠ CLINICAL CONFLICT DETECTED** ($B^+$ vs $O^+$).
   - Click **FACE SCAN** or **IDENTIFY PATIENT →**.

2. **Screen 02 — Multimodal Patient Identification (`/patient-identification`):**
   - Observe the live 1080p camera viewfinder with scanning laser and facial landmark mesh.
   - See the 3 ranked candidates; Candidate #01 is **Aarav Mehta** at **$94.2\%$ Face Match**.
   - Click **VERIFY IDENTITY** on Candidate #01.

3. **Screen 03 — Identity Verification (`/identity-verification`):**
   - Review the $C_{id}$ meter ($94.2\%$) and 4-source green verification checklist.
   - Inspect the historical anchors timeline (Apollo Registration, UIDAI ID, Fortis ER).
   - Click **CONFIRM IDENTITY (BIND PATIENT)** $\rightarrow$ State transitions to **IDENTITY VERIFIED ✓**.
   - Click **VERIFY MEDICAL RECORD →**.

4. **Screen 04 — Clinical Trust & Conflict Evaluation (`/clinical-trust`):**
   - The Clinical Trust Score sits degraded at **$C_{clin} = 71\%$** due to conflicting records:
     - **Hospital A (Apollo):** Blood Group $B^+$ (High Confidence).
     - **Hospital B (Fortis):** Blood Group $O^+$ (High Confidence - Transcribed).
     - **Diagnostic Center (Apex):** Blood Group $B^+$ (Medium Confidence).
   - Click **LOCK CONFLICT** to freeze the disputed field.
   - Click **REQUEST CLINICAL VERIFICATION** to open the doctor override modal. Select **$B^+$**, attest bedside cross-match, and watch **$C_{clin}$ elevate to $87\%$**.

5. **Screen 05 — Private Emergency Contact (`/emergency-contact`):**
   - Displays primary guardian **Priya Mehta (Mother)** with masked phone number `+91 •••••• 4821`.
   - Click **CALL THROUGH MEDIQ** to launch the interactive encrypted VoIP proxy call simulation with real-time call timer and audio controls.

6. **Screen 06 — Trusted Patient Profile (`/patient-profile`):**
   - Complete dossier with 4 status pillars: Identity **VERIFIED**, $C_{id}: 94.2\%$, $C_{clin}: 87\%$, Access **AUTHORIZED**.
   - Click **"Why can I trust this?"** or **"Inspect Proof"** on any card to open the **Cryptographic Evidence Drawer** displaying SHA-256 Merkle roots and hospital HSM signatures.

7. **Screen 07 — Doctor / ER Dashboard (`/doctor-dashboard`):**
   - Desktop command center for Trauma Bay #01.
   - Highlights the **"INTELLIGENCE SUMMARY"** panel demonstrating the *Intelligently Retrieve* principle (actionable synthesis over data dumps).

8. **Screen 08 — Access Control Matrix (`/access-control`):**
   - Granular permission matrix across 5 roles with `✓ Allowed`, `🔒 Restricted`, and `⚠ Break-Glass`.
   - Click **REQUEST BREAK-GLASS ACCESS** to test the emergency privilege override modal.

9. **Screen 09 — Immutable Audit Trail (`/audit-log`):**
   - Forensic event log showing all actions with timestamps (`23:41`, `23:38`, `23:34`, `23:32`), actors, reasons, and copyable SHA-256 hashes.

10. **Screen 10 — Offline Emergency Mode (`/offline-mode`):**
    - Demonstrates zero-connectivity triage with an ECDSA P-256 cryptographically signed local bundle.
    - Click **VERIFY SIGNATURE** and **SYNC WHEN CONNECTED**.

---

## 4. Design Language

- **Aesthetic:** High-precision medical intelligence / emergency-tech (inspired by aerospace HUDs and iQOO technical minimalism).
- **Background:** Crisp off-white (`#F6F7F9`) with subtle coordinate grids.
- **Accents:** High-voltage amber/gold (`#FFB800`) for trust highlights and active states.
- **Alerts:** Controlled surgical red used strictly for life-threatening clinical contradictions.
- **Typography:** Plus Jakarta Sans for UI clarity + JetBrains Mono for telemetry, cryptographic hashes, and scores.

---

## 5. Technology Stack

- **Framework:** React 19 + TypeScript (Vite 8)
- **Styling:** Tailwind CSS v4 + custom medical scanline animations & grid patterns
- **Icons:** Lucide React
- **State Engine:** Custom React Context architecture (`MediqContext`) with simulated biometric pipelines, conflict resolvers, and audit logging.

---

## 6. How to Run Locally

### Prerequisites
- Node.js v18+ (tested on Node v24)
- npm v9+

### Quickstart
```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev
```

Open **`http://localhost:5173/`** in your browser (optimized for Desktop 1440×900 and tablet viewports).

### Production Build
```bash
npm run build
npm run preview
```
All TypeScript types and bundling pass cleanly with zero compiler warnings.

---

## 7. How to Deploy

The prototype is a pure client-side SPA (React + Vite), making it compatible with any static hosting platform or edge CDN.

### Option A: Deploy to Vercel (Recommended — 1 Click / CLI)

#### Method 1: Using the Vercel CLI
```bash
# Install Vercel CLI globally (if not already installed)
npm install -g vercel

# Deploy directly from the project directory
vercel
```
- Accept default settings:
  - Framework Preset: **Vite**
  - Build Command: `npm run build`
  - Output Directory: `dist`

#### Method 2: Via GitHub Integration
1. Push this repository to your GitHub account:
   ```bash
   git add .
   git commit -m "feat: complete MEDIQ prototype"
   git branch -M main
   git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git
   git push -u origin main
   ```
2. Go to [vercel.com/new](https://vercel.com/new) and import your repository.
3. Vercel will automatically detect **Vite** and use `vercel.json` for SPA routing.
4. Click **Deploy**.

---

### Option B: Deploy to Netlify

#### Method 1: Using Netlify CLI
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

#### Method 2: Via Netlify Web Dashboard
1. Connect your GitHub repository at [app.netlify.com](https://app.netlify.com).
2. Configure build settings:
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`
3. The included `public/_redirects` file guarantees direct URL routes resolve to `/index.html` without 404s.
4. Click **Deploy Site**.

---

### Option C: Deploy to GitHub Pages

1. In `vite.config.ts`, if deploying to a repository subpath (e.g., `https://<username>.github.io/<repo-name>/`), set `base`:
   ```ts
   // vite.config.ts
   export default defineConfig({
     base: './', // relative assets base path
     plugins: [react(), tailwindcss()],
   })
   ```
2. Install `gh-pages`:
   ```bash
   npm install -D gh-pages
   ```
3. Add deployment scripts to `package.json`:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```
4. Run:
   ```bash
   npm run deploy
   ```

---

### Option D: Docker / Hospital Edge Container

For intranet or private ambulance edge gateways:

1. Build container:
   ```dockerfile
   # Dockerfile
   FROM node:20-alpine AS builder
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npm run build

   FROM nginx:alpine
   COPY --from=builder /app/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/conf.d/default.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. Run:
   ```bash
   docker build -t mediq-prototype .
   docker run -p 8080:80 mediq-prototype
   ```

