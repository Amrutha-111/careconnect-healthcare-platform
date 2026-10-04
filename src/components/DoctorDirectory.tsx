import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Doctor, Facility } from '../types';
import {
  Users,
  Search,
  Filter,
  Calendar,
  Clock,
  Building2,
  Video,
  UserCheck,
  Star,
  MapPin,
  CheckCircle2,
  ChevronRight,
  AlertCircle,
  XCircle
} from 'lucide-react';

interface Props {
  onSelectDoctor?: (doc: Doctor) => void;
}

export const DoctorDirectory: React.FC<Props> = ({ onSelectDoctor }) => {
  const {
    doctors,
    facilities,
    departments,
    selectedFacility,
    setSelectedFacility,
    selectHospital,
    setSelectedDoctor,
    setSelectedDepartment,
    setCurrentView
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All');
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>(
    selectedFacility?.id || 'All'
  );
  const [selectedMode, setSelectedMode] = useState<'all' | 'in_person' | 'video'>('all');
  const [activeModalDoctor, setActiveModalDoctor] = useState<Doctor | null>(null);

  // Sync with selectedFacility from context
  useEffect(() => {
    if (selectedFacility) {
      setSelectedFacilityId(selectedFacility.id);
    }
  }, [selectedFacility]);

  // Extract distinct specializations
  const specializations = useMemo(() => {
    const set = new Set<string>();
    doctors.forEach((d) => set.add(d.specialization));
    return ['All', ...Array.from(set)];
  }, [doctors]);

  // Filtered doctors
  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const matchesSearch =
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.specialization.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSpec =
        selectedSpecialization === 'All' || doc.specialization === selectedSpecialization;

      const matchesFacility =
        selectedFacilityId === 'All' || doc.facility_id === selectedFacilityId;

      const matchesMode =
        selectedMode === 'all' ||
        doc.consultation_mode === 'both' ||
        doc.consultation_mode === selectedMode;

      return matchesSearch && matchesSpec && matchesFacility && matchesMode;
    });
  }, [doctors, searchTerm, selectedSpecialization, selectedFacilityId, selectedMode]);

  const handleBook = (doc: Doctor) => {
    if (doc.status !== 'available') return;
    setSelectedDoctor(doc);
    const fac = facilities.find((f) => f.id === doc.facility_id);
    const dept = departments.find((d) => d.id === doc.department_id);
    if (fac) setSelectedFacility(fac);
    if (dept) setSelectedDepartment(dept);
    setCurrentView('book-appointment');
  };

  const currentHospital = facilities.find((f) => f.id === selectedFacilityId);

  return (
    <div className="space-y-6">
      
      {/* Title & Search Filter Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-teal-700 font-bold text-xs uppercase tracking-wider">
              <Users className="w-4 h-4" />
              <span>Verified Medical Specialists</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Find Doctors & Specialists
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Browse licensed physicians across hospitals with real-time doctor availability and schedule slots.
            </p>
          </div>

          <div className="text-xs text-slate-500 font-semibold bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 self-start md:self-auto">
            Showing <strong>{filteredDoctors.length}</strong> Doctors
          </div>
        </div>

        {/* Multi-Hospital Selector Quick Bar (Requirement 7, TEST 2, TEST 3) */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
              <Building2 className="w-3.5 h-3.5 text-teal-600" />
              <span>Select Hospital:</span>
            </span>
            {selectedFacilityId !== 'All' && (
              <button
                onClick={() => setSelectedFacilityId('All')}
                className="text-xs font-semibold text-teal-700 hover:underline cursor-pointer"
              >
                View All Hospitals
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedFacilityId('All')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedFacilityId === 'All'
                  ? 'bg-slate-900 text-white font-bold shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Hospitals ({doctors.length})
            </button>

            {facilities.slice(0, 5).map((fac) => {
              const count = doctors.filter((d) => d.facility_id === fac.id).length;
              const isSelected = selectedFacilityId === fac.id;
              return (
                <button
                  key={fac.id}
                  onClick={() => {
                    setSelectedFacilityId(fac.id);
                    selectHospital(fac.id);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5 ${
                    isSelected
                      ? 'bg-teal-600 text-white font-bold shadow-md shadow-teal-600/20'
                      : 'bg-teal-50/70 border border-teal-200 text-teal-900 hover:bg-teal-100'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{fac.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-teal-800 text-white' : 'bg-teal-200/80 text-teal-900'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search Input & Secondary Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {/* Text Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search doctor or specialty..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Specialization Filter */}
          <select
            value={selectedSpecialization}
            onChange={(e) => setSelectedSpecialization(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
          >
            <option value="All">All Specializations</option>
            {specializations.filter((s) => s !== 'All').map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>

          {/* Hospital Dropdown */}
          <select
            value={selectedFacilityId}
            onChange={(e) => {
              setSelectedFacilityId(e.target.value);
              if (e.target.value !== 'All') selectHospital(e.target.value);
            }}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white font-medium"
          >
            <option value="All">All Hospitals & Clinics</option>
            {facilities.map((fac) => (
              <option key={fac.id} value={fac.id}>
                {fac.name}
              </option>
            ))}
          </select>

          {/* Consultation Mode */}
          <select
            value={selectedMode}
            onChange={(e) => setSelectedMode(e.target.value as any)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
          >
            <option value="all">All Consultation Modes</option>
            <option value="in_person">In-Person Only</option>
            <option value="video">Tele-consultation / Video</option>
          </select>
        </div>
      </div>

      {/* Hospital Active Scope Header */}
      {currentHospital && selectedFacilityId !== 'All' && (
        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-2xl p-4 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-teal-700 shrink-0" />
            <div>
              <span className="text-[10px] text-teal-800 uppercase font-bold tracking-wider">Filtered By Hospital</span>
              <h3 className="font-extrabold text-sm text-slate-900">{currentHospital.name}</h3>
            </div>
          </div>
          <span className="text-slate-600 font-medium">
            Showing only doctors practicing at {currentHospital.name}
          </span>
        </div>
      )}

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-400">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-slate-600">No doctors found matching your criteria.</p>
            <p className="text-xs text-slate-400 mt-1">Try selecting another hospital or resetting the filters.</p>
          </div>
        ) : (
          filteredDoctors.map((doc) => {
            const fac = facilities.find((f) => f.id === doc.facility_id);
            const dept = departments.find((d) => d.id === doc.department_id);
            const isUnavailable = doc.status === 'unavailable';

            return (
              <div
                key={doc.id}
                className={`bg-white rounded-2xl border shadow-xs hover:shadow-lg transition-all duration-200 p-5 flex flex-col justify-between ${
                  isUnavailable ? 'border-rose-200 bg-rose-50/20' : 'border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-start space-x-3.5">
                    <img
                      src={doc.avatar}
                      alt={doc.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-100 shrink-0"
                      loading="lazy"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md truncate">
                          {dept?.name || 'Department'}
                        </span>
                        {/* Doctor Availability Badge (Requirement 13 & TEST 5) */}
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase shrink-0 ${
                            doc.status === 'available'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800 border border-rose-200'
                          }`}
                        >
                          {doc.status === 'available' ? 'Available' : 'Doctor unavailable'}
                        </span>
                      </div>
                      <h3 className="font-bold text-base text-slate-900 truncate">{doc.name}</h3>
                      <p className="text-xs text-slate-600 line-clamp-1">{doc.specialization}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{doc.qualifications}</p>
                    </div>
                  </div>

                  {/* Facility Affiliation */}
                  <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center space-x-1.5">
                      <Building2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span className="line-clamp-1 font-semibold text-slate-900">{fac?.name}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{doc.experience_years} years clinical experience</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="line-clamp-1">Days: {doc.available_days.slice(0, 3).join(', ')}</span>
                    </div>
                  </div>

                  {/* Next Slot or Unavailable Notice */}
                  {isUnavailable ? (
                    <div className="mt-3 bg-rose-50 border border-rose-200 rounded-xl p-2.5 flex items-center space-x-2 text-xs text-rose-800">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span className="font-bold">Doctor currently off-duty / unavailable</span>
                    </div>
                  ) : (
                    <div className="mt-3 bg-teal-50/60 border border-teal-100/80 rounded-xl p-2.5 flex items-center justify-between text-xs">
                      <span className="text-slate-600">Next Slot:</span>
                      <span className="font-bold text-teal-800">{doc.next_available_slot}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-4 mt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setActiveModalDoctor(doc)}
                    className="py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer text-center"
                  >
                    View Profile
                  </button>
                  <button
                    disabled={isUnavailable}
                    onClick={() => handleBook(doc)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all text-center ${
                      isUnavailable
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-teal-600 hover:bg-teal-700 text-white shadow-xs cursor-pointer'
                    }`}
                  >
                    {isUnavailable ? 'Unavailable' : 'Book Slot'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Doctor Profile Modal */}
      {activeModalDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative">
            <button
              onClick={() => setActiveModalDoctor(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center space-x-4">
              <img
                src={activeModalDoctor.avatar}
                alt={activeModalDoctor.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-teal-200 shrink-0"
              />
              <div>
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-teal-50 text-teal-800">
                  {activeModalDoctor.specialization}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">{activeModalDoctor.name}</h3>
                <p className="text-xs text-slate-500">{activeModalDoctor.qualifications}</p>
                <p className="text-xs text-teal-700 font-semibold mt-1">
                  {activeModalDoctor.experience_years} Years Experience
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3 text-xs text-slate-600">
              <div>
                <strong className="text-slate-900 block mb-1">Biography & Clinical Focus:</strong>
                <p className="leading-relaxed">{activeModalDoctor.bio}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <span>Practicing At:</span>
                <strong className="text-slate-900">
                  {facilities.find((f) => f.id === activeModalDoctor.facility_id)?.name}
                </strong>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <span>Consultation Fee:</span>
                <strong className="text-teal-800 font-bold">${activeModalDoctor.consultation_fee}</strong>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <span>Duty Status:</span>
                <span
                  className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                    activeModalDoctor.status === 'available'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {activeModalDoctor.status === 'available' ? 'Available' : 'Doctor unavailable'}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end space-x-2">
              <button
                onClick={() => setActiveModalDoctor(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
              <button
                disabled={activeModalDoctor.status !== 'available'}
                onClick={() => {
                  const doc = activeModalDoctor;
                  setActiveModalDoctor(null);
                  handleBook(doc);
                }}
                className={`px-5 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                  activeModalDoctor.status !== 'available'
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-teal-600 hover:bg-teal-700 text-white shadow-md'
                }`}
              >
                {activeModalDoctor.status !== 'available' ? 'Doctor Unavailable' : 'Book Appointment'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
