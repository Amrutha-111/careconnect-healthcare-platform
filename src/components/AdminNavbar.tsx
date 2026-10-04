import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ActiveView, FacilityStatus } from '../types';
import {
  ShieldCheck,
  LayoutDashboard,
  Calendar,
  Users,
  UserCheck,
  Layers,
  Ticket,
  Activity,
  Star,
  LogOut,
  Building2,
  ChevronDown,
  Menu,
  X,
  Settings,
  RefreshCw
} from 'lucide-react';

export const AdminNavbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    logout,
    facilities,
    activeAdminFacilityId,
    setActiveAdminFacilityId,
    updateFacilityStatus,
    currentUser
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showSwitchModal, setShowSwitchModal] = useState(false);

  const curFac = facilities.find((f) => f.id === activeAdminFacilityId) || facilities[0];

  const adminNavItems: Array<{ id: ActiveView; label: string; icon: React.ReactNode }> = [
    { id: 'admin-dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'admin-doctors', label: 'Doctors', icon: <UserCheck className="w-4 h-4" /> },
    { id: 'admin-departments', label: 'Departments', icon: <Layers className="w-4 h-4" /> },
    { id: 'admin-appointments', label: 'Appointments', icon: <Calendar className="w-4 h-4" /> },
    { id: 'admin-queue', label: 'Queue Management', icon: <Ticket className="w-4 h-4" /> },
    { id: 'admin-patients', label: 'Patients', icon: <Users className="w-4 h-4" /> },
    { id: 'admin-feedback', label: 'Feedback', icon: <Star className="w-4 h-4" /> },
    { id: 'admin-facility-status', label: 'Hospital Status', icon: <Activity className="w-4 h-4" /> },
    { id: 'admin-settings', label: 'Hospital Settings', icon: <Settings className="w-4 h-4" /> }
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Strip */}
        <div className="flex items-center justify-between h-16">
          
          {/* Brand & Managed Facility Badge */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg text-white">
                  CARE<span className="text-teal-400">CONNECT</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Hospital Admin
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate max-w-xs sm:max-w-md">
                Assigned Hospital: <strong className="text-amber-300 font-bold">{curFac.name}</strong>
              </p>
            </div>
          </div>

          {/* Right Header Controls: Facility Switcher (Demo Only), Status Badge, Logout */}
          <div className="hidden lg:flex items-center space-x-3">
            
            {/* Demo Assigned Hospital Switcher */}
            <div className="flex items-center space-x-1.5 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 text-xs">
              <Building2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <button
                onClick={() => setShowSwitchModal(true)}
                className="text-slate-200 hover:text-white font-medium flex items-center space-x-1 cursor-pointer"
                title="Change Assigned Hospital for Demo Evaluation"
              >
                <span>{curFac.name}</span>
                <span className="text-[10px] bg-slate-700 text-amber-300 px-1.5 py-0.5 rounded ml-1">Switch</span>
              </button>
            </div>

            {/* Quick Facility Status Controller */}
            <div className="relative">
              <button
                onClick={() => setShowStatusMenu(!showStatusMenu)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center space-x-1.5 transition-all cursor-pointer ${
                  curFac.status === 'open'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : curFac.status === 'busy'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : curFac.status === 'emergency'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : 'bg-slate-700 text-slate-300 border-slate-600'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-current" />
                <span className="uppercase">{curFac.status}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {showStatusMenu && (
                <div className="absolute right-0 mt-2 w-52 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 py-1.5 z-50 text-xs font-semibold">
                  <div className="px-3 py-1 text-[10px] text-slate-400 uppercase tracking-wider">
                    Set {curFac.name} Status:
                  </div>
                  <button
                    onClick={() => {
                      updateFacilityStatus(curFac.id, 'open');
                      setShowStatusMenu(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-emerald-300 hover:bg-slate-700/60 flex items-center space-x-2 cursor-pointer"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>OPEN (Normal Operations)</span>
                  </button>
                  <button
                    onClick={() => {
                      updateFacilityStatus(curFac.id, 'busy');
                      setShowStatusMenu(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-amber-300 hover:bg-slate-700/60 flex items-center space-x-2 cursor-pointer"
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>BUSY (High Queue Load)</span>
                  </button>
                  <button
                    onClick={() => {
                      updateFacilityStatus(curFac.id, 'emergency');
                      setShowStatusMenu(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-rose-300 hover:bg-slate-700/60 flex items-center space-x-2 cursor-pointer"
                  >
                    <span className="w-2 h-2 rounded-full bg-rose-400" />
                    <span>EMERGENCY (Trauma Priority)</span>
                  </button>
                  <button
                    onClick={() => {
                      updateFacilityStatus(curFac.id, 'temporarily_unavailable');
                      setShowStatusMenu(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-slate-300 hover:bg-slate-700/60 flex items-center space-x-2 cursor-pointer"
                  >
                    <span className="w-2 h-2 rounded-full bg-slate-400" />
                    <span>TEMPORARILY UNAVAILABLE</span>
                  </button>
                  <button
                    onClick={() => {
                      updateFacilityStatus(curFac.id, 'closed');
                      setShowStatusMenu(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-slate-400 hover:bg-slate-700/60 flex items-center space-x-2 cursor-pointer"
                  >
                    <span className="w-2 h-2 rounded-full bg-slate-500" />
                    <span>CLOSED (No OPD Visits)</span>
                  </button>
                </div>
              )}
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/30 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer"
              title="Sign Out of Hospital Admin Session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={logout}
              className="p-2 text-rose-400 hover:text-rose-200 cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Desktop Admin Secondary Navigation Bar */}
        <nav className="hidden lg:flex items-center space-x-1 border-t border-slate-800/80 py-1.5 overflow-x-auto">
          {adminNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                currentView === item.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

      </div>

      {/* Switch Assigned Hospital Modal (for Hackathon Demo Testing) */}
      {showSwitchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 rounded-3xl max-w-lg w-full p-6 border border-slate-700 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base text-white">Switch Assigned Hospital (Demo)</h3>
              </div>
              <button
                onClick={() => setShowSwitchModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400 mt-3 leading-relaxed">
              In production, each administrator is strictly locked to their hospital. For hackathon evaluation, select a hospital below to switch your active admin session:
            </p>

            <div className="mt-4 space-y-2 max-h-80 overflow-y-auto pr-1">
              {facilities.slice(0, 5).map((fac) => (
                <button
                  key={fac.id}
                  onClick={() => {
                    setActiveAdminFacilityId(fac.id);
                    setShowSwitchModal(false);
                  }}
                  className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    activeAdminFacilityId === fac.id
                      ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div>
                    <strong className="block text-sm text-white">{fac.name}</strong>
                    <span className="text-xs text-slate-400">{fac.address}</span>
                  </div>
                  {activeAdminFacilityId === fac.id ? (
                    <span className="px-2 py-0.5 bg-amber-500 text-slate-950 text-[10px] font-bold rounded-md uppercase">
                      Current
                    </span>
                  ) : (
                    <span className="text-xs text-amber-400 font-semibold">Select →</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-t border-slate-800 px-4 py-3 space-y-2 text-xs">
          <div className="pb-2 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">Assigned: <strong className="text-amber-300">{curFac.name}</strong></span>
            <button
              onClick={() => {
                setShowSwitchModal(true);
                setMobileMenuOpen(false);
              }}
              className="text-[11px] text-amber-400 font-bold underline cursor-pointer"
            >
              Switch Hospital
            </button>
          </div>

          <div className="grid grid-cols-2 gap-1.5 pt-1">
            {adminNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`p-2.5 rounded-xl font-semibold flex items-center space-x-2 text-left cursor-pointer ${
                  currentView === item.id ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 bg-slate-800'
                }`}
              >
                {item.icon}
                <span className="truncate">{item.label}</span>
              </button>
            ))}
          </div>

          <button
            onClick={logout}
            className="w-full mt-3 py-2.5 bg-rose-600 text-white font-bold rounded-xl text-center flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out of Admin Console</span>
          </button>
        </div>
      )}
    </header>
  );
};
