import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Appointment, DigitalToken } from '../types';
import { FeedbackModal } from './FeedbackModal';
import {
  Calendar,
  Ticket,
  Clock,
  Building2,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Star,
  Navigation,
  MessageSquarePlus,
  QrCode
} from 'lucide-react';

export const MyVisitsView: React.FC = () => {
  const {
    appointments,
    tokens,
    facilities,
    doctors,
    departments,
    cancelAppointment,
    rescheduleAppointment,
    setActiveTokenForView,
    setCurrentView,
    generateVisitPlan
  } = useApp();

  const [activeTab, setActiveTab] = useState<'appointments' | 'tokens' | 'history'>('appointments');
  const [feedbackAppointment, setFeedbackAppointment] = useState<Appointment | null>(null);

  // Filter appointments
  const upcomingAppointments = appointments.filter(
    (a) => a.status === 'confirmed' || a.status === 'rescheduled'
  );
  const completedAppointments = appointments.filter((a) => a.status === 'completed');
  const cancelledAppointments = appointments.filter((a) => a.status === 'cancelled');

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
            Patient Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            My Appointments & Queue Tokens
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track real-time queue position, view confirmed appointments, reschedule visits, and submit post-consultation feedback.
          </p>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'appointments'
                ? 'bg-white text-teal-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Upcoming ({upcomingAppointments.length})
          </button>
          <button
            onClick={() => setActiveTab('tokens')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'tokens'
                ? 'bg-white text-teal-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Active Tokens ({tokens.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'bg-white text-teal-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Past & Cancelled ({completedAppointments.length + cancelledAppointments.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Upcoming Appointments */}
      {activeTab === 'appointments' && (
        <div className="space-y-4">
          {upcomingAppointments.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-base">No Upcoming Appointments</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                You do not have any active appointments scheduled. Search for nearby doctors and clinics to book your slot.
              </p>
              <button
                onClick={() => setCurrentView('facilities')}
                className="mt-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-teal-600 text-white hover:bg-teal-700 shadow-sm"
              >
                Find Healthcare Facilities
              </button>
            </div>
          ) : (
            upcomingAppointments.map((appt) => {
              const fac = facilities.find((f) => f.id === appt.facility_id);
              const doc = doctors.find((d) => d.id === appt.doctor_id);
              const dept = departments.find((d) => d.id === appt.department_id);

              return (
                <div
                  key={appt.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-900 text-teal-300">
                        {appt.id}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 capitalize">
                        {appt.status}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      {doc?.name || 'Medical Specialist'} • {dept?.name || 'Department'}
                    </h3>

                    <div className="flex flex-wrap gap-y-1 gap-x-4 text-xs text-slate-600">
                      <span className="flex items-center space-x-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{fac?.name}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-teal-600" />
                        <strong className="text-slate-900">{appt.date} at {appt.time}</strong>
                      </span>
                      <span className="text-slate-400">
                        Patient: {appt.patient_name} ({appt.patient_age}y)
                      </span>
                    </div>

                    {appt.reason && (
                      <p className="text-xs text-slate-500 italic">
                        Reason: "{appt.reason}"
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <button
                      onClick={() => {
                        if (fac && dept) {
                          generateVisitPlan(fac.id, dept.id, doc?.id, appt.time);
                          setCurrentView('visit-planner');
                        }
                      }}
                      className="px-3 py-2 rounded-xl text-xs font-semibold bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 flex items-center space-x-1"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Plan Visit</span>
                    </button>

                    <button
                      onClick={() => {
                        const newTime = appt.time === '10:30 AM' ? '02:30 PM' : '10:30 AM';
                        rescheduleAppointment(appt.id, appt.date, newTime);
                      }}
                      className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700"
                    >
                      Reschedule
                    </button>

                    <button
                      onClick={() => cancelAppointment(appt.id)}
                      className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab 2: Active Tokens */}
      {activeTab === 'tokens' && (
        <div className="space-y-4">
          {tokens.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
              <Ticket className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-base">No Digital Tokens Active</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Generate a live queue token to save your place in line before traveling to the hospital.
              </p>
              <button
                onClick={() => setCurrentView('token-view')}
                className="mt-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-teal-600 text-white hover:bg-teal-700 shadow-sm"
              >
                Get a Digital Token
              </button>
            </div>
          ) : (
            tokens.map((tok) => {
              const fac = facilities.find((f) => f.id === tok.facility_id);
              const dept = departments.find((d) => d.id === tok.department_id);
              const serving = dept ? dept.serving_token : 42;
              const peopleAhead = Math.max(0, tok.token_number - serving - 1);

              return (
                <div
                  key={tok.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200 flex flex-col items-center justify-center shrink-0">
                      <span className="text-[10px] uppercase font-bold text-teal-600">Token</span>
                      <span className="text-xl font-extrabold text-teal-900">#{tok.token_number}</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                            tok.status === 'CALLED'
                              ? 'bg-rose-500 text-white animate-pulse'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {tok.status === 'CALLED' ? 'Called to Room' : tok.status}
                        </span>
                        <span className="text-xs text-slate-500">Issued at {new Date(tok.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>

                      <h3 className="font-bold text-base text-slate-900">
                        {fac?.name} — {dept?.name}
                      </h3>

                      <div className="text-xs text-slate-600 flex items-center space-x-4">
                        <span>Currently Serving: <strong>#{serving}</strong></span>
                        <span>People Ahead: <strong>{peopleAhead}</strong></span>
                        <span className="text-teal-700 font-bold">Est. Wait: ~{peopleAhead * (dept?.avg_consult_minutes || 6)}m</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 self-end md:self-auto">
                    <button
                      onClick={() => {
                        setActiveTokenForView(tok);
                        setCurrentView('token-view');
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-sm"
                    >
                      View Live Ticket
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab 3: Past Visits & Feedback */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Completed Visits</h3>
            {completedAppointments.length === 0 ? (
              <p className="text-xs text-slate-400 py-4">No completed visits on record.</p>
            ) : (
              completedAppointments.map((appt) => {
                const fac = facilities.find((f) => f.id === appt.facility_id);
                const doc = doctors.find((d) => d.id === appt.doctor_id);
                const dept = departments.find((d) => d.id === appt.department_id);

                return (
                  <div
                    key={appt.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-slate-500">{appt.id}</span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                          Completed
                        </span>
                        <span className="text-xs text-slate-400">Date: {appt.date}</span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 mt-1">
                        {doc?.name} ({dept?.name}) at {fac?.name}
                      </h4>
                    </div>

                    <button
                      onClick={() => setFeedbackAppointment(appt)}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 flex items-center space-x-1.5 self-start sm:self-auto cursor-pointer"
                    >
                      <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                      <span>Submit Verified Feedback</span>
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Cancelled section */}
          {cancelledAppointments.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-200">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Cancelled Appointments</h3>
              {cancelledAppointments.map((appt) => (
                <div key={appt.id} className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs text-slate-500 flex items-center justify-between">
                  <div>
                    <span className="font-mono">{appt.id}</span> • {appt.date} at {appt.time}
                  </div>
                  <span className="px-2 py-0.5 rounded text-rose-700 bg-rose-50 font-semibold">Cancelled</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Feedback Submission Modal */}
      {feedbackAppointment && (
        <FeedbackModal
          appointment={feedbackAppointment}
          onClose={() => setFeedbackAppointment(null)}
        />
      )}

    </div>
  );
};
