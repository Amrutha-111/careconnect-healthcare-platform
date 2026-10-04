import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar,
  Ticket,
  Clock,
  Building2,
  Sparkles,
  ArrowRight,
  Bell,
  MapPin,
  Search,
  CheckCircle2,
  ChevronRight,
  ShieldAlert,
  User,
  Navigation
} from 'lucide-react';

export const PatientDashboard: React.FC = () => {
  const {
    currentUser,
    appointments,
    tokens,
    facilities,
    departments,
    doctors,
    notifications,
    setCurrentView,
    setSelectedFacility,
    setSelectedDepartment,
    setIsAIAssistantOpen,
    calculateDistance,
    generateVisitPlan
  } = useApp();

  const patientName = currentUser?.name || 'Patient';

  // Upcoming confirmed appointments
  const upcomingAppointments = appointments.filter(
    (a) => a.status === 'confirmed' || a.status === 'rescheduled'
  );
  const nextAppt = upcomingAppointments.length > 0 ? upcomingAppointments[0] : null;
  const nextApptFacility = nextAppt ? facilities.find((f) => f.id === nextAppt.facility_id) : null;
  const nextApptDoctor = nextAppt ? doctors.find((d) => d.id === nextAppt.doctor_id) : null;
  const nextApptDept = nextAppt ? departments.find((d) => d.id === nextAppt.department_id) : null;

  // Active digital token
  const activeTokens = tokens.filter((t) => t.status === 'WAITING' || t.status === 'CALLED');
  const latestToken = activeTokens.length > 0 ? activeTokens[0] : null;
  const tokenDept = latestToken ? departments.find((d) => d.id === latestToken.department_id) : null;
  const tokenFac = latestToken ? facilities.find((f) => f.id === latestToken.facility_id) : null;

  const servingNum = tokenDept ? tokenDept.serving_token : 42;
  const peopleAhead = latestToken ? Math.max(0, latestToken.token_number - servingNum - 1) : 0;
  const estWait = tokenDept ? peopleAhead * tokenDept.avg_consult_minutes : 20;

  // Nearby open facilities
  const openFacilities = facilities.filter((f) => f.status === 'open');

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-teal-800/60 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-teal-300 text-xs font-bold uppercase tracking-wider mb-1">
              <User className="w-3.5 h-3.5" />
              <span>Verified Patient Portal</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome back, {patientName}
            </h1>
            <p className="text-xs sm:text-sm text-teal-100/80 mt-1 max-w-xl">
              Track your live consultation queue, review confirmed appointments, and discover low-wait healthcare facilities.
            </p>
          </div>

          {/* Quick Action Group */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setCurrentView('facilities')}
              className="px-4 py-2.5 rounded-xl bg-white text-teal-900 font-bold text-xs hover:bg-teal-50 transition-all shadow-sm cursor-pointer"
            >
              Find Healthcare
            </button>
            <button
              onClick={() => setCurrentView('book-appointment')}
              className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-all shadow-sm cursor-pointer"
            >
              Book Slot
            </button>
            <button
              onClick={() => setIsAIAssistantOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-teal-700/80 hover:bg-teal-700 border border-teal-400/40 text-white font-bold text-xs transition-all flex items-center space-x-1.5 shadow-sm cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Ask AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Top Overview Cards (Section 9) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Upcoming Appointment */}
        <div
          onClick={() => setCurrentView('my-visits')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Upcoming Appointment</span>
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            {nextAppt ? (
              <div className="mt-3">
                <span className="text-xs font-semibold text-teal-700 block">{nextAppt.date} @ {nextAppt.time}</span>
                <strong className="text-base font-bold text-slate-900 block truncate mt-0.5">
                  {nextApptDoctor?.name || 'Specialist'}
                </strong>
                <span className="text-xs text-slate-500 block truncate">{nextApptFacility?.name}</span>
              </div>
            ) : (
              <p className="text-xs text-slate-400 mt-3">No appointments scheduled</p>
            )}
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-teal-700 font-semibold">
            <span>{nextAppt ? 'View Details' : 'Book a consultation'}</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Card 2: Active Token */}
        <div
          onClick={() => setCurrentView('token-view')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Token</span>
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                <Ticket className="w-4 h-4" />
              </div>
            </div>
            {latestToken ? (
              <div className="mt-3">
                <div className="flex items-baseline space-x-2">
                  <span className="font-mono text-3xl font-black text-teal-700">#{latestToken.token_number}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    latestToken.status === 'CALLED' ? 'bg-rose-100 text-rose-800 animate-pulse' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {latestToken.status}
                  </span>
                </div>
                <span className="text-xs text-slate-600 block truncate mt-1">
                  Serving #{servingNum} • {tokenDept?.name}
                </span>
              </div>
            ) : (
              <p className="text-xs text-slate-400 mt-3">No active queue tokens</p>
            )}
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-teal-700 font-semibold">
            <span>{latestToken ? 'Track Live Ticket' : 'Get Digital Token'}</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Card 3: Estimated Waiting Time */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Estimated Queue Wait</span>
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-black text-slate-900 block">
                {latestToken ? `~${estWait} min` : '~20 min'}
              </span>
              <span className="text-xs text-slate-500 block mt-1">
                {latestToken ? `${peopleAhead} patients ahead in queue` : 'Average local clinic consultation flow'}
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
            <span>Updated with live shift statistics</span>
          </div>
        </div>

        {/* Card 4: Nearby Open Facilities */}
        <div
          onClick={() => setCurrentView('facilities')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nearby Facilities</span>
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-black text-emerald-600 block">
                {openFacilities.length} Open
              </span>
              <span className="text-xs text-slate-500 block mt-1">
                Across {facilities.length} verified hospitals & clinics
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-teal-700 font-semibold">
            <span>Explore Facilities</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

      </div>

      {/* Main Split: Left Column (Next Visit Timeline & Active Token) + Right Column (Notifications & AI Card) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Active Consultation Token Banner (if active) */}
          {latestToken && (
            <div className="bg-gradient-to-r from-slate-900 to-teal-950 text-white rounded-3xl p-6 border border-slate-800 shadow-lg">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <Ticket className="w-5 h-5 text-teal-400" />
                  <span className="font-bold text-sm">Active Queue Progress</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-teal-400 text-slate-950">
                  {latestToken.status}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                  <span className="text-[11px] text-slate-400 block uppercase">Your Token</span>
                  <span className="font-mono text-3xl font-black text-teal-300">#{latestToken.token_number}</span>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                  <span className="text-[11px] text-slate-400 block uppercase">Serving Now</span>
                  <span className="font-mono text-3xl font-black text-amber-300">#{servingNum}</span>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                  <span className="text-[11px] text-slate-400 block uppercase">Est. Wait</span>
                  <span className="font-mono text-3xl font-black text-white">~{estWait}m</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 truncate">
                  {tokenFac?.name} • {tokenDept?.name}
                </span>
                <button
                  onClick={() => setCurrentView('token-view')}
                  className="font-bold text-teal-300 hover:text-white underline cursor-pointer"
                >
                  View Digital Card →
                </button>
              </div>
            </div>
          )}

          {/* Upcoming Appointment Timeline Box */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-slate-900">Upcoming Consultation Timeline</h3>
                <p className="text-xs text-slate-500">Your confirmed healthcare visits</p>
              </div>
              <button
                onClick={() => setCurrentView('my-visits')}
                className="text-xs font-bold text-teal-700 hover:underline"
              >
                View All Visits ({upcomingAppointments.length})
              </button>
            </div>

            {upcomingAppointments.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 space-y-2">
                <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
                <p>No upcoming visits scheduled. Book an appointment with a nearby specialist.</p>
                <button
                  onClick={() => setCurrentView('doctors')}
                  className="px-4 py-2 bg-teal-600 text-white rounded-xl font-bold mt-2 inline-block cursor-pointer"
                >
                  Browse Doctor Directory
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingAppointments.slice(0, 3).map((appt) => {
                  const fac = facilities.find((f) => f.id === appt.facility_id);
                  const doc = doctors.find((d) => d.id === appt.doctor_id);
                  const dept = departments.find((d) => d.id === appt.department_id);

                  return (
                    <div
                      key={appt.id}
                      className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-slate-900">{appt.id}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            {appt.status}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-900">
                          {doc?.name} — {dept?.name}
                        </h4>
                        <div className="text-slate-500 flex items-center space-x-3">
                          <span>{fac?.name}</span>
                          <span>•</span>
                          <span className="font-semibold text-teal-800">{appt.date} at {appt.time}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 self-start sm:self-auto">
                        <button
                          onClick={() => {
                            if (fac && dept) {
                              generateVisitPlan(fac.id, dept.id, doc?.id, appt.time);
                              setCurrentView('visit-planner');
                            }
                          }}
                          className="px-3 py-1.5 rounded-lg bg-teal-100 text-teal-800 hover:bg-teal-200 font-semibold cursor-pointer"
                        >
                          Plan Arrival
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Find Healthcare Banner */}
          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-extrabold text-teal-950 text-lg">
                Need to see a doctor today?
              </h3>
              <p className="text-xs text-teal-800 max-w-md">
                Find clinics with minimal queues or instant digital walk-in tokens before leaving your house.
              </p>
            </div>
            <button
              onClick={() => setCurrentView('facilities')}
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 whitespace-nowrap cursor-pointer"
            >
              Browse Facilities & Queues
            </button>
          </div>

        </div>

        {/* Right Column (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Ask AI Assistant Card */}
          <div className="bg-gradient-to-br from-teal-900 to-slate-900 text-white rounded-3xl p-6 border border-teal-700/50 shadow-lg space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-300 flex items-center justify-center border border-teal-400/30">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <h3 className="font-bold text-base text-white">CareConnect AI Assistant</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Ask natural questions like *"Find dermatology clinics with short wait today"* or *"Which hospital has the best staff ratings?"*
            </p>
            <button
              onClick={() => setIsAIAssistantOpen(true)}
              className="w-full py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
            >
              Ask CareConnect AI
            </button>
          </div>

          {/* Recent In-App Notifications (Section 9) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center space-x-1.5">
                <Bell className="w-4 h-4 text-teal-600" />
                <h3 className="font-bold text-sm text-slate-900">Recent Notifications</h3>
              </div>
              <span className="text-[10px] text-slate-400">Live feed</span>
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">No alerts at this time.</p>
              ) : (
                notifications.slice(0, 4).map((n) => (
                  <div key={n.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-0.5">
                    <strong className="text-slate-900 block font-semibold">{n.title}</strong>
                    <p className="text-slate-600 text-[11px] line-clamp-2">{n.message}</p>
                    <span className="text-[10px] text-slate-400 block pt-1">
                      {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
