import React from 'react';
import { MediqProvider, useMediq } from './context/MediqContext';
import { Navbar } from './components/common/Navbar';
import { BottomNavigationBar } from './components/common/BottomNavigationBar';
import { EvidenceDrawer } from './components/common/EvidenceDrawer';
import { BreakGlassModal } from './components/common/BreakGlassModal';
import { MediqCallModal } from './components/common/MediqCallModal';
import { InsuranceShieldModal } from './components/common/InsuranceShieldModal';
import { CitizenOnboardingModal } from './components/citizen/CitizenOnboardingModal';
import { SaasOnboardingModal } from './components/common/SaasOnboardingModal';
import { DoctorDigitalIdModal } from './components/common/DoctorDigitalIdModal';

// Unified Modern MVP Views
import { Screen1EmergencyLanding } from './components/screens/Screen1EmergencyLanding';
import { PatientView } from './components/screens/PatientView';
import { ERView } from './components/screens/ERView';
import { ComplianceView } from './components/screens/ComplianceView';

const MainContent: React.FC = () => {
  const { currentScreen, isOnboardingOpen, setIsOnboardingOpen } = useMediq();

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'emergency-landing':
      case 'patient-identification':
        return <Screen1EmergencyLanding />;

      case 'identity-verification':
      case 'clinical-trust':
      case 'emergency-contact':
      case 'patient-profile':
        return <PatientView />;

      case 'doctor-dashboard':
      case 'access-control':
        return <ERView />;

      case 'audit-log':
      case 'offline-mode':
        return <ComplianceView />;

      default:
        return <Screen1EmergencyLanding />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F7F9] tech-grid-pattern selection:bg-[#FFB800] selection:text-black">
      {/* Top Navigation Bar */}
      <Navbar />

      {/* Main SaaS Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-3 sm:pt-4 pb-24 md:pb-8">
        {renderActiveScreen()}
      </main>

      {/* Mobile-first bottom navigation bar */}
      <BottomNavigationBar />

      {/* Global Interactive Enterprise Modals & Overlays */}
      <EvidenceDrawer />
      <BreakGlassModal />
      <MediqCallModal />
      <InsuranceShieldModal />
      <CitizenOnboardingModal />
      <SaasOnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />
      <DoctorDigitalIdModal />
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
