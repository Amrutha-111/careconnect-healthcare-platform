import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PatientProfileModal } from './PatientProfileModal';
import {
  HeartPulse,
  Sparkles,
  Bell,
  Scale,
  Calendar,
  Building2,
  Users,
  LayoutGrid,
  User,
  SlidersHorizontal,
  X,
  LogOut,
  LayoutDashboard,
  Home
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    selectedFacilityIdsForComparison,
    unreadNotificationsCount,
    notifications,
    markNotificationAsRead,
    clearAllNotifications,
    largeText,
    setLargeText,
    highContrast,
    setHighContrast,
    simpleLanguage,
    setSimpleLanguage,
    setIsAIAssistantOpen,
    setInitialAIPrompt,
    currentUser,
    logout
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showAccessibilityMenu, setShowAccessibilityMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo & Brand */}
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentView('home')}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
                <HeartPulse className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-xl tracking-tight text-slate-900">
                    Care<span className="text-teal-600">Connect</span>
                  </span>
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                    Patient Portal
                  </span>
                </div>
                <p className="hidden md:block text-[11px] text-slate-500 font-medium">
                  Smart Healthcare Discovery & Queue Management
                </p>
              </div>
            </div>

            {/* Desktop Navigation Links for Patients (Requirement 6) */}
            <nav className="hidden lg:flex items-center space-x-1">
              <button
                onClick={() => setCurrentView('home')}
                className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  currentView === 'home'
                    ? 'bg-teal-50 text-teal-700 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center space-x-1.5">
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </div>
              </button>

              <button
                onClick={() => setCurrentView('patient-dashboard')}
                className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  currentView === 'patient-dashboard'
                    ? 'bg-teal-50 text-teal-700 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center space-x-1.5">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </div>
              </button>

              <button
                onClick={() => setCurrentView('facilities')}
                className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  currentView === 'facilities' || currentView === 'facility-detail'
                    ? 'bg-teal-50 text-teal-700 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center space-x-1.5">
                  <Building2 className="w-4 h-4" />
                  <span>Facilities</span>
                </div>
              </button>

              <button
                onClick={() => setCurrentView('doctors')}
                className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  currentView === 'doctors'
                    ? 'bg-teal-50 text-teal-700 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center space-x-1.5">
                  <Users className="w-4 h-4" />
                  <span>Doctors</span>
                </div>
              </button>

              <button
                onClick={() => setCurrentView('departments')}
                className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  currentView === 'departments'
                    ? 'bg-teal-50 text-teal-700 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center space-x-1.5">
                  <LayoutGrid className="w-4 h-4" />
                  <span>Departments</span>
                </div>
              </button>

              <button
                onClick={() => setCurrentView('my-visits')}
                className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  currentView === 'my-visits' || currentView === 'token-view' || currentView === 'confirmation'
                    ? 'bg-teal-50 text-teal-700 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center space-x-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>My Visits</span>
                </div>
              </button>
            </nav>

            {/* Right Controls: AI Assistant, Compare, Accessibility, Notifications, Profile, Logout */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              
              {/* Ask CareConnect AI Button */}
              <button
                onClick={() => {
                  setInitialAIPrompt('');
                  setIsAIAssistantOpen(true);
                }}
                className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 shadow-md shadow-teal-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                title="Open CareConnect AI Assistant"
              >
                <Sparkles className="w-4 h-4 mr-1.5 text-amber-200 animate-pulse" />
                <span>Ask AI</span>
              </button>

              {/* Compare Pill Button */}
              {selectedFacilityIdsForComparison.length > 0 && (
                <button
                  onClick={() => setCurrentView('compare')}
                  className="inline-flex items-center px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-colors"
                  title="View Facility Comparison"
                >
                  <Scale className="w-3.5 h-3.5 mr-1" />
                  <span>Compare ({selectedFacilityIdsForComparison.length})</span>
                </button>
              )}

              {/* Accessibility Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowAccessibilityMenu(!showAccessibilityMenu)}
                  className={`p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors ${
                    largeText || highContrast || simpleLanguage ? 'bg-teal-50 text-teal-700 ring-2 ring-teal-500' : ''
                  }`}
                  title="Accessibility Preferences"
                  aria-label="Accessibility Settings"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </button>

                {showAccessibilityMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 px-4 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Accessibility</span>
                      <button onClick={() => setShowAccessibilityMenu(false)} className="text-slate-400 hover:text-slate-600">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center justify-between cursor-pointer py-1">
                        <span className="text-xs text-slate-700 font-medium">Large Text</span>
                        <input
                          type="checkbox"
                          checked={largeText}
                          onChange={(e) => setLargeText(e.target.checked)}
                          className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                        />
                      </label>
                      <label className="flex items-center justify-between cursor-pointer py-1">
                        <span className="text-xs text-slate-700 font-medium">High Contrast</span>
                        <input
                          type="checkbox"
                          checked={highContrast}
                          onChange={(e) => setHighContrast(e.target.checked)}
                          className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                        />
                      </label>
                      <label className="flex items-center justify-between cursor-pointer py-1">
                        <span className="text-xs text-slate-700 font-medium">Simple Language</span>
                        <input
                          type="checkbox"
                          checked={simpleLanguage}
                          onChange={(e) => setSimpleLanguage(e.target.checked)}
                          className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  title="Notifications"
                  aria-label="View notifications"
                >
                  <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100">
                      <div className="flex items-center space-x-1.5">
                        <Bell className="w-4 h-4 text-teal-600" />
                        <span className="text-xs font-bold text-slate-900">Notifications</span>
                        {unreadNotificationsCount > 0 && (
                          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-teal-100 text-teal-800">
                            {unreadNotificationsCount} new
                          </span>
                        )}
                      </div>
                      {notifications.length > 0 && (
                        <button
                          onClick={clearAllNotifications}
                          className="text-[11px] text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                        >
                          Clear all
                        </button>
                      )}
                    </div>

                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-50 px-2 py-1">
                      {notifications.length === 0 ? (
                        <div className="py-6 text-center text-xs text-slate-400">
                          No notifications at this time
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => markNotificationAsRead(n.id)}
                            className={`p-3 rounded-xl cursor-pointer transition-colors text-left ${
                              n.read ? 'bg-white opacity-80' : 'bg-teal-50/50 hover:bg-teal-50'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <span className="text-xs font-semibold text-slate-900">{n.title}</span>
                              {!n.read && <span className="w-2 h-2 rounded-full bg-teal-500 mt-1" />}
                            </div>
                            <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{n.message}</p>
                            <span className="text-[10px] text-slate-400 mt-1 block">
                              {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Patient Profile Avatar Button (Requirement 6) */}
              <button
                onClick={() => setShowProfileModal(true)}
                className="flex items-center space-x-1.5 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                title="View Patient Profile"
              >
                <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs border border-teal-200">
                  {currentUser?.name ? currentUser.name.charAt(0) : 'P'}
                </div>
                <span className="hidden md:inline-block text-xs font-bold text-slate-800 max-w-[100px] truncate">
                  {currentUser?.name || 'Profile'}
                </span>
              </button>

              {/* Logout Button (Requirement 7) */}
              <button
                onClick={logout}
                className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors flex items-center space-x-1 cursor-pointer"
                title="Log Out of Patient Account"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>

            </div>

          </div>
        </div>

        {/* Mobile Patient Navigation Bar */}
        <div className="lg:hidden border-t border-slate-100 bg-slate-50/90 px-3 py-2 flex items-center justify-between overflow-x-auto text-xs font-medium space-x-1">
          <button
            onClick={() => setCurrentView('home')}
            className={`px-2.5 py-1 rounded-lg shrink-0 ${currentView === 'home' ? 'bg-teal-600 text-white font-bold' : 'text-slate-600'}`}
          >
            Home
          </button>
          <button
            onClick={() => setCurrentView('patient-dashboard')}
            className={`px-2.5 py-1 rounded-lg shrink-0 ${currentView === 'patient-dashboard' ? 'bg-teal-600 text-white font-bold' : 'text-slate-600'}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setCurrentView('facilities')}
            className={`px-2.5 py-1 rounded-lg shrink-0 ${currentView === 'facilities' ? 'bg-teal-600 text-white font-bold' : 'text-slate-600'}`}
          >
            Facilities
          </button>
          <button
            onClick={() => setCurrentView('doctors')}
            className={`px-2.5 py-1 rounded-lg shrink-0 ${currentView === 'doctors' ? 'bg-teal-600 text-white font-bold' : 'text-slate-600'}`}
          >
            Doctors
          </button>
          <button
            onClick={() => setCurrentView('departments')}
            className={`px-2.5 py-1 rounded-lg shrink-0 ${currentView === 'departments' ? 'bg-teal-600 text-white font-bold' : 'text-slate-600'}`}
          >
            Departments
          </button>
          <button
            onClick={() => setCurrentView('my-visits')}
            className={`px-2.5 py-1 rounded-lg shrink-0 ${currentView === 'my-visits' ? 'bg-teal-600 text-white font-bold' : 'text-slate-600'}`}
          >
            My Visits
          </button>
        </div>
      </header>

      {/* Patient Profile Modal */}
      <PatientProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </>
  );
};
