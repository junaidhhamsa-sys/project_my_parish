import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { CommandPalette } from './components/common/CommandPalette';
import { AIAssistantModal } from './components/common/AIAssistantModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { ImpactPage } from './pages/ImpactPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { MembersPage } from './pages/MembersPage';
import { FamiliesPage } from './pages/FamiliesPage';
import { CommitteesPage } from './pages/CommitteesPage';
import { VolunteersPage } from './pages/VolunteersPage';
import { ServicesPage } from './pages/ServicesPage';
import { EventsPage } from './pages/EventsPage';
import { WelfarePage } from './pages/WelfarePage';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { FundraisingPage } from './pages/FundraisingPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { KPIsPage } from './pages/KPIsPage';
import { PartnershipsPage } from './pages/PartnershipsPage';
import { SOPsPage } from './pages/SOPsPage';
import { AdministrationPage } from './pages/AdministrationPage';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
      <Sidebar
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        />

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />

      <AIAssistantModal
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/impact" element={<ImpactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Main App Routes */}
          <Route path="/dashboard" element={<AppLayout><DashboardPage /></AppLayout>} />
          <Route path="/members" element={<AppLayout><MembersPage /></AppLayout>} />
          <Route path="/families" element={<AppLayout><FamiliesPage /></AppLayout>} />
          <Route path="/committees" element={<AppLayout><CommitteesPage /></AppLayout>} />
          <Route path="/volunteers" element={<AppLayout><VolunteersPage /></AppLayout>} />
          <Route path="/services" element={<AppLayout><ServicesPage /></AppLayout>} />
          <Route path="/events" element={<AppLayout><EventsPage /></AppLayout>} />
          <Route path="/welfare" element={<AppLayout><WelfarePage /></AppLayout>} />
          <Route path="/announcements" element={<AppLayout><AnnouncementsPage /></AppLayout>} />
          <Route path="/fundraising" element={<AppLayout><FundraisingPage /></AppLayout>} />
          <Route path="/documents" element={<AppLayout><DocumentsPage /></AppLayout>} />
          <Route path="/analytics" element={<AppLayout><AnalyticsPage /></AppLayout>} />
          <Route path="/kpis" element={<AppLayout><KPIsPage /></AppLayout>} />
          <Route path="/partners" element={<AppLayout><PartnershipsPage /></AppLayout>} />
          <Route path="/sops" element={<AppLayout><SOPsPage /></AppLayout>} />
          <Route path="/admin" element={<AppLayout><AdministrationPage /></AppLayout>} />

          {/* Catch-all Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
