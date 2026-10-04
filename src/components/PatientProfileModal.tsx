import React from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Ticket,
  LogOut,
  X,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const PatientProfileModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { currentUser, appointments, tokens, logout } = useApp();

  if (!isOpen || !currentUser) return null;

  const userAppointments = appointments.filter((a) => a.patient_name === currentUser.name || a.patient_id === currentUser.id);
  const userTokens = tokens.filter((t) => t.patient_name === currentUser.name || t.patient_id === currentUser.id);

  const handleLogout = () => {
    onClose();
    logout();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3.5">
          <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xl border-2 border-teal-200">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-teal-50 text-teal-800 border border-teal-200">
              Verified Patient
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-0.5">{currentUser.name}</h3>
            <p className="text-xs text-slate-500">{currentUser.email}</p>
          </div>
        </div>

        <div className="mt-6 space-y-3 text-xs text-slate-600">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center space-x-2.5">
            <Mail className="w-4 h-4 text-teal-600 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Email</span>
              <strong className="text-slate-900">{currentUser.email}</strong>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center space-x-2.5">
            <Phone className="w-4 h-4 text-teal-600 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Phone Number</span>
              <strong className="text-slate-900">{currentUser.phone || 'Not provided'}</strong>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
              <span className="text-[11px] text-slate-500 block">Total Appointments</span>
              <strong className="text-xl font-black text-slate-900">{userAppointments.length}</strong>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
              <span className="text-[11px] text-slate-500 block">Digital Tokens</span>
              <strong className="text-xl font-black text-slate-900">{userTokens.length}</strong>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">CareConnect Account</span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
