import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Compass,
  Clock,
  MapPin,
  Calendar,
  Building2,
  User,
  Info,
  ChevronLeft,
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export const VisitPlannerModal: React.FC = () => {
  const { visitPlanData, setCurrentView, facilities, departments, doctors, generateVisitPlan } = useApp();

  const plan = visitPlanData || (
    facilities.length > 0 && departments.length > 0
      ? generateVisitPlan(facilities[0].id, departments[0].id, doctors[0]?.id)
      : null
  );

  if (!plan) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center bg-white rounded-3xl p-8 border border-slate-200">
        <p className="text-slate-600 text-sm">Please select a facility or appointment to generate a visit plan.</p>
        <button
          onClick={() => setCurrentView('facilities')}
          className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold"
        >
          Explore Facilities
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-6">
      
      {/* Back button */}
      <button
        onClick={() => setCurrentView('home')}
        className="text-xs font-semibold text-slate-500 hover:text-teal-600 flex items-center space-x-1 cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </button>

      {/* Main Plan Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-teal-500 to-cyan-500" />

        <div className="flex items-center space-x-2 text-xs font-bold text-teal-700 uppercase tracking-wider mb-1">
          <Compass className="w-4 h-4" />
          <span>Smart Queue & Travel Logistics</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Your Personalized Visit Plan
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Calculated schedule optimized for zero wasted waiting, factoring in registration buffer and travel distance.
        </p>

        {/* Highlighted Metrics Row */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-slate-400 block text-[11px]">Appointment Slot</span>
            <strong className="text-slate-900 text-sm block mt-0.5">{plan.appointment_time}</strong>
          </div>

          <div className="p-3.5 bg-teal-50 rounded-2xl border border-teal-200">
            <span className="text-teal-700 block text-[11px] font-semibold">Recommended Arrival</span>
            <strong className="text-teal-900 text-sm block mt-0.5">{plan.recommended_arrival}</strong>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-slate-400 block text-[11px]">Est. Queue Wait</span>
            <strong className="text-slate-900 text-sm block mt-0.5">~{plan.estimated_wait_minutes} mins</strong>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-slate-400 block text-[11px]">Facility Status</span>
            <strong className="text-emerald-700 text-sm block mt-0.5">{plan.status}</strong>
          </div>
        </div>

        {/* Hospital & Doctor Details */}
        <div className="mt-4 p-4 bg-slate-50/80 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-teal-600 shrink-0" />
            <div>
              <span className="font-bold text-slate-900">{plan.facility_name}</span>
              <span className="text-slate-400 block text-[11px]">{plan.department_name} Department</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-teal-600 shrink-0" />
            <div>
              <span className="font-bold text-slate-900">{plan.doctor_name}</span>
              <span className="text-slate-400 block text-[11px]">Consultant on Duty</span>
            </div>
          </div>
        </div>

        {/* Step Timeline */}
        <div className="mt-8">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center space-x-1.5">
            <Clock className="w-4 h-4 text-teal-600" />
            <span>Recommended Schedule Timeline</span>
          </h3>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-teal-200">
            {plan.timeline.map((step, idx) => (
              <div key={idx} className="relative flex items-start space-x-4">
                <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-teal-600 ring-4 ring-teal-100" />
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-teal-700">{step.time}</span>
                    {step.is_estimate && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        Estimate
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm mt-1">{step.label}</h4>
                  <p className="text-slate-500 mt-0.5 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Estimation Disclaimer */}
        <div className="mt-8 p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start space-x-2.5 text-xs text-amber-900">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Important Notice:</strong> Times labeled as "Estimate" are calculated based on normal traffic and current queue depth. Actual consultation duration may fluctuate depending on emergency cases in the hospital.
          </p>
        </div>

        {/* Bottom Navigation */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => setCurrentView('facilities')}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            Explore Other Facilities
          </button>
          <button
            onClick={() => setCurrentView('my-visits')}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-600/20"
          >
            Go to My Visits
          </button>
        </div>

      </div>
    </div>
  );
};
