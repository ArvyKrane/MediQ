import React from 'react';
import { MediqProvider, useMediq } from './context/MediqContext';
import { Navbar } from './components/common/Navbar';
import { DemoTourBar } from './components/common/DemoTourBar';
import { EvidenceDrawer } from './components/common/EvidenceDrawer';
import { BreakGlassModal } from './components/common/BreakGlassModal';
import { MediqCallModal } from './components/common/MediqCallModal';

// 10 Screens
import { Screen1EmergencyLanding } from './components/screens/Screen1EmergencyLanding';
import { Screen2PatientIdentification } from './components/screens/Screen2PatientIdentification';
import { Screen3IdentityVerification } from './components/screens/Screen3IdentityVerification';
import { Screen4ClinicalTrust } from './components/screens/Screen4ClinicalTrust';
import { Screen5EmergencyContact } from './components/screens/Screen5EmergencyContact';
import { Screen6PatientProfile } from './components/screens/Screen6PatientProfile';
import { Screen7DoctorDashboard } from './components/screens/Screen7DoctorDashboard';
import { Screen8AccessControl } from './components/screens/Screen8AccessControl';
import { Screen9AuditLog } from './components/screens/Screen9AuditLog';
import { Screen10OfflineEmergency } from './components/screens/Screen10OfflineEmergency';

const MainContent: React.FC = () => {
  const { currentScreen } = useMediq();

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'emergency-landing':
        return <Screen1EmergencyLanding />;
      case 'patient-identification':
        return <Screen2PatientIdentification />;
      case 'identity-verification':
        return <Screen3IdentityVerification />;
      case 'clinical-trust':
        return <Screen4ClinicalTrust />;
      case 'emergency-contact':
        return <Screen5EmergencyContact />;
      case 'patient-profile':
        return <Screen6PatientProfile />;
      case 'doctor-dashboard':
        return <Screen7DoctorDashboard />;
      case 'access-control':
        return <Screen8AccessControl />;
      case 'audit-log':
        return <Screen9AuditLog />;
      case 'offline-mode':
        return <Screen10OfflineEmergency />;
      default:
        return <Screen1EmergencyLanding />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F7F9] tech-grid-pattern selection:bg-[#FFB800] selection:text-black">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {renderActiveScreen()}
      </main>

      {/* Global Interactive Modals and Drawers */}
      <EvidenceDrawer />
      <BreakGlassModal />
      <MediqCallModal />

      {/* Persistent Floating 2-Minute Demo Flow Guide */}
      <DemoTourBar />
    </div>
  );
};

export function App() {
  return (
    <MediqProvider>
      <MainContent />
    </MediqProvider>
  );
}

export default App;
