import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CheckCircle2,
  Calendar,
  Clock,
  Building2,
  User,
  MapPin,
  QrCode,
  Download,
  Share2,
  ArrowRight,
  Navigation,
  XCircle,
  RefreshCw
} from 'lucide-react';

export const AppointmentConfirmationModal: React.FC = () => {
  const {
    lastConfirmedAppointment,
    facilities,
    doctors,
    departments,
    setCurrentView,
    cancelAppointment,
    generateVisitPlan
  } = useApp();

  const [rescheduleNotice, setRescheduleNotice] = useState(false);

  if (!lastConfirmedAppointment) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center bg-white rounded-3xl p-8 border border-slate-200">
        <p className="text-slate-600 text-sm">No recent appointment confirmation found.</p>
        <button
          onClick={() => setCurrentView('facilities')}
          className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold"
        >
          Explore Facilities
        </button>
      </div>
    );
  }

  const appt = lastConfirmedAppointment;
  const facility = facilities.find((f) => f.id === appt.facility_id);
  const doctor = doctors.find((d) => d.id === appt.doctor_id);
  const dept = departments.find((d) => d.id === appt.department_id);

  const handleDownloadICS = () => {
    // Generate simple calendar invite string
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//CareConnect//EN
BEGIN:VEVENT
SUMMARY:Doctor Appointment: ${doctor?.name || 'CareConnect'}
DESCRIPTION:Appointment ID: ${appt.id}\\nFacility: ${facility?.name}\\nDepartment: ${dept?.name}
LOCATION:${facility?.address}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `appointment-${appt.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-6">
      
      {/* Success Card with Healthcare Badge */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500" />

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 ring-8 ring-emerald-50/60 shadow-xs">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 uppercase tracking-widest mb-1">
            Confirmed
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Appointment Confirmed!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md">
            Your consultation slot is locked in the hospital schedule. Please present your Appointment ID upon arrival.
          </p>

          {/* Appointment ID Badge */}
          <div className="mt-5 px-5 py-2.5 bg-slate-900 text-white rounded-2xl shadow-md flex items-center space-x-2">
            <span className="text-xs text-slate-400 font-medium">Appointment ID:</span>
            <span className="font-mono text-base font-extrabold tracking-wider text-teal-300">
              {appt.id}
            </span>
          </div>
        </div>

        {/* Factual Appointment Details Card */}
        <div className="mt-8 bg-slate-50 rounded-2xl p-5 sm:p-6 border border-slate-100 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-slate-400 font-medium flex items-center space-x-1">
                <User className="w-3.5 h-3.5 text-teal-600" />
                <span>Doctor:</span>
              </span>
              <strong className="text-sm text-slate-900 block">{doctor?.name || 'Duty Specialist'}</strong>
              <span className="text-[11px] text-teal-700">{doctor?.specialization}</span>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 font-medium flex items-center space-x-1">
                <Building2 className="w-3.5 h-3.5 text-teal-600" />
                <span>Healthcare Facility:</span>
              </span>
              <strong className="text-sm text-slate-900 block">{facility?.name}</strong>
              <span className="text-[11px] text-slate-500 block truncate">{facility?.address}</span>
            </div>

            <div className="space-y-1 pt-2 border-t border-slate-200/60">
              <span className="text-slate-400 font-medium flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-teal-600" />
                <span>Date & Time:</span>
              </span>
              <strong className="text-sm text-slate-900 block">{appt.date}</strong>
              <span className="text-xs font-bold text-teal-700">{appt.time}</span>
            </div>

            <div className="space-y-1 pt-2 border-t border-slate-200/60">
              <span className="text-slate-400 font-medium">Department:</span>
              <strong className="text-sm text-slate-900 block">{dept?.name || 'Outpatient Clinic'}</strong>
              <span className="text-[11px] text-slate-500 block">Patient: {appt.patient_name} ({appt.patient_age}y)</span>
            </div>
          </div>

          {/* QR representation */}
          <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-xs">
                <QrCode className="w-10 h-10 text-slate-800" />
              </div>
              <div className="text-[11px] text-slate-500">
                <p className="font-semibold text-slate-800">Digital Gate Pass</p>
                <p>Scan at reception kiosk for instant check-in</p>
              </div>
            </div>

            <button
              onClick={handleDownloadICS}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-teal-600" />
              <span>Add to Calendar</span>
            </button>
          </div>
        </div>

        {/* Reschedule or Cancel helper */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 text-xs">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                cancelAppointment(appt.id);
                setCurrentView('my-visits');
              }}
              className="text-rose-600 hover:text-rose-700 font-semibold cursor-pointer"
            >
              Cancel Appointment
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => setRescheduleNotice(true)}
              className="text-teal-700 hover:text-teal-800 font-semibold cursor-pointer"
            >
              Reschedule
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                if (facility && dept) {
                  generateVisitPlan(facility.id, dept.id, doctor?.id, appt.time);
                  setCurrentView('visit-planner');
                }
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 flex items-center space-x-1 cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Plan My Visit Timeline</span>
            </button>

            <button
              onClick={() => setCurrentView('my-visits')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/20 flex items-center space-x-1 cursor-pointer"
            >
              <span>View in My Visits</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {rescheduleNotice && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center justify-between">
            <span>To reschedule, select an alternate slot from "My Visits" dashboard.</span>
            <button
              onClick={() => setCurrentView('my-visits')}
              className="underline font-bold ml-2"
            >
              Go to My Visits
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
