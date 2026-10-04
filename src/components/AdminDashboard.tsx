import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Doctor, Department, Appointment, DepartmentStatus, FacilityStatus, DoctorStatus, AppointmentStatus } from '../types';
import {
  ShieldCheck,
  Users,
  Ticket,
  Clock,
  Layers,
  Calendar,
  Building2,
  CheckCircle,
  XCircle,
  Plus,
  RefreshCw,
  BellRing,
  ArrowRight,
  Star,
  MessageSquare,
  AlertTriangle,
  Activity,
  Edit,
  Trash2,
  Search,
  Filter,
  CheckCircle2,
  Lock,
  UserX,
  Settings,
  Save,
  ExternalLink,
  Phone,
  Mail
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    facilities,
    departments,
    doctors,
    appointments,
    tokens,
    feedbackList,
    patientsList,
    callNextToken,
    skipToken,
    completeToken,
    resetQueue,
    updateDepartmentStatus,
    updateFacilityStatus,
    toggleDoctorAvailability,
    setDoctorStatus,
    addDoctor,
    editDoctor,
    addDepartment,
    editDepartment,
    updateAppointmentStatus,
    updateHospitalSettings,
    selectHospital,
    activeAdminFacilityId,
    setActiveAdminFacilityId,
    currentView,
    setCurrentView
  } = useApp();

  // Internal tab state synced with currentView
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  useEffect(() => {
    if (currentView.startsWith('admin-')) {
      const tabName = currentView.replace('admin-', '');
      if (tabName === 'facility-status') setActiveTab('facility-status');
      else if (tabName === 'queue') setActiveTab('queue');
      else if (tabName === 'patients') setActiveTab('patients');
      else if (tabName === 'doctors') setActiveTab('doctors');
      else if (tabName === 'departments') setActiveTab('departments');
      else if (tabName === 'appointments') setActiveTab('appointments');
      else if (tabName === 'feedback') setActiveTab('feedback');
      else if (tabName === 'settings') setActiveTab('settings');
      else setActiveTab('dashboard');
    }
  }, [currentView]);

  const [adminDeptId, setAdminDeptId] = useState<string>('dept-1-derma');

  // Form states for adding Doctor & Department
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);
  const [newDoctorName, setNewDoctorName] = useState('');
  const [newDoctorSpec, setNewDoctorSpec] = useState('');
  const [newDoctorExp, setNewDoctorExp] = useState(8);
  const [newDoctorDeptId, setNewDoctorDeptId] = useState('');

  const [showAddDeptModal, setShowAddDeptModal] = useState(false);
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptDesc, setNewDeptDesc] = useState('');

  // Patient Search & Filter in Admin
  const [patientSearch, setPatientSearch] = useState('');

  const currentFac = facilities.find((f) => f.id === activeAdminFacilityId) || facilities[0];
  const facDepartments = departments.filter((d) => d.facility_id === activeAdminFacilityId);
  const facDoctors = doctors.filter((d) => d.facility_id === activeAdminFacilityId);
  const facAppointments = appointments.filter((a) => a.facility_id === activeAdminFacilityId);
  const facFeedback = feedbackList.filter((fb) => fb.facility_id === activeAdminFacilityId);

  // Settings Form State for current hospital (Requirement 20)
  const [settingName, setSettingName] = useState(currentFac.name);
  const [settingAddress, setSettingAddress] = useState(currentFac.address);
  const [settingPhone, setSettingPhone] = useState(currentFac.phone || '');
  const [settingEmail, setSettingEmail] = useState(currentFac.email || '');
  const [settingOpeningHours, setSettingOpeningHours] = useState(currentFac.opening_hours || '');
  const [settingEmergency, setSettingEmergency] = useState(Boolean(currentFac.is_emergency));
  const [settingStatus, setSettingStatus] = useState<FacilityStatus>(currentFac.status);
  const [settingSlotDuration, setSettingSlotDuration] = useState(currentFac.appointmentSettings?.slotDurationMinutes || 20);
  const [settingAdvanceDays, setSettingAdvanceDays] = useState(currentFac.appointmentSettings?.advanceBookingDays || 14);
  const [settingAutoConfirm, setSettingAutoConfirm] = useState(Boolean(currentFac.appointmentSettings?.autoConfirm));
  const [settingTokenPrefix, setSettingTokenPrefix] = useState(currentFac.queueSettings?.tokenPrefix || 'CC');
  const [settingMaxDailyTokens, setSettingMaxDailyTokens] = useState(currentFac.queueSettings?.maxDailyTokens || 100);
  const [settingAllowOnlineTokens, setSettingAllowOnlineTokens] = useState(currentFac.queueSettings?.allowOnlineTokens !== false);
  const [settingQueuePaused, setSettingQueuePaused] = useState(Boolean(currentFac.queueSettings?.isPaused));
  const [settingsSavedMessage, setSettingsSavedMessage] = useState('');

  // Keep form in sync when hospital changes
  useEffect(() => {
    setSettingName(currentFac.name);
    setSettingAddress(currentFac.address);
    setSettingPhone(currentFac.phone || '');
    setSettingEmail(currentFac.email || '');
    setSettingOpeningHours(currentFac.opening_hours || '');
    setSettingEmergency(Boolean(currentFac.is_emergency));
    setSettingStatus(currentFac.status);
    setSettingSlotDuration(currentFac.appointmentSettings?.slotDurationMinutes || 20);
    setSettingAdvanceDays(currentFac.appointmentSettings?.advanceBookingDays || 14);
    setSettingAutoConfirm(Boolean(currentFac.appointmentSettings?.autoConfirm));
    setSettingTokenPrefix(currentFac.queueSettings?.tokenPrefix || 'CC');
    setSettingMaxDailyTokens(currentFac.queueSettings?.maxDailyTokens || 100);
    setSettingAllowOnlineTokens(currentFac.queueSettings?.allowOnlineTokens !== false);
    setSettingQueuePaused(Boolean(currentFac.queueSettings?.isPaused));
  }, [currentFac.id, currentFac.name]);

  const handleSaveHospitalSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateHospitalSettings({
      name: settingName,
      address: settingAddress,
      phone: settingPhone,
      email: settingEmail,
      opening_hours: settingOpeningHours,
      is_emergency: settingEmergency,
      status: settingStatus,
      appointmentSettings: {
        slotDurationMinutes: Number(settingSlotDuration),
        advanceBookingDays: Number(settingAdvanceDays),
        autoConfirm: settingAutoConfirm,
        workingDays: currentFac.appointmentSettings?.workingDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
      },
      queueSettings: {
        tokenPrefix: settingTokenPrefix,
        maxDailyTokens: Number(settingMaxDailyTokens),
        allowOnlineTokens: settingAllowOnlineTokens,
        isPaused: settingQueuePaused
      }
    });

    setSettingsSavedMessage('Hospital settings updated and persisted successfully!');
    setTimeout(() => setSettingsSavedMessage(''), 4000);
  };

  const handlePreviewAsPatient = () => {
    selectHospital(currentFac.id);
    setCurrentView('facility-detail');
  };

  const activeDept = departments.find((d) => d.id === adminDeptId) || facDepartments[0] || departments[0];

  // Aggregated Admin Metrics (Section 10)
  const totalAppointmentsToday = facAppointments.length;
  const activePatientsWaiting = facDepartments.reduce(
    (acc, d) => acc + Math.max(0, d.current_token - d.serving_token),
    0
  );
  const availableDoctorsCount = facDoctors.filter((d) => d.status === 'available').length;
  const activeDeptsCount = facDepartments.filter((d) => d.status === 'available').length;
  const avgWaitTime = facDepartments.length > 0
    ? Math.round(facDepartments.reduce((acc, d) => acc + d.estimated_wait_minutes, 0) / facDepartments.length)
    : 15;

  const handleCreateDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoctorName || !newDoctorSpec) return;

    addDoctor({
      facility_id: activeAdminFacilityId,
      department_id: newDoctorDeptId || adminDeptId || facDepartments[0]?.id || 'dept-1-genmed',
      name: newDoctorName.startsWith('Dr.') ? newDoctorName : `Dr. ${newDoctorName}`,
      specialization: newDoctorSpec,
      experience_years: Number(newDoctorExp) || 5,
      available_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      consultation_mode: 'both',
      status: 'available',
      next_available_slot: 'Today, 02:00 PM',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
      bio: `Board-certified medical practitioner specializing in ${newDoctorSpec} with dedication to clinical excellence.`,
      consultation_fee: 40,
      qualifications: 'MBBS, MD'
    });

    setNewDoctorName('');
    setNewDoctorSpec('');
    setShowAddDoctorModal(false);
  };

  const handleCreateDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName) return;

    addDepartment({
      facility_id: activeAdminFacilityId,
      name: newDeptName,
      description: newDeptDesc || `Clinical services and outpatient care for ${newDeptName}.`,
      status: 'available',
      current_token: 1,
      serving_token: 0,
      tokens_remaining: 25,
      avg_consult_minutes: 7,
      estimated_wait_minutes: 0
    });

    setNewDeptName('');
    setNewDeptDesc('');
    setShowAddDeptModal(false);
  };

  const filteredPatients = patientsList.filter((p) => {
    const q = patientSearch.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.phone.toLowerCase().includes(q) ||
      (p.latestDepartment && p.latestDepartment.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Admin Facility Status Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                Hospital Admin Dashboard
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                Shared Data Sync Active
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {currentFac.name}
            </h1>
            <p className="text-xs text-slate-300">
              Manage live token queues, call patient tokens, update doctor duty rosters, and monitor patient feedback.
            </p>
          </div>

          {/* Quick Facility Status Selector */}
          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
            <span className="text-xs text-slate-400 font-semibold">Facility Operational State:</span>
            <div className="flex rounded-xl bg-slate-800 p-1 border border-slate-700 text-xs">
              <button
                onClick={() => updateFacilityStatus(currentFac.id, 'open')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  currentFac.status === 'open' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                OPEN
              </button>
              <button
                onClick={() => updateFacilityStatus(currentFac.id, 'busy')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  currentFac.status === 'busy' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                BUSY
              </button>
              <button
                onClick={() => updateFacilityStatus(currentFac.id, 'closed')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  currentFac.status === 'closed' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                CLOSED
              </button>
            </div>
          </div>
        </div>

        {/* 7 Top Statistics Cards (Section 10) */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700">
            <span className="text-slate-400 block text-[11px] font-medium">Today's Appts</span>
            <strong className="text-white text-xl font-black mt-0.5 block">{totalAppointmentsToday}</strong>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700">
            <span className="text-slate-400 block text-[11px] font-medium">Active Patients</span>
            <strong className="text-teal-300 text-xl font-black mt-0.5 block">{patientsList.length}</strong>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700">
            <span className="text-slate-400 block text-[11px] font-medium">Waiting Patients</span>
            <strong className="text-amber-400 text-xl font-black mt-0.5 block">{activePatientsWaiting}</strong>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700">
            <span className="text-slate-400 block text-[11px] font-medium">Current Token</span>
            <strong className="text-amber-300 text-xl font-black mt-0.5 block">#{activeDept.serving_token}</strong>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700">
            <span className="text-slate-400 block text-[11px] font-medium">Available Doctors</span>
            <strong className="text-emerald-400 text-xl font-black mt-0.5 block">
              {availableDoctorsCount} / {facDoctors.length}
            </strong>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700">
            <span className="text-slate-400 block text-[11px] font-medium">Active Depts</span>
            <strong className="text-teal-300 text-xl font-black mt-0.5 block">
              {activeDeptsCount} / {facDepartments.length}
            </strong>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700">
            <span className="text-slate-400 block text-[11px] font-medium">Average Wait</span>
            <strong className="text-white text-xl font-black mt-0.5 block">~{avgWaitTime} min</strong>
          </div>
        </div>

        {/* In-Page Sub Navigation Tabs */}
        <div className="mt-8 pt-4 border-t border-slate-800/80 flex flex-wrap gap-2 text-xs font-bold overflow-x-auto">
          {[
            { id: 'dashboard', label: 'Summary Overview' },
            { id: 'queue', label: 'Queue Management' },
            { id: 'appointments', label: 'Appointments' },
            { id: 'patients', label: 'Patients' },
            { id: 'doctors', label: 'Doctor Management' },
            { id: 'departments', label: 'Department Management' },
            { id: 'facility-status', label: 'Facility Status' },
            { id: 'feedback', label: 'Patient Feedback' },
            { id: 'settings', label: 'Hospital Settings' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id ? 'bg-amber-500 text-slate-950 font-black shadow-xs' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* View 1: Summary Overview */}
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Active Queue Snapshot */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Ticket className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-base text-slate-900">Live Department Queue Pulse</h3>
              </div>
              <button
                onClick={() => setActiveTab('queue')}
                className="text-xs font-bold text-teal-700 hover:underline"
              >
                Open Queue Console →
              </button>
            </div>

            <div className="space-y-3">
              {facDepartments.slice(0, 4).map((d) => (
                <div key={d.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 text-sm">{d.name}</span>
                    <span className="text-slate-500 block text-[11px]">
                      Tokens Remaining: {d.tokens_remaining} • Avg consult: {d.avg_consult_minutes} min
                    </span>
                  </div>
                  <div className="text-right space-y-0.5">
                    <span className="text-[11px] text-slate-500">Serving / Total:</span>
                    <div className="font-mono font-bold text-teal-800 text-sm">
                      #{d.serving_token} / #{d.current_token}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Today's Bookings Snapshot */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-base text-slate-900">Today's Appointment Schedule</h3>
              </div>
              <button
                onClick={() => setActiveTab('appointments')}
                className="text-xs font-bold text-teal-700 hover:underline"
              >
                Manage All ({facAppointments.length}) →
              </button>
            </div>

            <div className="space-y-3">
              {facAppointments.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No appointments booked today.</p>
              ) : (
                facAppointments.slice(0, 4).map((a) => {
                  const doc = doctors.find((d) => d.id === a.doctor_id);
                  return (
                    <div key={a.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-slate-900">{a.id}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            {a.status}
                          </span>
                        </div>
                        <span className="font-bold text-slate-800 mt-1 block">{a.patient_name}</span>
                        <span className="text-[11px] text-slate-500">With {doc?.name}</span>
                      </div>
                      <div className="text-right">
                        <strong className="text-slate-900 text-sm block">{a.time}</strong>
                        <span className="text-[10px] text-slate-400">{a.date}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>
      )}

      {/* View 2: Queue Management (Section 15) */}
      {activeTab === 'queue' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">
                Live Queue Management
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                Patient Calling & Queue Simulation Console
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Calling next token advances the serving counter, notifies the patient immediately, and updates active tickets.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-600 font-semibold">Select Department:</span>
              <select
                value={adminDeptId}
                onChange={(e) => setAdminDeptId(e.target.value)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-300 bg-white"
              >
                {facDepartments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Big Live Control Card */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-semibold text-teal-400 uppercase tracking-widest">
                  Department
                </span>
                <h3 className="text-xl font-bold text-white mt-1">{activeDept.name}</h3>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Shift Active
              </span>
            </div>

            {/* Numbers Display (Section 15: Current Token, Waiting Patients, Estimated Wait, Next Token) */}
            <div className="py-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-800">
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block">
                  Current Token
                </span>
                <span className="font-mono text-4xl sm:text-5xl font-black text-amber-300">
                  #{activeDept.serving_token}
                </span>
                <span className="text-[11px] text-slate-400 block">At consultation desk</span>
              </div>

              <div className="space-y-1 pt-4 sm:pt-0">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block">
                  Waiting Patients
                </span>
                <span className="font-mono text-4xl sm:text-5xl font-black text-teal-300">
                  {Math.max(0, activeDept.current_token - activeDept.serving_token)}
                </span>
                <span className="text-[11px] text-slate-400 block">In lounge queue</span>
              </div>

              <div className="space-y-1 pt-4 sm:pt-0">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block">
                  Estimated Wait
                </span>
                <span className="font-mono text-4xl sm:text-5xl font-black text-white">
                  {activeDept.estimated_wait_minutes} min
                </span>
                <span className="text-[11px] text-slate-400 block">Calculated turnover</span>
              </div>

              <div className="space-y-1 pt-4 sm:pt-0">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block">
                  Next Token
                </span>
                <span className="font-mono text-4xl sm:text-5xl font-black text-cyan-300">
                  #{activeDept.serving_token + 1}
                </span>
                <span className="text-[11px] text-slate-400 block">Ready to enter</span>
              </div>
            </div>

            {/* Section 15 Action Buttons: [ Call Next ], [ Skip ], [ Complete ], [ Reset Queue ] */}
            <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => callNextToken(activeDept.id)}
                className="px-6 py-3.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-sm shadow-lg shadow-teal-500/20 flex items-center space-x-2 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                <BellRing className="w-5 h-5 text-slate-950" />
                <span>Call Next Token (#{activeDept.serving_token + 1})</span>
              </button>

              <button
                onClick={() => skipToken(activeDept.id)}
                className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 cursor-pointer"
              >
                Skip Token
              </button>

              <button
                onClick={() => completeToken(activeDept.id)}
                className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-emerald-300 font-bold text-xs border border-slate-700 cursor-pointer"
              >
                Mark Completed
              </button>

              <button
                onClick={() => resetQueue(activeDept.id)}
                className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-rose-950/40 text-rose-300 font-bold text-xs border border-slate-700 cursor-pointer"
              >
                Reset Queue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View 3: Patient Management (Section 11) */}
      {activeTab === 'patients' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Patient Registry & Visit Status</h2>
              <p className="text-xs text-slate-500">
                Patients with active bookings, queue tokens, or completed consultations.
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={patientSearch}
                onChange={(e) => setPatientSearch(e.target.value)}
                placeholder="Search patient name, phone..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                  <th className="p-3">Patient Name</th>
                  <th className="p-3">Contact</th>
                  <th className="p-3">Appts</th>
                  <th className="p-3">Tokens</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Assigned Doctor</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPatients.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-6 text-center text-slate-400">
                      No matching patient records found.
                    </td>
                  </tr>
                ) : (
                  filteredPatients.map((p) => (
                    <tr key={p.id + p.name} className="hover:bg-slate-50/70">
                      <td className="p-3 font-bold text-slate-900 flex items-center space-x-2">
                        <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-[11px]">
                          {p.name.charAt(0)}
                        </div>
                        <span>{p.name}</span>
                      </td>
                      <td className="p-3 text-slate-600">{p.phone}</td>
                      <td className="p-3 font-semibold text-slate-800">{p.appointmentCount}</td>
                      <td className="p-3 font-semibold text-slate-800">{p.tokenCount}</td>
                      <td className="p-3 text-slate-700">{p.latestDepartment || 'General'}</td>
                      <td className="p-3 text-slate-700">{p.latestDoctor || 'Duty Physician'}</td>
                      <td className="p-3 text-slate-500">{p.lastVisitDate}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">
                          {p.latestStatus || 'Active'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View 4: Doctor Management (Section 12) */}
      {activeTab === 'doctors' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Manage Doctors & Schedules</h2>
              <p className="text-xs text-slate-500">
                Changes immediately update patient-facing availability and search results.
              </p>
            </div>
            <button
              onClick={() => setShowAddDoctorModal(true)}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Doctor</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                  <th className="p-3">Doctor</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Experience</th>
                  <th className="p-3">Consultation Fee</th>
                  <th className="p-3">Duty Status</th>
                  <th className="p-3">Toggle Availability</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {facDoctors.map((doc) => {
                  const dept = departments.find((d) => d.id === doc.department_id);
                  return (
                    <tr key={doc.id} className="hover:bg-slate-50/60">
                      <td className="p-3 font-bold text-slate-900 flex items-center space-x-2">
                        <img src={doc.avatar} alt={doc.name} className="w-8 h-8 rounded-lg object-cover" />
                        <div>
                          <span>{doc.name}</span>
                          <span className="text-[10px] text-slate-400 block font-normal">{doc.specialization}</span>
                        </div>
                      </td>
                      <td className="p-3 text-slate-600">{dept?.name || 'General'}</td>
                      <td className="p-3 text-slate-600">{doc.experience_years} years</td>
                      <td className="p-3 font-semibold text-slate-800">${doc.consultation_fee}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            doc.status === 'available'
                              ? 'bg-emerald-100 text-emerald-800'
                              : doc.status === 'unavailable'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {doc.status === 'unavailable' ? 'Currently Unavailable' : doc.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-1.5">
                          <button
                            onClick={() => toggleDoctorAvailability(doc.id)}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                          >
                            {doc.status === 'available' ? 'Mark Unavailable' : 'Mark Available'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View 5: Department Management (Section 13) */}
      {activeTab === 'departments' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Manage Clinical Departments</h2>
              <p className="text-xs text-slate-500">
                Activate or close departments. Closed departments are reflected in the patient booking flow.
              </p>
            </div>
            <button
              onClick={() => setShowAddDeptModal(true)}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Department</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {facDepartments.map((dept) => (
              <div key={dept.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-base text-slate-900">{dept.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{dept.description}</p>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        dept.status === 'available' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {dept.status}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2 text-xs bg-white p-3 rounded-xl border border-slate-200/70">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Serving</span>
                      <strong className="text-slate-900 font-bold">#{dept.serving_token}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Tokens Total</span>
                      <strong className="text-slate-900 font-bold">#{dept.current_token}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Est. Wait</span>
                      <strong className="text-teal-700 font-bold">~{dept.estimated_wait_minutes}m</strong>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-xs text-slate-500">Status Control:</span>
                  <button
                    onClick={() =>
                      updateDepartmentStatus(
                        dept.id,
                        dept.status === 'available' ? 'closed' : 'available'
                      )
                    }
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      dept.status === 'available'
                        ? 'bg-rose-100 hover:bg-rose-200 text-rose-800'
                        : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                    }`}
                  >
                    {dept.status === 'available' ? 'Deactivate / Close Department' : 'Reactivate / Open Department'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View 6: Appointment Management (Section 14) */}
      {activeTab === 'appointments' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Hospital Appointment Management</h2>
            <p className="text-xs text-slate-500">
              Confirm, reschedule, complete, or cancel patient bookings. Actions immediately synchronize with patient My Visits.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                  <th className="p-3">Appointment ID</th>
                  <th className="p-3">Patient</th>
                  <th className="p-3">Doctor & Dept</th>
                  <th className="p-3">Date & Slot</th>
                  <th className="p-3">Current Status</th>
                  <th className="p-3">Management Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {facAppointments.map((appt) => {
                  const doc = doctors.find((d) => d.id === appt.doctor_id);
                  const dept = departments.find((d) => d.id === appt.department_id);
                  return (
                    <tr key={appt.id} className="hover:bg-slate-50/60">
                      <td className="p-3 font-mono font-bold text-slate-900">{appt.id}</td>
                      <td className="p-3">
                        <strong className="text-slate-900 block">{appt.patient_name}</strong>
                        <span className="text-[10px] text-slate-400">{appt.patient_phone}</span>
                      </td>
                      <td className="p-3 text-slate-700">
                        {doc?.name} ({dept?.name})
                      </td>
                      <td className="p-3 font-semibold text-slate-900">
                        {appt.date} @ {appt.time}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                            appt.status === 'confirmed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : appt.status === 'completed'
                              ? 'bg-slate-100 text-slate-800'
                              : appt.status === 'cancelled'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-teal-100 text-teal-800'
                          }`}
                        >
                          {appt.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1.5">
                          {appt.status !== 'completed' && (
                            <button
                              onClick={() => updateAppointmentStatus(appt.id, 'completed')}
                              className="px-2 py-1 rounded bg-teal-50 hover:bg-teal-100 text-teal-800 font-semibold cursor-pointer"
                            >
                              Mark Completed
                            </button>
                          )}
                          {appt.status !== 'cancelled' && (
                            <button
                              onClick={() => updateAppointmentStatus(appt.id, 'cancelled')}
                              className="px-2 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold cursor-pointer"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View 7: Facility Status Management (Section 16) */}
      {activeTab === 'facility-status' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Hospital Facility Operational Status</h2>
            <p className="text-xs text-slate-500">
              When a facility is marked CLOSED, patients are notified with a banner and appointment/token generation is suspended.
            </p>
          </div>

          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <strong className="text-base text-slate-900 block">{currentFac.name}</strong>
                <span className="text-xs text-slate-500">{currentFac.address}</span>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  currentFac.status === 'open'
                    ? 'bg-emerald-100 text-emerald-800'
                    : currentFac.status === 'busy'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {currentFac.status}
              </span>
            </div>

            <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => updateFacilityStatus(currentFac.id, 'open')}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  currentFac.status === 'open'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-100'
                }`}
              >
                <div className="font-bold text-sm">OPEN (Normal Operation)</div>
                <p className="text-[11px] text-slate-500 mt-1">Accepting walk-in digital tokens and confirmed appointments.</p>
              </button>

              <button
                onClick={() => updateFacilityStatus(currentFac.id, 'busy')}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  currentFac.status === 'busy'
                    ? 'border-amber-600 bg-amber-50 text-amber-900 shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-100'
                }`}
              >
                <div className="font-bold text-sm">BUSY (High Queue Load)</div>
                <p className="text-[11px] text-slate-500 mt-1">Warns patients of extended waiting times across outpatient wings.</p>
              </button>

              <button
                onClick={() => updateFacilityStatus(currentFac.id, 'closed')}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  currentFac.status === 'closed'
                    ? 'border-rose-600 bg-rose-50 text-rose-900 shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-100'
                }`}
              >
                <div className="font-bold text-sm">CLOSED (Temporary)</div>
                <p className="text-[11px] text-slate-500 mt-1">Disables appointment booking and digital token generation.</p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View 8: Patient Feedback (Section 17) */}
      {activeTab === 'feedback' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Verified Patient Feedback Analytics</h2>
            <p className="text-xs text-slate-500">
              Aggregated ratings and themes calculated directly from verified post-visit patient reviews.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
            <div className="p-4 bg-teal-50 rounded-2xl border border-teal-100">
              <span className="text-[11px] text-teal-800 font-semibold block">Overall Rating</span>
              <strong className="text-2xl font-black text-slate-900 mt-1 block">
                {currentFac.rating_summary.overall}
              </strong>
              <span className="text-[10px] text-slate-500">From {currentFac.rating_summary.review_count} entries</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[11px] text-slate-600 font-medium block">Appointment</span>
              <strong className="text-2xl font-black text-slate-900 mt-1 block">
                {currentFac.rating_summary.appointment}
              </strong>
              <span className="text-[10px] text-slate-400">Punctuality</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[11px] text-slate-600 font-medium block">Waiting Time</span>
              <strong className="text-2xl font-black text-slate-900 mt-1 block">
                {currentFac.rating_summary.waiting}
              </strong>
              <span className="text-[10px] text-slate-400">Turnover</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[11px] text-slate-600 font-medium block">Staff Courtesy</span>
              <strong className="text-2xl font-black text-slate-900 mt-1 block">
                {currentFac.rating_summary.staff}
              </strong>
              <span className="text-[10px] text-slate-400">Nursing care</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[11px] text-slate-600 font-medium block">Cleanliness</span>
              <strong className="text-2xl font-black text-slate-900 mt-1 block">
                {currentFac.rating_summary.facility}
              </strong>
              <span className="text-[10px] text-slate-400">Infrastructure</span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-bold text-slate-900">Recent Verified Reviews</h3>
            {facFeedback.map((fb) => (
              <div key={fb.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="flex text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`w-3.5 h-3.5 ${s <= fb.overall_rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                      ))}
                    </div>
                    <span className="font-bold text-slate-900">{fb.overall_rating}.0</span>
                    <span className="text-slate-400">Visit Date: {fb.visit_date}</span>
                  </div>
                  <span className="font-mono text-slate-400 text-[10px]">ID: {fb.visit_id}</span>
                </div>
                {fb.written_feedback && (
                  <p className="text-slate-700 italic">"{fb.written_feedback}"</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View 9: Hospital Settings (Requirement 20) */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8 text-slate-800">
          
          {/* Header & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                  Hospital Admin Settings
                </span>
                <span className="font-mono text-[10px] text-slate-400">ID: {currentFac.id}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                {currentFac.name} Settings
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure facility profile, emergency operations, appointment booking rules, and digital queue parameters.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={handlePreviewAsPatient}
                className="px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
                title="Preview public profile as seen by patients"
              >
                <ExternalLink className="w-4 h-4 text-teal-600" />
                <span>Preview as Patient</span>
              </button>

              <button
                type="button"
                onClick={handleSaveHospitalSettings}
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-teal-600/20 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>

          {/* Saved Notification Banner */}
          {settingsSavedMessage && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center space-x-3 text-emerald-800 text-xs animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="font-bold">{settingsSavedMessage}</span>
            </div>
          )}

          <form onSubmit={handleSaveHospitalSettings} className="space-y-8">
            
            {/* Section A: Hospital Profile */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
                  1. Hospital Profile & Contact Information
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Hospital Name *</label>
                  <input
                    type="text"
                    required
                    value={settingName}
                    onChange={(e) => setSettingName(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-teal-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Physical Street Address *</label>
                  <input
                    type="text"
                    required
                    value={settingAddress}
                    onChange={(e) => setSettingAddress(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-teal-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Official Contact / Hotline Phone *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      required
                      value={settingPhone}
                      onChange={(e) => setSettingPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-teal-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Administrative / Inquiry Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="email"
                      value={settingEmail}
                      onChange={(e) => setSettingEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-teal-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Outpatient Operating Hours</label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      value={settingOpeningHours}
                      onChange={(e) => setSettingOpeningHours(e.target.value)}
                      placeholder="e.g. 24/7 or Mon - Sun: 08:00 AM - 09:00 PM"
                      className="w-full pl-9 pr-3 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-teal-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settingEmergency}
                      onChange={(e) => setSettingEmergency(e.target.checked)}
                      className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                    />
                    <div>
                      <span className="font-bold text-slate-900 block text-xs">24/7 Emergency Trauma Center Active</span>
                      <span className="text-[11px] text-slate-500">Flags hospital for immediate emergency admission on discovery map.</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Section B: Operational Facility Status */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
                  2. Hospital Operational Status
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                Control patient accessibility and warnings across search, booking, and token generation.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                {[
                  {
                    id: 'open',
                    title: 'OPEN',
                    desc: 'Normal outpatient & token operations active.',
                    badge: 'border-emerald-500/50 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500'
                  },
                  {
                    id: 'busy',
                    title: 'BUSY',
                    desc: 'High queue volume warning presented to patients.',
                    badge: 'border-amber-500/50 bg-amber-50 text-amber-900 ring-2 ring-amber-500'
                  },
                  {
                    id: 'emergency',
                    title: 'EMERGENCY ONLY',
                    desc: 'Emergency admissions prioritized; routine walk-ins paused.',
                    badge: 'border-rose-500/50 bg-rose-50 text-rose-900 ring-2 ring-rose-500'
                  },
                  {
                    id: 'closed',
                    title: 'CLOSED',
                    desc: 'Disables slot bookings and digital token generation.',
                    badge: 'border-slate-500/50 bg-slate-100 text-slate-900 ring-2 ring-slate-400'
                  }
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setSettingStatus(st.id as FacilityStatus)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      settingStatus === st.id ? st.badge : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="font-bold text-xs uppercase">{st.title}</div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">{st.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Section C: Appointment Booking Settings */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
                  3. Appointment Scheduling Rules
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Standard Consultation Slot Duration</label>
                  <select
                    value={settingSlotDuration}
                    onChange={(e) => setSettingSlotDuration(Number(e.target.value))}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-teal-500 focus:outline-none"
                  >
                    <option value={15}>15 Minutes (Brief Review)</option>
                    <option value={20}>20 Minutes (Standard Consultation)</option>
                    <option value={30}>30 Minutes (Comprehensive Evaluation)</option>
                    <option value={45}>45 Minutes (Specialty Procedural)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Advance Booking Window</label>
                  <select
                    value={settingAdvanceDays}
                    onChange={(e) => setSettingAdvanceDays(Number(e.target.value))}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-teal-500 focus:outline-none"
                  >
                    <option value={7}>Up to 7 Days in Advance</option>
                    <option value={14}>Up to 14 Days in Advance</option>
                    <option value={30}>Up to 30 Days in Advance</option>
                    <option value={60}>Up to 60 Days in Advance</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settingAutoConfirm}
                      onChange={(e) => setSettingAutoConfirm(e.target.checked)}
                      className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                    />
                    <div>
                      <span className="font-bold text-slate-900 block text-xs">Auto-Confirm Patient Appointments</span>
                      <span className="text-[11px] text-slate-500">Automatically confirm slots without manual admin review.</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Section D: Queue & Digital Token Settings */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <div className="flex items-center space-x-2">
                <Ticket className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
                  4. Queue Management & Digital Token Settings
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Token Serial Prefix</label>
                  <input
                    type="text"
                    maxLength={4}
                    value={settingTokenPrefix}
                    onChange={(e) => setSettingTokenPrefix(e.target.value.toUpperCase())}
                    placeholder="e.g. CC or AP"
                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-teal-500 focus:outline-none font-mono uppercase font-bold"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Generates tokens like {settingTokenPrefix}-014</span>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Max Daily Tokens Per Department</label>
                  <input
                    type="number"
                    min={10}
                    max={500}
                    value={settingMaxDailyTokens}
                    onChange={(e) => setSettingMaxDailyTokens(Number(e.target.value))}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-teal-500 focus:outline-none font-bold"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settingAllowOnlineTokens}
                      onChange={(e) => setSettingAllowOnlineTokens(e.target.checked)}
                      className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                    />
                    <div>
                      <span className="font-bold text-slate-900 block text-xs">Allow Online Token Issuance</span>
                      <span className="text-[11px] text-slate-500">Patients can generate walk-in tokens from home.</span>
                    </div>
                  </label>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settingQueuePaused}
                      onChange={(e) => setSettingQueuePaused(e.target.checked)}
                      className="w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500"
                    />
                    <div>
                      <span className="font-bold text-rose-900 block text-xs">Pause All Department Queues</span>
                      <span className="text-[11px] text-slate-500">Temporarily halt new token issues during staff handover.</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Bar */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Modifications are isolated strictly to <strong className="text-slate-800">{currentFac.name}</strong>.
              </span>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={handlePreviewAsPatient}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold"
                >
                  Preview Patient View
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-600/20 flex items-center space-x-1.5 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Hospital Settings</span>
                </button>
              </div>
            </div>

          </form>
        </div>
      )}

      {/* Add Doctor Modal */}
      {showAddDoctorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl">
            <h3 className="font-bold text-lg text-slate-900">Add New Doctor to Facility</h3>
            <form onSubmit={handleCreateDoctor} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Doctor Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Jennifer Wu"
                  value={newDoctorName}
                  onChange={(e) => setNewDoctorName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Department</label>
                <select
                  value={newDoctorDeptId}
                  onChange={(e) => setNewDoctorDeptId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  {facDepartments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Specialization *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pediatric Neurologist"
                  value={newDoctorSpec}
                  onChange={(e) => setNewDoctorSpec(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Years of Experience</label>
                <input
                  type="number"
                  min={1}
                  value={newDoctorExp}
                  onChange={(e) => setNewDoctorExp(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>
              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddDoctorModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 text-white font-bold"
                >
                  Save Doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Department Modal */}
      {showAddDeptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl">
            <h3 className="font-bold text-lg text-slate-900">Add Clinical Department</h3>
            <form onSubmit={handleCreateDepartment} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Department Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ophthalmology"
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Description</label>
                <input
                  type="text"
                  placeholder="Brief clinical scope..."
                  value={newDeptDesc}
                  onChange={(e) => setNewDeptDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>
              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddDeptModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 text-white font-bold"
                >
                  Create Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
