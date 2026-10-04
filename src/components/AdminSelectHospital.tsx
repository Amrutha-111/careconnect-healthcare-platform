import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Building2,
  ShieldCheck,
  MapPin,
  Users,
  Layers,
  Calendar,
  ArrowRight,
  LogOut,
  CheckCircle2,
  Clock
} from 'lucide-react';

export const AdminSelectHospital: React.FC = () => {
  const { facilities, departments, doctors, appointmentSlots, assignAdminHospital, currentUser, logout } = useApp();

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 lg:p-8 flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950">
      <div className="max-w-6xl mx-auto w-full py-6">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl text-white">
                  CARE<span className="text-teal-400">CONNECT</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Hospital Admin Setup
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Logged in as <strong className="text-slate-200">{currentUser?.email}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Title & Instructions */}
        <div className="my-8 text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            Hospital Identification Required
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Select Your Assigned Hospital
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            CareConnect enforces strict multi-hospital isolation. Choose the healthcare facility you are authorized to administer. Once selected, your session will manage only this hospital.
          </p>
        </div>

        {/* Hospital Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.slice(0, 5).map((hospital) => {
            const hospDepts = departments.filter((d) => d.facility_id === hospital.id);
            const hospDocs = doctors.filter((d) => d.facility_id === hospital.id);
            const openSlots = appointmentSlots.filter(
              (s) => s.facility_id === hospital.id && !s.is_booked
            );

            return (
              <div
                key={hospital.id}
                className="bg-slate-800/90 rounded-3xl border border-slate-700/80 hover:border-amber-500/60 p-6 flex flex-col justify-between shadow-xl transition-all duration-300 hover:scale-[1.02] group"
              >
                <div>
                  {/* Status & ID Badge */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-slate-400 uppercase bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-700">
                      ID: {hospital.id}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        hospital.status === 'open'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {hospital.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Hospital Name & Location */}
                  <h3 className="text-xl font-bold text-white mt-4 group-hover:text-amber-300 transition-colors">
                    {hospital.name}
                  </h3>
                  <div className="flex items-center space-x-1.5 text-xs text-slate-400 mt-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{hospital.address}</span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-300/80 mt-3 line-clamp-2 leading-relaxed">
                    {hospital.description}
                  </p>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-slate-700/60 text-center">
                    <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-750">
                      <div className="flex items-center justify-center space-x-1 text-slate-400 text-[10px] uppercase font-bold">
                        <Users className="w-3 h-3 text-amber-400" />
                        <span>Doctors</span>
                      </div>
                      <span className="text-base font-black text-white mt-0.5 block">
                        {hospDocs.length}
                      </span>
                    </div>

                    <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-750">
                      <div className="flex items-center justify-center space-x-1 text-slate-400 text-[10px] uppercase font-bold">
                        <Layers className="w-3 h-3 text-teal-400" />
                        <span>Depts</span>
                      </div>
                      <span className="text-base font-black text-white mt-0.5 block">
                        {hospDepts.length}
                      </span>
                    </div>

                    <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-750">
                      <div className="flex items-center justify-center space-x-1 text-slate-400 text-[10px] uppercase font-bold">
                        <Calendar className="w-3 h-3 text-cyan-400" />
                        <span>Slots</span>
                      </div>
                      <span className="text-base font-black text-white mt-0.5 block">
                        {openSlots.length}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Assignment Button */}
                <div className="mt-6 pt-4 border-t border-slate-700/60">
                  <button
                    onClick={() => assignAdminHospital(hospital.id)}
                    className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md shadow-amber-500/20 cursor-pointer"
                  >
                    <span>Manage {hospital.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security & Multi-Hospital Note */}
        <div className="mt-8 p-4 bg-slate-800/60 border border-slate-700 rounded-2xl text-xs text-slate-400 flex items-start space-x-3">
          <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-200 block font-semibold mb-0.5">
              Assigned Hospital Security Guarantee
            </strong>
            <p>
              Once assigned, your administrator privileges apply strictly to your chosen hospital. You will not have access to alter doctors, departments, queue tokens, or patient visits belonging to other hospitals in the network.
            </p>
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer className="text-center text-[11px] text-slate-500 py-4 border-t border-slate-800">
        CareConnect Multi-Hospital Network • Hackathon Administration Setup
      </footer>
    </div>
  );
};
