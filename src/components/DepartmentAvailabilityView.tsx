import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Department, Facility, Doctor } from '../types';
import {
  LayoutGrid,
  Clock,
  Ticket,
  Users,
  Calendar,
  Building2,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Filter
} from 'lucide-react';

export const DepartmentAvailabilityView: React.FC = () => {
  const {
    departments,
    facilities,
    doctors,
    selectedFacility,
    setSelectedDepartment,
    setSelectedFacility,
    setCurrentView,
    setFilters
  } = useApp();

  const [filterDeptName, setFilterDeptName] = useState<string>('All');
  const [filterFacilityId, setFilterFacilityId] = useState<string>(
    selectedFacility?.id || 'All'
  );

  // Sync with selectedFacility if user navigated from a specific hospital card
  useEffect(() => {
    if (selectedFacility) {
      setFilterFacilityId(selectedFacility.id);
    }
  }, [selectedFacility]);

  // Distinct department names
  const standardDepartments = [
    'All',
    'General Medicine',
    'Cardiology',
    'Dermatology',
    'Pediatrics',
    'Orthopedics',
    'ENT',
    'Neurology',
    'Dental'
  ];

  const filteredDepts = departments.filter((dept) => {
    const matchesDept =
      filterDeptName === 'All' || dept.name.toLowerCase() === filterDeptName.toLowerCase();
    const matchesFac =
      filterFacilityId === 'All' || dept.facility_id === filterFacilityId;
    return matchesDept && matchesFac;
  });

  return (
    <div className="space-y-6">
      
      {/* Header & Department / Hospital Filters */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-teal-700 font-bold text-xs uppercase tracking-wider">
              <LayoutGrid className="w-4 h-4" />
              <span>Real-Time Clinical Departments</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Department Availability & Queue Depth
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Check live serving tokens, patient waiting queues, and next available appointment slots before you travel.
            </p>
          </div>

          {/* Hospital Filter Dropdown */}
          <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded-2xl border border-slate-200 self-start lg:self-auto">
            <Building2 className="w-4 h-4 text-teal-600 shrink-0 ml-1" />
            <span className="text-xs font-bold text-slate-700 whitespace-nowrap">Hospital:</span>
            <select
              value={filterFacilityId}
              onChange={(e) => {
                setFilterFacilityId(e.target.value);
                if (e.target.value !== 'All') {
                  const target = facilities.find((f) => f.id === e.target.value);
                  if (target) setSelectedFacility(target);
                }
              }}
              className="bg-white text-xs font-semibold py-1.5 px-3 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-teal-500"
            >
              <option value="All">All Hospitals ({facilities.length})</option>
              {facilities.map((fac) => (
                <option key={fac.id} value={fac.id}>
                  {fac.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Department Filter Pills */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2">
          {standardDepartments.map((name) => (
            <button
              key={name}
              onClick={() => setFilterDeptName(name)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filterDeptName === name
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Department Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDepts.map((dept) => {
          const fac = facilities.find((f) => f.id === dept.facility_id);
          const deptDocs = doctors.filter((doc) => doc.department_id === dept.id);
          const nextSlot = deptDocs.length > 0 ? deptDocs[0].next_available_slot : 'Today, 11:30 AM';

          return (
            <div
              key={dept.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-lg transition-all duration-200 p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">
                      Department
                    </span>
                    <h3 className="text-xl font-bold text-slate-900">{dept.name}</h3>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      dept.status === 'available'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {dept.status === 'available' ? 'Available' : 'Busy'}
                  </span>
                </div>

                <div className="mt-2 text-xs text-slate-500 flex items-center space-x-1">
                  <Building2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <strong className="text-slate-700 font-semibold">{fac?.name || 'Healthcare Facility'}</strong>
                </div>

                <p className="text-xs text-slate-600 mt-2.5 line-clamp-2">
                  {dept.description}
                </p>

                {/* Queue & Availability Stat Box */}
                <div className="mt-4 bg-slate-50 border border-slate-100 rounded-xl p-3.5 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center space-x-1">
                      <Ticket className="w-3.5 h-3.5 text-teal-600" />
                      <span>Currently Serving:</span>
                    </span>
                    <strong className="text-slate-900">Token #{dept.serving_token}</strong>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Your Position If Token Taken:</span>
                    <strong className="text-slate-900">#{dept.current_token + 1}</strong>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Tokens Remaining Today:</span>
                    <span className="font-semibold text-emerald-700">{dept.tokens_remaining} tokens</span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                    <span className="text-slate-500 flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-teal-600" />
                      <span>Est. Waiting Time:</span>
                    </span>
                    <strong className="text-teal-700">~{dept.estimated_wait_minutes} minutes</strong>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-teal-600" />
                      <span>Next Appointment:</span>
                    </span>
                    <strong className="text-slate-900">{nextSlot}</strong>
                  </div>
                </div>

                {/* Doctor roster summary */}
                <div className="mt-3 text-xs text-slate-500 flex items-center justify-between">
                  <span>Available Doctors:</span>
                  <span className="font-semibold text-slate-800">{deptDocs.length} Specialists</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setSelectedDepartment(dept);
                    if (fac) setSelectedFacility(fac);
                    setCurrentView('token-view');
                  }}
                  className="py-2 rounded-xl text-xs font-semibold bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 transition-colors cursor-pointer text-center"
                >
                  Get Token
                </button>
                <button
                  onClick={() => {
                    setSelectedDepartment(dept);
                    if (fac) setSelectedFacility(fac);
                    setCurrentView('book-appointment');
                  }}
                  className="py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition-colors cursor-pointer text-center"
                >
                  Book Slot
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
