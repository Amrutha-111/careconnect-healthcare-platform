import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { AdminNavbar } from './components/AdminNavbar';
import { EmergencyBanner } from './components/EmergencyBanner';
import { SignInPage } from './components/SignInPage';
import { RegisterPage } from './components/RegisterPage';
import { PatientDashboard } from './components/PatientDashboard';
import { DiscoveryHome } from './components/DiscoveryHome';
import { FacilityDetail } from './components/FacilityDetail';
import { DoctorDirectory } from './components/DoctorDirectory';
import { DepartmentAvailabilityView } from './components/DepartmentAvailabilityView';
import { AppointmentBookingModal } from './components/AppointmentBookingModal';
import { AppointmentConfirmationModal } from './components/AppointmentConfirmationModal';
import { DigitalTokenModal } from './components/DigitalTokenModal';
import { MyVisitsView } from './components/MyVisitsView';
import { VisitPlannerModal } from './components/VisitPlannerModal';
import { FacilityComparisonModal } from './components/FacilityComparisonModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminSelectHospital } from './components/AdminSelectHospital';
import { CareConnectAIAssistant } from './components/CareConnectAIAssistant';
import {
  HeartPulse,
  Sparkles,
  ShieldCheck,
  Building2,
  Lock
} from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    isAuthenticated,
    authRole,
    currentUser,
    currentView,
    selectedFacility,
    facilities,
    setIsAIAssistantOpen,
    logout
  } = useApp();

  // 1. First Screen MUST be Sign-In or Register when unauthenticated
  if (!isAuthenticated || currentView === 'signin') {
    return <SignInPage />;
  }

  if (currentView === 'register') {
    return <RegisterPage />;
  }

  // 2. Hospital Admin Experience
  if (authRole === 'hospital_admin' || currentView.startsWith('admin-')) {
    // If admin is selecting hospital or unassigned, render AdminSelectHospital
    if (currentView === 'admin-select-hospital' || !currentUser?.currentFacilityId) {
      return <AdminSelectHospital />;
    }

    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950">
        <div>
          <AdminNavbar />

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <AdminDashboard />
          </main>
        </div>

        {/* Admin Footer */}
        <footer className="bg-slate-950 border-t border-slate-800 py-6 px-4 sm:px-6 lg:px-8 text-xs text-slate-400 mt-12">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>CareConnect Hospital Admin Console • Live Queue & Provider Management</span>
            </div>
            <div className="flex items-center space-x-4 text-slate-400">
              <span className="text-[11px] bg-slate-800 px-2.5 py-1 rounded-md text-amber-300">
                Hackathon Demo Mode
              </span>
              <button
                onClick={logout}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // 3. Patient Experience
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-teal-500 selection:text-white">
      <div>
        {/* Medical Emergency Warning Banner */}
        <EmergencyBanner />

        {/* Global Navigation for Patients */}
        <Navbar />

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {currentView === 'patient-dashboard' && <PatientDashboard />}

          {(currentView === 'home' || currentView === 'facilities' || currentView === 'emergency') && (
            <DiscoveryHome />
          )}

          {currentView === 'facility-detail' && (
            <FacilityDetail facility={selectedFacility || facilities[0]} />
          )}

          {currentView === 'doctors' && <DoctorDirectory />}

          {currentView === 'departments' && <DepartmentAvailabilityView />}

          {currentView === 'book-appointment' && <AppointmentBookingModal />}

          {currentView === 'confirmation' && <AppointmentConfirmationModal />}

          {currentView === 'token-view' && <DigitalTokenModal />}

          {currentView === 'my-visits' && <MyVisitsView />}

          {currentView === 'visit-planner' && <VisitPlannerModal />}

          {currentView === 'compare' && <FacilityComparisonModal />}
        </main>
      </div>

      {/* Floating AI Assistant Trigger Pill on bottom-right */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsAIAssistantOpen(true)}
          className="group flex items-center space-x-2.5 px-4 py-3 bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-600 hover:from-teal-800 hover:to-cyan-700 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-xl shadow-teal-700/30 hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer border border-teal-400/30"
          title="Ask CareConnect AI Assistant"
        >
          <Sparkles className="w-5 h-5 text-amber-200 animate-pulse" />
          <span>Ask CareConnect AI</span>
        </button>
      </div>

      {/* Grounded Conversational AI Assistant Modal */}
      <CareConnectAIAssistant />

      {/* Healthcare Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-10 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center">
                <HeartPulse className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg text-slate-900">
                Care<span className="text-teal-600">Connect</span>
              </span>
            </div>
            <p className="text-slate-500 leading-relaxed">
              Smart healthcare facility discovery, digital queue tokens, and appointment management for reduced waiting times.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-3">
              Patient Services
            </h4>
            <ul className="space-y-2">
              <li>Nearby Hospitals & Clinics</li>
              <li>Live Digital Queue Tokens</li>
              <li>Doctor Schedule Directory</li>
              <li>Smart Visit Arrival Planner</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-3">
              Transparency & Safety
            </h4>
            <ul className="space-y-2">
              <li>Verified Patient Reviews</li>
              <li>Zero Arbitrary AI Ranking</li>
              <li>Non-Tamperable Queue Logs</li>
              <li>24/7 Trauma Emergency Finder</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-3">
              Emergency Hotlines
            </h4>
            <p className="leading-relaxed">
              For immediate life-threatening emergencies, dial <strong>911 / 112</strong> or proceed to the nearest trauma hospital.
            </p>
            <div className="mt-3 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 font-semibold text-[11px]">
              CareConnect is an informational healthcare access tool and does not provide medical diagnoses.
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400">
          <p>© 2026 CareConnect Healthcare Technologies. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Verified Prototype for Healthcare Discovery & Queue Intelligence</p>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
