import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import {
  HeartPulse,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Mail,
  User,
  Building2,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-react';

export const SignInPage: React.FC = () => {
  const { login, loginWithGoogle, setCurrentView, adminAccounts } = useApp();

  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }
    if (!password.trim()) {
      setErrorMsg('Please enter your password.');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMsg('Please enter a valid email address format.');
      return;
    }

    // Role-based login
    if (selectedRole === 'hospital_admin') {
      const adminName = email.split('@')[0].replace(/[._]/g, ' ');
      const formattedName = adminName.charAt(0).toUpperCase() + adminName.slice(1) + ' (Admin)';
      login('hospital_admin', email.trim(), formattedName);
    } else {
      const patientName = email.split('@')[0].replace(/[._]/g, ' ');
      const formattedName = patientName.charAt(0).toUpperCase() + patientName.slice(1);
      login('patient', email.trim(), formattedName);
    }
  };

  const handleDemoPatientLogin = () => {
    login('patient', 'john.doe@example.com', 'John Doe');
  };

  const handleDemoAdminLogin = (adminEmail: string = 'admin@citycare.com', adminName: string = 'Dr. Evelyn Cross (CityCare Admin)') => {
    login('hospital_admin', adminEmail, adminName);
  };

  const handleGoogleClick = () => {
    loginWithGoogle(selectedRole);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 selection:bg-teal-500 selection:text-white">
      <div className="max-w-5xl w-full bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        
        {/* Left Side: Healthcare Branding & Benefits */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          
          {/* Subtle Ambient Background Gradients */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Logo */}
          <div className="relative z-10 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-teal-500/25">
                <HeartPulse className="w-7 h-7 animate-pulse" />
              </div>
              <div>
                <span className="font-black text-2xl tracking-tight text-white">
                  CARECONNECT
                </span>
                <span className="block text-[11px] font-semibold text-teal-300 uppercase tracking-wider">
                  Smart Healthcare Access Platform
                </span>
              </div>
            </div>

            <div className="pt-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug">
                Healthcare information before you travel.
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                Multi-hospital discovery, digital queue tokens, doctor schedules, and real-time provider management in one unified platform.
              </p>
            </div>
          </div>

          {/* 3 Core Value Propositions */}
          <div className="relative z-10 py-8 space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0 mt-0.5 border border-teal-500/30">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
              </div>
              <div className="text-xs">
                <strong className="text-white block font-bold text-sm">Discover verified hospitals</strong>
                <span className="text-slate-300">CityCare, Apollo, Sunshine, KIMS, and Continental hospitals with real-time availability.</span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0 mt-0.5 border border-teal-500/30">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
              </div>
              <div className="text-xs">
                <strong className="text-white block font-bold text-sm">Live digital queues & tokens</strong>
                <span className="text-slate-300">Track serving counters, estimated wait times, and walk-in consultation tokens.</span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0 mt-0.5 border border-teal-500/30">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
              </div>
              <div className="text-xs">
                <strong className="text-white block font-bold text-sm">Assigned hospital admin control</strong>
                <span className="text-slate-300">Dedicated hospital consoles for doctor rosters, queue advancement, and status management.</span>
              </div>
            </div>
          </div>

          {/* Bottom Security / Trust Pill */}
          <div className="relative z-10 pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Multi-Hospital Architecture</span>
            </span>
            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded font-semibold border border-amber-500/30">
              Demo Mode Active
            </span>
          </div>
        </div>

        {/* Right Side: Sign-In Card & Role Selector */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
          <div>
            
            {/* Header */}
            <div>
              <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider block">
                CARECONNECT
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Smart Healthcare Access Platform
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Select your role to access your personalized patient portal or assigned hospital console.
              </p>
            </div>

            {/* Role Selector Tabs (Patient vs Hospital Admin) */}
            <div className="mt-6 bg-slate-100 p-1.5 rounded-2xl grid grid-cols-2 gap-1.5 border border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('patient');
                  setErrorMsg('');
                }}
                className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                  selectedRole === 'patient'
                    ? 'bg-white text-teal-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-4 h-4 text-teal-600" />
                <span>Patient</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedRole('hospital_admin');
                  setErrorMsg('');
                }}
                className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                  selectedRole === 'hospital_admin'
                    ? 'bg-white text-amber-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-4 h-4 text-amber-600" />
                <span>Hospital Admin</span>
              </button>
            </div>

            {/* Error Message if any */}
            {errorMsg && (
              <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Role Header Info */}
            <div className="mt-5 flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-slate-700">
                {selectedRole === 'patient' ? 'Patient Sign In' : 'Hospital Admin Sign In'}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-teal-50 text-teal-800 border border-teal-200">
                {selectedRole === 'patient' ? 'Patient Portal' : 'Hospital Admin Portal'}
              </span>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-3 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={
                      selectedRole === 'patient'
                        ? 'e.g. test@gmail.com'
                        : 'e.g. admin@citycare.com or admin@apollo.com'
                    }
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Password
                  </label>
                  <span className="text-[11px] text-slate-400">
                    {selectedRole === 'hospital_admin' ? 'Any demo password' : 'Min 6 characters'}
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {selectedRole === 'hospital_admin' && (
                <div className="p-2.5 bg-amber-50/70 border border-amber-200/80 rounded-xl text-[11px] text-amber-900 leading-relaxed">
                  <strong>Assigned Hospital Identification:</strong> Use <code>admin@citycare.com</code> (CityCare), <code>admin@apollo.com</code> (Apollo), <code>admin@sunshine.com</code> (Sunshine), <code>admin@kims.com</code> (KIMS), or <code>admin@continental.com</code> (Continental). Any unassigned email will prompt hospital selection.
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm text-white transition-all shadow-md cursor-pointer ${
                  selectedRole === 'patient'
                    ? 'bg-teal-600 hover:bg-teal-700 shadow-teal-600/20'
                    : 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20'
                }`}
              >
                {selectedRole === 'patient' ? 'Sign In' : 'Sign In as Hospital Admin'}
              </button>
            </form>

            {/* Google Sign-In with Real Demo Flow (Requirement 5) */}
            <div className="mt-3">
              <button
                type="button"
                onClick={handleGoogleClick}
                className="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer shadow-xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.87c2.26-2.09 3.67-5.17 3.67-9.15z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.05c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.28v3.15C3.26 21.36 7.34 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.27 14.24c-.25-.72-.39-1.5-.39-2.24s.14-1.52.39-2.24V6.61H1.28C.46 8.23 0 10.06 0 12s.46 3.77 1.28 5.39l3.99-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.28 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.73-4.96z"
                  />
                </svg>
                <span>Continue with Google <span className="text-[10px] text-slate-400 font-normal">(Demo Flow)</span></span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-slate-400 font-bold">OR</span>
              </div>
            </div>

            {/* Quick Demo Login Buttons */}
            <div>
              {selectedRole === 'patient' ? (
                <button
                  type="button"
                  onClick={handleDemoPatientLogin}
                  className="w-full py-2.5 rounded-xl bg-teal-50 border border-teal-200 hover:bg-teal-100 text-teal-800 font-bold text-xs sm:text-sm flex items-center justify-center space-x-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  <span>Demo Patient Login</span>
                </button>
              ) : (
                <div className="space-y-1.5">
                  <button
                    type="button"
                    onClick={() => handleDemoAdminLogin('admin@citycare.com', 'Dr. Evelyn Cross (CityCare Admin)')}
                    className="w-full py-2.5 rounded-xl bg-amber-50 border border-amber-200 hover:bg-amber-100 text-amber-900 font-bold text-xs sm:text-sm flex items-center justify-center space-x-1.5 transition-all shadow-xs cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <span>Demo Admin Login (CityCare Hospital)</span>
                  </button>
                  <div className="flex items-center justify-center space-x-2 text-[11px] text-slate-500 pt-1">
                    <span>Quick Switch:</span>
                    <button
                      type="button"
                      onClick={() => handleDemoAdminLogin('admin@apollo.com', 'Dr. Suresh Reddy (Apollo Admin)')}
                      className="text-amber-800 font-semibold hover:underline cursor-pointer"
                    >
                      Apollo
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => handleDemoAdminLogin('admin@sunshine.com', 'Dr. Neha Sharma (Sunshine Admin)')}
                      className="text-amber-800 font-semibold hover:underline cursor-pointer"
                    >
                      Sunshine
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => handleDemoAdminLogin('admin@kims.com', 'Dr. Rajesh Rao (KIMS Admin)')}
                      className="text-amber-800 font-semibold hover:underline cursor-pointer"
                    >
                      KIMS
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => handleDemoAdminLogin('admin@continental.com', 'Dr. Tariq Wilson (Continental Admin)')}
                      className="text-amber-800 font-semibold hover:underline cursor-pointer"
                    >
                      Continental
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Bottom Footer Actions */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
            {selectedRole === 'patient' ? (
              <div className="flex items-center space-x-1">
                <span>New to CareConnect?</span>
                <button
                  type="button"
                  onClick={() => setCurrentView('register')}
                  className="font-bold text-teal-700 hover:underline cursor-pointer"
                >
                  Create Patient Account
                </button>
              </div>
            ) : (
              <span className="text-[11px] text-slate-400">
                Hospital Administration Portal
              </span>
            )}

            <span className="text-[11px] text-slate-400 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
              <span>Demo Mode — for hackathon evaluation</span>
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};
