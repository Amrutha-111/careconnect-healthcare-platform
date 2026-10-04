import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Facility, Department, Doctor, AppointmentSlot } from '../types';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Building2,
  Layers,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileText,
  AlertCircle
} from 'lucide-react';

export const AppointmentBookingModal: React.FC = () => {
  const {
    facilities,
    departments,
    doctors,
    appointmentSlots,
    selectedFacility,
    setSelectedFacility,
    selectedDepartment,
    setSelectedDepartment,
    selectedDoctor,
    setSelectedDoctor,
    bookAppointment,
    setCurrentView,
    currentUser
  } = useApp();

  // Wizard steps: 1: Facility & Dept, 2: Doctor, 3: Date & Slot, 4: Patient Info
  const [step, setStep] = useState<number>(1);

  // Form State
  const [facilityId, setFacilityId] = useState<string>(selectedFacility?.id || facilities[0]?.id || '');
  const [departmentId, setDepartmentId] = useState<string>(selectedDepartment?.id || '');
  const [doctorId, setDoctorId] = useState<string>(selectedDoctor?.id || '');
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-05');
  const [selectedTime, setSelectedTime] = useState<string>('10:30 AM');

  // Patient inputs
  const [patientName, setPatientName] = useState(currentUser?.name || '');
  const [patientAge, setPatientAge] = useState(32);
  const [patientPhone, setPatientPhone] = useState(currentUser?.phone || '');
  const [patientGender, setPatientGender] = useState('Male');
  const [visitReason, setVisitReason] = useState('General consultation');

  const [formError, setFormError] = useState('');

  // Available departments for the chosen facility
  const availableDepts = departments.filter((d) => d.facility_id === facilityId);

  // Available doctors for the chosen department
  const availableDoctors = doctors.filter((doc) => {
    if (departmentId) {
      return doc.facility_id === facilityId && doc.department_id === departmentId;
    }
    return doc.facility_id === facilityId;
  });

  // Available slots for chosen doctor and date
  const availableDoctorSlots = appointmentSlots.filter(
    (slot) =>
      slot.facility_id === facilityId &&
      (!doctorId || slot.doctor_id === doctorId) &&
      (!departmentId || slot.department_id === departmentId) &&
      !slot.is_booked
  );

  // Auto-select department if facility changes
  useEffect(() => {
    if (availableDepts.length > 0 && (!departmentId || !availableDepts.some((d) => d.id === departmentId))) {
      setDepartmentId(availableDepts[0].id);
    }
  }, [facilityId]);

  // Auto-select doctor
  useEffect(() => {
    if (availableDoctors.length > 0 && (!doctorId || !availableDoctors.some((d) => d.id === doctorId))) {
      setDoctorId(availableDoctors[0].id);
    }
  }, [departmentId, facilityId]);

  // Initial sync from AppContext selections
  useEffect(() => {
    if (selectedFacility) setFacilityId(selectedFacility.id);
    if (selectedDepartment) setDepartmentId(selectedDepartment.id);
    if (selectedDoctor) setDoctorId(selectedDoctor.id);
  }, [selectedFacility, selectedDepartment, selectedDoctor]);

  const handleNextStep = () => {
    setFormError('');
    if (step === 1) {
      if (!facilityId || !departmentId) {
        setFormError('Please select both a facility and a clinical department.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!doctorId) {
        setFormError('Please choose an available doctor for your appointment.');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!selectedDate || !selectedTime) {
        setFormError('Please select an appointment date and time slot.');
        return;
      }
      setStep(4);
    }
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) {
      setFormError('Patient full name is required.');
      return;
    }
    if (!patientPhone.trim()) {
      setFormError('Patient contact phone is required.');
      return;
    }

    const appt = bookAppointment({
      facilityId,
      departmentId,
      doctorId,
      date: selectedDate,
      time: selectedTime,
      patientName,
      patientAge: Number(patientAge) || 30,
      patientPhone,
      patientGender,
      reason: visitReason
    });

    setCurrentView('confirmation');
  };

  const curFacility = facilities.find((f) => f.id === facilityId);
  const curDept = departments.find((d) => d.id === departmentId);
  const curDoctor = doctors.find((d) => d.id === doctorId);

  return (
    <div className="max-w-3xl mx-auto py-4 sm:py-8 space-y-6">
      
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <button
          onClick={() => setCurrentView('facilities')}
          className="text-xs font-semibold text-slate-500 hover:text-teal-600 flex items-center space-x-1 mb-3 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Cancel & Back</span>
        </button>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Book an Appointment
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Reserve an in-person or video consultation slot with verified doctor confirmation.
        </p>

        {/* Step Indicator Progress Bar */}
        <div className="mt-6 grid grid-cols-4 gap-2 text-center text-xs font-bold">
          <div className={`p-2 rounded-xl border ${step >= 1 ? 'bg-teal-50 border-teal-500 text-teal-800' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
            1. Facility & Dept
          </div>
          <div className={`p-2 rounded-xl border ${step >= 2 ? 'bg-teal-50 border-teal-500 text-teal-800' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
            2. Doctor
          </div>
          <div className={`p-2 rounded-xl border ${step >= 3 ? 'bg-teal-50 border-teal-500 text-teal-800' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
            3. Date & Time
          </div>
          <div className={`p-2 rounded-xl border ${step >= 4 ? 'bg-teal-50 border-teal-500 text-teal-800' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
            4. Patient Details
          </div>
        </div>
      </div>

      {formError && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {/* Step 1: Select Facility & Department */}
      {step === 1 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5 animate-in fade-in">
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-teal-600" />
            <span>Step 1: Choose Healthcare Facility & Department</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Select Hospital or Clinic:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {facilities.map((fac) => (
                  <div
                    key={fac.id}
                    onClick={() => {
                      setFacilityId(fac.id);
                      setSelectedFacility(fac);
                    }}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                      facilityId === fac.id
                        ? 'border-teal-600 bg-teal-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-bold text-slate-900 text-sm">{fac.name}</span>
                      {fac.is_emergency && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700">
                          24/7 ER
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">{fac.address}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Select Department:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {availableDepts.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => {
                      setDepartmentId(d.id);
                      setSelectedDepartment(d);
                    }}
                    className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                      departmentId === d.id
                        ? 'border-teal-600 bg-teal-600 text-white shadow-xs'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div>{d.name}</div>
                    <span className={`text-[10px] ${departmentId === d.id ? 'text-teal-100' : 'text-slate-400'}`}>
                      Wait: ~{d.estimated_wait_minutes}m
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={handleNextStep}
              className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-teal-600 hover:bg-teal-700 text-white flex items-center space-x-1.5 shadow-md shadow-teal-600/20 cursor-pointer"
            >
              <span>Continue to Doctor Selection</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Select Doctor */}
      {step === 2 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <User className="w-5 h-5 text-teal-600" />
              <span>Step 2: Choose Specialist Doctor</span>
            </h2>
            <button onClick={() => setStep(1)} className="text-xs text-teal-700 font-semibold hover:underline">
              ← Change Department
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {availableDoctors.length === 0 ? (
              <p className="text-xs text-slate-500 py-6">No specific doctor assigned to this department. You will be scheduled with the duty physician.</p>
            ) : (
              availableDoctors.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => {
                    setDoctorId(doc.id);
                    setSelectedDoctor(doc);
                  }}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start space-x-3.5 ${
                    doctorId === doc.id
                      ? 'border-teal-600 bg-teal-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <img
                    src={doc.avatar}
                    alt={doc.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="font-bold text-slate-900 text-sm truncate block">{doc.name}</span>
                    <span className="text-xs text-teal-700 font-medium block">{doc.specialization}</span>
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      Fee: ${doc.consultation_fee} • Next: {doc.next_available_slot}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Back
            </button>
            <button
              onClick={handleNextStep}
              className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-teal-600 hover:bg-teal-700 text-white flex items-center space-x-1.5 shadow-md shadow-teal-600/20 cursor-pointer"
            >
              <span>Choose Date & Time</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Date & Time Slot */}
      {step === 3 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-teal-600" />
              <span>Step 3: Choose Date & Available Slot</span>
            </h2>
            <button onClick={() => setStep(2)} className="text-xs text-teal-700 font-semibold hover:underline">
              ← Change Doctor
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Select Date:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Today', date: '2026-10-05', desc: 'Mon, Oct 5' },
                  { label: 'Tomorrow', date: '2026-10-06', desc: 'Tue, Oct 6' },
                  { label: 'Wednesday', date: '2026-10-07', desc: 'Wed, Oct 7' }
                ].map((d) => (
                  <button
                    key={d.date}
                    type="button"
                    onClick={() => setSelectedDate(d.date)}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      selectedDate === d.date
                        ? 'border-teal-600 bg-teal-600 text-white font-bold'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="block text-xs font-semibold">{d.label}</span>
                    <span className={`block text-[10px] mt-0.5 ${selectedDate === d.date ? 'text-teal-100' : 'text-slate-400'}`}>
                      {d.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Available Time Slots:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  '10:00 AM',
                  '10:30 AM',
                  '11:00 AM',
                  '11:30 AM',
                  '02:00 PM',
                  '03:15 PM',
                  '04:30 PM'
                ].map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    className={`py-2 px-3 rounded-xl border text-center text-xs font-semibold transition-all cursor-pointer ${
                      selectedTime === time
                        ? 'border-teal-600 bg-teal-50 text-teal-800 ring-2 ring-teal-500'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Back
            </button>
            <button
              onClick={handleNextStep}
              className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-teal-600 hover:bg-teal-700 text-white flex items-center space-x-1.5 shadow-md shadow-teal-600/20 cursor-pointer"
            >
              <span>Enter Patient Information</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Patient Info Form */}
      {step === 4 && (
        <form onSubmit={handleConfirmBooking} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <FileText className="w-5 h-5 text-teal-600" />
              <span>Step 4: Patient Details & Reason for Visit</span>
            </h2>
            <button type="button" onClick={() => setStep(3)} className="text-xs text-teal-700 font-semibold hover:underline">
              ← Change Slot
            </button>
          </div>

          {/* Booking Summary Box */}
          <div className="bg-teal-50/70 border border-teal-200 p-4 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-slate-500 block">Facility:</span>
              <strong className="text-slate-900">{curFacility?.name}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Department:</span>
              <strong className="text-slate-900">{curDept?.name}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Doctor:</span>
              <strong className="text-slate-900">{curDoctor?.name}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Scheduled Time:</span>
              <strong className="text-teal-800">{selectedDate} @ {selectedTime}</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Patient Full Name *
              </label>
              <input
                type="text"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Contact Phone Number *
              </label>
              <input
                type="tel"
                required
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Patient Age
              </label>
              <input
                type="number"
                min={1}
                max={120}
                value={patientAge}
                onChange={(e) => setPatientAge(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Gender
              </label>
              <select
                value={patientGender}
                onChange={(e) => setPatientGender(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other / Prefer not to say</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Reason for Visit (Brief)
            </label>
            <input
              type="text"
              value={visitReason}
              onChange={(e) => setVisitReason(e.target.value)}
              placeholder="e.g. Skin rash examination, heart review, general checkup"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Back
            </button>
            <button
              type="submit"
              className="px-7 py-3 rounded-xl text-xs sm:text-sm font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-600/25 transition-all hover:scale-[1.02] cursor-pointer"
            >
              Confirm Appointment Booking
            </button>
          </div>
        </form>
      )}

    </div>
  );
};
