import React from 'react';
import { Facility } from '../types';
import { useApp } from '../context/AppContext';
import {
  MapPin,
  Clock,
  Phone,
  Users,
  Layers,
  Calendar,
  Ticket,
  ChevronRight,
  ShieldCheck,
  Scale,
  Star,
  CheckCircle2
} from 'lucide-react';

interface FacilityCardProps {
  facility: Facility;
  onBookAppointment?: (facility: Facility) => void;
  onGetToken?: (facility: Facility) => void;
  onViewDetails?: (facility: Facility) => void;
}

export const FacilityCard: React.FC<FacilityCardProps> = ({
  facility,
  onBookAppointment,
  onGetToken,
  onViewDetails
}) => {
  const {
    calculateDistance,
    departments,
    doctors,
    appointmentSlots,
    selectedFacilityIdsForComparison,
    toggleCompareFacility,
    setSelectedFacility,
    setCurrentView,
    setSelectedDepartment
  } = useApp();

  const distance = calculateDistance(facility.latitude, facility.longitude);

  // Departments for this facility
  const facilityDepts = departments.filter((d) => d.facility_id === facility.id);
  const facilityDoctors = doctors.filter((d) => d.facility_id === facility.id);

  // Calculate aggregate queue status
  const totalTokens = facilityDepts.reduce((acc, d) => acc + d.current_token, 0);
  const avgWait = facilityDepts.length > 0
    ? Math.round(facilityDepts.reduce((acc, d) => acc + d.estimated_wait_minutes, 0) / facilityDepts.length)
    : 20;

  // Next available appointment
  const availableSlots = appointmentSlots.filter(
    (s) => s.facility_id === facility.id && !s.is_booked
  );
  const nextSlot = availableSlots.length > 0 ? availableSlots[0] : null;

  const isCompared = selectedFacilityIdsForComparison.includes(facility.id);

  const handleCardClick = () => {
    setSelectedFacility(facility);
    if (onViewDetails) {
      onViewDetails(facility);
    } else {
      setCurrentView('facility-detail');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group">
      
      {/* Top Banner & Image Strip */}
      <div className="relative h-44 w-full overflow-hidden bg-slate-100 cursor-pointer" onClick={handleCardClick}>
        <img
          src={facility.image}
          alt={facility.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent" />

        {/* Status badges */}
        <div className="absolute top-3 left-3 flex items-center space-x-1.5 flex-wrap gap-y-1">
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md ${
              facility.status === 'open'
                ? 'bg-emerald-500/90 text-white'
                : facility.status === 'busy'
                ? 'bg-amber-500/90 text-white'
                : 'bg-slate-700/90 text-white'
            }`}
          >
            {facility.status === 'open' ? 'Open Now' : facility.status === 'busy' ? 'High Volume' : 'Closed'}
          </span>

          {facility.is_emergency && (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-600/95 text-white flex items-center shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              24/7 ER
            </span>
          )}
        </div>

        {/* Distance Badge */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl text-xs font-bold text-slate-800 shadow-sm flex items-center space-x-1">
          <MapPin className="w-3.5 h-3.5 text-teal-600" />
          <span>{distance} km</span>
        </div>

        {/* Name and Rating overlay at bottom of image */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-teal-300">
                {facility.type === 'hospital' ? 'Hospital' : facility.type === 'clinic' ? 'Clinic' : 'Specialty Center'}
              </span>
              <h3 className="font-bold text-lg sm:text-xl text-white leading-tight drop-shadow-sm group-hover:text-teal-200 transition-colors">
                {facility.name}
              </h3>
            </div>
            <div className="bg-slate-900/80 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold flex items-center space-x-1 text-amber-300">
              <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
              <span>{facility.rating_summary.overall}</span>
              <span className="text-[10px] text-slate-300 font-normal">({facility.rating_summary.review_count})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        
        {/* Address and Contact */}
        <div className="space-y-1.5 text-xs text-slate-600">
          <div className="flex items-start space-x-1.5">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span className="line-clamp-1">{facility.address}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Clock className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="line-clamp-1">{facility.opening_hours}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Phone className="w-4 h-4 text-slate-400 shrink-0" />
            <span>{facility.phone}</span>
          </div>
        </div>

        {/* Live Queue & Waiting Info Box */}
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 grid grid-cols-2 gap-2 text-xs">
          <div>
            <div className="text-[11px] text-slate-500 font-medium flex items-center space-x-1">
              <Ticket className="w-3.5 h-3.5 text-teal-600" />
              <span>Queue Status</span>
            </div>
            <p className="font-bold text-slate-900 mt-0.5">
              {facilityDepts.length > 0
                ? `Tokens: ${facilityDepts[0].current_token} | Serving: ${facilityDepts[0].serving_token}`
                : 'Walk-ins Active'}
            </p>
          </div>

          <div>
            <div className="text-[11px] text-slate-500 font-medium flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-teal-600" />
              <span>Est. Waiting</span>
            </div>
            <p className="font-bold text-teal-700 mt-0.5">
              ~{avgWait} mins
            </p>
          </div>
        </div>

        {/* Next Appointment Slot & Doctor Count */}
        <div className="flex items-center justify-between text-xs py-1 border-t border-slate-100">
          <div className="flex items-center space-x-1 text-slate-600">
            <Users className="w-3.5 h-3.5 text-teal-600" />
            <span><strong>{facilityDoctors.length}</strong> Doctors on duty</span>
          </div>
          <div className="flex items-center space-x-1 text-slate-600">
            <Calendar className="w-3.5 h-3.5 text-teal-600" />
            <span>
              Next: <strong className="text-slate-900">{nextSlot ? `${nextSlot.time}` : 'Tomorrow'}</strong>
            </span>
          </div>
        </div>

        {/* Available Departments Tags */}
        <div>
          <div className="text-[11px] font-semibold text-slate-500 mb-1.5 flex items-center space-x-1">
            <Layers className="w-3 h-3 text-slate-400" />
            <span>Key Departments:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {facility.available_departments.slice(0, 4).map((dept) => (
              <span
                key={dept}
                className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-teal-50/80 text-teal-800 border border-teal-100"
              >
                {dept}
              </span>
            ))}
            {facility.available_departments.length > 4 && (
              <span className="px-1.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-600">
                +{facility.available_departments.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Compare Checkbox */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <label className="flex items-center space-x-2 text-xs text-slate-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isCompared}
              onChange={() => toggleCompareFacility(facility.id)}
              className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
            />
            <span className="font-medium text-slate-700">Add to comparison</span>
          </label>
          <span className="text-[11px] text-slate-400">
            Feedback: {facility.rating_summary.staff}/5 Staff
          </span>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 grid grid-cols-3 gap-2">
          <button
            onClick={handleCardClick}
            className="px-2.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer text-center"
          >
            View Details
          </button>

          <button
            onClick={() => {
              setSelectedFacility(facility);
              if (facilityDepts.length > 0) setSelectedDepartment(facilityDepts[0]);
              if (onGetToken) onGetToken(facility);
              else setCurrentView('token-view');
            }}
            className="px-2.5 py-2 rounded-xl text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 transition-colors cursor-pointer text-center flex items-center justify-center space-x-1"
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>Get Token</span>
          </button>

          <button
            onClick={() => {
              setSelectedFacility(facility);
              if (facilityDepts.length > 0) setSelectedDepartment(facilityDepts[0]);
              if (onBookAppointment) onBookAppointment(facility);
              else setCurrentView('book-appointment');
            }}
            className="px-2.5 py-2 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-sm transition-colors cursor-pointer text-center flex items-center justify-center space-x-1"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book</span>
          </button>
        </div>

      </div>
    </div>
  );
};
